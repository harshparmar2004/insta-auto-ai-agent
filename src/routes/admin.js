const express = require('express');
const auth = require('../middleware/auth');
const {
    getAllUsers,
    updateUserStatus,
    deleteUser,
    getAdminMetrics,
    getUserById,
    getUserInstagramAccount,
    getDb,
    getUserQuota,
    updateUserQuota
} = require('../database');

const router = express.Router();

// Enforce auth & superAdminOnly on all admin endpoints
router.use(auth);
router.use(auth.superAdminOnly);

// GET /api/admin/metrics
router.get('/metrics', (req, res) => {
    try {
        const metrics = getAdminMetrics();
        res.json({ success: true, metrics });
    } catch (err) {
        console.error('[Admin Metrics Error]:', err);
        res.status(500).json({ error: 'Failed to load system metrics' });
    }
});

// GET /api/admin/users
router.get('/users', (req, res) => {
    try {
        const search = req.query.search || '';
        const users = getAllUsers(search);
        res.json({ success: true, users, count: users.length });
    } catch (err) {
        console.error('[Admin Users Error]:', err);
        res.status(500).json({ error: 'Failed to load user directory' });
    }
});

// POST /api/admin/users/:id/status
router.post('/users/:id/status', (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { status } = req.body || {};

        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({ error: 'Status must be active or suspended' });
        }

        const user = getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'super_admin') {
            return res.status(400).json({ error: 'Cannot change status of a Super Admin' });
        }

        updateUserStatus(userId, status);
        res.json({ success: true, message: `User status changed to ${status}` });
    } catch (err) {
        console.error('[Admin Status Error]:', err);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'super_admin') {
            return res.status(400).json({ error: 'Cannot delete a Super Admin' });
        }

        deleteUser(userId);
        res.json({ success: true, message: `User ${user.email} and all associated data deleted` });
    } catch (err) {
        console.error('[Admin Delete Error]:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// GET /api/admin/token-alerts
router.get('/token-alerts', (req, res) => {
    try {
        const db = getDb();
        const tenDaysFromNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
        const alerts = db.prepare(`
            SELECT a.id, a.user_id, a.ig_username, a.token_expires_at, u.name, u.email
            FROM instagram_accounts a
            JOIN users u ON a.user_id = u.id
            WHERE a.is_active = 1 AND a.token_expires_at <= ?
            ORDER BY a.token_expires_at ASC
        `).all(tenDaysFromNow);

        res.json({ success: true, alerts });
    } catch (err) {
        console.error('[Admin Token Alerts Error]:', err);
        res.status(500).json({ error: 'Failed to fetch token alerts' });
    }
});

// GET /api/admin/users/:id/quota - Inspect user quota and plan details
router.get('/users/:id/quota', (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const quota = getUserQuota(userId);
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, quota });
    } catch (err) {
        console.error('[Admin Get Quota Error]:', err);
        res.status(500).json({ error: 'Failed to load user quota' });
    }
});

// POST /api/admin/users/:id/quota - Super Admin updating user's rate limits
router.post('/users/:id/quota', (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const {
            is_unlimited,
            hourly_limit,
            monthly_limit,
            plan_tier,
            custom_delay_seconds
        } = req.body || {};

        const updatedQuota = updateUserQuota(userId, {
            is_unlimited: is_unlimited !== undefined ? (is_unlimited ? 1 : 0) : undefined,
            hourly_limit: hourly_limit !== undefined ? Number(hourly_limit) : undefined,
            monthly_limit: monthly_limit !== undefined ? Number(monthly_limit) : undefined,
            plan_tier: plan_tier || undefined,
            custom_delay_seconds: custom_delay_seconds !== undefined ? Number(custom_delay_seconds) : undefined,
            updated_by_admin: 1
        });

        const limitDesc = updatedQuota.is_unlimited ? 'Unlimited' : `${updatedQuota.hourly_limit}/hr`;
        res.json({
            success: true,
            message: `Rate limit updated for ${user.email} (${limitDesc})`,
            quota: updatedQuota
        });
    } catch (err) {
        console.error('[Admin Update Quota Error]:', err);
        res.status(500).json({ error: 'Failed to update user quota: ' + err.message });
    }
});

// GET /api/admin/my-quota - Super Admin inspecting personal rate limit
router.get('/my-quota', (req, res) => {
    try {
        const superAdminId = req.user.id;
        const quota = getUserQuota(superAdminId);
        res.json({ success: true, quota });
    } catch (err) {
        console.error('[Admin Get Self Quota Error]:', err);
        res.status(500).json({ error: 'Failed to load Super Admin quota' });
    }
});

// POST /api/admin/my-quota - Super Admin configuring personal rate limit
router.post('/my-quota', (req, res) => {
    try {
        const superAdminId = req.user.id;
        const {
            is_unlimited,
            hourly_limit,
            monthly_limit,
            custom_delay_seconds
        } = req.body || {};

        const updatedQuota = updateUserQuota(superAdminId, {
            is_unlimited: is_unlimited !== undefined ? (is_unlimited ? 1 : 0) : 1,
            hourly_limit: hourly_limit !== undefined ? Number(hourly_limit) : -1,
            monthly_limit: monthly_limit !== undefined ? Number(monthly_limit) : -1,
            plan_tier: 'super_admin',
            custom_delay_seconds: custom_delay_seconds !== undefined ? Number(custom_delay_seconds) : 0.5,
            updated_by_admin: 1
        });

        res.json({
            success: true,
            message: `Super Admin personal rate limit updated!`,
            quota: updatedQuota
        });
    } catch (err) {
        console.error('[Admin Self Quota Error]:', err);
        res.status(500).json({ error: 'Failed to update Super Admin quota' });
    }
});

module.exports = router;
