/**
 * Agentic AI Endpoints
 * Orchestrates autonomous research, lead magnet creation, Reel publishing,
 * and automatic DM funnel provisioning.
 */

const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { conductResearch } = require('../services/researchAgent');
const { generateLeadMagnet } = require('../services/leadMagnetGenerator');
const { publishReel } = require('../services/instagramPublisher');

// 1. Full 1-Click Autonomous Campaign Runner
router.post('/run', async (req, res) => {
    try {
        const { topic, video_url } = req.body || {};
        const baseUrl = req.protocol + '://' + req.get('host');

        console.log('\n======================================================');
        console.log('⚡ TRIGGERING 1-CLICK AUTONOMOUS INSTAGRAM CAMPAIGN');
        console.log('======================================================');

        // Step 1: Research & Scripting
        const research = await conductResearch(topic);

        // Step 2: Generate Companion Lead Magnet Doc & Link
        const leadMagnet = await generateLeadMagnet(research, baseUrl);

        // Step 3: Publish Reel to Instagram
        const publishResult = await publishReel({
            videoUrl: video_url || 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42866-large.mp4',
            caption: research.caption
        });

        // Step 4: Provision InstaAuto DM Automation Rule (Zero Clicks Required)
        const db = getDb();
        const buttonConfig = {
            step1_button: "Send me the access",
            step2_text: "Almost there !\nPlease visit my profile and tap follow to continue 😄",
            step2_profile_button: "Visit Profile",
            step2_confirm_button: "I'm following ✅",
            step3_button: "Open Resource Pass 📄"
        };

        const insertStmt = db.prepare(`
            INSERT INTO rules (
                name,
                trigger_keyword,
                match_type,
                action_type,
                response_text,
                link_url,
                media_id,
                is_active,
                buttons_config_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        `);

        const ruleResult = insertStmt.run(
            'Autonomous: ' + research.topic + ' (' + research.keyword + ')',
            research.keyword,
            'exact',
            'follow_first',
            'Hey! Here is your personal access pass to the ' + research.lead_magnet_title + '! Tap the button below to open:',
            leadMagnet.deliverableUrl,
            publishResult.mediaId,
            JSON.stringify(buttonConfig)
        );

        console.log('[Agent] 🎯 Auto-provisioned Rule #' + ruleResult.lastInsertRowid + ' for Reel ' + publishResult.mediaId + '!');
        console.log('[Agent] 🔗 Deliverable bound: ' + leadMagnet.deliverableUrl);
        console.log('[Agent] 💬 Trigger keyword: ' + research.keyword);
        console.log('======================================================\n');

        res.json({
            success: true,
            message: '1-Click Autonomous Campaign Live! Keyword "' + research.keyword + '" is now armed on Reel ' + publishResult.mediaId + '.',
            campaign: {
                ruleId: ruleResult.lastInsertRowid,
                mediaId: publishResult.mediaId,
                keyword: research.keyword,
                topic: research.topic,
                caption: research.caption,
                deliverableUrl: leadMagnet.deliverableUrl
            }
        });
    } catch (err) {
        console.error('[Agent] Error running autonomous campaign:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Direct Handoff Endpoint (For External Agents)
router.post('/provision', async (req, res) => {
    try {
        const { media_id, trigger_keyword, deliverable_url, lead_magnet_title, funnel_type } = req.body || {};

        if (!media_id || !trigger_keyword || !deliverable_url) {
            return res.status(400).json({ error: "media_id, trigger_keyword, and deliverable_url are required" });
        }

        const db = getDb();
        const buttonConfig = {
            step1_button: "Send me the access",
            step2_text: "Almost there !\nPlease visit my profile and tap follow to continue 😄",
            step2_profile_button: "Visit Profile",
            step2_confirm_button: "I'm following ✅",
            step3_button: "Open Deliverable 📄"
        };

        const insertStmt = db.prepare(`
            INSERT INTO rules (
                name,
                trigger_keyword,
                match_type,
                action_type,
                response_text,
                link_url,
                media_id,
                is_active,
                buttons_config_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        `);

        const result = insertStmt.run(
            'Agent: ' + (lead_magnet_title || trigger_keyword),
            trigger_keyword.toUpperCase().trim(),
            'exact',
            funnel_type || 'follow_first',
            'Hey! Here is your access link for ' + (lead_magnet_title || trigger_keyword) + ':',
            deliverable_url.trim(),
            media_id,
            JSON.stringify(buttonConfig)
        );

        res.json({
            success: true,
            ruleId: result.lastInsertRowid,
            status: 'active',
            message: 'Rule provisioned successfully for keyword "' + trigger_keyword + '" on media ' + media_id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Status Endpoint
router.get('/status', (req, res) => {
    res.json({
        engine: 'InstaAuto AI Agent',
        status: 'online',
        capabilities: [
            'autonomous_research',
            'lead_magnet_generation',
            'reel_publishing',
            'follow_first_funnel_provisioning'
        ]
    });
});

module.exports = router;
