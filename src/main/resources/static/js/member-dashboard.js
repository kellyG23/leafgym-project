const API_URL = 'http://localhost:8080/api';
let currentUser = JSON.parse(sessionStorage.getItem('user'));

// Check if user is logged in
if (!currentUser || currentUser.userType !== 'member') {
    window.location.href = 'login.html';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadDashboardData();
    setupNavigation();
    setupCheckInOut();
});

// Load user info in sidebar
function loadUserInfo() {
    document.getElementById('userName').textContent = currentUser.fullName;
    document.getElementById('userMembership').textContent = currentUser.membershipType;
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            switchPage(page);
        });
    });
}

function switchPage(pageName) {
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'classes': 'Available Classes',
        'attendance': 'My Attendance',
        'facilities': 'Facilities',
        'payments': 'Payment History'
    };
    document.getElementById('pageTitle').textContent = titles[pageName];

    // Show/hide pages
    document.querySelectorAll('.content-page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageName + 'Content').classList.add('active');

    // Load page data
    switch(pageName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'classes':
            loadClassesList();
            break;
        case 'attendance':
            loadAttendance();
            break;
        case 'facilities':
            loadFacilities();
            break;
        case 'payments':
            loadPayments();
            break;
    }
}

function navigateTo(page) {
    document.querySelector(`[data-page="${page}"]`).click();
}

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Dashboard Data
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/members/${currentUser.userId}`);
        const member = await response.json();

        // Update stats
        document.getElementById('membershipType').textContent = member.membershipType?.membershipName || 'None';
        document.getElementById('memberStatus').textContent = member.isActive ? 'Active' : 'Inactive';

        // Calculate days remaining
        if (member.membershipType) {
            const joinDate = new Date(member.dateJoined);
            const duration = member.membershipType.duration;
            const expiryDate = new Date(joinDate);
            expiryDate.setDate(expiryDate.getDate() + duration);
            const today = new Date();
            const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            document.getElementById('daysRemaining').textContent = daysRemaining > 0 ? daysRemaining : '0';
        }

        // Load last visit
        loadLastVisit();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadLastVisit() {
    try {
        const response = await fetch(`${API_URL}/gym-attendance/member/${currentUser.userId}`);
        const attendances = await response.json();
        if (attendances.length > 0) {
            const last = attendances[0];
            document.getElementById('lastVisit').textContent = new Date(last.date).toLocaleDateString();
        }
    } catch (error) {
        document.getElementById('lastVisit').textContent = 'Never';
    }
}

// Check In/Out
function setupCheckInOut() {
    document.getElementById('checkInOutBtn').addEventListener('click', checkInOut);
}

async function checkInOut() {
    try {
        const response = await fetch(`${API_URL}/gym-attendance/check-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberId: currentUser.userId })
        });

        if (response.ok) {
            alert('Checked in successfully!');
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error checking in');
    }
}

// Classes List
async function loadClassesList() {
    try {
        const response = await fetch(`${API_URL}/classes`);
        const classes = await response.json();

        const container = document.getElementById('classesList');

        if (classes.length === 0) {
            container.innerHTML = '<p>No classes available</p>';
            return;
        }

        container.innerHTML = classes.map(gymClass => {
            const isFull = gymClass.enrolledCount >= gymClass.maxSlots;
            const canJoin = currentUser.membershipType !== 'BASIC' || gymClass.className.includes('Basic');

            return `
                <div class="class-card">
                    <div class="class-info">
                        <h3>${gymClass.className}</h3>
                        <div class="class-details">
                            <div class="class-detail-item">
                                <span>👤</span>
                                <span>${gymClass.staff ? gymClass.staff.name : 'No trainer'}</span>
                            </div>
                            <div class="class-detail-item">
                                <span>📅</span>
                                <span>${gymClass.scheduleDate}</span>
                            </div>
                            <div class="class-detail-item">
                                <span>🕐</span>
                                <span>${gymClass.startTime}</span>
                            </div>
                            <div class="class-detail-item">
                                <span>🏢</span>
                                <span>${gymClass.room ? gymClass.room.roomName : 'TBA'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="class-actions">
                        ${isFull ?
                '<span class="slots-badge full">Class Full</span>' :
                '<span class="slots-badge">' + (gymClass.maxSlots - (gymClass.enrolledCount || 0)) + ' slots left</span>'
            }
                        ${!canJoin ?
                '<span class="lock-badge">🔒 Premium/VIP Only</span>' :
                isFull ?
                    '<button class="btn" disabled>Join Class</button>' :
                    '<button class="btn btn-primary" onclick="joinClass(' + gymClass.gymClassId + ')">Join Class</button>'
            }
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading classes:', error);
        document.getElementById('classesList').innerHTML = '<p class="error">Error loading classes</p>';
    }
}

async function joinClass(classId) {
    try {
        const response = await fetch(`${API_URL}/class-attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gymClass: { gymClassId: classId },
                member: { memberId: currentUser.userId },
                attendanceStatus: 'Enrolled'
            })
        });

        if (response.ok) {
            alert('Successfully joined class!');
            loadClassesList();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error joining class');
    }
}

