// Global navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
});

// Utility functions for calculations
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

function formatPercentage(rate) {
    return (rate * 100).toFixed(2) + '%';
}

// Loan Calculator Functions
function calculatePersonalLoan() {
    const principal = parseFloat(document.getElementById('loan-amount').value);
    const annualRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const years = parseFloat(document.getElementById('loan-term').value);
    
    if (!principal || !annualRate || !years) {
        alert('Please fill in all fields');
        return;
    }
    
    const monthlyRate = annualRate / 12;
    const numberOfPayments = years * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    displayResults('loan-results', {
        'Monthly Payment': formatCurrency(monthlyPayment),
        'Total Payment': formatCurrency(totalPayment),
        'Total Interest': formatCurrency(totalInterest),
        'Principal Amount': formatCurrency(principal)
    });
}

function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('home-price').value);
    const downPayment = parseFloat(document.getElementById('down-payment').value);
    const annualRate = parseFloat(document.getElementById('mortgage-rate').value) / 100;
    const years = parseFloat(document.getElementById('mortgage-term').value);
    
    if (!homePrice || downPayment === '' || !annualRate || !years) {
        alert('Please fill in all fields');
        return;
    }
    
    const principal = homePrice - downPayment;
    const monthlyRate = annualRate / 12;
    const numberOfPayments = years * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    const downPaymentPercent = (downPayment / homePrice) * 100;
    
    displayResults('mortgage-results', {
        'Monthly Payment': formatCurrency(monthlyPayment),
        'Principal Amount': formatCurrency(principal),
        'Down Payment': formatCurrency(downPayment) + ` (${downPaymentPercent.toFixed(1)}%)`,
        'Total Interest': formatCurrency(totalInterest),
        'Total Cost': formatCurrency(totalPayment + downPayment)
    });
}

// Tax Calculator Functions
function calculateTakeHomePay() {
    const grossSalary = parseFloat(document.getElementById('gross-salary').value);
    const federalRate = parseFloat(document.getElementById('federal-tax').value) / 100;
    const stateRate = parseFloat(document.getElementById('state-tax').value) / 100;
    const socialSecurity = 0.062; // 6.2%
    const medicare = 0.0145; // 1.45%
    
    if (!grossSalary || federalRate === '' || stateRate === '') {
        alert('Please fill in all fields');
        return;
    }
    
    const federalTax = grossSalary * federalRate;
    const stateTax = grossSalary * stateRate;
    const socialSecurityTax = grossSalary * socialSecurity;
    const medicareTax = grossSalary * medicare;
    const totalDeductions = federalTax + stateTax + socialSecurityTax + medicareTax;
    const takeHomePay = grossSalary - totalDeductions;
    
    displayResults('takehome-results', {
        'Gross Annual Salary': formatCurrency(grossSalary),
        'Federal Tax': formatCurrency(federalTax),
        'State Tax': formatCurrency(stateTax),
        'Social Security': formatCurrency(socialSecurityTax),
        'Medicare': formatCurrency(medicareTax),
        'Total Deductions': formatCurrency(totalDeductions),
        'Take-Home Pay': formatCurrency(takeHomePay),
        'Monthly Take-Home': formatCurrency(takeHomePay / 12)
    });
}

// Interest Calculator Functions
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const annualRate = parseFloat(document.getElementById('annual-rate').value) / 100;
    const compoundFreq = parseInt(document.getElementById('compound-frequency').value);
    const years = parseFloat(document.getElementById('time-period').value);
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
    
    if (!principal || !annualRate || !years) {
        alert('Please fill in required fields');
        return;
    }
    
    // Calculate compound interest with regular contributions
    let futureValue = principal;
    const periodsPerYear = compoundFreq;
    const periodRate = annualRate / periodsPerYear;
    const totalPeriods = years * periodsPerYear;
    
    // Compound interest on initial principal
    futureValue = principal * Math.pow(1 + periodRate, totalPeriods);
    
    // Add compound interest on monthly contributions
    if (monthlyContribution > 0) {
        const monthlyRate = annualRate / 12;
        const monthlyPeriods = years * 12;
        const contributionFutureValue = monthlyContribution * 
            ((Math.pow(1 + monthlyRate, monthlyPeriods) - 1) / monthlyRate);
        futureValue += contributionFutureValue;
    }
    
    const totalContributions = principal + (monthlyContribution * years * 12);
    const totalInterest = futureValue - totalContributions;
    
    displayResults('compound-results', {
        'Initial Principal': formatCurrency(principal),
        'Monthly Contributions': formatCurrency(monthlyContribution),
        'Total Contributions': formatCurrency(totalContributions),
        'Future Value': formatCurrency(futureValue),
        'Total Interest Earned': formatCurrency(totalInterest),
        'Effective Annual Rate': formatPercentage(Math.pow(futureValue / totalContributions, 1/years) - 1)
    });
}

