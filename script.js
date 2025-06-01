document.addEventListener('DOMContentLoaded', function() {
    // Basic functionality for the salary range slider on jobs.html
    const salaryRange = document.getElementById('salaryRange');
    const salaryValue = document.getElementById('salaryValue');

    if (salaryRange && salaryValue) {
        salaryValue.textContent = `$${salaryRange.value}+`; // Initial value
        salaryRange.oninput = function() {
            salaryValue.textContent = `$${this.value}+`;
        };
    }

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            updatePasswordStrengthIndicator(strength);
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            validatePasswordMatch(password, confirmPassword);
        });
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                // Show success message
                showNotification('Form submitted successfully!', 'success');
                // In a real application, you would submit the form data to a server here
            }
        });
    });

    // Real-time input validation
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });

    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('btn-google') ? 'Google' : 'LinkedIn';
            showNotification(`Signing in with ${provider}...`, 'info');
            // Here you would implement the OAuth flow for the selected provider
        });
    });

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength meter
    if (passwordInput) {
        const strengthMeter = document.querySelector('.strength-meter');
        const strengthText = document.querySelector('.strength-text span');

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            let feedback = '';

            // Length check
            if (password.length >= 8) strength += 1;
            
            // Contains number
            if (/\d/.test(password)) strength += 1;
            
            // Contains lowercase
            if (/[a-z]/.test(password)) strength += 1;
            
            // Contains uppercase
            if (/[A-Z]/.test(password)) strength += 1;
            
            // Contains special character
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;

            // Update strength meter
            strengthMeter.className = 'strength-meter';
            if (strength <= 2) {
                strengthMeter.classList.add('weak');
                feedback = 'Too weak';
            } else if (strength === 3) {
                strengthMeter.classList.add('medium');
                feedback = 'Medium';
            } else if (strength === 4) {
                strengthMeter.classList.add('strong');
                feedback = 'Strong';
            } else {
                strengthMeter.classList.add('very-strong');
                feedback = 'Very strong';
            }

            strengthText.textContent = feedback;
        });
    }

    // Form submission handling
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.email.value;
            const password = this.password.value;
            const remember = this.remember?.checked;

            try {
                // Here you would typically make an API call to your backend
                console.log('Signing in with:', { email, password, remember });
                
                // Simulate successful login
                alert('Successfully signed in!');
                signinModal.classList.remove('show');
                // Update UI to show logged in state
            } catch (error) {
                alert('Error signing in. Please try again.');
            }
        });
    }

    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
        joinForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const firstName = this.firstName.value;
            const lastName = this.lastName.value;
            const email = this.joinEmail.value;
            const password = this.joinPassword.value;
            const confirmPassword = this.confirmPassword.value;
            const terms = this.terms.checked;

            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Validate terms acceptance
            if (!terms) {
                alert('Please accept the Terms of Service and Privacy Policy');
                return;
            }

            try {
                // Here you would typically make an API call to your backend
                console.log('Creating account for:', { firstName, lastName, email });
                
                // Simulate successful registration
                alert('Account created successfully!');
                joinModal.classList.remove('show');
                // Update UI to show logged in state
            } catch (error) {
                alert('Error creating account. Please try again.');
            }
        });
    }

    // Modal functionality
    const signinModal = document.getElementById('signinModal');
    const joinModal = document.getElementById('joinModal');
    const signinBtn = document.getElementById('signinBtn');
    const joinBtn = document.getElementById('joinBtn');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modals
    if (signinBtn) {
        signinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (signinModal) {
                signinModal.style.display = 'block';
                setTimeout(() => {
                    signinModal.classList.add('show');
                }, 10);
            }
        });
    }

    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (joinModal) {
                joinModal.style.display = 'block';
                setTimeout(() => {
                    joinModal.classList.add('show');
                }, 10);
            }
        });
    }

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (signinModal) {
                signinModal.classList.remove('show');
                setTimeout(() => {
                    signinModal.style.display = 'none';
                }, 300);
            }
            if (joinModal) {
                joinModal.classList.remove('show');
                setTimeout(() => {
                    joinModal.style.display = 'none';
                }, 300);
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === signinModal) {
            signinModal.classList.remove('show');
            setTimeout(() => {
                signinModal.style.display = 'none';
            }, 300);
        }
        if (e.target === joinModal) {
            joinModal.classList.remove('show');
            setTimeout(() => {
                joinModal.style.display = 'none';
            }, 300);
        }
    });
});

