// Loading state management
const loadingStates = new Map();

function showLoading(elementId, message = 'Loading...') {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Store original content
    loadingStates.set(elementId, element.innerHTML);

    // Create loading spinner
    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p class="loading-message">${message}</p>
        </div>
    `;
    element.innerHTML = loadingHTML;
    element.classList.add('loading');
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Restore original content
    const originalContent = loadingStates.get(elementId);
    if (originalContent) {
        element.innerHTML = originalContent;
        loadingStates.delete(elementId);
    }
    element.classList.remove('loading');
}

// Error handling
function handleError(error, elementId = null) {
    console.error('Error:', error);

    // Show error in UI if elementId is provided
    if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="error-container">
                    <i class="fas fa-exclamation-circle"></i>
                    <p class="error-message">${error.message || 'An error occurred. Please try again.'}</p>
                    <button class="btn btn-secondary" onclick="retryLastAction()">Retry</button>
                </div>
            `;
        }
    }

    // Show error notification
    showNotification(error.message || 'An error occurred. Please try again.', 'error');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        default:
            return 'fa-info-circle';
    }
}

// API request wrapper
async function apiRequest(url, options = {}) {
    try {
        showLoading('mainContent', 'Loading...');
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        handleError(error);
        throw error;
    } finally {
        hideLoading('mainContent');
    }
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            errorMessage = 'Please enter a valid email address';
            break;

        case 'password':
            isValid = value.length >= 8;
            errorMessage = 'Password must be at least 8 characters long';
            break;

        case 'tel':
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            isValid = phoneRegex.test(value);
            errorMessage = 'Please enter a valid phone number';
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

// Export functions
window.utils = {
    showLoading,
    hideLoading,
    handleError,
    showNotification,
    apiRequest,
    validateForm,
    validateInput
}; 