// Retirement Calculator Functions
function calculate401k() {
    const currentAge = parseInt(document.getElementById('current-age').value);
    const retirementAge = parseInt(document.getElementById('retirement-age').value);
    const currentBalance = parseFloat(document.getElementById('current-balance').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthly-contrib').value);
    const employerMatch = parseFloat(document.getElementById('employer-match').value) / 100;
    const expectedReturn = parseFloat(document.getElementById('expected-return').value) / 100;
    
    if (!currentAge || !retirementAge || !monthlyContribution || expectedReturn === '') {
        alert('Please fill in all fields');
        return;
    }
    
    const years = retirementAge - currentAge;
    const monthlyRate = expectedReturn / 12;
    const totalMonths = years * 12;
    const employeeContribution = monthlyContribution;
    const employerContribution = monthlyContribution * employerMatch;
    const totalMonthlyContribution = employeeContribution + employerContribution;
    
    // Future value of current balance
    const currentBalanceFV = currentBalance * Math.pow(1 + expectedReturn, years);
    
    // Future value of monthly contributions
    const monthlyContribFV = totalMonthlyContribution * 
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalFutureValue = currentBalanceFV + monthlyContribFV;
    const totalContributions = currentBalance + (totalMonthlyContribution * totalMonths);
    const totalGrowth = totalFutureValue - totalContributions;
    
    displayResults('401k-results', {
        'Years to Retirement': years + ' years',
        'Current Balance': formatCurrency(currentBalance),
        'Monthly Employee Contribution': formatCurrency(employeeContribution),
        'Monthly Employer Match': formatCurrency(employerContribution),
        'Total Monthly Contribution': formatCurrency(totalMonthlyContribution),
        'Total Contributions': formatCurrency(totalContributions),
        'Investment Growth': formatCurrency(totalGrowth),
        'Final 401(k) Balance': formatCurrency(totalFutureValue)
    });
}

// Inflation Calculator
function calculateInflation() {
    const currentValue = parseFloat(document.getElementById('current-value').value);
    const inflationRate = parseFloat(document.getElementById('inflation-rate').value) / 100;
    const years = parseFloat(document.getElementById('years-ahead').value);
    
    if (!currentValue || !inflationRate || !years) {
        alert('Please fill in all fields');
        return;
    }
    
    const futureValue = currentValue * Math.pow(1 + inflationRate, years);
    const totalInflation = futureValue - currentValue;
    const purchasingPowerLoss = (totalInflation / futureValue) * 100;
    
    displayResults('inflation-results', {
        'Current Value': formatCurrency(currentValue),
        'Inflation Rate': formatPercentage(inflationRate),
        'Time Period': years + ' years',
        'Future Value': formatCurrency(futureValue),
        'Total Inflation': formatCurrency(totalInflation),
        'Purchasing Power Loss': purchasingPowerLoss.toFixed(1) + '%'
    });
}

// Asset Management Functions
function calculateNetWorth() {
    // Assets
    const cash = parseFloat(document.getElementById('cash').value) || 0;
    const investments = parseFloat(document.getElementById('investments').value) || 0;
    const realEstate = parseFloat(document.getElementById('real-estate').value) || 0;
    const otherAssets = parseFloat(document.getElementById('other-assets').value) || 0;
    
    // Liabilities
    const mortgage = parseFloat(document.getElementById('mortgage-debt').value) || 0;
    const creditCards = parseFloat(document.getElementById('credit-cards').value) || 0;
    const loans = parseFloat(document.getElementById('other-loans').value) || 0;
    const otherDebts = parseFloat(document.getElementById('other-debts').value) || 0;
    
    const totalAssets = cash + investments + realEstate + otherAssets;
    const totalLiabilities = mortgage + creditCards + loans + otherDebts;
    const netWorth = totalAssets - totalLiabilities;
    
    displayResults('networth-results', {
        'Total Assets': formatCurrency(totalAssets),
        'Cash & Savings': formatCurrency(cash),
        'Investments': formatCurrency(investments),
        'Real Estate': formatCurrency(realEstate),
        'Other Assets': formatCurrency(otherAssets),
        'Total Liabilities': formatCurrency(totalLiabilities),
        'Mortgage Debt': formatCurrency(mortgage),
        'Credit Card Debt': formatCurrency(creditCards),
        'Other Debts': formatCurrency(loans + otherDebts),
        'Net Worth': formatCurrency(netWorth)
    });
}

// Utility function to display results
function displayResults(containerId, results) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '<h3>Calculation Results</h3>';
    
    for (const [label, value] of Object.entries(results)) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <span class="result-label">${label}:</span>
            <span class="result-value">${value}</span>
        `;
        container.appendChild(resultItem);
    }
}

// Input validation and formatting
function validatePositiveNumber(input) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value < 0) {
        input.value = '';
        return false;
    }
    return true;
}

function validatePercentage(input) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value < 0 || value > 100) {
        input.value = '';
        return false;
    }
    return true;
}
