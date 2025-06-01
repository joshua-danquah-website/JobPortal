// API Configuration
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const jobDetails = document.getElementById('jobDetails');
const applyButton = document.getElementById('applyButton');
const saveButton = document.getElementById('saveButton');
const shareButton = document.getElementById('shareButton');

// Get job ID from URL
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get('id');

// Fetch and display job details
async function fetchJobDetails() {
    try {
        utils.showLoading('jobDetails', 'Loading job details...');
        
        const job = await utils.apiRequest(`${API_URL}/jobs/${jobId}`);
        displayJobDetails(job);
        updateApplyButton(job);
    } catch (error) {
        utils.handleError(error, 'jobDetails');
    } finally {
        utils.hideLoading('jobDetails');
    }
}

function displayJobDetails(job) {
    jobDetails.innerHTML = `
        <div class="job-header">
            <img src="${job.company.logo || 'images/default-company.png'}" alt="Company Logo" class="company-logo">
            <div class="job-info">
                <h1>${job.title}</h1>
                <p class="company">${job.company.name}</p>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
            </div>
        </div>

        <div class="job-meta">
            <p class="salary"><i class="fas fa-money-bill-wave"></i> ${job.salary.currency}${job.salary.min} - ${job.salary.max} P.A.</p>
            <p class="job-type"><i class="fas fa-clock"></i> ${job.type}</p>
            <p class="experience"><i class="fas fa-user-tie"></i> ${job.experience}</p>
            <p class="posted"><i class="fas fa-calendar"></i> Posted ${formatDate(job.createdAt)}</p>
        </div>

        <div class="job-description">
            <h2>Job Description</h2>
            <p>${job.description}</p>
        </div>

        <div class="job-requirements">
            <h2>Requirements</h2>
            <ul>
                ${job.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>

        <div class="job-responsibilities">
            <h2>Responsibilities</h2>
            <ul>
                ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
            </ul>
        </div>

        <div class="job-skills">
            <h2>Required Skills</h2>
            <div class="skills-tags">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>

        ${job.benefits.length > 0 ? `
            <div class="job-benefits">
                <h2>Benefits</h2>
                <ul>
                    ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <div class="company-info">
            <h2>About ${job.company.name}</h2>
            <p>${job.company.description}</p>
        </div>
    `;
}

function updateApplyButton(job) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
        applyButton.innerHTML = `
            <button class="btn btn-primary" onclick="showLoginPrompt()">
                Sign in to Apply
            </button>
        `;
        return;
    }

    // Check if user has already applied
    const hasApplied = job.applications.some(
        app => app.applicant._id === user.id
    );

    if (hasApplied) {
        applyButton.innerHTML = `
            <button class="btn btn-secondary" disabled>
                Already Applied
            </button>
        `;
    } else {
        applyButton.innerHTML = `
            <button class="btn btn-primary" onclick="applyForJob()">
                Apply Now
            </button>
        `;
    }
}

async function applyForJob() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showLoginPrompt();
            return;
        }

        utils.showLoading('applyButton', 'Submitting application...');
        
        await utils.apiRequest(`${API_URL}/jobs/${jobId}/apply`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        utils.showNotification('Application submitted successfully!', 'success');
        const updatedJob = await fetchJobDetails();
        updateApplyButton(updatedJob);
    } catch (error) {
        utils.handleError(error, 'applyButton');
    } finally {
        utils.hideLoading('applyButton');
    }
}

function showLoginPrompt() {
    // Show login modal
    const signinModal = document.getElementById('signinModal');
    if (signinModal) {
        signinModal.style.display = 'block';
    }
}

function shareJob() {
    const jobUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Check out this job opportunity!',
            url: jobUrl
        }).catch(error => {
            utils.handleError(error);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(jobUrl)
            .then(() => {
                utils.showNotification('Job link copied to clipboard!', 'success');
            })
            .catch(error => {
                utils.handleError(error);
            });
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (jobId) {
        fetchJobDetails();
    } else {
        utils.handleError(new Error('No job ID provided'), 'jobDetails');
    }
}); 