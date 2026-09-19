/**
 * Instagram Post Sentinel & Autonomous Bridge
 * Intercepts newly published Instagram posts from external platforms or the live account feed.
 * Uses Caption Intelligence to extract trigger keywords & deliverable links, and auto-arms Follow-First DM funnels.
 */

const { getDb, saveAgentCampaign, getConfig, getUserInstagramAccount } = require('../database');
const { parseCaptionIntelligence } = require('./captionParserAgent');
const { getMedia } = require('./instagram');

async function processExternalPost({ media_id, caption, deliverable_url, trigger_keyword, lead_magnet_title, source = 'external_bridge' }) {
    if (!media_id) {
        throw new Error('media_id is required');
    }

    const db = getDb();

    // 1. Run Autonomous Caption Intelligence
    const parsed = await parseCaptionIntelligence(caption, trigger_keyword, deliverable_url);
    const finalKeyword = parsed.keyword;
    const finalDeliverableUrl = parsed.deliverableUrl;
    const finalTitle = lead_magnet_title || parsed.title;

    console.log(`[Sentinel] 🤖 Processing post ${media_id} from ${source}`);
    console.log(`[Sentinel] 💬 Extracted Trigger Keyword: ${finalKeyword}`);
    console.log(`[Sentinel] 🔗 Bound Deliverable URL: ${finalDeliverableUrl}`);

    // 2. Upsert into Media Table
    const now = new Date().toISOString();
    try {
        db.prepare(`
            INSERT INTO media (ig_media_id, caption, synced_at, status)
            VALUES (?, ?, ?, 'active')
            ON CONFLICT(ig_media_id) DO UPDATE SET caption = excluded.caption
        `).run(media_id, caption || 'External Instagram Post', now);
    } catch (e) {
        console.warn('[Sentinel] Media upsert notice:', e.message);
    }

    const mediaRow = db.prepare("SELECT id FROM media WHERE ig_media_id = ?").get(media_id);
    const resolvedMediaId = mediaRow ? mediaRow.id : null;

    // 3. Check for existing rule on this media
    let existingRule = db.prepare(`
        SELECT * FROM rules 
        WHERE media_id = ? OR media_id = ?
    `).get(resolvedMediaId, media_id);

    let ruleId = existingRule ? existingRule.id : null;

    // 4. Configure Follow-First Interactive DM Funnel
    const buttonConfig = {
        step1_button: "Send me the access",
        step2_text: "Almost there !\nPlease visit my profile and tap follow to continue 😄",
        step2_profile_button: "Visit Profile",
        step2_confirm_button: "I'm following ✅",
        step3_button: "Open Resource Pass 📄"
    };

    if (!existingRule) {
        const insertRuleStmt = db.prepare(`
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

        const ruleRes = insertRuleStmt.run(
            resolvedMediaId,
            finalKeyword,
            `Hey! Here is your exclusive access to "${finalTitle}"! Tap the button below to open:`,
            finalDeliverableUrl,
            `Sent you a DM with the access link! Check your message requests 🙌`,
            JSON.stringify(buttonConfig),
            now,
            now
        );

        ruleId = ruleRes.lastInsertRowid;
        console.log(`[Sentinel] 🎯 Auto-provisioned Rule #${ruleId} for Media ${media_id}!`);
    } else {
        console.log(`[Sentinel] ℹ️ Media ${media_id} already has active Rule #${ruleId}`);
    }

    // 5. Save/Update Campaign Tracking
    const campaignId = saveAgentCampaign({
        topic: finalTitle,
        keyword: finalKeyword,
        leadMagnetTitle: finalTitle,
        deliverableUrl: finalDeliverableUrl,
        mediaId: media_id,
        ruleId: ruleId,
        caption: caption
    });

    return {
        success: true,
        campaign_id: campaignId,
        rule_id: ruleId,
        media_id: media_id,
        keyword: finalKeyword,
        deliverable_url: finalDeliverableUrl,
        title: finalTitle,
        status: 'armed',
        source
    };
}

async function scanAndArmFeed(userId = null) {
    let token = null;
    if (userId) {
        const acct = getUserInstagramAccount(userId);
        token = acct ? acct.access_token : null;
    }
    if (!token) {
        token = getConfig('access_token') || process.env.INSTAGRAM_ACCESS_TOKEN;
    }

    if (!token) {
        throw new Error('No Instagram access token available to scan feed');
    }

    console.log('[Sentinel] 🔍 Scanning live Instagram feed for newly published posts...');
    const mediaRes = await getMedia(token, null, 25);
    const items = mediaRes?.data || [];

    const db = getDb();
    const armed = [];

    for (const item of items) {
        const mediaId = item.id;
        const caption = item.caption || '';

        // Check if an automation rule already exists for this media
        const existingRule = db.prepare(`
            SELECT r.id FROM rules r
            LEFT JOIN media m ON r.media_id = m.id
            WHERE r.media_id = ? OR m.ig_media_id = ?
        `).get(mediaId, mediaId);

        if (!existingRule) {
            console.log(`[Sentinel] ⚡ New unautomated post detected on Instagram: ${mediaId}`);
            const result = await processExternalPost({
                media_id: mediaId,
                caption: caption,
                source: 'feed_sentinel'
            });
            armed.push(result);
        }
    }

    console.log(`[Sentinel] ✅ Scan complete! Checked ${items.length} posts, auto-armed ${armed.length} new automation funnels.`);
    return {
        scanned: items.length,
        armedCount: armed.length,
        armed
    };
}

module.exports = {
    processExternalPost,
    scanAndArmFeed
};
