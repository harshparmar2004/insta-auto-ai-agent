// Autonomous Instagram AI Agent Sentinel & High-Scale Bridge View
window.agentView = {
    posts: [],
    filteredPosts: [],
    bridgeConfig: null,
    autoPilotActive: false,
    activeSnippetTab: 'curl_batch',
    searchQuery: '',

    async render(container) {
        const currentHost = window.location.origin;
        const bridgeUrl = `${currentHost}/api/agent/bridge`;
        const batchBridgeUrl = `${currentHost}/api/agent/bridge/batch`;

        container.innerHTML = `
            <div class="view" id="agent-view" style="width: 100%; max-width: 1480px; margin: 0 auto;">
                <!-- PAGE HEADER -->
                <div class="page-header" style="margin-bottom: 1.5rem;">
                    <div class="page-title">
                        <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem;">
                            <span style="font-size: 1.75rem;">🤖</span>
                            <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.85rem; letter-spacing: -0.03em; margin: 0;">AI Agent Studio: Multi-Reel Sentinel & Bridge</h1>
                            <span id="autopilot-status-badge" style="padding: 0.2rem 0.65rem; border-radius: 999px; background: #E8F5E9; color: #2E7D32; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">Auto-Pilot Active</span>
                        </div>
                        <p style="font-size: 0.92rem; color: var(--text-secondary); margin: 0;">
                            High-scale automation bridge: Links your external research & content creation platform. Automatically maps hundreds of Reels to their unique keywords (e.g. <code>DRAG</code>, <code>RAG</code>) and companion Google Docs/deliverable links with zero manual effort.
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.65rem; align-items: center;">
                        <button class="btn btn-secondary btn-sm" style="font-weight: 700; padding: 0.58rem 1.15rem; font-size: 0.88rem; border-radius: 10px;" onclick="agentView.loadPosts()">
                            🔄 Refresh
                        </button>
                        <button class="btn btn-primary btn-sm" id="btn-scan-feed" style="font-weight: 800; padding: 0.58rem 1.35rem; font-size: 0.88rem; border-radius: 10px; box-shadow: 0 4px 14px rgba(217,119,87,0.3);" onclick="agentView.scanFeed()">
                            <span>🔍 Scan Feed Now</span>
                        </button>
                    </div>
                </div>

                <!-- AUTOPILOT BANNER -->
                <div style="background: #FAF8F5; border-radius: 14px; border: 1.5px solid #E6E1D8; padding: 1rem 1.25rem; margin-bottom: 1.75rem; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                        <div id="autopilot-pulse" style="width: 12px; height: 12px; border-radius: 50%; background: #2E7D32; box-shadow: 0 0 10px rgba(46,125,50,0.5);"></div>
                        <div>
                            <div style="font-weight: 800; font-size: 0.95rem; color: #2C2A29;" id="autopilot-banner-title">Continuous Auto-Pilot Sentinel: ACTIVE</div>
                            <div style="font-size: 0.82rem; color: #736E68;">Automatically checks your connected Instagram account (@harshparmar007__) every 10 mins and auto-arms every newly posted Reel!</div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm" id="btn-toggle-autopilot" onclick="agentView.toggleAutoPilot()" style="font-weight: 800; font-size: 0.82rem; border-radius: 8px; padding: 0.45rem 1rem;">
                        ⏸️ Pause Auto-Pilot
                    </button>
                </div>

                <!-- TOP SECTION: 3 FEATURE CARDS -->
                <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1.5rem; margin-bottom: 2rem;">
                    
                    <!-- CARD 1: INBOUND WEBHOOK & BATCH BRIDGE -->
                    <div class="card" style="border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.6rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                            <div>
                                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.18rem; letter-spacing: -0.02em; margin: 0 0 0.2rem 0;">
                                    📡 Inbound Webhook Bridge (Single & Batch)
                                </h3>
                                <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">
                                    Send reels individually or in bulk batches (10 to 100+ reels) directly from your research app.
                                </p>
                            </div>
                            <span style="font-size: 0.76rem; font-weight: 800; color: #2E7D32; background: #E8F5E9; padding: 0.25rem 0.65rem; border-radius: 8px;">
                                ⚡ Bulk Ready
                            </span>
                        </div>

                        <!-- ENDPOINT URLS -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
                            <div>
                                <label style="font-size: 0.75rem; font-weight: 700; color: #736E68; display: block; margin-bottom: 0.25rem;">
                                    Single Reel Webhook (POST)
                                </label>
                                <input type="text" readonly value="${bridgeUrl}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.8rem; font-weight: 700; font-family: monospace; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FAF8F5;">
                            </div>
                            <div>
                                <label style="font-size: 0.75rem; font-weight: 700; color: #736E68; display: block; margin-bottom: 0.25rem;">
                                    Batch Multi-Reel Webhook (POST)
                                </label>
                                <input type="text" readonly value="${batchBridgeUrl}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.8rem; font-weight: 700; font-family: monospace; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FAF8F5;">
                            </div>
                        </div>

                        <!-- CODE SNIPPETS ACCORDION -->
                        <div style="margin-top: 0.75rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="font-size: 0.78rem; font-weight: 800; color: #2C2A29;">Sample Code for External App:</span>
                                <div style="display: flex; gap: 0.35rem;">
                                    <button class="btn btn-sm btn-snippet" id="tab-curl-batch" onclick="agentView.switchTab('curl_batch')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #D97757; color: #FFF;">cURL Batch</button>
                                    <button class="btn btn-sm btn-snippet" id="tab-python" onclick="agentView.switchTab('python')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FAF8F5; color: #736E68;">Python Batch</button>
                                    <button class="btn btn-sm btn-snippet" id="tab-node" onclick="agentView.switchTab('node')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FAF8F5; color: #736E68;">Node.js</button>
                                </div>
                            </div>

                            <pre id="snippet-code" style="background: #1E1E1E; color: #D4D4D4; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.76rem; font-family: monospace; overflow-x: auto; margin: 0; line-height: 1.45;"></pre>
                        </div>
                    </div>

                    <!-- CARD 2: GOOGLE SHEETS DELIVERABLES SYNC -->
                    <div class="card" style="border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.6rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.18rem; letter-spacing: -0.02em; margin: 0;">
                                    📊 Google Sheets Deliverables Sync
                                </h3>
                                <span style="font-size: 0.74rem; font-weight: 700; color: #0D47A1; background: #E3F2FD; padding: 0.25rem 0.6rem; border-radius: 6px;">
                                    Sheets Bridge
                                </span>
                            </div>

                            <p style="font-size: 0.84rem; color: #736E68; margin-bottom: 1rem; line-height: 1.45;">
                                When your research app writes doc links and keywords into a Google Sheet, InstaAuto can sync all rows directly:
                            </p>

                            <div style="margin-bottom: 1rem;">
                                <label style="font-size: 0.76rem; font-weight: 700; color: #736E68; display: block; margin-bottom: 0.35rem;">
                                    Google Sheet Published CSV or Webhook URL
                                </label>
                                <input type="text" id="sheet-sync-url" placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv" style="width: 100%; padding: 0.65rem 0.85rem; font-size: 0.82rem; font-family: monospace; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FAF8F5;">
                            </div>

                            <div style="background: #FAF8F5; border-radius: 10px; border: 1px solid #E6E1D8; padding: 0.75rem 0.95rem; font-size: 0.78rem; margin-bottom: 1.25rem;">
                                <div style="font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem;">📋 Expected Sheet Columns:</div>
                                <div style="color: #736E68;">
                                    <code>Reel ID</code> (or Instagram Link), <code>Keyword</code> (e.g. DRAG, RAG), <code>Deliverable Link</code> (Google Doc / Notion URL), <code>Topic</code>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <button class="btn btn-primary w-full" id="btn-sync-sheet" onclick="agentView.syncGoogleSheet()" style="padding: 0.75rem; font-weight: 800; font-size: 0.9rem; border-radius: 12px; box-shadow: 0 4px 14px rgba(217,119,87,0.3);">
                                📊 Sync Deliverables from Google Sheet Now
                            </button>
                            <button type="button" class="btn btn-secondary w-full btn-sm" onclick="agentView.toggleAppsScript()" style="font-size: 0.8rem; font-weight: 700; border-radius: 8px;">
                                ⚡ View Google Apps Script Real-Time Code
                            </button>
                        </div>
                        <div id="apps-script-container" style="display: none; margin-top: 1rem; background: #2C2A29; border-radius: 10px; padding: 1rem; font-family: monospace; font-size: 0.76rem; color: #E6E1D8; position: relative;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="color: #D97757; font-weight: 700;">Google Sheets Auto-Trigger (Extensions > Apps Script):</span>
                                <button onclick="agentView.copyAppsScript()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; cursor: pointer;">📋 Copy</button>
                            </div>
                            <pre id="apps-script-code" style="margin: 0; white-space: pre-wrap; word-break: break-all; max-height: 180px; overflow-y: auto;"></pre>
                        </div>
                    </div>

                </div>

                <!-- TEST SIMULATOR CARD -->
                <div class="card" style="margin-bottom: 2rem; border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FAF8F5; padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem; margin: 0;">
                            🧪 Inbound Post Simulator (Test Single Reel Ingestion)
                        </h3>
                        <span style="font-size: 0.78rem; color: #736E68; font-weight: 600;">Simulate your external app sending a post with custom keyword & doc</span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1.2fr 1fr auto; gap: 0.75rem; align-items: center;">
                        <input type="text" id="sim-media-id" class="input" placeholder="Media ID (e.g. 1804910...)" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                        <input type="text" id="sim-caption" class="input" placeholder="Caption" value="Comment DRAG below to get the full architecture guide and code templates!" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                        <input type="url" id="sim-doc-url" class="input" placeholder="Google Doc / Notion URL" value="https://docs.google.com/document/d/1drag_architecture_guide/view" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                        <button class="btn btn-primary btn-sm" id="btn-simulate-inbound" onclick="agentView.simulateInboundPost()" style="font-weight: 800; padding: 0.7rem 1.25rem; font-size: 0.85rem; border-radius: 10px; white-space: nowrap;">
                            ⚡ Ingest Test Reel
                        </button>
                    </div>

                    <div id="sim-result-banner" style="display: none; margin-top: 1rem;"></div>
                </div>

                <!-- ARMED REELS MATRIX TABLE SECTION -->
                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.35rem; letter-spacing: -0.02em; margin: 0;">
                                Per-Reel Automation Matrix
                            </h2>
                            <span id="agent-posts-count" style="font-size: 0.84rem; font-weight: 700; color: var(--text-secondary);">Loading...</span>
                        </div>
                        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                            <input type="text" id="matrix-search-input" placeholder="Filter by keyword (e.g. DRAG, RAG) or Reel ID..." oninput="agentView.filterPosts(this.value)" style="padding: 0.45rem 0.85rem; font-size: 0.82rem; border-radius: 8px; border: 1.5px solid #E6E1D8; width: 260px; background: #FFFFFF;">
                            <button class="btn btn-secondary btn-sm" onclick="agentView.cleanTestData()" style="font-size: 0.78rem; font-weight: 700; padding: 0.45rem 0.75rem; border-radius: 8px;" title="Clear mock demonstration reels">
                                🧹 Clear Test Reels
                            </button>
                        </div>
                    </div>

                    <div id="agent-posts-list">
                        <div class="text-center" style="padding: 3rem;"><div class="spinner"></div></div>
                    </div>
                </div>

            </div>
        `;

        this.renderSnippet();
        await this.checkAutoPilot();
        await this.loadConfig();
        await this.loadPosts();
    },

    switchTab(tab) {
        this.activeSnippetTab = tab;
        ['curl_batch', 'python', 'node'].forEach(t => {
            const btn = document.getElementById('tab-' + t.replace('_', '-'));
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
        const batchBridgeUrl = `${currentHost}/api/agent/bridge/batch`;

        if (this.activeSnippetTab === 'curl_batch') {
            el.textContent = `curl -X POST ${batchBridgeUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "posts": [
      {
        "media_id": "18049102948201941",
        "caption": "Production RAG in 2026! Comment RAG below for the guide.",
        "deliverable_url": "https://docs.google.com/document/d/rag-guide/view"
      },
      {
        "media_id": "18049102948201942",
        "caption": "Zero to One Micro-SaaS. Comment DRAG below for templates!",
        "deliverable_url": "https://docs.google.com/document/d/drag-guide/view"
      }
    ]
  }'`;
        } else if (this.activeSnippetTab === 'python') {
            el.textContent = `import requests

url = "${batchBridgeUrl}"
payload = {
    "posts": [
        {
            "media_id": reel_id_1,
            "caption": "Comment 'RAG' to get the full guide!",
            "deliverable_url": "https://docs.google.com/document/d/rag-v1/view"
        },
        {
            "media_id": reel_id_2,
            "caption": "Comment DRAG below!",
            "deliverable_url": "https://docs.google.com/document/d/drag-v1/view"
        }
    ]
}
res = requests.post(url, json=payload)
print(res.json())`;
        } else if (this.activeSnippetTab === 'node') {
            el.textContent = `const axios = require('axios');

await axios.post('${batchBridgeUrl}', {
    posts: [
        { media_id: '18049102948201941', caption: 'Comment RAG', deliverable_url: 'https://...' },
        { media_id: '18049102948201942', caption: 'Comment DRAG', deliverable_url: 'https://...' }
    ]
});`;
        }
    },

    async loadConfig() {
        try {
            const config = await App.apiCall('GET', '/api/agent/bridge-config');
            if (config.agentSheetUrl) {
                const input = document.getElementById('sheet-sync-url');
                if (input && !input.value) {
                    input.value = config.agentSheetUrl;
                }
            }
            this.cachedAppsScript = config.googleAppsScriptExample || '';
            const pre = document.getElementById('apps-script-code');
            if (pre && this.cachedAppsScript) {
                pre.textContent = this.cachedAppsScript;
            }
        } catch (e) {}
    },

    toggleAppsScript() {
        const c = document.getElementById('apps-script-container');
        if (c) {
            c.style.display = c.style.display === 'none' ? 'block' : 'none';
        }
    },

    copyAppsScript() {
        const text = this.cachedAppsScript || (document.getElementById('apps-script-code')?.textContent);
        if (text) {
            navigator.clipboard.writeText(text);
            App.showToast('📋 Google Apps Script copied to clipboard!', 'success');
        }
    },

    async cleanTestData() {
        if (!confirm('Clear synthetic demonstration test reels from the matrix?')) return;
        try {
            const res = await App.apiCall('POST', '/api/agent/cleanup-test-data');
            App.showToast(res.message || 'Test data cleared!', 'success');
            await this.loadPosts();
        } catch (err) {
            App.showToast('Error cleaning test data: ' + err.message, 'error');
        }
    },

    async checkAutoPilot() {
        try {
            const res = await App.apiCall('GET', '/api/agent/auto-pilot/status');
            this.autoPilotActive = res.autoPilot;
            this.updateAutoPilotUI();
        } catch (e) {}
    },

    async toggleAutoPilot() {
        try {
            const res = await App.apiCall('POST', '/api/agent/auto-pilot/toggle');
            this.autoPilotActive = res.autoPilot;
            this.updateAutoPilotUI();
            App.showToast(res.message, 'info');
        } catch (err) {
            App.showToast('Auto-pilot toggle error: ' + err.message, 'error');
        }
    },

    updateAutoPilotUI() {
        const badge = document.getElementById('autopilot-status-badge');
        const pulse = document.getElementById('autopilot-pulse');
        const title = document.getElementById('autopilot-banner-title');
        const btn = document.getElementById('btn-toggle-autopilot');

        if (this.autoPilotActive) {
            if (badge) {
                badge.textContent = 'Auto-Pilot Active';
                badge.style.background = '#E8F5E9';
                badge.style.color = '#2E7D32';
            }
            if (pulse) {
                pulse.style.background = '#2E7D32';
                pulse.style.boxShadow = '0 0 10px rgba(46,125,50,0.5)';
            }
            if (title) title.textContent = 'Continuous Auto-Pilot Sentinel: ACTIVE';
            if (btn) {
                btn.textContent = '⏸️ Pause Auto-Pilot';
                btn.className = 'btn btn-secondary btn-sm';
            }
        } else {
            if (badge) {
                badge.textContent = 'Auto-Pilot Paused';
                badge.style.background = '#FFF3E0';
                badge.style.color = '#E65100';
            }
            if (pulse) {
                pulse.style.background = '#E65100';
                pulse.style.boxShadow = 'none';
            }
            if (title) title.textContent = 'Continuous Auto-Pilot Sentinel: PAUSED';
            if (btn) {
                btn.textContent = '▶️ Activate Auto-Pilot';
                btn.className = 'btn btn-primary btn-sm';
            }
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

    async syncGoogleSheet() {
        const input = document.getElementById('sheet-sync-url');
        const url = (input ? input.value : '').trim();
        const btn = document.getElementById('btn-sync-sheet');
        const origHtml = btn ? btn.innerHTML : '';

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;"></span> Syncing Google Sheet...';
        }

        try {
            App.showToast('📊 Fetching deliverable mappings from Google Sheet...', 'info');
            const res = await App.apiCall('POST', '/api/agent/sync-sheet', { sheet_url: url || null });
            App.showToast(res.message || 'Google Sheet sync complete!', 'success');
            await this.loadPosts();
        } catch (err) {
            App.showToast('Google Sheet sync error: ' + err.message, 'error');
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

            App.showToast(`⚡ Reel ${res.post.media_id} armed with keyword "${res.post.keyword}"!`, 'success');

            if (banner) {
                banner.style.display = 'block';
                banner.innerHTML = `
                    <div style="background: #E8F5E9; border: 1.5px solid #81C784; border-radius: 12px; padding: 1rem; color: #1B5E20; font-size: 0.88rem;">
                        <strong>✅ Reel Ingested & Rule Armed Successfully!</strong><br>
                        • <strong>Reel Media ID:</strong> ${res.post.media_id}<br>
                        • <strong>Extracted Trigger Keyword:</strong> <span style="background: #C8E6C9; padding: 2px 7px; border-radius: 5px; font-weight: 800;">${res.post.keyword}</span><br>
                        • <strong>Bound Deliverable URL:</strong> <a href="${res.post.deliverable_url}" target="_blank" style="color: #2E7D32; font-weight: 700; text-decoration: underline;">${res.post.deliverable_url}</a><br>
                        • <strong>Rule ID:</strong> #${res.post.rule_id} (Follow-First Gate Armed)
                    </div>
                `;
            }

            await this.loadPosts();
        } catch (err) {
            App.showToast('Failed to ingest reel: ' + err.message, 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '⚡ Ingest Test Reel';
            }
        }
    },

    filterPosts(query) {
        this.searchQuery = (query || '').toLowerCase().trim();
        if (!this.searchQuery) {
            this.filteredPosts = this.posts;
        } else {
            this.filteredPosts = this.posts.filter(p => 
                (p.keyword && p.keyword.toLowerCase().includes(this.searchQuery)) ||
                (p.media_id && p.media_id.toLowerCase().includes(this.searchQuery)) ||
                (p.lead_magnet_title && p.lead_magnet_title.toLowerCase().includes(this.searchQuery)) ||
                (p.caption && p.caption.toLowerCase().includes(this.searchQuery))
            );
        }
        this.renderPostsList();
    },

    async loadPosts() {
        const container = document.getElementById('agent-posts-list');
        const countBadge = document.getElementById('agent-posts-count');
        if (!container) return;

        try {
            const res = await App.apiCall('GET', '/api/agent/posts');
            this.posts = res.posts || [];
            this.filteredPosts = this.searchQuery ? this.posts.filter(p => 
                (p.keyword && p.keyword.toLowerCase().includes(this.searchQuery)) ||
                (p.media_id && p.media_id.toLowerCase().includes(this.searchQuery))
            ) : this.posts;

            if (countBadge) {
                countBadge.textContent = `${this.posts.length} Reels Armed`;
            }

            this.renderPostsList();
        } catch (err) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Error loading armed reels</h3>
                    <p>${err.message}</p>
                </div>
            `;
        }
    },

    renderPostsList() {
        const container = document.getElementById('agent-posts-list');
        if (!container) return;

        if (this.filteredPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="background: #FFFFFF; border-radius: 16px; border: 1.5px dashed #E6E1D8; padding: 3rem; text-align: center;">
                    <span style="font-size: 2.5rem; display: block; margin-bottom: 0.75rem;">📡</span>
                    <h3 style="font-weight: 800; font-size: 1.2rem; color: #2C2A29; margin-bottom: 0.35rem;">No Reels Found</h3>
                    <p style="font-size: 0.88rem; color: #736E68; max-width: 460px; margin: 0 auto 1.25rem auto;">
                        Click <strong>Scan Feed Now</strong> or ingest test posts to see the Per-Reel Automation Matrix populate!
                    </p>
                    <button class="btn btn-primary btn-sm" onclick="agentView.simulateInboundPost()" style="font-weight: 800; border-radius: 10px; padding: 0.6rem 1.4rem;">
                        ⚡ Ingest Demo Test Reel
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${this.filteredPosts.map(p => `
                    <div class="card" style="border-radius: 14px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.35rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); display: grid; grid-template-columns: 1fr auto; gap: 1.25rem; align-items: center;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.45rem;">
                                <span style="font-size: 0.78rem; font-weight: 800; background: #FAF0EC; color: #D97757; padding: 0.25rem 0.75rem; border-radius: 6px; letter-spacing: 0.04em;">
                                    TRIGGER: ${p.keyword}
                                </span>
                                <span style="font-size: 0.75rem; font-weight: 700; color: #736E68;">
                                    Reel ID: <code>${p.media_id}</code>
                                </span>
                                <span style="font-size: 0.72rem; color: #8C827A;">• ${new Date(p.created_at || Date.now()).toLocaleDateString()}</span>
                                <span style="font-size: 0.7rem; font-weight: 700; color: #2E7D32; background: #E8F5E9; padding: 2px 6px; border-radius: 4px;">
                                    🟢 Follow-First Armed
                                </span>
                            </div>
                            
                            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.08rem; margin: 0 0 0.35rem 0; color: #2C2A29;">
                                ${p.lead_magnet_title || p.topic || 'Instagram Reel'}
                            </h3>

                            <div style="font-size: 0.82rem; color: #736E68; margin-bottom: 0.65rem; max-width: 800px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${(p.caption || 'No caption').replace(/\n/g, ' ')}
                            </div>

                            <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; font-size: 0.82rem; color: #736E68;">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <span>💬</span> <strong>${p.comments_count || 0}</strong> comments
                                </div>
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <span>📬</span> <strong>${p.dms_sent || 0}</strong> DMs sent
                                </div>
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <span>🔗</span> <strong>${p.clicks_count || 0}</strong> deliverable clicks
                                </div>
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <a href="${p.deliverable_url}" target="_blank" style="color: #D97757; font-weight: 700; text-decoration: none;">
                                        📖 Open Deliverable Link ↗
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
    },

    async simulateComment(mediaId, keyword) {
        try {
            const fakeUser = 'follower_' + Math.floor(100 + Math.random() * 900);
            App.showToast(`Simulating comment "${keyword}" on Reel ${mediaId} from @${fakeUser}...`, 'info');

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
