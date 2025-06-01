// Form validation rules and utilities
const validation = {
    // Validation rules
    rules: {
        required: {
            validate: value => value.trim().length > 0,
            message: 'This field is required'
        },
        email: {
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        password: {
            validate: value => {
                const minLength = 8;
                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumbers = /\d/.test(value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                
                return value.length >= minLength && 
                       hasUpperCase && 
                       hasLowerCase && 
                       hasNumbers && 
                       hasSpecialChar;
            },
            message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character'
        },
        confirmPassword: {
            validate: (value, form) => {
                const password = form.querySelector('input[name="password"]')?.value;
                return value === password;
            },
            message: 'Passwords do not match'
        },
        phone: {
            validate: value => /^\+?[\d\s-]{10,}$/.test(value),
            message: 'Please enter a valid phone number'
        },
        name: {
            validate: value => /^[a-zA-Z\s]{2,50}$/.test(value),
            message: 'Name should only contain letters and spaces (2-50 characters)'
        },
        companyName: {
            validate: value => /^[a-zA-Z0-9\s&.,-]{2,100}$/.test(value),
            message: 'Company name should be 2-100 characters long'
        },
        website: {
            validate: value => {
                if (!value) return true; // Optional
                return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value);
            },
            message: 'Please enter a valid website URL'
        },
        salary: {
            validate: value => /^\d+$/.test(value) && parseInt(value) > 0,
            message: 'Please enter a valid salary amount'
        },
        experience: {
            validate: value => /^\d+$/.test(value) && parseInt(value) >= 0,
            message: 'Please enter a valid number of years'
        }
    },

    // Validate a single input field
    validateField(input) {
        const value = input.value.trim();
        const rules = input.dataset.validate ? input.dataset.validate.split(' ') : [];
        let isValid = true;
        let errorMessage = '';

        // Check each rule
        for (const rule of rules) {
            if (this.rules[rule]) {
                const validationResult = this.rules[rule].validate(value, input.form);
                if (!validationResult) {
                    isValid = false;
                    errorMessage = this.rules[rule].message;
                    break;
                }
            }
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
    },

    // Validate an entire form
    validateForm(form) {
        const inputs = form.querySelectorAll('input[data-validate], select[data-validate], textarea[data-validate]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    // Add real-time validation to a form
    addRealTimeValidation(form) {
        const inputs = form.querySelectorAll('input[data-validate], select[data-validate], textarea[data-validate]');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            // Validate on input for password fields
            if (input.type === 'password') {
                input.addEventListener('input', () => {
                    this.validateField(input);
                });
            }
        });
    },

    // Initialize password strength meter
    initPasswordStrengthMeter(passwordInput, strengthMeter) {
        if (!passwordInput || !strengthMeter) return;

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = this.calculatePasswordStrength(password);
            this.updatePasswordStrengthMeter(strengthMeter, strength);
        });
    },

    // Calculate password strength (0-4)
    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    },

    // Update password strength meter UI
    updatePasswordStrengthMeter(meter, strength) {
        const strengthClasses = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];
        const strengthTexts = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const strengthColors = ['#ff4444', '#ffbb33', '#ffeb3b', '#00C851', '#007E33'];

        // Remove all strength classes
        strengthClasses.forEach(className => meter.classList.remove(className));

        // Add current strength class
        meter.classList.add(strengthClasses[strength - 1]);

        // Update strength text and color
        const strengthText = meter.querySelector('.strength-text span');
        if (strengthText) {
            strengthText.textContent = strengthTexts[strength - 1];
            strengthText.style.color = strengthColors[strength - 1];
        }
    }
};

// Initialize validation on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add real-time validation to all forms
    document.querySelectorAll('form').forEach(form => {
        validation.addRealTimeValidation(form);
    });

    // Initialize password strength meters
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const strengthMeter = input.parentNode.querySelector('.strength-meter');
        if (strengthMeter) {
            validation.initPasswordStrengthMeter(input, strengthMeter);
        }
    });
});

// Export validation object
window.validation = validation; 