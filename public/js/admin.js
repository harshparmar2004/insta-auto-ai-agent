// Super Admin Portal View - Multi-Tenant Platform & Rate Limiting Controls
const adminView = {
    metrics: null,
    users: [],
    myQuota: null,
    searchQuery: '',
    statusFilter: 'all',
    isLoading: false,

    async render(container) {
        container.innerHTML = `
            <div class="view" id="admin-view" style="width: 100%; max-width: 100%; margin: 0; display: flex; flex-direction: column; gap: 1.1rem; padding-bottom: 2.5rem;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.1rem; flex-wrap: wrap; gap: 0.85rem;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span style="font-size: 1.45rem;">👑</span>
                            <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.45rem; color: #2C2A29; letter-spacing: -0.02em; margin: 0;">Super Admin Portal</h1>
                            <span style="background: #FEF3C7; color: #B45309; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.04em; border: 1px solid #FCD34D;">Platform Control</span>
                        </div>
                        <p style="font-size: 0.85rem; color: #6B6762; margin: 0; line-height: 1.4;">Monitor all creator workspaces, manage accounts, configure custom rate limits, and track platform metrics in real-time.</p>
                    </div>
                    <div style="display: flex; gap: 0.65rem; align-items: center;">
                        <button onclick="adminView.refresh(false)" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.45rem 0.9rem; font-weight: 700; border-radius: 8px; display: flex; align-items: center; gap: 0.4rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                            <span style="font-size: 0.95rem;">↻</span> Refresh Live
                        </button>
                    </div>
                </div>

                <!-- Super Admin Personal Rate Limit Hero Banner (Compact & Sleek) -->
                <div id="admin-quota-banner" style="background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border: 1.5px solid #FCD34D; border-radius: 12px; padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.07);">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                        <div style="width: 36px; height: 36px; border-radius: 9px; background: #D97757; color: #FFF; font-size: 1.15rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(217,119,87,0.3); flex-shrink: 0;">
                            👑
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                <span style="font-weight: 800; font-size: 0.92rem; color: #78350F; font-family: 'Plus Jakarta Sans', sans-serif;">Super Admin Personal Rate Limit:</span>
                                <span id="admin-quota-badge" style="background: #2E7D32; color: #FFF; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 6px; letter-spacing: 0.03em;">⚡ UNLIMITED (BYPASS)</span>
                            </div>
                            <div id="admin-quota-desc" style="font-size: 0.8rem; color: #92400E; margin-top: 0.2rem; line-height: 1.35;">
                                Super Admin automations dispatch at high priority with 0.5s pacing and zero volume limits. You can customize your own limit or grant unlimited status to any creator.
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.65rem; align-items: center;">
                        <button onclick="adminView.openSuperAdminQuotaModal()" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.45rem 0.9rem; font-weight: 700; border-radius: 8px; background: #FFFFFF; border: 1.5px solid #F59E0B; color: #92400E; display: flex; align-items: center; gap: 0.35rem; box-shadow: 0 1px 4px rgba(0,0,0,0.05); cursor: pointer; transition: all 0.15s ease;">
                            <span style="font-size: 0.95rem;">⚙️</span> Configure My Limit
                        </button>
                    </div>
                </div>

                <!-- KPI Metric Cards Grid (Sleek, Proportional, Balanced Height) -->
                <div id="admin-metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.85rem; width: 100%;">
                    <div class="card" style="padding: 0.85rem 1.15rem; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6E1D8; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                        <div style="font-size: 0.68rem; font-weight: 800; color: #736E68; text-transform: uppercase; letter-spacing: 0.05em;">Total Users</div>
                        <div id="metric-total-users" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; font-weight: 800; color: #2C2A29; margin: 0.2rem 0 0.1rem 0; line-height: 1.1;">-</div>
                        <div style="font-size: 0.75rem; color: #2E7D32; font-weight: 600;">Registered Creators</div>
                    </div>

                    <div class="card" style="padding: 0.85rem 1.15rem; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6E1D8; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                        <div style="font-size: 0.68rem; font-weight: 800; color: #736E68; text-transform: uppercase; letter-spacing: 0.05em;">Instagram Connected</div>
                        <div id="metric-connected-accounts" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; font-weight: 800; color: #D97757; margin: 0.2rem 0 0.1rem 0; line-height: 1.1;">-</div>
                        <div style="font-size: 0.75rem; color: #736E68; font-weight: 600;">Active IG Workspaces</div>
                    </div>

                    <div class="card" style="padding: 0.85rem 1.15rem; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6E1D8; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                        <div style="font-size: 0.68rem; font-weight: 800; color: #736E68; text-transform: uppercase; letter-spacing: 0.05em;">Active Automations</div>
                        <div id="metric-active-rules" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; font-weight: 800; color: #2C2A29; margin: 0.2rem 0 0.1rem 0; line-height: 1.1;">-</div>
                        <div style="font-size: 0.75rem; color: #736E68; font-weight: 600;">Live Comment Triggers</div>
                    </div>

                    <div class="card" style="padding: 0.85rem 1.15rem; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6E1D8; box-shadow: 0 1px 4px rgba(0,0,0,0.02);">
                        <div style="font-size: 0.68rem; font-weight: 800; color: #736E68; text-transform: uppercase; letter-spacing: 0.05em;">Total Leads & DMs</div>
                        <div id="metric-total-leads" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; font-weight: 800; color: #2E7D32; margin: 0.2rem 0 0.1rem 0; line-height: 1.1;">-</div>
                        <div style="font-size: 0.75rem; color: #2E7D32; font-weight: 600;">Dispatched & Tracked</div>
                    </div>
                </div>

                <!-- Token Alerts Section -->
                <div id="admin-token-alerts" style="display: none;">
                    <!-- Rendered if any tokens are expiring -->
                </div>

                <!-- User Management Table Section (Full-Width, Non-Scrollable, High Usability) -->
                <div class="card" style="background: #FFFFFF; border-radius: 14px; border: 1px solid #E6E1D8; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.02); width: 100%;">
                    <div style="padding: 0.85rem 1.25rem; border-bottom: 1.5px solid #F5F1EA; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.85rem;">
                        <div>
                            <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 1.15rem; color: #2C2A29; margin: 0 0 0.15rem 0; letter-spacing: -0.01em;">Creator Directory</h2>
                            <div style="font-size: 0.8rem; color: #736E68;">Search, inspect, and manage tenant workspaces, privileges, and rate limits.</div>
                        </div>

                        <!-- Filter & Search Controls -->
                        <div style="display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
                            <input 
                                type="text" 
                                id="admin-search-input" 
                                placeholder="Search by name, email, or @handle..." 
                                value="${this.searchQuery}"
                                oninput="adminView.handleSearch(this.value)"
                                style="padding: 0.45rem 0.85rem; font-size: 0.82rem; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FAF8F5; outline: none; min-width: 250px; transition: border-color 0.15s ease;"
                            />
                            <select 
                                id="admin-status-filter"
                                onchange="adminView.handleStatusFilter(this.value)"
                                style="padding: 0.45rem 0.85rem; font-size: 0.82rem; border-radius: 8px; border: 1.5px solid #E6E1D8; background: #FAF8F5; outline: none; cursor: pointer; font-weight: 600;"
                            >
                                <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
                                <option value="active" ${this.statusFilter === 'active' ? 'selected' : ''}>Active Only</option>
                                <option value="suspended" ${this.statusFilter === 'suspended' ? 'selected' : ''}>Suspended Only</option>
                            </select>
                        </div>
                    </div>

                    <!-- Table Container (Fits 100% width, No Horizontal Scrollbar, Balanced Proportional Columns) -->
                    <div style="width: 100%; overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
                            <thead>
                                <tr style="background: #FAF8F5; border-bottom: 1.5px solid #E6E1D8; color: #736E68; font-size: 0.72rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.04em;">
                                    <th style="padding: 0.75rem 1rem; width: 22%;">Creator / User</th>
                                    <th style="padding: 0.75rem 0.85rem; width: 17%;">Instagram Account</th>
                                    <th style="padding: 0.75rem 0.85rem; width: 12%;">Role & Status</th>
                                    <th style="padding: 0.75rem 0.85rem; width: 17%;">Rate Limit / Tier</th>
                                    <th style="padding: 0.75rem 0.85rem; width: 14%;">Automations & Leads</th>
                                    <th style="padding: 0.75rem 0.85rem; width: 8%;">Joined</th>
                                    <th style="padding: 0.75rem 1rem; width: 10%; text-align: right; white-space: nowrap;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="admin-users-tbody">
                                <tr>
                                    <td colspan="7" style="padding: 2rem; text-align: center; color: #736E68;">
                                        <span class="spinner" style="width: 24px; height: 24px; display: inline-block;"></span>
                                        <div style="margin-top: 0.5rem; font-size: 0.85rem; font-weight: 600;">Loading user directory...</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        await this.loadData();
    },

    async loadData() {
        this.isLoading = true;
        try {
            const [metricsRes, usersRes, alertsRes, myQuotaRes] = await Promise.all([
                App.apiCall('GET', '/api/admin/metrics').catch(e => null),
                App.apiCall('GET', `/api/admin/users?search=${encodeURIComponent(this.searchQuery)}`).catch(e => null),
                App.apiCall('GET', '/api/admin/token-alerts').catch(e => null),
                App.apiCall('GET', '/api/admin/my-quota').catch(e => null)
            ]);

            if (metricsRes && metricsRes.metrics) {
                this.metrics = metricsRes.metrics;
                this.renderMetrics();
            }

            if (myQuotaRes && myQuotaRes.quota) {
                this.myQuota = myQuotaRes.quota;
                this.renderMyQuota();
            }

            if (usersRes && usersRes.users) {
                this.users = usersRes.users;
                this.renderUsers();
            }

            if (alertsRes && alertsRes.alerts) {
                this.renderAlerts(alertsRes.alerts);
            }
        } catch (err) {
            console.error('[Admin Load Error]:', err);
            App.showToast('Failed to load admin data: ' + err.message, 'error');
        } finally {
            this.isLoading = false;
        }
    },

    renderMyQuota() {
        const badgeEl = document.getElementById('admin-quota-badge');
        const descEl = document.getElementById('admin-quota-desc');
        if (!badgeEl || !this.myQuota) return;

        if (this.myQuota.is_unlimited) {
            badgeEl.textContent = '⚡ UNLIMITED (BYPASS)';
            badgeEl.style.background = '#2E7D32';
            badgeEl.style.color = '#FFFFFF';
            if (descEl) {
                descEl.textContent = `Unlimited DMs active (${this.myQuota.custom_delay_seconds || 0.5}s safety delay). Your Super Admin workspace bypasses all volume restrictions.`;
            }
        } else {
            badgeEl.textContent = `⚡ CUSTOM: ${this.myQuota.hourly_limit}/HR`;
            badgeEl.style.background = '#2563EB';
            badgeEl.style.color = '#FFFFFF';
            if (descEl) {
                descEl.textContent = `Custom Limit: ${this.myQuota.hourly_limit} DMs/hour (${this.myQuota.dms_sent_current_hour || 0} sent this hour) • ${this.myQuota.monthly_limit} DMs/month • ${this.myQuota.custom_delay_seconds || 0.5}s pacing delay.`;
            }
        }
    },

    renderMetrics() {
        if (!this.metrics) return;
        const totalUsersEl = document.getElementById('metric-total-users');
        const connectedEl = document.getElementById('metric-connected-accounts');
        const rulesEl = document.getElementById('metric-active-rules');
        const leadsEl = document.getElementById('metric-total-leads');

        if (totalUsersEl) totalUsersEl.textContent = this.metrics.total_users || 0;
        if (connectedEl) connectedEl.textContent = this.metrics.connected_accounts || 0;
        if (rulesEl) rulesEl.textContent = this.metrics.active_rules || 0;
        if (leadsEl) leadsEl.textContent = this.metrics.total_leads || 0;
    },

    renderAlerts(alerts) {
        const container = document.getElementById('admin-token-alerts');
        if (!container) return;

        if (!alerts || alerts.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        container.innerHTML = `
            <div style="padding: 1rem 1.25rem; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; display: flex; align-items: center; gap: 0.85rem;">
                <span style="font-size: 1.4rem;">⚠️</span>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 0.88rem; color: #92400E;">Token Attention Required (${alerts.length})</div>
                    <div style="font-size: 0.8rem; color: #B45309; margin-top: 0.15rem;">
                        The following accounts have tokens expiring soon: 
                        ${alerts.map(a => `<strong>@${a.ig_username}</strong> (${a.email})`).join(', ')}.
                    </div>
                </div>
            </div>
        `;
    },

    renderUsers() {
        const tbody = document.getElementById('admin-users-tbody');
        if (!tbody) return;

        let filtered = this.users || [];
        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(u => u.status === this.statusFilter);
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="padding: 3rem; text-align: center; color: #736E68;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.4rem;">🔍</div>
                        <div style="font-weight: 700; font-size: 1.05rem; color: #2C2A29;">No creators found</div>
                        <div style="font-size: 0.86rem; color: #A09890; margin-top: 0.25rem;">Try adjusting your search query or filters.</div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map(user => {
            const isSuper = user.role === 'super_admin';
            const isActive = user.status === 'active';
            const hasIg = !!user.ig_username;
            const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

            const isUnlimited = user.is_unlimited === 1 || user.is_unlimited === true || (isSuper && (user.is_unlimited === null || user.is_unlimited === undefined));
            const hourlyLimit = user.hourly_limit !== undefined && user.hourly_limit !== null ? user.hourly_limit : (isSuper ? '∞' : 60);
            const monthlyLimit = user.monthly_limit !== undefined && user.monthly_limit !== null ? user.monthly_limit : (isSuper ? '∞' : 1000);
            const planTier = user.plan_tier || (isSuper ? 'super_admin' : 'free');
            const sentHour = user.dms_sent_current_hour || 0;

            return `
                <tr style="border-bottom: 1.5px solid #F5F1EA; transition: background 0.15s ease;" onmouseover="this.style.background='#FAF8F5'" onmouseout="this.style.background='transparent'">
                    <!-- 1. Creator / User -->
                    <td style="padding: 0.7rem 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.65rem;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: #FAF0EC; color: #D97757; font-weight: 700; font-size: 0.76rem; display: flex; align-items: center; justify-content: center; border: 1.5px solid #E6E1D8; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                                ${initials}
                            </div>
                            <div style="overflow: hidden;">
                                <div style="font-weight: 700; font-size: 0.86rem; color: #2C2A29; line-height: 1.25;">${user.name || 'Unnamed Creator'}</div>
                                <div style="font-size: 0.74rem; color: #736E68; margin-top: 0.1rem;">${user.email}</div>
                            </div>
                        </div>
                    </td>

                    <!-- 2. Instagram Workspace -->
                    <td style="padding: 0.7rem 0.85rem;">
                        ${hasIg ? `
                            <div style="display: flex; align-items: center; gap: 0.35rem; font-weight: 600; color: #2C2A29; font-size: 0.82rem;">
                                <span style="color: #2E7D32; font-size: 0.72rem;">●</span>
                                <span>@${user.ig_username}</span>
                            </div>
                            <div style="font-size: 0.68rem; color: #2E7D32; font-weight: 600; margin-top: 1px;">Connected & Active</div>
                        ` : `
                            <span style="font-size: 0.72rem; color: #A09890; font-style: italic; background: #FAF8F5; padding: 2px 6px; border-radius: 4px; border: 1px solid #E6E1D8;">Not Connected</span>
                        `}
                    </td>

                    <!-- 3. Role & Status (Stacked, Compact) -->
                    <td style="padding: 0.7rem 0.85rem;">
                        <div style="display: flex; flex-direction: column; gap: 0.25rem; align-items: flex-start;">
                            <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; ${isSuper ? 'background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D;' : 'background: #FAF0EC; color: #D97757; border: 1px solid #F4D5CB;'}">
                                ${isSuper ? '👑 Super Admin' : 'Creator'}
                            </span>
                            <span style="font-size: 0.66rem; font-weight: 700; text-transform: uppercase; padding: 1px 6px; border-radius: 4px; ${isActive ? 'background: #E8F5E9; color: #2E7D32;' : 'background: #FEE2E2; color: #DC2626;'}">
                                ${isActive ? '● Active' : '● Suspended'}
                            </span>
                        </div>
                    </td>

                    <!-- 4. Rate Limit / Plan Tier -->
                    <td style="padding: 0.7rem 0.85rem;">
                        <div style="display: flex; flex-direction: column; gap: 0.15rem;">
                            ${isUnlimited ? `
                                <span style="background: #E0F2FE; color: #0284C7; font-weight: 800; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; width: fit-content; border: 1px solid #BAE6FD;">
                                    ⚡ UNLIMITED
                                </span>
                                <span style="font-size: 0.68rem; color: #736E68; font-weight: 500;">Zero restrictions</span>
                            ` : `
                                <div style="font-weight: 700; color: #2C2A29; font-size: 0.8rem; display: flex; align-items: center; gap: 3px;">
                                    <span>${hourlyLimit}/hr</span>
                                    <span style="color: #A09890; font-weight: 400;">•</span>
                                    <span style="color: #736E68; font-size: 0.72rem;">${monthlyLimit}/mo</span>
                                </div>
                                <span style="font-size: 0.68rem; color: #B45309; font-weight: 700; text-transform: uppercase;">
                                    ${planTier} (${sentHour} used/hr)
                                </span>
                            `}
                        </div>
                    </td>

                    <!-- 5. Automations & Leads (Compact Pill summary) -->
                    <td style="padding: 0.7rem 0.85rem;">
                        <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
                            <span style="font-weight: 600; color: #2C2A29; background: #F5F1EA; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; border: 1px solid #E6E1D8;" title="Active Automation Rules">
                                ⚡ ${user.rules_count || 0} Rules
                            </span>
                            <span style="font-weight: 600; color: #2E7D32; background: #E8F5E9; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; border: 1px solid #C8E6C9;" title="Dispatched Leads">
                                🎯 ${user.leads_count || 0} Leads
                            </span>
                        </div>
                    </td>

                    <!-- 6. Joined Date -->
                    <td style="padding: 0.7rem 0.85rem; color: #736E68; font-size: 0.76rem; font-weight: 500;">
                        ${joinedDate}
                    </td>

                    <!-- 7. Actions (Compact & Sleek) -->
                    <td style="padding: 0.7rem 1rem; text-align: right; white-space: nowrap;">
                        <div style="display: flex; justify-content: flex-end; gap: 0.35rem; align-items: center;">
                            <!-- Configure Quota / Limit -->
                            <button 
                                onclick="adminView.openUserQuotaModal(${user.id}, '${(user.name || user.email).replace(/'/g, "\\'")}', '${user.email}', ${isSuper})"
                                title="Configure Rate Limits & Quotas"
                                class="btn btn-secondary"
                                style="padding: 0.32rem 0.6rem; font-size: 0.74rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem; color: #B45309; border-color: #FCD34D; background: #FFFBEB; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);"
                            >
                                <span>⚡</span> Limit
                            </button>

                            <!-- Impersonate / Inspect Workspace -->
                            <button 
                                onclick="adminView.impersonateUser(${user.id}, '${(user.name || user.email).replace(/'/g, "\\'")}')"
                                title="Inspect this creator's automations & workspace"
                                class="btn btn-secondary"
                                style="padding: 0.32rem 0.6rem; font-size: 0.74rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem; border-radius: 6px;"
                            >
                                <span>👁️</span> View
                            </button>

                            <!-- Toggle Suspend / Activate (Only for non-super admins) -->
                            ${!isSuper ? `
                                <button 
                                    onclick="adminView.toggleStatus(${user.id}, '${isActive ? 'suspended' : 'active'}')"
                                    title="${isActive ? 'Suspend User Access' : 'Activate User Access'}"
                                    class="btn btn-secondary"
                                    style="padding: 0.32rem 0.6rem; font-size: 0.74rem; font-weight: 700; color: ${isActive ? '#DC2626' : '#2E7D32'}; border-radius: 6px;"
                                >
                                    ${isActive ? 'Pause' : 'Activate'}
                                </button>
                            ` : ''}

                            <!-- Delete User Workspace (Only for non-super admins) -->
                            ${!isSuper ? `
                                <button 
                                    onclick="adminView.deleteUser(${user.id}, '${(user.name || user.email).replace(/'/g, "\\'")}')"
                                    title="Delete User Workspace"
                                    class="btn btn-secondary"
                                    style="padding: 0.32rem 0.5rem; font-size: 0.74rem; font-weight: 700; color: #DC2626; border-radius: 6px;"
                                >
                                    🗑️
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    handleSearch(query) {
        this.searchQuery = query;
        this.renderUsers();
    },

    handleStatusFilter(status) {
        this.statusFilter = status;
        this.renderUsers();
    },

    impersonateUser(userId, userName) {
        App.impersonateUser(userId, userName);
    },

    async toggleStatus(userId, newStatus) {
        try {
            const res = await App.apiCall('POST', `/api/admin/users/${userId}/status`, { status: newStatus });
            App.showToast(res.message || `User status updated to ${newStatus}`, 'success');
            await this.loadData();
        } catch (err) {
            App.showToast(err.message || 'Failed to update status', 'error');
        }
    },

    async deleteUser(userId, userName) {
        if (!confirm(`Are you sure you want to permanently delete workspace for "${userName}"? This will delete their connected automations and data.`)) {
            return;
        }

        try {
            const res = await App.apiCall('DELETE', `/api/admin/users/${userId}`);
            App.showToast(res.message || 'User deleted successfully', 'success');
            await this.loadData();
        } catch (err) {
            App.showToast(err.message || 'Failed to delete user', 'error');
        }
    },

    // Open Modal to Configure User Quota & Rate Limit
    async openUserQuotaModal(userId, userName, userEmail, isSuper) {
        try {
            App.openModal(`Rate Limit & Quota Settings`, `
                <div style="text-align: center; padding: 2rem;">
                    <span class="spinner" style="width: 24px; height: 24px; display: inline-block;"></span>
                    <div style="margin-top: 0.5rem; color: #736E68;">Loading rate limit settings...</div>
                </div>
            `);

            const res = await App.apiCall('GET', `/api/admin/users/${userId}/quota`);
            const quota = res?.quota || {
                is_unlimited: isSuper ? 1 : 0,
                hourly_limit: isSuper ? -1 : 60,
                monthly_limit: isSuper ? -1 : 1000,
                plan_tier: isSuper ? 'super_admin' : 'free',
                custom_delay_seconds: isSuper ? 0.5 : 1.5,
                dms_sent_current_hour: 0,
                dms_sent_current_month: 0
            };

            const isUnlimited = quota.is_unlimited === 1 || quota.is_unlimited === true;

            const html = `
                <div style="padding: 0.15rem 0;">
                    <!-- User Header Details -->
                    <div style="background: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 8px; padding: 0.65rem 0.85rem; margin-bottom: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 700; font-size: 0.88rem; color: #2C2A29;">${userName}</div>
                            <div style="font-size: 0.74rem; color: #736E68;">${userEmail}</div>
                        </div>
                        <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; ${isSuper ? 'background: #FEF3C7; color: #B45309;' : 'background: #FAF0EC; color: #D97757;'}">
                            ${isSuper ? '👑 Super Admin' : 'Creator'}
                        </span>
                    </div>

                    <!-- Unlimited Override Toggle -->
                    <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 8px; padding: 0.65rem 0.85rem; margin-bottom: 0.85rem;">
                        <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" id="modal-quota-unlimited" style="width: 16px; height: 16px; margin-top: 1px; accent-color: #D97757; cursor: pointer;" onchange="adminView.handleQuotaUnlimitedToggle(this.checked)" ${isUnlimited ? 'checked' : ''}>
                            <div>
                                <div style="font-weight: 700; color: #1E40AF; font-size: 0.82rem; display: flex; align-items: center; gap: 0.3rem;">
                                    <span>⚡ Grant Unlimited DMs (No Rate Limits)</span>
                                </div>
                                <div style="font-size: 0.72rem; color: #3B82F6; margin-top: 0.15rem; line-height: 1.3;">
                                    Super Admin privilege: Allows this creator to trigger infinite automated DMs without hourly or monthly throttling.
                                </div>
                            </div>
                        </label>
                    </div>

                    <!-- Presets Selection Bar -->
                    <div style="margin-bottom: 0.85rem;">
                        <div style="font-size: 0.72rem; font-weight: 700; color: #736E68; text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.04em;">Quick Presets</div>
                        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
                            <button type="button" onclick="adminView.applyQuotaPreset('unlimited')" class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.35rem 0.65rem; font-weight: 700; border-color: #BFDBFE; color: #1E40AF; background: #EFF6FF; border-radius: 6px;">⚡ Unlimited</button>
                            <button type="button" onclick="adminView.applyQuotaPreset('free')" class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.35rem 0.65rem; font-weight: 700; border-radius: 6px;">Free (60/hr)</button>
                            <button type="button" onclick="adminView.applyQuotaPreset('pro')" class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.35rem 0.65rem; font-weight: 700; border-radius: 6px;">Pro (300/hr)</button>
                            <button type="button" onclick="adminView.applyQuotaPreset('agency')" class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.35rem 0.65rem; font-weight: 700; border-radius: 6px;">Agency (1000/hr)</button>
                        </div>
                    </div>

                    <!-- Custom Limits Form Fields -->
                    <div id="modal-quota-custom-fields" style="${isUnlimited ? 'opacity: 0.5; pointer-events: none;' : ''}">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.76rem; font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem; display: block;">Hourly DM Limit</label>
                                <input type="number" id="modal-quota-hourly" class="input" value="${quota.hourly_limit !== -1 ? quota.hourly_limit : 60}" min="1" max="50000" style="padding: 0.45rem 0.65rem; font-size: 0.84rem; font-weight: 600; width: 100%; box-sizing: border-box; border-radius: 6px;">
                                <span style="font-size: 0.68rem; color: #736E68; display: block; margin-top: 0.15rem;">Max DMs per rolling 60 minutes</span>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.76rem; font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem; display: block;">Monthly DM Limit</label>
                                <input type="number" id="modal-quota-monthly" class="input" value="${quota.monthly_limit !== -1 ? quota.monthly_limit : 1000}" min="1" max="500000" style="padding: 0.45rem 0.65rem; font-size: 0.84rem; font-weight: 600; width: 100%; box-sizing: border-box; border-radius: 6px;">
                                <span style="font-size: 0.68rem; color: #736E68; display: block; margin-top: 0.15rem;">Max DMs per rolling 30 days</span>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.85rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.76rem; font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem; display: block;">Plan Tier Badge</label>
                                <select id="modal-quota-plan" class="input" style="padding: 0.45rem 0.65rem; font-size: 0.84rem; font-weight: 600; width: 100%; box-sizing: border-box; border-radius: 6px;">
                                    <option value="free" ${quota.plan_tier === 'free' ? 'selected' : ''}>Free</option>
                                    <option value="pro" ${quota.plan_tier === 'pro' ? 'selected' : ''}>Pro</option>
                                    <option value="agency" ${quota.plan_tier === 'agency' ? 'selected' : ''}>Agency</option>
                                    <option value="custom" ${quota.plan_tier === 'custom' ? 'selected' : ''}>Custom / VIP</option>
                                    <option value="super_admin" ${quota.plan_tier === 'super_admin' ? 'selected' : ''}>Super Admin</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.76rem; font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem; display: block;">Dispatch Pacing Delay (s)</label>
                                <input type="number" id="modal-quota-delay" class="input" value="${quota.custom_delay_seconds || 1.5}" min="0.1" max="10" step="0.1" style="padding: 0.45rem 0.65rem; font-size: 0.84rem; font-weight: 600; width: 100%; box-sizing: border-box; border-radius: 6px;">
                                <span style="font-size: 0.68rem; color: #736E68; display: block; margin-top: 0.15rem;">Seconds between consecutive DMs</span>
                            </div>
                        </div>
                    </div>

                    <!-- Usage Stats -->
                    <div style="background: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 8px; padding: 0.65rem 0.85rem; margin-bottom: 0.85rem; font-size: 0.76rem; color: #736E68;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                            <span>Current Hour Usage:</span>
                            <strong style="color: #2C2A29; font-size: 0.82rem;">${quota.dms_sent_current_hour || 0} DMs sent</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Current 30-Day Window:</span>
                            <strong style="color: #2C2A29; font-size: 0.82rem;">${quota.dms_sent_current_month || 0} DMs sent</strong>
                        </div>
                    </div>

                    <!-- Footer Controls -->
                    <div style="display: flex; justify-content: flex-end; gap: 0.65rem;">
                        <button type="button" class="btn btn-secondary" onclick="App.closeModal()" style="padding: 0.45rem 0.95rem; font-size: 0.82rem; font-weight: 700; border-radius: 8px;">Cancel</button>
                        <button type="button" class="btn btn-primary" id="modal-quota-save-btn" onclick="adminView.saveUserQuota(${userId})" style="padding: 0.45rem 1.05rem; font-size: 0.82rem; font-weight: 700; border-radius: 8px;">
                            Save Rate Limits
                        </button>
                    </div>
                </div>
            `;

            App.openModal(`⚡ Rate Limit: ${userName}`, html);
        } catch (err) {
            console.error('[Open Quota Modal Error]:', err);
            App.showToast('Failed to open rate limit modal: ' + err.message, 'error');
        }
    },

    // Open Modal to Configure Super Admin Own Personal Limit
    async openSuperAdminQuotaModal() {
        try {
            App.openModal(`Super Admin Personal Limit`, `
                <div style="text-align: center; padding: 2rem;">
                    <span class="spinner" style="width: 28px; height: 28px; display: inline-block;"></span>
                    <div style="margin-top: 0.75rem; color: #736E68; font-size: 0.95rem;">Loading Super Admin settings...</div>
                </div>
            `);

            const res = await App.apiCall('GET', '/api/admin/my-quota');
            const quota = res?.quota || {
                is_unlimited: 1,
                hourly_limit: -1,
                monthly_limit: -1,
                plan_tier: 'super_admin',
                custom_delay_seconds: 0.5,
                dms_sent_current_hour: 0,
                dms_sent_current_month: 0
            };

            const isUnlimited = quota.is_unlimited === 1 || quota.is_unlimited === true;

            const html = `
                <div style="padding: 0.15rem 0;">
                    <div style="background: #FEF3C7; border: 1.5px solid #FCD34D; border-radius: 8px; padding: 0.65rem 0.85rem; margin-bottom: 0.85rem;">
                        <div style="font-weight: 700; color: #92400E; font-size: 0.88rem; display: flex; align-items: center; gap: 0.35rem;">
                            <span>👑 Super Admin Rate Limit & Dispatch Controls</span>
                        </div>
                        <div style="font-size: 0.74rem; color: #B45309; margin-top: 0.2rem; line-height: 1.35;">
                            You control your own rate limits. Unlimited is recommended for high-volume automated campaigns and live reel launches.
                        </div>
                    </div>

                    <!-- Unlimited Toggle -->
                    <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 8px; padding: 0.65rem 0.85rem; margin-bottom: 0.85rem;">
                        <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" id="modal-quota-unlimited" style="width: 16px; height: 16px; margin-top: 1px; accent-color: #D97757; cursor: pointer;" onchange="adminView.handleQuotaUnlimitedToggle(this.checked)" ${isUnlimited ? 'checked' : ''}>
                            <div>
                                <div style="font-weight: 700; color: #1E40AF; font-size: 0.84rem;">⚡ Unlimited DMs (No Rate Limits)</div>
                                <div style="font-size: 0.72rem; color: #3B82F6; margin-top: 0.15rem; line-height: 1.3;">
                                    Bypasses all hourly and monthly throttles. Dispatches as fast as safely configured.
                                </div>
                            </div>
                        </label>
                    </div>

                    <!-- Presets Selection Bar -->
                    <div style="margin-bottom: 0.85rem;">
                        <div style="font-size: 0.72rem; font-weight: 700; color: #736E68; text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.04em;">Admin Presets</div>
                        <div style="display: flex; gap: 0.45rem; flex-wrap: wrap;">
                            <button type="button" onclick="adminView.applyQuotaPreset('unlimited')" class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.35rem 0.65rem; font-weight: 700; border-color: #BFDBFE; color: #1E40AF; background: #EFF6FF; border-radius: 6px;">⚡ Unlimited (Recommended)</button>
                            <button type="button" onclick="adminView.applyQuotaPreset('super_high')" class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.35rem 0.65rem; font-weight: 700; border-radius: 6px;">Turbo (5000/hr)</button>
                            <button type="button" onclick="adminView.applyQuotaPreset('safe')" class="btn btn-secondary" style="font-size: 0.76rem; padding: 0.35rem 0.65rem; font-weight: 700; border-radius: 6px;">Safe Cap (500/hr)</button>
                        </div>
                    </div>

                    <!-- Custom Form Fields -->
                    <div id="modal-quota-custom-fields" style="${isUnlimited ? 'opacity: 0.5; pointer-events: none;' : ''}">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.76rem; font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem; display: block;">Hourly DM Limit</label>
                                <input type="number" id="modal-quota-hourly" class="input" value="${quota.hourly_limit !== -1 ? quota.hourly_limit : 5000}" min="1" max="100000" style="padding: 0.45rem 0.65rem; font-size: 0.84rem; font-weight: 600; width: 100%; box-sizing: border-box; border-radius: 6px;">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.76rem; font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem; display: block;">Monthly DM Limit</label>
                                <input type="number" id="modal-quota-monthly" class="input" value="${quota.monthly_limit !== -1 ? quota.monthly_limit : 100000}" min="1" max="1000000" style="padding: 0.45rem 0.65rem; font-size: 0.84rem; font-weight: 600; width: 100%; box-sizing: border-box; border-radius: 6px;">
                            </div>
                        </div>
                    </div>

                    <!-- Dispatch Delay Pacing -->
                    <div class="form-group" style="margin-bottom: 0.85rem;">
                        <label style="font-size: 0.76rem; font-weight: 700; color: #2C2A29; margin-bottom: 0.25rem; display: block;">Super Admin Dispatch Pacing Delay (s)</label>
                        <input type="number" id="modal-quota-delay" class="input" value="${quota.custom_delay_seconds || 0.5}" min="0.1" max="5" step="0.1" style="padding: 0.45rem 0.65rem; font-size: 0.84rem; font-weight: 600; width: 100%; box-sizing: border-box; border-radius: 6px;">
                        <span style="font-size: 0.68rem; color: #736E68; display: block; margin-top: 0.15rem;">Default is 0.5s for Super Admin fast burst dispatch.</span>
                    </div>

                    <!-- Usage Telemetry -->
                    <div style="background: #FAF8F5; border: 1px solid #E6E1D8; border-radius: 8px; padding: 0.65rem 0.85rem; margin-bottom: 0.85rem; font-size: 0.76rem; color: #736E68;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Sent in Current Hour:</span>
                            <strong style="color: #2C2A29; font-size: 0.82rem;">${quota.dms_sent_current_hour || 0} DMs</strong>
                        </div>
                    </div>

                    <!-- Footer Controls -->
                    <div style="display: flex; justify-content: flex-end; gap: 0.65rem;">
                        <button type="button" class="btn btn-secondary" onclick="App.closeModal()" style="padding: 0.45rem 0.95rem; font-size: 0.82rem; font-weight: 700; border-radius: 8px;">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="adminView.saveSuperAdminQuota()" style="padding: 0.45rem 1.05rem; font-size: 0.82rem; font-weight: 700; border-radius: 8px;">
                            Save Super Admin Limit
                        </button>
                    </div>
                </div>
            `;

            App.openModal(`👑 Super Admin Personal Limit`, html);
        } catch (err) {
            console.error('[Open Super Admin Quota Modal Error]:', err);
            App.showToast('Failed to open super admin limit modal: ' + err.message, 'error');
        }
    },

    handleQuotaUnlimitedToggle(isUnlimited) {
        const fields = document.getElementById('modal-quota-custom-fields');
        if (!fields) return;
        if (isUnlimited) {
            fields.style.opacity = '0.5';
            fields.style.pointerEvents = 'none';
        } else {
            fields.style.opacity = '1';
            fields.style.pointerEvents = 'auto';
        }
    },

    applyQuotaPreset(preset) {
        const unlimitedEl = document.getElementById('modal-quota-unlimited');
        const hourlyEl = document.getElementById('modal-quota-hourly');
        const monthlyEl = document.getElementById('modal-quota-monthly');
        const planEl = document.getElementById('modal-quota-plan');
        const delayEl = document.getElementById('modal-quota-delay');

        if (preset === 'unlimited') {
            if (unlimitedEl) unlimitedEl.checked = true;
            this.handleQuotaUnlimitedToggle(true);
            if (planEl) planEl.value = 'custom';
            if (delayEl) delayEl.value = '0.5';
        } else if (preset === 'super_high') {
            if (unlimitedEl) unlimitedEl.checked = false;
            this.handleQuotaUnlimitedToggle(false);
            if (hourlyEl) hourlyEl.value = '5000';
            if (monthlyEl) monthlyEl.value = '100000';
            if (delayEl) delayEl.value = '0.5';
        } else if (preset === 'safe') {
            if (unlimitedEl) unlimitedEl.checked = false;
            this.handleQuotaUnlimitedToggle(false);
            if (hourlyEl) hourlyEl.value = '500';
            if (monthlyEl) monthlyEl.value = '10000';
            if (delayEl) delayEl.value = '1.0';
        } else if (preset === 'free') {
            if (unlimitedEl) unlimitedEl.checked = false;
            this.handleQuotaUnlimitedToggle(false);
            if (hourlyEl) hourlyEl.value = '60';
            if (monthlyEl) monthlyEl.value = '1000';
            if (planEl) planEl.value = 'free';
            if (delayEl) delayEl.value = '1.5';
        } else if (preset === 'pro') {
            if (unlimitedEl) unlimitedEl.checked = false;
            this.handleQuotaUnlimitedToggle(false);
            if (hourlyEl) hourlyEl.value = '300';
            if (monthlyEl) monthlyEl.value = '5000';
            if (planEl) planEl.value = 'pro';
            if (delayEl) delayEl.value = '1.0';
        } else if (preset === 'agency') {
            if (unlimitedEl) unlimitedEl.checked = false;
            this.handleQuotaUnlimitedToggle(false);
            if (hourlyEl) hourlyEl.value = '1000';
            if (monthlyEl) monthlyEl.value = '20000';
            if (planEl) planEl.value = 'agency';
            if (delayEl) delayEl.value = '0.75';
        }
    },

    async saveUserQuota(userId) {
        const btn = document.getElementById('modal-quota-save-btn');
        const origText = btn ? btn.textContent : '';
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Saving...';
        }

        try {
            const isUnlimited = document.getElementById('modal-quota-unlimited')?.checked;
            const hourlyLimit = Number(document.getElementById('modal-quota-hourly')?.value || 60);
            const monthlyLimit = Number(document.getElementById('modal-quota-monthly')?.value || 1000);
            const planTier = document.getElementById('modal-quota-plan')?.value || 'free';
            const delaySeconds = Number(document.getElementById('modal-quota-delay')?.value || 1.5);

            const payload = {
                is_unlimited: isUnlimited ? 1 : 0,
                hourly_limit: isUnlimited ? -1 : hourlyLimit,
                monthly_limit: isUnlimited ? -1 : monthlyLimit,
                plan_tier: isUnlimited ? 'custom' : planTier,
                custom_delay_seconds: delaySeconds
            };

            const res = await App.apiCall('POST', `/api/admin/users/${userId}/quota`, payload);
            App.showToast(res.message || 'Rate limit updated successfully!', 'success');
            App.closeModal();
            await this.loadData();
        } catch (err) {
            console.error('[Save Quota Error]:', err);
            App.showToast(err.message || 'Failed to update rate limit', 'error');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = origText;
            }
        }
    },

    async saveSuperAdminQuota() {
        try {
            const isUnlimited = document.getElementById('modal-quota-unlimited')?.checked;
            const hourlyLimit = Number(document.getElementById('modal-quota-hourly')?.value || 5000);
            const monthlyLimit = Number(document.getElementById('modal-quota-monthly')?.value || 100000);
            const delaySeconds = Number(document.getElementById('modal-quota-delay')?.value || 0.5);

            const payload = {
                is_unlimited: isUnlimited ? 1 : 0,
                hourly_limit: isUnlimited ? -1 : hourlyLimit,
                monthly_limit: isUnlimited ? -1 : monthlyLimit,
                custom_delay_seconds: delaySeconds
            };

            const res = await App.apiCall('POST', '/api/admin/my-quota', payload);
            App.showToast(res.message || 'Super Admin rate limit updated!', 'success');
            App.closeModal();
            await this.loadData();
        } catch (err) {
            console.error('[Save Super Admin Quota Error]:', err);
            App.showToast(err.message || 'Failed to update rate limit', 'error');
        }
    },

    async refresh(isSilent = true) {
        if (!isSilent) App.showToast('Refreshing Super Admin telemetry...', 'info');
        await this.loadData();
    }
};

window.adminView = adminView;
window.admin = adminView;
