/**
 * Instagram Autonomous AI Agent Route
 * Handles 1-Click Research -> Lead Magnet -> Reel Publishing -> Rule Provisioning
 */

const express = require('express');
const router = express.Router();
const { getDb, saveAgentCampaign, getAgentCampaigns } = require('../database');
const { conductResearch } = require('../services/researchAgent');
const { generateLeadMagnet } = require('../services/leadMagnetGenerator');
const { publishReel } = require('../services/instagramPublisher');
const { processCommentEvent } = require('../services/automation');

// 1. Full 1-Click Autonomous Campaign Runner
router.post('/run', async (req, res) => {
    try {
        const { topic, video_url, simulate = false } = req.body || {};
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        console.log('\n======================================================');
        console.log('[Agent] 🚀 Starting 1-Click Autonomous Growth Campaign');
        console.log('======================================================');

        // Step 1: Research & Scripting
        const research = await conductResearch(topic);

        // Step 2: Generate Companion Lead Magnet Doc & Link
        const leadMagnet = await generateLeadMagnet(research, baseUrl);

        // Step 3: Publish Reel to Instagram (Live or Simulation)
        const publishResult = await publishReel({
            videoUrl: video_url || null,
            caption: research.caption,
            simulate: simulate === true || simulate === 'true'
        });

        // Step 4: Provision InstaAuto DM Automation Rule (Zero Clicks Required)
        const db = getDb();
        const buttonConfig = {
            step1_button: "Send me the access",
            step2_text: "Almost there !\\nPlease visit my profile and tap follow to continue 😄",
            step2_profile_button: "Visit Profile",
            step2_confirm_button: "I'm following ✅",
            step3_button: "Open Resource Pass 📄"
        };

        // Ensure media entry exists so foreign keys and analytics link cleanly
        let resolvedMediaId = null;
        if (publishResult.mediaId) {
            try {
                db.prepare("INSERT INTO media (ig_media_id, caption, synced_at) VALUES (?, 'Instagram Reel', ?) ON CONFLICT(ig_media_id) DO NOTHING").run(publishResult.mediaId, new Date().toISOString());
                const mNew = db.prepare("SELECT id FROM media WHERE ig_media_id = ?").get(publishResult.mediaId);
                resolvedMediaId = mNew ? mNew.id : null;
            } catch(e) {}
        }

        const now = new Date().toISOString();
        const insertStmt = db.prepare(`
            INSERT INTO rules (
                media_id,
                trigger_keyword,
                action_type,
                response_text,
                link_url,
                public_reply,
                is_active,
                buttons_config_json,
                created_at,
                updated_at
            ) VALUES (?, ?, 'follow_first', ?, ?, ?, 1, ?, ?, ?)
        `);

        const ruleResult = insertStmt.run(
            resolvedMediaId,
            research.keyword.toUpperCase().trim(),
            'Hey! Here is your personal access pass to the ' + research.lead_magnet_title + '! Tap the button below to open:',
            leadMagnet.deliverableUrl,
            'Sent you a DM with the access link! Check your message requests 🙌',
            JSON.stringify(buttonConfig),
            now,
            now
        );

        const ruleId = ruleResult.lastInsertRowid;

        // Step 5: Save in agent_campaigns table for permanent tracking
        const campaignId = saveAgentCampaign({
            topic: research.topic,
            keyword: research.keyword,
            leadMagnetTitle: research.lead_magnet_title,
            deliverableUrl: leadMagnet.deliverableUrl,
            mediaId: publishResult.mediaId,
            ruleId: ruleId,
            caption: research.caption
        });

        console.log('[Agent] 🎯 Auto-provisioned Rule #' + ruleId + ' for Reel ' + publishResult.mediaId + '!');
        console.log('[Agent] 🔗 Deliverable bound: ' + leadMagnet.deliverableUrl);
        console.log('[Agent] 💬 Trigger keyword: ' + research.keyword);
        console.log('======================================================\n');

        res.json({
            success: true,
            message: '1-Click Autonomous Campaign Live! Keyword "' + research.keyword + '" is now armed on Reel ' + publishResult.mediaId + '.',
            campaign: {
                id: campaignId,
                ruleId: ruleId,
                mediaId: publishResult.mediaId,
                keyword: research.keyword,
                topic: research.topic,
                leadMagnetTitle: research.lead_magnet_title,
                deliverableUrl: leadMagnet.deliverableUrl,
                caption: research.caption,
                live: publishResult.live || false,
                warning: publishResult.warning || null
            }
        });
    } catch (err) {
        console.error('[Agent Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Get All Autonomous Campaigns
router.get('/campaigns', (req, res) => {
    try {
        const campaigns = getAgentCampaigns();
        res.json({
            success: true,
            count: campaigns.length,
            campaigns
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Test Comment Simulator for Autonomous Campaigns
router.post('/simulate-comment', async (req, res) => {
    try {
        const { media_id, keyword, username } = req.body || {};
        if (!media_id || !keyword) {
            return res.status(400).json({ error: "media_id and keyword are required" });
        }

        const fakeCommentId = 'sim_agent_' + Date.now();
        const commenterHandle = username || 'test_fan_' + Math.floor(Math.random() * 1000);
        const payload = {
            object: 'instagram',
            entry: [{
                id: '17841400000000000',
                time: Math.floor(Date.now() / 1000),
                changes: [{
                    field: 'comments',
                    value: {
                        from: {
                            id: 'sim_user_' + Math.floor(Math.random() * 1000000),
                            username: commenterHandle
                        },
                        media: {
                            id: media_id
                        },
                        id: fakeCommentId,
                        text: keyword
                    }
                }]
            }]
        };

        await processCommentEvent(payload);

        res.json({
            success: true,
            message: `Simulated comment "${keyword}" from @${commenterHandle} on Reel ${media_id}. Follow-First DM funnel triggered!`,
            commentId: fakeCommentId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Direct Handoff Endpoint (For External Agents)
router.post('/provision', async (req, res) => {
    try {
        const { media_id, trigger_keyword, deliverable_url, lead_magnet_title, funnel_type } = req.body || {};

        if (!media_id || !trigger_keyword || !deliverable_url) {
            return res.status(400).json({ error: "media_id, trigger_keyword, and deliverable_url are required" });
        }

        const db = getDb();
        const buttonConfig = {
            step1_button: "Send me the access",
            step2_text: "Almost there !\\nPlease visit my profile and tap follow to continue 😄",
            step2_profile_button: "Visit Profile",
            step2_confirm_button: "I'm following ✅",
            step3_button: "Open Deliverable 📄"
        };

        let resolvedMediaId = null;
        if (media_id) {
            try {
                db.prepare("INSERT INTO media (ig_media_id, caption, synced_at) VALUES (?, 'Instagram Content', ?) ON CONFLICT(ig_media_id) DO NOTHING").run(media_id, new Date().toISOString());
                const mNew = db.prepare("SELECT id FROM media WHERE ig_media_id = ?").get(media_id);
                resolvedMediaId = mNew ? mNew.id : null;
            } catch(e) {}
        }

        const now = new Date().toISOString();
        const insertStmt = db.prepare(`
            INSERT INTO rules (
                media_id,
                trigger_keyword,
                action_type,
                response_text,
                link_url,
                public_reply,
                is_active,
                buttons_config_json,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
        `);

        const result = insertStmt.run(
            resolvedMediaId,
            trigger_keyword.toUpperCase().trim(),
            funnel_type || 'follow_first',
            'Hey! Here is your access link for ' + (lead_magnet_title || trigger_keyword) + ':',
            deliverable_url.trim(),
            'Sent you a DM! Check your inbox 📬',
            JSON.stringify(buttonConfig),
            now,
            now
        );

        res.json({
            success: true,
            rule_id: result.lastInsertRowid,
            media_id,
            trigger_keyword: trigger_keyword.toUpperCase().trim(),
            deliverable_url,
            message: "Automation rule successfully provisioned by AI Agent"
        });
    } catch (err) {
        console.error('[Agent Provision Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Status Endpoint
router.get('/status', (req, res) => {
    res.json({
        engine: 'InstaAuto AI Agent',
        version: '1.0.0',
        active: true,
        capabilities: [
            'autonomous_research',
            'lead_magnet_generation',
            'reel_publishing',
            'follow_first_funnel_provisioning',
            'live_comment_simulation'
        ]
    });
});

module.exports = router;
