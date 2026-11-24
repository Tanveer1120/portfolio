/**
 * Student Portfolio Form Controller
 * 12-Step Architecture with Category Selection, Dynamic Repeaters,
 * Mandatory Back Button Navigation System, and Data Loss Prevention.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wizard Steps (0: Category Selection, 1-11: Sections, 12: Template Selection)
  let currentStep = 0;
  const totalSteps = 12;
  let selectedCategory = 'Computer Science / IT';
  let selectedTemplate = 'corporate-professional';
  let profilePhotoBase64 = '';

  // Step Labels for Header Pill List
  const stepTitles = [
    'Category',
    'Personal Info',
    'Career Objective',
    'Education',
    'Skills',
    'Projects',
    'Experience',
    'Certifications',
    'Achievements',
    'Workshops',
    'Extracurricular',
    'Additional Info',
    'Template'
  ];

  // DOM Elements
  const stepPanels = document.querySelectorAll('.form-step-panel');
  const stepperProgressFill = document.getElementById('stepperProgressFill');
  const stepperStepIndicator = document.getElementById('stepperStepIndicator');
  const stepperCategoryPill = document.getElementById('stepperCategoryPill');
  const stepperPillsList = document.getElementById('stepperPillsList');
  const autoSaveBadge = document.getElementById('autoSaveBadge');

  // Containers for Repeaters
  const educationContainer = document.getElementById('educationContainer');
  const projectsContainer = document.getElementById('projectsContainer');
  const experienceContainer = document.getElementById('experienceContainer');
  const certsContainer = document.getElementById('certsContainer');
  const achievementsContainer = document.getElementById('achievementsContainer');
  const workshopsContainer = document.getElementById('workshopsContainer');
  const extracurricularsContainer = document.getElementById('extracurricularsContainer');

  // Photo Upload Elements
  const photoFileInput = document.getElementById('photoFileInput');
  const photoPreviewImg = document.getElementById('photoPreviewImg');
  const photoPlaceholderSvg = document.getElementById('photoPlaceholderSvg');
  const removePhotoBtn = document.getElementById('removePhotoBtn');

  // Category Cards
  const categoryCards = document.querySelectorAll('.category-choice-card');

  // Template Cards
  const templateCards = document.querySelectorAll('.template-picker-card');

  // =========================================================================
  // 1. STEP NAVIGATION & UI CONTROLLER
  // =========================================================================
  function renderStep(stepIndex, pushHistory = true) {
    currentStep = stepIndex;

    // Show active step panel
    stepPanels.forEach(panel => {
      const pStep = parseInt(panel.getAttribute('data-step'), 10);
      if (pStep === currentStep) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update progress bar
    if (stepperProgressFill) {
      const pct = Math.round((currentStep / totalSteps) * 100);
      stepperProgressFill.style.width = `${pct}%`;
    }

    if (stepperStepIndicator) {
      stepperStepIndicator.textContent = `Step ${currentStep} of ${totalSteps}: ${stepTitles[currentStep] || ''}`;
    }

    if (stepperCategoryPill) {
      stepperCategoryPill.textContent = selectedCategory;
    }

    // Update pill buttons
    renderStepperPills();

    // Scroll to top of builder
    const topBar = document.querySelector('.builder-topbar');
    if (topBar) {
      topBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Browser History API integration for reliable Back/Forward navigation
    if (pushHistory) {
      history.pushState({ step: currentStep }, `Step ${currentStep}`, `?step=${currentStep}`);
    }
  }

  function renderStepperPills() {
    if (!stepperPillsList) return;
    stepperPillsList.innerHTML = '';
    stepTitles.forEach((title, idx) => {
      const li = document.createElement('li');
      li.className = `stepper-pill-item ${idx === currentStep ? 'active' : (idx < currentStep ? 'completed' : '')}`;
      li.innerHTML = `<span>${idx}.</span> ${title}`;
      li.addEventListener('click', () => {
        if (idx < currentStep || validateCurrentStep()) {
          saveDraft();
          renderStep(idx);
        }
      });
      stepperPillsList.appendChild(li);
    });
  }

  // Handle Browser Back and Forward buttons (Popstate)
  window.addEventListener('popstate', (e) => {
    if (e.state && typeof e.state.step === 'number') {
      renderStep(e.state.step, false);
    }
  });

  // Global Next / Continue Handler
  window.navigateNext = function() {
    if (validateCurrentStep()) {
      saveDraft();
      if (currentStep < totalSteps) {
        renderStep(currentStep + 1);
      }
    }
  };

  // Global Back Handler
  window.navigateBack = function() {
    saveDraft();
    if (currentStep > 0) {
      renderStep(currentStep - 1);
    } else {
      window.location.href = '/';
    }
  };

  // =========================================================================
  // 2. VALIDATION
  // =========================================================================
  function validateCurrentStep() {
    let isValid = true;

    // Step 1: Personal Information Validation
    if (currentStep === 1) {
      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');

      if (!fullName || !fullName.value.trim()) {
        markInvalid(fullName, 'Please enter your full name.');
        isValid = false;
      } else {
        markValid(fullName);
      }

      if (!email || !email.value.trim() || !validateEmail(email.value.trim())) {
        markInvalid(email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        markValid(email);
      }
    }

    return isValid;
  }

  function markInvalid(input, msg) {
    if (!input) return;
    input.classList.add('is-invalid');
    const err = input.nextElementSibling;
    if (err && err.classList.contains('field-error-msg')) {
      err.textContent = msg;
    }
    input.focus();
  }

  function markValid(input) {
    if (!input) return;
    input.classList.remove('is-invalid');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // =========================================================================
  // 3. CATEGORY SELECTION (STEP 0)
  // =========================================================================
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      categoryCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedCategory = card.getAttribute('data-category') || 'General';
      if (stepperCategoryPill) stepperCategoryPill.textContent = selectedCategory;
      saveDraft();
    });
  });

  // =========================================================================
  // 4. PROFILE PHOTO UPLOADER
  // =========================================================================
  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size exceeds 5MB. Please choose a smaller photo.');
          return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          profilePhotoBase64 = evt.target.result;
          displayAvatar(profilePhotoBase64);
          saveDraft();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function displayAvatar(src) {
    if (photoPreviewImg && photoPlaceholderSvg) {
      photoPreviewImg.src = src;
      photoPreviewImg.style.display = 'block';
      photoPlaceholderSvg.style.display = 'none';
      if (removePhotoBtn) removePhotoBtn.style.display = 'inline-flex';
    }
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
      profilePhotoBase64 = '';
      if (photoFileInput) photoFileInput.value = '';
      if (photoPreviewImg) {
        photoPreviewImg.src = '';
        photoPreviewImg.style.display = 'none';
      }
      if (photoPlaceholderSvg) photoPlaceholderSvg.style.display = 'block';
      removePhotoBtn.style.display = 'none';
      saveDraft();
    });
  }

  // =========================================================================
  // 5. DYNAMIC REPEATERS (EDUCATION, PROJECTS, EXPERIENCE, ETC.)
  // =========================================================================

  // Education Repeater
  window.addEducationEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card-item';
    div.id = `edu-${id}`;
    div.innerHTML = `
      <div class="repeater-header-bar">
        <span class="repeater-title-text">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
          Education Entry
        </span>
        <button type="button" class="btn-remove-item" onclick="removeRepeaterEntry('edu-${id}')">Remove</button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Institution / College Name <span class="required">*</span></label>
          <input type="text" class="form-control edu-institution" placeholder="e.g. University of California, Berkeley" value="${PortfolioTemplates.escapeHtml(data.institution || '')}" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Degree / Course <span class="required">*</span></label>
          <input type="text" class="form-control edu-degree" placeholder="e.g. Bachelor of Science in Computer Science" value="${PortfolioTemplates.escapeHtml(data.degree || '')}" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Department / Branch</label>
          <input type="text" class="form-control edu-department" placeholder="e.g. Computer Science & Engineering" value="${PortfolioTemplates.escapeHtml(data.department || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label">University / Board Name</label>
          <input type="text" class="form-control edu-university" placeholder="e.g. State University System" value="${PortfolioTemplates.escapeHtml(data.universityName || '')}">
        </div>
        <div class="col-md-2">
          <label class="form-label">Start Year</label>
          <input type="text" class="form-control edu-start" placeholder="e.g. 2022" value="${PortfolioTemplates.escapeHtml(data.startYear || '')}">
        </div>
        <div class="col-md-2">
          <label class="form-label">Grad Year</label>
          <input type="text" class="form-control edu-grad" placeholder="e.g. 2026" value="${PortfolioTemplates.escapeHtml(data.gradYear || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label">CGPA / Percentage</label>
          <input type="text" class="form-control edu-score" placeholder="e.g. 3.92 / 4.00 or 92%" value="${PortfolioTemplates.escapeHtml(data.score || '')}">
        </div>
        <div class="col-md-8">
          <label class="form-label">Relevant Coursework</label>
          <input type="text" class="form-control edu-coursework" placeholder="e.g. Data Structures, Algorithms, DBMS, Operating Systems" value="${PortfolioTemplates.escapeHtml(data.coursework || '')}">
        </div>
      </div>
    `;
    educationContainer.appendChild(div);
    attachInputListeners(div);
  };

  // Projects Repeater
  window.addProjectEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card-item';
    div.id = `proj-${id}`;
    div.innerHTML = `
      <div class="repeater-header-bar">
        <span class="repeater-title-text">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
          Project Details
        </span>
        <button type="button" class="btn-remove-item" onclick="removeRepeaterEntry('proj-${id}')">Remove</button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Project Name <span class="required">*</span></label>
          <input type="text" class="form-control proj-name" placeholder="e.g. Campus Peer Collaboration Portal" value="${PortfolioTemplates.escapeHtml(data.name || '')}" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Technologies Used</label>
          <input type="text" class="form-control proj-tech" placeholder="e.g. React, Node.js, PostgreSQL, Docker" value="${PortfolioTemplates.escapeHtml(data.technologies || '')}">
        </div>
        <div class="col-12">
          <label class="form-label">Project Description</label>
          <textarea class="form-control proj-desc" rows="2" placeholder="Brief high-level summary of what the project does...">${PortfolioTemplates.escapeHtml(data.description || '')}</textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label">Problem Statement</label>
          <input type="text" class="form-control proj-problem" placeholder="What core academic or practical problem was addressed?" value="${PortfolioTemplates.escapeHtml(data.problemStatement || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Solution &amp; Engineering Outcome</label>
          <input type="text" class="form-control proj-solution" placeholder="How did your solution solve the problem?" value="${PortfolioTemplates.escapeHtml(data.solution || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Student's Contribution</label>
          <input type="text" class="form-control proj-contrib" placeholder="e.g. Architected database schemas and designed API routes" value="${PortfolioTemplates.escapeHtml(data.contribution || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Project Duration</label>
          <input type="text" class="form-control proj-duration" placeholder="e.g. 3 Months (Spring 2024)" value="${PortfolioTemplates.escapeHtml(data.duration || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label">GitHub Repository URL</label>
          <input type="url" class="form-control proj-github" placeholder="https://github.com/username/project" value="${PortfolioTemplates.escapeHtml(data.githubUrl || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Live Demo / Deployment URL</label>
          <input type="url" class="form-control proj-live" placeholder="https://project-demo.com" value="${PortfolioTemplates.escapeHtml(data.liveUrl || '')}">
        </div>
      </div>
    `;
    projectsContainer.appendChild(div);
    attachInputListeners(div);
  };

  // Experience Repeater (Optional for freshers)
  window.addExperienceEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card-item';
    div.id = `exp-${id}`;
    div.innerHTML = `
      <div class="repeater-header-bar">
        <span class="repeater-title-text">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Experience / Internship Entry
        </span>
        <button type="button" class="btn-remove-item" onclick="removeRepeaterEntry('exp-${id}')">Remove</button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Organization / Company Name</label>
          <input type="text" class="form-control exp-org" placeholder="e.g. Vanguard Systems / University Lab" value="${PortfolioTemplates.escapeHtml(data.organization || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Position / Role</label>
          <input type="text" class="form-control exp-pos" placeholder="e.g. Software Development Intern / Teaching Assistant" value="${PortfolioTemplates.escapeHtml(data.position || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label">Experience Type</label>
          <select class="form-select exp-type">
            <option value="Internship" ${data.experienceType === 'Internship' ? 'selected' : ''}>Internship</option>
            <option value="Part-Time / Full-Time" ${data.experienceType === 'Part-Time / Full-Time' ? 'selected' : ''}>Part-Time / Full-Time</option>
            <option value="Teaching Assistantship" ${data.experienceType === 'Teaching Assistantship' ? 'selected' : ''}>Teaching Assistantship</option>
            <option value="Research Assistantship" ${data.experienceType === 'Research Assistantship' ? 'selected' : ''}>Research Assistantship</option>
            <option value="Freelance Project" ${data.experienceType === 'Freelance Project' ? 'selected' : ''}>Freelance Project</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Start Date</label>
          <input type="text" class="form-control exp-start" placeholder="e.g. June 2024" value="${PortfolioTemplates.escapeHtml(data.startDate || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label">End Date</label>
          <input type="text" class="form-control exp-end" placeholder="e.g. August 2024 or Present" value="${PortfolioTemplates.escapeHtml(data.endDate || '')}">
        </div>
        <div class="col-12">
          <label class="form-label">Core Responsibilities</label>
          <textarea class="form-control exp-resp" rows="2" placeholder="Detail tasks, engineering responsibilities, and methodologies used...">${PortfolioTemplates.escapeHtml(data.responsibilities || '')}</textarea>
        </div>
        <div class="col-12">
          <label class="form-label">Key Achievements / Metrics</label>
          <input type="text" class="form-control exp-achieve" placeholder="e.g. Boosted portal loading speed by 25% across 1,000 daily users" value="${PortfolioTemplates.escapeHtml(data.achievements || '')}">
        </div>
      </div>
    `;
    experienceContainer.appendChild(div);
    attachInputListeners(div);
  };

  // Certifications Repeater
  window.addCertEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card-item';
    div.id = `cert-${id}`;
    div.innerHTML = `
      <div class="repeater-header-bar">
        <span class="repeater-title-text">Certification</span>
        <button type="button" class="btn-remove-item" onclick="removeRepeaterEntry('cert-${id}')">Remove</button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Certification Name</label>
          <input type="text" class="form-control cert-name" placeholder="e.g. AWS Certified Cloud Practitioner" value="${PortfolioTemplates.escapeHtml(data.name || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Issuing Organization</label>
          <input type="text" class="form-control cert-org" placeholder="e.g. Amazon Web Services / Meta" value="${PortfolioTemplates.escapeHtml(data.organization || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label">Issue Date</label>
          <input type="text" class="form-control cert-date" placeholder="e.g. July 2024" value="${PortfolioTemplates.escapeHtml(data.issueDate || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label">Credential ID</label>
          <input type="text" class="form-control cert-id" placeholder="e.g. AWS-CCP-123456" value="${PortfolioTemplates.escapeHtml(data.credentialId || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label">Credential URL</label>
          <input type="url" class="form-control cert-url" placeholder="https://verify.certificate.org" value="${PortfolioTemplates.escapeHtml(data.credentialUrl || '')}">
        </div>
      </div>
    `;
    certsContainer.appendChild(div);
    attachInputListeners(div);
  };

  // Achievements Repeater
  window.addAchievementEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card-item';
    div.id = `ach-${id}`;
    div.innerHTML = `
      <div class="repeater-header-bar">
        <span class="repeater-title-text">Achievement / Honor</span>
        <button type="button" class="btn-remove-item" onclick="removeRepeaterEntry('ach-${id}')">Remove</button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Achievement Title</label>
          <input type="text" class="form-control ach-title" placeholder="e.g. First Place — Inter-University Hackathon 2024" value="${PortfolioTemplates.escapeHtml(data.title || '')}">
        </div>
        <div class="col-md-3">
          <label class="form-label">Date</label>
          <input type="text" class="form-control ach-date" placeholder="e.g. April 2024" value="${PortfolioTemplates.escapeHtml(data.date || '')}">
        </div>
        <div class="col-md-3">
          <label class="form-label">Organization / Body</label>
          <input type="text" class="form-control ach-org" placeholder="e.g. IEEE Student Chapter" value="${PortfolioTemplates.escapeHtml(data.organization || '')}">
        </div>
        <div class="col-12">
          <label class="form-label">Description</label>
          <input type="text" class="form-control ach-desc" placeholder="Briefly describe the context and recognition..." value="${PortfolioTemplates.escapeHtml(data.description || '')}">
        </div>
      </div>
    `;
    achievementsContainer.appendChild(div);
    attachInputListeners(div);
  };

  // Workshops Repeater
  window.addWorkshopEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card-item';
    div.id = `ws-${id}`;
    div.innerHTML = `
      <div class="repeater-header-bar">
        <span class="repeater-title-text">Workshop &amp; Training</span>
        <button type="button" class="btn-remove-item" onclick="removeRepeaterEntry('ws-${id}')">Remove</button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Workshop / Training Name</label>
          <input type="text" class="form-control ws-name" placeholder="e.g. Microservices Architecture Intensive" value="${PortfolioTemplates.escapeHtml(data.name || '')}">
        </div>
        <div class="col-md-3">
          <label class="form-label">Organization / Host</label>
          <input type="text" class="form-control ws-org" placeholder="e.g. Google Developer Group" value="${PortfolioTemplates.escapeHtml(data.organization || '')}">
        </div>
        <div class="col-md-3">
          <label class="form-label">Date</label>
          <input type="text" class="form-control ws-date" placeholder="e.g. November 2023" value="${PortfolioTemplates.escapeHtml(data.date || '')}">
        </div>
        <div class="col-12">
          <label class="form-label">Description</label>
          <input type="text" class="form-control ws-desc" placeholder="Key competencies covered..." value="${PortfolioTemplates.escapeHtml(data.description || '')}">
        </div>
      </div>
    `;
    workshopsContainer.appendChild(div);
    attachInputListeners(div);
  };

  // Extracurriculars Repeater
  window.addExtracurricularEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card-item';
    div.id = `extra-${id}`;
    div.innerHTML = `
      <div class="repeater-header-bar">
        <span class="repeater-title-text">Activity / Leadership</span>
        <button type="button" class="btn-remove-item" onclick="removeRepeaterEntry('extra-${id}')">Remove</button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Activity Title</label>
          <input type="text" class="form-control extra-title" placeholder="e.g. President, Computer Science Society" value="${PortfolioTemplates.escapeHtml(data.title || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Category</label>
          <select class="form-select extra-cat">
            <option value="Leadership" ${data.category === 'Leadership' ? 'selected' : ''}>Leadership</option>
            <option value="Student Clubs" ${data.category === 'Student Clubs' ? 'selected' : ''}>Student Clubs</option>
            <option value="Volunteering" ${data.category === 'Volunteering' ? 'selected' : ''}>Volunteering</option>
            <option value="Competitions" ${data.category === 'Competitions' ? 'selected' : ''}>Competitions</option>
            <option value="Sports" ${data.category === 'Sports' ? 'selected' : ''}>Sports</option>
            <option value="Other Activities" ${data.category === 'Other Activities' ? 'selected' : ''}>Other Activities</option>
          </select>
        </div>
        <div class="col-12">
          <label class="form-label">Description</label>
          <input type="text" class="form-control extra-desc" placeholder="Describe role, impact, or leadership contribution..." value="${PortfolioTemplates.escapeHtml(data.description || '')}">
        </div>
      </div>
    `;
    extracurricularsContainer.appendChild(div);
    attachInputListeners(div);
  };

  window.removeRepeaterEntry = function(elementId) {
    const elem = document.getElementById(elementId);
    if (elem) {
      elem.remove();
      saveDraft();
    }
  };

  function attachInputListeners(container) {
    container.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', saveDraft);
      input.addEventListener('change', saveDraft);
    });
  }

  // =========================================================================
  // 6. TEMPLATE SELECTION (STEP 12)
  // =========================================================================
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      templateCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedTemplate = radio.value;
        saveDraft();
      }
    });
  });

  // URL Query parameter template support
  const urlParams = new URLSearchParams(window.location.search);
  const qTmpl = urlParams.get('template');
  if (qTmpl) {
    const matching = document.querySelector(`.template-picker-card[data-template="${qTmpl}"]`);
    if (matching) {
      matching.click();
    }
  }

  // =========================================================================
  // 7. GATHER ALL FORM DATA
  // =========================================================================
  function collectFormData() {
    // Personal Information
    const personal = {
      fullName: (document.getElementById('fullName') || {}).value || '',
      title: (document.getElementById('title') || {}).value || '',
      email: (document.getElementById('email') || {}).value || '',
      phone: (document.getElementById('phone') || {}).value || '',
      city: (document.getElementById('city') || {}).value || '',
      state: (document.getElementById('state') || {}).value || '',
      linkedin: (document.getElementById('linkedin') || {}).value || '',
      github: (document.getElementById('github') || {}).value || '',
      website: (document.getElementById('website') || {}).value || '',
      summary: (document.getElementById('summary') || {}).value || '',
      photo: profilePhotoBase64
    };

    // Career Objective
    const careerObjective = (document.getElementById('careerObjective') || {}).value || '';

    // Education entries
    const education = [];
    document.querySelectorAll('#educationContainer .repeater-card-item').forEach(card => {
      const inst = (card.querySelector('.edu-institution') || {}).value || '';
      const deg = (card.querySelector('.edu-degree') || {}).value || '';
      if (inst || deg) {
        education.push({
          institution: inst,
          degree: deg,
          department: (card.querySelector('.edu-department') || {}).value || '',
          universityName: (card.querySelector('.edu-university') || {}).value || '',
          startYear: (card.querySelector('.edu-start') || {}).value || '',
          gradYear: (card.querySelector('.edu-grad') || {}).value || '',
          score: (card.querySelector('.edu-score') || {}).value || '',
          coursework: (card.querySelector('.edu-coursework') || {}).value || ''
        });
      }
    });

    // Categorized Skills
    const skills = {
      programmingLanguages: (document.getElementById('skillProgLang') || {}).value || '',
      frontend: (document.getElementById('skillFrontend') || {}).value || '',
      backend: (document.getElementById('skillBackend') || {}).value || '',
      frameworks: (document.getElementById('skillFrameworks') || {}).value || '',
      databases: (document.getElementById('skillDatabases') || {}).value || '',
      tools: (document.getElementById('skillTools') || {}).value || '',
      softwareSkills: (document.getElementById('skillSoftware') || {}).value || '',
      softSkills: (document.getElementById('skillSoft') || {}).value || '',
      otherSkills: (document.getElementById('skillOther') || {}).value || ''
    };

    // Projects entries
    const projects = [];
    document.querySelectorAll('#projectsContainer .repeater-card-item').forEach(card => {
      const name = (card.querySelector('.proj-name') || {}).value || '';
      if (name) {
        projects.push({
          name,
          description: (card.querySelector('.proj-desc') || {}).value || '',
          problemStatement: (card.querySelector('.proj-problem') || {}).value || '',
          solution: (card.querySelector('.proj-solution') || {}).value || '',
          technologies: (card.querySelector('.proj-tech') || {}).value || '',
          contribution: (card.querySelector('.proj-contrib') || {}).value || '',
          duration: (card.querySelector('.proj-duration') || {}).value || '',
          githubUrl: (card.querySelector('.proj-github') || {}).value || '',
          liveUrl: (card.querySelector('.proj-live') || {}).value || ''
        });
      }
    });

    // Experience entries
    const experience = [];
    document.querySelectorAll('#experienceContainer .repeater-card-item').forEach(card => {
      const org = (card.querySelector('.exp-org') || {}).value || '';
      const pos = (card.querySelector('.exp-pos') || {}).value || '';
      if (org || pos) {
        experience.push({
          organization: org,
          position: pos,
          experienceType: (card.querySelector('.exp-type') || {}).value || 'Internship',
          startDate: (card.querySelector('.exp-start') || {}).value || '',
          endDate: (card.querySelector('.exp-end') || {}).value || '',
          responsibilities: (card.querySelector('.exp-resp') || {}).value || '',
          achievements: (card.querySelector('.exp-achieve') || {}).value || ''
        });
      }
    });

    // Certifications
    const certifications = [];
    document.querySelectorAll('#certsContainer .repeater-card-item').forEach(card => {
      const cName = (card.querySelector('.cert-name') || {}).value || '';
      if (cName) {
        certifications.push({
          name: cName,
          organization: (card.querySelector('.cert-org') || {}).value || '',
          issueDate: (card.querySelector('.cert-date') || {}).value || '',
          credentialId: (card.querySelector('.cert-id') || {}).value || '',
          credentialUrl: (card.querySelector('.cert-url') || {}).value || ''
        });
      }
    });

    // Achievements
    const achievements = [];
    document.querySelectorAll('#achievementsContainer .repeater-card-item').forEach(card => {
      const aTitle = (card.querySelector('.ach-title') || {}).value || '';
      if (aTitle) {
        achievements.push({
          title: aTitle,
          date: (card.querySelector('.ach-date') || {}).value || '',
          organization: (card.querySelector('.ach-org') || {}).value || '',
          description: (card.querySelector('.ach-desc') || {}).value || ''
        });
      }
    });

    // Workshops
    const workshops = [];
    document.querySelectorAll('#workshopsContainer .repeater-card-item').forEach(card => {
      const wName = (card.querySelector('.ws-name') || {}).value || '';
      if (wName) {
        workshops.push({
          name: wName,
          organization: (card.querySelector('.ws-org') || {}).value || '',
          date: (card.querySelector('.ws-date') || {}).value || '',
          description: (card.querySelector('.ws-desc') || {}).value || ''
        });
      }
    });

    // Extracurriculars
    const extracurriculars = [];
    document.querySelectorAll('#extracurricularsContainer .repeater-card-item').forEach(card => {
      const eTitle = (card.querySelector('.extra-title') || {}).value || '';
      if (eTitle) {
        extracurriculars.push({
          title: eTitle,
          category: (card.querySelector('.extra-cat') || {}).value || 'Activities',
          description: (card.querySelector('.extra-desc') || {}).value || ''
        });
      }
    });

    // Additional Info
    const additionalInfo = {
      languages: (document.getElementById('addlLanguages') || {}).value || '',
      hobbies: (document.getElementById('addlHobbies') || {}).value || '',
      publications: (document.getElementById('addlPublications') || {}).value || '',
      references: (document.getElementById('addlReferences') || {}).value || ''
    };

    return {
      category: selectedCategory,
      template: selectedTemplate,
      personal,
      careerObjective,
      education,
      skills,
      projects,
      experience,
      certifications,
      achievements,
      workshops,
      extracurriculars,
      additionalInfo,
      updatedAt: new Date().toISOString()
    };
  }

  // =========================================================================
  // 8. AUTOSAVE DRAFT & FORM RESTORATION
  // =========================================================================
  let autoSaveTimeout = null;
  function saveDraft() {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      const data = collectFormData();
      PortfolioGenerator.saveDraft(data);
      if (autoSaveBadge) {
        autoSaveBadge.style.opacity = '1';
        setTimeout(() => {
          autoSaveBadge.style.opacity = '0.7';
        }, 1200);
      }
    }, 350);
  }

  function populateFormData(data) {
    if (!data) return;

    // Category
    if (data.category) {
      selectedCategory = data.category;
      const targetCard = document.querySelector(`.category-choice-card[data-category="${data.category}"]`);
      if (targetCard) {
        categoryCards.forEach(c => c.classList.remove('selected'));
        targetCard.classList.add('selected');
      }
    }

    // Personal Information
    const p = data.personal || {};
    if (document.getElementById('fullName')) document.getElementById('fullName').value = p.fullName || '';
    if (document.getElementById('title')) document.getElementById('title').value = p.title || '';
    if (document.getElementById('email')) document.getElementById('email').value = p.email || '';
    if (document.getElementById('phone')) document.getElementById('phone').value = p.phone || '';
    if (document.getElementById('city')) document.getElementById('city').value = p.city || '';
    if (document.getElementById('state')) document.getElementById('state').value = p.state || '';
    if (document.getElementById('linkedin')) document.getElementById('linkedin').value = p.linkedin || '';
    if (document.getElementById('github')) document.getElementById('github').value = p.github || '';
    if (document.getElementById('website')) document.getElementById('website').value = p.website || '';
    if (document.getElementById('summary')) document.getElementById('summary').value = p.summary || '';
    if (p.photo) {
      profilePhotoBase64 = p.photo;
      displayAvatar(p.photo);
    }

    // Career Objective
    if (document.getElementById('careerObjective')) {
      document.getElementById('careerObjective').value = data.careerObjective || '';
    }

    // Education
    educationContainer.innerHTML = '';
    if (Array.isArray(data.education) && data.education.length > 0) {
      data.education.forEach(edu => window.addEducationEntry(edu));
    } else {
      window.addEducationEntry();
    }

    // Skills
    const sk = data.skills || {};
    if (document.getElementById('skillProgLang')) document.getElementById('skillProgLang').value = sk.programmingLanguages || '';
    if (document.getElementById('skillFrontend')) document.getElementById('skillFrontend').value = sk.frontend || '';
    if (document.getElementById('skillBackend')) document.getElementById('skillBackend').value = sk.backend || '';
    if (document.getElementById('skillFrameworks')) document.getElementById('skillFrameworks').value = sk.frameworks || '';
    if (document.getElementById('skillDatabases')) document.getElementById('skillDatabases').value = sk.databases || '';
    if (document.getElementById('skillTools')) document.getElementById('skillTools').value = sk.tools || '';
    if (document.getElementById('skillSoftware')) document.getElementById('skillSoftware').value = sk.softwareSkills || '';
    if (document.getElementById('skillSoft')) document.getElementById('skillSoft').value = sk.softSkills || '';
    if (document.getElementById('skillOther')) document.getElementById('skillOther').value = sk.otherSkills || '';

    // Projects
    projectsContainer.innerHTML = '';
    if (Array.isArray(data.projects) && data.projects.length > 0) {
      data.projects.forEach(proj => window.addProjectEntry(proj));
    } else {
      window.addProjectEntry();
    }

    // Experience
    experienceContainer.innerHTML = '';
    if (Array.isArray(data.experience) && data.experience.length > 0) {
      data.experience.forEach(exp => window.addExperienceEntry(exp));
    }

    // Certifications
    certsContainer.innerHTML = '';
    if (Array.isArray(data.certifications) && data.certifications.length > 0) {
      data.certifications.forEach(c => window.addCertEntry(c));
    }

    // Achievements
    achievementsContainer.innerHTML = '';
    if (Array.isArray(data.achievements) && data.achievements.length > 0) {
      data.achievements.forEach(a => window.addAchievementEntry(a));
    }

    // Workshops
    workshopsContainer.innerHTML = '';
    if (Array.isArray(data.workshops) && data.workshops.length > 0) {
      data.workshops.forEach(w => window.addWorkshopEntry(w));
    }

    // Extracurriculars
    extracurricularsContainer.innerHTML = '';
    if (Array.isArray(data.extracurriculars) && data.extracurriculars.length > 0) {
      data.extracurriculars.forEach(e => window.addExtracurricularEntry(e));
    }

    // Additional Info
    const ad = data.additionalInfo || {};
    if (document.getElementById('addlLanguages')) document.getElementById('addlLanguages').value = ad.languages || '';
    if (document.getElementById('addlHobbies')) document.getElementById('addlHobbies').value = ad.hobbies || '';
    if (document.getElementById('addlPublications')) document.getElementById('addlPublications').value = ad.publications || '';
    if (document.getElementById('addlReferences')) document.getElementById('addlReferences').value = ad.references || '';

    // Template
    if (data.template) {
      selectedTemplate = data.template;
      const tCard = document.querySelector(`.template-picker-card[data-template="${data.template}"]`);
      if (tCard) {
        templateCards.forEach(c => c.classList.remove('selected'));
        tCard.classList.add('selected');
        const radio = tCard.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      }
    }
  }

  // =========================================================================
  // 9. SAMPLE DEMO DATA (1-CLICK LOAD)
  // =========================================================================
  const fillDemoBtn = document.getElementById('fillDemoBtn');
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', async () => {
      try {
        const resp = await fetch('/api/demo-data');
        if (resp.ok) {
          const res = await resp.json();
          if (res.success && res.data) {
            populateFormData(res.data);
            PortfolioGenerator.saveDraft(res.data);
            alert('Sample student portfolio loaded successfully! All 11 sections have been populated.');
            return;
          }
        }
      } catch (err) {
        console.warn('API error fetching demo data:', err);
      }
    });
  }

  // Clear Form Reset
  const clearFormBtn = document.getElementById('clearFormBtn');
  if (clearFormBtn) {
    clearFormBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the form? All entered information will be cleared.')) {
        PortfolioGenerator.clearAll();
        window.location.reload();
      }
    });
  }

  // =========================================================================
  // 10. GENERATE PORTFOLIO ACTION
  // =========================================================================
  const generatePortfolioBtn = document.getElementById('generatePortfolioBtn');
  if (generatePortfolioBtn) {
    generatePortfolioBtn.addEventListener('click', () => {
      // Validate Personal Information before final generation
      if (!validateCurrentStep()) {
        renderStep(1);
        return;
      }

      const finalData = collectFormData();
      PortfolioGenerator.saveData(finalData);

      // Loading dialog
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(20,36,58,0.85);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;color:#FFFFFF;text-align:center;font-family:Inter,sans-serif;';
      overlay.innerHTML = `
        <div style="background:#FFFFFF; color:#14243A; padding:2rem 2.5rem; border-radius:8px; max-width:420px; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
          <div class="spinner-border text-primary mb-3" style="width:3rem; height:3rem;" role="status"></div>
          <h4 style="font-weight:800; margin-bottom:0.5rem;">Generating Your Portfolio...</h4>
          <p style="color:#64748B; font-size:0.9rem; margin:0;">Formatting academic sections and preparing live A4 preview...</p>
        </div>
      `;
      document.body.appendChild(overlay);

      setTimeout(() => {
        window.location.href = '/preview';
      }, 700);
    });
  }

  // Attach auto-save to static inputs
  document.querySelectorAll('.form-control, .form-select').forEach(input => {
    input.addEventListener('input', saveDraft);
    input.addEventListener('change', saveDraft);
  });

  // =========================================================================
  // 11. INITIALIZATION ON LOAD
  // =========================================================================
  const existingData = PortfolioGenerator.getData() || PortfolioGenerator.getDraft();
  if (existingData) {
    populateFormData(existingData);
  } else {
    // Default initial rows
    window.addEducationEntry();
    window.addProjectEntry();
  }

  // Check URL query for step parameter
  const qStep = parseInt(urlParams.get('step'), 10);
  if (!isNaN(qStep) && qStep >= 0 && qStep <= totalSteps) {
    renderStep(qStep, false);
  } else {
    renderStep(0, false);
  }
});
