// ===================================
// IM Global - Partner Portal Auth
// ===================================

(function () {
    'use strict';

    const DEFAULT_PASSWORD = 'globalinc';
    const STORAGE_KEY = 'imglobal-partner-password';
    const SESSION_KEY = 'imglobal-partner-authed';

    const gate = document.getElementById('partnerGate');
    const content = document.getElementById('partnerContent');
    const passwordInput = document.getElementById('partnerPassword');
    const submitBtn = document.getElementById('partnerSubmit');
    const errorMsg = document.getElementById('partnerError');

    function getPassword() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_PASSWORD;
    }

    function isAuthenticated() {
        return sessionStorage.getItem(SESSION_KEY) === 'true';
    }

    function grantAccess() {
        sessionStorage.setItem(SESSION_KEY, 'true');
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

        if (entered === getPassword()) {
            grantAccess();
        } else {
            showError();
        }
    }

    // Check if already authenticated this session
    if (isAuthenticated()) {
        grantAccess();
    } else {
        // Focus password input on page load
        setTimeout(function () {
            passwordInput.focus();
        }, 700); // After the gate slide-in animation

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
    }
})();
