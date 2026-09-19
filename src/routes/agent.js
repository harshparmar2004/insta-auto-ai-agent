/**
 * Instagram Autonomous Sentinel & External Agent Bridge Routes
 * Connects external content creation platforms to InstaAuto:
 * - Inbound Webhook Bridge (/api/agent/bridge)
 * - Feed Auto-Detect Sentinel (/api/agent/scan-feed)
 * - Live Follower Comment Simulation & DM Gates
 */

const express = require('express');
const router = express.Router();
const { getDb, getAgentCampaigns, getConfig } = require('../database');
const { processExternalPost, scanAndArmFeed } = require('../services/postSentinel');
const { processCommentEvent } = require('../services/automation');

// 1. Inbound Webhook Bridge for External Content Platform
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
            message: `Post ${media_id} received and Follow-First automation armed with keyword "${result.keyword}"!`,
            post: result
        });
    } catch (err) {
        console.error('[Agent Bridge Error]:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Autonomous Instagram Feed Sentinel (Scans live feed for newly published posts)
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

// 3. Bridge Configuration & Integration Snippets
router.get('/bridge-config', (req, res) => {
    const host = req.get('host');
    const protocol = req.protocol;
    const webhookUrl = `${protocol}://${host}/api/agent/bridge`;
    const apiKey = process.env.AGENT_BRIDGE_KEY || 'instaauto_live_bridge_key';

    res.json({
        engine: 'InstaAuto External Sentinel & Bridge',
        status: 'active',
        webhookUrl,
        apiKey,
        connectedInstagram: {
            username: getConfig('ig_username') || process.env.INSTAGRAM_USERNAME || '@harshparmar007__',
            userId: getConfig('ig_user_id') || process.env.INSTAGRAM_USER_ID
        },
        payloadFormat: {
            media_id: "17841400000000000 (Required)",
            caption: "Full caption of post with CTA (Optional - AI will parse)",
            deliverable_url: "https://your-docs-link.com/guide (Optional)",
            trigger_keyword: "KEYWORD (Optional - AI will extract if omitted)",
            lead_magnet_title: "Title of Guide (Optional)"
        },
        curlExample: `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"media_id": "17841409999999999", "caption": "Comment AGENT to get the guide!", "deliverable_url": "https://myapp.com/docs/guide-1"}'`,
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

// 4. Get All Armed Posts / Campaigns
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

// Alias for backwards compatibility with existing UI callers
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

// 5. Test Simulator for External Inbound Post
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

// 6. Test Comment Simulator
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

// 7. Status Endpoint
router.get('/status', (req, res) => {
    res.json({
        engine: 'InstaAuto External Sentinel & Bridge',
        version: '2.0.0',
        active: true,
        mode: 'external_content_platform_listener',
        capabilities: [
            'inbound_webhook_bridge',
            'caption_ai_keyword_extraction',
            'feed_sentinel_auto_detection',
            'follow_first_dm_funnel_provisioning',
            'live_comment_and_click_tracking'
        ]
    });
});

module.exports = router;
