const API_URL = 'http://localhost:8080/api';
let selectedPortal = 'member';

// Portal switching
document.querySelectorAll('.portal-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.portal-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        selectedPortal = this.dataset.portal;
    });
});

// Login form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    await login(username, password);
});

async function login(username, password) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = '';
    
    try {
        console.log('Attempting login with:', { username, portal: selectedPortal }); // Debug
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                portal: selectedPortal,
                username: username,
                password: password
            })
        });
        
        console.log('Response status:', response.status); // Debug
        
        const data = await response.json();
        
        console.log('Full response data:', data); // Debug log
        
        if (data.success) {
            // Save user data
            sessionStorage.setItem('user', JSON.stringify(data));
            
            console.log('User type:', data.userType); // Debug
            console.log('Redirecting to member.html'); // Debug
            
            // Redirect based on user type
            if (data.userType === 'member') {
                // Use absolute path from root
                window.location.href = './member.html';
            } else {
                // Staff portal - redirect based on role
                const role = data.role.toLowerCase().replace(' ', '');
                window.location.href = `./${role}.html`;
            }
        } else {
            errorMsg.textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMsg.textContent = 'Server error. Please ensure backend is running on port 8080.';
    }
}

// Demo credentials quick fill
function fillDemo(username, password, portal) {
    document.querySelector('[name="username"]').value = username;
    document.querySelector('[name="password"]').value = password;
    
    // Select correct portal
    document.querySelectorAll('.portal-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.portal === portal) {
            tab.classList.add('active');
            selectedPortal = portal;
        }
    });
}