// Attendance
async function loadAttendance() {
    loadGymAttendance();
    loadClassAttendance();

    // Setup tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById(this.dataset.tab + 'AttendanceTab').classList.add('active');
        });
    });
}

async function loadGymAttendance() {
    try {
        const response = await fetch(`${API_URL}/gym-attendance/member/${currentUser.userId}`);
        const attendances = await response.json();

        const tbody = document.getElementById('gymAttendanceBody');
        tbody.innerHTML = attendances.map(att => `
            <tr>
                <td>${new Date(att.date).toLocaleDateString()}</td>
                <td>${att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : '-'}</td>
                <td>${att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : '-'}</td>
                <td>${calculateDuration(att.checkIn, att.checkOut)}</td>
            </tr>
        `).join('') || '<tr><td colspan="4">No attendance records</td></tr>';
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadClassAttendance() {
    try {
        const response = await fetch(`${API_URL}/class-attendance/member/${currentUser.userId}`);
        const attendances = await response.json();

        const tbody = document.getElementById('classAttendanceBody');
        tbody.innerHTML = attendances.map(att => `
            <tr>
                <td>${new Date(att.dateAttended).toLocaleDateString()}</td>
                <td>${att.gymClass.className}</td>
                <td>${att.gymClass.staff ? att.gymClass.staff.name : 'N/A'}</td>
                <td><span class="badge badge-${att.attendanceStatus.toLowerCase()}">${att.attendanceStatus}</span></td>
            </tr>
        `).join('') || '<tr><td colspan="4">No class attendance</td></tr>';
    } catch (error) {
        console.error('Error:', error);
    }
}

function calculateDuration(checkIn, checkOut) {
    if (!checkIn || !checkOut) return '-';
    const duration = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

// Facilities
async function loadFacilities() {
    try {
        const response = await fetch(`${API_URL}/facilities`);
        const facilities = await response.json();

        const container = document.getElementById('facilitiesGrid');
        container.innerHTML = facilities.map(facility => {
            const isVIP = facility.isVipOnly;
            const canUse = !isVIP || currentUser.membershipType === 'VIP';

            return `
                <div class="facility-card ${isVIP ? 'vip-only' : ''}">
                    ${isVIP ? '<div class="vip-badge">⭐ VIP Only</div>' : ''}
                    <h3>${facility.facilityName}</h3>
                    <p class="facility-location">📍 ${facility.location}</p>
                    <p>Capacity: ${facility.capacity}</p>
                    <button class="btn ${canUse ? 'btn-primary' : ''}" 
                            ${!canUse ? 'disabled title="VIP membership required"' : ''}
                            onclick="useFacility(${facility.facilityId})">
                        ${canUse ? 'Use Facility' : '🔒 VIP Only'}
                    </button>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function useFacility(facilityId) {
    try {
        const response = await fetch(`${API_URL}/facility-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                facility: { facilityId: facilityId },
                member: { memberId: currentUser.userId },
                startTime: new Date().toISOString()
            })
        });

        if (response.ok) {
            alert('Facility booked successfully!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error booking facility');
    }
}

// Payments
async function loadPayments() {
    try {
        const response = await fetch(`${API_URL}/payments/member/${currentUser.userId}`);
        const payments = await response.json();

        const tbody = document.getElementById('paymentsBody');
        tbody.innerHTML = payments.map(payment => `
            <tr>
                <td>${new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>₱${payment.amount.toFixed(2)}</td>
                <td>${payment.paymentMethod}</td>
                <td>${payment.referenceNumber}</td>
            </tr>
        `).join('') || '<tr><td colspan="4">No payment history</td></tr>';
    } catch (error) {
        console.error('Error:', error);
    }
}