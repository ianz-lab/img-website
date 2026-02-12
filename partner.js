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
        // Initialize calculator after access is granted
        setTimeout(function () {
            if (typeof initCalculator === 'function') initCalculator();
        }, 100);
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


// ===================================
// IM Global - Investment Calculator
// ===================================

function initCalculator() {
    'use strict';

    // ── DOM Element References ──
    var chart = null;

    // Input elements
    var elPurchasePrice = document.getElementById('purchasePrice');
    var elMonthlyRent = document.getElementById('monthlyRent');
    var elDownPaymentPct = document.getElementById('downPaymentPct');
    var elInterestRate = document.getElementById('interestRate');
    var elOpexPct = document.getElementById('opexPct');
    var elAppreciationRate = document.getElementById('appreciationRate');
    var elRentGrowth = document.getElementById('rentGrowth');
    var elLoanTerm = document.getElementById('loanTerm');
    var elSellingCost = document.getElementById('sellingCost');

    // Slider elements
    var elDownPaymentSlider = document.getElementById('downPaymentSlider');
    var elInterestSlider = document.getElementById('interestSlider');
    var elOpexSlider = document.getElementById('opexSlider');
    var elAppreciationSlider = document.getElementById('appreciationSlider');
    var elRentGrowthSlider = document.getElementById('rentGrowthSlider');
    var elLoanTermSlider = document.getElementById('loanTermSlider');
    var elSellingCostSlider = document.getElementById('sellingCostSlider');

    // Highlight card elements
    var elCapRate = document.getElementById('hlCapRate');
    var elCashOnCash = document.getElementById('hlCashOnCash');
    var elIRR = document.getElementById('hlIRR');
    var elNOI = document.getElementById('hlNOI');
    var elDSCR = document.getElementById('hlDSCR');
    var elEquityMultiple = document.getElementById('hlEquityMultiple');

    // Toggle elements
    var elAdvancedToggle = document.getElementById('advancedToggle');
    var elToggleSwitch = document.getElementById('toggleSwitch');
    var elCalcInputs = document.getElementById('calcInputs');
    var elTableToggle = document.getElementById('tableToggle');
    var elTableToggleText = document.getElementById('tableToggleText');
    var elTableContainer = document.getElementById('tableContainer');
    var elTableBody = document.getElementById('projectionTableBody');

    // ────────────────────────────────────────────────────────
    // Formatting Helpers
    // ────────────────────────────────────────────────────────

    function formatCurrency(n) {
        if (n == null || isNaN(n)) return '—';
        var neg = n < 0;
        var abs = Math.abs(Math.round(n));
        var str = abs.toLocaleString('en-US');
        return (neg ? '-$' : '$') + str;
    }

    function formatCurrencyShort(n) {
        if (n == null || isNaN(n)) return '—';
        var neg = n < 0;
        var abs = Math.abs(n);
        if (abs >= 1000000) {
            return (neg ? '-$' : '$') + (abs / 1000000).toFixed(2) + 'M';
        } else if (abs >= 1000) {
            return (neg ? '-$' : '$') + (abs / 1000).toFixed(0) + 'K';
        }
        return formatCurrency(n);
    }

    function formatPercent(n, decimals) {
        if (n == null || isNaN(n)) return '—';
        decimals = decimals !== undefined ? decimals : 2;
        return (n * 100).toFixed(decimals) + '%';
    }

    function parseNumber(str) {
        if (typeof str === 'number') return str;
        return parseFloat(String(str).replace(/[^0-9.\-]/g, '')) || 0;
    }

    function formatInputCurrency(n) {
        return Math.round(n).toLocaleString('en-US');
    }

    // ────────────────────────────────────────────────────────
    // Core Calculation Functions
    // ────────────────────────────────────────────────────────

    function calcMonthlyPayment(principal, annualRate, years) {
        if (principal <= 0 || years <= 0) return 0;
        if (annualRate <= 0) return principal / (years * 12);
        var r = annualRate / 12;
        var n = years * 12;
        return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    function calcNPV(rate, cashFlows) {
        var npv = 0;
        for (var i = 0; i < cashFlows.length; i++) {
            npv += cashFlows[i] / Math.pow(1 + rate, i);
        }
        return npv;
    }

    function calcIRR(cashFlows, guess) {
        if (!cashFlows || cashFlows.length < 2) return NaN;
        guess = guess || 0.1;
        var maxIter = 100;
        var tolerance = 1e-7;
        var rate = guess;

        for (var i = 0; i < maxIter; i++) {
            var npv = 0;
            var dnpv = 0;
            for (var j = 0; j < cashFlows.length; j++) {
                var factor = Math.pow(1 + rate, j);
                npv += cashFlows[j] / factor;
                if (j > 0) {
                    dnpv -= j * cashFlows[j] / Math.pow(1 + rate, j + 1);
                }
            }
            if (Math.abs(dnpv) < 1e-14) break;
            var newRate = rate - npv / dnpv;
            if (Math.abs(newRate - rate) < tolerance) return newRate;
            rate = newRate;
        }
        return rate;
    }

    // ────────────────────────────────────────────────────────
    // Main Investment Calculation
    // ────────────────────────────────────────────────────────

    function calculateInvestment(inputs) {
        var purchasePrice = inputs.purchasePrice;
        var monthlyRent = inputs.monthlyRent;
        var downPaymentPct = inputs.downPaymentPct / 100;
        var interestRate = inputs.interestRate / 100;
        var opexPct = inputs.opexPct / 100;
        var appreciationRate = inputs.appreciationRate / 100;
        var rentGrowth = inputs.rentGrowth / 100;
        var loanTermYears = inputs.loanTerm;
        var sellingCostPct = inputs.sellingCost / 100;
        var vacancyRate = 0.05; // 5% vacancy

        // ── Derived initial metrics ──
        var grossAnnualRent = monthlyRent * 12;
        var egi = grossAnnualRent * (1 - vacancyRate);
        var opexAnnual = egi * opexPct;
        var noiAnnual = egi - opexAnnual;

        var downPayment = purchasePrice * downPaymentPct;
        var amountFinanced = purchasePrice - downPayment;
        var monthlyPayment = calcMonthlyPayment(amountFinanced, interestRate, loanTermYears);
        var annualDebtService = monthlyPayment * 12;

        var annualCashFlow = noiAnnual - annualDebtService;
        var capRate = purchasePrice > 0 ? noiAnnual / purchasePrice : 0;
        var cashOnCash = downPayment > 0 ? annualCashFlow / downPayment : 0;
        var dscr = annualDebtService > 0 ? noiAnnual / annualDebtService : Infinity;
        var grm = monthlyRent > 0 ? purchasePrice / grossAnnualRent : 0;

        // ── 30-Year Projection ──
        var years = [];
        var remainingDebt = amountFinanced;
        var cumulativeCashFlow = 0;
        var currentRent = monthlyRent;
        var monthlyRate = interestRate / 12;

        for (var yr = 1; yr <= 30; yr++) {
            var appreciatedValue = purchasePrice * Math.pow(1 + appreciationRate, yr);
            var annualAppreciation = appreciatedValue - purchasePrice * Math.pow(1 + appreciationRate, yr - 1);

            // Rent grows each year
            if (yr > 1) {
                currentRent = currentRent * (1 + rentGrowth);
            }
            var yrGrossRent = currentRent * 12;
            var yrEGI = yrGrossRent * (1 - vacancyRate);
            var yrOpex = yrEGI * opexPct;
            var yrNOI = yrEGI - yrOpex;

            // Debt paydown for this year
            var debtPaydown = 0;
            var debtAtStartOfYear = remainingDebt;
            if (remainingDebt > 0 && yr <= loanTermYears) {
                for (var m = 0; m < 12; m++) {
                    if (remainingDebt <= 0) break;
                    var interestPayment = remainingDebt * monthlyRate;
                    var principalPayment = monthlyPayment - interestPayment;
                    if (principalPayment > remainingDebt) principalPayment = remainingDebt;
                    remainingDebt -= principalPayment;
                    debtPaydown += principalPayment;
                }
            } else if (yr > loanTermYears) {
                remainingDebt = 0;
            }

            var yrAnnualDebtService = yr <= loanTermYears ? annualDebtService : 0;
            var yrCashFlow = yrNOI - yrAnnualDebtService;
            cumulativeCashFlow += yrCashFlow;

            var equity = appreciatedValue - remainingDebt;
            var netSaleProceeds = appreciatedValue * (1 - sellingCostPct) - remainingDebt;
            var totalProfit = netSaleProceeds + cumulativeCashFlow - downPayment;

            var cashYield = downPayment > 0 ? cumulativeCashFlow / downPayment : 0;
            var leveragedROI = downPayment > 0 ? (equity + cumulativeCashFlow) / downPayment : 0;

            // IRR for this year: initial outflow = -downPayment, intermediate cash flows, terminal = cashflow + net sale proceeds
            var irrCashFlows = [-downPayment];
            var tempCumCF = 0;
            var tempRent2 = monthlyRent;
            var tempDebt2 = amountFinanced;
            for (var y2 = 1; y2 <= yr; y2++) {
                if (y2 > 1) tempRent2 = tempRent2 * (1 + rentGrowth);
                var t2EGI = tempRent2 * 12 * (1 - vacancyRate);
                var t2NOI = t2EGI * (1 - opexPct);
                var t2DS = y2 <= loanTermYears ? annualDebtService : 0;
                var t2CF = t2NOI - t2DS;

                // For debt remaining at end of year y2
                var t2Remaining = tempDebt2;
                if (y2 <= loanTermYears && t2Remaining > 0) {
                    for (var m2 = 0; m2 < 12; m2++) {
                        if (t2Remaining <= 0) break;
                        var t2Int = t2Remaining * monthlyRate;
                        var t2Princ = monthlyPayment - t2Int;
                        if (t2Princ > t2Remaining) t2Princ = t2Remaining;
                        t2Remaining -= t2Princ;
                    }
                } else if (y2 > loanTermYears) {
                    t2Remaining = 0;
                }
                tempDebt2 = t2Remaining;

                if (y2 < yr) {
                    irrCashFlows.push(t2CF);
                } else {
                    // Terminal year: cash flow + net sale proceeds
                    var t2AppVal = purchasePrice * Math.pow(1 + appreciationRate, y2);
                    var t2NSP = t2AppVal * (1 - sellingCostPct) - t2Remaining;
                    irrCashFlows.push(t2CF + t2NSP);
                }
            }
            var yrIRR = yr >= 1 ? calcIRR(irrCashFlows, 0.08) : 0;

            var equityMultiple = downPayment > 0 ? (cumulativeCashFlow + netSaleProceeds) / downPayment : 0;

            // NPV at 8% discount rate
            var yrNPV = calcNPV(0.08, irrCashFlows);

            years.push({
                year: yr,
                appreciatedValue: appreciatedValue,
                annualAppreciation: annualAppreciation,
                annualCashFlow: yrCashFlow,
                cumulativeCashFlow: cumulativeCashFlow,
                equity: equity,
                debtPaydown: debtPaydown,
                remainingDebt: remainingDebt,
                netSaleProceeds: netSaleProceeds,
                totalProfit: totalProfit,
                cashYield: cashYield,
                leveragedROI: leveragedROI,
                irr: yrIRR,
                equityMultiple: equityMultiple,
                npv: yrNPV,
                annualNOI: yrNOI
            });
        }

        return {
            // Summary metrics
            noiAnnual: noiAnnual,
            capRate: capRate,
            cashOnCash: cashOnCash,
            dscr: dscr,
            grm: grm,
            annualDebtService: annualDebtService,
            annualCashFlow: annualCashFlow,
            downPayment: downPayment,
            amountFinanced: amountFinanced,
            monthlyPayment: monthlyPayment,
            // Year projections
            years: years
        };
    }

    // ────────────────────────────────────────────────────────
    // Read Inputs
    // ────────────────────────────────────────────────────────

    function readInputs() {
        return {
            purchasePrice: parseNumber(elPurchasePrice.value),
            monthlyRent: parseNumber(elMonthlyRent.value),
            downPaymentPct: parseNumber(elDownPaymentPct.value),
            interestRate: parseNumber(elInterestRate.value),
            opexPct: parseNumber(elOpexPct.value),
            appreciationRate: parseNumber(elAppreciationRate.value),
            rentGrowth: parseNumber(elRentGrowth.value),
            loanTerm: parseNumber(elLoanTerm.value),
            sellingCost: parseNumber(elSellingCost.value)
        };
    }

    // ────────────────────────────────────────────────────────
    // Update Dashboard
    // ────────────────────────────────────────────────────────

    function updateHighlights(result) {
        elCapRate.textContent = formatPercent(result.capRate);
        elCashOnCash.textContent = formatPercent(result.cashOnCash);
        elNOI.textContent = formatCurrencyShort(result.noiAnnual);
        elDSCR.textContent = result.dscr === Infinity ? '∞' : result.dscr.toFixed(2) + 'x';

        // 10-year IRR and Equity Multiple
        if (result.years.length >= 10) {
            var yr10 = result.years[9];
            elIRR.textContent = isNaN(yr10.irr) ? '—' : formatPercent(yr10.irr);
            elEquityMultiple.textContent = isNaN(yr10.equityMultiple) ? '—' : yr10.equityMultiple.toFixed(2) + 'x';
        } else {
            elIRR.textContent = '—';
            elEquityMultiple.textContent = '—';
        }
    }

    // ────────────────────────────────────────────────────────
    // Chart Rendering
    // ────────────────────────────────────────────────────────

    function renderChart(result) {
        var ctx = document.getElementById('projectionChart');
        if (!ctx) return;

        var labels = result.years.map(function (y) { return 'Year ' + y.year; });
        var propertyValues = result.years.map(function (y) { return Math.round(y.appreciatedValue); });
        var equityValues = result.years.map(function (y) { return Math.round(y.equity); });
        var cashFlowValues = result.years.map(function (y) { return Math.round(y.cumulativeCashFlow); });

        var chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Property Value',
                    data: propertyValues,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.08)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#d4af37'
                },
                {
                    label: 'Total Equity',
                    data: equityValues,
                    borderColor: '#6ec5e9',
                    backgroundColor: 'rgba(110, 197, 233, 0.06)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#6ec5e9'
                },
                {
                    label: 'Cumulative Cash Flow',
                    data: cashFlowValues,
                    borderColor: '#8fd9a8',
                    backgroundColor: 'rgba(143, 217, 168, 0.06)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#8fd9a8'
                }
            ]
        };

        var chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(255,255,255,0.7)',
                        font: { family: 'Inter', size: 12 },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 28, 0.95)',
                    titleColor: '#d4af37',
                    bodyColor: 'rgba(255,255,255,0.85)',
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    borderWidth: 1,
                    padding: 14,
                    titleFont: { family: 'Inter', weight: '600', size: 13 },
                    bodyFont: { family: 'Inter', size: 12 },
                    cornerRadius: 10,
                    callbacks: {
                        label: function (ctx) {
                            return '  ' + ctx.dataset.label + ': ' + formatCurrency(ctx.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'rgba(255,255,255,0.4)',
                        font: { family: 'Inter', size: 11 },
                        maxTicksLimit: 10,
                        callback: function (val, index) {
                            return (index + 1) % 5 === 0 || index === 0 ? 'Yr ' + (index + 1) : '';
                        }
                    },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    ticks: {
                        color: 'rgba(255,255,255,0.4)',
                        font: { family: 'Inter', size: 11 },
                        callback: function (val) {
                            return formatCurrencyShort(val);
                        }
                    },
                    grid: { color: 'rgba(255,255,255,0.06)' }
                }
            }
        };

        if (chart) {
            chart.data = chartData;
            chart.options = chartOptions;
            chart.update('none');
        } else {
            chart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions
            });
        }
    }

    // ────────────────────────────────────────────────────────
    // Data Table Rendering
    // ────────────────────────────────────────────────────────

    function renderTable(result) {
        if (!elTableBody) return;
        var html = '';
        for (var i = 0; i < result.years.length; i++) {
            var y = result.years[i];
            html += '<tr>' +
                '<td>' + y.year + '</td>' +
                '<td>' + formatCurrency(y.appreciatedValue) + '</td>' +
                '<td>' + formatCurrency(y.annualCashFlow) + '</td>' +
                '<td>' + formatCurrency(y.cumulativeCashFlow) + '</td>' +
                '<td>' + formatCurrency(y.equity) + '</td>' +
                '<td>' + formatCurrency(y.netSaleProceeds) + '</td>' +
                '<td>' + formatCurrency(y.totalProfit) + '</td>' +
                '<td>' + formatPercent(y.cashYield) + '</td>' +
                '<td>' + formatPercent(y.leveragedROI) + '</td>' +
                '<td>' + (isNaN(y.irr) ? '—' : formatPercent(y.irr)) + '</td>' +
                '</tr>';
        }
        elTableBody.innerHTML = html;
    }

    // ────────────────────────────────────────────────────────
    // Master Update Function
    // ────────────────────────────────────────────────────────

    function updateCalculator() {
        var inputs = readInputs();
        var result = calculateInvestment(inputs);
        updateHighlights(result);
        renderChart(result);
        renderTable(result);
    }

    // ────────────────────────────────────────────────────────
    // Input Event Binding
    // ────────────────────────────────────────────────────────

    // Slider ↔ Number input sync pairs
    var sliderPairs = [
        { slider: elDownPaymentSlider, input: elDownPaymentPct },
        { slider: elInterestSlider, input: elInterestRate },
        { slider: elOpexSlider, input: elOpexPct },
        { slider: elAppreciationSlider, input: elAppreciationRate },
        { slider: elRentGrowthSlider, input: elRentGrowth },
        { slider: elLoanTermSlider, input: elLoanTerm },
        { slider: elSellingCostSlider, input: elSellingCost }
    ];

    sliderPairs.forEach(function (pair) {
        if (!pair.slider || !pair.input) return;
        pair.slider.addEventListener('input', function () {
            pair.input.value = pair.slider.value;
            updateCalculator();
        });
        pair.input.addEventListener('input', function () {
            pair.slider.value = pair.input.value;
            updateCalculator();
        });
    });

    // Currency inputs — format on blur, parse on input
    function setupCurrencyInput(el) {
        if (!el) return;
        el.addEventListener('input', function () {
            updateCalculator();
        });
        el.addEventListener('blur', function () {
            var val = parseNumber(el.value);
            el.value = formatInputCurrency(val);
        });
    }
    setupCurrencyInput(elPurchasePrice);
    setupCurrencyInput(elMonthlyRent);

    // ────────────────────────────────────────────────────────
    // Toggle Advanced Mode
    // ────────────────────────────────────────────────────────

    var advancedMode = false;
    if (elAdvancedToggle) {
        elAdvancedToggle.addEventListener('click', function () {
            advancedMode = !advancedMode;
            elCalcInputs.classList.toggle('show-advanced', advancedMode);
            elToggleSwitch.classList.toggle('active', advancedMode);
        });
    }

    // ────────────────────────────────────────────────────────
    // Toggle Data Table
    // ────────────────────────────────────────────────────────

    var tableOpen = false;
    if (elTableToggle) {
        elTableToggle.addEventListener('click', function () {
            tableOpen = !tableOpen;
            elTableContainer.classList.toggle('open', tableOpen);
            elTableToggle.classList.toggle('open', tableOpen);
            elTableToggleText.textContent = tableOpen ? 'Hide Data Table' : 'Show Data Table';
        });
    }

    // ────────────────────────────────────────────────────────
    // Initial Calculation
    // ────────────────────────────────────────────────────────
    updateCalculator();
}