// A very basic client-side filter for demonstration (not dynamic like LinkedIn)
function filterJobs() {
    const keyword = document.getElementById('jobKeyword').value.toLowerCase();
    const location = document.getElementById('jobLocation').value.toLowerCase();
    const jobCards = document.querySelectorAll('.job-listings-main .job-card');

    jobCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const comp = card.querySelector('.company').textContent.toLowerCase();
        const loc = card.querySelector('.location').textContent.toLowerCase();
        const description = card.querySelector('.description') ? card.querySelector('.description').textContent.toLowerCase() : '';

        const matchesKeyword = title.includes(keyword) || comp.includes(keyword) || description.includes(keyword);
        const matchesLocation = loc.includes(location);

        if (matchesKeyword && matchesLocation) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function applyFilters() {
    // This function would typically gather all filter criteria (checkboxes, salary range)
    // and send them to a backend API to fetch filtered results.
    // For this static example, it just calls the basic text filter.
    console.log("Applying filters (client-side only for now)...");

    const jobTypeFilters = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"][value="full-time"]:checked, .filter-group input[type="checkbox"][value="part-time"]:checked, .filter-group input[type="checkbox"][value="contract"]:checked, .filter-group input[type="checkbox"][value="remote"]:checked')).map(cb => cb.value);
    const experienceFilters = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"][value="entry-level"]:checked, .filter-group input[type="checkbox"][value="mid-level"]:checked, .filter-group input[type="checkbox"][value="senior"]:checked')).map(cb => cb.value);
    const minSalary = document.getElementById('salaryRange') ? document.getElementById('salaryRange').value : 0;

    console.log("Job Types:", jobTypeFilters);
    console.log("Experience:", experienceFilters);
    console.log("Min Salary:", minSalary);

    // In a real application, you'd make an AJAX call here:
    // fetch(/api/jobs?keyword=${keyword}&location=${location}&jobType=${jobTypeFilters.join(',')}&experience=${experienceFilters.join(',')}&minSalary=${minSalary})
    //    .then(response => response.json())
    //    .then(data => {
    //        // Update job listings dynamically based on 'data'
    //    });

    filterJobs(); // Re-apply the basic text filter for this static demo
    alert("Filters applied! (Note: Advanced filtering requires backend implementation)");
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[^a-zA-Z0-9]+/)) strength++;
    
    return strength;
}

// Update password strength indicator
function updatePasswordStrengthIndicator(strength) {
    const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    const strengthColors = ['#ff4444', '#ffbb33', '#ffeb3b', '#00C851', '#007E33'];
    
    let strengthIndicator = document.getElementById('password-strength');
    if (!strengthIndicator) {
        strengthIndicator = document.createElement('div');
        strengthIndicator.id = 'password-strength';
        document.getElementById('password').parentNode.appendChild(strengthIndicator);
    }
    
    strengthIndicator.innerHTML = `
        <div class="strength-meter">
            <div class="strength-meter-fill" style="width: ${(strength / 5) * 100}%; background-color: ${strengthColors[strength - 1]}"></div>
        </div>
        <span style="color: ${strengthColors[strength - 1]}">${strengthText[strength - 1]}</span>
    `;
}

// Validate password match
function validatePasswordMatch(password, confirmPassword) {
    const matchIndicator = document.getElementById('password-match');
    if (!matchIndicator) {
        const indicator = document.createElement('div');
        indicator.id = 'password-match';
        document.getElementById('confirmPassword').parentNode.appendChild(indicator);
    }
    
    if (password === confirmPassword) {
        matchIndicator.innerHTML = '<span style="color: #00C851">✓ Passwords match</span>';
    } else {
        matchIndicator.innerHTML = '<span style="color: #ff4444">✗ Passwords do not match</span>';
    }
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Input validation
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            errorMessage = 'Please enter a valid email address';
            break;
            
        case 'tel':
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            isValid = phoneRegex.test(value);
            errorMessage = 'Please enter a valid phone number';
            break;
            
        case 'password':
            isValid = value.length >= 8;
            errorMessage = 'Password must be at least 8 characters long';
            break;
            
        default:
            isValid = value.length > 0;
            errorMessage = 'This field is required';
    }
    
    // Update input styling
    input.classList.toggle('invalid', !isValid);
    
    // Show/hide error message
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement && !isValid) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.appendChild(errorElement);
    }
    
    if (errorElement) {
        errorElement.textContent = isValid ? '' : errorMessage;
    }
    
    return isValid;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class after a small delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
}

// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const signinBtn = document.getElementById('signinBtn');
const joinBtn = document.getElementById('joinBtn');
const signinModal = document.getElementById('signinModal');
const joinModal = document.getElementById('joinModal');
const signinForm = document.getElementById('signinForm');
const joinForm = document.getElementById('joinForm');
const closeButtons = document.querySelectorAll('.close-modal');
const searchForm = document.querySelector('.search-bar-home');
const jobListings = document.querySelector('.job-listings');

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Event Listeners
signinBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(signinModal);
});

joinBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(joinModal);
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        closeModal(signinModal);
        closeModal(joinModal);
    });
});

window.addEventListener('click', (e) => {
    if (e.target === signinModal) closeModal(signinModal);
    if (e.target === joinModal) closeModal(joinModal);
});

// Authentication Functions
async function registerUser(userData) {
    try {
        utils.showLoading('joinForm', 'Creating account...');
        
        const data = await utils.apiRequest(`${API_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        closeModal(joinModal);
        updateUIForLoggedInUser(data.user);
        utils.showNotification('Account created successfully!', 'success');
        return data;
    } catch (error) {
        utils.handleError(error, 'joinForm');
    } finally {
        utils.hideLoading('joinForm');
    }
}

async function loginUser(credentials) {
    try {
        utils.showLoading('signinForm', 'Signing in...');
        
        const data = await utils.apiRequest(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        closeModal(signinModal);
        updateUIForLoggedInUser(data.user);
        utils.showNotification('Successfully signed in!', 'success');
        return data;
    } catch (error) {
        utils.handleError(error, 'signinForm');
    } finally {
        utils.hideLoading('signinForm');
    }
}

// Form Submissions
joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validation.validateForm(joinForm)) {
        return;
    }

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('joinEmail').value,
        password: document.getElementById('joinPassword').value,
        role: 'jobseeker' // Default role
    };

    try {
        await auth.register(formData);
        closeModal(joinModal);
    } catch (error) {
        console.error('Registration failed:', error);
    }
});

// Sign In Form Submission
if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = signinForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const spinner = submitButton.querySelector('.spinner');
        
        try {
            // Show loading state
            submitButton.disabled = true;
            buttonText.style.opacity = '0';
            spinner.style.display = 'block';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            // Validate form
            if (!email || !password) {
                throw new Error('Please fill in all required fields');
            }

            // Simulate API call (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Store user data (replace with actual API response)
            const userData = {
                firstName: 'John', // Replace with actual user data
                lastName: 'Doe',   // Replace with actual user data
                email: email,
                role: 'jobseeker'  // Replace with actual user role
            };
            
            localStorage.setItem('user', JSON.stringify(userData));

            // Show success message
            showNotification('Successfully signed in!', 'success');
            
            // Close modal
            signinModal.classList.remove('show');
            setTimeout(() => {
                signinModal.style.display = 'none';
            }, 300);
            
            // Update UI
            updateUIForLoggedInUser(userData);

        } catch (error) {
            // Show error message
            showNotification(error.message || 'Invalid email or password', 'error');
            
            // Highlight the form fields
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (emailInput) emailInput.classList.add('invalid');
            if (passwordInput) passwordInput.classList.add('invalid');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error.message || 'Invalid email or password';
            signinForm.insertBefore(errorDiv, submitButton);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.style.opacity = '1';
            spinner.style.display = 'none';
        }
    });
}

// Forgot password handler
const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        if (!email) {
            utils.showNotification('Please enter your email address', 'warning');
            return;
        }
        
        try {
            utils.showLoading('signinForm', 'Sending reset link...');
            await auth.forgotPassword(email);
            utils.showNotification('Password reset link sent to your email', 'success');
        } catch (error) {
            utils.handleError(error, 'signinForm');
        } finally {
            utils.hideLoading('signinForm');
        }
    });
}

// Social sign-in handlers
const googleSignInBtn = document.querySelector('.btn-google');
const linkedinSignInBtn = document.querySelector('.btn-linkedin');

if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
        try {
            utils.showLoading('signinForm', 'Connecting to Google...');
            await auth.socialSignIn('google');
        } catch (error) {
            utils.handleError(error, 'signinForm');
        } finally {
            utils.hideLoading('signinForm');
        }
    });
}

if (linkedinSignInBtn) {
    linkedinSignInBtn.addEventListener('click', async () => {
        try {
            utils.showLoading('signinForm', 'Connecting to LinkedIn...');
            await auth.socialSignIn('linkedin');
        } catch (error) {
            utils.handleError(error, 'signinForm');
        } finally {
            utils.hideLoading('signinForm');
        }
    });
}

// Job Search Functions
async function searchJobs(query) {
    try {
        utils.showLoading('jobListings', 'Searching jobs...');
        
        const data = await utils.apiRequest(`${API_URL}/jobs?${new URLSearchParams(query)}`);
        displayJobs(data.jobs);
        return data;
    } catch (error) {
        utils.handleError(error, 'jobListings');
    } finally {
        utils.hideLoading('jobListings');
    }
}

function displayJobs(jobs) {
    if (!jobs || jobs.length === 0) {
        jobListings.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    jobListings.innerHTML = jobs.map(job => `
        <div class="job-card">
            <div class="job-header">
                <img src="${job.company.logo || 'images/default-company.png'}" alt="Company Logo" class="company-logo">
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <p class="company">${job.company.name}</p>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                </div>
                <button class="btn-save" onclick="saveJob('${job._id}')" ${!auth.checkAuth() ? 'disabled' : ''}>
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
            <div class="job-details">
                <p class="salary"><i class="fas fa-money-bill-wave"></i> ${job.salary.currency}${job.salary.min} - ${job.salary.max} P.A.</p>
                <p class="job-type"><i class="fas fa-clock"></i> ${job.type}</p>
                <p class="posted"><i class="fas fa-calendar"></i> Posted ${formatDate(job.createdAt)}</p>
            </div>
            <div class="job-actions">
                <a href="job-details.html?id=${job._id}" class="btn btn-primary">Apply now</a>
                <button class="btn btn-secondary" onclick="shareJob('${job._id}')">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `).join('');
}

// Save job function
async function saveJob(jobId) {
    if (!auth.checkAuth()) {
        showLoginPrompt();
        return;
    }

    try {
        utils.showLoading('jobListings', 'Saving job...');
        
        await utils.apiRequest(`${API_URL}/jobs/${jobId}/save`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`
            }
        });

        utils.showNotification('Job saved successfully!', 'success');
    } catch (error) {
        utils.handleError(error, 'jobListings');
    } finally {
        utils.hideLoading('jobListings');
    }
}

