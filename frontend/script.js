const API_BASE = 'http://localhost:8080/api';

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Authentication
async function login() {
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const pin = document.getElementById('pin').value.trim();
    const errorDiv = document.getElementById('loginError');

    if (!accountNumber || !pin) {
        showError(errorDiv, 'Please enter account number and PIN');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/authenticate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `accountNumber=${accountNumber}&pin=${pin}`
        });

        const data = await response.json();

        if (data.success) {
            errorDiv.classList.remove('show');
            const balanceResponse = await fetch(`${API_BASE}/balance`);
            const balanceData = await balanceResponse.json();

            document.getElementById('userName').textContent = balanceData.accountNumber;
            document.getElementById('balanceAccountNum').textContent = balanceData.accountNumber;
            document.getElementById('balanceAmount').textContent = '₹' + balanceData.balance.toFixed(2);

            document.getElementById('accountNumber').value = '';
            document.getElementById('pin').value = '';
            showScreen('mainMenuScreen');
        } else {
            showError(errorDiv, data.message || 'Invalid credentials');
        }
    } catch (error) {
        showError(errorDiv, 'Connection error. Make sure server is running on localhost:8080');
    }
}

// Balance Operations
function showBalanceScreen() {
    fetchBalance();
    showScreen('balanceScreen');
}

async function fetchBalance() {
    try {
        const response = await fetch(`${API_BASE}/balance`);
        const data = await response.json();

        document.getElementById('balanceAccountNum').textContent = data.accountNumber;
        document.getElementById('balanceAmount').textContent = '₹' + data.balance.toFixed(2);
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

// Deposit
function showDepositScreen() {
    document.getElementById('depositAmount').value = '';
    document.getElementById('depositMessage').textContent = '';
    document.getElementById('depositMessage').classList.remove('show', 'error');
    showScreen('depositScreen');
}

async function deposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const messageDiv = document.getElementById('depositMessage');

    if (isNaN(amount) || amount <= 0) {
        showMessage(messageDiv, 'Please enter a valid amount', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/deposit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `amount=${amount}`
        });

        const data = await response.json();

        if (data.success) {
            showMessage(messageDiv, `✓ ${data.message}`, false);
            setTimeout(() => {
                showScreen('mainMenuScreen');
                fetchBalance();
            }, 1500);
        } else {
            showMessage(messageDiv, data.error || 'Deposit failed', true);
        }
    } catch (error) {
        showMessage(messageDiv, 'Connection error', true);
    }
}

// Withdraw
function showWithdrawScreen() {
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('withdrawMessage').textContent = '';
    document.getElementById('withdrawMessage').classList.remove('show', 'error');
    showScreen('withdrawScreen');
}

async function withdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const messageDiv = document.getElementById('withdrawMessage');

    if (isNaN(amount) || amount <= 0) {
        showMessage(messageDiv, 'Please enter a valid amount', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/withdraw`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `amount=${amount}`
        });

        const data = await response.json();

        if (data.success) {
            showMessage(messageDiv, `✓ ${data.message}`, false);
            setTimeout(() => {
                showScreen('mainMenuScreen');
                fetchBalance();
            }, 1500);
        } else {
            showMessage(messageDiv, data.error || 'Withdrawal failed', true);
        }
    } catch (error) {
        showMessage(messageDiv, 'Connection error', true);
    }
}

// Change PIN
function showChangePinScreen() {
    document.getElementById('oldPin').value = '';
    document.getElementById('newPin').value = '';
    document.getElementById('confirmPin').value = '';
    document.getElementById('pinMessage').textContent = '';
    document.getElementById('pinMessage').classList.remove('show', 'error');
    showScreen('changePinScreen');
}

async function changePin() {
    const oldPin = document.getElementById('oldPin').value.trim();
    const newPin = document.getElementById('newPin').value.trim();
    const confirmPin = document.getElementById('confirmPin').value.trim();
    const messageDiv = document.getElementById('pinMessage');

    if (!oldPin || !newPin || !confirmPin) {
        showMessage(messageDiv, 'Please fill all fields', true);
        return;
    }

    if (newPin !== confirmPin) {
        showMessage(messageDiv, 'New PINs do not match', true);
        return;
    }

    if (newPin.length < 4) {
        showMessage(messageDiv, 'PIN must be at least 4 digits', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/changepin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `oldPin=${oldPin}&newPin=${newPin}`
        });

        const data = await response.json();

        if (data.success) {
            showMessage(messageDiv, `✓ ${data.message}`, false);
            setTimeout(() => showScreen('mainMenuScreen'), 1500);
        } else {
            showMessage(messageDiv, data.error || 'PIN change failed', true);
        }
    } catch (error) {
        showMessage(messageDiv, 'Connection error', true);
    }
}

// Logout
async function logout() {
    try {
        await fetch(`${API_BASE}/logout`);
        showScreen('loginScreen');
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Navigation
function backToMenu() {
    showScreen('mainMenuScreen');
}

// Helpers
function showError(element, message) {
    element.textContent = '✗ ' + message;
    element.classList.add('show');
}

function showMessage(element, message, isError) {
    element.textContent = message;
    element.classList.add('show');
    if (isError) element.classList.add('error');
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    showScreen('loginScreen');
});