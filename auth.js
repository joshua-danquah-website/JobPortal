// API Configuration
const API_URL = 'http://localhost:5000/api';

// Authentication state management
const auth = {
    user: null,
    token: null,
    isAuthenticated: false,

    // Initialize auth state from localStorage
    init() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (token && user) {
            this.token = token;
            this.user = user;
            this.isAuthenticated = true;
            this.updateUI();
        }
    },

    // Update UI based on auth state
    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;

        if (this.isAuthenticated) {
            authButtons.innerHTML = `
                <div class="user-menu">
                    <button class="btn btn-secondary" onclick="auth.toggleUserMenu()">
                        <i class="fas fa-user-circle"></i>
                        ${this.user.firstName}
                    </button>
                    <div class="user-dropdown">
                        <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                        <a href="applications.html"><i class="fas fa-file-alt"></i> My Applications</a>
                        <a href="saved-jobs.html"><i class="fas fa-bookmark"></i> Saved Jobs</a>
                        <a href="#" onclick="auth.logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="#" class="btn btn-secondary" id="signinBtn">Sign in</a>
                <a href="#" class="btn btn-primary" id="joinBtn">Join now</a>
            `;
        }
    },

    // Toggle user menu dropdown
    toggleUserMenu() {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    },

    // Register new user
    async register(userData) {
        try {
            utils.showLoading('joinForm', 'Creating account...');
            
            const data = await utils.apiRequest(`${API_URL}/auth/register`, {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            this.setAuthState(data);
            utils.showNotification('Account created successfully!', 'success');
            return data;
        } catch (error) {
            utils.handleError(error, 'joinForm');
            throw error;
        } finally {
            utils.hideLoading('joinForm');
        }
    },

    // Login user
    async login(credentials) {
        try {
            utils.showLoading('signinForm', 'Signing in...');
            
            const data = await utils.apiRequest(`${API_URL}/auth/login`, {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            this.setAuthState(data);
            utils.showNotification('Successfully signed in!', 'success');
            return data;
        } catch (error) {
            utils.handleError(error, 'signinForm');
            throw error;
        } finally {
            utils.hideLoading('signinForm');
        }
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        this.updateUI();
        utils.showNotification('Successfully logged out', 'success');
        window.location.href = 'index.html';
    },

    // Set authentication state
    setAuthState(data) {
        this.token = data.token;
        this.user = data.user;
        this.isAuthenticated = true;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.updateUI();
    },

    // Check if user is authenticated
    checkAuth() {
        return this.isAuthenticated;
    },

    // Get auth token
    getToken() {
        return this.token;
    },

    // Get current user
    getCurrentUser() {
        return this.user;
    },

    // Check if user has required role
    hasRole(role) {
        return this.isAuthenticated && this.user.role === role;
    },

    // Require authentication for protected routes
    requireAuth() {
        if (!this.isAuthenticated) {
            utils.showNotification('Please sign in to access this page', 'warning');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    // Require specific role for protected routes
    requireRole(role) {
        if (!this.hasRole(role)) {
            utils.showNotification('You do not have permission to access this page', 'error');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});

// Export auth object
window.auth = auth; 