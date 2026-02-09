// ===================================
// IM Global - Admin Edit Mode
// ===================================

(function () {
    'use strict';

    // Secret key for accessing edit mode (change this to your own secret)
    const ADMIN_SECRET_KEY = 'imglob2024admin';

    // Check if edit mode should be activated
    const urlParams = new URLSearchParams(window.location.search);
    const editParam = urlParams.get('edit');

    if (editParam !== ADMIN_SECRET_KEY) {
        return; // Exit if not in admin mode
    }

    // Storage key for pending changes
    const STORAGE_KEY = 'imglobal-admin-changes';

    // State
    let pendingChanges = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    let currentTranslations = null;

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function () {
        // Get reference to the translations object from the main script
        // We need to extract it by parsing the script
        extractTranslations();

        // Initialize admin mode
        initAdminMode();
    });

    function extractTranslations() {
        // Since translations are in script.js, we need to access them
        // We'll create a copy by re-parsing the patterns from elements
        currentTranslations = { en: {}, tr: {} };

        // Get all translatable elements and their current content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            // We'll need to get both EN and TR values
            // For now, store the current displayed value
            if (!currentTranslations.en[key]) {
                currentTranslations.en[key] = '';
                currentTranslations.tr[key] = '';
            }
        });
    }

    function initAdminMode() {
        // Add admin class to body
        document.body.classList.add('admin-mode');

        // Create and insert admin toolbar
        createToolbar();

        // Add edit buttons to all translatable elements
        addEditButtons();

        // Apply any pending changes from localStorage
        applyPendingChanges();

        // Update status
        updateStatus();
    }

    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'admin-toolbar';
        toolbar.innerHTML = `
            <button class="admin-toolbar-toggle" id="adminToggle" title="Collapse toolbar">▲</button>
            <div class="admin-toolbar-content">
                <div class="admin-toolbar-left">
                    <span class="admin-toolbar-title">Edit Mode</span>
                    <span class="admin-toolbar-status" id="adminStatus">No pending changes</span>
                </div>
                <div class="admin-toolbar-right">
                    <button class="admin-btn admin-btn-instructions" id="adminInstructions">📖 How to Deploy</button>
                    <button class="admin-btn admin-btn-export" id="adminExport" disabled>📥 Export Changes</button>
                    <button class="admin-btn admin-btn-exit" id="adminExit">✕ Exit Edit Mode</button>
                </div>
            </div>
        `;
        document.body.insertBefore(toolbar, document.body.firstChild);

        // Event listeners
        document.getElementById('adminInstructions').addEventListener('click', showInstructions);
        document.getElementById('adminExport').addEventListener('click', exportChanges);
        document.getElementById('adminExit').addEventListener('click', exitEditMode);

        // Toggle collapse
        document.getElementById('adminToggle').addEventListener('click', function () {
            toolbar.classList.toggle('collapsed');
            this.textContent = toolbar.classList.contains('collapsed') ? '▼' : '▲';
            this.title = toolbar.classList.contains('collapsed') ? 'Expand toolbar' : 'Collapse toolbar';
            document.body.classList.toggle('admin-mode-collapsed', toolbar.classList.contains('collapsed'));
        });
    }

    function addEditButtons() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            // Skip if already has edit button
            if (el.querySelector('.admin-edit-btn')) return;

            // Create edit button
            const btn = document.createElement('button');
            btn.className = 'admin-edit-btn';
            btn.innerHTML = '✏️';
            btn.title = 'Edit this text';
            btn.setAttribute('data-edit-key', el.getAttribute('data-i18n'));

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openEditModal(el.getAttribute('data-i18n'), el);
            });

            // Insert button after the element or inside it
            if (el.tagName === 'P' || el.tagName === 'SPAN' || el.tagName === 'H1' ||
                el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4' ||
                el.tagName === 'LI' || el.tagName === 'A' || el.tagName === 'DIV') {
                el.style.display = 'inline';
                el.insertAdjacentElement('afterend', btn);
            } else {
                el.appendChild(btn);
            }

            // Mark if has pending changes
            if (pendingChanges[el.getAttribute('data-i18n')]) {
                el.classList.add('admin-changed');
            }
        });
    }

    function openEditModal(key, element) {
        // Get translation values from the main translations object
        // We need to access it via window scope since it's defined in script.js
        let enValue = '';
        let trValue = '';

        // Try to get the original translations from script.js
        // The translations object is inside the DOMContentLoaded closure, so we need to extract from the script
        const scriptEl = document.querySelector('script[src="script.js"]');
        if (scriptEl) {
            // Fetch and parse translations from script.js
            fetch('script.js')
                .then(response => response.text())
                .then(scriptContent => {
                    // Helper function to extract value for a key from a section
                    function extractValue(section, key) {
                        // Find the key in the section
                        const keyPattern = new RegExp(`['"]${escapeRegex(key)}['"]:\\s*'`);
                        const keyMatch = section.match(keyPattern);

                        if (keyMatch) {
                            // Find where the value starts
                            const startIdx = section.indexOf(keyMatch[0]) + keyMatch[0].length;
                            // Find the closing quote (not escaped)
                            let endIdx = startIdx;
                            let inEscape = false;
                            for (let i = startIdx; i < section.length; i++) {
                                if (inEscape) {
                                    inEscape = false;
                                    continue;
                                }
                                if (section[i] === '\\') {
                                    inEscape = true;
                                    continue;
                                }
                                if (section[i] === "'") {
                                    endIdx = i;
                                    break;
                                }
                            }
                            return section.substring(startIdx, endIdx)
                                .replace(/\\'/g, "'")
                                .replace(/\\n/g, '\n');
                        }
                        return '';
                    }

                    // Parse out EN and TR sections
                    const enSectionMatch = scriptContent.match(/translations\s*=\s*\{[\s\S]*?en:\s*\{([\s\S]*?)\},\s*tr:/);
                    const trSectionMatch = scriptContent.match(/tr:\s*\{([\s\S]*?)\}\s*\};/);

                    if (enSectionMatch && enSectionMatch[1]) {
                        enValue = extractValue(enSectionMatch[1], key);
                    }

                    if (trSectionMatch && trSectionMatch[1]) {
                        trValue = extractValue(trSectionMatch[1], key);
                    }

                    // Override with pending changes if they exist
                    const savedChange = pendingChanges[key] || {};
                    if (savedChange.en) enValue = savedChange.en;
                    if (savedChange.tr) trValue = savedChange.tr;

                    // Now show the modal with both values
                    showEditModalUI(key, element, enValue, trValue);
                })
                .catch(err => {
                    console.error('Error loading translations:', err);
                    // Fallback: use current text
                    const currentLang = document.documentElement.lang || 'en';
                    const currentText = element.textContent.replace('✏️', '').trim();
                    const savedChange = pendingChanges[key] || {};
                    enValue = savedChange.en || (currentLang === 'en' ? currentText : '');
                    trValue = savedChange.tr || (currentLang === 'tr' ? currentText : '');
                    showEditModalUI(key, element, enValue, trValue);
                });
        } else {
            // Fallback if script tag not found
            const currentLang = document.documentElement.lang || 'en';
            const currentText = element.textContent.replace('✏️', '').trim();
            const savedChange = pendingChanges[key] || {};
            enValue = savedChange.en || (currentLang === 'en' ? currentText : '');
            trValue = savedChange.tr || (currentLang === 'tr' ? currentText : '');
            showEditModalUI(key, element, enValue, trValue);
        }
    }

    function showEditModalUI(key, element, enValue, trValue) {
        const overlay = document.createElement('div');
        overlay.className = 'admin-modal-overlay';
        overlay.innerHTML = `
            <div class="admin-modal admin-modal-wide">
                <div class="admin-modal-header">
                    <div>
                        <div class="admin-modal-title">Edit Text</div>
                        <div class="admin-modal-key">${key}</div>
                    </div>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body admin-modal-body-split">
                    <div class="admin-field">
                        <label class="admin-field-label">
                            <span class="admin-field-flag">🇺🇸</span> English
                        </label>
                        <textarea class="admin-field-input" id="editEnglish" placeholder="Enter English text...">${escapeHtml(enValue)}</textarea>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">
                            <span class="admin-field-flag">🇹🇷</span> Türkçe
                        </label>
                        <textarea class="admin-field-input" id="editTurkish" placeholder="Türkçe metni girin...">${escapeHtml(trValue)}</textarea>
                    </div>
                </div>
                <div class="admin-modal-footer">
                    <button class="admin-modal-btn admin-modal-btn-cancel">Cancel</button>
                    <button class="admin-modal-btn admin-modal-btn-save">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Focus first field
        setTimeout(() => {
            document.getElementById('editEnglish').focus();
        }, 100);

        // Event listeners
        overlay.querySelector('.admin-modal-close').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.querySelector('.admin-modal-btn-cancel').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.querySelector('.admin-modal-btn-save').addEventListener('click', () => {
            const enText = document.getElementById('editEnglish').value;
            const trText = document.getElementById('editTurkish').value;

            saveChange(key, enText, trText, element);
            overlay.remove();
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    function saveChange(key, enText, trText, element) {
        // Store in pending changes
        pendingChanges[key] = { en: enText, tr: trText };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingChanges));

        // Update the displayed text based on current language
        const currentLang = document.documentElement.lang || 'en';
        element.textContent = currentLang === 'en' ? enText : trText;

        // Re-add edit button (since we replaced textContent)
        const btn = document.createElement('button');
        btn.className = 'admin-edit-btn';
        btn.innerHTML = '✏️';
        btn.title = 'Edit this text';
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openEditModal(key, element);
        });
        element.insertAdjacentElement('afterend', btn);

        // Mark as changed
        element.classList.add('admin-changed');

        // Update status
        updateStatus();
    }

    function applyPendingChanges() {
        const currentLang = document.documentElement.lang || 'en';

        Object.keys(pendingChanges).forEach(key => {
            const change = pendingChanges[key];
            const element = document.querySelector(`[data-i18n="${key}"]`);

            if (element && change[currentLang]) {
                element.textContent = change[currentLang];
                element.classList.add('admin-changed');
            }
        });
    }

    function updateStatus() {
        const count = Object.keys(pendingChanges).length;
        const statusEl = document.getElementById('adminStatus');
        const exportBtn = document.getElementById('adminExport');

        if (count > 0) {
            statusEl.textContent = `${count} pending change${count > 1 ? 's' : ''}`;
            statusEl.classList.add('has-changes');
            exportBtn.disabled = false;
        } else {
            statusEl.textContent = 'No pending changes';
            statusEl.classList.remove('has-changes');
            exportBtn.disabled = true;
        }
    }

    function showInstructions() {
        const overlay = document.createElement('div');
        overlay.className = 'admin-modal-overlay';
        overlay.innerHTML = `
            <div class="admin-modal">
                <div class="admin-modal-header">
                    <div class="admin-modal-title">📖 How to Deploy Your Changes</div>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-instructions">
                    <h3>📝 Making Edits</h3>
                    <ol>
                        <li>Click the <strong>✏️ edit button</strong> next to any text you want to change</li>
                        <li>Edit both <strong>English</strong> and <strong>Turkish</strong> versions in the popup</li>
                        <li>Click <strong>"Save Changes"</strong> — your edits are saved locally</li>
                        <li>Repeat for all text you want to update</li>
                    </ol>
                    <p class="step-note">💡 Your changes are saved in your browser and will persist until you export them.</p>
                    
                    <hr>
                    
                    <h3>📥 Exporting & Deploying</h3>
                    <ol>
                        <li>When you're done editing, click <strong>"Export Changes"</strong> in the toolbar</li>
                        <li>A file called <code>script.js</code> will download to your computer</li>
                        <li>Open your website folder: <code>C:\\Users\\ianze\\IMG_Website</code></li>
                        <li><strong>Replace</strong> the existing <code>script.js</code> with the downloaded file</li>
                        <li>Open <strong>GitHub Desktop</strong> (or your Git tool)</li>
                        <li>You'll see the changes — add a commit message like <em>"Updated website text"</em></li>
                        <li>Click <strong>"Commit"</strong> then <strong>"Push"</strong></li>
                        <li>Wait 1-2 minutes — Vercel will auto-deploy your changes!</li>
                    </ol>
                    
                    <div class="quick-tip">
                        <h4>✅ Quick Checklist</h4>
                        <p>Download → Replace script.js → Git Commit → Push → Done!</p>
                    </div>
                    
                    <hr>
                    
                    <h3>🔄 Starting Fresh</h3>
                    <p>To clear all pending changes and start over, click the button below:</p>
                    <button class="admin-btn" id="clearChanges" style="margin-top: 12px; background: #dc2626; color: #fff;">🗑️ Clear All Pending Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event listeners
        overlay.querySelector('.admin-modal-close').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        overlay.querySelector('#clearChanges').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all pending changes? This cannot be undone.')) {
                pendingChanges = {};
                localStorage.removeItem(STORAGE_KEY);
                location.reload();
            }
        });
    }

    function exportChanges() {
        if (Object.keys(pendingChanges).length === 0) {
            alert('No changes to export!');
            return;
        }

        // Fetch the current script.js
        fetch('script.js')
            .then(response => response.text())
            .then(scriptContent => {
                // Apply changes to the script content
                let updatedScript = scriptContent;

                Object.keys(pendingChanges).forEach(key => {
                    const change = pendingChanges[key];

                    // Update English
                    if (change.en) {
                        const enPattern = new RegExp(`('${escapeRegex(key)}':\\s*')([^']*)(')`, 'g');
                        const enPatternDouble = new RegExp(`("${escapeRegex(key)}":\\s*")([^"]*)(")`, 'g');
                        const escapedEnValue = change.en.replace(/'/g, "\\'").replace(/\n/g, '\\n');

                        updatedScript = updatedScript.replace(enPattern, `$1${escapedEnValue}$3`);
                        updatedScript = updatedScript.replace(enPatternDouble, `$1${escapedEnValue}$3`);
                    }

                    // Update Turkish
                    if (change.tr) {
                        const trPattern = new RegExp(`('${escapeRegex(key)}':\\s*')([^']*)(')`, 'g');
                        const trPatternDouble = new RegExp(`("${escapeRegex(key)}":\\s*")([^"]*)(")`, 'g');
                        const escapedTrValue = change.tr.replace(/'/g, "\\'").replace(/\n/g, '\\n');

                        updatedScript = updatedScript.replace(trPattern, `$1${escapedTrValue}$3`);
                        updatedScript = updatedScript.replace(trPatternDouble, `$1${escapedTrValue}$3`);
                    }
                });

                // Download the updated script
                downloadFile('script.js', updatedScript);

                // Show success message
                alert('✅ script.js downloaded!\n\nNext steps:\n1. Replace the script.js in your website folder\n2. Commit and push to GitHub\n3. Wait for Vercel to deploy (1-2 mins)');
            })
            .catch(error => {
                console.error('Error exporting:', error);
                alert('Error exporting changes. Please try again.');
            });
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exitEditMode() {
        const count = Object.keys(pendingChanges).length;

        if (count > 0) {
            if (!confirm(`You have ${count} pending change(s) that haven't been exported.\n\nAre you sure you want to exit? Your changes will be saved and you can export them later.`)) {
                return;
            }
        }

        // Remove edit parameter from URL and reload
        const url = new URL(window.location);
        url.searchParams.delete('edit');
        window.location.href = url.toString();
    }

    // Utility functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

})();
