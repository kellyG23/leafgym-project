const API_URL = 'http://localhost:8080/api';
let selectedPortal = 'member';

// Portal selection
document.querySelectorAll('.portal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.portal-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedPortal = this.dataset.portal;

        // Clear any error messages
        document.getElementById('errorMessage').classList.remove('show');
    });
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.querySelector('.login-btn');

    // Clear previous errors
    errorMessage.classList.remove('show');
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                portal: selectedPortal,
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            // Store user data in sessionStorage
            sessionStorage.setItem('user', JSON.stringify(data));

            // Redirect based on user type
            if (data.userType === 'member') {
                window.location.href = 'member-dashboard.html';
            } else if (data.userType === 'staff') {
                // Redirect based on staff role
                switch(data.role) {
                    case 'Trainer':
                        window.location.href = 'trainer-dashboard.html';
                        break;
                    case 'Front Desk':
                        window.location.href = 'frontdesk-dashboard.html';
                        break;
                    case 'Manager':
                        window.location.href = 'manager-dashboard.html';
                        break;
                    case 'Admin':
                        window.location.href = 'admin-dashboard.html';
                        break;
                    default:
                        window.location.href = 'staff-dashboard.html';
                }
            }
        } else {
            // Show error message
            errorMessage.textContent = data.message || 'Invalid username or password';
            errorMessage.classList.add('show');
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Connection error. Please make sure the server is running.';
        errorMessage.classList.add('show');
    } finally {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
});

// Quick fill demo credentials (for testing)
document.querySelectorAll('.cred-item span').forEach(span => {
    span.style.cursor = 'pointer';
    span.addEventListener('click', function() {
        const [username, password] = this.textContent.split(' / ');
        document.getElementById('username').value = username.trim();
        document.getElementById('password').value = password.trim();

        // Auto-select correct portal
        const credText = this.parentElement.querySelector('strong').textContent;
        if (credText.includes('Member')) {
            document.querySelector('[data-portal="member"]').click();
        } else {
            document.querySelector('[data-portal="staff"]').click();
        }
    });
});