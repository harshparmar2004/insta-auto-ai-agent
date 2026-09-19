const express = require('express');
const { getDb } = require('../database');
const { syncClickToSheet } = require('../services/googleSheets');

const router = express.Router();

router.get('/r/:trackingId', (req, res) => {
    try {
        const { trackingId } = req.params;
        const db = getDb();

        const event = db.prepare(`
            SELECT e.id as event_id, r.link_url, e.media_ig_id 
            FROM events e 
            LEFT JOIN rules r ON e.rule_id = r.id 
            WHERE e.tracking_id = ?
        `).get(trackingId);

        if (!event) {
            return res.status(404).send('Link not found');
        }

        let destinationUrl = event.link_url;
        if (!destinationUrl) {
            destinationUrl = 'https://instagram.com';
        }
        if (!/^https?:\/\//i.test(destinationUrl)) {
            destinationUrl = 'https://' + destinationUrl;
        }

        // Log click in local DB
        db.prepare(`
            INSERT INTO clicks (event_id, tracking_id, clicked_at, user_agent) 
            VALUES (?, ?, ?, ?)
        `).run(event.event_id, trackingId, new Date().toISOString(), req.get('User-Agent') || '');

        // Update reel_stats_history in real time
        try {
            if (event.media_ig_id) {
                const mediaRow = db.prepare("SELECT id FROM media WHERE ig_media_id = ?").get(event.media_ig_id);
                if (mediaRow) {
                    const currentMonth = new Date().toISOString().slice(0, 7);
                    db.prepare(`
                        UPDATE reel_stats_history 
                        SET clicks_count = (SELECT COUNT(*) FROM clicks c JOIN events e ON c.event_id = e.id WHERE e.media_ig_id = ?),
                            updated_at = ?
                        WHERE media_id = ? AND month_year = ?
                    `).run(event.media_ig_id, new Date().toISOString(), mediaRow.id, currentMonth);
                }
            }
        } catch(e) {}

        // Asynchronously update Google Sheet
        try { syncClickToSheet(trackingId).catch(() => {}); } catch(e) {}

        res.redirect(destinationUrl);
    } catch (err) {
        console.error('[Redirect] Error:', err.message);
        res.status(500).send('Internal Error');
    }
});

// Deliverable Guide Reader View
router.get('/resources/:slug', (req, res) => {
    try {
        const { slug } = req.params;
        const db = getDb();
        const campaign = db.prepare("SELECT * FROM agent_campaigns WHERE deliverable_url LIKE ?").get(`%${slug}%`);
        const title = campaign ? campaign.lead_magnet_title : 'Exclusive Creator Resource';
        const topic = campaign ? campaign.topic : 'Software Architecture & AI Guide';

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title} — InstaAuto Exclusive</title>
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FAF8F5; color: #2C2A29; margin: 0; padding: 2rem 1rem; line-height: 1.6; }
                    .container { max-width: 740px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E6E1D8; padding: 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
                    .badge { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 999px; background: #FAF0EC; color: #D97757; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1.25rem; }
                    h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 1rem 0; color: #2C2A29; }
                    .lead { font-size: 1.05rem; color: #736E68; margin-bottom: 2rem; }
                    .card { background: #FAF8F5; border-radius: 12px; border: 1px solid #E6E1D8; padding: 1.5rem; margin: 1.5rem 0; }
                    .code-block { background: #1E1E1E; color: #D4D4D4; border-radius: 10px; padding: 1.25rem; font-family: monospace; font-size: 0.88rem; overflow-x: auto; margin: 1rem 0; }
                    .btn { display: inline-block; background: #D97757; color: #FFFFFF; padding: 0.85rem 1.75rem; border-radius: 12px; font-weight: 800; text-decoration: none; box-shadow: 0 4px 14px rgba(217,119,87,0.3); transition: all 0.2s; }
                    .btn:hover { background: #C66444; transform: translateY(-1px); }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="badge">✨ Verified Instagram Deliverable</div>
                    <h1>${title}</h1>
                    <p class="lead">Thank you for following and commenting! Below is the complete implementation blueprint, architecture patterns, and source resources for <strong>${topic}</strong>.</p>
                    
                    <div class="card">
                        <h3 style="margin-top:0; font-weight: 800;">🚀 Quick Start Checklist</h3>
                        <ul>
                            <li>Clone the template repository and configure environment variables.</li>
                            <li>Initialize autonomous agent orchestrator with your Meta Graph API credentials.</li>
                            <li>Verify real-time webhook endpoints and automated Follow-First gates.</li>
                        </ul>
                    </div>

                    <div class="code-block">
// InstaAuto Autonomous Agent Pipeline
const agent = new AutonomousAgent({
  topic: "${topic}",
  autoPublish: true,
  funnel: "follow_first"
});

await agent.execute(); // Research -> Doc -> Reel -> DM Funnel
                    </div>

                    <div style="text-align: center; margin-top: 2.5rem; border-top: 1px solid #E6E1D8; padding-top: 2rem;">
                        <a href="https://instagram.com" class="btn">Return to Instagram</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send('Internal Error');
    }
});

module.exports = router;
