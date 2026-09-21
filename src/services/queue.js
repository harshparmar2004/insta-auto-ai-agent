const { sendPrivateReply, replyToComment, sendDirectMessage } = require('./instagram');
const { getDb, getConfig, checkAndIncrementUserQuota } = require('../database');

const queue = [];
let isProcessing = false;
let currentInterval = 1000; // Baseline spacing
let timerId = null;

function enqueue(job) {
    if (!job.processAt) {
        job.processAt = Date.now();
    }
    queue.push(job);
    if (!isProcessing) {
        startProcessing();
    }
}

function getQueueDepth() {
    return queue.length;
}

function startProcessing() {
    if (isProcessing) return;
    isProcessing = true;
    processNext();
}

async function processNext() {
    if (queue.length === 0) {
        isProcessing = false;
        return;
    }

    const now = Date.now();
    const readyIdx = queue.findIndex(j => j.processAt <= now);
    
    if (readyIdx === -1) {
        timerId = setTimeout(processNext, 500);
        return;
    }

    const [job] = queue.splice(readyIdx, 1);
    const token = job.accessToken || getConfig('access_token');
    const userId = job.userId || null;

    // 0. Pre-Flight Rate Limit & Quota Check (Super Admin vs Regular Users)
    const quotaCheck = checkAndIncrementUserQuota(userId);
    if (!quotaCheck.allowed) {
        console.warn(`[Queue] ⚠️ Rate limit / Quota exceeded for user ${userId}: ${quotaCheck.message}`);
        if (job.eventId) {
            getDb().prepare("UPDATE events SET dm_status = 'quota_exceeded' WHERE id = ?").run(job.eventId);
        }
        timerId = setTimeout(processNext, 500);
        return;
    }

    // Apply safe humanized delay based on user/admin quota settings (e.g. 1.5s for users, 0.5s for super admin)
    currentInterval = Math.max(500, Math.round((quotaCheck.delay_seconds || 1.5) * 1000));

    try {
        let result;
        if (job.type === 'private_reply') {
            // 1. Post public comment reply on the post (if configured)
            if (job.publicReply) {
                try {
                    await replyToComment(token, job.commentId, job.publicReply);
                } catch(pe) {
                    console.warn(`[Queue] Public reply notice for event ${job.eventId}:`, pe.message);
                }
            }

            // 2. Dispatch real Instagram Direct Message (Private Reply)
            const payload = job.messagePayload || job.messageText;
            result = await sendPrivateReply(token, job.commentId, job.commenterId, payload);
        } else if (job.type === 'direct_message') {
            const payload = job.messagePayload || job.messageText;
            result = await sendDirectMessage(token, job.recipientId, payload);
        }

        if (job.eventId) {
            getDb().prepare("UPDATE events SET dm_status = 'delivered', dm_message_id = ? WHERE id = ?")
                .run(result?.id || result?.message_id || 'msg_' + Date.now(), job.eventId);
        }

        currentInterval = 1000;
        console.log(`[Queue] ✅ Successfully dispatched DM for event ${job.eventId}`);
    } catch (err) {
        console.error(`[Queue] ❌ Failed to dispatch DM for event ${job.eventId}:`, err.message);
        
        if (job.eventId) {
            getDb().prepare("UPDATE events SET dm_status = 'failed' WHERE id = ?")
                .run(job.eventId);
        }

        if (err.response && err.response.status === 429) {
            console.warn('[Queue] Meta Rate limit hit. Backing off...');
            currentInterval = Math.min(currentInterval * 2, 60000);
        }
    }

    timerId = setTimeout(processNext, currentInterval);
}

module.exports = {
    enqueue,
    getQueueDepth
};
