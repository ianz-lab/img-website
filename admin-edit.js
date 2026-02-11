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
            <button class="admin-toolbar-toggle" id="adminToggle" title="Collapse toolbar">&#9650;</button>
            <div class="admin-toolbar-content">
                <div class="admin-toolbar-left">
                    <span class="admin-toolbar-title">Edit Mode</span>
                    <span class="admin-toolbar-status" id="adminStatus">No pending changes</span>
                </div>
                <div class="admin-toolbar-right">
                    <button class="admin-btn admin-btn-instructions" id="adminInstructions">&#128214; How to Deploy</button>
                    <button class="admin-btn admin-btn-export" id="adminExport" disabled>&#128229; Export Changes</button>
                    <button class="admin-btn admin-btn-exit" id="adminExit">&#10005; Exit Edit Mode</button>
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
            this.textContent = toolbar.classList.contains('collapsed') ? '\u25BC' : '\u25B2';
            this.title = toolbar.classList.contains('collapsed') ? 'Expand toolbar' : 'Collapse toolbar';
            document.body.classList.toggle('admin-mode-collapsed', toolbar.classList.contains('collapsed'));
        });
    }

    // ============================================================
    // Helper: check if a key should use innerHTML (contains HTML)
    // Matches the same logic used in script.js applyTranslations()
    // ============================================================
    function keyUsesHTML(key) {
        return key.includes('Item');
    }

    // ============================================================
    // Helper: set element text respecting HTML vs plain text keys
    // ============================================================
    function setElementText(el, key, text) {
        if (keyUsesHTML(key)) {
            el.innerHTML = text;
        } else {
            el.textContent = text;
        }
    }

    function addEditButtons() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');

            // Skip if already has an edit button
            if (el.querySelector('.admin-edit-btn')) return;
            if (el.nextElementSibling && el.nextElementSibling.classList.contains('admin-edit-btn')) return;

            // Wrap the element + button in an inline wrapper to avoid
            // injecting extra children into flex/grid containers
            const wrapper = document.createElement('span');
            wrapper.className = 'admin-edit-wrapper';
            wrapper.style.cssText = 'position:relative;display:inline;';

            // Create edit button
            const btn = document.createElement('button');
            btn.className = 'admin-edit-btn';
            btn.innerHTML = '&#9999;&#65039;';
            btn.title = 'Edit: ' + key;
            btn.setAttribute('data-edit-key', key);

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openEditModal(key, el);
            });

            // Insert the wrapper around the element, then append button
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            wrapper.appendChild(btn);

            // Mark if has pending changes
            if (pendingChanges[key]) {
                el.classList.add('admin-changed');
            }
        });
    }

    // ============================================================
    // Brace-counting parser to extract EN and TR sections from
    // script.js. This replaces the fragile regex approach.
    // ============================================================

    /**
     * Find the matching closing brace for an opening brace at `startIdx`.
     * Handles nested braces and skips content inside single-quoted strings.
     * Returns the index of the matching `}`.
     */
    function findMatchingBrace(text, startIdx) {
        var depth = 0;
        var inString = false;
        var escaped = false;

        for (var i = startIdx; i < text.length; i++) {
            var ch = text[i];

            if (escaped) {
                escaped = false;
                continue;
            }

            if (ch === '\\') {
                if (inString) {
                    escaped = true;
                }
                continue;
            }

            if (ch === "'") {
                inString = !inString;
                continue;
            }

            if (inString) continue;

            if (ch === '{') {
                depth++;
            } else if (ch === '}') {
                depth--;
                if (depth === 0) {
                    return i;
                }
            }
        }
        return -1; // no match found
    }

    /**
     * Parse the translations object in script.js and return the positions
     * of the EN and TR sections.
     *
     * Returns an object with:
     *   beforeEn: everything up to and including "en: {"
     *   enBlock:  the contents inside en: { ... }
     *   middle:   everything from the closing "}" of en to and including "tr: {"
     *   trBlock:  the contents inside tr: { ... }
     *   closing:  the closing "}  };" of the translations object
     *   afterAll: everything after the translations object
     *
     * Returns null if parsing fails.
     */
    function parseTranslationSections(scriptContent) {
        // Find "translations = {" or "translations={" etc.
        var translationsStart = scriptContent.search(/translations\s*=\s*\{/);
        if (translationsStart === -1) return null;

        // Find the opening brace of the translations object
        var translationsOpenBrace = scriptContent.indexOf('{', translationsStart);
        if (translationsOpenBrace === -1) return null;

        // Find "en:" inside the translations object
        var enKeyMatch = scriptContent.substring(translationsOpenBrace).match(/\ben\s*:\s*\{/);
        if (!enKeyMatch) return null;

        var enOpenBraceRelative = scriptContent.substring(translationsOpenBrace).indexOf('{', enKeyMatch.index);
        var enOpenBrace = translationsOpenBrace + enOpenBraceRelative;

        // Use brace counting to find the end of the EN block
        var enCloseBrace = findMatchingBrace(scriptContent, enOpenBrace);
        if (enCloseBrace === -1) return null;

        // Find "tr:" after the EN block
        var afterEn = scriptContent.substring(enCloseBrace);
        var trKeyMatch = afterEn.match(/\btr\s*:\s*\{/);
        if (!trKeyMatch) return null;

        var trOpenBraceRelative = afterEn.indexOf('{', trKeyMatch.index);
        var trOpenBrace = enCloseBrace + trOpenBraceRelative;

        // Use brace counting to find the end of the TR block
        var trCloseBrace = findMatchingBrace(scriptContent, trOpenBrace);
        if (trCloseBrace === -1) return null;

        // Find the closing of the translations object "};"
        var afterTr = scriptContent.substring(trCloseBrace + 1);
        var closingMatch = afterTr.match(/\}\s*;/);
        if (!closingMatch) return null;

        var closingEndIdx = trCloseBrace + 1 + closingMatch.index + closingMatch[0].length;

        return {
            beforeEn: scriptContent.substring(0, enOpenBrace + 1),
            enBlock: scriptContent.substring(enOpenBrace + 1, enCloseBrace),
            middle: scriptContent.substring(enCloseBrace, trOpenBrace + 1),
            trBlock: scriptContent.substring(trOpenBrace + 1, trCloseBrace),
            closing: scriptContent.substring(trCloseBrace, closingEndIdx),
            afterAll: scriptContent.substring(closingEndIdx)
        };
    }

    // ============================================================
    // Escape / Unescape helpers — symmetric roundtrip
    // ============================================================

    /**
     * Walk through a string starting at `startIdx` to find the end of
     * a single-quoted value, handling escaped characters.
     * Returns the raw content between the quotes and the index of
     * the closing quote.
     */
    function extractQuotedValue(text, startIdx) {
        var end = startIdx;
        var esc = false;
        for (var i = startIdx; i < text.length; i++) {
            if (esc) { esc = false; continue; }
            if (text[i] === '\\') { esc = true; continue; }
            if (text[i] === "'") { end = i; break; }
        }
        // Unescape: \' -> ', \\ -> \, \n -> newline
        var raw = text.substring(startIdx, end);
        var unescaped = '';
        for (var j = 0; j < raw.length; j++) {
            if (raw[j] === '\\' && j + 1 < raw.length) {
                var next = raw[j + 1];
                if (next === "'") { unescaped += "'"; j++; }
                else if (next === '\\') { unescaped += '\\'; j++; }
                else if (next === 'n') { unescaped += '\n'; j++; }
                else { unescaped += raw[j]; } // keep unknown escapes as-is
            } else {
                unescaped += raw[j];
            }
        }
        return {
            value: unescaped,
            endIdx: end
        };
    }

    /**
     * Escape a string for insertion into a single-quoted JS string literal.
     * This is the inverse of what extractQuotedValue does.
     */
    function escapeForJS(str) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            var ch = str[i];
            if (ch === '\\') { result += '\\\\'; }
            else if (ch === "'") { result += "\\'"; }
            else if (ch === '\n') { result += '\\n'; }
            else { result += ch; }
        }
        return result;
    }

    // Helper: extract a translation value for a key from a section of script.js
    function extractValueFromSection(section, key) {
        var keyPattern = new RegExp("['\"]" + escapeRegex(key) + "['\"]:\\s*'");
        var keyMatch = section.match(keyPattern);
        if (keyMatch) {
            var startIdx = section.indexOf(keyMatch[0]) + keyMatch[0].length;
            return extractQuotedValue(section, startIdx).value;
        }
        return '';
    }

    function openEditModal(key, element) {
        let enValue = '';
        let trValue = '';

        const scriptEl = document.querySelector('script[src="script.js"]');
        if (scriptEl) {
            fetch('script.js?t=' + Date.now())
                .then(response => response.text())
                .then(scriptContent => {
                    // Use brace-counting parser instead of regex
                    var sections = parseTranslationSections(scriptContent);

                    if (sections) {
                        enValue = extractValueFromSection(sections.enBlock, key);
                        trValue = extractValueFromSection(sections.trBlock, key);
                    }

                    // Override with pending changes if they exist
                    var savedChange = pendingChanges[key] || {};
                    if (savedChange.en !== undefined) enValue = savedChange.en;
                    if (savedChange.tr !== undefined) trValue = savedChange.tr;

                    // Now show the modal with both values
                    showEditModalUI(key, element, enValue, trValue);
                })
                .catch(err => {
                    console.error('Error loading translations:', err);
                    var currentLang = document.documentElement.lang || 'en';
                    var currentText = element.textContent.replace(/\u270F\uFE0F/g, '').trim();
                    var savedChange = pendingChanges[key] || {};
                    enValue = (savedChange.en !== undefined) ? savedChange.en : (currentLang === 'en' ? currentText : '');
                    trValue = (savedChange.tr !== undefined) ? savedChange.tr : (currentLang === 'tr' ? currentText : '');
                    showEditModalUI(key, element, enValue, trValue);
                });
        } else {
            var currentLang = document.documentElement.lang || 'en';
            var currentText = element.textContent.replace(/\u270F\uFE0F/g, '').trim();
            var savedChange = pendingChanges[key] || {};
            enValue = (savedChange.en !== undefined) ? savedChange.en : (currentLang === 'en' ? currentText : '');
            trValue = (savedChange.tr !== undefined) ? savedChange.tr : (currentLang === 'tr' ? currentText : '');
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
                            <span class="admin-field-flag">&#127482;&#127480;</span> English
                        </label>
                        <textarea class="admin-field-input" id="editEnglish" placeholder="Enter English text..."></textarea>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">
                            <span class="admin-field-flag">&#127481;&#127479;</span> T&uuml;rk&ccedil;e
                        </label>
                        <textarea class="admin-field-input" id="editTurkish" placeholder="T&uuml;rk&ccedil;e metni girin..."></textarea>
                    </div>
                </div>
                <div class="admin-modal-footer">
                    <button class="admin-modal-btn admin-modal-btn-cancel">Cancel</button>
                    <button class="admin-modal-btn admin-modal-btn-save">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Set textarea values via DOM property — NOT innerHTML/template string.
        // This avoids double-encoding HTML entities and ensures raw HTML tags
        // like <strong> and special characters display correctly.
        var enTextarea = overlay.querySelector('#editEnglish');
        var trTextarea = overlay.querySelector('#editTurkish');
        enTextarea.value = enValue;
        trTextarea.value = trValue;

        // Focus first field
        setTimeout(() => {
            enTextarea.focus();
        }, 100);

        // Shared cleanup function to remove overlay + listeners
        function closeModal() {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }

        // Event listeners
        overlay.querySelector('.admin-modal-close').addEventListener('click', closeModal);

        overlay.querySelector('.admin-modal-btn-cancel').addEventListener('click', closeModal);

        overlay.querySelector('.admin-modal-btn-save').addEventListener('click', () => {
            const enText = enTextarea.value;
            const trText = trTextarea.value;

            saveChange(key, enText, trText, element);
            closeModal();
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Close on Escape key — single handler, always cleaned up
        function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }
        document.addEventListener('keydown', escHandler);
    }

    function saveChange(key, enText, trText, element) {
        // Store in pending changes
        pendingChanges[key] = { en: enText, tr: trText };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingChanges));

        // Update the displayed text based on current language
        var currentLang = document.documentElement.lang || 'en';
        setElementText(element, key, currentLang === 'en' ? enText : trText);

        // Also update ALL other elements with the same key (e.g. readMore, nav links in footer)
        document.querySelectorAll('[data-i18n="' + key + '"]').forEach(function (el) {
            if (el !== element) {
                setElementText(el, key, currentLang === 'en' ? enText : trText);
                el.classList.add('admin-changed');
            }
        });

        // Mark as changed
        element.classList.add('admin-changed');

        // Update status
        updateStatus();
    }

    function applyPendingChanges() {
        const currentLang = document.documentElement.lang || 'en';

        Object.keys(pendingChanges).forEach(key => {
            const change = pendingChanges[key];
            // Use querySelectorAll to update ALL elements with this key
            // (e.g., nav links duplicated in footer, common.readMore on multiple buttons)
            const elements = document.querySelectorAll('[data-i18n="' + key + '"]');

            elements.forEach(function (element) {
                if (change[currentLang]) {
                    setElementText(element, key, change[currentLang]);
                    element.classList.add('admin-changed');
                }
            });
        });
    }

    function updateStatus() {
        const count = Object.keys(pendingChanges).length;
        const statusEl = document.getElementById('adminStatus');
        const exportBtn = document.getElementById('adminExport');

        if (count > 0) {
            statusEl.textContent = count + ' pending change' + (count > 1 ? 's' : '');
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
                    <div class="admin-modal-title">&#128214; How to Deploy Your Changes</div>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-instructions">
                    <h3>&#128221; Making Edits</h3>
                    <ol>
                        <li>Click the <strong>&#9999;&#65039; edit button</strong> next to any text you want to change</li>
                        <li>Edit both <strong>English</strong> and <strong>Turkish</strong> versions in the popup</li>
                        <li>Click <strong>"Save Changes"</strong> &mdash; your edits are saved locally</li>
                        <li>Repeat for all text you want to update</li>
                    </ol>
                    <p class="step-note">&#128161; Your changes are saved in your browser and will persist until you export them.</p>
                    
                    <hr>
                    
                    <h3>&#128229; Exporting &amp; Deploying</h3>
                    <ol>
                        <li>When you're done editing, click <strong>"Export Changes"</strong> in the toolbar</li>
                        <li>A file called <code>script.js</code> will download to your computer</li>
                        <li>Open your website folder: <code>C:\\Users\\ianze\\IMG_Website</code></li>
                        <li><strong>Replace</strong> the existing <code>script.js</code> with the downloaded file</li>
                        <li>Open <strong>GitHub Desktop</strong> (or your Git tool)</li>
                        <li>You'll see the changes &mdash; add a commit message like <em>"Updated website text"</em></li>
                        <li>Click <strong>"Commit"</strong> then <strong>"Push"</strong></li>
                        <li>Wait 1-2 minutes &mdash; Vercel will auto-deploy your changes!</li>
                    </ol>
                    
                    <div class="quick-tip">
                        <h4>&#9989; Quick Checklist</h4>
                        <p>Download &rarr; Replace script.js &rarr; Git Commit &rarr; Push &rarr; Done!</p>
                    </div>
                    
                    <hr>
                    
                    <h3>&#128260; Starting Fresh</h3>
                    <p>To clear all pending changes and start over, click the button below:</p>
                    <button class="admin-btn" id="clearChanges" style="margin-top: 12px; background: #dc2626; color: #fff;">&#128465;&#65039; Clear All Pending Changes</button>
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

    // ============================================================
    // EXPORT FUNCTION - uses brace-counting parser for reliability
    // ============================================================
    function exportChanges() {
        if (Object.keys(pendingChanges).length === 0) {
            alert('No changes to export!');
            return;
        }

        // Log what we're about to export
        console.log('[Admin Export] Pending changes to export:', JSON.stringify(pendingChanges, null, 2));

        fetch('script.js?t=' + Date.now())
            .then(function (response) { return response.text(); })
            .then(function (scriptContent) {
                console.log('[Admin Export] Fetched script.js, length:', scriptContent.length);

                // Use brace-counting parser instead of fragile regex
                var sections = parseTranslationSections(scriptContent);

                if (!sections) {
                    alert('Error: Could not parse translations structure in script.js');
                    return;
                }

                console.log('[Admin Export] Parsed sections successfully. EN block length:', sections.enBlock.length, 'TR block length:', sections.trBlock.length);

                var enBlock = sections.enBlock;
                var trBlock = sections.trBlock;

                // Replace a key's value within a specific section block
                var missingKeys = [];
                var appliedChanges = [];
                function replaceKeyInBlock(block, key, newValue, langLabel) {
                    var escaped = escapeForJS(newValue);
                    var k = escapeRegex(key);
                    var keyRegex = new RegExp("['\"]" + k + "['\"]:\\s*'");
                    var m = block.match(keyRegex);
                    if (!m) {
                        missingKeys.push(langLabel + ': ' + key);
                        console.warn('[Admin Export] Key NOT FOUND in ' + langLabel + ' block:', key);
                        return block;
                    }

                    var start = block.indexOf(m[0]) + m[0].length;
                    // Use the same brace-aware string walker to find end of value
                    var end = start;
                    var esc = false;
                    for (var i = start; i < block.length; i++) {
                        if (esc) { esc = false; continue; }
                        if (block[i] === '\\') { esc = true; continue; }
                        if (block[i] === "'") { end = i; break; }
                    }

                    var oldValue = block.substring(start, end);
                    if (oldValue === escaped) {
                        console.log('[Admin Export] ' + langLabel + ' "' + key + '": value unchanged (identical to source)');
                    } else {
                        console.log('[Admin Export] ' + langLabel + ' "' + key + '": CHANGED');
                        console.log('  Old:', oldValue.substring(0, 80) + (oldValue.length > 80 ? '...' : ''));
                        console.log('  New:', escaped.substring(0, 80) + (escaped.length > 80 ? '...' : ''));
                        appliedChanges.push(langLabel + ': ' + key);
                    }

                    return block.substring(0, start) + escaped + block.substring(end);
                }

                // Apply each pending change to the correct section
                var keys = Object.keys(pendingChanges);
                for (var idx = 0; idx < keys.length; idx++) {
                    var key = keys[idx];
                    var change = pendingChanges[key];
                    if (change.en !== undefined) {
                        enBlock = replaceKeyInBlock(enBlock, key, change.en, 'EN');
                    }
                    if (change.tr !== undefined) {
                        trBlock = replaceKeyInBlock(trBlock, key, change.tr, 'TR');
                    }
                }

                // Reassemble the full script
                var updatedScript = sections.beforeEn + enBlock + sections.middle + trBlock + sections.closing + sections.afterAll;

                // Log whether file actually changed
                if (updatedScript === scriptContent) {
                    console.log('[Admin Export] Note: exported file is identical to source (changes already in file).');
                } else {
                    console.log('[Admin Export] Export complete. ' + appliedChanges.length + ' actual change(s) applied.');
                }

                // Always download the file
                downloadFile('script.js', updatedScript);

                // Clear pending changes after successful export
                pendingChanges = {};
                localStorage.removeItem(STORAGE_KEY);
                updateStatus();

                // Remove changed highlights from elements
                document.querySelectorAll('.admin-changed').forEach(function (el) {
                    el.classList.remove('admin-changed');
                });

                var msg = '✅ script.js exported and downloaded!\n\n';
                if (appliedChanges.length > 0) {
                    msg += appliedChanges.length + ' text change(s) applied:\n' + appliedChanges.join('\n') + '\n\n';
                } else {
                    msg += 'Your pending edits matched what was already in the file (possibly from a previous export).\nThe file has been downloaded — your pending changes have been cleared.\n\n';
                }
                msg += 'Next steps:\n1. Replace the script.js in your website folder\n2. Commit and push to GitHub\n3. Wait for Vercel to deploy (1-2 mins)';
                if (missingKeys.length > 0) {
                    msg += '\n\n⚠️ Warning: The following keys were not found:\n' + missingKeys.join('\n');
                }
                alert(msg);
            })
            .catch(function (error) {
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
            if (!confirm('You have ' + count + ' pending change(s) that haven\'t been exported.\n\nAre you sure you want to exit? Your changes will be saved and you can export them later.')) {
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
