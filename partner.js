// ===================================
// IM Global - Partner Portal Auth
// ===================================

(function () {
    'use strict';

    // ── Password is set here ──────────────────────────────
    // Change this value to update the partner portal password.
    // It can also be changed from the admin edit page which
    // will export an updated partner.js file.
    var PARTNER_PASSWORD = 'globalinc';
    // ──────────────────────────────────────────────────────

    var gate = document.getElementById('partnerGate');
    var content = document.getElementById('partnerContent');
    var passwordInput = document.getElementById('partnerPassword');
    var submitBtn = document.getElementById('partnerSubmit');
    var errorMsg = document.getElementById('partnerError');

    // If elements aren't on this page, exit early
    if (!gate || !passwordInput) return;

    function grantAccess() {
        gate.classList.add('hidden');
        content.classList.add('visible');
        // Remove gate from DOM after fade-out transition
        setTimeout(function () {
            gate.style.display = 'none';
        }, 600);
    }

    function showError() {
        errorMsg.classList.add('visible');
        passwordInput.classList.add('shake');
        passwordInput.value = '';
        passwordInput.focus();
        // Remove shake class after animation completes
        setTimeout(function () {
            passwordInput.classList.remove('shake');
        }, 500);
    }

    function attemptLogin() {
        var entered = passwordInput.value.trim();
        if (!entered) return;

        if (entered === PARTNER_PASSWORD) {
            grantAccess();
        } else {
            showError();
        }
    }

    // Focus password input on page load
    setTimeout(function () {
        passwordInput.focus();
    }, 700);

    // Submit on button click
    submitBtn.addEventListener('click', attemptLogin);

    // Submit on Enter key
    passwordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            attemptLogin();
        }
    });

    // Clear error on typing
    passwordInput.addEventListener('input', function () {
        errorMsg.classList.remove('visible');
    });
})();
