/**
 * Instagram Autonomous Sentinel & External Agent Bridge Routes
 * Connects external content creation platforms to InstaAuto:
 * - Single & Batch Inbound Webhook Bridge (/api/agent/bridge & /api/agent/bridge/batch)
 * - Google Sheets Deliverables Auto-Sync (/api/agent/sync-sheet)
 * - Autonomous Feed Auto-Detect Sentinel (/api/agent/scan-feed)
 * - Background Auto-Pilot State Management (/api/agent/auto-pilot/toggle)
 * - Live Follower Comment Simulation & DM Gates
 */

const express = require('express');
const router = express.Router();
const { getDb, getAgentCampaigns, getConfig, setConfig } = require('../database');
const { processExternalPost, processBatchExternalPosts, syncFromGoogleSheet, scanAndArmFeed } = require('../services/postSentinel');
const { processCommentEvent } = require('../services/automation');

// 1. Inbound Webhook Bridge (Single Post from External Platform)
router.post('/bridge', async (req, res) => {
    try {
        const { media_id, caption, deliverable_url, trigger_keyword, lead_magnet_title, secret } = req.body || {};

        if (!media_id) {
            return res.status(400).json({
                error: 'media_id is required from external posting platform'
            });
        }

        console.log('\n======================================================');
        console.log('[Agent Bridge] 📡 Received Post Notification from External Platform');
        console.log(`[Agent Bridge] Media ID: ${media_id}`);
        console.log('======================================================');

        const result = await processExternalPost({
            media_id,
            caption: caption || '',
            deliverable_url: deliverable_url || null,
            trigger_keyword: trigger_keyword || null,
            lead_magnet_title: lead_magnet_title || null,
            source: 'external_bridge'
        });

        res.json({
            success: true,
            message: `Post ${media_id} armed with keyword "${result.keyword}"!`,
            post: result
        });
    } catch (err) {
        console.error('[Agent Bridge Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. High-Throughput Batch Inbound Bridge (For 10, 50, 100+ Reels at Once)
router.post('/bridge/batch', async (req, res) => {
    try {
        const { posts } = req.body || {};

        if (!Array.isArray(posts) || posts.length === 0) {
            return res.status(400).json({
                error: 'posts must be a non-empty array of objects ({ media_id, caption, deliverable_url, trigger_keyword })'
            });
        }

        console.log(`[Agent Bridge Batch] 📦 Ingesting batch of ${posts.length} posts from external platform...`);
        const batchResult = await processBatchExternalPosts(posts, 'external_bridge_batch');

        res.json({
            success: true,
            message: `Successfully processed batch: ${batchResult.armedCount}/${batchResult.total} posts armed with unique Follow-First funnels!`,
            total: batchResult.total,
            armedCount: batchResult.armedCount,
            results: batchResult.results
        });
    } catch (err) {
        console.error('[Agent Bridge Batch Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// 3. Google Sheets Deliverables Sync Endpoint
router.post('/sync-sheet', async (req, res) => {
    try {
        const { sheet_url } = req.body || {};
        const syncResult = await syncFromGoogleSheet(sheet_url || null);

        res.json({
            success: true,
            message: `Google Sheet sync complete! Armed ${syncResult.armedCount || 0} reels with their companion doc links.`,
            details: syncResult
        });
    } catch (err) {
        console.error('[Google Sheet Sync Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Background Auto-Pilot State Management
router.post('/auto-pilot/toggle', (req, res) => {
    try {
        const current = getConfig('agent_auto_pilot') || '0';
        const nextState = current === '1' ? '0' : '1';
        setConfig('agent_auto_pilot', nextState);

        res.json({
            success: true,
            autoPilot: nextState === '1',
            message: nextState === '1' 
                ? 'Autonomous Auto-Pilot ENABLED: InstaAuto will automatically monitor @harshparmar007__ every 10 mins and auto-arm every new reel posted!' 
                : 'Autonomous Auto-Pilot PAUSED.'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/auto-pilot/status', (req, res) => {
    const isAutoPilot = (getConfig('agent_auto_pilot') || '0') === '1';
    res.json({
        autoPilot: isAutoPilot,
        intervalMinutes: 10,
        targetAccount: getConfig('ig_username') || process.env.INSTAGRAM_USERNAME || '@harshparmar007__'
    });
});

// 5. Autonomous Instagram Feed Sentinel (Manual Instant Scan)
router.post('/scan-feed', async (req, res) => {
    try {
        const userId = req.user?.id || null;
        console.log('[Agent Sentinel] 🚀 Manual feed scan triggered');
        const scanResult = await scanAndArmFeed(userId);

        res.json({
            success: true,
            message: `Scanned ${scanResult.scanned} posts from Instagram feed. Auto-armed ${scanResult.armedCount} new posts.`,
            scanned: scanResult.scanned,
            armedCount: scanResult.armedCount,
            armed: scanResult.armed
        });
    } catch (err) {
        console.error('[Agent Sentinel Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// 6. Bridge Configuration & Integration Snippets
router.get('/bridge-config', (req, res) => {
    const host = req.get('host');
    const protocol = req.protocol;
    const webhookUrl = `${protocol}://${host}/api/agent/bridge`;
    const batchWebhookUrl = `${protocol}://${host}/api/agent/bridge/batch`;
    const isAutoPilot = (getConfig('agent_auto_pilot') || '0') === '1';
    const googleSheetWebhook = getConfig('google_sheet_webhook_url') || '';

    res.json({
        engine: 'InstaAuto External Sentinel & Bridge Engine',
        version: '2.1.0',
        status: 'active',
        autoPilot: isAutoPilot,
        webhookUrl,
        batchWebhookUrl,
        googleSheetWebhook,
        connectedInstagram: {
            username: getConfig('ig_username') || process.env.INSTAGRAM_USERNAME || '@harshparmar007__',
            userId: getConfig('ig_user_id') || process.env.INSTAGRAM_USER_ID
        },
        payloadFormat: {
            media_id: "17841400000000000 (Required: Reel ID or Instagram Link)",
            caption: "Full caption of post with CTA (e.g. Comment 'AGENT' or Comment DRAG)",
            deliverable_url: "https://your-docs-link.com/guide (Required for deliverable pass)",
            trigger_keyword: "KEYWORD (Optional - AI automatically extracts from caption if omitted)",
            lead_magnet_title: "Title of Guide (Optional)"
        },
        curlExample: `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"media_id": "18049102948201948", "caption": "Comment AGENT to get the guide!", "deliverable_url": "https://myapp.com/docs/guide-1"}'`,
        curlBatchExample: `curl -X POST ${batchWebhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"posts": [{"media_id": "180491...", "caption": "Comment RAG...", "deliverable_url": "https://..."}]}'`,
        pythonExample: `import requests

url = "${webhookUrl}"
payload = {
    "media_id": published_reel_id,
    "caption": reel_caption,
    "deliverable_url": doc_download_link
}
requests.post(url, json=payload)`
    });
});

// 7. Get All Armed Posts / Campaigns
router.get('/posts', (req, res) => {
    try {
        const posts = getAgentCampaigns();
        res.json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// 8. Test Simulator for External Inbound Post
router.post('/simulate-inbound', async (req, res) => {
    try {
        const { media_id, caption, deliverable_url, trigger_keyword, lead_magnet_title } = req.body || {};
        const testMediaId = media_id || 'ext_reel_' + Date.now();
        const testCaption = caption || "Stop building basic chatbots! 🤖\n\nHere is the exact architecture behind autonomous multi-agent systems in 2026.\n\nComment 'AGENT' below and I'll DM you the complete blueprint and implementation code! 🚀\n\n#aiagents #python";
        const testUrl = deliverable_url || 'https://notion.so/external-agent-blueprint-docs';

        const result = await processExternalPost({
            media_id: testMediaId,
            caption: testCaption,
            deliverable_url: testUrl,
            trigger_keyword: trigger_keyword || null,
            lead_magnet_title: lead_magnet_title || null,
            source: 'simulator'
        });

        res.json({
            success: true,
            message: `Simulated post from external app armed with keyword "${result.keyword}"!`,
            post: result
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. Test Comment Simulator
router.post('/simulate-comment', async (req, res) => {
    try {
        const { media_id, keyword, username } = req.body || {};
        if (!media_id || !keyword) {
            return res.status(400).json({ error: "media_id and keyword are required" });
        }

        const fakeCommentId = 'sim_ext_' + Date.now();
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
            message: `Simulated comment "${keyword}" from @${commenterHandle} on post ${media_id}. Follow-First DM funnel triggered!`,
            commentId: fakeCommentId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Status Endpoint
router.get('/status', (req, res) => {
    res.json({
        engine: 'InstaAuto External Sentinel & Bridge Engine',
        version: '2.1.0',
        active: true,
        mode: 'high_scale_external_listener',
        autoPilot: (getConfig('agent_auto_pilot') || '0') === '1',
        capabilities: [
            'inbound_webhook_bridge',
            'batch_post_ingestion',
            'google_sheets_deliverables_sync',
            'continuous_auto_pilot_sentinel',
            'caption_ai_keyword_extraction',
            'follow_first_dm_funnel_provisioning',
            'live_comment_and_click_tracking'
        ]
    });
});

module.exports = router;
