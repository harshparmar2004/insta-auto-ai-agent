// Autonomous Instagram AI Agent Studio View
window.agentView = {
    campaigns: [],
    loading: false,

    async render(container) {
        container.innerHTML = `
            <div class="view" id="agent-view" style="width: 100%; max-width: 1480px; margin: 0 auto;">
                <!-- PAGE HEADER -->
                <div class="page-header" style="margin-bottom: 1.5rem;">
                    <div class="page-title">
                        <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem;">
                            <span style="font-size: 1.75rem;">🤖</span>
                            <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.85rem; letter-spacing: -0.03em; margin: 0;">AI Agent Studio</h1>
                            <span style="padding: 0.2rem 0.6rem; border-radius: 999px; background: #FAF0EC; color: #D97757; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">Autonomous 1-Click</span>
                        </div>
                        <p style="font-size: 0.92rem; color: var(--text-secondary); margin: 0;">
                            Zero-touch growth flywheel: Autonomous topic research, companion lead-magnet document creation, Reel publishing, and instant Follow-First DM funnel arming.
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.65rem; align-items: center;">
                        <button class="btn btn-secondary btn-sm" style="font-weight: 700; padding: 0.58rem 1.15rem; font-size: 0.88rem; border-radius: 10px;" onclick="agentView.loadCampaigns()">
                            🔄 Refresh Campaigns
                        </button>
                    </div>
                </div>

                <!-- 1-CLICK LAUNCHPAD SECTION -->
                <div class="card" style="margin-bottom: 2rem; border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.75rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                        <div>
                            <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.25rem; letter-spacing: -0.02em; margin: 0 0 0.25rem 0;">🚀 1-Click Autonomous Flywheel</h3>
                            <p style="font-size: 0.86rem; color: var(--text-secondary); margin: 0;">Provide a topic or let the Agent scan trends to craft the script, generate deliverable guide, upload the Reel, and provision the DM trigger.</p>
                        </div>
                        <span style="font-size: 0.8rem; font-weight: 700; color: #2E7D32; background: #E8F5E9; padding: 0.3rem 0.75rem; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
                            <span style="width: 7px; height: 7px; border-radius: 50%; background: #2E7D32; display: inline-block;"></span>
                            Agent Engine Active
                        </span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 0.85rem; align-items: center; margin-bottom: 1.25rem;">
                        <div style="position: relative;">
                            <input type="text" id="agent-topic-input" class="input" placeholder="Enter topic (e.g. 'Advanced System Design Patterns', 'NextJS 15 Turbo Guide') or leave empty for auto-trend..." style="width: 100%; padding: 0.85rem 1.15rem; font-size: 0.95rem; font-weight: 600; border-radius: 12px; border: 1.5px solid #E6E1D8; background: #FAF8F5; outline: none;">
                        </div>
                        <button class="btn btn-secondary" onclick="agentView.pickRandomTopic()" style="padding: 0.85rem 1.2rem; font-weight: 700; border-radius: 12px; white-space: nowrap;">
                            🎲 Suggest Topic
                        </button>
                        <button class="btn btn-primary" id="btn-launch-campaign" onclick="agentView.launchAutonomousRun()" style="padding: 0.85rem 1.6rem; font-weight: 800; font-size: 0.95rem; border-radius: 12px; box-shadow: 0 4px 14px rgba(217,119,87,0.3); white-space: nowrap;">
                            <span>🚀 Launch Campaign</span>
                        </button>
                    </div>

                    <!-- PROGRESS STEPPER CONSOLE -->
                    <div id="agent-stepper" style="display: none; background: #FAF8F5; border-radius: 12px; border: 1px solid #E6E1D8; padding: 1.25rem; margin-top: 1.25rem;">
                        <div style="font-size: 0.85rem; font-weight: 800; color: #2C2A29; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 8px;">
                            <span class="spinner" style="width: 16px; height: 16px;"></span>
                            <span>Autonomous Agent Execution in Progress...</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
                            <div class="step-box" id="step-1" style="background: #FFF; padding: 0.85rem; border-radius: 8px; border: 1px solid #E6E1D8; font-size: 0.78rem;">
                                <div style="font-weight: 800; color: #D97757;">STEP 1</div>
                                <div style="color: #2C2A29; font-weight: 600; margin-top: 2px;">Topic & Keyword AI Research</div>
                            </div>
                            <div class="step-box" id="step-2" style="background: #FFF; padding: 0.85rem; border-radius: 8px; border: 1px solid #E6E1D8; font-size: 0.78rem;">
                                <div style="font-weight: 800; color: #D97757;">STEP 2</div>
                                <div style="color: #2C2A29; font-weight: 600; margin-top: 2px;">Generate Lead Magnet Doc</div>
                            </div>
                            <div class="step-box" id="step-3" style="background: #FFF; padding: 0.85rem; border-radius: 8px; border: 1px solid #E6E1D8; font-size: 0.78rem;">
                                <div style="font-weight: 800; color: #D97757;">STEP 3</div>
                                <div style="color: #2C2A29; font-weight: 600; margin-top: 2px;">Publish Reel via Meta API</div>
                            </div>
                            <div class="step-box" id="step-4" style="background: #FFF; padding: 0.85rem; border-radius: 8px; border: 1px solid #E6E1D8; font-size: 0.78rem;">
                                <div style="font-weight: 800; color: #D97757;">STEP 4</div>
                                <div style="color: #2C2A29; font-weight: 600; margin-top: 2px;">Arm Follow-First DM Gate</div>
                            </div>
                        </div>
                    </div>

                    <!-- RUN RESULT BANNER -->
                    <div id="agent-run-result" style="display: none; margin-top: 1.25rem;"></div>
                </div>

                <!-- ACTIVE CAMPAIGNS OVERVIEW -->
                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.35rem; letter-spacing: -0.02em; margin: 0;">
                            Active Autonomous Campaigns
                        </h2>
                        <span id="agent-campaign-count" style="font-size: 0.84rem; font-weight: 700; color: var(--text-secondary);">Loading...</span>
                    </div>

                    <div id="agent-campaigns-list">
                        <div class="text-center" style="padding: 3rem;"><div class="spinner"></div></div>
                    </div>
                </div>

                <!-- EXTERNAL AGENT HANDOFF ARCHITECTURE INFO -->
                <div class="card" style="border-radius: 16px; border: 1px solid #E6E1D8; background: #FAF8F5; padding: 1.5rem;">
                    <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem; margin: 0 0 0.5rem 0;">
                        🔌 External Agent Handoff API
                    </h3>
                    <p style="font-size: 0.86rem; color: #736E68; margin-bottom: 1rem;">
                        Have an external research agent, Python script, or LangChain bot? You can directly provision Follow-First funnels on any Reel instantly via our open HTTP endpoint:
                    </p>
                    <pre style="background: #1E1E1E; color: #E6E1D8; padding: 1rem; border-radius: 10px; font-size: 0.8rem; overflow-x: auto; font-family: monospace; margin: 0;">
curl -X POST http://localhost:3000/api/agent/provision \
  -H "Content-Type: application/json" \
  -d '{
    "media_id": "17841409999999999",
    "trigger_keyword": "DESIGN",
    "deliverable_url": "https://instaauto.app/resources/system-design-blueprint",
    "lead_magnet_title": "System Design High-Scale Architecture Blueprint"
  }'</pre>
                </div>
            </div>
        `;

        await this.loadCampaigns();
    },

    pickRandomTopic() {
        const ideas = [
            "Micro-SaaS Architecture Blueprint with Node.js & Docker",
            "Mastering Meta Graph API Webhooks & High-Volume DMs",
            "Autonomous Multi-Agent Systems in Production 2026",
            "High-Converting Instagram Reel Funnels & Lead Magnets",
            "Full-Stack Realtime Apps with WebSockets & SQLite",
            "System Design Cheat Sheet for Software Engineers"
        ];
        const random = ideas[Math.floor(Math.random() * ideas.length)];
        const input = document.getElementById('agent-topic-input');
        if (input) input.value = random;
    },

    async launchAutonomousRun() {
        const input = document.getElementById('agent-topic-input');
        const topic = (input ? input.value : '').trim();
        const btn = document.getElementById('btn-launch-campaign');
        const stepper = document.getElementById('agent-stepper');
        const resultContainer = document.getElementById('agent-run-result');

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;"></span> Running Agent...';
        }
        if (stepper) stepper.style.display = 'block';
        if (resultContainer) resultContainer.style.display = 'none';

        // Step simulation UI indicator
        this.highlightStep(1);
        const timer2 = setTimeout(() => this.highlightStep(2), 700);
        const timer3 = setTimeout(() => this.highlightStep(3), 1400);
        const timer4 = setTimeout(() => this.highlightStep(4), 2100);

        try {
            const res = await App.apiCall('POST', '/api/agent/run', { topic });
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            this.highlightStep(4, true);

            App.showToast('🚀 Autonomous Campaign Successfully Launched!', 'success');

            if (resultContainer && res.campaign) {
                resultContainer.style.display = 'block';
                resultContainer.innerHTML = `
                    <div style="background: #E8F5E9; border: 1.5px solid #81C784; border-radius: 12px; padding: 1.25rem; color: #1B5E20;">
                        <div style="font-weight: 800; font-size: 1rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 6px;">
                            <span>✅</span> Autonomous Loop Complete & Armed!
                        </div>
                        <div style="font-size: 0.88rem; margin-bottom: 0.65rem;">
                            <strong>Topic:</strong> ${res.campaign.topic}<br>
                            <strong>Trigger Keyword:</strong> <span style="font-weight: 800; background: #C8E6C9; padding: 2px 8px; border-radius: 6px; color: #1B5E20;">${res.campaign.keyword}</span><br>
                            <strong>Deliverable Guide:</strong> <a href="${res.campaign.deliverableUrl}" target="_blank" style="color: #2E7D32; font-weight: 700; text-decoration: underline;">${res.campaign.deliverableUrl}</a><br>
                            <strong>Reel Media ID:</strong> ${res.campaign.mediaId} | <strong>Rule ID:</strong> #${res.campaign.ruleId}
                        </div>
                        <button class="btn btn-primary btn-sm" style="font-weight: 800; font-size: 0.82rem; padding: 0.45rem 1rem; border-radius: 8px;" onclick="agentView.simulateComment('${res.campaign.mediaId}', '${res.campaign.keyword}')">
                            🧪 Test Follower Comment & Gate
                        </button>
                    </div>
                `;
            }

            if (input) input.value = '';
            await this.loadCampaigns();
        } catch (err) {
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            App.showToast('Failed to run agent: ' + err.message, 'error');
            if (resultContainer) {
                resultContainer.style.display = 'block';
                resultContainer.innerHTML = `
                    <div style="background: #FFEBEE; border: 1.5px solid #EF9A9A; border-radius: 12px; padding: 1.25rem; color: #C62828;">
                        <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.25rem;">❌ Execution Error</div>
                        <div style="font-size: 0.85rem;">${err.message}</div>
                    </div>
                `;
            }
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span>🚀 Launch Campaign</span>';
            }
        }
    },

    highlightStep(num, done = false) {
        for (let i = 1; i <= 4; i++) {
            const el = document.getElementById('step-' + i);
            if (!el) continue;
            if (i < num || done) {
                el.style.background = '#E8F5E9';
                el.style.borderColor = '#81C784';
            } else if (i === num) {
                el.style.background = '#FAF0EC';
                el.style.borderColor = '#D97757';
            } else {
                el.style.background = '#FFFFFF';
                el.style.borderColor = '#E6E1D8';
            }
        }
    },

    async loadCampaigns() {
        const container = document.getElementById('agent-campaigns-list');
        const countBadge = document.getElementById('agent-campaign-count');
        if (!container) return;

        try {
            const res = await App.apiCall('GET', '/api/agent/campaigns');
            this.campaigns = res.campaigns || [];

            if (countBadge) {
                countBadge.textContent = `${this.campaigns.length} Campaigns Armed`;
            }

            if (this.campaigns.length === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="background: #FFFFFF; border-radius: 16px; border: 1.5px dashed #E6E1D8; padding: 3rem; text-align: center;">
                        <span style="font-size: 2.5rem; display: block; margin-bottom: 0.75rem;">⚡</span>
                        <h3 style="font-weight: 800; font-size: 1.2rem; color: #2C2A29; margin-bottom: 0.35rem;">No Autonomous Campaigns Yet</h3>
                        <p style="font-size: 0.88rem; color: #736E68; max-width: 440px; margin: 0 auto 1.25rem auto;">
                            Click the "Suggest Topic" button above or type your idea and hit "Launch Campaign" to run your first 1-Click autonomous pipeline.
                        </p>
                        <button class="btn btn-primary btn-sm" onclick="agentView.pickRandomTopic(); agentView.launchAutonomousRun();" style="font-weight: 800; border-radius: 10px; padding: 0.6rem 1.4rem;">
                            🚀 Launch Demo Campaign Now
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${this.campaigns.map(c => `
                        <div class="card" style="border-radius: 14px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.35rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); display: grid; grid-template-columns: 1fr auto; gap: 1.25rem; align-items: center;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.45rem;">
                                    <span style="font-size: 0.76rem; font-weight: 800; background: #FAF0EC; color: #D97757; padding: 0.2rem 0.65rem; border-radius: 6px; letter-spacing: 0.04em;">
                                        TRIGGER: ${c.keyword}
                                    </span>
                                    <span style="font-size: 0.75rem; font-weight: 700; color: #736E68;">
                                        Reel ID: <code>${c.media_id}</code>
                                    </span>
                                    <span style="font-size: 0.72rem; color: #8C827A;">• ${new Date(c.created_at || Date.now()).toLocaleDateString()}</span>
                                </div>
                                
                                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.12rem; margin: 0 0 0.4rem 0; color: #2C2A29;">
                                    ${c.lead_magnet_title || c.topic}
                                </h3>

                                <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; font-size: 0.82rem; color: #736E68;">
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <span>💬</span> <strong>${c.comments_count || 0}</strong> comments
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <span>📬</span> <strong>${c.dms_sent || 0}</strong> DMs sent
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <span>🔗</span> <strong>${c.clicks_count || 0}</strong> deliverable clicks
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <a href="${c.deliverable_url}" target="_blank" style="color: #D97757; font-weight: 700; text-decoration: none;">
                                            📖 View Guide Page ↗
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
                                <button class="btn btn-primary btn-sm" style="font-weight: 800; font-size: 0.82rem; padding: 0.5rem 1.15rem; border-radius: 9px; white-space: nowrap;" onclick="agentView.simulateComment('${c.media_id}', '${c.keyword}')">
                                    🧪 Simulate Follower Comment
                                </button>
                                <a href="${c.deliverable_url}" target="_blank" class="btn btn-secondary btn-sm" style="font-weight: 700; font-size: 0.8rem; padding: 0.4rem 0.95rem; border-radius: 9px; text-decoration: none; text-align: center; width: 100%;">
                                    🔗 Open Resource
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (err) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Error loading agent campaigns</h3>
                    <p>${err.message}</p>
                </div>
            `;
        }
    },

    async simulateComment(mediaId, keyword) {
        try {
            const fakeUser = 'fan_' + Math.floor(100 + Math.random() * 900);
            App.showToast(`Simulating comment "${keyword}" from @${fakeUser}...`, 'info');

            const res = await App.apiCall('POST', '/api/agent/simulate-comment', {
                media_id: mediaId,
                keyword: keyword,
                username: fakeUser
            });

            App.showToast(res.message || 'Follower comment triggered Follow-First funnel!', 'success');
            await this.loadCampaigns();
        } catch (err) {
            App.showToast('Failed to simulate comment: ' + err.message, 'error');
        }
    },

    refresh() {
        this.loadCampaigns();
    }
};
window.agent = window.agentView;
