// Autonomous Instagram AI Agent Sentinel & External Bridge View
window.agentView = {
    posts: [],
    bridgeConfig: null,
    activeSnippetTab: 'curl',

    async render(container) {
        const currentHost = window.location.origin;
        const bridgeUrl = `${currentHost}/api/agent/bridge`;

        container.innerHTML = `
            <div class="view" id="agent-view" style="width: 100%; max-width: 1480px; margin: 0 auto;">
                <!-- PAGE HEADER -->
                <div class="page-header" style="margin-bottom: 1.5rem;">
                    <div class="page-title">
                        <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem;">
                            <span style="font-size: 1.75rem;">🤖</span>
                            <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.85rem; letter-spacing: -0.03em; margin: 0;">External Agent Bridge & Sentinel</h1>
                            <span style="padding: 0.2rem 0.65rem; border-radius: 999px; background: #E8F5E9; color: #2E7D32; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">Zero-Touch Bridge</span>
                        </div>
                        <p style="font-size: 0.92rem; color: var(--text-secondary); margin: 0;">
                            Connects your external content creation platform. When your other app posts Reels or Photos with companion docs, InstaAuto auto-detects them, extracts trigger keywords, and arms Follow-First DM funnels.
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.65rem; align-items: center;">
                        <button class="btn btn-secondary btn-sm" style="font-weight: 700; padding: 0.58rem 1.15rem; font-size: 0.88rem; border-radius: 10px;" onclick="agentView.loadPosts()">
                            🔄 Refresh Posts
                        </button>
                        <button class="btn btn-primary btn-sm" id="btn-scan-feed" style="font-weight: 800; padding: 0.58rem 1.35rem; font-size: 0.88rem; border-radius: 10px; box-shadow: 0 4px 14px rgba(217,119,87,0.3);" onclick="agentView.scanFeed()">
                            <span>🔍 Scan Feed & Auto-Arm</span>
                        </button>
                    </div>
                </div>

                <!-- TOP SECTION: TWO CARDS (BRIDGE WEBHOOK & FEED SENTINEL) -->
                <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1.5rem; margin-bottom: 2rem;">
                    
                    <!-- CARD 1: INBOUND WEBHOOK BRIDGE -->
                    <div class="card" style="border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.6rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                            <div>
                                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; margin: 0 0 0.2rem 0;">
                                    📡 Inbound Webhook Bridge
                                </h3>
                                <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">
                                    Configure your external content platform to ping this endpoint whenever it finishes publishing a post.
                                </p>
                            </div>
                            <span style="font-size: 0.78rem; font-weight: 700; color: #2E7D32; background: #E8F5E9; padding: 0.25rem 0.65rem; border-radius: 8px;">
                                🟢 Ready to Ingest
                            </span>
                        </div>

                        <!-- WEBHOOK URL INPUT WITH COPY -->
                        <div style="margin-bottom: 1rem;">
                            <label style="font-size: 0.78rem; font-weight: 700; color: #736E68; display: block; margin-bottom: 0.35rem;">
                                Inbound Webhook URL (POST)
                            </label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="text" readonly value="${bridgeUrl}" id="bridge-url-input" style="width: 100%; padding: 0.65rem 0.95rem; font-size: 0.86rem; font-weight: 700; font-family: monospace; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FAF8F5; color: #2C2A29;">
                                <button class="btn btn-secondary btn-sm" onclick="agentView.copyToClipboard('bridge-url-input')" style="font-weight: 800; white-space: nowrap; padding: 0.65rem 1rem;">
                                    📋 Copy
                                </button>
                            </div>
                        </div>

                        <!-- CODE SNIPPETS ACCORDION -->
                        <div style="margin-top: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="font-size: 0.8rem; font-weight: 800; color: #2C2A29;">Integration Snippet:</span>
                                <div style="display: flex; gap: 0.35rem;">
                                    <button class="btn btn-sm btn-snippet" id="tab-curl" onclick="agentView.switchTab('curl')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #D97757; color: #FFF;">cURL</button>
                                    <button class="btn btn-sm btn-snippet" id="tab-python" onclick="agentView.switchTab('python')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FAF8F5; color: #736E68;">Python</button>
                                    <button class="btn btn-sm btn-snippet" id="tab-node" onclick="agentView.switchTab('node')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FAF8F5; color: #736E68;">Node.js</button>
                                </div>
                            </div>

                            <pre id="snippet-code" style="background: #1E1E1E; color: #D4D4D4; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.78rem; font-family: monospace; overflow-x: auto; margin: 0; line-height: 1.5;"></pre>
                        </div>
                    </div>

                    <!-- CARD 2: AUTONOMOUS FEED SENTINEL -->
                    <div class="card" style="border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.6rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; margin: 0;">
                                    ⚡ Autonomous Feed Sentinel
                                </h3>
                                <span style="font-size: 0.74rem; font-weight: 700; color: #D97757; background: #FAF0EC; padding: 0.25rem 0.6rem; border-radius: 6px;">
                                    Auto-Detect
                                </span>
                            </div>

                            <p style="font-size: 0.85rem; color: #736E68; margin-bottom: 1.15rem; line-height: 1.5;">
                                Don't want to make an API call from the other app? Let our <strong>Feed Sentinel</strong> scan your connected account (<code>@harshparmar007__</code>). It detects new unautomated posts, runs AI Caption Analysis, extracts keywords like <code>Comment 'AGENT'</code>, and arms the Follow-First DM gate automatically!
                            </p>

                            <div style="background: #FAF8F5; border-radius: 10px; border: 1px solid #E6E1D8; padding: 0.85rem; font-size: 0.82rem; margin-bottom: 1.15rem;">
                                <div style="font-weight: 700; color: #2C2A29; margin-bottom: 0.35rem;">🧠 How Caption Intelligence Works:</div>
                                <div style="color: #736E68;">
                                    • Detects call-to-actions (<code>Comment 'XYZ'</code>, <code>DM 'XYZ'</code>)<br>
                                    • Extracts deliverable links if present in caption<br>
                                    • Provisions 3-step Follow-First DM funnel with 0 clicks
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary w-full" onclick="agentView.scanFeed()" style="padding: 0.8rem; font-weight: 800; font-size: 0.92rem; border-radius: 12px; box-shadow: 0 4px 14px rgba(217,119,87,0.3);">
                            🔍 Run Feed Sentinel Scan Now
                        </button>
                    </div>

                </div>

                <!-- TEST SIMULATOR CARD -->
                <div class="card" style="margin-bottom: 2rem; border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FAF8F5; padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem; margin: 0;">
                            🧪 Test Simulator: Ingest Post from External App
                        </h3>
                        <span style="font-size: 0.78rem; color: #736E68; font-weight: 600;">Test how InstaAuto processes an incoming post payload</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1.2fr 1fr auto; gap: 0.75rem; align-items: center;">
                        <input type="text" id="sim-media-id" class="input" placeholder="Media ID (e.g. 17841499...)" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                        <input type="text" id="sim-caption" class="input" placeholder="Caption (e.g. Comment 'AGENT' to get the full guide!)" value="Stop building basic chatbots! 🤖 Comment 'AGENT' to get the full architecture guide and code templates!" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                        <input type="url" id="sim-doc-url" class="input" placeholder="Deliverable Guide URL" value="https://notion.so/external-agent-blueprint-docs" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                        <button class="btn btn-primary btn-sm" id="btn-simulate-inbound" onclick="agentView.simulateInboundPost()" style="font-weight: 800; padding: 0.7rem 1.25rem; font-size: 0.85rem; border-radius: 10px; white-space: nowrap;">
                            ⚡ Ingest Test Post
                        </button>
                    </div>

                    <div id="sim-result-banner" style="display: none; margin-top: 1rem;"></div>
                </div>

                <!-- ACTIVE CONNECTED POSTS SECTION -->
                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.35rem; letter-spacing: -0.02em; margin: 0;">
                            Armed External Posts & Growth Funnels
                        </h2>
                        <span id="agent-posts-count" style="font-size: 0.84rem; font-weight: 700; color: var(--text-secondary);">Loading...</span>
                    </div>

                    <div id="agent-posts-list">
                        <div class="text-center" style="padding: 3rem;"><div class="spinner"></div></div>
                    </div>
                </div>

            </div>
        `;

        this.renderSnippet();
        await this.loadPosts();
    },

    switchTab(tab) {
        this.activeSnippetTab = tab;
        ['curl', 'python', 'node'].forEach(t => {
            const btn = document.getElementById('tab-' + t);
            if (btn) {
                if (t === tab) {
                    btn.style.background = '#D97757';
                    btn.style.color = '#FFF';
                } else {
                    btn.style.background = '#FAF8F5';
                    btn.style.color = '#736E68';
                }
            }
        });
        this.renderSnippet();
    },

    renderSnippet() {
        const el = document.getElementById('snippet-code');
        if (!el) return;
        const currentHost = window.location.origin;
        const bridgeUrl = `${currentHost}/api/agent/bridge`;

        if (this.activeSnippetTab === 'curl') {
            el.textContent = `curl -X POST ${bridgeUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "media_id": "18049102948201948",
    "caption": "Comment AGENT to get the guide!",
    "deliverable_url": "https://yourapp.com/docs/blueprint-v1"
  }'`;
        } else if (this.activeSnippetTab === 'python') {
            el.textContent = `import requests

url = "${bridgeUrl}"
payload = {
    "media_id": "18049102948201948",
    "caption": "Comment 'AGENT' to get the full guide!",
    "deliverable_url": "https://yourapp.com/docs/blueprint-v1"
}
response = requests.post(url, json=payload)
print(response.json())`;
        } else if (this.activeSnippetTab === 'node') {
            el.textContent = `const axios = require('axios');

await axios.post('${bridgeUrl}', {
    media_id: '18049102948201948',
    caption: "Comment 'AGENT' to get the full guide!",
    deliverable_url: 'https://yourapp.com/docs/blueprint-v1'
});`;
        }
    },

    copyToClipboard(elementId) {
        const input = document.getElementById(elementId);
        if (input) {
            navigator.clipboard.writeText(input.value);
            App.showToast('📋 Copied to clipboard!', 'success');
        }
    },

    async scanFeed() {
        const btn = document.getElementById('btn-scan-feed');
        const origHtml = btn ? btn.innerHTML : '';
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;"></span> Scanning Feed...';
        }

        try {
            App.showToast('🔍 Scanning Instagram feed for newly published posts...', 'info');
            const res = await App.apiCall('POST', '/api/agent/scan-feed');
            App.showToast(`✅ Scanned ${res.scanned} posts. Auto-armed ${res.armedCount} new funnels!`, 'success');
            await this.loadPosts();
        } catch (err) {
            App.showToast('Feed scan notice: ' + err.message, 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = origHtml;
            }
        }
    },

    async simulateInboundPost() {
        const btn = document.getElementById('btn-simulate-inbound');
        const banner = document.getElementById('sim-result-banner');
        const mediaId = (document.getElementById('sim-media-id')?.value || '').trim() || ('reel_' + Date.now());
        const caption = (document.getElementById('sim-caption')?.value || '').trim();
        const docUrl = (document.getElementById('sim-doc-url')?.value || '').trim();

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner" style="width:12px;height:12px;"></span> Ingesting...';
        }

        try {
            const res = await App.apiCall('POST', '/api/agent/simulate-inbound', {
                media_id: mediaId,
                caption,
                deliverable_url: docUrl
            });

            App.showToast(`⚡ External post ingested and armed with keyword "${res.post.keyword}"!`, 'success');

            if (banner) {
                banner.style.display = 'block';
                banner.innerHTML = `
                    <div style="background: #E8F5E9; border: 1.5px solid #81C784; border-radius: 12px; padding: 1rem; color: #1B5E20; font-size: 0.88rem;">
                        <strong>✅ Post Ingested Successfully!</strong><br>
                        • <strong>Media ID:</strong> ${res.post.media_id}<br>
                        • <strong>Extracted Trigger Keyword:</strong> <span style="background: #C8E6C9; padding: 2px 7px; border-radius: 5px; font-weight: 800;">${res.post.keyword}</span><br>
                        • <strong>Deliverable Link:</strong> <a href="${res.post.deliverable_url}" target="_blank" style="color: #2E7D32; font-weight: 700; text-decoration: underline;">${res.post.deliverable_url}</a><br>
                        • <strong>Rule ID:</strong> #${res.post.rule_id} (Follow-First Gate Armed)
                    </div>
                `;
            }

            await this.loadPosts();
        } catch (err) {
            App.showToast('Failed to ingest post: ' + err.message, 'error');
            if (banner) {
                banner.style.display = 'block';
                banner.innerHTML = `
                    <div style="background: #FFEBEE; border: 1.5px solid #EF9A9A; border-radius: 12px; padding: 1rem; color: #C62828; font-size: 0.88rem;">
                        ❌ Ingestion Error: ${err.message}
                    </div>
                `;
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '⚡ Ingest Test Post';
            }
        }
    },

    async loadPosts() {
        const container = document.getElementById('agent-posts-list');
        const countBadge = document.getElementById('agent-posts-count');
        if (!container) return;

        try {
            const res = await App.apiCall('GET', '/api/agent/posts');
            this.posts = res.posts || [];

            if (countBadge) {
                countBadge.textContent = `${this.posts.length} Posts Armed`;
            }

            if (this.posts.length === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="background: #FFFFFF; border-radius: 16px; border: 1.5px dashed #E6E1D8; padding: 3rem; text-align: center;">
                        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.75rem;">📡</span>
                        <h3 style="font-weight: 800; font-size: 1.2rem; color: #2C2A29; margin-bottom: 0.35rem;">No External Posts Linked Yet</h3>
                        <p style="font-size: 0.88rem; color: #736E68; max-width: 460px; margin: 0 auto 1.25rem auto;">
                            Ping the Inbound Webhook Bridge from your content creation app, or click <strong>Scan Feed</strong> to auto-detect posts published directly on Instagram!
                        </p>
                        <button class="btn btn-primary btn-sm" onclick="agentView.simulateInboundPost()" style="font-weight: 800; border-radius: 10px; padding: 0.6rem 1.4rem;">
                            ⚡ Ingest Demo Test Post
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${this.posts.map(p => `
                        <div class="card" style="border-radius: 14px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.35rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); display: grid; grid-template-columns: 1fr auto; gap: 1.25rem; align-items: center;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.45rem;">
                                    <span style="font-size: 0.76rem; font-weight: 800; background: #FAF0EC; color: #D97757; padding: 0.2rem 0.65rem; border-radius: 6px; letter-spacing: 0.04em;">
                                        TRIGGER: ${p.keyword}
                                    </span>
                                    <span style="font-size: 0.75rem; font-weight: 700; color: #736E68;">
                                        Media ID: <code>${p.media_id}</code>
                                    </span>
                                    <span style="font-size: 0.72rem; color: #8C827A;">• ${new Date(p.created_at || Date.now()).toLocaleDateString()}</span>
                                </div>
                                
                                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.08rem; margin: 0 0 0.35rem 0; color: #2C2A29;">
                                    ${p.lead_magnet_title || p.topic || 'Instagram Post'}
                                </h3>

                                <div style="font-size: 0.82rem; color: #736E68; margin-bottom: 0.65rem; max-width: 800px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    ${(p.caption || 'No caption available').replace(/\n/g, ' ')}
                                </div>

                                <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; font-size: 0.82rem; color: #736E68;">
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <span>💬</span> <strong>${p.comments_count || 0}</strong> comments
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <span>📬</span> <strong>${p.dms_sent || 0}</strong> DMs sent
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <span>🔗</span> <strong>${p.clicks_count || 0}</strong> doc clicks
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <a href="${p.deliverable_url}" target="_blank" style="color: #D97757; font-weight: 700; text-decoration: none;">
                                            📖 External Guide Link ↗
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
                                <button class="btn btn-primary btn-sm" style="font-weight: 800; font-size: 0.82rem; padding: 0.5rem 1.15rem; border-radius: 9px; white-space: nowrap;" onclick="agentView.simulateComment('${p.media_id}', '${p.keyword}')">
                                    🧪 Test Follower Comment & Gate
                                </button>
                                <a href="${p.deliverable_url}" target="_blank" class="btn btn-secondary btn-sm" style="font-weight: 700; font-size: 0.8rem; padding: 0.4rem 0.95rem; border-radius: 9px; text-decoration: none; text-align: center; width: 100%;">
                                    🔗 Open Doc Link
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (err) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Error loading armed posts</h3>
                    <p>${err.message}</p>
                </div>
            `;
        }
    },

    async simulateComment(mediaId, keyword) {
        try {
            const fakeUser = 'follower_' + Math.floor(100 + Math.random() * 900);
            App.showToast(`Simulating comment "${keyword}" from @${fakeUser}...`, 'info');

            const res = await App.apiCall('POST', '/api/agent/simulate-comment', {
                media_id: mediaId,
                keyword: keyword,
                username: fakeUser
            });

            App.showToast(res.message || 'Follower comment triggered Follow-First funnel!', 'success');
            await this.loadPosts();
        } catch (err) {
            App.showToast('Failed to simulate comment: ' + err.message, 'error');
        }
    },

    refresh() {
        this.loadPosts();
    }
};
window.agent = window.agentView;
