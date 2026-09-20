// Autonomous Instagram AI Agent Sentinel & High-Scale Bridge View
// Enhanced UI/UX: End-to-End Inbound Web Bridge Visualizer & Detected Reels Session
window.agentView = {
    posts: [],
    filteredPosts: [],
    bridgeConfig: null,
    autoPilotActive: false,
    activeSnippetTab: 'curl_batch',
    activeGatewayTab: 'webhook', // 'webhook' | 'sheets' | 'simulator'
    statusFilter: 'all', // 'all' | 'armed' | 'docs' | 'comments' | 'test'
    sourceFilter: 'all', // 'all' | 'webhook' | 'sheets' | 'scan' | 'simulator'
    searchQuery: '',
    sortBy: 'newest', // 'newest' | 'comments' | 'dms' | 'clicks'
    viewMode: 'grid', // 'grid' | 'table'
    cachedAppsScript: '',

    async render(container) {
        const currentHost = window.location.origin;
        const bridgeUrl = `${currentHost}/api/agent/bridge`;
        const batchBridgeUrl = `${currentHost}/api/agent/bridge/batch`;

        container.innerHTML = `
            <div class="view" id="agent-view" style="width: 100%; max-width: 1480px; margin: 0 auto; padding-bottom: 3rem;">
                
                <!-- TOP HEADER -->
                <div class="page-header" style="margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                    <div class="page-title">
                        <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.35rem;">
                            <span style="font-size: 1.85rem;">🤖</span>
                            <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.85rem; letter-spacing: -0.03em; margin: 0; color: #2C2A29;">
                                AI Agent Studio: Multi-Reel Sentinel & Bridge
                            </h1>
                            <span id="autopilot-status-badge" style="padding: 0.22rem 0.75rem; border-radius: 999px; background: #E8F5E9; color: #2E7D32; font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;">
                                Auto-Pilot Active
                            </span>
                        </div>
                        <p style="font-size: 0.92rem; color: #6B6762; margin: 0; max-width: 880px; line-height: 1.45;">
                            End-to-end inbound bridge & autonomous Sentinel: connects your external AI research platform, automatically detects posted Reels on Instagram, extracts CTA keywords (e.g. <code>DRAG</code>, <code>RAG</code>), pairs Google Docs/deliverable links, and arms live Follow-First DM funnels.
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
                        <button class="btn btn-secondary btn-sm" style="font-weight: 700; padding: 0.58rem 1.15rem; font-size: 0.88rem; border-radius: 10px; display: flex; align-items: center; gap: 6px;" onclick="agentView.loadPosts()">
                            <span>🔄</span> Refresh Stream
                        </button>
                        <button class="btn btn-primary btn-sm" id="btn-scan-feed" style="font-weight: 800; padding: 0.58rem 1.35rem; font-size: 0.88rem; border-radius: 10px; box-shadow: 0 4px 14px rgba(217,119,87,0.3); display: flex; align-items: center; gap: 6px;" onclick="agentView.scanFeed()">
                            <span>🔍</span> <span>Scan Feed Now</span>
                        </button>
                    </div>
                </div>

                <!-- AUTOPILOT SENTINEL LIVE BANNER -->
                <div style="background: #FAF8F5; border-radius: 14px; border: 1.5px solid #E6E1D8; padding: 0.95rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                        <div id="autopilot-pulse" style="width: 12px; height: 12px; border-radius: 50%; background: #2E7D32; box-shadow: 0 0 10px rgba(46,125,50,0.5);"></div>
                        <div>
                            <div style="font-weight: 800; font-size: 0.94rem; color: #2C2A29;" id="autopilot-banner-title">
                                Continuous Auto-Pilot Sentinel: ACTIVE
                            </div>
                            <div style="font-size: 0.82rem; color: #736E68;">
                                Automatically monitors <strong id="target-account-label">@harshparmar007__</strong> every 10 mins. Every newly posted Reel is detected, matched, and armed instantly!
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm" id="btn-toggle-autopilot" onclick="agentView.toggleAutoPilot()" style="font-weight: 800; font-size: 0.82rem; border-radius: 8px; padding: 0.45rem 1rem;">
                        ⏸️ Pause Auto-Pilot
                    </button>
                </div>

                <!-- 4 LIVE METRIC STATS TICKER -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
                    <div class="card" style="padding: 1.15rem 1.25rem; border-radius: 14px; border: 1.5px solid #E6E1D8; background: #FFFFFF;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                            <span style="font-size: 0.78rem; font-weight: 700; color: #736E68; text-transform: uppercase; letter-spacing: 0.04em;">Tracked Reels</span>
                            <span style="font-size: 1.25rem;">🎬</span>
                        </div>
                        <div id="metric-total-reels" style="font-size: 1.75rem; font-weight: 800; color: #2C2A29; font-family: 'Plus Jakarta Sans', sans-serif;">0</div>
                        <div style="font-size: 0.76rem; color: #2E7D32; font-weight: 700; margin-top: 0.2rem;">● Auto-detected & registered</div>
                    </div>

                    <div class="card" style="padding: 1.15rem 1.25rem; border-radius: 14px; border: 1.5px solid #E6E1D8; background: #FFFFFF;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                            <span style="font-size: 0.78rem; font-weight: 700; color: #736E68; text-transform: uppercase; letter-spacing: 0.04em;">Armed Funnels</span>
                            <span style="font-size: 1.25rem;">🎯</span>
                        </div>
                        <div id="metric-armed-triggers" style="font-size: 1.75rem; font-weight: 800; color: #D97757; font-family: 'Plus Jakarta Sans', sans-serif;">0</div>
                        <div style="font-size: 0.76rem; color: #D97757; font-weight: 700; margin-top: 0.2rem;">● Follow-First Gate live</div>
                    </div>

                    <div class="card" style="padding: 1.15rem 1.25rem; border-radius: 14px; border: 1.5px solid #E6E1D8; background: #FFFFFF;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                            <span style="font-size: 0.78rem; font-weight: 700; color: #736E68; text-transform: uppercase; letter-spacing: 0.04em;">Connected Deliverables</span>
                            <span style="font-size: 1.25rem;">📄</span>
                        </div>
                        <div id="metric-deliverables-linked" style="font-size: 1.75rem; font-weight: 800; color: #2C2A29; font-family: 'Plus Jakarta Sans', sans-serif;">0</div>
                        <div style="font-size: 0.76rem; color: #0288D1; font-weight: 700; margin-top: 0.2rem;">● Google Docs & Notion linked</div>
                    </div>

                    <div class="card" style="padding: 1.15rem 1.25rem; border-radius: 14px; border: 1.5px solid #E6E1D8; background: #FFFFFF;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                            <span style="font-size: 0.78rem; font-weight: 700; color: #736E68; text-transform: uppercase; letter-spacing: 0.04em;">Automated DMs Sent</span>
                            <span style="font-size: 1.25rem;">📬</span>
                        </div>
                        <div id="metric-dms-dispatched" style="font-size: 1.75rem; font-weight: 800; color: #2E7D32; font-family: 'Plus Jakarta Sans', sans-serif;">0</div>
                        <div style="font-size: 0.76rem; color: #6B6762; font-weight: 600; margin-top: 0.2rem;">● Dispatched to verified followers</div>
                    </div>
                </div>

                <!-- ========================================================================= -->
                <!-- AESTHETIC AI AGENT WORKFLOW & END-TO-END PIPELINE VISUALIZER              -->
                <!-- ========================================================================= -->
                <div class="card workflow-pipeline-card" style="border-radius: 20px; border: 1.5px solid #E6E1D8; background: radial-gradient(circle at 10% 15%, #FFFDFB 0%, #FFFFFF 100%); padding: 1.85rem; margin-bottom: 2rem; box-shadow: 0 4px 25px rgba(44, 42, 41, 0.04); position: relative; overflow: hidden;">
                    
                    <!-- WORKFLOW SECTION HEADER -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.6rem; flex-wrap: wrap; gap: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.95rem;">
                            <div style="width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, #FAF0EC 0%, #F5E5DF 100%); border: 1.5px solid rgba(217,119,87,0.35); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #D97757; box-shadow: 0 3px 12px rgba(217,119,87,0.18); flex-shrink: 0;">
                                ⚡
                            </div>
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                                    <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.35rem; letter-spacing: -0.02em; margin: 0; color: #2C2A29;">
                                        Autonomous AI Agent Workflow Pipeline
                                    </h3>
                                    <span class="workflow-pulse-circuit">
                                        <span class="dot"></span>
                                        Continuous Loop Active
                                    </span>
                                </div>
                                <p style="font-size: 0.86rem; color: #6B6762; margin: 0.3rem 0 0 0; line-height: 1.45;">
                                    End-to-end continuous loop: External AI research generation ➔ Inbound bridge ➔ Sentinel detection ➔ Follow-First DM funnel delivery.
                                </p>
                            </div>
                        </div>

                        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                            <span style="font-size: 0.76rem; font-weight: 800; color: #D97757; background: #FAF0EC; border: 1.5px solid rgba(217,119,87,0.3); padding: 0.4rem 0.85rem; border-radius: 8px; display: inline-flex; align-items: center; gap: 5px;">
                                <span>⚡</span> Zero-Delay Bridge
                            </span>
                            <button class="btn btn-secondary btn-sm" onclick="agentView.showResearchModal()" style="font-size: 0.78rem; font-weight: 700; border-radius: 8px; padding: 0.4rem 0.85rem; border: 1.5px solid #E6E1D8;">
                                🧠 Research Specs
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="agentView.scanFeed()" style="font-size: 0.78rem; font-weight: 700; border-radius: 8px; padding: 0.4rem 0.85rem;">
                                🔍 Scan Feed
                            </button>
                        </div>
                    </div>

                    <!-- CONNECTED 4-STAGE PIPELINE GRID WITH FLOW CHEVRONS -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.15rem; position: relative;">
                        
                        <!-- STAGE 1: EXTERNAL AI RESEARCH -->
                        <div class="workflow-stage-card" onclick="agentView.showResearchModal()" style="background: #FAF8F5; border: 1.5px solid #E6E1D8; border-radius: 14px; padding: 1.35rem 1.2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative;" title="Click to view OmniResearch AI agent specifications">
                            <div class="workflow-connector-chevron">➔</div>
                            <div>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #EEF2FF; border: 1px solid #C7D2FE; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                        🧠
                                    </div>
                                    <span style="font-size: 0.68rem; font-weight: 800; color: #4338CA; background: #EEF2FF; border: 1px solid rgba(67,56,202,0.25); padding: 2.5px 8px; border-radius: 999px; letter-spacing: 0.05em;">
                                        STAGE 01
                                    </span>
                                </div>
                                <div style="font-size: 0.72rem; font-weight: 800; color: #6366F1; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.2rem;">
                                    Cloud Research App
                                </div>
                                <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.02rem; margin: 0 0 0.35rem 0; color: #2C2A29;">
                                    External AI Research Engine
                                </h4>
                                <p style="font-size: 0.8rem; color: #6B6762; margin: 0 0 0.85rem 0; line-height: 1.45;">
                                    Conducts deep multi-source research, synthesizes companion Google Doc guides, and renders Reels with single-word CTA keywords.
                                </p>
                            </div>
                            <div>
                                <div style="display: flex; flex-wrap: wrap; gap: 5px; padding-top: 0.65rem; border-top: 1px solid #EAE5DC; margin-bottom: 0.65rem;">
                                    <span style="font-size: 0.7rem; font-weight: 700; color: #4338CA; background: #EEF2FF; padding: 2px 7px; border-radius: 5px;">Docs & Guides</span>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: #0288D1; background: #E1F5FE; padding: 2px 7px; border-radius: 5px;">CTA Hooks</span>
                                </div>
                                <div style="display: flex; justify-content: flex-end;">
                                    <span class="workflow-stage-action-hint" style="color: #4338CA;">OmniResearch Docs ↗</span>
                                </div>
                            </div>
                        </div>

                        <!-- STAGE 2: INBOUND GATEWAY -->
                        <div class="workflow-stage-card" onclick="agentView.jumpToGateway('webhook')" style="background: #FAF8F5; border: 1.5px solid #E6E1D8; border-radius: 14px; padding: 1.35rem 1.2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative;" title="Click to view inbound webhook and sheets bridge endpoints">
                            <div class="workflow-connector-chevron">➔</div>
                            <div>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #FAF0EC; border: 1px solid rgba(217,119,87,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                        📡
                                    </div>
                                    <span style="font-size: 0.68rem; font-weight: 800; color: #D97757; background: #FAF0EC; border: 1px solid rgba(217,119,87,0.3); padding: 2.5px 8px; border-radius: 999px; letter-spacing: 0.05em;">
                                        STAGE 02
                                    </span>
                                </div>
                                <div style="font-size: 0.72rem; font-weight: 800; color: #D97757; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.2rem;">
                                    Zero-Delay Ingestion
                                </div>
                                <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.02rem; margin: 0 0 0.35rem 0; color: #2C2A29;">
                                    Inbound Webhook & Sheets Bridge
                                </h4>
                                <p style="font-size: 0.8rem; color: #6B6762; margin: 0 0 0.85rem 0; line-height: 1.45;">
                                    Instantly captures published Reels via Single/Batch Webhook (<code>/api/agent/bridge</code>) or automated Google Sheets sync with 0 rate limits.
                                </p>
                            </div>
                            <div>
                                <div style="display: flex; flex-wrap: wrap; gap: 5px; padding-top: 0.65rem; border-top: 1px solid #EAE5DC; margin-bottom: 0.65rem;">
                                    <span style="font-size: 0.7rem; font-weight: 700; color: #D97757; background: #FAF0EC; padding: 2px 7px; border-radius: 5px;">⚡ Webhook POST</span>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: #0D47A1; background: #E3F2FD; padding: 2px 7px; border-radius: 5px;">📊 Sheets Sync</span>
                                </div>
                                <div style="display: flex; justify-content: flex-end;">
                                    <span class="workflow-stage-action-hint" style="color: #D97757;">Configure Endpoints ➔</span>
                                </div>
                            </div>
                        </div>

                        <!-- STAGE 3: SENTINEL ENGINE -->
                        <div class="workflow-stage-card" onclick="agentView.jumpToArmedReels()" style="background: #FAF8F5; border: 1.5px solid #E6E1D8; border-radius: 14px; padding: 1.35rem 1.2rem; display: flex; flex-direction: column; justify-content: space-between; position: relative;" title="Click to view armed and live reels">
                            <div class="workflow-connector-chevron">➔</div>
                            <div>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #E8F5E9; border: 1px solid #A5D6A7; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                        🤖
                                    </div>
                                    <span style="font-size: 0.68rem; font-weight: 800; color: #2E7D32; background: #E8F5E9; border: 1px solid rgba(46,125,50,0.25); padding: 2.5px 8px; border-radius: 999px; letter-spacing: 0.05em;">
                                        STAGE 03
                                    </span>
                                </div>
                                <div style="font-size: 0.72rem; font-weight: 800; color: #2E7D32; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.2rem;">
                                    Autonomous Sentinel
                                </div>
                                <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.02rem; margin: 0 0 0.35rem 0; color: #2C2A29;">
                                    Sentinel Detection & Isolation
                                </h4>
                                <p style="font-size: 0.8rem; color: #6B6762; margin: 0 0 0.85rem 0; line-height: 1.45;">
                                    Registers Reel ID, isolates trigger keyword (e.g. <code>DRAG</code>), binds companion guide link, and provisions an isolated per-reel funnel.
                                </p>
                            </div>
                            <div>
                                <div style="display: flex; flex-wrap: wrap; gap: 5px; padding-top: 0.65rem; border-top: 1px solid #EAE5DC; margin-bottom: 0.65rem;">
                                    <span style="font-size: 0.7rem; font-weight: 700; color: #E65100; background: #FFF3E0; padding: 2px 7px; border-radius: 5px;">Auto-Keyword Parsing</span>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: #2E7D32; background: #E8F5E9; padding: 2px 7px; border-radius: 5px;">Multi-Reel Isolated</span>
                                </div>
                                <div style="display: flex; justify-content: flex-end;">
                                    <span class="workflow-stage-action-hint" style="color: #2E7D32;">View Armed Reels ➔</span>
                                </div>
                            </div>
                        </div>

                        <!-- STAGE 4: FOLLOW GATE & DM FUNNEL -->
                        <div class="workflow-stage-card" onclick="agentView.jumpToGateway('simulator')" style="background: #FAF8F5; border: 1.5px solid #81C784; border-radius: 14px; padding: 1.35rem 1.2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 3px 12px rgba(46,125,50,0.08); position: relative;" title="Click to test the Follow-First DM funnel in simulator">
                            <div>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #C8E6C9; border: 1px solid #81C784; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                        🎯
                                    </div>
                                    <span style="font-size: 0.68rem; font-weight: 800; color: #1B5E20; background: #C8E6C9; border: 1px solid rgba(27,94,32,0.3); padding: 2.5px 8px; border-radius: 999px; letter-spacing: 0.05em;">
                                        STAGE 04
                                    </span>
                                </div>
                                <div style="font-size: 0.72rem; font-weight: 800; color: #1B5E20; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.2rem;">
                                    Verified Delivery
                                </div>
                                <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.02rem; margin: 0 0 0.35rem 0; color: #1B5E20;">
                                    Follow-First Gate & DM Link
                                </h4>
                                <p style="font-size: 0.8rem; color: #2E7D32; margin: 0 0 0.85rem 0; line-height: 1.45;">
                                    Follower comments keyword on Reel ──► Sentinel verifies follower status ──► delivers guide link instantly and tracks clicks & leads!
                                </p>
                            </div>
                            <div>
                                <div style="display: flex; flex-wrap: wrap; gap: 5px; padding-top: 0.65rem; border-top: 1px solid #C8E6C9; margin-bottom: 0.65rem;">
                                    <span style="font-size: 0.7rem; font-weight: 800; color: #1B5E20; background: #C8E6C9; padding: 2px 7px; border-radius: 5px;">🟢 Live Trigger Armed</span>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: #2E7D32; background: #E8F5E9; padding: 2px 7px; border-radius: 5px;">Conversion Tracked</span>
                                </div>
                                <div style="display: flex; justify-content: flex-end;">
                                    <span class="workflow-stage-action-hint" style="color: #1B5E20;">Test DM Gate ➔</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- BOTTOM WORKFLOW EXECUTION RIBBON -->
                    <div style="margin-top: 1.35rem; background: #FAF8F5; border: 1.5px solid #EAE5DC; border-radius: 12px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">
                        <div style="display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: #6B6762;">
                            <span style="font-size: 1.15rem;">💡</span>
                            <span><strong>End-to-End Autonomous Circuit:</strong> External AI app posts Reel ➔ Sentinel catches Media ID & binds keyword ➔ Follower comments ➔ Follow Gate verifies & delivers DM link.</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <span style="font-size: 0.74rem; font-weight: 700; color: #2E7D32; background: #E8F5E9; padding: 0.35rem 0.75rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
                                <span>⚡</span> Sub-200ms Latency
                            </span>
                            <button class="btn btn-secondary btn-sm" onclick="agentView.jumpToGateway('sheets')" style="font-weight: 700; font-size: 0.78rem; padding: 0.4rem 0.85rem; border-radius: 8px;">
                                📊 Sheets Sync
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="agentView.simulateInboundPost()" style="font-weight: 800; font-size: 0.78rem; padding: 0.4rem 1rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(217,119,87,0.25);">
                                ⚡ Test Ingestion Flow
                            </button>
                        </div>
                    </div>

                </div>

                <!-- INBOUND GATEWAY INTEGRATION CONSOLE (TABBED INTERFACE) -->
                <div class="card" style="border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    
                    <!-- CONSOLE TABS -->
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #E6E1D8; padding-bottom: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-sm gateway-tab-btn" id="gw-tab-webhook" onclick="agentView.switchGatewayTab('webhook')" style="font-weight: 800; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 8px; background: #D97757; color: #FFF; border: none; cursor: pointer;">
                                📡 Inbound Webhooks (Single & Batch)
                            </button>
                            <button class="btn btn-sm gateway-tab-btn" id="gw-tab-sheets" onclick="agentView.switchGatewayTab('sheets')" style="font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 8px; background: #FAF8F5; color: #736E68; border: 1px solid #E6E1D8; cursor: pointer;">
                                📊 Google Sheets Deliverables Sync
                            </button>
                            <button class="btn btn-sm gateway-tab-btn" id="gw-tab-simulator" onclick="agentView.switchGatewayTab('simulator')" style="font-weight: 700; font-size: 0.85rem; padding: 0.5rem 1rem; border-radius: 8px; background: #FAF8F5; color: #736E68; border: 1px solid #E6E1D8; cursor: pointer;">
                                🧪 Test Post Simulator
                            </button>
                        </div>
                        <div style="font-size: 0.78rem; color: #736E68;">
                            Inbound Integration Gateway
                        </div>
                    </div>

                    <!-- TAB 1: WEBHOOK DETAILS & SNIPPETS -->
                    <div id="gateway-panel-webhook" style="display: block;">
                        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1.5rem; align-items: flex-start;">
                            <div>
                                <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.05rem; margin: 0 0 0.35rem 0; color: #2C2A29;">
                                    Webhook Endpoints for Your AI Research Platform
                                </h4>
                                <p style="font-size: 0.82rem; color: #736E68; margin-bottom: 1rem; line-height: 1.45;">
                                    Configure your content engine to send an HTTP POST request as soon as a Reel is published on Instagram:
                                </p>

                                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
                                    <div>
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                            <label style="font-size: 0.75rem; font-weight: 700; color: #736E68;">Single Reel Ingestion Webhook (POST)</label>
                                            <button onclick="agentView.copyToClipboard('${bridgeUrl}', 'Single Webhook URL')" style="background: none; border: none; color: #D97757; font-size: 0.72rem; font-weight: 700; cursor: pointer;">📋 Copy</button>
                                        </div>
                                        <input type="text" readonly value="${bridgeUrl}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.8rem; font-weight: 700; font-family: monospace; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FAF8F5;">
                                    </div>

                                    <div>
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                            <label style="font-size: 0.75rem; font-weight: 700; color: #736E68;">High-Scale Batch Multi-Reel Webhook (POST - 10 to 100+ Reels)</label>
                                            <button onclick="agentView.copyToClipboard('${batchBridgeUrl}', 'Batch Webhook URL')" style="background: none; border: none; color: #D97757; font-size: 0.72rem; font-weight: 700; cursor: pointer;">📋 Copy</button>
                                        </div>
                                        <input type="text" readonly value="${batchBridgeUrl}" style="width: 100%; padding: 0.55rem 0.75rem; font-size: 0.8rem; font-weight: 700; font-family: monospace; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FAF8F5;">
                                    </div>
                                </div>

                                <div style="background: #FAF8F5; border-radius: 10px; border: 1px solid #E6E1D8; padding: 0.75rem 1rem; font-size: 0.78rem;">
                                    <div style="font-weight: 800; color: #2C2A29; margin-bottom: 0.35rem;">📦 Expected JSON Payload Properties:</div>
                                    <div style="color: #6B6762; display: flex; flex-direction: column; gap: 3px;">
                                        <div>• <code>media_id</code>: Instagram Reel ID or public post URL (Required)</div>
                                        <div>• <code>caption</code>: Reel caption containing the keyword CTA (e.g. "Comment DRAG")</div>
                                        <div>• <code>deliverable_url</code>: Google Docs or Notion guide link (Required)</div>
                                        <div>• <code>trigger_keyword</code>: Keyword override (Optional; AI auto-extracts from caption if omitted)</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <span style="font-size: 0.8rem; font-weight: 800; color: #2C2A29;">Implementation Code Sample:</span>
                                    <div style="display: flex; gap: 0.35rem;">
                                        <button class="btn btn-sm btn-snippet" id="tab-curl-batch" onclick="agentView.switchTab('curl_batch')" style="padding: 0.22rem 0.6rem; font-size: 0.74rem; font-weight: 700; border-radius: 6px; background: #D97757; color: #FFF;">cURL Batch</button>
                                        <button class="btn btn-sm btn-snippet" id="tab-python" onclick="agentView.switchTab('python')" style="padding: 0.22rem 0.6rem; font-size: 0.74rem; font-weight: 700; border-radius: 6px; background: #FAF8F5; color: #736E68;">Python Batch</button>
                                        <button class="btn btn-sm btn-snippet" id="tab-node" onclick="agentView.switchTab('node')" style="padding: 0.22rem 0.6rem; font-size: 0.74rem; font-weight: 700; border-radius: 6px; background: #FAF8F5; color: #736E68;">Node.js</button>
                                    </div>
                                </div>
                                <div style="position: relative;">
                                    <pre id="snippet-code" style="background: #1E1E1E; color: #D4D4D4; padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.76rem; font-family: monospace; overflow-x: auto; margin: 0; line-height: 1.45; max-height: 250px;"></pre>
                                    <button onclick="agentView.copyCurrentSnippet()" style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: #FFF; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; cursor: pointer;">📋 Copy</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 2: GOOGLE SHEETS DELIVERABLES SYNC -->
                    <div id="gateway-panel-sheets" style="display: none;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: flex-start;">
                            <div>
                                <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.05rem; margin: 0 0 0.35rem 0; color: #2C2A29;">
                                    Sync Deliverables from Google Sheets
                                </h4>
                                <p style="font-size: 0.82rem; color: #736E68; margin-bottom: 1rem; line-height: 1.45;">
                                    When your research platform updates a Google Sheet with Reel IDs, Keywords, and Doc URLs, sync all rows with one click:
                                </p>

                                <div style="margin-bottom: 1rem;">
                                    <label style="font-size: 0.76rem; font-weight: 700; color: #736E68; display: block; margin-bottom: 0.35rem;">
                                        Google Sheet Published CSV or Webhook URL
                                    </label>
                                    <input type="text" id="sheet-sync-url" placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv" style="width: 100%; padding: 0.65rem 0.85rem; font-size: 0.82rem; font-family: monospace; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FAF8F5;">
                                </div>

                                <div style="background: #FAF8F5; border-radius: 10px; border: 1px solid #E6E1D8; padding: 0.75rem 0.95rem; font-size: 0.78rem; margin-bottom: 1.25rem;">
                                    <div style="font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem;">📋 Expected Sheet Column Order:</div>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                                        <span style="background: #FFF; border: 1px solid #E6E1D8; padding: 2px 7px; border-radius: 5px; font-weight: 700;">Col A: Reel ID or Link</span>
                                        <span style="background: #FFF; border: 1px solid #E6E1D8; padding: 2px 7px; border-radius: 5px; font-weight: 700;">Col B: Keyword (e.g. DRAG)</span>
                                        <span style="background: #FFF; border: 1px solid #E6E1D8; padding: 2px 7px; border-radius: 5px; font-weight: 700;">Col C: Deliverable Link</span>
                                        <span style="background: #FFF; border: 1px solid #E6E1D8; padding: 2px 7px; border-radius: 5px; font-weight: 700;">Col D: Topic Title</span>
                                    </div>
                                </div>

                                <button class="btn btn-primary w-full" id="btn-sync-sheet" onclick="agentView.syncGoogleSheet()" style="padding: 0.75rem; font-weight: 800; font-size: 0.9rem; border-radius: 12px; box-shadow: 0 4px 14px rgba(217,119,87,0.3);">
                                    📊 Sync Deliverables from Google Sheet Now
                                </button>
                            </div>

                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <span style="font-size: 0.8rem; font-weight: 800; color: #2C2A29;">Automate With Google Apps Script (Zero Delay):</span>
                                    <button onclick="agentView.copyAppsScript()" style="background: #FAF0EC; border: 1px solid #E6E1D8; color: #D97757; font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-weight: 700;">📋 Copy Script</button>
                                </div>
                                <div style="background: #2C2A29; border-radius: 10px; padding: 1rem; font-family: monospace; font-size: 0.75rem; color: #E6E1D8; max-height: 240px; overflow-y: auto;">
                                    <div style="color: #D97757; font-weight: 700; margin-bottom: 0.4rem;">// Google Sheets -> Extensions -> Apps Script:</div>
                                    <pre id="apps-script-code" style="margin: 0; white-space: pre-wrap; word-break: break-all;"></pre>
                                </div>
                                <p style="font-size: 0.76rem; color: #736E68; margin-top: 0.5rem;">
                                    Add an <code>onEdit</code> or <code>onFormSubmit</code> installable trigger in Apps Script to push new rows instantly to InstaAuto as they are written!
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 3: TEST POST SIMULATOR -->
                    <div id="gateway-panel-simulator" style="display: none;">
                        <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.05rem; margin: 0 0 0.35rem 0; color: #2C2A29;">
                            🧪 Inbound Post Simulator (Test Single Reel Ingestion)
                        </h4>
                        <p style="font-size: 0.82rem; color: #736E68; margin-bottom: 1rem;">
                            Simulate your external research platform sending an Instagram Reel with a custom trigger keyword and companion doc.
                        </p>

                        <div style="display: grid; grid-template-columns: 1fr 1.3fr 1fr auto; gap: 0.75rem; align-items: center;">
                            <input type="text" id="sim-media-id" class="input" placeholder="Media ID (e.g. 1804910...)" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                            <input type="text" id="sim-caption" class="input" placeholder="Caption" value="Comment DRAG below to get the full architecture guide and code templates!" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                            <input type="url" id="sim-doc-url" class="input" placeholder="Google Doc / Notion URL" value="https://docs.google.com/document/d/1drag_architecture_guide/view" style="padding: 0.65rem 0.85rem; font-size: 0.85rem; border-radius: 10px; border: 1.5px solid #E6E1D8; background: #FFF;">
                            <button class="btn btn-primary btn-sm" id="btn-simulate-inbound" onclick="agentView.simulateInboundPost()" style="font-weight: 800; padding: 0.7rem 1.25rem; font-size: 0.85rem; border-radius: 10px; white-space: nowrap;">
                                ⚡ Ingest Test Reel
                            </button>
                        </div>

                        <div id="sim-result-banner" style="display: none; margin-top: 1rem;"></div>
                    </div>

                </div>

                <!-- ========================================================================= -->
                <!-- CORE FEATURE: DETECTED REELS & LIVE TRIGGERS SESSION                      -->
                <!-- ========================================================================= -->
                <div style="background: #FFFFFF; border-radius: 18px; border: 1.5px solid #E6E1D8; padding: 1.6rem; box-shadow: 0 4px 25px rgba(0,0,0,0.03); margin-bottom: 2.5rem;">
                    
                    <!-- SESSION HEADER -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.25rem;">
                                <span style="font-size: 1.4rem;">🎬</span>
                                <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: -0.02em; margin: 0; color: #2C2A29;">
                                    Detected Reels & Live Triggers Session
                                </h2>
                                <span id="agent-posts-count-badge" style="background: #FAF0EC; color: #D97757; font-weight: 800; font-size: 0.76rem; padding: 0.22rem 0.75rem; border-radius: 999px;">
                                    Loading Reels...
                                </span>
                            </div>
                            <p style="font-size: 0.86rem; color: #736E68; margin: 0;">
                                Real-time monitor of detected Instagram Reels, their verified trigger keywords, deliverable docs, and Follow-First DM automation gates.
                            </p>
                        </div>

                        <!-- ACTIONS: CLEAR TEST DATA & SCAN -->
                        <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
                            <button class="btn btn-secondary btn-sm" onclick="agentView.cleanTestData()" style="font-size: 0.8rem; font-weight: 700; padding: 0.5rem 0.95rem; border-radius: 8px;" title="Clear mock demonstration reels">
                                🧹 Clear Test Reels
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="agentView.simulateInboundPost()" style="font-size: 0.8rem; font-weight: 800; padding: 0.5rem 1rem; border-radius: 8px;">
                                ⚡ Ingest Demo Reel
                            </button>
                        </div>
                    </div>

                    <!-- MULTI-FILTER CONTROLS BAR -->
                    <div style="background: #FAF8F5; border-radius: 14px; border: 1.5px solid #E6E1D8; padding: 1rem 1.15rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.85rem;">
                        
                        <!-- ROW 1: STATUS PILLS & VIEW SWITCH -->
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                            <!-- STATUS FILTER PILLS -->
                            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;" id="status-filter-pills">
                                <button class="filter-pill" id="pill-all" onclick="agentView.setStatusFilter('all')" style="padding: 0.35rem 0.85rem; font-size: 0.78rem; font-weight: 800; border-radius: 999px; border: 1.5px solid #D97757; background: #D97757; color: #FFF; cursor: pointer;">
                                    All Reels (<span id="count-pill-all">0</span>)
                                </button>
                                <button class="filter-pill" id="pill-armed" onclick="agentView.setStatusFilter('armed')" style="padding: 0.35rem 0.85rem; font-size: 0.78rem; font-weight: 700; border-radius: 999px; border: 1.5px solid #E6E1D8; background: #FFF; color: #2C2A29; cursor: pointer;">
                                    🟢 Armed & Live (<span id="count-pill-armed">0</span>)
                                </button>
                                <button class="filter-pill" id="pill-docs" onclick="agentView.setStatusFilter('docs')" style="padding: 0.35rem 0.85rem; font-size: 0.78rem; font-weight: 700; border-radius: 999px; border: 1.5px solid #E6E1D8; background: #FFF; color: #2C2A29; cursor: pointer;">
                                    🔗 Docs Linked (<span id="count-pill-docs">0</span>)
                                </button>
                                <button class="filter-pill" id="pill-comments" onclick="agentView.setStatusFilter('comments')" style="padding: 0.35rem 0.85rem; font-size: 0.78rem; font-weight: 700; border-radius: 999px; border: 1.5px solid #E6E1D8; background: #FFF; color: #2C2A29; cursor: pointer;">
                                    💬 With Leads/Comments (<span id="count-pill-comments">0</span>)
                                </button>
                                <button class="filter-pill" id="pill-test" onclick="agentView.setStatusFilter('test')" style="padding: 0.35rem 0.85rem; font-size: 0.78rem; font-weight: 700; border-radius: 999px; border: 1.5px solid #E6E1D8; background: #FFF; color: #2C2A29; cursor: pointer;">
                                    🧪 Test Demos (<span id="count-pill-test">0</span>)
                                </button>
                            </div>

                            <!-- VIEW TOGGLE: CARDS VS TABLE -->
                            <div style="display: flex; gap: 4px; background: #FFFFFF; border: 1.5px solid #E6E1D8; border-radius: 8px; padding: 2px;">
                                <button id="btn-view-grid" onclick="agentView.setViewMode('grid')" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: 800; border: none; border-radius: 6px; background: #D97757; color: #FFF; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                    <span>🔲</span> Cards Grid
                                </button>
                                <button id="btn-view-table" onclick="agentView.setViewMode('table')" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; font-weight: 700; border: none; border-radius: 6px; background: transparent; color: #736E68; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                                    <span>📑</span> Matrix Table
                                </button>
                            </div>
                        </div>

                        <!-- ROW 2: SEARCH, SOURCE FILTER, SORT -->
                        <div style="display: grid; grid-template-columns: 1fr 200px 180px; gap: 0.75rem; align-items: center;">
                            <!-- SEARCH INPUT -->
                            <div style="position: relative;">
                                <input type="text" id="agent-search-input" placeholder="Search by Keyword (e.g. DRAG, RAG), Reel ID, Topic or Caption..." oninput="agentView.filterPosts(this.value)" style="width: 100%; padding: 0.55rem 2.2rem 0.55rem 0.85rem; font-size: 0.82rem; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FFFFFF;">
                                <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 0.85rem; color: #96918A;">🔍</span>
                            </div>

                            <!-- SOURCE FILTER -->
                            <select id="agent-source-filter" onchange="agentView.setSourceFilter(this.value)" style="padding: 0.55rem 0.75rem; font-size: 0.82rem; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FFFFFF; font-weight: 600; color: #2C2A29;">
                                <option value="all">All Inbound Sources</option>
                                <option value="external_bridge">📡 Webhook Bridge</option>
                                <option value="sheets">📊 Google Sheets Sync</option>
                                <option value="feed_scan">🤖 Instagram Feed Scan</option>
                                <option value="simulator">🧪 Post Simulator</option>
                            </select>

                            <!-- SORT FILTER -->
                            <select id="agent-sort-filter" onchange="agentView.setSortBy(this.value)" style="padding: 0.55rem 0.75rem; font-size: 0.82rem; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FFFFFF; font-weight: 600; color: #2C2A29;">
                                <option value="newest">Sort: Newest First</option>
                                <option value="comments">Sort: Most Comments</option>
                                <option value="dms">Sort: Most DMs Sent</option>
                                <option value="clicks">Sort: Most Link Clicks</option>
                            </select>
                        </div>

                    </div>

                    <!-- REELS LIST CONTAINER -->
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

    // Switch between Webhook, Google Sheets, and Simulator panels
    switchGatewayTab(tab) {
        this.activeGatewayTab = tab;
        const tabs = ['webhook', 'sheets', 'simulator'];
        tabs.forEach(t => {
            const btn = document.getElementById('gw-tab-' + t);
            const panel = document.getElementById('gateway-panel-' + t);
            if (btn) {
                if (t === tab) {
                    btn.style.background = '#D97757';
                    btn.style.color = '#FFF';
                    btn.style.border = 'none';
                    btn.style.fontWeight = '800';
                } else {
                    btn.style.background = '#FAF8F5';
                    btn.style.color = '#736E68';
                    btn.style.border = '1px solid #E6E1D8';
                    btn.style.fontWeight = '700';
                }
            }
            if (panel) {
                panel.style.display = (t === tab) ? 'block' : 'none';
            }
        });
    },

    // Smooth navigation helpers for workflow pipeline stages
    jumpToGateway(tab) {
        this.switchGatewayTab(tab);
        const target = document.getElementById('gw-tab-' + tab);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    jumpToArmedReels() {
        this.setStatusFilter('armed');
        const target = document.getElementById('agent-posts-list');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    showResearchModal() {
        const modalHtml = `
            <div style="font-family: 'Inter', sans-serif; color: #2C2A29;">
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 1.25rem;">
                    <div style="width: 48px; height: 48px; border-radius: 14px; background: #EEF2FF; border: 1.5px solid #C7D2FE; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
                        🧠
                    </div>
                    <div>
                        <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.25rem; margin: 0; color: #2C2A29;">
                            OmniResearch AI Agent Integration Specs
                        </h3>
                        <p style="font-size: 0.84rem; color: #736E68; margin: 0.15rem 0 0 0;">
                            Stage 01: Deep Research Engine & Companion Deliverables
                        </p>
                    </div>
                </div>

                <div style="background: #FAF8F5; border-radius: 14px; border: 1.5px solid #E6E1D8; padding: 1.25rem; margin-bottom: 1.25rem;">
                    <div style="font-weight: 800; font-size: 0.92rem; margin-bottom: 0.5rem; color: #4338CA; display: flex; align-items: center; gap: 6px;">
                        <span>⚡</span> Interconnected Architecture Overview
                    </div>
                    <p style="font-size: 0.84rem; color: #6B6762; line-height: 1.5; margin-bottom: 0.75rem;">
                        Your external OmniResearch agent autonomous pipeline conducts multi-source research, synthesizes companion Google Doc guides, and renders Reels with single-word CTA keywords. The reel and companion guide are passed into InstaAuto Sentinel via:
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; font-size: 0.82rem;">
                        <div style="background: #FFFFFF; border: 1.5px solid #E6E1D8; border-radius: 10px; padding: 0.85rem;">
                            <strong style="color: #D97757; display: block; margin-bottom: 4px; font-size: 0.86rem;">📡 Option A: Direct Webhook POST</strong>
                            POST JSON payload to <code>/api/agent/bridge</code> with <code>media_id</code>, <code>caption</code>, and <code>deliverable_url</code>.
                        </div>
                        <div style="background: #FFFFFF; border: 1.5px solid #E6E1D8; border-radius: 10px; padding: 0.85rem;">
                            <strong style="color: #0D47A1; display: block; margin-bottom: 4px; font-size: 0.86rem;">📊 Option B: Google Sheets Sync</strong>
                            Auto-sync columns: <code>Reel ID</code> | <code>Keyword</code> | <code>Deliverable Link</code> | <code>Topic Title</code>.
                        </div>
                    </div>
                </div>

                <div style="background: #FAF0EC; border-radius: 12px; border: 1px solid rgba(217,119,87,0.3); padding: 0.9rem 1.15rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <div style="font-size: 0.82rem; color: #2C2A29;">
                        📄 <strong>OmniResearch Master Blueprint:</strong> Master PRD and kickoff prompts are saved in <code>OMNIRESEARCH_AI_MASTER_PROMPT.md</code>.
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 0.65rem;">
                    <button class="btn btn-secondary btn-sm" onclick="App.closeModal()" style="font-weight: 700; border-radius: 8px; padding: 0.5rem 1.2rem;">
                        Close
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="App.closeModal(); agentView.jumpToGateway('webhook');" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 1.25rem; box-shadow: 0 2px 8px rgba(217,119,87,0.25);">
                        View Inbound Endpoints ➔
                    </button>
                </div>
            </div>
        `;
        App.openModal('OmniResearch Integration Specs', modalHtml);
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
            "media_id": "18049102948201941",
            "caption": "Comment 'RAG' to get the full guide!",
            "deliverable_url": "https://docs.google.com/document/d/rag-v1/view"
        },
        {
            "media_id": "18049102948201942",
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
        { media_id: '18049102948201941', caption: 'Comment RAG', deliverable_url: 'https://docs.google.com/document/d/rag/view' },
        { media_id: '18049102948201942', caption: 'Comment DRAG', deliverable_url: 'https://docs.google.com/document/d/drag/view' }
    ]
});`;
        }
    },

    copyCurrentSnippet() {
        const el = document.getElementById('snippet-code');
        if (el && el.textContent) {
            this.copyToClipboard(el.textContent, 'Code Snippet');
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
            if (config.connectedInstagram?.username) {
                const targetLabel = document.getElementById('target-account-label');
                if (targetLabel) targetLabel.textContent = `@${config.connectedInstagram.username.replace('@','')}`;
            }
            this.cachedAppsScript = config.googleAppsScriptExample || '';
            const pre = document.getElementById('apps-script-code');
            if (pre && this.cachedAppsScript) {
                pre.textContent = this.cachedAppsScript;
            }
        } catch (e) {}
    },

    copyAppsScript() {
        const text = this.cachedAppsScript || (document.getElementById('apps-script-code')?.textContent);
        if (text) {
            this.copyToClipboard(text, 'Google Apps Script');
        }
    },

    copyToClipboard(text, label = 'Text') {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            App.showToast(`📋 ${label} copied to clipboard!`, 'success');
        }).catch(() => {
            App.showToast(`Could not copy to clipboard`, 'error');
        });
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
        const caption = (document.getElementById('sim-caption')?.value || '').trim() || 'Comment DRAG below to get the full architecture guide and code templates!';
        const docUrl = (document.getElementById('sim-doc-url')?.value || '').trim() || 'https://docs.google.com/document/d/1drag_architecture_guide/view';

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
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                            <strong>✅ Reel Ingested & Rule Armed Successfully!</strong>
                            <button onclick="this.parentElement.parentElement.style.display='none'" style="background: none; border: none; color: #1B5E20; cursor: pointer; font-weight: 800;">✕</button>
                        </div>
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

    async cleanTestData() {
        if (!confirm('Clear synthetic demonstration test reels from the matrix? Real detected posts will remain untouched.')) return;
        try {
            const res = await App.apiCall('POST', '/api/agent/cleanup-test-data');
            App.showToast(res.message || 'Test data cleared!', 'success');
            await this.loadPosts();
        } catch (err) {
            App.showToast('Error cleaning test data: ' + err.message, 'error');
        }
    },

    setStatusFilter(status) {
        this.statusFilter = status;
        const pills = ['all', 'armed', 'docs', 'comments', 'test'];
        pills.forEach(p => {
            const btn = document.getElementById('pill-' + p);
            if (btn) {
                if (p === status) {
                    btn.style.background = '#D97757';
                    btn.style.color = '#FFF';
                    btn.style.borderColor = '#D97757';
                    btn.style.fontWeight = '800';
                } else {
                    btn.style.background = '#FFF';
                    btn.style.color = '#2C2A29';
                    btn.style.borderColor = '#E6E1D8';
                    btn.style.fontWeight = '700';
                }
            }
        });
        this.applyFilters();
    },

    setSourceFilter(source) {
        this.sourceFilter = source;
        this.applyFilters();
    },

    setSortBy(sort) {
        this.sortBy = sort;
        this.applyFilters();
    },

    setViewMode(mode) {
        this.viewMode = mode;
        const btnGrid = document.getElementById('btn-view-grid');
        const btnTable = document.getElementById('btn-view-table');
        if (mode === 'grid') {
            if (btnGrid) { btnGrid.style.background = '#D97757'; btnGrid.style.color = '#FFF'; }
            if (btnTable) { btnTable.style.background = 'transparent'; btnTable.style.color = '#736E68'; }
        } else {
            if (btnGrid) { btnGrid.style.background = 'transparent'; btnGrid.style.color = '#736E68'; }
            if (btnTable) { btnTable.style.background = '#D97757'; btnTable.style.color = '#FFF'; }
        }
        this.renderPostsList();
    },

    filterPosts(query) {
        this.searchQuery = (query || '').toLowerCase().trim();
        this.applyFilters();
    },

    applyFilters() {
        let result = [...this.posts];

        // 1. Status Filter
        if (this.statusFilter === 'armed') {
            result = result.filter(p => p.rule_id || p.keyword);
        } else if (this.statusFilter === 'docs') {
            result = result.filter(p => p.deliverable_url && p.deliverable_url.length > 5);
        } else if (this.statusFilter === 'comments') {
            result = result.filter(p => (p.comments_count > 0 || p.dms_sent > 0));
        } else if (this.statusFilter === 'test') {
            result = result.filter(p => p.media_id && (p.media_id.startsWith('reel_') || p.media_id.startsWith('ext_reel_') || p.media_id.startsWith('batch_reel_')));
        }

        // 2. Source Filter
        if (this.sourceFilter !== 'all') {
            if (this.sourceFilter === 'sheets') {
                result = result.filter(p => p.source === 'google_sheets_trigger' || (p.lead_magnet_title && p.lead_magnet_title.includes('Sheet')));
            } else if (this.sourceFilter === 'external_bridge') {
                result = result.filter(p => p.source === 'external_bridge' || p.source === 'external_bridge_batch');
            } else if (this.sourceFilter === 'feed_scan') {
                result = result.filter(p => p.source === 'feed_sentinel' || (!p.source && !p.media_id?.startsWith('reel_') && !p.media_id?.startsWith('ext_reel_')));
            } else if (this.sourceFilter === 'simulator') {
                result = result.filter(p => p.source === 'simulator' || p.media_id?.startsWith('reel_') || p.media_id?.startsWith('ext_reel_'));
            }
        }

        // 3. Search Query
        if (this.searchQuery) {
            result = result.filter(p => 
                (p.keyword && p.keyword.toLowerCase().includes(this.searchQuery)) ||
                (p.media_id && p.media_id.toLowerCase().includes(this.searchQuery)) ||
                (p.lead_magnet_title && p.lead_magnet_title.toLowerCase().includes(this.searchQuery)) ||
                (p.topic && p.topic.toLowerCase().includes(this.searchQuery)) ||
                (p.caption && p.caption.toLowerCase().includes(this.searchQuery)) ||
                (p.deliverable_url && p.deliverable_url.toLowerCase().includes(this.searchQuery))
            );
        }

        // 4. Sorting
        if (this.sortBy === 'comments') {
            result.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
        } else if (this.sortBy === 'dms') {
            result.sort((a, b) => (b.dms_sent || 0) - (a.dms_sent || 0));
        } else if (this.sortBy === 'clicks') {
            result.sort((a, b) => (b.clicks_count || 0) - (a.clicks_count || 0));
        } else {
            // Newest first by id or created_at
            result.sort((a, b) => (b.id || 0) - (a.id || 0));
        }

        this.filteredPosts = result;
        this.renderPostsList();
    },

    updateMetrics() {
        const total = this.posts.length;
        const armed = this.posts.filter(p => p.keyword).length;
        const docs = this.posts.filter(p => p.deliverable_url && p.deliverable_url.length > 5).length;
        const dms = this.posts.reduce((acc, p) => acc + (p.dms_sent || 0), 0);
        const withComments = this.posts.filter(p => (p.comments_count || 0) > 0).length;
        const testDemos = this.posts.filter(p => p.media_id && (p.media_id.startsWith('reel_') || p.media_id.startsWith('ext_reel_') || p.media_id.startsWith('batch_reel_'))).length;

        const mTotal = document.getElementById('metric-total-reels');
        const mArmed = document.getElementById('metric-armed-triggers');
        const mDocs = document.getElementById('metric-deliverables-linked');
        const mDms = document.getElementById('metric-dms-dispatched');

        if (mTotal) mTotal.textContent = total;
        if (mArmed) mArmed.textContent = armed;
        if (mDocs) mDocs.textContent = docs;
        if (mDms) mDms.textContent = dms;

        // Update filter pills counters
        const cAll = document.getElementById('count-pill-all');
        const cArmed = document.getElementById('count-pill-armed');
        const cDocs = document.getElementById('count-pill-docs');
        const cComments = document.getElementById('count-pill-comments');
        const cTest = document.getElementById('count-pill-test');

        if (cAll) cAll.textContent = total;
        if (cArmed) cArmed.textContent = armed;
        if (cDocs) cDocs.textContent = docs;
        if (cComments) cComments.textContent = withComments;
        if (cTest) cTest.textContent = testDemos;

        const countBadge = document.getElementById('agent-posts-count-badge');
        if (countBadge) {
            countBadge.textContent = `${this.filteredPosts.length} of ${total} Reels Active`;
        }
    },

    async loadPosts() {
        const container = document.getElementById('agent-posts-list');
        if (!container) return;

        try {
            const res = await App.apiCall('GET', '/api/agent/posts');
            this.posts = res.posts || [];
            this.applyFilters();
            this.updateMetrics();
        } catch (err) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 2.5rem; text-align: center;">
                    <h3>Error loading armed reels</h3>
                    <p style="color: #DC2626;">${err.message}</p>
                    <button class="btn btn-primary btn-sm" onclick="agentView.loadPosts()" style="margin-top: 1rem;">Try Again</button>
                </div>
            `;
        }
    },

    renderPostsList() {
        const container = document.getElementById('agent-posts-list');
        const countBadge = document.getElementById('agent-posts-count-badge');
        if (!container) return;

        if (countBadge) {
            countBadge.textContent = `${this.filteredPosts.length} of ${this.posts.length} Reels Active`;
        }

        if (this.filteredPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="background: #FFFFFF; border-radius: 16px; border: 1.5px dashed #E6E1D8; padding: 3.5rem 1.5rem; text-align: center;">
                    <span style="font-size: 2.75rem; display: block; margin-bottom: 0.75rem;">📡</span>
                    <h3 style="font-weight: 800; font-size: 1.25rem; color: #2C2A29; margin-bottom: 0.35rem;">
                        No Detected Reels Match Current Filters
                    </h3>
                    <p style="font-size: 0.88rem; color: #736E68; max-width: 520px; margin: 0 auto 1.5rem auto; line-height: 1.45;">
                        ${this.posts.length === 0 
                            ? 'No reels have been detected or ingested yet. Click <strong>Scan Feed Now</strong>, trigger a webhook from your research platform, or ingest a demo reel to see the live trigger session populate!'
                            : 'Try adjusting your search query, status pill, or source filter to find the reel you are looking for.'}
                    </p>
                    <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-primary btn-sm" onclick="agentView.simulateInboundPost()" style="font-weight: 800; border-radius: 10px; padding: 0.6rem 1.4rem;">
                            ⚡ Ingest Demo Test Reel
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="agentView.scanFeed()" style="font-weight: 700; border-radius: 10px; padding: 0.6rem 1.2rem;">
                            🔍 Scan Feed Now
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Render either Card Grid View or Matrix Table View
        if (this.viewMode === 'table') {
            this.renderTableView(container);
        } else {
            this.renderGridView(container);
        }
    },

    // 1. RICH VISUAL CARDS GRID VIEW
    renderGridView(container) {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); gap: 1.25rem;">
                ${this.filteredPosts.map(p => this.renderReelCard(p)).join('')}
            </div>
        `;
    },

        formatSetupTimestamp(isoString) {
        if (!isoString) {
            return {
                datePart: 'Recently Configured',
                timePart: '',
                exact: 'Recently Configured',
                timeAgo: 'Active'
            };
        }
        const d = new Date(isoString);
        if (isNaN(d.getTime())) {
            return {
                datePart: String(isoString),
                timePart: '',
                exact: String(isoString),
                timeAgo: 'Active'
            };
        }

        const datePart = d.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const timePart = d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const diffMs = Date.now() - d.getTime();
        const diffSec = Math.max(0, Math.floor(diffMs / 1000));
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        let timeAgo = 'Just now';
        if (diffDay > 0) timeAgo = `${diffDay}d ago`;
        else if (diffHour > 0) timeAgo = `${diffHour}h ago`;
        else if (diffMin > 0) timeAgo = `${diffMin}m ago`;
        else if (diffSec > 5) timeAgo = `${diffSec}s ago`;

        return {
            datePart,
            timePart,
            exact: `${datePart} at ${timePart}`,
            timeAgo
        };
    },

    renderReelCard(p) {
        const isSim = p.media_id && (p.media_id.startsWith('reel_') || p.media_id.startsWith('ext_reel_') || p.media_id.startsWith('batch_reel_'));
        const ts = this.formatSetupTimestamp(p.created_at);
        
        let sourceLabel = '📡 Webhook Bridge';
        let sourceBg = '#EEF2FF';
        let sourceColor = '#4338CA';
        if (p.source === 'google_sheets_trigger') {
            sourceLabel = '📊 Google Sheet';
            sourceBg = '#E3F2FD';
            sourceColor = '#0D47A1';
        } else if (p.source === 'feed_sentinel') {
            sourceLabel = '🤖 Sentinel Scan';
            sourceBg = '#F3E5F5';
            sourceColor = '#7B1FA2';
        } else if (isSim) {
            sourceLabel = '🧪 Simulator';
            sourceBg = '#FFF3E0';
            sourceColor = '#E65100';
        }

        const keyword = (p.keyword || 'AUTOMATED').toUpperCase();
        const captionPreview = (p.caption || 'No caption available').replace(/\n/g, ' ');
        const highlightedCaption = captionPreview.replace(
            new RegExp(`(${keyword})`, 'gi'),
            `<strong style="background: #FAF0EC; color: #D97757; padding: 2px 6px; border-radius: 5px; border: 1px solid rgba(217,119,87,0.3);">$1</strong>`
        );

        let docDomain = 'Document Link';
        let docIcon = '📄';
        if (p.deliverable_url) {
            if (p.deliverable_url.includes('docs.google.com')) {
                docDomain = 'Google Docs Deliverable';
                docIcon = '📘';
            } else if (p.deliverable_url.includes('notion.so')) {
                docDomain = 'Notion Blueprint';
                docIcon = '📓';
            } else if (p.deliverable_url.endsWith('.pdf')) {
                docDomain = 'PDF Guide';
                docIcon = '📕';
            }
        }

        return `
            <div class="card reel-visual-card" style="border-radius: 16px; border: 1.5px solid #E6E1D8; background: #FFFFFF; padding: 1.45rem; box-shadow: 0 4px 18px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s ease; position: relative;">
                
                <div>
                    <!-- TOP BAR: MEDIA ID + RULE PILL + SOURCE + LIVE STATUS -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 1.2rem;">🎬</span>
                            <span style="font-size: 0.84rem; font-weight: 800; color: #2C2A29; font-family: monospace; letter-spacing: -0.02em;">
                                #${p.media_id}
                            </span>
                            <button onclick="agentView.copyToClipboard('${p.media_id}', 'Media ID')" style="background: none; border: none; color: #96918A; cursor: pointer; font-size: 0.76rem; padding: 0;" title="Copy Media ID">
                                📋
                            </button>
                            <span style="font-size: 0.69rem; font-weight: 700; color: #736E68; background: #FAF8F5; border: 1px solid #E6E1D8; padding: 1px 6px; border-radius: 5px;">
                                Rule #${p.rule_id || 'Auto'}
                            </span>
                        </div>

                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                            <span style="font-size: 0.7rem; font-weight: 700; color: ${sourceColor}; background: ${sourceBg}; padding: 0.22rem 0.6rem; border-radius: 6px;">
                                ${sourceLabel}
                            </span>
                            <span style="font-size: 0.7rem; font-weight: 800; color: #2E7D32; background: #E8F5E9; padding: 0.22rem 0.65rem; border-radius: 999px; display: flex; align-items: center; gap: 4px; box-shadow: 0 1px 4px rgba(46,125,50,0.15);">
                                <span style="width: 7px; height: 7px; border-radius: 50%; background: #2E7D32; display: inline-block;"></span>
                                ARMED
                            </span>
                        </div>
                    </div>

                    <!-- PROMINENT DEDICATED SETUP DATE & TIME FIELD -->
                    <div style="background: #FAF8F5; border: 1.5px solid #EAE5DC; border-radius: 10px; padding: 0.65rem 0.85rem; margin-bottom: 0.95rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 28px; height: 28px; border-radius: 7px; background: #FAF0EC; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; color: #D97757; flex-shrink: 0;">
                                📅
                            </div>
                            <div>
                                <div style="font-size: 0.68rem; font-weight: 800; color: #8C827A; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1px;">
                                    Automation Set Up By Agent
                                </div>
                                <div style="font-size: 0.83rem; font-weight: 800; color: #2C2A29; font-family: 'SFMono-Regular', Consolas, monospace;">
                                    ${ts.exact}
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 0.72rem; font-weight: 800; color: #D97757; background: #FAF0EC; border: 1px solid rgba(217,119,87,0.25); padding: 2px 8px; border-radius: 999px;">
                                ⏱️ ${ts.timeAgo}
                            </span>
                            <span style="font-size: 0.68rem; font-weight: 800; color: #2E7D32; background: #E8F5E9; padding: 2px 7px; border-radius: 6px;">
                                ⚡ Live
                            </span>
                        </div>
                    </div>

                    <!-- ENHANCED VISUAL END-TO-END TRIGGER CONNECTION BAR -->
                    <div style="background: #FFFFFF; border-radius: 10px; border: 1.5px solid #E6E1D8; padding: 0.65rem 0.85rem; margin-bottom: 0.95rem; display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; font-size: 0.76rem;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <span style="font-size: 0.95rem;">🎬</span>
                            <span style="font-weight: 700; color: #2C2A29;">Reel Ingested</span>
                        </div>
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" style="flex-shrink: 0;"><path d="M1 6H15M15 6L10.5 1.5M15 6L10.5 10.5" stroke="#D97757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <div style="display: flex; align-items: center; gap: 5px; background: #FAF0EC; padding: 0.25rem 0.65rem; border-radius: 6px; border: 1.5px solid #D97757; box-shadow: 0 1px 4px rgba(217,119,87,0.15);">
                            <span style="font-size: 0.85rem;">🎯</span>
                            <span style="font-weight: 800; color: #D97757; letter-spacing: 0.04em;">TRIGGER: ${keyword}</span>
                        </div>
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" style="flex-shrink: 0;"><path d="M1 6H15M15 6L10.5 1.5M15 6L10.5 10.5" stroke="#D97757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <span style="font-size: 0.95rem;">${docIcon}</span>
                            <span style="font-weight: 700; color: #0288D1;">Doc Linked</span>
                        </div>
                    </div>

                    <!-- TOPIC & TITLE -->
                    <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.1rem; margin: 0 0 0.45rem 0; color: #2C2A29; line-height: 1.35;">
                        ${p.lead_magnet_title || p.topic || 'Instagram Autonomous Funnel'}
                    </h3>

                    <!-- REFINED CAPTION QUOTE CONTAINER -->
                    <div style="border-left: 3.5px solid #D97757; background: #FAF8F5; padding: 0.65rem 0.85rem; border-radius: 0 8px 8px 0; margin-bottom: 0.95rem; font-size: 0.81rem; color: #55504A; line-height: 1.45; max-height: 54px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${highlightedCaption}
                    </div>

                    <!-- COMPANION DELIVERABLE LINK ROW -->
                    <div style="margin-bottom: 1rem; background: #FFFFFF; border: 1.5px solid #EAE5DC; border-radius: 9px; padding: 0.55rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 320px;">
                            <span style="font-size: 0.95rem;">${docIcon}</span>
                            <a href="${p.deliverable_url}" target="_blank" style="font-size: 0.79rem; font-weight: 700; color: #D97757; text-decoration: none; overflow: hidden; text-overflow: ellipsis;">
                                ${p.deliverable_url || 'No deliverable link bound'}
                            </a>
                        </div>
                        <a href="${p.deliverable_url}" target="_blank" style="font-size: 0.73rem; font-weight: 800; color: #2C2A29; text-decoration: none; background: #FAF8F5; padding: 3px 8px; border-radius: 5px; border: 1px solid #E6E1D8; display: flex; align-items: center; gap: 3px;">
                            <span>Open</span> ↗
                        </a>
                    </div>
                </div>

                <div>
                    <!-- LIVE PERFORMANCE STATS ROW -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: #FAF8F5; border-radius: 10px; border: 1px solid #EAE5DC; padding: 0.65rem; margin-bottom: 1rem; text-align: center;">
                        <div>
                            <div style="font-size: 0.69rem; font-weight: 700; color: #736E68; text-transform: uppercase; letter-spacing: 0.03em;">Comments</div>
                            <div style="font-size: 1rem; font-weight: 800; color: #2C2A29;">💬 ${p.comments_count || 0}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.69rem; font-weight: 700; color: #736E68; text-transform: uppercase; letter-spacing: 0.03em;">DMs Sent</div>
                            <div style="font-size: 1rem; font-weight: 800; color: #2E7D32;">📬 ${p.dms_sent || 0}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.69rem; font-weight: 700; color: #736E68; text-transform: uppercase; letter-spacing: 0.03em;">Doc Clicks</div>
                            <div style="font-size: 1rem; font-weight: 800; color: #0288D1;">🔗 ${p.clicks_count || 0}</div>
                        </div>
                    </div>

                    <!-- CARD ACTION BUTTONS -->
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <button class="btn btn-primary btn-sm" style="flex: 1; font-weight: 800; font-size: 0.82rem; padding: 0.6rem; border-radius: 9px; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 10px rgba(217,119,87,0.25);" onclick="agentView.simulateComment('${p.media_id}', '${keyword}')">
                            <span>🧪</span> Test Trigger & Follow Gate
                        </button>
                        <button class="btn btn-secondary btn-sm" style="font-weight: 700; font-size: 0.82rem; padding: 0.6rem 0.95rem; border-radius: 9px; display: flex; align-items: center; gap: 5px;" onclick="agentView.inspectPayload('${p.media_id}')" title="Inspect Ingested JSON Payload">
                            <span>📋</span> Payload
                        </button>
                    </div>
                </div>

            </div>
        `;
    },

    // 2. COMPACT MATRIX TABLE VIEW (OPTIMIZED FOR 50-100+ REELS)
    renderTableView(container) {
        container.innerHTML = `
            <div style="overflow-x: auto; border: 1.5px solid #E6E1D8; border-radius: 12px; background: #FFFFFF;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
                    <thead>
                        <tr style="background: #FAF8F5; border-bottom: 1.5px solid #E6E1D8; color: #736E68; font-weight: 800; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.04em;">
                            <th style="padding: 0.85rem 1rem;">Status</th>
                            <th style="padding: 0.85rem 1rem;">Setup Date & Time</th>
                            <th style="padding: 0.85rem 1rem;">Reel Media ID</th>
                            <th style="padding: 0.85rem 1rem;">Trigger Keyword</th>
                            <th style="padding: 0.85rem 1rem;">Topic & Caption CTA</th>
                            <th style="padding: 0.85rem 1rem;">Companion Deliverable</th>
                            <th style="padding: 0.85rem 1rem; text-align: center;">Activity</th>
                            <th style="padding: 0.85rem 1rem; text-align: right;">Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.filteredPosts.map(p => {
                            const keyword = (p.keyword || 'AUTOMATED').toUpperCase();
                            const ts = this.formatSetupTimestamp(p.created_at);
                            return `
                                <tr style="border-bottom: 1px solid #F0ECE4; transition: background 0.15s ease;">
                                    <td style="padding: 0.85rem 1rem; vertical-align: middle;">
                                        <span style="font-size: 0.72rem; font-weight: 800; color: #2E7D32; background: #E8F5E9; padding: 2px 7px; border-radius: 999px; white-space: nowrap;">
                                            🟢 Armed & Live
                                        </span>
                                    </td>
                                    <td style="padding: 0.85rem 1rem; vertical-align: middle; white-space: nowrap;">
                                        <div style="font-family: monospace; font-weight: 800; color: #2C2A29; font-size: 0.8rem;">
                                            ${ts.datePart}
                                        </div>
                                        <div style="font-size: 0.72rem; color: #736E68;">
                                            ${ts.timePart} <span style="color: #D97757; font-weight: 700;">(${ts.timeAgo})</span>
                                        </div>
                                    </td>
                                    <td style="padding: 0.85rem 1rem; vertical-align: middle; font-family: monospace; font-weight: 700; color: #2C2A29;">
                                        <div style="display: flex; align-items: center; gap: 4px;">
                                            <span>#${p.media_id}</span>
                                            <button onclick="agentView.copyToClipboard('${p.media_id}', 'Media ID')" style="background: none; border: none; color: #96918A; cursor: pointer; font-size: 0.72rem; padding: 0;">📋</button>
                                        </div>
                                    </td>
                                    <td style="padding: 0.85rem 1rem; vertical-align: middle;">
                                        <span style="background: #FAF0EC; color: #D97757; font-weight: 800; font-size: 0.78rem; padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(217,119,87,0.3); letter-spacing: 0.03em;">
                                            ${keyword}
                                        </span>
                                    </td>
                                    <td style="padding: 0.85rem 1rem; vertical-align: middle; max-width: 260px;">
                                        <div style="font-weight: 800; color: #2C2A29; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            ${p.lead_magnet_title || p.topic || 'Reel Funnel'}
                                        </div>
                                        <div style="font-size: 0.76rem; color: #736E68; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            ${(p.caption || '').replace(/\n/g, ' ')}
                                        </div>
                                    </td>
                                    <td style="padding: 0.85rem 1rem; vertical-align: middle; max-width: 200px;">
                                        <a href="${p.deliverable_url}" target="_blank" style="color: #D97757; font-weight: 700; font-size: 0.78rem; text-decoration: none; overflow: hidden; text-overflow: ellipsis; display: block; white-space: nowrap;">
                                            📄 ${p.deliverable_url ? p.deliverable_url.replace(/^https?:\/\//, '') : 'None'} ↗
                                        </a>
                                    </td>
                                    <td style="padding: 0.85rem 1rem; vertical-align: middle; text-align: center; white-space: nowrap;">
                                        <span style="font-size: 0.75rem; color: #2C2A29; font-weight: 700;">💬 ${p.comments_count || 0}</span>
                                        <span style="margin: 0 4px; color: #D5CEBF;">|</span>
                                        <span style="font-size: 0.75rem; color: #2E7D32; font-weight: 800;">📬 ${p.dms_sent || 0}</span>
                                    </td>
                                    <td style="padding: 0.85rem 1rem; vertical-align: middle; text-align: right; white-space: nowrap;">
                                        <button class="btn btn-primary btn-sm" style="font-size: 0.76rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 6px;" onclick="agentView.simulateComment('${p.media_id}', '${keyword}')">
                                            🧪 Test Gate
                                        </button>
                                        <button class="btn btn-secondary btn-sm" style="font-size: 0.76rem; font-weight: 700; padding: 0.35rem 0.65rem; border-radius: 6px; margin-left: 4px;" onclick="agentView.inspectPayload('${p.media_id}')">
                                            📋 Payload
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // 3. INSPECT INBOUND PAYLOAD MODAL
    lastInspectedJson: '',
    inspectPayload(mediaId) {
        const post = this.posts.find(p => String(p.media_id) === String(mediaId));
        if (!post) {
            App.showToast('Reel payload not found', 'error');
            return;
        }

        const payloadJson = {
            media_id: post.media_id,
            trigger_keyword: post.keyword,
            deliverable_url: post.deliverable_url,
            lead_magnet_title: post.lead_magnet_title || post.topic,
            caption: post.caption,
            source: post.source || 'inbound_bridge',
            rule_id: post.rule_id,
            status: post.status || 'active',
            created_at: post.created_at,
            metrics: {
                comments_count: post.comments_count || 0,
                dms_sent: post.dms_sent || 0,
                clicks_count: post.clicks_count || 0
            }
        };

        this.lastInspectedJson = JSON.stringify(payloadJson, null, 2);

        const modalHtml = `
            <div style="font-family: 'Inter', sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div>
                        <div style="font-weight: 800; font-size: 1.1rem; color: #2C2A29;">
                            Reel Inbound Payload: #${post.media_id}
                        </div>
                        <div style="font-size: 0.8rem; color: #736E68;">
                            Ingested by Sentinel & bound to trigger keyword <strong>"${post.keyword}"</strong>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="agentView.copyToClipboard(agentView.lastInspectedJson, 'Inbound JSON Payload')" style="font-weight: 800; border-radius: 8px; padding: 0.45rem 1rem;">
                        📋 Copy JSON
                    </button>
                </div>

                <div style="background: #1E1E1E; border-radius: 12px; padding: 1.25rem; font-family: monospace; font-size: 0.82rem; color: #D4D4D4; max-height: 380px; overflow-y: auto; line-height: 1.5;">
                    <pre style="margin: 0; white-space: pre-wrap; word-break: break-all;">${this.lastInspectedJson}</pre>
                </div>

                <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm" onclick="App.closeModal()" style="font-weight: 700; border-radius: 8px; padding: 0.5rem 1.2rem;">
                        Close
                    </button>
                    <a href="${post.deliverable_url}" target="_blank" class="btn btn-primary btn-sm" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 1.2rem; text-decoration: none;">
                        Open Deliverable ↗
                    </a>
                </div>
            </div>
        `;

        App.openModal('Inbound Payload Inspector', modalHtml);
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