// Share job function
function shareJob(jobId) {
    const jobUrl = `${window.location.origin}/job-details.html?id=${jobId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Check out this job opportunity!',
            url: jobUrl
        }).catch(error => {
            utils.handleError(error);
        });
    } else {
        navigator.clipboard.writeText(jobUrl)
            .then(() => {
                utils.showNotification('Job link copied to clipboard!', 'success');
            })
            .catch(error => {
                utils.handleError(error);
            });
    }
}

// Show login prompt
function showLoginPrompt() {
    const signinModal = document.getElementById('signinModal');
    if (signinModal) {
        signinModal.style.display = 'block';
        setTimeout(() => {
            signinModal.classList.add('show');
        }, 10);
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-secondary" onclick="toggleUserMenu()">
                    <i class="fas fa-user"></i>
                    ${user.firstName}
                </button>
                <div class="user-dropdown">
                    <a href="profile.html">
                        <i class="fas fa-user-circle"></i>
                        My Profile
                    </a>
                    <a href="settings.html">
                        <i class="fas fa-cog"></i>
                        Settings
                    </a>
                    <a href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            </div>
        `;
    }
}

function toggleUserMenu() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showNotification('Successfully logged out', 'success');
    location.reload();
}

// Check authentication status on page load
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
        updateUIForLoggedInUser(user);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Load initial jobs
    searchJobs({});
    
    // Handle search form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = searchForm.querySelector('input[type="text"]').value;
        const locationInput = searchForm.querySelector('input[type="text"]:last-of-type').value;
        
        searchJobs({
            search: searchInput,
            location: locationInput
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.querySelector('.user-dropdown');
        const userMenu = document.querySelector('.user-menu');
        
        if (dropdown && userMenu && !userMenu.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
});