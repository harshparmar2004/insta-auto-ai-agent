window['new-automation'] = {
    currentStep: 1,
    selectedMediaId: 'global',
    mediaList: [],
    searchQuery: '',
    step1Filter: 'reels',
    keywordMode: 'specific', // 'specific' or 'any'
    keywordList: ['PLAYBOOK', 'PDF'],

    // Direct Publish & Automate Studio State
    isDirectPublish: false,
    directMediaType: 'REELS', // 'REELS' or 'IMAGE'
    feedAspectRatio: 'auto', // 'auto', '1:1', '4:5', '16:9'
    directMediaUrl: '',
    directLocalFileUrl: '',
    directFileName: '',
    directFileSize: '',
    directCaption: 'Want our complete 2026 AI Playbook? Comment "DRAG" below and I will send it right to your DMs! 🚀',
    detectedKeyword: 'DRAG',
    detectedUrl: '',

    savedButtonsConfig: {
        gate_type: 'buttons',
        step1_text: "Hey there! Glad you're here ☺️\n\nTap below and I'll send you the access in just a moment ✨",
        step1_button: "Send me the access",
        step2_text: "Almost there !\nPlease visit my profile and tap follow to continue 😄",
        step2_profile_button: "Visit Profile",
        step2_confirm_button: "I'm following ✅",
        step3_text: "Dost appko document bejhdiya hai bahut mehnat sa bnaya hai please follow",
        step3_button: "Click me"
    },

    setKeywordMode(mode) {
        this.keywordMode = mode;
        this.renderStep2(document.getElementById('new-automation-content'));
    },

    addKeyword(word) {
        const input = document.getElementById('input-new-keyword');
        const text = (word !== undefined ? word : (input ? input.value : '')).trim();
        if (!text) return;

        const parts = text.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
        parts.forEach(p => {
            if (!this.keywordList.includes(p)) {
                this.keywordList.push(p);
            }
        });

        this.savedKeywords = this.keywordList.join(', ');
        if (input) input.value = '';
        this.renderStep2(document.getElementById('new-automation-content'));
    },

    removeKeyword(index) {
        this.keywordList.splice(index, 1);
        this.savedKeywords = this.keywordList.join(', ');
        this.renderStep2(document.getElementById('new-automation-content'));
    },

    extractCaptionIntelligence(caption) {
        if (!caption || typeof caption !== 'string') return { keyword: null, url: null };
        const clean = caption.trim();
        const stopWords = new Set([
            'BELOW', 'HERE', 'NOW', 'THIS', 'THE', 'AND', 'FOR', 'ME', 'TO', 'WITH', 
            'OR', 'SOMETHING', 'A', 'AN', 'IN', 'ON', 'AT', 'GET', 'MY', 'YOUR', 
            'ALL', 'IF', 'YOU', 'OUR', 'WE', 'LIKE', 'JUST', 'PLEASE', 'DOWN'
        ]);

        let detectedKeyword = null;

        // 1. Quoted after trigger verb
        const quotedMatch = clean.match(/(?:comment|dm|drop|reply|type|send)\s*(?:me|with|the\s*word)?\s*['"“‘]([a-zA-Z0-9_-]+)['"”’]/i);
        if (quotedMatch && quotedMatch[1]) {
            detectedKeyword = quotedMatch[1].toUpperCase().trim();
        }

        // 2. Word right after trigger verb
        if (!detectedKeyword) {
            const verbMatch = clean.match(/(?:comment|dm|drop|reply|type|send)\s*(?:me|with|the\s*word)?\s+([a-zA-Z0-9_-]{2,20})\b/i);
            if (verbMatch && verbMatch[1]) {
                const cand = verbMatch[1].toUpperCase().trim();
                if (!stopWords.has(cand)) detectedKeyword = cand;
            }
        }

        // 3. Quoted word anywhere
        if (!detectedKeyword) {
            const anyQuoted = clean.match(/['"“‘]([a-zA-Z0-9_-]{2,20})['"”’]/);
            if (anyQuoted && anyQuoted[1]) {
                const cand = anyQuoted[1].toUpperCase().trim();
                if (!stopWords.has(cand)) detectedKeyword = cand;
            }
        }

        // 4. Standalone capitalized word
        if (!detectedKeyword) {
            const allCapsWords = clean.match(/\b([A-Z0-9]{3,12})\b/g);
            if (allCapsWords) {
                for (const w of allCapsWords) {
                    if (!stopWords.has(w) && !['HTTP', 'HTTPS', 'REEL', 'POST', 'INSTA'].includes(w)) {
                        detectedKeyword = w;
                        break;
                    }
                }
            }
        }

        const urlMatch = clean.match(/https?:\/\/[^\s)\]]+/i);
        const detectedUrl = urlMatch ? urlMatch[0] : null;

        return { keyword: detectedKeyword, url: detectedUrl };
    },

    onDirectCaptionChange(caption) {
        this.directCaption = caption;
        const counter = document.getElementById('direct-caption-counter');
        if (counter) counter.textContent = `${caption.length} / 2,200 chars`;

        const phoneText = document.getElementById('phone-caption-text');
        if (phoneText) phoneText.textContent = caption;

        const intel = this.extractCaptionIntelligence(caption);
        if (intel.keyword) {
            this.detectedKeyword = intel.keyword;
            const funnel = document.getElementById('phone-funnel-preview');
            if (funnel) {
                funnel.innerHTML = `
                    <div style="color: #FFD166; font-weight: 800;">💬 Comment: "${this.detectedKeyword}"</div>
                    <div style="color: #A7F3D0; font-weight: 700; margin-top: 1px;">🤖 InstaAuto: DM link sent! 📩</div>
                `;
            }
            const nlpBadge = document.getElementById('direct-nlp-info');
            if (nlpBadge) {
                nlpBadge.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.1rem;">🤖</span>
                        <div>
                            <div style="font-size: 0.76rem; font-weight: 800; color: var(--text-primary);">Autonomous Keyword Intelligence:</div>
                            <div style="font-size: 0.74rem; color: var(--text-secondary);">
                                <span style="color: #15803D; font-weight: 800;">Target Keyword Detected: "${this.detectedKeyword}"</span>
                                ${intel.url ? ` &bull; <span style="color: var(--accent-primary); font-weight: 700;">Link: ${intel.url}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary" onclick="window['new-automation'].applyDetectedKeyword()" style="font-size: 0.72rem; padding: 3px 9px; font-weight: 800;">
                        ✓ Auto-Apply "${this.detectedKeyword}"
                    </button>
                `;
            }
        }
        if (intel.url) {
            this.detectedUrl = intel.url;
        }
    },

    onDirectMediaUrlChange(url) {
        this.directMediaUrl = url;
        this.directLocalFileUrl = '';
        const container = document.getElementById('phone-preview-media-container');
        if (container) {
            const isReel = this.directMediaType === 'REELS';
            container.innerHTML = this.renderPhoneMediaContent(isReel, url);
        }
    },

    onDirectLocalFileSelected(inputEl) {
        const file = inputEl?.files?.[0];
        if (!file) return;

        this.directFileName = file.name;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        this.directFileSize = `${sizeMb} MB`;

        const blobUrl = URL.createObjectURL(file);
        this.directLocalFileUrl = blobUrl;
        this.directMediaUrl = blobUrl;
        
        if (file.type && file.type.startsWith('image/')) {
            this.directMediaType = 'IMAGE';
            this.feedAspectRatio = 'auto'; // Default to auto fit so image is never cropped!
        } else {
            this.directMediaType = 'REELS';
        }

        const container = document.getElementById('new-automation-content');
        if (container) {
            this.renderDirectPublishStudio(container);
        }
        App.showToast(`✅ Selected "${file.name}" (${this.directMediaType === 'REELS' ? 'Reel Video' : 'Photo Post'})`, 'success');
    },

    setDirectMediaType(type) {
        this.directMediaType = type;
        if (type === 'IMAGE' && !this.feedAspectRatio) {
            this.feedAspectRatio = 'auto';
        }
        const container = document.getElementById('new-automation-content');
        if (container) {
            this.renderDirectPublishStudio(container);
        }
    },

    setFeedAspectRatio(ratio) {
        this.feedAspectRatio = ratio || 'auto';
        const container = document.getElementById('new-automation-content');
        if (container) {
            this.renderDirectPublishStudio(container);
        }
    },

    setDirectSamplePreset(type) {
        if (type === 'video') {
            this.directMediaType = 'REELS';
            this.directMediaUrl = 'https://assets.mixkit.co/videos/preview/mixkit-vertical-view-of-a-neon-sign-at-night-42721-large.mp4';
            this.directLocalFileUrl = '';
            this.directFileName = '';
            this.directCaption = 'Want our complete 2026 AI Agent Playbook? Comment "DRAG" below and I will send it right to your DMs! 🚀';
        } else {
            this.directMediaType = 'IMAGE';
            this.feedAspectRatio = 'auto';
            this.directMediaUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop';
            this.directLocalFileUrl = '';
            this.directFileName = '';
            this.directCaption = 'Drop "PLAYBOOK" in the comments to get the exclusive growth blueprint! 📚';
        }
        const intel = this.extractCaptionIntelligence(this.directCaption);
        this.detectedKeyword = intel.keyword || 'DRAG';
        this.renderDirectPublishStudio(document.getElementById('new-automation-content'));
    },

    appendCaptionCta(word) {
        const cta = ` Comment "${word}" below to get instant access! 👇`;
        this.directCaption = (this.directCaption || '').trim() + '\n\n' + cta;
        const txt = document.getElementById('direct-caption-input');
        if (txt) txt.value = this.directCaption;
        this.onDirectCaptionChange(this.directCaption);
        this.applyDetectedKeyword();
    },

    applyDetectedKeyword() {
        if (this.detectedKeyword) {
            if (!this.keywordList.includes(this.detectedKeyword)) {
                this.keywordList = [this.detectedKeyword];
            }
            this.savedKeywords = this.detectedKeyword;
            App.showToast(`Applied "${this.detectedKeyword}" as trigger keyword!`, 'success');
        }
    },

    renderPhoneMediaContent(isReel, url) {
        if (!url) {
            return `
                <div onclick="document.getElementById('direct-media-file-input')?.click()" style="color: #FFF; font-size: 0.8rem; text-align: center; padding: 1.5rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; line-height: 1; margin-bottom: 0.5rem; box-shadow: 0 4px 14px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.4);">
                        +
                    </div>
                    <div style="font-weight: 800; font-size: 0.82rem;">${isReel ? 'No Reel Video Selected' : 'No Photo Selected'}</div>
                    <div style="font-size: 0.68rem; color: rgba(255,255,255,0.75); margin-top: 0.2rem;">Click to choose from computer gallery</div>
                    <div style="margin-top: 0.6rem; background: var(--accent-primary); color: #FFF; font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 6px;">
                        📁 Choose from Computer
                    </div>
                </div>
            `;
        }
        if (isReel) {
            return `<video src="${url}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; display: block;"></video>`;
        } else {
            const ratio = this.feedAspectRatio || 'auto';
            if (ratio === 'auto') {
                return `<img src="${url}" alt="Post preview" style="max-width: 100%; max-height: 220px; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto;">`;
            } else {
                return `<img src="${url}" alt="Post preview" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
            }
        }
    },

    renderSmartphonePreview(isReel, mediaUrl, caption) {
        if (isReel) {
            // === 9:16 INSTAGRAM REEL PREVIEW ===
            return `
                <div style="width: 270px; height: 470px; background: #000000; border-radius: 32px; border: 6px solid #2B2825; box-shadow: 0 12px 36px rgba(0,0,0,0.25); position: relative; overflow: hidden; display: flex; flex-direction: column; color: #FFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    
                    <!-- TOP INSTAGRAM BAR -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; padding: 10px 12px 6px 12px; display: flex; align-items: center; justify-content: space-between; z-index: 10; background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%);">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF); padding: 1.5px;">
                                <div style="width: 100%; height: 100%; border-radius: 50%; background: #1C1917; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 800; color:#FFF;">HP</div>
                            </div>
                            <div>
                                <div style="font-size: 0.72rem; font-weight: 800; line-height: 1.1; color: #FFF;">harshparmar007__</div>
                                <div style="font-size: 0.58rem; color: rgba(255,255,255,0.8);">♫ Original audio</div>
                            </div>
                        </div>
                        <div style="font-size: 0.85rem; font-weight: 800; color: #FFF; cursor: pointer;">•••</div>
                    </div>

                    <!-- 9:16 VERTICAL VIDEO CONTAINER -->
                    <div id="phone-preview-media-container" style="flex: 1; position: relative; background: #111113; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        ${this.renderPhoneMediaContent(true, mediaUrl)}
                    </div>

                    <!-- FLOATING RIGHT ACTION ICONS -->
                    <div style="position: absolute; right: 10px; bottom: 85px; display: flex; flex-direction: column; align-items: center; gap: 14px; z-index: 10;">
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">❤️</div>
                            <div style="font-size: 0.58rem; font-weight: 700; color: #FFF;">14.2K</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">💬</div>
                            <div style="font-size: 0.58rem; font-weight: 700; color: #FFF;">284</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 1.25rem; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">✈️</div>
                            <div style="font-size: 0.58rem; font-weight: 700; color: #FFF;">Share</div>
                        </div>
                        <div style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid #FFF; background: #222; display: flex; align-items: center; justify-content: center; font-size: 0.65rem;">
                            🎵
                        </div>
                    </div>

                    <!-- OVERLAY ACTION ICONS & LIVE CAPTION -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 48px; padding: 10px 10px 12px 10px; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 70%, transparent 100%); z-index: 10;">
                        <div style="font-size: 0.72rem; font-weight: 600; line-height: 1.35; margin-bottom: 6px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); max-height: 48px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                            <strong style="color: #FFF; margin-right: 4px;">harshparmar007__</strong>
                            <span id="phone-caption-text">${caption || 'Your caption will appear here...'}</span>
                        </div>

                        <!-- SIMULATED AUTOMATION RESPONSE PREVIEW -->
                        <div id="phone-funnel-preview" style="background: rgba(255,255,255,0.18); backdrop-filter: blur(8px); border-radius: 7px; padding: 4px 7px; border: 1px solid rgba(255,255,255,0.25); font-size: 0.62rem;">
                            <div style="color: #FFD166; font-weight: 800;">💬 Comment: "${this.detectedKeyword || 'KEYWORD'}"</div>
                            <div style="color: #A7F3D0; font-weight: 700; margin-top: 1px;">🤖 InstaAuto: DM link sent! 📩</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // === AUTHENTIC INSTAGRAM FEED POST PREVIEW ===
            const ratio = this.feedAspectRatio || 'auto';
            let mediaBoxStyle = 'width: 100%; background: #000000; overflow: hidden; display: flex; align-items: center; justify-content: center;';
            
            if (ratio === '1:1') {
                mediaBoxStyle += ' aspect-ratio: 1 / 1; max-height: 220px;';
            } else if (ratio === '4:5') {
                mediaBoxStyle += ' aspect-ratio: 4 / 5; max-height: 240px;';
            } else if (ratio === '16:9') {
                mediaBoxStyle += ' aspect-ratio: 16 / 9; max-height: 170px;';
            } else {
                // Auto Fit
                mediaBoxStyle += ' min-height: 160px; max-height: 220px;';
            }

            return `
                <div style="width: 270px; height: 470px; background: #FFFFFF; border-radius: 32px; border: 6px solid #2B2825; box-shadow: 0 12px 36px rgba(0,0,0,0.25); position: relative; overflow: hidden; display: flex; flex-direction: column; color: #18181B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    
                    <!-- TOP FEED HEADER -->
                    <div style="padding: 10px 10px 8px 10px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F0ECE6; background: #FFFFFF;">
                        <div style="display: flex; align-items: center; gap: 7px;">
                            <div style="width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF); padding: 1.5px;">
                                <div style="width: 100%; height: 100%; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 800; color: #18181B;">HP</div>
                            </div>
                            <div>
                                <div style="font-size: 0.74rem; font-weight: 800; line-height: 1.1; color: #18181B;">harshparmar007__</div>
                                <div style="font-size: 0.58rem; color: #71717A;">Suggested Post</div>
                            </div>
                        </div>
                        <div style="font-size: 0.85rem; font-weight: 800; color: #27272A; cursor: pointer;">•••</div>
                    </div>

                    <!-- MEDIA DISPLAY (AUTO-FIT OR CHOSEN ASPECT RATIO) -->
                    <div id="phone-preview-media-container" style="${mediaBoxStyle}">
                        ${this.renderPhoneMediaContent(false, mediaUrl)}
                    </div>

                    <!-- ACTION BAR (HEART, COMMENT, SHARE, SAVE) -->
                    <div style="padding: 8px 10px 4px 10px; display: flex; align-items: center; justify-content: space-between; background: #FFFFFF;">
                        <div style="display: flex; align-items: center; gap: 10px; font-size: 1.1rem; cursor: pointer;">
                            <span title="Like">❤️</span>
                            <span title="Comment">💬</span>
                            <span title="Share">✈️</span>
                        </div>
                        <div style="font-size: 1.05rem; cursor: pointer;" title="Save">
                            🔖
                        </div>
                    </div>

                    <!-- LIKES, CAPTION & SIMULATED DM AUTOMATION RESPONSE -->
                    <div style="padding: 0 10px 8px 10px; flex: 1; overflow-y: auto; background: #FFFFFF;">
                        <div style="font-size: 0.68rem; font-weight: 800; color: #18181B; margin-bottom: 2px;">
                            1,842 likes
                        </div>

                        <!-- FEED POST CAPTION -->
                        <div style="font-size: 0.72rem; line-height: 1.35; color: #27272A; margin-bottom: 6px;">
                            <strong style="color: #18181B; margin-right: 4px;">harshparmar007__</strong>
                            <span id="phone-caption-text">${caption || 'Your caption will appear here...'}</span>
                        </div>

                        <!-- SIMULATED COMMENT & AUTOMATION DM BUBBLE -->
                        <div id="phone-funnel-preview" style="background: #F4F0EB; border-radius: 8px; padding: 5px 8px; border: 1px solid #E4DFD7; font-size: 0.65rem; margin-top: 4px;">
                            <div style="color: #8B5CF6; font-weight: 800;">💬 Comment: "${this.detectedKeyword || 'KEYWORD'}"</div>
                            <div style="color: #15803D; font-weight: 700; margin-top: 1px;">🤖 InstaAuto: DM link sent! 📩</div>
                        </div>

                        <div style="font-size: 0.62rem; color: #A1A1AA; margin-top: 6px;">
                            View all 38 comments &bull; 2 hours ago
                        </div>
                    </div>

                    <!-- BOTTOM INSTAGRAM TAB BAR -->
                    <div style="padding: 6px 12px; border-top: 1px solid #F0ECE6; background: #FAFAFA; display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; color: #27272A;">
                        <span>🏠</span>
                        <span>🔍</span>
                        <span style="font-size: 1.15rem; font-weight: 900;">+</span>
                        <span>🎬</span>
                        <div style="width: 16px; height: 16px; border-radius: 50%; background: #27272A; color: #FFF; font-size: 0.45rem; display: flex; align-items: center; justify-content: center; font-weight: 800;">HP</div>
                    </div>

                </div>
            `;
        }
    },

    openDirectGalleryPicker() {
        this.step1Filter = 'direct';
        this.isDirectPublish = true;
        this.selectedMediaId = 'direct_publish';
        this.renderStep1(document.getElementById('new-automation-content'));
        setTimeout(() => {
            const fileInput = document.getElementById('direct-media-file-input');
            if (fileInput) fileInput.click();
        }, 80);
    },

    async render(container) {
        container.innerHTML = `
            <div class="view" id="new-automation-view" style="width: 100%; max-width: 1480px; margin: 0 auto;">
                
                <!-- COHESIVE FLOW CONTAINER -->
                <div style="background: #FFFFFF; border-radius: 18px; border: 1px solid var(--border-color); box-shadow: 0 2px 16px rgba(0,0,0,0.03); overflow: hidden; width: 100%;">
                    
                    <!-- HEADER BAR & STEPPER INDICATOR -->
                    <div style="padding: 1.15rem 1.75rem 0.85rem 1.75rem; background: #FAF8F5; border-bottom: 1px solid var(--border-color);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.85rem;">
                            <div>
                                <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.5rem; letter-spacing: -0.02em; color: var(--text-primary); margin:0;">Create New Automation</h1>
                                <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.15rem 0 0 0;">Set up automated comment-to-DM responses and deliverable links in 4 easy steps.</p>
                            </div>
                            
                            <!-- ACCELERATOR PRESETS -->
                            <div style="display:flex; gap:0.5rem;">
                                <button type="button" class="btn btn-secondary btn-sm" onclick="window['new-automation'].applyTemplate('pdf')" style="font-size:0.78rem; font-weight:700; background:#FFFFFF; padding:0.35rem 0.75rem;">
                                    Lead E-Book Preset
                                </button>
                                <button type="button" class="btn btn-primary btn-sm" onclick="window['new-automation'].applyTemplate('follow')" style="font-size:0.78rem; font-weight:800; padding:0.35rem 0.75rem;">
                                    Follow First Gate 🔐
                                </button>
                                <button type="button" class="btn btn-secondary btn-sm" onclick="window['new-automation'].applyTemplate('course')" style="font-size:0.78rem; font-weight:700; background:#FFFFFF; padding:0.35rem 0.75rem;">
                                    Course Signup
                                </button>
                            </div>
                        </div>

                        <!-- 4-STEP INDICATOR TABS -->
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.65rem; width: 100%;">
                            <div id="step-tab-1" class="step-tab active" onclick="window['new-automation'].goToStep(1)" style="padding: 0.65rem 0.85rem; border-radius: 10px; background: #FFFFFF; border: 2px solid var(--accent-primary); cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
                                <div id="step-num-1" style="width: 24px; height: 24px; border-radius: 50%; background: var(--accent-primary); color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.78rem; flex-shrink: 0;">1</div>
                                <div>
                                    <div style="font-size: 0.68rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">STEP 1</div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">Target Reel</div>
                                </div>
                            </div>

                            <div id="step-tab-2" class="step-tab" onclick="window['new-automation'].goToStep(2)" style="padding: 0.65rem 0.85rem; border-radius: 10px; background: #FAF8F5; border: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
                                <div id="step-num-2" style="width: 24px; height: 24px; border-radius: 50%; background: var(--border-color); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.78rem; flex-shrink: 0;">2</div>
                                <div>
                                    <div style="font-size: 0.68rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">STEP 2</div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">Trigger Keywords</div>
                                </div>
                            </div>

                            <div id="step-tab-3" class="step-tab" onclick="window['new-automation'].goToStep(3)" style="padding: 0.65rem 0.85rem; border-radius: 10px; background: #FAF8F5; border: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
                                <div id="step-num-3" style="width: 24px; height: 24px; border-radius: 50%; background: var(--border-color); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.78rem; flex-shrink: 0;">3</div>
                                <div>
                                    <div style="font-size: 0.68rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">STEP 3</div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">DM & Resource</div>
                                </div>
                            </div>

                            <div id="step-tab-4" class="step-tab" onclick="window['new-automation'].goToStep(4)" style="padding: 0.65rem 0.85rem; border-radius: 10px; background: #FAF8F5; border: 1px solid var(--border-color); cursor: pointer; display: flex; align-items: center; gap: 0.6rem;">
                                <div id="step-num-4" style="width: 24px; height: 24px; border-radius: 50%; background: var(--border-color); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.78rem; flex-shrink: 0;">4</div>
                                <div>
                                    <div style="font-size: 0.68rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">STEP 4</div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">Pacing & Reply</div>
                                </div>
                            </div>
                        </div>

                        <!-- PROGRESS BAR -->
                        <div style="width: 100%; height: 5px; background: var(--border-color); border-radius: 10px; margin-top: 0.65rem; overflow: hidden;">
                            <div id="flow-progress-bar" style="width: 25%; height: 100%; background: var(--accent-primary); transition: width 0.3s ease-in-out;"></div>
                        </div>
                    </div>

                    <!-- STEP BODY CONTENT -->
                    <div id="new-automation-content" style="padding: 1.35rem 1.75rem; width: 100%;">
                        <div class="text-center" style="padding:3rem;"><div class="spinner"></div></div>
                    </div>

                    <!-- VISIBLE ACTION BAR -->
                    <div style="width: 100%; background: #FFFFFF; border-top: 1px solid var(--border-color); padding: 0.85rem 1.5rem; display: flex; align-items: center; justify-content: space-between;">
                        <button type="button" class="btn btn-secondary" onclick="App.navigate('workflows')" style="font-weight: 700; padding: 0.55rem 1.15rem; font-size: 0.88rem;">Cancel</button>

                        <div style="display: flex; gap: 0.65rem;">
                            <button type="button" id="btn-flow-back" class="btn btn-secondary" onclick="window['new-automation'].goToPrevStep()" style="font-weight: 700; font-size: 0.88rem; padding: 0.55rem 1.25rem; display: none;">
                                ← Back
                            </button>

                            <button type="button" id="btn-flow-next" class="btn btn-primary" onclick="window['new-automation'].goToNextStep()" style="font-weight: 800; font-size: 0.88rem; padding: 0.58rem 1.45rem;">
                                Continue to Step 2 →
                            </button>

                            <button type="button" id="btn-flow-deploy" class="btn btn-primary" onclick="window['new-automation'].saveAutomation()" style="font-weight: 800; font-size: 0.9rem; padding: 0.58rem 1.65rem; display: none;">
                                🚀 Deploy Automation
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;
        await this.loadPage();
    },

    async loadPage() {
        try {
            this.mediaList = await App.apiCall('GET', '/api/media') || [];
            this.currentStep = 1;
            this.renderStepContent();
        } catch (err) {
            document.getElementById('new-automation-content').innerHTML = `
                <div class="empty-state" style="width:100%;">
                    <h3>Error loading media posts</h3>
                    <p>${err.message}</p>
                    <button class="btn btn-primary" onclick="window['new-automation'].loadPage()">Retry</button>
                </div>
            `;
        }
    },

    goToStep(stepNum) {
        this.currentStep = stepNum;
        this.updateStepperHeader();
        this.renderStepContent();
    },

    goToNextStep() {
        if (this.currentStep === 1) {
            if (this.isDirectPublish || this.step1Filter === 'direct') {
                this.isDirectPublish = true;
                const mediaUrl = (this.directMediaUrl || this.directLocalFileUrl || '').trim();
                if (!mediaUrl && !this.directFileName) {
                    App.showToast('Please choose a Reel or Post from your computer gallery to continue', 'warning');
                    return;
                }
                if (!this.directCaption || !this.directCaption.trim()) {
                    App.showToast('Please enter an Instagram caption for your post', 'warning');
                    return;
                }

                // Auto extract intelligence from caption
                const intel = this.extractCaptionIntelligence(this.directCaption);
                const targetKw = intel.keyword || this.detectedKeyword || 'DRAG';
                this.keywordList = [targetKw];
                this.savedKeywords = targetKw;
                if (intel.url) {
                    this.savedLinkUrl = intel.url;
                }
                this.selectedMediaId = 'direct_publish';
            } else if (!this.selectedMediaId) {
                App.showToast('Please select a target post or choose Account-Wide Rule to continue', 'warning');
                return;
            }
        }

        if (this.currentStep === 2 && this.keywordMode !== 'any') {
            const pendingInput = document.getElementById('input-new-keyword');
            if (pendingInput && pendingInput.value.trim()) {
                const parts = pendingInput.value.trim().split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
                parts.forEach(p => {
                    if (!this.keywordList.includes(p)) this.keywordList.push(p);
                });
                this.savedKeywords = this.keywordList.join(', ');
            }
            if (this.keywordList.length === 0) {
                App.showToast('Please add at least one keyword, or select "Any Comment" mode', 'warning');
                return;
            }
        }

        if (this.currentStep < 4) {
            this.currentStep += 1;
            this.updateStepperHeader();
            this.renderStepContent();
        }
    },

    goToPrevStep() {
        if (this.currentStep > 1) {
            this.currentStep -= 1;
            this.updateStepperHeader();
            this.renderStepContent();
        }
    },

    updateStepperHeader() {
        for (let i = 1; i <= 4; i++) {
            const tab = document.getElementById(`step-tab-${i}`);
            const num = document.getElementById(`step-num-${i}`);
            if (tab && num) {
                if (i === this.currentStep) {
                    tab.style.background = '#FFFFFF';
                    tab.style.border = '2px solid var(--accent-primary)';
                    num.style.background = 'var(--accent-primary)';
                    num.style.color = '#FFFFFF';
                } else if (i < this.currentStep) {
                    tab.style.background = '#FAF8F5';
                    tab.style.border = '1px solid var(--border-color)';
                    num.style.background = '#2E7D32';
                    num.style.color = '#FFFFFF';
                } else {
                    tab.style.background = '#FAF8F5';
                    tab.style.border = '1px solid var(--border-color)';
                    num.style.background = 'var(--border-color)';
                    num.style.color = 'var(--text-secondary)';
                }
            }
        }

        const progressBar = document.getElementById('flow-progress-bar');
        if (progressBar) progressBar.style.width = `${(this.currentStep / 4) * 100}%`;

        const btnBack = document.getElementById('btn-flow-back');
        const btnNext = document.getElementById('btn-flow-next');
        const btnDeploy = document.getElementById('btn-flow-deploy');

        if (btnBack) btnBack.style.display = this.currentStep > 1 ? 'inline-block' : 'none';

        if (btnNext) {
            if (this.currentStep < 4) {
                btnNext.style.display = 'inline-block';
                btnNext.textContent = `Continue to Step ${this.currentStep + 1} →`;
            } else {
                btnNext.style.display = 'none';
            }
        }

        if (btnDeploy) {
            btnDeploy.style.display = this.currentStep === 4 ? 'inline-block' : 'none';
            if (this.isDirectPublish) {
                btnDeploy.textContent = '🚀 Publish to Instagram & Arm Automation';
            } else {
                btnDeploy.textContent = '🚀 Deploy Automation';
            }
        }
    },

    renderStepContent() {
        const container = document.getElementById('new-automation-content');
        if (!container) return;

        if (this.currentStep === 1) {
            this.renderStep1(container);
        } else if (this.currentStep === 2) {
            this.renderStep2(container);
        } else if (this.currentStep === 3) {
            this.renderStep3(container);
        } else if (this.currentStep === 4) {
            this.renderStep4(container);
        }
    },

    filterReels(query) {
        this.searchQuery = query || '';
        this.renderStep1(document.getElementById('new-automation-content'));
    },

    setStep1Filter(filter) {
        this.step1Filter = filter;
        if (filter === 'direct') {
            this.isDirectPublish = true;
            this.selectedMediaId = 'direct_publish';
        } else {
            this.isDirectPublish = false;
            if (this.selectedMediaId === 'direct_publish') {
                this.selectedMediaId = 'global';
            }
        }
        this.renderStep1(document.getElementById('new-automation-content'));
    },

    async refreshMedia() {
        const btn = document.getElementById('btn-refresh-step1-reels');
        if (btn) {
            btn.innerHTML = '<span class="spinner"></span> Syncing from Instagram...';
            btn.disabled = true;
        }
        try {
            const res = await App.apiCall('POST', '/api/media/sync');
            this.mediaList = await App.apiCall('GET', '/api/media') || [];
            const count = res.count !== undefined ? res.count : 'latest';
            App.showToast(`✅ Synced ${count} items from Instagram!`, 'success');
            this.renderStep1(document.getElementById('new-automation-content'));
        } catch (err) {
            App.showToast(err.message, 'error');
        } finally {
            if (btn) {
                btn.innerHTML = '<span>🔄 Refresh Latest Reels</span>';
                btn.disabled = false;
            }
        }
    },

    renderStep1(container) {
        if (this.step1Filter === 'direct') {
            return this.renderDirectPublishStudio(container);
        }

        let filtered = (this.mediaList || []).filter(m => {
            const cap = (m.caption || '').toLowerCase();
            return !this.searchQuery || cap.includes(this.searchQuery.toLowerCase());
        });

        if (this.step1Filter === 'reels') {
            filtered = filtered.filter(m => 
                m.media_product_type === 'REELS' || m.media_type === 'REEL' || (m.media_type === 'VIDEO' && m.media_product_type !== 'FEED')
            );
        }

        const reelsCount = (this.mediaList || []).filter(m => 
            m.media_product_type === 'REELS' || m.media_type === 'REEL' || (m.media_type === 'VIDEO' && m.media_product_type !== 'FEED')
        ).length;
        const totalCount = (this.mediaList || []).length;

        const isGlobalSelected = String(this.selectedMediaId) === 'global';

        let gridHtml = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.85rem; width: 100%;">
                
                <!-- 1. DIRECT PUBLISH FROM COMPUTER (FIRST IN GRID WITH PROMINENT PLUS ICON) -->
                <div class="reel-card-item" onclick="window['new-automation'].openDirectGalleryPicker()" style="
                    border-radius: 14px;
                    border: 2px dashed var(--accent-primary);
                    background: #FFFBF9;
                    box-shadow: 0 2px 10px rgba(217, 119, 87, 0.08);
                    cursor: pointer;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                ">
                    <div style="height: 120px; background: linear-gradient(135deg, #FF6B6B 0%, #D97757 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.65rem; text-align: center; color: #FFF; position: relative;">
                        <div style="width: 42px; height: 42px; border-radius: 50%; background: #FFFFFF; color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 900; margin-bottom: 0.35rem; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
                            +
                        </div>
                        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.88rem; color: #FFF;">Publish New Reel / Post</div>
                        <div style="font-size: 0.68rem; color: rgba(255,255,255,0.95); margin-top: 0.1rem;">Choose from Computer Gallery</div>
                    </div>

                    <div style="padding: 0.75rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.84rem; color: var(--text-primary); display: flex; align-items: center; gap: 4px;">
                                <span>➕ Select Reel or Post</span>
                            </div>
                            <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.35;">Pick video or photo from your computer gallery to post directly & auto-arm DM automation</div>
                        </div>
                    </div>

                    <div style="background: var(--accent-primary); color: #FFFFFF; font-size: 0.72rem; font-weight: 800; text-align: center; padding: 6px 8px; letter-spacing: 0.04em; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        📁 CHOOSE FROM COMPUTER
                    </div>
                </div>

                <!-- 2. GLOBAL ACCOUNT-WIDE RULE -->
                <div class="reel-card-item ${isGlobalSelected ? 'selected' : ''}" onclick="window['new-automation'].selectReel('global', this)" style="
                    border-radius: 14px;
                    border: ${isGlobalSelected ? '2.5px solid var(--accent-primary)' : '1.5px solid var(--border-color)'};
                    outline: ${isGlobalSelected ? '3px solid var(--accent-primary)' : 'none'};
                    outline-offset: ${isGlobalSelected ? '3px' : '0'};
                    background: ${isGlobalSelected ? '#FDF8F6' : '#FFFFFF'};
                    box-shadow: ${isGlobalSelected ? '0 0 0 4px rgba(217, 119, 87, 0.28), 0 8px 24px rgba(217, 119, 87, 0.2)' : '0 1px 4px rgba(0,0,0,0.02)'};
                    cursor: pointer;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                ">
                    ${isGlobalSelected ? `<div style="position:absolute; top:8px; right:8px; width:26px; height:26px; border-radius:50%; background:var(--accent-primary); color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.85rem; z-index:10; box-shadow:0 2px 8px rgba(0,0,0,0.25); border: 2px solid #FFFFFF;">✓</div>` : ''}
                    
                    <div style="height: 120px; background: linear-gradient(135deg, #FAF8F5 0%, #E6E1D8 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.65rem; text-align: center;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">🌐</div>
                        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.88rem; color: var(--accent-primary);">Account-Wide Rule</div>
                        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.1rem;">Applies to all current & newly posted Reels</div>
                    </div>

                    <div style="padding: 0.75rem; flex: 1;">
                        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.82rem; color: var(--text-primary);">Global Account Rule</div>
                        <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 0.15rem; line-height: 1.35;">Triggers on comments across your entire Instagram profile</div>
                    </div>

                    ${isGlobalSelected ? `
                        <div style="background: var(--accent-primary); color: #FFFFFF; font-size: 0.7rem; font-weight: 800; text-align: center; padding: 4px 8px; letter-spacing: 0.04em;">
                            ✓ SELECTED
                        </div>
                    ` : ''}
                </div>
        `;

        filtered.forEach(m => {
            const isSelected = String(this.selectedMediaId) === String(m.id);
            const isReel = m.media_product_type === 'REELS' || m.media_type === 'REEL' || (m.media_type === 'VIDEO' && m.media_product_type !== 'FEED');
            const thumbUrl = m.thumbnail_url || m.media_url || '';
            const captionCut = m.caption ? (m.caption.slice(0, 45) + '...') : 'Instagram Content';
            const comments = m.comments_count || 0;

            gridHtml += `
                <div class="reel-card-item ${isSelected ? 'selected' : ''}" onclick="window['new-automation'].selectReel('${m.id}', this)" style="
                    border-radius: 14px;
                    border: ${isSelected ? '2.5px solid var(--accent-primary)' : '1.5px solid var(--border-color)'};
                    outline: ${isSelected ? '3px solid var(--accent-primary)' : 'none'};
                    outline-offset: ${isSelected ? '3px' : '0'};
                    background: ${isSelected ? '#FDF8F6' : '#FFFFFF'};
                    box-shadow: ${isSelected ? '0 0 0 4px rgba(217, 119, 87, 0.28), 0 8px 24px rgba(217, 119, 87, 0.2)' : '0 1px 4px rgba(0,0,0,0.02)'};
                    cursor: pointer;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                ">
                    ${isSelected ? `<div style="position:absolute; top:8px; right:8px; width:26px; height:26px; border-radius:50%; background:var(--accent-primary); color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.85rem; z-index:10; box-shadow:0 2px 8px rgba(0,0,0,0.25); border: 2px solid #FFFFFF;">✓</div>` : ''}

                    <!-- 9:16 VERTICAL COVER FOR REELS -->
                    <div style="
                        position: relative;
                        width: 100%;
                        padding-top: ${isReel ? '125%' : '85%'};
                        background-color: #171514;
                        background-size: cover;
                        background-position: center;
                        background-image: url('${thumbUrl}');
                    ">
                        <div style="position: absolute; top: 6px; left: 6px; font-size: 0.65rem; font-weight: 800; color: #FFFFFF; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); padding: 0.2rem 0.5rem; border-radius: 6px; display: flex; align-items: center; gap: 4px;">
                            ${isReel ? '▶ REEL' : '📸 POST'}
                        </div>

                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem 0.5rem 0.4rem 0.5rem; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%); color: #FFF; font-size: 0.68rem; font-weight: 700;">
                            💬 ${comments} comments
                        </div>
                    </div>

                    <div style="padding: 0.65rem 0.75rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 0.8rem; color: var(--text-primary); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${captionCut}
                        </div>
                        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 0.35rem; font-weight: 600;">
                            ${new Date(m.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    </div>

                    ${isSelected ? `
                        <div style="background: var(--accent-primary); color: #FFFFFF; font-size: 0.7rem; font-weight: 800; text-align: center; padding: 4px 8px; letter-spacing: 0.04em;">
                            ✓ SELECTED
                        </div>
                    ` : ''}
                </div>
            `;
        });

        gridHtml += '</div>';

        container.innerHTML = `
            <div style="width: 100%;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.85rem; flex-wrap:wrap; gap:0.65rem;">
                    <div>
                        <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">Step 1: Pick a Target Reel or Post</h2>
                        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.1rem;">Select which specific Instagram content item this comment-to-DM automation rule will monitor, or publish a new one directly.</p>
                    </div>

                    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                        <!-- INSTANT REFRESH BUTTON -->
                        <button type="button" id="btn-refresh-step1-reels" class="btn btn-secondary btn-sm" onclick="window['new-automation'].refreshMedia()" style="font-weight: 700; font-size: 0.78rem; background: #FFFFFF; border: 1px solid var(--border-color); padding: 0.45rem 0.85rem;" title="Fetch newly posted Reels from Instagram immediately">
                            <span>🔄 Refresh Latest Reels</span>
                        </button>

                        <div style="min-width: 180px;">
                            <input type="text" value="${this.searchQuery}" onkeyup="window['new-automation'].filterReels(this.value)" placeholder="Search reels..." style="padding: 0.42rem 0.75rem; font-size: 0.8rem; font-weight: 500; border-radius: 8px; border: 1px solid var(--border-color); background: #FAF8F5; outline: none; width: 100%;">
                        </div>
                    </div>
                </div>

                <!-- SUB TABS FOR STEP 1 -->
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                    <button type="button" onclick="window['new-automation'].openDirectGalleryPicker()" style="padding: 0.38rem 0.95rem; font-size: 0.8rem; font-weight: ${this.step1Filter === 'direct' ? '800' : '700'}; border-radius: 8px; background: ${this.step1Filter === 'direct' ? 'var(--accent-primary)' : '#FFFFFF'}; color: ${this.step1Filter === 'direct' ? '#FFFFFF' : 'var(--accent-primary)'}; border: ${this.step1Filter === 'direct' ? 'none' : '1.5px solid var(--accent-primary)'}; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 4px rgba(217,119,87,0.15);">
                        <span>➕ Publish New Reel / Post</span>
                        <span style="background:${this.step1Filter === 'direct' ? 'rgba(255,255,255,0.25)' : '#FAF0EA'}; color:${this.step1Filter === 'direct' ? '#FFF' : 'var(--accent-primary)'}; font-size:0.65rem; padding: 1px 6px; border-radius: 4px; font-weight: 800;">From Computer</span>
                    </button>
                    <button type="button" onclick="window['new-automation'].setStep1Filter('reels')" style="padding: 0.38rem 0.85rem; font-size: 0.78rem; font-weight: ${this.step1Filter === 'reels' ? '800' : '600'}; border-radius: 8px; background: ${this.step1Filter === 'reels' ? 'var(--accent-primary)' : '#FFFFFF'}; color: ${this.step1Filter === 'reels' ? '#FFFFFF' : 'var(--text-secondary)'}; border: ${this.step1Filter === 'reels' ? 'none' : '1px solid var(--border-color)'}; cursor: pointer;">
                        🎬 Existing Reels (${reelsCount})
                    </button>
                    <button type="button" onclick="window['new-automation'].setStep1Filter('all')" style="padding: 0.38rem 0.85rem; font-size: 0.78rem; font-weight: ${this.step1Filter === 'all' ? '800' : '600'}; border-radius: 8px; background: ${this.step1Filter === 'all' ? 'var(--accent-primary)' : '#FFFFFF'}; color: ${this.step1Filter === 'all' ? '#FFFFFF' : 'var(--text-secondary)'}; border: ${this.step1Filter === 'all' ? 'none' : '1px solid var(--border-color)'}; cursor: pointer;">
                        📁 All Content (${totalCount})
                    </button>
                </div>

                <div style="max-height: 380px; overflow-y: auto; border-radius: 12px; border: 1px solid var(--border-color); padding: 0.85rem; background: #FAF8F5;">
                    ${gridHtml}
                </div>
            </div>
        `;
    },

    renderDirectPublishStudio(container) {
        this.isDirectPublish = true;
        this.selectedMediaId = 'direct_publish';

        const isReel = this.directMediaType === 'REELS';
        const mediaUrl = this.directLocalFileUrl || this.directMediaUrl || '';
        const caption = this.directCaption || '';
        const charCount = caption.length;
        const intel = this.extractCaptionIntelligence(caption);
        this.detectedKeyword = intel.keyword || this.detectedKeyword || 'DRAG';
        this.detectedUrl = intel.url || this.detectedUrl || '';

        const reelsCount = (this.mediaList || []).filter(m => 
            m.media_product_type === 'REELS' || m.media_type === 'REEL' || (m.media_type === 'VIDEO' && m.media_product_type !== 'FEED')
        ).length;
        const totalCount = (this.mediaList || []).length;

        container.innerHTML = `
            <div style="width: 100%;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.85rem; flex-wrap:wrap; gap:0.65rem;">
                    <div>
                        <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">Step 1: Direct Post & Automate Studio</h2>
                        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.1rem;">Upload or specify media, compose caption, and publish directly to Instagram while arming your DM automation.</p>
                    </div>

                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <span style="font-size: 0.78rem; font-weight: 700; color: #15803D; background: #DCFCE7; padding: 4px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
                            ● Connected: @harshparmar007__
                        </span>
                    </div>
                </div>

                <!-- SUB TABS FOR STEP 1 -->
                <div style="display: flex; gap: 0.5rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
                    <button type="button" onclick="window['new-automation'].openDirectGalleryPicker()" style="padding: 0.38rem 0.95rem; font-size: 0.8rem; font-weight: 800; border-radius: 8px; background: var(--accent-primary); color: #FFFFFF; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 4px rgba(217,119,87,0.2);">
                        <span>➕ Publish New Reel / Post</span>
                        <span style="background: rgba(255,255,255,0.25); color: #FFF; font-size:0.65rem; padding: 1px 6px; border-radius: 4px; font-weight: 800;">Active</span>
                    </button>
                    <button type="button" onclick="window['new-automation'].setStep1Filter('reels')" style="padding: 0.38rem 0.85rem; font-size: 0.78rem; font-weight: 600; border-radius: 8px; background: #FFFFFF; color: var(--text-secondary); border: 1px solid var(--border-color); cursor: pointer;">
                        🎬 Existing Reels (${reelsCount})
                    </button>
                    <button type="button" onclick="window['new-automation'].setStep1Filter('all')" style="padding: 0.38rem 0.85rem; font-size: 0.78rem; font-weight: 600; border-radius: 8px; background: #FFFFFF; color: var(--text-secondary); border: 1px solid var(--border-color); cursor: pointer;">
                        📁 All Content (${totalCount})
                    </button>
                </div>

                <!-- STUDIO WORKSPACE: 2-COLUMNS -->
                <div style="display: grid; grid-template-columns: minmax(320px, 1.25fr) minmax(280px, 0.75fr); gap: 1.25rem; align-items: start; background: #FAF8F5; border: 1.5px solid var(--border-color); border-radius: 14px; padding: 1.15rem;">
                    
                    <!-- LEFT COLUMN: CONTROLS & CAPTION -->
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        
                        <!-- 1. FORMAT SELECTOR -->
                        <div>
                            <label style="font-size: 0.78rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.4rem; display: block;">
                                1. Select Media Format:
                            </label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
                                <div onclick="window['new-automation'].setDirectMediaType('REELS')" style="
                                    padding: 0.75rem 0.9rem;
                                    border-radius: 10px;
                                    border: ${isReel ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'};
                                    background: ${isReel ? '#FFFFFF' : '#FAF8F5'};
                                    box-shadow: ${isReel ? '0 2px 8px rgba(217,119,87,0.15)' : 'none'};
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    gap: 0.6rem;
                                ">
                                    <input type="radio" name="direct_fmt" ${isReel ? 'checked' : ''} style="accent-color: var(--accent-primary);">
                                    <div>
                                        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.85rem; color: var(--text-primary);">🎬 Instagram Reel</div>
                                        <div style="font-size: 0.72rem; color: var(--text-secondary);">9:16 Vertical Video (MP4 / MOV)</div>
                                    </div>
                                </div>

                                <div onclick="window['new-automation'].setDirectMediaType('IMAGE')" style="
                                    padding: 0.75rem 0.9rem;
                                    border-radius: 10px;
                                    border: ${!isReel ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'};
                                    background: ${!isReel ? '#FFFFFF' : '#FAF8F5'};
                                    box-shadow: ${!isReel ? '0 2px 8px rgba(217,119,87,0.15)' : 'none'};
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    gap: 0.6rem;
                                ">
                                    <input type="radio" name="direct_fmt" ${!isReel ? 'checked' : ''} style="accent-color: var(--accent-primary);">
                                    <div>
                                        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.85rem; color: var(--text-primary);">📸 Feed Post</div>
                                        <div style="font-size: 0.72rem; color: var(--text-secondary);">Single Photo / Graphic (JPG / PNG)</div>
                                    </div>
                                </div>
                            </div>

                            <!-- ASPECT RATIO PILLS FOR FEED POST -->
                            <div style="margin-top: 0.65rem; padding: 0.65rem 0.85rem; background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 10px; display: ${!isReel ? 'block' : 'none'};">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
                                    <span style="font-size: 0.76rem; font-weight: 800; color: var(--text-primary);">
                                        📐 Feed Aspect Ratio / Frame:
                                    </span>
                                    <span style="font-size: 0.68rem; font-weight: 700; color: var(--accent-primary); background: #FAF0EA; padding: 1px 7px; border-radius: 4px;">
                                        ${this.feedAspectRatio === 'auto' ? 'Auto-Fit (Full Image)' : this.feedAspectRatio}
                                    </span>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem;">
                                    <button type="button" onclick="window['new-automation'].setFeedAspectRatio('auto')" style="padding: 6px 4px; font-size: 0.72rem; font-weight: ${this.feedAspectRatio === 'auto' ? '800' : '600'}; border-radius: 6px; border: ${this.feedAspectRatio === 'auto' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'}; background: ${this.feedAspectRatio === 'auto' ? '#FDF8F6' : '#FFFFFF'}; color: ${this.feedAspectRatio === 'auto' ? 'var(--accent-primary)' : 'var(--text-primary)'}; cursor: pointer; text-align: center;" title="Keeps full image visible without cutting edges">
                                        🔄 Auto Fit
                                    </button>
                                    <button type="button" onclick="window['new-automation'].setFeedAspectRatio('1:1')" style="padding: 6px 4px; font-size: 0.72rem; font-weight: ${this.feedAspectRatio === '1:1' ? '800' : '600'}; border-radius: 6px; border: ${this.feedAspectRatio === '1:1' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'}; background: ${this.feedAspectRatio === '1:1' ? '#FDF8F6' : '#FFFFFF'}; color: ${this.feedAspectRatio === '1:1' ? 'var(--accent-primary)' : 'var(--text-primary)'}; cursor: pointer; text-align: center;" title="Square feed post (1:1)">
                                        ⏹️ 1:1 Square
                                    </button>
                                    <button type="button" onclick="window['new-automation'].setFeedAspectRatio('4:5')" style="padding: 6px 4px; font-size: 0.72rem; font-weight: ${this.feedAspectRatio === '4:5' ? '800' : '600'}; border-radius: 6px; border: ${this.feedAspectRatio === '4:5' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'}; background: ${this.feedAspectRatio === '4:5' ? '#FDF8F6' : '#FFFFFF'}; color: ${this.feedAspectRatio === '4:5' ? 'var(--accent-primary)' : 'var(--text-primary)'}; cursor: pointer; text-align: center;" title="Vertical portrait post (4:5)">
                                        📱 4:5 Portrait
                                    </button>
                                    <button type="button" onclick="window['new-automation'].setFeedAspectRatio('16:9')" style="padding: 6px 4px; font-size: 0.72rem; font-weight: ${this.feedAspectRatio === '16:9' ? '800' : '600'}; border-radius: 6px; border: ${this.feedAspectRatio === '16:9' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'}; background: ${this.feedAspectRatio === '16:9' ? '#FDF8F6' : '#FFFFFF'}; color: ${this.feedAspectRatio === '16:9' ? 'var(--accent-primary)' : 'var(--text-primary)'}; cursor: pointer; text-align: center;" title="Wide landscape post (16:9)">
                                        🖥️ 16:9 Wide
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 2. CHOOSE FROM COMPUTER GALLERY (ONLY OPTION) -->
                        <div>
                            <label style="font-size: 0.78rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.4rem; display: block;">
                                2. Choose from Computer Gallery:
                            </label>

                            <input type="file" id="direct-media-file-input" accept="video/mp4,video/quicktime,video/webm,image/*" onchange="window['new-automation'].onDirectLocalFileSelected(this)" style="display: none;">

                            <div onclick="document.getElementById('direct-media-file-input').click()" style="
                                border: 2px dashed ${this.directFileName ? '#15803D' : 'var(--accent-primary)'};
                                background: ${this.directFileName ? '#F0FDF4' : '#FFFFFF'};
                                border-radius: 12px;
                                padding: 1.25rem 1rem;
                                cursor: pointer;
                                text-align: center;
                                transition: all 0.2s ease;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                gap: 0.45rem;
                            ">
                                ${this.directFileName ? `
                                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #DCFCE7; color: #15803D; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 800; box-shadow: 0 2px 6px rgba(21,128,61,0.2);">
                                        ✓
                                    </div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.92rem; color: #15803D;">
                                        File Selected from Computer Gallery
                                    </div>
                                    <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); word-break: break-all;">
                                        📁 ${this.directFileName} ${this.directFileSize ? `(${this.directFileSize})` : ''}
                                    </div>
                                    <div style="font-size: 0.72rem; color: var(--text-secondary);">
                                        Format: <strong>${this.directMediaType === 'REELS' ? '🎬 Instagram Reel (Video)' : '📸 Feed Post (Photo)'}</strong> &bull; Click anywhere to choose a different file
                                    </div>
                                    <div style="margin-top: 0.25rem; background: #FFFFFF; border: 1.5px solid #86EFAC; color: #15803D; font-size: 0.75rem; font-weight: 700; padding: 4px 14px; border-radius: 6px;">
                                        🔄 Change File
                                    </div>
                                ` : `
                                    <div style="width: 48px; height: 48px; border-radius: 50%; background: #FAF0EA; color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 900; box-shadow: 0 2px 8px rgba(217,119,87,0.15);">
                                        +
                                    </div>
                                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.92rem; color: var(--accent-primary);">
                                        Click to Choose from Computer Gallery
                                    </div>
                                    <div style="font-size: 0.76rem; color: var(--text-secondary);">
                                        Select Reel (video: .mp4, .mov) or Post (photo: .jpg, .png)
                                    </div>
                                    <div style="margin-top: 0.25rem; background: var(--accent-primary); color: #FFF; font-size: 0.76rem; font-weight: 800; padding: 5px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
                                        📁 Browse Computer Gallery
                                    </div>
                                `}
                            </div>
                        </div>

                        <!-- 3. INSTAGRAM CAPTION & AGENTIC KEYWORD PARSER -->
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.35rem;">
                                <label style="font-size: 0.78rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.04em;">
                                    3. Instagram Caption & Call to Action:
                                </label>
                                <span id="direct-caption-counter" style="font-size: 0.74rem; font-weight: 600; color: var(--text-secondary);">
                                    ${charCount} / 2,200 chars
                                </span>
                            </div>

                            <textarea id="direct-caption-input" rows="4" oninput="window['new-automation'].onDirectCaptionChange(this.value)" placeholder="Write or copy your Instagram caption here... e.g. Want our 2026 AI Agent blueprint? Comment &quot;DRAG&quot; below and I'll send it directly to your DMs! 🚀" style="width: 100%; padding: 0.65rem 0.9rem; font-size: 0.88rem; font-family: inherit; font-weight: 500; border-radius: 8px; border: 1.5px solid #D1C9BE; background: #FFFFFF; outline: none; line-height: 1.45;">${caption}</textarea>

                            <!-- LIVE NLP DETECTION BADGE -->
                            <div id="direct-nlp-info" style="margin-top: 0.45rem; padding: 0.65rem 0.85rem; background: #FFFFFF; border: 1.5px solid #E5E0D8; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 1.1rem;">🤖</span>
                                    <div>
                                        <div style="font-size: 0.76rem; font-weight: 800; color: var(--text-primary);">
                                             Autonomous Keyword Intelligence:
                                        </div>
                                        <div style="font-size: 0.74rem; color: var(--text-secondary);">
                                            ${this.detectedKeyword 
                                                ? `<span style="color: #15803D; font-weight: 800;">Target Keyword Detected: "${this.detectedKeyword}"</span>` 
                                                : '<span style="color: #736E68;">Type "Comment [KEYWORD] below" in caption to auto-detect</span>'}
                                            ${this.detectedUrl ? ` &bull; <span style="color: var(--accent-primary); font-weight: 700;">Link: ${this.detectedUrl}</span>` : ''}
                                        </div>
                                    </div>
                                </div>

                                ${this.detectedKeyword ? `
                                    <button type="button" class="btn btn-sm btn-primary" onclick="window['new-automation'].applyDetectedKeyword()" style="font-size: 0.72rem; padding: 3px 9px; font-weight: 800;">
                                        ✓ Auto-Apply "${this.detectedKeyword}"
                                    </button>
                                ` : ''}
                            </div>

                            <!-- QUICK SNIPPET BUTTONS -->
                            <div style="margin-top: 0.45rem; display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
                                <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-secondary);">Add CTA:</span>
                                <button type="button" onclick="window['new-automation'].appendCaptionCta('DRAG')" style="padding: 2px 7px; font-size: 0.72rem; font-weight: 700; background: #FFF; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">+ "Comment DRAG below"</button>
                                <button type="button" onclick="window['new-automation'].appendCaptionCta('PLAYBOOK')" style="padding: 2px 7px; font-size: 0.72rem; font-weight: 700; background: #FFF; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">+ "Comment PLAYBOOK"</button>
                                <button type="button" onclick="window['new-automation'].appendCaptionCta('PDF')" style="padding: 2px 7px; font-size: 0.72rem; font-weight: 700; background: #FFF; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">+ "Comment PDF"</button>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: SMARTPHONE MOCKUP -->
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="font-size: 0.74rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.45rem;">
                            📱 Live Instagram Preview (${isReel ? '9:16 Reel' : 'Feed Post'})
                        </div>

                        ${this.renderSmartphonePreview(isReel, mediaUrl, caption)}
                    </div>

                </div>
            </div>
        `;
    },

    selectReel(id, el) {
        this.isDirectPublish = false;
        this.selectedMediaId = String(id);
        this.renderStep1(document.getElementById('new-automation-content'));
    },

    renderStep2(container) {
        const isAny = this.keywordMode === 'any';

        let chipsHtml = '';
        if (this.keywordList && this.keywordList.length > 0) {
            chipsHtml = this.keywordList.map((kw, idx) => `
                <div style="display: inline-flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1.5px solid var(--accent-primary); border-radius: 8px; padding: 6px 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
                    <span style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.85rem; color: var(--accent-primary);">${kw}</span>
                    <button type="button" onclick="window['new-automation'].removeKeyword(${idx})" style="background: none; border: none; cursor: pointer; color: #736E68; font-weight: 800; font-size: 1.05rem; line-height: 1; padding: 0 2px;" title="Remove keyword">×</button>
                </div>
            `).join('');
        } else {
            chipsHtml = `<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">No keywords added yet. Type below and click "+ Add Keyword" (or select "Any Comment" mode).</div>`;
        }

        container.innerHTML = `
            <div style="width: 100%;">
                <div style="margin-bottom: 1.15rem;">
                    <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">Step 2: Trigger Keyword Configuration</h2>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.15rem;">Choose whether to trigger on specific keywords or on every single comment on this Reel.</p>
                </div>

                <!-- 1. TRIGGER MODE SELECTION (SPECIFIC KEYWORDS vs ANY COMMENT) -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem;">
                    <div onclick="window['new-automation'].setKeywordMode('specific')" style="
                        padding: 1rem 1.25rem;
                        border-radius: 12px;
                        border: ${!isAny ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'};
                        background: ${!isAny ? '#FDF8F6' : '#FFFFFF'};
                        box-shadow: ${!isAny ? '0 2px 10px rgba(217, 119, 87, 0.12)' : 'none'};
                        cursor: pointer;
                        display: flex;
                        align-items: flex-start;
                        gap: 0.85rem;
                        transition: all 0.15s ease;
                    ">
                        <input type="radio" name="trigger_mode" ${!isAny ? 'checked' : ''} style="accent-color: var(--accent-primary); margin-top: 3px; cursor: pointer;">
                        <div>
                            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.92rem; color: var(--text-primary);">🎯 Specific Keyword(s) Only</div>
                            <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.2rem; line-height: 1.4;">Only followers who comment your chosen keywords (e.g. PLAYBOOK, PDF) receive the automated DM.</div>
                        </div>
                    </div>

                    <div onclick="window['new-automation'].setKeywordMode('any')" style="
                        padding: 1rem 1.25rem;
                        border-radius: 12px;
                        border: ${isAny ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'};
                        background: ${isAny ? '#FDF8F6' : '#FFFFFF'};
                        box-shadow: ${isAny ? '0 2px 10px rgba(217, 119, 87, 0.12)' : 'none'};
                        cursor: pointer;
                        display: flex;
                        align-items: flex-start;
                        gap: 0.85rem;
                        transition: all 0.15s ease;
                    ">
                        <input type="radio" name="trigger_mode" ${isAny ? 'checked' : ''} style="accent-color: var(--accent-primary); margin-top: 3px; cursor: pointer;">
                        <div>
                            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.92rem; color: var(--text-primary);">⚡ Any Comment (Every Comment)</div>
                            <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.2rem; line-height: 1.4;">Triggers the automated DM for EVERY comment posted on this Reel, no matter what they write!</div>
                        </div>
                    </div>
                </div>

                ${!isAny ? `
                    <!-- 2. INTERACTIVE KEYWORD INPUT & CHIPS -->
                    <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
                        
                        <!-- ADD KEYWORD BAR WITH CLEAR LABEL -->
                        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                            <label for="input-new-keyword" style="font-size: 0.85rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 0.4rem;">
                                <span>Type Keyword Here:</span>
                                <span style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary);">(Type word and press Enter or click + Add Keyword)</span>
                            </label>
                            <div style="display: flex; gap: 0.65rem; align-items: center;">
                                <input type="text" id="input-new-keyword" placeholder="e.g. PLAYBOOK, GUIDE, LINK, PDF..." onkeydown="if(event.key==='Enter'){event.preventDefault(); window['new-automation'].addKeyword();}" style="flex: 1; padding: 0.75rem 1.1rem; font-size: 0.92rem; font-weight: 600; border-radius: 10px; border: 1.5px solid #D1C9BE; background: #FAF8F5; outline: none;">
                                <button type="button" class="btn btn-primary" onclick="window['new-automation'].addKeyword()" style="padding: 0.75rem 1.4rem; font-size: 0.88rem; font-weight: 800; border-radius: 10px; white-space: nowrap;">
                                    + Add Keyword
                                </button>
                            </div>
                        </div>

                        <!-- KEYWORD CHIPS CONTAINER BOX -->
                        <div>
                            <label style="font-size: 0.8rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.4rem; display: block;">
                                Active Trigger Keywords (${this.keywordList.length})
                            </label>
                            <div style="min-height: 62px; padding: 0.85rem; background: #FAF8F5; border: 1.5px solid #E6E1D8; border-radius: 12px; display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center;">
                                ${chipsHtml}
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.35rem;">Each box above is an individual active trigger keyword. Matching is case-insensitive.</div>
                        </div>

                        <!-- ONE-CLICK PRESET SUGGESTIONS -->
                        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                            <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-secondary);">Popular Presets:</span>
                            <button type="button" onclick="window['new-automation'].addKeyword('PLAYBOOK')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FFFFFF; border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;">+ PLAYBOOK</button>
                            <button type="button" onclick="window['new-automation'].addKeyword('PDF')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FFFFFF; border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;">+ PDF</button>
                            <button type="button" onclick="window['new-automation'].addKeyword('LINK')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FFFFFF; border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;">+ LINK</button>
                            <button type="button" onclick="window['new-automation'].addKeyword('GUIDE')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FFFFFF; border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;">+ GUIDE</button>
                            <button type="button" onclick="window['new-automation'].addKeyword('COURSE')" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; background: #FFFFFF; border: 1px solid var(--border-color); color: var(--text-primary); cursor: pointer;">+ COURSE</button>
                        </div>

                    </div>
                ` : `
                    <!-- ANY COMMENT MODE ACTIVE ALERT BANNER -->
                    <div style="padding: 1.25rem; background: #FDF8F6; border: 1.5px solid var(--accent-primary); border-radius: 12px; display: flex; gap: 0.85rem; align-items: center;">
                        <div style="font-size: 1.8rem;">⚡</div>
                        <div>
                            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.95rem; color: var(--accent-primary);">Universal Comment Trigger Enabled</div>
                            <div style="font-size: 0.84rem; color: var(--text-primary); margin-top: 0.2rem; line-height: 1.45;">
                                InstaAuto will dispatch your automated DM for <strong>ANY comment</strong> left on this Reel. No keyword typing required by your followers!
                            </div>
                        </div>
                    </div>
                `}
            </div>
        `;
    },

    // STEP 3: DM & RESOURCE DISPATCH WITH FOLLOW-FIRST GATE WORKFLOW PREVIEW
    renderStep3(container) {
        const actionVal = this.savedActionType || 'link_dm';
        const responseVal = this.savedResponseText || 'Hey! Thanks for commenting. Here is your requested resource link 🚀';
        const linkVal = this.savedLinkUrl || 'https://example.com/guide.pdf';
        const promptVal = this.savedFollowPrompt || 'Thanks for commenting! Please follow @creator.studio first, then reply "I FOLLOWED" in this DM to unlock your link!';

        if (!this.savedButtonsConfig) {
            this.savedButtonsConfig = {
                gate_type: 'buttons',
                step1_text: "Hey there! Glad you're here ☺️\n\nTap below and I'll send you the access in just a moment ✨",
                step1_button: "Send me the access",
                step2_text: "Almost there !\nPlease visit my profile and tap follow to continue 😄",
                step2_profile_button: "Visit Profile",
                step2_confirm_button: "I'm following ✅",
                not_following_text: "Wait! It looks like you're not following us yet! 👀\n\nPlease visit our profile, tap Follow, and then click \"I'm following ✅\" below to unlock your link!",
                step3_text: "Dost appko document bejhdiya hai bahut mehnat sa bnaya hai please follow",
                step3_button: "Click me"
            };
        }
        const btnCfg = this.savedButtonsConfig;

        container.innerHTML = `
            <div style="width: 100%;">
                <div style="margin-bottom: 1rem;">
                    <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">Step 3: Direct Message Dispatch & Resource</h2>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.15rem;">Configure the automated response message body and deliverable URL sent to followers.</p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 1.1rem; width: 100%;">
                    
                    <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                        <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Automation Action Type</label>
                        <select id="auto_action_type" onchange="window['new-automation'].savedActionType=this.value; window['new-automation'].renderStep3(document.getElementById('new-automation-content'))" style="width: 100%; padding: 0.7rem 1rem; font-size: 0.9rem; font-weight: 600; border-radius: 10px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none;">
                            <option value="link_dm" ${actionVal==='link_dm'?'selected':''}>Send DM with Clickable Deliverable Link</option>
                            <option value="follow_first" ${actionVal==='follow_first'?'selected':''}>Ask to Follow First Gate (Follow Verification)</option>
                            <option value="direct_dm" ${actionVal==='direct_dm'?'selected':''}>Send Direct Text Message (No Link)</option>
                        </select>
                    </div>

                    ${actionVal === 'follow_first' ? `
                        <!-- FOLLOW-FIRST GATE WORKFLOW & 3-STEP BUTTON FUNNEL BUILDER -->
                        <div style="padding: 1.15rem; background: #FAF8F5; border: 2px solid var(--accent-primary); border-radius: 14px; box-shadow: 0 4px 14px rgba(217,119,87,0.08);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 1.25rem;">🔐</span>
                                    <div>
                                        <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem; font-weight: 800; color: var(--accent-primary); margin: 0;">
                                            Follow-First Gate System Active
                                        </h3>
                                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0.1rem 0 0 0;">
                                            Followers must follow your account to unlock your resource.
                                        </p>
                                    </div>
                                </div>
                                <select id="wizard_gate_type_select" onchange="window['new-automation'].savedButtonsConfig.gate_type=this.value; window['new-automation'].renderStep3(document.getElementById('new-automation-content'))" style="padding: 0.4rem 0.8rem; font-size: 0.82rem; font-weight: 700; border-radius: 8px; border: 1px solid #D1C9BE; background: #FFF; outline: none;">
                                    <option value="buttons" ${btnCfg.gate_type !== 'text' ? 'selected' : ''}>🌟 3-Step Interactive Button Funnel (Top Creator Setup)</option>
                                    <option value="text" ${btnCfg.gate_type === 'text' ? 'selected' : ''}>💬 Simple Text Prompt ("DONE")</option>
                                </select>
                            </div>

                            ${btnCfg.gate_type !== 'text' ? `
                            <!-- 3-STEP VISUAL BUTTON FUNNEL PIPELINE -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.65rem; background: #FFFFFF; padding: 0.85rem; border-radius: 10px; border: 1px solid #F2E3D5; margin-bottom: 1rem;">
                                <div style="font-size: 0.78rem;">
                                    <strong style="color: var(--accent-primary);">1. Comment:</strong> Follower comments trigger keyword on your Reel.
                                </div>
                                <div style="font-size: 0.78rem;">
                                    <strong style="color: var(--accent-primary);">2. Hook DM:</strong> Quick Reply button <em>"Send me the access"</em>.
                                </div>
                                <div style="font-size: 0.78rem;">
                                    <strong style="color: var(--accent-primary);">3. Follow Gate:</strong> <em>"Visit Profile"</em> + <em>"I'm following ✅"</em> buttons.
                                </div>
                                <div style="font-size: 0.78rem;">
                                    <strong style="color: #2E7D32;">4. Unlocked:</strong> Deliverable message with <em>"Click me"</em> link button!
                                </div>
                            </div>

                            <!-- STEP 1 CARD -->
                            <div style="background: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 10px; padding: 0.9rem 1.1rem; margin-bottom: 0.85rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                                    <span style="background: var(--accent-primary); color: #FFF; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">STEP 1</span>
                                    <span style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary);">First DM Sent to Follower (Unlocks 24-hr messaging window)</span>
                                </div>
                                <textarea id="wizard_btn_step1_text" rows="2" onchange="window['new-automation'].savedButtonsConfig.step1_text=this.value" style="width: 100%; padding: 0.65rem 0.9rem; font-size: 0.88rem; font-family: inherit; font-weight: 500; border-radius: 8px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none; margin-bottom: 0.5rem;">${btnCfg.step1_text}</textarea>
                                <div style="display: flex; align-items: center; gap: 0.6rem;">
                                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">Tappable Button Title:</span>
                                    <input type="text" id="wizard_btn_step1_button" value="${btnCfg.step1_button}" onchange="window['new-automation'].savedButtonsConfig.step1_button=this.value" placeholder="Send me the access" maxlength="20" style="flex: 1; max-width: 250px; padding: 0.4rem 0.75rem; font-size: 0.85rem; font-weight: 700; border-radius: 8px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none;">
                                </div>
                            </div>

                            <!-- STEP 2 CARD -->
                            <div style="background: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 10px; padding: 0.9rem 1.1rem; margin-bottom: 0.85rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                                    <span style="background: #B45309; color: #FFF; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">STEP 2</span>
                                    <span style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary);">Follow Gate DM (Sent when follower taps "Send me the access")</span>
                                </div>
                                <textarea id="wizard_btn_step2_text" rows="2" onchange="window['new-automation'].savedButtonsConfig.step2_text=this.value" style="width: 100%; padding: 0.65rem 0.9rem; font-size: 0.88rem; font-family: inherit; font-weight: 500; border-radius: 8px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none; margin-bottom: 0.5rem;">${btnCfg.step2_text}</textarea>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem;">
                                    <div>
                                        <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Button 1 (Opens Profile URL):</label>
                                        <input type="text" id="wizard_btn_step2_profile_button" value="${btnCfg.step2_profile_button}" onchange="window['new-automation'].savedButtonsConfig.step2_profile_button=this.value" placeholder="Visit Profile" maxlength="20" style="width: 100%; padding: 0.4rem 0.75rem; font-size: 0.85rem; font-weight: 700; border-radius: 8px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none;">
                                    </div>
                                    <div>
                                        <label style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Button 2 (Follow Confirmation):</label>
                                        <input type="text" id="wizard_btn_step2_confirm_button" value="${btnCfg.step2_confirm_button}" onchange="window['new-automation'].savedButtonsConfig.step2_confirm_button=this.value" placeholder="I'm following ✅" maxlength="20" style="width: 100%; padding: 0.4rem 0.75rem; font-size: 0.85rem; font-weight: 700; border-radius: 8px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none;">
                                    </div>
                                </div>
                                <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed #E5E0D8;">
                                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                                        <label style="font-size: 0.74rem; font-weight: 800; color: #B45309; text-transform: uppercase; display: flex; align-items: center; gap: 0.35rem;">
                                            🛡️ Meta Live Verification Warning:
                                        </label>
                                        <span style="font-size: 0.68rem; font-weight: 700; color: #15803D; background: #DCFCE7; padding: 2px 7px; border-radius: 4px;">Enforced via Meta Graph API</span>
                                    </div>
                                    <p style="font-size: 0.74rem; color: var(--text-secondary); margin: 0 0 0.4rem 0;">Sent back into DM if follower clicks "I'm following ✅" without actually following.</p>
                                    <textarea id="wizard_btn_not_following_text" rows="2" onchange="window['new-automation'].savedButtonsConfig.not_following_text=this.value" style="width: 100%; padding: 0.55rem 0.8rem; font-size: 0.84rem; font-family: inherit; font-weight: 500; border-radius: 8px; border: 1.5px solid #FCD34D; background: #FFFBEB; outline: none;">${btnCfg.not_following_text || "Wait! It looks like you're not following us yet! 👀\n\nPlease visit our profile, tap Follow, and then click \"I'm following ✅\" below to unlock your link!"}</textarea>
                                </div>
                            </div>

                            <!-- STEP 3 CARD -->
                            <div style="background: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 10px; padding: 0.9rem 1.1rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                                    <span style="background: #15803D; color: #FFF; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">STEP 3</span>
                                    <span style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary);">Deliverable DM (Sent when follower taps "I'm following ✅")</span>
                                </div>
                                <textarea id="wizard_btn_step3_text" rows="2" onchange="window['new-automation'].savedButtonsConfig.step3_text=this.value" style="width: 100%; padding: 0.65rem 0.9rem; font-size: 0.88rem; font-family: inherit; font-weight: 500; border-radius: 8px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none; margin-bottom: 0.5rem;">${btnCfg.step3_text}</textarea>
                                <div style="display: flex; align-items: center; gap: 0.6rem;">
                                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">Resource Button Title:</span>
                                    <input type="text" id="wizard_btn_step3_button" value="${btnCfg.step3_button}" onchange="window['new-automation'].savedButtonsConfig.step3_button=this.value" placeholder="Click me" maxlength="20" style="flex: 1; max-width: 250px; padding: 0.4rem 0.75rem; font-size: 0.85rem; font-weight: 700; border-radius: 8px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none;">
                                </div>
                            </div>
                            ` : `
                            <!-- SIMPLE TEXT PROMPT -->
                            <div style="margin-top: 0.75rem;">
                                <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem; display: block;">Follow Gate Prompt DM Message</label>
                                <textarea id="auto_follow_prompt" rows="2" onchange="window['new-automation'].savedFollowPrompt=this.value" placeholder="e.g. Thanks for commenting! Please follow @creator.studio first, then reply 'I FOLLOWED' in this DM to unlock your link!" style="width: 100%; padding: 0.75rem 1.1rem; font-size: 0.9rem; font-family: inherit; font-weight: 500; border-radius: 10px; border: 1px solid #D1C9BE; background: #FAF8F5; outline: none; line-height: 1.4;">${promptVal}</textarea>
                            </div>
                            `}
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">DM Message Body</label>
                            <textarea id="auto_response_text" rows="3" onchange="window['new-automation'].savedResponseText=this.value" placeholder="e.g. Thanks for commenting! Here is your requested resource link..." style="width: 100%; padding: 0.75rem 1.1rem; font-size: 0.9rem; font-family: inherit; font-weight: 500; border-radius: 10px; border: 1px solid #D1C9BE; background: #FAF8F5; box-shadow: inset 0 2px 4px rgba(0,0,0,0.03); outline: none; line-height: 1.45;">${responseVal}</textarea>
                        </div>
                    `}

                    ${(actionVal === 'link_dm' || actionVal === 'follow_first') ? `
                        <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">Deliverable Resource URL (PDF / Guide / Website)</label>
                            <input type="url" id="auto_link_url" value="${linkVal}" onchange="window['new-automation'].savedLinkUrl=this.value" placeholder="https://example.com/guide.pdf" style="width: 100%; padding: 0.75rem 1.1rem; font-size: 0.9rem; font-weight: 500; border-radius: 10px; border: 1px solid #D1C9BE; background: #FAF8F5; box-shadow: inset 0 2px 4px rgba(0,0,0,0.03); outline: none;">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    renderStep4(container) {
        const delayVal = this.savedDelay || 5;
        const replyVal = this.savedPublicReply || 'Sent! Check your DMs 📩';

        container.innerHTML = `
            <div style="width: 100%;">
                <div style="margin-bottom: 1rem;">
                    <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0;">Step 4: Anti-Spam Pacing & Public Comment Reply</h2>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.15rem;">Protect account health with delay pacing and boost post engagement with public comment replies.</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; width: 100%;">
                    <div style="padding: 1.15rem; background: #FAF8F5; border: 1px solid var(--border-color); border-radius: 12px;">
                        <label style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">Anti-Spam Delay Pacing</label>
                        <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.1rem;">Natural delay before sending DM</div>
                        <select id="auto_delay_seconds" onchange="window['new-automation'].savedDelay=parseInt(this.value)" style="width: 100%; padding: 0.65rem 0.95rem; font-size: 0.88rem; font-weight: 600; border-radius: 8px; border: 1px solid #D1C9BE; background: #FFF; marginTop: 0.5rem; outline: none;">
                            <option value="0" ${delayVal===0?'selected':''}>Instant Dispatch (0 seconds)</option>
                            <option value="5" ${delayVal===5?'selected':''}>5 Seconds Delay (Recommended)</option>
                            <option value="15" ${delayVal===15?'selected':''}>15 Seconds Delay</option>
                        </select>
                    </div>

                    <div style="padding: 1.15rem; background: #FAF8F5; border: 1px solid var(--border-color); border-radius: 12px;">
                        <label style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">Public Comment Reply (Optional)</label>
                        <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.1rem;">Posts public comment reply under post</div>
                        <input type="text" id="auto_public_reply" value="${replyVal}" onchange="window['new-automation'].savedPublicReply=this.value" placeholder="e.g. Sent! Check your DMs 📩" style="width: 100%; padding: 0.65rem 0.95rem; font-size: 0.88rem; font-weight: 500; border-radius: 8px; border: 1px solid #D1C9BE; background: #FFF; marginTop: 0.5rem; outline: none;">
                    </div>
                </div>
            </div>
        `;
    },

    applyTemplate(type) {
        this.keywordMode = 'specific';
        if (type === 'pdf') {
            this.savedKeywords = 'PDF, GUIDE, EBOOK';
            this.keywordList = ['PDF', 'GUIDE', 'EBOOK'];
            this.savedActionType = 'link_dm';
            this.savedResponseText = 'Thanks for commenting! Here is your requested PDF resource link:';
            this.savedLinkUrl = 'https://example.com/free-guide.pdf';
            this.savedPublicReply = 'Sent to your DMs! Check your inbox 📩';
            App.showToast('Applied "Lead E-Book" preset', 'success');
        } else if (type === 'follow') {
            this.savedKeywords = 'SECRET, LINK, UNLOCK';
            this.keywordList = ['SECRET', 'LINK', 'UNLOCK'];
            this.savedActionType = 'follow_first';
            this.savedFollowPrompt = 'Thanks for commenting! Please follow @creator.studio first, then reply "I FOLLOWED" in this DM to unlock your link!';
            this.savedResponseText = '🎉 Thank you for following @creator.studio! Here is your requested resource link:';
            this.savedLinkUrl = 'https://example.com/secret-guide.pdf';
            this.savedPublicReply = 'Check your DMs for access instructions!';
            App.showToast('Applied "Follow First Gate" preset 🔐', 'success');
        } else if (type === 'course') {
            this.savedKeywords = 'COURSE, MASTERCLASS';
            this.keywordList = ['COURSE', 'MASTERCLASS'];
            this.savedActionType = 'link_dm';
            this.savedResponseText = 'Here is your private access link to register for the Masterclass:';
            this.savedLinkUrl = 'https://example.com/masterclass';
            this.savedPublicReply = 'Check your DMs!';
            App.showToast('Applied "Course Signup" preset', 'success');
        }
        this.renderStepContent();
    },

    async saveAutomation() {
        // Automatically capture any pending text in the keyword input
        const pendingInput = document.getElementById('input-new-keyword');
        if (pendingInput && pendingInput.value.trim()) {
            const parts = pendingInput.value.trim().split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
            parts.forEach(p => {
                if (!this.keywordList.includes(p)) this.keywordList.push(p);
            });
            this.savedKeywords = this.keywordList.join(', ');
        }

        let triggerWord = '';
        if (this.keywordMode === 'any') {
            triggerWord = '*'; // Universal trigger for ANY comment
        } else {
            triggerWord = (this.keywordList && this.keywordList.length > 0)
                ? this.keywordList.join(', ')
                : (this.savedKeywords || 'PLAYBOOK');
        }

        const actionType = this.savedActionType || document.getElementById('auto_action_type')?.value || 'link_dm';

        const gateType = document.getElementById('wizard_gate_type_select')?.value || this.savedButtonsConfig?.gate_type || 'buttons';
        const buttonsConfig = {
            gate_type: gateType,
            step1_text: document.getElementById('wizard_btn_step1_text')?.value || this.savedButtonsConfig?.step1_text || "Hey there! Glad you're here ☺️\n\nTap below and I'll send you the access in just a moment ✨",
            step1_button: (document.getElementById('wizard_btn_step1_button')?.value || this.savedButtonsConfig?.step1_button || "Send me the access").trim(),
            step2_text: document.getElementById('wizard_btn_step2_text')?.value || this.savedButtonsConfig?.step2_text || "Almost there !\nPlease visit my profile and tap follow to continue 😄",
            step2_profile_button: (document.getElementById('wizard_btn_step2_profile_button')?.value || this.savedButtonsConfig?.step2_profile_button || "Visit Profile").trim(),
            step2_confirm_button: (document.getElementById('wizard_btn_step2_confirm_button')?.value || this.savedButtonsConfig?.step2_confirm_button || "I'm following ✅").trim(),
            step3_text: document.getElementById('wizard_btn_step3_text')?.value || this.savedButtonsConfig?.step3_text || "Dost appko document bejhdiya hai bahut mehnat sa bnaya hai please follow",
            step3_button: (document.getElementById('wizard_btn_step3_button')?.value || this.savedButtonsConfig?.step3_button || "Click me").trim()
        };
        this.savedButtonsConfig = buttonsConfig;

        const responseText = actionType === 'follow_first'
            ? (buttonsConfig.step3_text || this.savedResponseText || 'Dost appko document bejhdiya hai bahut mehnat sa bnaya hai please follow')
            : (this.savedResponseText || document.getElementById('auto_response_text')?.value || 'Here is your resource link!');

        if (this.isDirectPublish || this.selectedMediaId === 'direct_publish') {
            const btnDeploy = document.getElementById('btn-flow-deploy');
            if (btnDeploy) {
                btnDeploy.disabled = true;
                btnDeploy.innerHTML = '<span class="spinner"></span> 🚀 Step 1/2: Publishing to Instagram...';
            }

            const publishPayload = {
                media_type: this.directMediaType || 'REELS',
                media_url: this.directLocalFileUrl || this.directMediaUrl || 'local_file_upload.mp4',
                caption: this.directCaption || `Check this out! Comment ${triggerWord} below 👇`,
                trigger_keyword: triggerWord,
                action_type: actionType,
                response_text: responseText,
                link_url: this.savedLinkUrl || document.getElementById('auto_link_url')?.value || 'https://example.com/guide.pdf',
                follow_prompt: this.savedFollowPrompt || document.getElementById('auto_follow_prompt')?.value || 'Please follow us first!',
                public_reply: this.savedPublicReply || document.getElementById('auto_public_reply')?.value || 'Sent! Check your DMs 📩',
                delay_seconds: this.savedDelay !== undefined ? this.savedDelay : 5,
                buttons_config_json: JSON.stringify(buttonsConfig),
                simulate: false
            };

            try {
                if (btnDeploy) {
                    btnDeploy.innerHTML = '<span class="spinner"></span> ⚡ Step 2/2: Arming Follow-First DM Funnel...';
                }
                const res = await App.apiCall('POST', '/api/rules/publish-and-create', publishPayload);

                if (res.live) {
                    App.showToast('🎉 Content published LIVE to Instagram & automation armed!', 'success');
                } else if (res.warning) {
                    App.showToast(res.warning, 'info');
                } else {
                    App.showToast('✅ Post published & automation armed successfully!', 'success');
                }

                App.navigate('workflows');
            } catch (err) {
                App.showToast(err.message || 'Publishing failed', 'error');
                if (btnDeploy) {
                    btnDeploy.disabled = false;
                    btnDeploy.innerHTML = '🚀 Publish to Instagram & Arm Automation';
                }
            }
            return;
        }

        const payload = {
            media_id: this.selectedMediaId,
            trigger_word: triggerWord,
            action_type: actionType,
            response_text: responseText,
            link_url: this.savedLinkUrl || document.getElementById('auto_link_url')?.value || 'https://example.com/guide.pdf',
            follow_prompt: this.savedFollowPrompt || document.getElementById('auto_follow_prompt')?.value || 'Please follow us first!',
            public_reply: this.savedPublicReply || document.getElementById('auto_public_reply')?.value || 'Sent to DMs!',
            delay_seconds: this.savedDelay !== undefined ? this.savedDelay : 5,
            buttons_config_json: JSON.stringify(buttonsConfig),
            is_active: true
        };

        try {
            await App.apiCall('POST', '/api/rules', payload);
            App.showToast('Automation deployed successfully!', 'success');
            App.navigate('workflows');
        } catch (err) {
            App.showToast(err.message, 'error');
        }
    }
};
