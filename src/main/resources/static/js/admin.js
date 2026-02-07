// Admin Dashboard JavaScript

// Sample data - In production, this would come from your backend API
const adminData = {
    users: {
        total: 9,
        members: 5,
        staff: 4
    },
    staff: [
        {
            id: 1,
            staffID: 'S001',
            name: 'Paul',
            username: 'paul_tr',
            role: 'Trainer',
            email: 'paul@gmail.com',
            phone: '09111111111',
            age: 20,
            gender: 'Male',
            status: 'Active'
        },
        {
            id: 2,
            staffID: 'S002',
            name: 'MJ',
            username: 'mj_fd',
            role: 'Front Desk',
            email: 'mj@gmail.com',
            phone: '09222222222',
            age: 20,
            gender: 'Other',
            status: 'Active'
        },
        {
            id: 3,
            staffID: 'S003',
            name: 'BaladJay',
            username: 'baladjay_mgr',
            role: 'Manager',
            email: 'baladjay@gmail.com',
            phone: '09444444444',
            age: 19,
            gender: 'Male',
            status: 'Active'
        },
        {
            id: 4,
            staffID: 'S004',
            name: 'Karl',
            username: 'admin_karl',
            role: 'Admin',
            email: 'karl@gmail.com',
            phone: '09555555555',
            age: 20,
            gender: 'Male',
            status: 'Active'
        }
    ],
    membershipTypes: [
        { id: 1, name: 'Basic', price: 1000, duration: 30, accessLevel: 'Gym Only' },
        { id: 2, name: 'Premium', price: 2000, duration: 30, accessLevel: 'Gym + Classes' },
        { id: 3, name: 'VIP', price: 3500, duration: 60, accessLevel: 'All Access' }
    ],
    auditLogs: [
        {
            timestamp: '2025-01-20 09:15',
            user: 'Karl (Admin)',
            action: 'Login',
            details: 'Successful authentication'
        },
        {
            timestamp: '2025-01-20 08:30',
            user: 'BaladJay (Manager)',
            action: 'Class Created',
            details: 'Morning Yoga - Jan 20'
        },
        {
            timestamp: '2025-01-19 16:45',
            user: 'MJ (Front Desk)',
            action: 'Payment Processed',
            details: 'Lyle - VIP Membership - ₱3,500'
        },
        {
            timestamp: '2025-01-18 14:20',
            user: 'Paul (Trainer)',
            action: 'Attendance Marked',
            details: 'Morning Yoga - 2 members'
        }
    ],
    revenue: {
        monthly: 6500
    }
};

const rolePermissions = {
    'Admin': 'Full System Access',
    'Manager': 'Analytics, Classes, Equipment, Rooms',
    'Trainer': 'Classes, Attendance',
    'Front Desk': 'Members, Check-in, Payments'
};

let currentEditStaffId = null;
let currentPromoteStaffId = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateAnalytics();
    loadStaffTable();
    loadAuditLogs();
});

