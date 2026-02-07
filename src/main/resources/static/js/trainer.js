// Trainer Dashboard JavaScript

// Sample data - In production, this would come from your backend API
const trainerClasses = [
    {
        id: 1,
        name: 'Morning Yoga',
        time: '08:00 - 09:00',
        room: 'Yoga Room',
        date: '2025-01-20',
        capacity: 20,
        enrolled: 2,
        status: 'Today'
    },
    {
        id: 2,
        name: 'Zumba Fitness',
        time: '10:00 - 11:00',
        room: 'Cardio Room',
        date: '2025-01-20',
        capacity: 25,
        enrolled: 1,
        status: 'Today'
    }
];

const classMembers = {
    1: [ // Morning Yoga
        { id: 1, name: 'Kelly', membership: 'Basic', status: 'present' },
        { id: 2, name: 'Salad', membership: 'Premium', status: 'present' }
    ],
    2: [ // Zumba Fitness
        { id: 2, name: 'Salad', membership: 'Premium', status: 'absent' }
    ]
};

const attendanceStatus = {};
let currentClassId = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateDashboardStats();
    initializeAttendance();
});

// Update dashboard statistics
function updateDashboardStats() {
    // Today's classes count
    const todayClasses = trainerClasses.filter(c => c.status === 'Today').length;
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = todayClasses;
    
    // Assigned rooms
    const rooms = [...new Set(trainerClasses.map(c => c.room))];
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = rooms.length;
    document.querySelector('.stat-card:nth-child(2) .stat-label').textContent = rooms.join(', ');
    
    // Total enrolled
    const totalEnrolled = trainerClasses.reduce((sum, c) => sum + c.enrolled, 0);
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = totalEnrolled;
}

// Initialize attendance status from class members
function initializeAttendance() {
    Object.keys(classMembers).forEach(classId => {
        classMembers[classId].forEach(member => {
            const key = `${classId}-${member.id}`;
            attendanceStatus[key] = member.status || 'present';
        });
    });
}

// Open attendance modal
function openAttendance(classId, className) {
    currentClassId = classId;
    document.getElementById('attendanceTitle').textContent = `Mark Attendance - ${className}`;
    document.getElementById('attendanceModal').classList.add('active');

    const members = classMembers[classId] || [];
    const attendanceList = document.getElementById('attendanceList');
    
    if (members.length === 0) {
        attendanceList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No members enrolled in this class yet.</p>';
        return;
    }
    
    attendanceList.innerHTML = members.map(member => {
        const status = attendanceStatus[`${classId}-${member.id}`] || 'present';
        return `
            <div class="attendance-item">
                <div class="member-info">
                    <div class="member-avatar">${member.name.charAt(0)}</div>
                    <div class="member-details">
                        <h3>${member.name}</h3>
                        <p>${member.membership} Member</p>
                    </div>
                </div>
                <div class="toggle-group">
                    <button class="toggle-btn ${status === 'present' ? 'active' : ''}" 
                            onclick="setAttendance(${classId}, ${member.id}, 'present', this)">
                        ✓ Present
                    </button>
                    <button class="toggle-btn ${status === 'absent' ? 'active absent' : ''}" 
                            onclick="setAttendance(${classId}, ${member.id}, 'absent', this)">
                        ✗ Absent
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Close attendance modal
function closeAttendance() {
    document.getElementById('attendanceModal').classList.remove('active');
    currentClassId = null;
}

// Set attendance status
function setAttendance(classId, memberId, status, button) {
    attendanceStatus[`${classId}-${memberId}`] = status;
    
    // Update UI
    const toggleGroup = button.parentElement;
    const buttons = toggleGroup.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'absent');
    });
    
    button.classList.add('active');
    if (status === 'absent') {
        button.classList.add('absent');
    }
}

// Save attendance
function saveAttendance() {
    if (!currentClassId) return;
    
    const members = classMembers[currentClassId] || [];
    const presentCount = members.filter(m => 
        attendanceStatus[`${currentClassId}-${m.id}`] === 'present'
    ).length;
    
    const className = trainerClasses.find(c => c.id === currentClassId)?.name || 'Class';
    
    showNotification(
        `Attendance saved for ${className}: ${presentCount}/${members.length} present`,
        'success'
    );
    
    // Update the class members status
    members.forEach(member => {
        member.status = attendanceStatus[`${currentClassId}-${member.id}`];
    });
    
    closeAttendance();
}

// View class details
function viewClassDetails(classId) {
    const classData = trainerClasses.find(c => c.id === classId);
    if (!classData) return;
    
    const members = classMembers[classId] || [];
    const presentCount = members.filter(m => m.status === 'present').length;
    
    const details = `
        Class: ${classData.name}
        Time: ${classData.time}
        Room: ${classData.room}
        Date: ${classData.date}
        Enrolled: ${classData.enrolled}/${classData.capacity}
        Present: ${presentCount}/${members.length}
    `;
    
    alert(details);
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
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('attendanceModal');
    if (event.target === modal) {
        closeAttendance();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        closeAttendance();
    }
    
    // Ctrl/Cmd + S saves attendance
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentClassId) {
            saveAttendance();
        }
    }
});

// Auto-refresh class data every 30 seconds
setInterval(() => {
    // In production, this would fetch fresh data from the API
    console.log('Auto-refreshing class data...');
}, 30000);