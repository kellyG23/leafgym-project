const API_URL = 'http://localhost:8080/api';
let currentUser = JSON.parse(sessionStorage.getItem('user'));

// Check authentication
if (!currentUser || currentUser.userType !== 'member') {
    window.location.href = 'login.html';
}

// Check-in/out state
let isCheckedIn = false;
let currentAttendanceId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    checkCurrentStatus();
    loadDashboard();
    setupNavigation();
});

// Load user info
function loadUserInfo() {
    document.getElementById('userName').textContent = currentUser.fullName;
    document.getElementById('userMembership').textContent = currentUser.membershipType;
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(this.dataset.page);
        });
    });
}

function goToPage(page) {
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Show/hide pages
    document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');

    // Load page data
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'classes':
            loadClasses();
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

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/members/${currentUser.userId}`);
        const member = await response.json();

        // Membership Type
        const membershipName = member.membershipType?.membershipName || 'None';
        document.getElementById('membershipType').textContent = membershipName;

        // Status
        document.getElementById('memberStatus').textContent = member.isActive ? 'Active' : 'Inactive';

        // Days Remaining
        if (member.membershipType && member.dateJoined) {
            const joinDate = new Date(member.dateJoined);
            const duration = member.membershipType.duration;
            const expiryDate = new Date(joinDate);
            expiryDate.setDate(expiryDate.getDate() + duration);

            const today = new Date();
            const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            document.getElementById('daysRemaining').textContent = daysLeft > 0 ? daysLeft : 0;
        } else {
            document.getElementById('daysRemaining').textContent = 'N/A';
        }

        // Last Visit
        await loadLastVisit();

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadLastVisit() {
    try {
        const response = await fetch(`${API_URL}/gym-attendance`);
        const allAttendances = await response.json();

        // Filter for this member
        const memberAttendances = allAttendances.filter(att =>
            att.member && att.member.memberId === currentUser.userId
        );

        if (memberAttendances && memberAttendances.length > 0) {
            const latest = memberAttendances.sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            )[0];

            const visitDate = new Date(latest.date);
            document.getElementById('lastVisit').textContent = visitDate.toLocaleDateString();
        } else {
            document.getElementById('lastVisit').textContent = 'Never';
        }
    } catch (error) {
        console.error('Error loading last visit:', error);
        document.getElementById('lastVisit').textContent = 'N/A';
    }
}

// Check In/Out
async function handleCheckInOut() {
    const btn = document.getElementById('checkInOutBtn');

    if (!isCheckedIn) {
        // Check In
        try {
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
            const localDate = now.toISOString().split('T')[0];

            console.log('Checking in with date:', localDate, 'time:', localDateTime);

            const response = await fetch(`${API_URL}/gym-attendance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    member: { memberId: currentUser.userId },
                    checkIn: localDateTime,
                    date: localDate
                })
            });

            if (response.ok) {
                const attendance = await response.json();
                currentAttendanceId = attendance.gymAttendanceId;
                isCheckedIn = true;

                btn.textContent = 'Check Out';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');

                alert(`Checked in successfully at ${now.toLocaleTimeString()}!`);
                loadDashboard();
            } else {
                const errorText = await response.text();
                console.error('Check-in failed:', errorText);
                alert('Error checking in. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error checking in. Please ensure backend is running.');
        }
    } else {
        // Check Out
        if (!currentAttendanceId) {
            alert('No active check-in found.');
            return;
        }

        try {
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

            console.log('Checking out with time:', localDateTime);

            // Get the current attendance record first
            const getResponse = await fetch(`${API_URL}/gym-attendance/${currentAttendanceId}`);
            if (!getResponse.ok) {
                alert('Error retrieving check-in record.');
                return;
            }

            const currentAttendance = await getResponse.json();

            // Update with checkout time
            const response = await fetch(`${API_URL}/gym-attendance/${currentAttendanceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...currentAttendance,
                    checkOut: localDateTime
                })
            });

            if (response.ok) {
                isCheckedIn = false;
                currentAttendanceId = null;

                btn.textContent = 'Check In';
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');

                alert(`Checked out successfully at ${now.toLocaleTimeString()}!`);
                loadDashboard();
            } else {
                const errorText = await response.text();
                console.error('Check-out failed:', errorText);
                alert('Error checking out. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error checking out. Please ensure backend is running.');
        }
    }
}

// Check if user is currently checked in on page load
async function checkCurrentStatus() {
    try {
        const response = await fetch(`${API_URL}/gym-attendance`);
        const allAttendances = await response.json();

        // Filter for this member
        const memberAttendances = allAttendances.filter(att =>
            att.member && att.member.memberId === currentUser.userId
        );

        if (memberAttendances && memberAttendances.length > 0) {
            // Sort by check-in time descending
            const sorted = memberAttendances.sort((a, b) =>
                new Date(b.checkIn) - new Date(a.checkIn)
            );
            const latest = sorted[0];

            // Check if latest attendance is today and has no checkout
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const latestCheckIn = new Date(latest.checkIn);
            const latestDate = latestCheckIn.toISOString().split('T')[0];

            console.log('Checking status - Today:', todayStr, 'Latest:', latestDate, 'Has checkout:', !!latest.checkOut);

            if (latestDate === todayStr && !latest.checkOut) {
                isCheckedIn = true;
                currentAttendanceId = latest.gymAttendanceId;

                const btn = document.getElementById('checkInOutBtn');
                btn.textContent = 'Check Out';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');

                console.log('User is checked in, ID:', currentAttendanceId);
            }
        }
    } catch (error) {
        console.error('Error checking status:', error);
    }
}

// ===== CLASSES =====
async function loadClasses() {
    try {
        const response = await fetch(`${API_URL}/classes`);
        const classes = await response.json();

        const container = document.getElementById('classesContainer');

        if (!classes || classes.length === 0) {
            container.innerHTML = '<p>No classes available</p>';
            return;
        }

        container.innerHTML = classes.map(cls => {
            const enrolledCount = cls.enrolledCount || 0;
            const slotsLeft = cls.maxSlots - enrolledCount;
            const isFull = slotsLeft <= 0;

            // Check if member can join (Basic members can't join Premium/VIP classes)
            const isBasicMember = currentUser.membershipType === 'Basic';
            const isPremiumClass = cls.className.toLowerCase().includes('premium') ||
                cls.className.toLowerCase().includes('vip');
            const canJoin = !isBasicMember || !isPremiumClass;

            return `
                <div class="class-card">
                    <div class="class-header">
                        <h3>${cls.className}</h3>
                        ${!canJoin ? '<span class="lock-icon">🔒</span>' : ''}
                    </div>
                    <div class="class-details">
                        <p><strong>👤 Trainer:</strong> ${cls.staff?.name || 'TBA'}</p>
                        <p><strong>📅 Date:</strong> ${cls.scheduleDate || 'TBA'}</p>
                        <p><strong>🕐 Time:</strong> ${cls.startTime || 'TBA'} - ${cls.endTime || 'TBA'}</p>
                        <p><strong>🏢 Room:</strong> ${cls.room?.roomName || 'TBA'}</p>
                        <p><strong>👥 Slots:</strong> ${slotsLeft} / ${cls.maxSlots}</p>
                    </div>
                    <div class="class-actions">
                        ${!canJoin ?
                '<span class="badge badge-warning">Premium/VIP Only</span>' :
                isFull ?
                    '<button class="btn" disabled>Class Full</button>' :
                    `<button class="btn btn-primary" onclick="joinClass(${cls.gymClassId})">Join Class</button>`
            }
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading classes:', error);
        document.getElementById('classesContainer').innerHTML = '<p>Error loading classes</p>';
    }
}

async function joinClass(classId) {
    if (!confirm('Join this class?')) return;

    try {
        const today = new Date().toISOString().split('T')[0];

        const response = await fetch(`${API_URL}/class-attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gymClass: { gymClassId: classId },
                member: { memberId: currentUser.userId },
                dateAttended: today,
                attendanceStatus: 'Enrolled'
            })
        });

        if (response.ok) {
            alert('Successfully joined class!');
            loadClasses();
        } else {
            alert('Failed to join class. You may already be enrolled.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error joining class');
    }
}

// ===== ATTENDANCE =====
function switchTab(tabName) {
    // Switch buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Switch content
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
}

async function loadAttendance() {
    loadGymAttendance();
    loadClassAttendance();
}

async function loadGymAttendance() {
    try {
        const response = await fetch(`${API_URL}/gym-attendance`);
        const allAttendances = await response.json();

        // Filter for this member
        const attendances = allAttendances.filter(att =>
            att.member && att.member.memberId === currentUser.userId
        );

        const tbody = document.getElementById('gymAttendanceTable');

        if (!attendances || attendances.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No gym attendance records</td></tr>';
            return;
        }

        // Sort by date descending
        attendances.sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = attendances.map(att => {
            const checkIn = att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : '-';
            const checkOut = att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : '-';
            const duration = calculateDuration(att.checkIn, att.checkOut);

            return `
                <tr>
                    <td>${new Date(att.date).toLocaleDateString()}</td>
                    <td>${checkIn}</td>
                    <td>${checkOut}</td>
                    <td>${duration}</td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('gymAttendanceTable').innerHTML =
            '<tr><td colspan="4">Error loading attendance</td></tr>';
    }
}

async function loadClassAttendance() {
    try {
        const response = await fetch(`${API_URL}/class-attendance`);
        const allAttendances = await response.json();

        // Filter for this member
        const attendances = allAttendances.filter(att =>
            att.member && att.member.memberId === currentUser.userId
        );

        const tbody = document.getElementById('classAttendanceTable');

        if (!attendances || attendances.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No class attendance records</td></tr>';
            return;
        }

        // Sort by date descending
        attendances.sort((a, b) => new Date(b.dateAttended) - new Date(a.dateAttended));

        tbody.innerHTML = attendances.map(att => `
            <tr>
                <td>${new Date(att.dateAttended).toLocaleDateString()}</td>
                <td>${att.gymClass?.className || 'N/A'}</td>
                <td>${att.gymClass?.staff?.name || 'N/A'}</td>
                <td><span class="badge badge-${att.attendanceStatus.toLowerCase()}">${att.attendanceStatus}</span></td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('classAttendanceTable').innerHTML =
            '<tr><td colspan="4">Error loading attendance</td></tr>';
    }
}

function calculateDuration(checkIn, checkOut) {
    if (!checkIn || !checkOut) return '-';

    const diff = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
}

// ===== FACILITIES =====
async function loadFacilities() {
    try {
        const response = await fetch(`${API_URL}/facilities`);
        const facilities = await response.json();

        const container = document.getElementById('facilitiesContainer');

        if (!facilities || facilities.length === 0) {
            container.innerHTML = '<p>No facilities available</p>';
            return;
        }

        container.innerHTML = facilities.map(facility => {
            const isVIP = facility.isVipOnly;
            const userIsVIP = currentUser.membershipType === 'VIP';
            const canUse = !isVIP || userIsVIP;

            return `
                <div class="facility-card ${isVIP ? 'vip-facility' : ''}">
                    ${isVIP ? '<span class="vip-badge">⭐ VIP Only</span>' : ''}
                    <h3>${facility.facilityName}</h3>
                    <p class="facility-location">📍 ${facility.location}</p>
                    <p class="facility-capacity">Capacity: ${facility.capacity} people</p>
                    <button 
                        class="btn ${canUse ? 'btn-primary' : ''}" 
                        ${!canUse ? 'disabled title="VIP membership required"' : ''}
                        onclick="useFacility(${facility.facilityId})">
                        ${canUse ? 'Use Facility' : '🔒 VIP Only'}
                    </button>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('facilitiesContainer').innerHTML = '<p>Error loading facilities</p>';
    }
}

async function useFacility(facilityId) {
    if (!confirm('Book this facility?')) return;

    try {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();

        const response = await fetch(`${API_URL}/facility-usage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                facility: { facilityId: facilityId },
                member: { memberId: currentUser.userId },
                startTime: localDateTime
            })
        });

        if (response.ok) {
            alert('Facility booked successfully!');
        } else {
            alert('Failed to book facility');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error booking facility');
    }
}

// ===== PAYMENTS =====
async function loadPayments() {
    try {
        const response = await fetch(`${API_URL}/payments`);
        const allPayments = await response.json();

        // Filter for this member
        const payments = allPayments.filter(payment =>
            payment.member && payment.member.memberId === currentUser.userId
        );

        const tbody = document.getElementById('paymentsTable');

        if (!payments || payments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No payment history</td></tr>';
            return;
        }

        // Sort by date descending
        payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

        tbody.innerHTML = payments.map(payment => `
            <tr>
                <td>${new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>₱${parseFloat(payment.amount).toFixed(2)}</td>
                <td>${payment.paymentMethod}</td>
                <td>${payment.referenceNumber}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('paymentsTable').innerHTML =
            '<tr><td colspan="4">Error loading payments</td></tr>';
    }
}