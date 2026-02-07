// Manager Dashboard JavaScript

// Sample data - In production, this would come from your backend API
const managerData = {
    members: {
        total: 5,
        active: 5,
        inactive: 0
    },
    revenue: {
        monthly: 6500,
        trend: 15
    },
    classes: [
        {
            id: 1,
            name: 'Morning Yoga',
            trainer: 'Paul',
            trainerID: 1,
            room: 'Yoga Room',
            roomID: 1,
            date: '2025-01-20',
            startTime: '08:00',
            endTime: '09:00',
            maxSlots: 20,
            enrolled: 2
        },
        {
            id: 2,
            name: 'Zumba Fitness',
            trainer: 'Paul',
            trainerID: 1,
            room: 'Cardio Room',
            roomID: 3,
            date: '2025-01-20',
            startTime: '10:00',
            endTime: '11:00',
            maxSlots: 25,
            enrolled: 1
        }
    ],
    rooms: [
        { id: 1, name: 'Yoga Room', type: 'Yoga', capacity: 20, location: '2nd Floor', staffID: 1, staffName: 'Paul' },
        { id: 2, name: 'Weight Room', type: 'Strength', capacity: 30, location: '1st Floor', staffID: 3, staffName: 'BaladJay' },
        { id: 3, name: 'Cardio Room', type: 'Cardio', capacity: 25, location: '1st Floor', staffID: 1, staffName: 'Paul' }
    ],
    facilities: [
        { id: 1, name: 'Sauna Room', type: 'Sauna', capacity: 6, location: '2nd Floor', vipOnly: true, status: 'Available' },
        { id: 2, name: 'Private Training Room', type: 'Private Room', capacity: 2, location: '3rd Floor', vipOnly: true, status: 'Available' }
    ],
    equipment: [
        {
            id: 1,
            name: 'Treadmill',
            category: 'Cardio',
            brand: 'NordicTrack',
            state: 'Good',
            location: 'Cardio Room',
            purchaseDate: '2024-06-01',
            lastMaintenance: '2025-01-05',
            nextMaintenance: '2025-06-01'
        }
    ],
    maintenanceHistory: [
        {
            id: 1,
            date: '2025-01-05',
            equipmentID: 1,
            equipment: 'Treadmill',
            issue: 'Belt alignment issue',
            assignedTo: 'BaladJay',
            cost: 1500,
            status: 'Fixed'
        }
    ],
    staff: [
        { id: 1, name: 'Paul' },
        { id: 3, name: 'BaladJay' }
    ]
};

let currentTab = 'classes';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateAnalytics();
    loadScheduledClasses();
});

// Update analytics
function updateAnalytics() {
    // Total members
    document.querySelector('.analytics-card:nth-child(1) .stat-value').textContent = managerData.members.total;
    
    // Active vs Inactive
    const activePercent = Math.round((managerData.members.active / managerData.members.total) * 100);
    document.querySelector('.analytics-card:nth-child(2) .stat-value').textContent = `${activePercent}%`;
    document.querySelector('.analytics-card:nth-child(2) .stat-change').textContent = 
        `${managerData.members.active} active, ${managerData.members.inactive} inactive`;
    
    // Monthly Revenue
    document.querySelector('.analytics-card:nth-child(3) .stat-value').textContent = 
        `₱${managerData.revenue.monthly.toLocaleString()}`;
    
    // Class Utilization
    const totalSlots = managerData.classes.reduce((sum, c) => sum + c.maxSlots, 0);
    const filledSlots = managerData.classes.reduce((sum, c) => sum + c.enrolled, 0);
    const utilization = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;
    document.querySelector('.analytics-card:nth-child(4) .stat-value').textContent = `${utilization}%`;
    document.querySelector('.analytics-card:nth-child(4) .stat-change').textContent = 
        `${filledSlots}/${totalSlots} slots filled`;
}

// Tab switching
function switchTab(tabName) {
    currentTab = tabName;
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load data for the selected tab
    if (tabName === 'facilities') {
        loadFacilitiesData();
    } else if (tabName === 'equipment') {
        loadEquipmentData();
    }
}

