/**
 * Instagram Post Sentinel & Autonomous Bridge
 * Intercepts newly published Instagram posts from external platforms, Google Sheets, or live feed.
 * Uses Caption Intelligence to extract trigger keywords & deliverable links, and auto-arms Follow-First DM funnels.
 * Built for high-volume scale (supports 100s of reels with per-reel keyword/doc isolation).
 */

const axios = require('axios');
const { getDb, saveAgentCampaign, getConfig, getUserInstagramAccount } = require('../database');
const { parseCaptionIntelligence } = require('./captionParserAgent');
const { getMedia } = require('./instagram');

function extractMediaId(input) {
    if (!input || typeof input !== 'string') return String(input || '');
    const clean = input.trim();
    // Check if input is full Instagram URL: https://www.instagram.com/reel/C8XyZ123/
    const urlMatch = clean.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/i);
    if (urlMatch && urlMatch[1]) {
        return urlMatch[1];
    }
    return clean;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());
    return values;
}

async function processExternalPost({ media_id, caption = '', deliverable_url = null, trigger_keyword = null, lead_magnet_title = null, source = 'external_bridge', user_id = null }) {
    if (!media_id) {
        throw new Error('media_id is required');
    }

    let cleanMediaId = extractMediaId(media_id);
    const db = getDb();

    // Check if cleanMediaId is a shortcode or permalink that matches an existing media in DB
    try {
        const rowByPermalink = db.prepare("SELECT ig_media_id FROM media WHERE ig_media_id = ? OR permalink LIKE ?").get(cleanMediaId, `%${cleanMediaId}%`);
        if (rowByPermalink && rowByPermalink.ig_media_id) {
            cleanMediaId = rowByPermalink.ig_media_id;
        }
    } catch (e) {}

    // 1. Run Autonomous Caption Intelligence
    const parsed = await parseCaptionIntelligence(caption, trigger_keyword, deliverable_url);
    const finalKeyword = parsed.keyword;
    const finalDeliverableUrl = parsed.deliverableUrl;
    const finalTitle = lead_magnet_title || parsed.title;

    console.log(`[Sentinel] 🤖 Processing Reel ${cleanMediaId} (Source: ${source})`);
    console.log(`[Sentinel] 💬 Trigger Keyword: ${finalKeyword}`);
    console.log(`[Sentinel] 🔗 Deliverable Doc Link: ${finalDeliverableUrl}`);

    // Resolve owner user_id
    let targetUserId = user_id || null;
    if (!targetUserId) {
        try {
            const acct = db.prepare("SELECT user_id FROM instagram_accounts WHERE is_active = 1 LIMIT 1").get();
            if (acct && acct.user_id) targetUserId = acct.user_id;
        } catch (e) {}
    }

    // 2. Upsert into Media Table
    const now = new Date().toISOString();
    try {
        db.prepare(`
            INSERT INTO media (ig_media_id, caption, user_id, synced_at, status)
            VALUES (?, ?, ?, ?, 'active')
            ON CONFLICT(ig_media_id) DO UPDATE SET caption = excluded.caption, user_id = COALESCE(media.user_id, excluded.user_id)
        `).run(cleanMediaId, caption || 'Instagram Content', targetUserId, now);
    } catch (e) {
        console.warn('[Sentinel] Media upsert notice:', e.message);
    }

    const mediaRow = db.prepare("SELECT id FROM media WHERE ig_media_id = ?").get(cleanMediaId);
    const resolvedMediaId = mediaRow ? mediaRow.id : null;

    // 3. Check for existing rule strictly bound to this media
    let existingRule = db.prepare(`
        SELECT * FROM rules 
        WHERE media_id = ? OR media_id = ?
    `).get(resolvedMediaId, cleanMediaId);

    let ruleId = existingRule ? existingRule.id : null;

    // 4. Configure Follow-First Interactive DM Funnel
    const buttonConfig = {
        step1_button: "Send me the access",
        step2_text: "Almost there !\nPlease visit my profile and tap follow to continue 😄",
        step2_profile_button: "Visit Profile",
        step2_confirm_button: "I'm following ✅",
        not_following_text: "Wait! It looks like you're not following us yet! 👀\n\nPlease visit our profile, tap Follow, and then click \"I'm following ✅\" below to unlock your link!",
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
                user_id,
                created_at,
                updated_at
            ) VALUES (?, ?, 'follow_first', ?, ?, ?, 1, ?, ?, ?, ?)
        `);

        const ruleRes = insertRuleStmt.run(
            resolvedMediaId,
            finalKeyword,
            `Hey! Here is your personal access pass to "${finalTitle}"! Tap below to open:`,
            finalDeliverableUrl,
            `Sent you a DM with the access link! Check your message requests 🙌`,
            JSON.stringify(buttonConfig),
            targetUserId,
            now,
            now
        );

        ruleId = ruleRes.lastInsertRowid;
        console.log(`[Sentinel] 🎯 Auto-provisioned Rule #${ruleId} for Media ${cleanMediaId} with Keyword "${finalKeyword}"!`);
    } else {
        // Update existing rule's deliverable link and keyword if updated from bridge
        try {
            db.prepare(`
                UPDATE rules 
                SET trigger_keyword = ?, link_url = ?, user_id = COALESCE(user_id, ?), updated_at = ?
                WHERE id = ?
            `).run(finalKeyword, finalDeliverableUrl, targetUserId, now, ruleId);
            console.log(`[Sentinel] 🔄 Updated existing Rule #${ruleId} with Keyword "${finalKeyword}"`);
        } catch (e) {}
    }

    // 5. Save/Update Campaign Tracking
    const campaignId = saveAgentCampaign({
        topic: finalTitle,
        keyword: finalKeyword,
        leadMagnetTitle: finalTitle,
        deliverableUrl: finalDeliverableUrl,
        mediaId: cleanMediaId,
        ruleId: ruleId,
        caption: caption
    });

    return {
        success: true,
        campaign_id: campaignId,
        rule_id: ruleId,
        media_id: cleanMediaId,
        keyword: finalKeyword,
        deliverable_url: finalDeliverableUrl,
        title: finalTitle,
        status: 'armed',
        source
    };
}

