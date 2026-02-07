// Front Desk Dashboard JavaScript

// Sample data - In production, this would come from your backend API
const membersData = [
    { id: 1, memberID: '001', name: 'Kelly', membership: 'Basic', status: 'Active', phone: '09123456789', dateJoined: '2025-01-10' },
    { id: 2, memberID: '002', name: 'Salad', membership: 'Premium', status: 'Active', phone: '09987654321', dateJoined: '2025-01-12' },
    { id: 3, memberID: '003', name: 'Jonela', membership: 'VIP', status: 'Active', phone: '09223334444', dateJoined: '2025-01-15' },
    { id: 4, memberID: '004', name: 'Areisha', membership: 'VIP', status: 'Active', phone: '09334445555', dateJoined: '2025-01-17' },
    { id: 5, memberID: '005', name: 'Lyle', membership: 'VIP', status: 'Active', phone: '09246832456', dateJoined: '2025-01-19' }
];

const checkedInMembers = [
    { id: 1, name: 'Kelly', checkIn: '08:05 AM', duration: '1h 25m', status: 'Checked In' },
    { id: 2, name: 'Salad', checkIn: '10:00 AM', duration: '1h 15m', status: 'Checked In' }
];

const paymentsData = [
    { date: '2025-01-10', member: 'Kelly', membership: 'Basic', amount: 1000, method: 'Cash', reference: 'PAY-001' },
    { date: '2025-01-12', member: 'Salad', membership: 'Premium', amount: 2000, method: 'GCash', reference: 'PAY-002' },
    { date: '2025-01-15', member: 'Jonela', membership: 'VIP', amount: 3500, method: 'Card', reference: 'PAY-003' }
];

const membershipPrices = {
    'Basic': 1000,
    'Premium': 2000,
    'VIP': 3500
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateDashboardStats();
    loadMembersTable();
    loadCheckedInMembers();
    loadPaymentsTable();
});

// Update dashboard statistics
function updateDashboardStats() {
    // Calculate today's check-ins (sample data)
    const todayCheckIns = checkedInMembers.length;
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = todayCheckIns;
    
    // Active members
    const activeMembers = membersData.filter(m => m.status === 'Active').length;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = activeMembers;
    
    // Today's payments
    const todayPayments = paymentsData.reduce((sum, payment) => sum + payment.amount, 0);
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = `₱${todayPayments.toLocaleString()}`;
    
    // Update payment transactions count
    const transactionsCount = paymentsData.length;
    document.querySelector('.stat-card:nth-child(3) .stat-label').textContent = `${transactionsCount} transactions processed`;
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked nav tab
    event.target.classList.add('active');
}

// Load members table
function loadMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = membersData.map(member => `
        <tr>
            <td>#${member.memberID}</td>
            <td>${member.name}</td>
            <td><span class="badge badge-${member.membership.toLowerCase()}">${member.membership}</span></td>
            <td><span class="badge badge-${member.status.toLowerCase()}">${member.status}</span></td>
            <td>${member.phone}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="quickCheckIn(${member.id}, '${member.name}')">Check In</button>
                    <button class="btn btn-secondary btn-sm" onclick="viewMemberHistory(${member.id})">History</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load checked in members
function loadCheckedInMembers() {
    const checkInTab = document.querySelector('#checkin-tab tbody');
    if (!checkInTab) return;
    
    checkInTab.innerHTML = checkedInMembers.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.checkIn}</td>
            <td>${member.duration}</td>
            <td><span class="badge badge-active">${member.status}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="checkOut(${member.id}, '${member.name}')">Check Out</button>
            </td>
        </tr>
    `).join('');
}

// Load payments table
function loadPaymentsTable() {
    const paymentsTab = document.querySelector('#payments-tab tbody');
    if (!paymentsTab) return;
    
    paymentsTab.innerHTML = paymentsData.map(payment => `
        <tr>
            <td>${payment.date}</td>
            <td>${payment.member}</td>
            <td><span class="badge badge-${payment.membership.toLowerCase()}">${payment.membership}</span></td>
            <td>₱${payment.amount.toLocaleString()}</td>
            <td>${payment.method}</td>
            <td>${payment.reference}</td>
        </tr>
    `).join('');
}