// Load scheduled classes
function loadScheduledClasses() {
    const tbody = document.querySelector('#classes-tab tbody');
    if (!tbody) return;
    
    tbody.innerHTML = managerData.classes.map(classItem => `
        <tr>
            <td>${classItem.name}</td>
            <td>${classItem.trainer}</td>
            <td>${classItem.room}</td>
            <td>${classItem.date}, ${classItem.startTime} - ${classItem.endTime}</td>
            <td>${classItem.enrolled}/${classItem.maxSlots}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editClass(${classItem.id})">Edit</button>
                    <button class="btn btn-secondary btn-sm" onclick="cancelClass(${classItem.id})">Cancel</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load facilities data
function loadFacilitiesData() {
    const roomsTable = document.querySelector('#facilities-tab tbody');
    if (roomsTable) {
        roomsTable.innerHTML = managerData.rooms.map(room => `
            <tr>
                <td>${room.name}</td>
                <td>${room.type}</td>
                <td>${room.capacity}</td>
                <td>${room.location}</td>
                <td>${room.staffName}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="editRoom(${room.id})">Edit</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Load equipment data
function loadEquipmentData() {
    const equipmentTable = document.querySelector('#equipment-tab tbody');
    if (equipmentTable) {
        equipmentTable.innerHTML = managerData.equipment.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.brand}</td>
                <td><span class="badge badge-${item.state.toLowerCase()}">${item.state}</span></td>
                <td>${item.location}</td>
                <td>${item.nextMaintenance}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-sm" onclick="viewMaintenanceLog(${item.id})">View Logs</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    const maintenanceTable = document.querySelector('#equipment-tab tbody:last-child');
    if (maintenanceTable) {
        maintenanceTable.innerHTML = managerData.maintenanceHistory.map(record => `
            <tr>
                <td>${record.date}</td>
                <td>${record.equipment}</td>
                <td>${record.issue}</td>
                <td>${record.assignedTo}</td>
                <td>₱${record.cost.toLocaleString()}</td>
                <td><span class="badge badge-good">${record.status}</span></td>
            </tr>
        `).join('');
    }
}

// Create Class Modal
function openCreateClass() {
    const modal = document.getElementById('createClassModal');
    modal.classList.add('active');
}

function closeCreateClass() {
    const modal = document.getElementById('createClassModal');
    modal.classList.remove('active');
}

function submitClass(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Create new class object
    const newClass = {
        id: managerData.classes.length + 1,
        name: formData.get('className') || form.querySelector('input[type="text"]').value,
        trainer: form.querySelector('select[name="trainer"]')?.selectedOptions[0]?.text || 'Paul',
        trainerID: parseInt(form.querySelector('select[name="trainer"]')?.value) || 1,
        room: form.querySelector('select[name="room"]')?.selectedOptions[0]?.text || 'Yoga Room',
        roomID: parseInt(form.querySelector('select[name="room"]')?.value) || 1,
        date: form.querySelector('input[type="date"]')?.value || '2025-01-21',
        startTime: form.querySelector('input[type="time"]')?.value || '09:00',
        endTime: form.querySelectorAll('input[type="time"]')[1]?.value || '10:00',
        maxSlots: parseInt(form.querySelector('input[type="number"]')?.value) || 20,
        enrolled: 0
    };
    
    // Add to classes array
    managerData.classes.push(newClass);
    
    // Reload table
    loadScheduledClasses();
    updateAnalytics();
    
    showNotification('Class created successfully!', 'success');
    closeCreateClass();
    form.reset();
}

// Edit class
function editClass(classId) {
    const classData = managerData.classes.find(c => c.id === classId);
    if (!classData) return;
    
    showNotification(`Editing ${classData.name}`, 'info');
    // In production, this would open a modal with pre-filled data
}

// Cancel class
function cancelClass(classId) {
    const classData = managerData.classes.find(c => c.id === classId);
    if (!classData) return;
    
    if (confirm(`Are you sure you want to cancel ${classData.name}?`)) {
        // Remove from array
        const index = managerData.classes.findIndex(c => c.id === classId);
        if (index > -1) {
            managerData.classes.splice(index, 1);
        }
        
        loadScheduledClasses();
        updateAnalytics();
        showNotification('Class cancelled successfully', 'success');
    }
}

// View day classes
function viewDayClasses(day) {
    const dayClasses = managerData.classes.filter(c => {
        const classDay = new Date(c.date).getDate();
        return classDay === day;
    });
    
    if (dayClasses.length > 0) {
        const classList = dayClasses.map(c => `• ${c.name} at ${c.startTime}`).join('\n');
        alert(`Classes on day ${day}:\n\n${classList}`);
    } else {
        showNotification(`No classes scheduled for day ${day}`, 'info');
    }
}

// Edit room
function editRoom(roomId) {
    const room = managerData.rooms.find(r => r.id === roomId);
    if (!room) return;
    
    showNotification(`Editing ${room.name}`, 'info');
    // In production, this would open a modal with pre-filled data
}

// Maintenance Modal
function scheduleMaintenance() {
    document.getElementById('maintenanceModal').classList.add('active');
}

function closeMaintenanceModal() {
    document.getElementById('maintenanceModal').classList.remove('active');
}

function submitMaintenance(event) {
    event.preventDefault();
    
    const form = event.target;
    
    const newMaintenance = {
        id: managerData.maintenanceHistory.length + 1,
        date: form.querySelector('input[type="date"]').value,
        equipmentID: parseInt(form.querySelector('select[name="equipment"]').value),
        equipment: form.querySelector('select[name="equipment"]').selectedOptions[0].text,
        issue: form.querySelector('textarea').value,
        assignedTo: form.querySelector('select[name="assignTo"]').selectedOptions[0].text,
        cost: parseInt(form.querySelector('input[type="number"]').value) || 0,
        status: 'Scheduled'
    };
    
    managerData.maintenanceHistory.unshift(newMaintenance);
    
    loadEquipmentData();
    showNotification('Maintenance scheduled successfully!', 'success');
    closeMaintenanceModal();
    form.reset();
}

// View maintenance log
function viewMaintenanceLog(equipmentId) {
    const equipment = managerData.equipment.find(e => e.id === equipmentId);
    const logs = managerData.maintenanceHistory.filter(m => m.equipmentID === equipmentId);
    
    if (logs.length === 0) {
        showNotification('No maintenance history found', 'info');
        return;
    }
    
    const logDetails = logs.map(log => 
        `Date: ${log.date}\nIssue: ${log.issue}\nStatus: ${log.status}\nCost: ₱${log.cost}`
    ).join('\n\n');
    
    alert(`Maintenance History for ${equipment.name}:\n\n${logDetails}`);
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
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const createClassModal = document.getElementById('createClassModal');
    const maintenanceModal = document.getElementById('maintenanceModal');
    
    if (event.target === createClassModal) {
        closeCreateClass();
    }
    if (event.target === maintenanceModal) {
        closeMaintenanceModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCreateClass();
        closeMaintenanceModal();
    }
});