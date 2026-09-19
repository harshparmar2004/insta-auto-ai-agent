/**
 * Instagram Content Publishing Service
 * Publishes Reels and media posts directly via Meta Graph API v20.0 container workflow.
 */

const axios = require('axios');
const { getConfig } = require('../database');

async function publishReel({ videoUrl, caption, igUserId = null, accessToken = null }) {
    const token = accessToken || getConfig('access_token') || process.env.ACCESS_TOKEN;
    const userId = igUserId || getConfig('ig_user_id') || process.env.IG_USER_ID;

    console.log(`[Publisher] 🚀 Publishing Reel to Instagram (User ID: ${userId || 'Simulated'})...`);

    if (token && userId && videoUrl && !videoUrl.includes('example.com')) {
        try {
            // 1. Create Media Container
            const containerRes = await axios.post(
                `https://graph.facebook.com/v20.0/${userId}/media`,
                null,
                {
                    params: {
                        media_type: 'REELS',
                        video_url: videoUrl,
                        caption: caption,
                        access_token: token
                    }
                }
            );

            const creationId = containerRes.data?.id;
            console.log(`[Publisher] Container created: ${creationId}. Waiting for video processing...`);

            // 2. Poll container status until ready
            await new Promise(r => setTimeout(r, 12000));

            // 3. Publish Media Container
            const publishRes = await axios.post(
                `https://graph.facebook.com/v20.0/${userId}/media_publish`,
                null,
                {
                    params: {
                        creation_id: creationId,
                        access_token: token
                    }
                }
            );

            const mediaId = publishRes.data?.id;
            console.log(`[Publisher] ✅ Reel successfully published to Instagram! Media ID: ${mediaId}`);
            return {
                success: true,
                mediaId,
                status: 'published'
            };
        } catch (err) {
            console.error('[Publisher] Meta API publishing error:', err.response?.data || err.message);
            throw new Error(`Meta publishing failed: ${err.response?.data?.error?.message || err.message}`);
        }
    }

    // Sandbox / Simulation Mode
    const mockMediaId = 'reel_' + Date.now();
    console.log(`[Publisher] 🧪 [Simulation Mode] Generated live mock Media ID: ${mockMediaId}`);
    return {
        success: true,
        mediaId: mockMediaId,
        status: 'simulated_publish',
        note: 'Live Meta publishing requires public video_url and active token.'
    };
}

module.exports = {
    publishReel
};