// Update analytics
function updateAnalytics() {
    // Total users
    document.querySelector('.analytics-card:nth-child(1) .stat-value').textContent = adminData.users.total;
    document.querySelector('.analytics-card:nth-child(1) .stat-breakdown').innerHTML = 
        `<span>${adminData.users.members} Members</span><span>${adminData.users.staff} Staff</span>`;
    
    // Staff breakdown
    const staffBreakdown = {};
    adminData.staff.forEach(s => {
        const shortRole = s.role === 'Front Desk' ? 'FD' : s.role;
        staffBreakdown[shortRole] = (staffBreakdown[shortRole] || 0) + 1;
    });
    
    document.querySelector('.analytics-card:nth-child(2) .stat-value').textContent = adminData.users.staff;
    const breakdownHTML = Object.entries(staffBreakdown)
        .map(([role, count]) => `<span>${count} ${role}</span>`)
        .join('');
    document.querySelector('.analytics-card:nth-child(2) .stat-breakdown').innerHTML = breakdownHTML;
    
    // Revenue summary
    document.querySelector('.analytics-card:nth-child(3) .stat-value').textContent = 
        `₱${adminData.revenue.monthly.toLocaleString()}`;
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Load staff table
function loadStaffTable() {
    const tbody = document.querySelector('#staff-tab tbody');
    if (!tbody) return;
    
    tbody.innerHTML = adminData.staff.map(staff => {
        const isCurrentAdmin = staff.role === 'Admin' && staff.id === 4; // Karl
        const roleBadgeClass = staff.role.toLowerCase().replace(' ', '');
        
        return `
            <tr>
                <td>#${staff.staffID}</td>
                <td>${staff.name}</td>
                <td><span class="badge badge-${roleBadgeClass}">${staff.role}</span></td>
                <td>${staff.email}</td>
                <td>${staff.phone}</td>
                <td><span class="badge badge-${staff.status.toLowerCase()}">${staff.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="openEditStaff(${staff.id})">Edit</button>
                        <button class="btn btn-secondary btn-sm" onclick="openPromoteStaff(${staff.id})" ${isCurrentAdmin ? 'disabled' : ''}>Promote</button>
                        <button class="btn btn-danger btn-sm" onclick="removeStaff(${staff.id}, '${staff.name}')" ${isCurrentAdmin ? 'disabled' : ''}>Remove</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Load audit logs
function loadAuditLogs() {
    const tbody = document.querySelector('#settings-tab tbody:last-child');
    if (!tbody) return;
    
    tbody.innerHTML = adminData.auditLogs.map(log => `
        <tr>
            <td>${log.timestamp}</td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td>${log.details}</td>
        </tr>
    `).join('');
}

// Add Staff Modal
function openAddStaff() {
    document.getElementById('addStaffModal').classList.add('active');
}

function closeAddStaff() {
    document.getElementById('addStaffModal').classList.remove('active');
}

function submitAddStaff(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const inputs = form.querySelectorAll('input, select');
    const fullName = inputs[0].value;
    const username = inputs[1].value;
    const email = inputs[3].value;
    const phone = inputs[4].value;
    const age = inputs[5].value;
    const gender = inputs[6].value;
    const position = inputs[7].value;
    
    // Validate required fields
    if (!fullName || !username || !email || !phone || !position) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Check for duplicate username
    if (adminData.staff.some(s => s.username === username)) {
        showNotification('Username already exists', 'error');
        return;
    }
    
    // Create new staff member
    const newStaff = {
        id: adminData.staff.length + 1,
        staffID: `S${String(adminData.staff.length + 1).padStart(3, '0')}`,
        name: fullName,
        username: username,
        role: position,
        email: email,
        phone: phone,
        age: parseInt(age) || null,
        gender: gender,
        status: 'Active'
    };
    
    adminData.staff.push(newStaff);
    adminData.users.staff++;
    adminData.users.total++;
    
    // Add audit log
    adminData.auditLogs.unshift({
        timestamp: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        user: 'Karl (Admin)',
        action: 'Staff Added',
        details: `${fullName} - ${position}`
    });
    
    // Reload displays
    loadStaffTable();
    loadAuditLogs();
    updateAnalytics();
    
    showNotification(`${fullName} added successfully as ${position}`, 'success');
    closeAddStaff();
    form.reset();
}

// Edit Staff Modal
function openEditStaff(staffId) {
    currentEditStaffId = staffId;
    const staff = adminData.staff.find(s => s.id === staffId);
    if (!staff) return;
    
    // Pre-fill form
    document.getElementById('editName').value = staff.name;
    document.getElementById('editEmail').value = staff.email;
    document.getElementById('editPhone').value = staff.phone;
    document.getElementById('editPosition').value = staff.role;
    document.getElementById('editStatus').value = staff.status;
    
    document.getElementById('editStaffModal').classList.add('active');
}

function closeEditStaff() {
    document.getElementById('editStaffModal').classList.remove('active');
    currentEditStaffId = null;
}

function submitEditStaff(event) {
    event.preventDefault();
    
    if (!currentEditStaffId) return;
    
    const staff = adminData.staff.find(s => s.id === currentEditStaffId);
    if (!staff) return;
    
    const oldName = staff.name;
    const oldRole = staff.role;
    
    // Update staff data
    staff.name = document.getElementById('editName').value;
    staff.email = document.getElementById('editEmail').value;
    staff.phone = document.getElementById('editPhone').value;
    staff.role = document.getElementById('editPosition').value;
    staff.status = document.getElementById('editStatus').value;
    
    // Add audit log
    adminData.auditLogs.unshift({
        timestamp: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        user: 'Karl (Admin)',
        action: 'Staff Updated',
        details: `${staff.name} - Updated information`
    });
    
    // Reload displays
    loadStaffTable();
    loadAuditLogs();
    
    showNotification(`${staff.name} updated successfully`, 'success');
    closeEditStaff();
}

// Promote/Demote Staff Modal
function openPromoteStaff(staffId) {
    currentPromoteStaffId = staffId;
    const staff = adminData.staff.find(s => s.id === staffId);
    if (!staff) return;
    
    document.getElementById('promoteModal').classList.add('active');
}

function closePromoteModal() {
    document.getElementById('promoteModal').classList.remove('active');
    currentPromoteStaffId = null;
}

function submitPromote(event) {
    event.preventDefault();
    
    if (!currentPromoteStaffId) return;
    
    const staff = adminData.staff.find(s => s.id === currentPromoteStaffId);
    if (!staff) return;
    
    const form = event.target;
    const newPosition = form.querySelector('select').value;
    
    if (!newPosition) {
        showNotification('Please select a position', 'error');
        return;
    }
    
    const oldRole = staff.role;
    staff.role = newPosition;
    
    // Add audit log
    adminData.auditLogs.unshift({
        timestamp: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        user: 'Karl (Admin)',
        action: 'Role Changed',
        details: `${staff.name}: ${oldRole} → ${newPosition}`
    });
    
    // Reload displays
    loadStaffTable();
    loadAuditLogs();
    
    showNotification(`${staff.name} role updated to ${newPosition}`, 'success');
    closePromoteModal();
    form.reset();
}

// Remove Staff
function removeStaff(staffId, staffName) {
    const staff = adminData.staff.find(s => s.id === staffId);
    if (!staff) return;
    
    // Prevent removing admin
    if (staff.role === 'Admin') {
        showNotification('Cannot remove admin account', 'error');
        return;
    }
    
    if (!confirm(`Are you sure you want to remove ${staffName} from the staff?`)) {
        return;
    }
    
    // Remove from array
    const index = adminData.staff.findIndex(s => s.id === staffId);
    if (index > -1) {
        adminData.staff.splice(index, 1);
        adminData.users.staff--;
        adminData.users.total--;
    }
    
    // Add audit log
    adminData.auditLogs.unshift({
        timestamp: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        user: 'Karl (Admin)',
        action: 'Staff Removed',
        details: `${staffName} - ${staff.role}`
    });
    
    // Reload displays
    loadStaffTable();
    loadAuditLogs();
    updateAnalytics();
    
    showNotification(`${staffName} has been removed from the system`, 'success');
}

// Edit Membership
function editMembership(membershipId) {
    const membership = adminData.membershipTypes.find(m => m.id === membershipId);
    if (!membership) return;
    
    showNotification(`Editing ${membership.name} membership type`, 'info');
    // In production, this would open a modal with pre-filled data
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
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
                min-width: 300px;
            }
            
            .notification-success {
                background: #4CAF50;
                color: white;
            }
            
            .notification-error {
                background: #F44336;
                color: white;
            }
            
            .notification-info {
                background: #2196F3;
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
                margin-left: auto;
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const addStaffModal = document.getElementById('addStaffModal');
    const editStaffModal = document.getElementById('editStaffModal');
    const promoteModal = document.getElementById('promoteModal');
    
    if (event.target === addStaffModal) {
        closeAddStaff();
    }
    if (event.target === editStaffModal) {
        closeEditStaff();
    }
    if (event.target === promoteModal) {
        closePromoteModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        closeAddStaff();
        closeEditStaff();
        closePromoteModal();
    }
    
    // Ctrl/Cmd + N opens Add Staff modal (only on staff tab)
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && document.getElementById('staff-tab').classList.contains('active')) {
        e.preventDefault();
        openAddStaff();
    }
});