// Search members
function searchMembers() {
    const input = document.getElementById('memberSearch');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('membersTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (cell) {
                const textValue = cell.textContent || cell.innerText;
                if (textValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }

        row.style.display = found ? '' : 'none';
    }
}

// Quick check-in
function quickCheckIn(memberId, memberName) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Show success notification
    showNotification(`${memberName} checked in successfully at ${time}`, 'success');
    
    // Add to checked-in members
    checkedInMembers.push({
        id: memberId,
        name: memberName,
        checkIn: time,
        duration: '0m',
        status: 'Checked In'
    });
    
    // Update the check-in table
    loadCheckedInMembers();
    updateDashboardStats();
}

// Check out
function checkOut(memberId, memberName) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Remove from checked-in members
    const index = checkedInMembers.findIndex(m => m.id === memberId);
    if (index > -1) {
        checkedInMembers.splice(index, 1);
    }
    
    // Show success notification
    showNotification(`${memberName} checked out successfully at ${time}`, 'success');
    
    // Update the check-in table
    loadCheckedInMembers();
    updateDashboardStats();
}

// View member history
function viewMemberHistory(memberId) {
    document.getElementById('historyModal').classList.add('active');
    
    // Sample history data
    const historyData = [
        { date: '2025-01-18', checkIn: '08:05 AM', checkOut: '09:30 AM', duration: '1h 25m' },
        { date: '2025-01-17', checkIn: '07:30 AM', checkOut: '09:00 AM', duration: '1h 30m' },
        { date: '2025-01-16', checkIn: '08:15 AM', checkOut: '10:00 AM', duration: '1h 45m' }
    ];
    
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = historyData.map(record => `
        <tr>
            <td>${record.date}</td>
            <td>${record.checkIn}</td>
            <td>${record.checkOut}</td>
            <td>${record.duration}</td>
        </tr>
    `).join('');
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('active');
}

// Payment modal functions
function openPaymentModal() {
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function updateAmount() {
    const select = document.getElementById('membershipType');
    const amountInput = document.getElementById('paymentAmount');
    amountInput.value = select.value;
}

function submitPayment(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const memberSelect = form.querySelector('select[name="member"]');
    const membershipSelect = document.getElementById('membershipType');
    const amount = document.getElementById('paymentAmount').value;
    const method = form.querySelector('select[name="method"]').value;
    const reference = form.querySelector('input[name="reference"]').value || 'PAY-' + String(paymentsData.length + 1).padStart(3, '0');
    
    if (!memberSelect.value || !membershipSelect.value || !method) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Add payment to data
    const payment = {
        date: new Date().toISOString().split('T')[0],
        member: memberSelect.options[memberSelect.selectedIndex].text.split('(')[0].trim(),
        membership: membershipSelect.options[membershipSelect.selectedIndex].text.split('-')[0].trim(),
        amount: parseInt(amount),
        method: method.charAt(0).toUpperCase() + method.slice(1),
        reference: reference
    };
    
    paymentsData.unshift(payment);
    
    // Update displays
    loadPaymentsTable();
    updateDashboardStats();
    
    showNotification('Payment processed successfully!', 'success');
    closePaymentModal();
    form.reset();
}

// Notification system
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                font-weight: 600;
            }
            
            .notification-success {
                background: #4CAF50;
                color: white;
            }
            
            .notification-error {
                background: #F44336;
                color: white;
            }
            
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const paymentModal = document.getElementById('paymentModal');
    const historyModal = document.getElementById('historyModal');
    
    if (event.target === paymentModal) {
        closePaymentModal();
    }
    if (event.target === historyModal) {
        closeHistoryModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        closePaymentModal();
        closeHistoryModal();
    }
});