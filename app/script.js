// Add interactivity to the application

const HEALTH_REPORT_URL = 'http://localhost:5678/webhook/6c463884-4585-49cf-8bce-54550d72a219';
const VISIT_SUMMARY_URL = 'http://localhost:5678/webhook/ab65e937-ea02-4b01-bfa3-12f0aea96f23';
const REPORT_PLACEHOLDER_TEXT = 'Select an action to load your latest report.';
const ADD_RECORD_FORM_URL = 'http://localhost:5678/form/7d2a842a-4de7-4fff-8427-0eb48b964a9f';
const DOCTOR_INSTRUCTIONS_FORM_URL = 'http://localhost:5678/form/cf692921-418d-4071-96c3-e866d2872caa';
const REPORT_CONFIGS = {
    healthProfile: {
        title: 'My Health Profile',
        url: HEALTH_REPORT_URL,
        loadingMessage: 'Loading latest health profile...'
    },
    visitSummary: {
        title: 'Visit Summary',
        url: VISIT_SUMMARY_URL,
        loadingMessage: 'Generating visit summary...'
    }
};

let healthReportSection;
let healthReportContent;
let healthReportTitle;
let formModal;
let formModalFrame;
let closeFormModalBtn;
let formModalLoading;
let formModalTitle;

document.addEventListener('DOMContentLoaded', function() {
    // Handle action button clicks
    const actionButtons = document.querySelectorAll('.action-btn');
    healthReportSection = document.getElementById('health-report');
    healthReportContent = document.getElementById('health-report-content');
    healthReportTitle = document.getElementById('health-report-title');
    const closeReportBtn = document.getElementById('close-report-btn');
    const reportActionButtons = document.querySelectorAll('[data-report-action]');
    formModal = document.getElementById('form-modal');
    formModalFrame = document.getElementById('form-modal-frame');
    closeFormModalBtn = document.getElementById('close-form-modal');
    formModalLoading = document.getElementById('form-modal-loading');
    formModalTitle = document.getElementById('form-modal-title');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const label = this.querySelector('.btn-label').textContent;
            console.log(`Clicked: ${label}`);
            
            // Add a subtle click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Here you can add actual functionality for each button
            handleButtonAction(label);
        });
    });

    // Handle header icon clicks
    const iconButtons = document.querySelectorAll('.icon-btn');
    
    iconButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ariaLabel = this.getAttribute('aria-label');
            console.log(`Clicked: ${ariaLabel}`);
            
            // Here you can add functionality for profile, notifications, settings
            handleIconClick(ariaLabel);
        });
    });

    if (closeReportBtn) {
        closeReportBtn.addEventListener('click', hideHealthReport);
    }

    if (healthReportSection) {
        healthReportSection.addEventListener('click', function(event) {
            if (event.target === healthReportSection) {
                hideHealthReport();
            }
        });
    }

    reportActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-report-action');
            handleReportAction(action);
        });
    });

    if (closeFormModalBtn) {
        closeFormModalBtn.addEventListener('click', closeFormModal);
    }

    if (formModal) {
        formModal.addEventListener('click', function(event) {
            if (event.target === formModal) {
                closeFormModal();
            }
        });
    }

    if (formModalFrame) {
        formModalFrame.addEventListener('load', function() {
            if (formModalLoading) {
                formModalLoading.classList.add('hidden');
            }
        });
    }

    if (healthReportContent) {
        renderReportStatus(REPORT_PLACEHOLDER_TEXT);
    }
});

function handleButtonAction(action) {
    // Placeholder for actual functionality
    switch(action) {
        case 'Add New Record':
            openFormModal('Add New Record', ADD_RECORD_FORM_URL);
            break;
        case 'Record Doctor\'s Instructions':
            openFormModal('Record Doctor\'s Instructions', DOCTOR_INSTRUCTIONS_FORM_URL);
            break;
        case 'View Health Profile':
            fetchReport(REPORT_CONFIGS.healthProfile);
            break;
        case 'Generate Visit Summary':
            fetchReport(REPORT_CONFIGS.visitSummary);
            break;
        default:
            console.log(`Action: ${action}`);
    }
}