/**
 * Process a batch of posts (e.g. 50, 100+ reels in a single call)
 */
async function processBatchExternalPosts(postsArray, source = 'external_bridge_batch') {
    if (!Array.isArray(postsArray)) {
        throw new Error('postsArray must be an array');
    }

    console.log(`[Sentinel] 📦 Processing batch of ${postsArray.length} posts from ${source}...`);
    const results = [];

    for (const p of postsArray) {
        try {
            const res = await processExternalPost({
                media_id: p.media_id || p.id || p.reel_id,
                caption: p.caption || '',
                deliverable_url: p.deliverable_url || p.doc_url || p.link || null,
                trigger_keyword: p.trigger_keyword || p.keyword || null,
                lead_magnet_title: p.lead_magnet_title || p.title || null,
                source
            });
            results.push(res);
        } catch (err) {
            console.warn(`[Sentinel] ⚠️ Batch item error for ${p.media_id}: ${err.message}`);
            results.push({
                media_id: p.media_id,
                success: false,
                error: err.message
            });
        }
    }

    const armedCount = results.filter(r => r.success).length;
    console.log(`[Sentinel] ✅ Batch complete! Successfully armed ${armedCount}/${postsArray.length} posts.`);

    return {
        total: postsArray.length,
        armedCount,
        results
    };
}

/**
 * Syncs deliverable doc links and reel mappings directly from Google Sheets
 */
async function syncFromGoogleSheet(customUrl = null) {
    const sheetUrl = customUrl || getConfig('agent_sheet_url') || getConfig('google_sheet_webhook_url');
    if (!sheetUrl) {
        throw new Error('No Google Sheet URL or Webhook configured');
    }

    console.log(`[Sentinel] 📊 Syncing deliverable mappings from Google Sheet: ${sheetUrl}...`);

    let rows = [];

    // Case 1: Google Apps Script Webhook
    if (sheetUrl.includes('script.google.com')) {
        try {
            const res = await axios.get(sheetUrl, {
                params: { action: 'get_reels' },
                timeout: 10000
            });
            if (Array.isArray(res.data)) {
                rows = res.data;
            } else if (res.data?.reels && Array.isArray(res.data.reels)) {
                rows = res.data.reels;
            }
        } catch (e) {
            console.warn('[Sentinel] Apps script get_reels notice:', e.message);
        }
    }

    // Case 2: Published Google Sheet CSV
    if (rows.length === 0 && (sheetUrl.includes('docs.google.com/spreadsheets') || sheetUrl.includes('output=csv') || sheetUrl.includes('.csv'))) {
        try {
            let csvUrl = sheetUrl;
            if (sheetUrl.includes('docs.google.com/spreadsheets')) {
                csvUrl = sheetUrl.replace(/\/edit.*$/, '').replace(/\/view.*$/, '') + '/export?format=csv';
            }
            const res = await axios.get(csvUrl, { timeout: 12000 });
            const lines = res.data.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            if (lines.length > 1) {
                const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/['"\s_]/g, ''));
                for (let i = 1; i < lines.length; i++) {
                    const cols = parseCSVLine(lines[i]).map(c => c.replace(/^["']|["']$/g, '').trim());
                    const rowObj = {};
                    headers.forEach((h, idx) => {
                        const val = cols[idx] || '';
                        if (h.includes('id') || h.includes('reel') || h.includes('media') || h.includes('post')) rowObj.media_id = val;
                        if (h.includes('key') || h.includes('trigger')) rowObj.trigger_keyword = val;
                        if (h.includes('link') || h.includes('doc') || h.includes('url') || h.includes('resource') || h.includes('guide')) rowObj.deliverable_url = val;
                        if (h.includes('cap') || h.includes('text')) rowObj.caption = val;
                        if (h.includes('title') || h.includes('topic') || h.includes('name')) rowObj.lead_magnet_title = val;
                    });
                    if (rowObj.media_id) rows.push(rowObj);
                }
            }
        } catch (csvErr) {
            console.warn('[Sentinel] CSV sync notice:', csvErr.message);
        }
    }

    if (rows.length === 0) {
        return {
            success: true,
            totalRows: 0,
            armedCount: 0,
            message: 'No unautomated rows found in Google Sheet or sheet is currently empty.'
        };
    }

    return await processBatchExternalPosts(rows, 'google_sheet_sync');
}

/**
 * Scans connected Instagram account's live feed
 */
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
    const mediaRes = await getMedia(token, null, 50);
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
    processBatchExternalPosts,
    syncFromGoogleSheet,
    scanAndArmFeed
};