function handleIconClick(icon) {
    // Placeholder for actual functionality
    switch(icon) {
        case 'Profile':
            alert('Profile settings coming soon!');
            break;
        case 'Notifications':
            alert('Notifications coming soon!');
            break;
        case 'Settings':
            alert('Settings coming soon!');
            break;
        default:
            console.log(`Icon clicked: ${icon}`);
    }
}

function fetchReport(config) {
    if (!healthReportSection || !healthReportContent || !config) {
        return;
    }

    if (healthReportTitle && config.title) {
        healthReportTitle.textContent = config.title;
    }

    healthReportSection.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderReportStatus(config.loadingMessage || 'Loading latest report...', 'loading');

    fetch(config.url, { headers: { Accept: 'application/json' } })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(payload => {
            if (!payload || typeof payload.html !== 'string') {
                throw new Error('Malformed response: missing html content');
            }

            const reportCard = document.createElement('div');
            reportCard.className = 'report-card';
            const fragment = document.createRange().createContextualFragment(payload.html);
            reportCard.appendChild(fragment);

            healthReportContent.innerHTML = '';
            healthReportContent.appendChild(reportCard);
            reexecuteEmbeddedScripts(reportCard);
        })
        .catch(error => {
            console.error('Failed to load health report:', error);
            renderReportStatus('Unable to load your health report right now. Please try again later.', 'error');
        });
}

function hideHealthReport() {
    if (!healthReportSection || !healthReportContent) {
        return;
    }

    healthReportSection.classList.add('hidden');
    document.body.style.overflow = '';
    renderReportStatus(REPORT_PLACEHOLDER_TEXT);

    if (healthReportTitle) {
        healthReportTitle.textContent = REPORT_CONFIGS.healthProfile.title;
    }
}

function renderReportStatus(message, type = 'info') {
    if (!healthReportContent) {
        return;
    }

    const spinner = type === 'loading' ? '<div class="report-loading-spinner"></div>' : '';
    const statusClass = type === 'error' ? 'report-error' : 'report-status';

    healthReportContent.innerHTML = `
        <div class="report-status-wrapper">
            ${spinner}
            <p class="${statusClass}">${message}</p>
        </div>
    `;
}

function handleReportAction(action) {
    if (!action) {
        return;
    }

    if (action === 'print') {
        window.print();
        return;
    }

    if (action === 'share') {
        if (navigator.share) {
            navigator.share({
                title: 'Aura • My Health Profile',
                text: 'Sharing my latest health profile from Aura.',
                url: window.location.href
            }).catch(error => {
                console.warn('Share cancelled or failed:', error);
            });
        } else {
            alert('Sharing is not supported on this device/browser.');
        }
    }
}

function reexecuteEmbeddedScripts(container) {
    if (!container) {
        return;
    }

    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');

        // Copy all attributes (src, type, etc.)
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });

        if (!oldScript.src) {
            newScript.textContent = oldScript.textContent;
        }

        oldScript.replaceWith(newScript);
    });
}

function openFormModal(title, url) {
    if (!formModal || !formModalFrame) {
        return;
    }

    formModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (formModalLoading) {
        formModalLoading.classList.remove('hidden');
    }

    if (formModalTitle && title) {
        formModalTitle.textContent = title;
    }

    // Force reload each time to ensure a fresh form
    formModalFrame.src = url;
    formModalFrame.title = `${title} Form`;
    formModalFrame.focus();
}

function closeFormModal() {
    if (!formModal || !formModalFrame) {
        return;
    }

    formModal.classList.add('hidden');
    document.body.style.overflow = '';

    // Reset iframe and loading state for next open
    formModalFrame.src = 'about:blank';
    if (formModalLoading) {
        formModalLoading.classList.remove('hidden');
    }
}

