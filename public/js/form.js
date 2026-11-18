/**
 * Portfolio Form & Wizard Controller
 * Multi-step wizard, dynamic repeater fields, validation, and LocalStorage draft saving.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wizard State
  let currentStep = 1;
  const totalSteps = 7;
  let skillsList = [];
  let avatarBase64 = '';

  // DOM Elements
  const stepPanels = document.querySelectorAll('.form-step-panel');
  const stepItems = document.querySelectorAll('.wizard-step-item');
  const progressBarFill = document.querySelector('.wizard-progress-bar-fill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const generateBtn = document.getElementById('generateBtn');
  const autoSaveStatus = document.getElementById('autoSaveStatus');

  // Containers for repeaters
  const educationContainer = document.getElementById('educationContainer');
  const projectsContainer = document.getElementById('projectsContainer');
  const certsContainer = document.getElementById('certsContainer');
  const experienceContainer = document.getElementById('experienceContainer');
  const skillsGrid = document.getElementById('skillsGrid');

  // Profile Photo Elements
  const photoInput = document.getElementById('photoInput');
  const photoPreview = document.getElementById('photoPreview');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const removePhotoBtn = document.getElementById('removePhotoBtn');

  // Quick Action Buttons
  const fillDemoBtn = document.getElementById('fillDemoBtn');
  const clearFormBtn = document.getElementById('clearFormBtn');

  // Template radios
  const templateCards = document.querySelectorAll('.template-radio-card');

  // ==========================================
  // 1. STEP NAVIGATION & PROGRESS
  // ==========================================
  function updateWizardUI() {
    // Show active panel
    stepPanels.forEach(panel => {
      const step = parseInt(panel.getAttribute('data-step'), 10);
      if (step === currentStep) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update step circles & labels
    stepItems.forEach(item => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (step === currentStep) {
        item.classList.add('active');
      } else if (step < currentStep) {
        item.classList.add('completed');
      }
    });

    // Progress bar fill percentage
    if (progressBarFill) {
      const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
      progressBarFill.style.width = `${percent}%`;
    }

    // Toggle button visibility
    if (prevBtn) {
      prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    if (currentStep === totalSteps) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (generateBtn) generateBtn.style.display = 'inline-flex';
    } else {
      if (nextBtn) nextBtn.style.display = 'inline-flex';
      if (generateBtn) generateBtn.style.display = 'none';
    }

    // Scroll smoothly to top of form
    const formTop = document.querySelector('.wizard-progress-card');
    if (formTop) {
      formTop.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Step item click to navigate (only to completed or current steps)
  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetStep = parseInt(item.getAttribute('data-step'), 10);
      if (targetStep < currentStep || validateStep(currentStep)) {
        currentStep = targetStep;
        updateWizardUI();
      }
    });
  });

  // Next & Previous buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
          currentStep++;
          updateWizardUI();
          saveDraftToStorage();
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  }

  // ==========================================
  // 2. VALIDATION
  // ==========================================
  function validateStep(step) {
    let isValid = true;

    if (step === 1) {
      const fullName = document.getElementById('fullName');
      const title = document.getElementById('title');
      const email = document.getElementById('email');

      if (!fullName || !fullName.value.trim()) {
        markInvalid(fullName, 'Please enter your full name.');
        isValid = false;
      } else {
        markValid(fullName);
      }

      if (!title || !title.value.trim()) {
        markInvalid(title, 'Please enter your professional title / degree.');
        isValid = false;
      } else {
        markValid(title);
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
    input.classList.add('is-invalid');
    let errorElem = input.nextElementSibling;
    if (errorElem && errorElem.classList.contains('field-error-msg')) {
      errorElem.textContent = msg;
    }
    input.focus();
  }

  function markValid(input) {
    input.classList.remove('is-invalid');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Clear validation error on input
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      saveDraftToStorage();
    });
  });

  // ==========================================
  // 3. PROFILE PHOTO HANDLER
  // ==========================================
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size exceeds 5MB. Please choose a smaller image.');
          return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
          avatarBase64 = event.target.result;
          displayAvatar(avatarBase64);
          saveDraftToStorage();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function displayAvatar(src) {
    if (photoPreview && photoPlaceholder) {
      photoPreview.src = src;
      photoPreview.style.display = 'block';
      photoPlaceholder.style.display = 'none';
      if (removePhotoBtn) removePhotoBtn.style.display = 'inline-flex';
    }
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
      avatarBase64 = '';
      if (photoInput) photoInput.value = '';
      if (photoPreview) {
        photoPreview.src = '';
        photoPreview.style.display = 'none';
      }
      if (photoPlaceholder) photoPlaceholder.style.display = 'block';
      removePhotoBtn.style.display = 'none';
      saveDraftToStorage();
    });
  }

  // ==========================================
  // 4. EDUCATION REPEATER
  // ==========================================
  window.addEducationEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card';
    div.id = `edu-${id}`;
    div.innerHTML = `
      <div class="repeater-header">
        <div class="repeater-title"><i class="bi bi-mortarboard"></i> Education Entry</div>
        <button type="button" class="btn-remove-entry" onclick="removeEducationEntry('${id}')">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Institution / College Name <span class="required">*</span></label>
          <input type="text" class="form-control edu-institution" placeholder="e.g. Stanford University" value="${data.institution || ''}" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Degree / Course <span class="required">*</span></label>
          <input type="text" class="form-control edu-degree" placeholder="e.g. Bachelor of Technology" value="${data.degree || ''}" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Department / Branch</label>
          <input type="text" class="form-control edu-department" placeholder="e.g. Computer Science" value="${data.department || ''}">
        </div>
        <div class="col-md-3">
          <label class="form-label">Start Year</label>
          <input type="text" class="form-control edu-start" placeholder="e.g. 2022" value="${data.startYear || ''}">
        </div>
        <div class="col-md-3">
          <label class="form-label">Graduation Year</label>
          <input type="text" class="form-control edu-grad" placeholder="e.g. 2026" value="${data.gradYear || ''}">
        </div>
        <div class="col-md-2">
          <label class="form-label">CGPA / %</label>
          <input type="text" class="form-control edu-score" placeholder="e.g. 3.9 / 92%" value="${data.score || ''}">
        </div>
      </div>
    `;
    educationContainer.appendChild(div);

    div.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', saveDraftToStorage);
    });
  };

  window.removeEducationEntry = function(id) {
    const elem = document.getElementById(`edu-${id}`);
    if (elem) {
      elem.remove();
      saveDraftToStorage();
    }
  };

  const addEduBtn = document.getElementById('addEduBtn');
  if (addEduBtn) {
    addEduBtn.addEventListener('click', () => window.addEducationEntry());
  }

  // ==========================================
  // 5. TECHNICAL SKILLS MANAGER
  // ==========================================
  const customSkillName = document.getElementById('customSkillName');
  const customSkillLevel = document.getElementById('customSkillLevel');
  const addSkillBtn = document.getElementById('addSkillBtn');

  function renderSkills() {
    if (!skillsGrid) return;
    skillsGrid.innerHTML = '';
    skillsList.forEach((skill, index) => {
      const item = document.createElement('div');
      item.className = 'skill-tag-item';
      item.innerHTML = `
        <div class="skill-tag-info">
          <i class="bi bi-code-slash" style="color:var(--accent-red);"></i>
          <span class="skill-tag-name">${PortfolioTemplates.escapeHtml(skill.name)}</span>
          ${skill.level ? `<span class="skill-tag-level">${PortfolioTemplates.escapeHtml(skill.level)}</span>` : ''}
        </div>
        <button type="button" class="btn-delete-skill" onclick="removeSkill(${index})" title="Remove skill">
          <i class="bi bi-x-lg"></i>
        </button>
      `;
      skillsGrid.appendChild(item);
    });
  }

  window.addSkill = function(name, level = 'Proficient', category = 'General') {
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    // Avoid duplicate names
    if (!skillsList.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      skillsList.push({ name: trimmed, level, category });
      renderSkills();
      saveDraftToStorage();
    }
  };

  window.removeSkill = function(index) {
    skillsList.splice(index, 1);
    renderSkills();
    saveDraftToStorage();
  };

  if (addSkillBtn && customSkillName) {
    addSkillBtn.addEventListener('click', () => {
      const name = customSkillName.value.trim();
      const level = customSkillLevel ? customSkillLevel.value : 'Proficient';
      if (name) {
        window.addSkill(name, level);
        customSkillName.value = '';
        customSkillName.focus();
      }
    });

    customSkillName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSkillBtn.click();
      }
    });
  }

  // Quick skill pills
  document.querySelectorAll('.quick-skill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const skillName = btn.getAttribute('data-skill');
      if (skillName) {
        window.addSkill(skillName, 'Proficient');
      }
    });
  });

  // ==========================================
  // 6. PROJECTS REPEATER
  // ==========================================
  window.addProjectEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card';
    div.id = `proj-${id}`;
    div.innerHTML = `
      <div class="repeater-header">
        <div class="repeater-title"><i class="bi bi-folder-fill" style="color:var(--accent-red);"></i> Project Details</div>
        <button type="button" class="btn-remove-entry" onclick="removeProjectEntry('${id}')">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Project Name <span class="required">*</span></label>
          <input type="text" class="form-control proj-name" placeholder="e.g. AI-Powered Campus Assistant" value="${data.name || ''}" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">Technologies Used</label>
          <input type="text" class="form-control proj-tech" placeholder="e.g. React, Node.js, Express, MongoDB" value="${data.technologies || ''}">
        </div>
        <div class="col-12">
          <label class="form-label">Project Description <span class="required">*</span></label>
          <textarea class="form-control proj-desc" rows="3" placeholder="Briefly explain what the project does, key features, and your contribution...">${data.description || ''}</textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label">Live Project URL (optional)</label>
          <div class="input-icon-group">
            <i class="bi bi-link-45deg"></i>
            <input type="url" class="form-control proj-live" placeholder="https://myproject.com" value="${data.projectUrl || ''}">
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label">GitHub Repository URL (optional)</label>
          <div class="input-icon-group">
            <i class="bi bi-github"></i>
            <input type="url" class="form-control proj-github" placeholder="https://github.com/username/project" value="${data.githubUrl || ''}">
          </div>
        </div>
      </div>
    `;
    projectsContainer.appendChild(div);

    div.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', saveDraftToStorage);
    });
  };

  window.removeProjectEntry = function(id) {
    const elem = document.getElementById(`proj-${id}`);
    if (elem) {
      elem.remove();
      saveDraftToStorage();
    }
  };

  const addProjBtn = document.getElementById('addProjBtn');
  if (addProjBtn) {
    addProjBtn.addEventListener('click', () => window.addProjectEntry());
  }

  // ==========================================
  // 7. CERTIFICATIONS REPEATER
  // ==========================================
  window.addCertEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card';
    div.id = `cert-${id}`;
    div.innerHTML = `
      <div class="repeater-header">
        <div class="repeater-title"><i class="bi bi-patch-check-fill" style="color:#10b981;"></i> Certificate Entry</div>
        <button type="button" class="btn-remove-entry" onclick="removeCertEntry('${id}')">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Certificate / Honor Name</label>
          <input type="text" class="form-control cert-name" placeholder="e.g. AWS Certified Cloud Practitioner" value="${data.name || ''}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Issuing Organization</label>
          <input type="text" class="form-control cert-org" placeholder="e.g. Amazon Web Services / Coursera" value="${data.organization || ''}">
        </div>
        <div class="col-md-4">
          <label class="form-label">Year of Issue</label>
          <input type="text" class="form-control cert-year" placeholder="e.g. 2024" value="${data.year || ''}">
        </div>
        <div class="col-md-8">
          <label class="form-label">Credential Verification URL (optional)</label>
          <div class="input-icon-group">
            <i class="bi bi-patch-check"></i>
            <input type="url" class="form-control cert-url" placeholder="https://credential-verify.org/id" value="${data.url || ''}">
          </div>
        </div>
      </div>
    `;
    certsContainer.appendChild(div);

    div.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', saveDraftToStorage);
    });
  };

  window.removeCertEntry = function(id) {
    const elem = document.getElementById(`cert-${id}`);
    if (elem) {
      elem.remove();
      saveDraftToStorage();
    }
  };

  const addCertBtn = document.getElementById('addCertBtn');
  if (addCertBtn) {
    addCertBtn.addEventListener('click', () => window.addCertEntry());
  }

  // ==========================================
  // 8. EXPERIENCE REPEATER (OPTIONAL)
  // ==========================================
  window.addExpEntry = function(data = {}) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = 'repeater-card';
    div.id = `exp-${id}`;
    div.innerHTML = `
      <div class="repeater-header">
        <div class="repeater-title"><i class="bi bi-briefcase-fill" style="color:#58a6ff;"></i> Experience / Internship</div>
        <button type="button" class="btn-remove-entry" onclick="removeExpEntry('${id}')">
          <i class="bi bi-trash"></i> Remove
        </button>
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Company / Organization Name</label>
          <input type="text" class="form-control exp-company" placeholder="e.g. Google Developers Student Club" value="${data.company || ''}">
        </div>
        <div class="col-md-6">
          <label class="form-label">Position / Role</label>
          <input type="text" class="form-control exp-pos" placeholder="e.g. Web Development Lead / Intern" value="${data.position || ''}">
        </div>
        <div class="col-md-12">
          <label class="form-label">Duration / Period</label>
          <input type="text" class="form-control exp-duration" placeholder="e.g. May 2024 - August 2024 (3 months)" value="${data.duration || ''}">
        </div>
        <div class="col-12">
          <label class="form-label">Description & Contributions</label>
          <textarea class="form-control exp-desc" rows="3" placeholder="Describe responsibilities, achievements, and impact...">${data.description || ''}</textarea>
        </div>
      </div>
    `;
    experienceContainer.appendChild(div);

    div.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', saveDraftToStorage);
    });
  };

  window.removeExpEntry = function(id) {
    const elem = document.getElementById(`exp-${id}`);
    if (elem) {
      elem.remove();
      saveDraftToStorage();
    }
  };

  const addExpBtn = document.getElementById('addExpBtn');
  if (addExpBtn) {
    addExpBtn.addEventListener('click', () => window.addExpEntry());
  }

  // ==========================================
  // 9. TEMPLATE SELECTION
  // ==========================================
  let selectedTemplate = 'modern-dark';

  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      templateCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedTemplate = radio.value;
        saveDraftToStorage();
      }
    });
  });

  // Check if template query param was passed in URL (e.g. /create?template=minimal-professional)
  const urlParams = new URLSearchParams(window.location.search);
  const paramTemplate = urlParams.get('template');
  if (paramTemplate) {
    const matchingCard = document.querySelector(`.template-radio-card[data-template="${paramTemplate}"]`);
    if (matchingCard) {
      matchingCard.click();
    }
  }

  // ==========================================
  // 10. GATHER FORM DATA OBJECT
  // ==========================================
  function gatherFormData() {
    // Personal
    const personal = {
      fullName: (document.getElementById('fullName') || {}).value || '',
      title: (document.getElementById('title') || {}).value || '',
      email: (document.getElementById('email') || {}).value || '',
      phone: (document.getElementById('phone') || {}).value || '',
      location: (document.getElementById('location') || {}).value || '',
      dob: (document.getElementById('dob') || {}).value || '',
      about: (document.getElementById('about') || {}).value || '',
      photo: avatarBase64
    };

    // Education
    const education = [];
    document.querySelectorAll('#educationContainer .repeater-card').forEach(card => {
      const institution = (card.querySelector('.edu-institution') || {}).value || '';
      const degree = (card.querySelector('.edu-degree') || {}).value || '';
      if (institution || degree) {
        education.push({
          institution,
          degree,
          department: (card.querySelector('.edu-department') || {}).value || '',
          startYear: (card.querySelector('.edu-start') || {}).value || '',
          gradYear: (card.querySelector('.edu-grad') || {}).value || '',
          score: (card.querySelector('.edu-score') || {}).value || ''
        });
      }
    });

    // Projects
    const projects = [];
    document.querySelectorAll('#projectsContainer .repeater-card').forEach(card => {
      const name = (card.querySelector('.proj-name') || {}).value || '';
      if (name) {
        projects.push({
          name,
          description: (card.querySelector('.proj-desc') || {}).value || '',
          technologies: (card.querySelector('.proj-tech') || {}).value || '',
          projectUrl: (card.querySelector('.proj-live') || {}).value || '',
          githubUrl: (card.querySelector('.proj-github') || {}).value || ''
        });
      }
    });

    // Certifications
    const certifications = [];
    document.querySelectorAll('#certsContainer .repeater-card').forEach(card => {
      const name = (card.querySelector('.cert-name') || {}).value || '';
      if (name) {
        certifications.push({
          name,
          organization: (card.querySelector('.cert-org') || {}).value || '',
          year: (card.querySelector('.cert-year') || {}).value || '',
          url: (card.querySelector('.cert-url') || {}).value || ''
        });
      }
    });

    // Experience
    const experience = [];
    document.querySelectorAll('#experienceContainer .repeater-card').forEach(card => {
      const company = (card.querySelector('.exp-company') || {}).value || '';
      const position = (card.querySelector('.exp-pos') || {}).value || '';
      if (company || position) {
        experience.push({
          company,
          position,
          duration: (card.querySelector('.exp-duration') || {}).value || '',
          description: (card.querySelector('.exp-desc') || {}).value || ''
        });
      }
    });

    // Social Links
    const social = {
      github: (document.getElementById('socialGithub') || {}).value || '',
      linkedin: (document.getElementById('socialLinkedin') || {}).value || '',
      instagram: (document.getElementById('socialInstagram') || {}).value || '',
      website: (document.getElementById('socialWebsite') || {}).value || '',
      twitter: (document.getElementById('socialTwitter') || {}).value || ''
    };

    return {
      template: selectedTemplate,
      personal,
      education,
      skills: skillsList,
      projects,
      certifications,
      experience,
      social,
      updatedAt: new Date().toISOString()
    };
  }

  // ==========================================
  // 11. AUTOSAVE DRAFT & RESTORATION
  // ==========================================
  let autoSaveTimeout = null;
  function saveDraftToStorage() {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      const data = gatherFormData();
      PortfolioGenerator.saveDraft(data);
      if (autoSaveStatus) {
        autoSaveStatus.style.opacity = '1';
        setTimeout(() => {
          autoSaveStatus.style.opacity = '0.6';
        }, 1500);
      }
    }, 400);
  }

  function populateForm(data) {
    if (!data) return;

    // Personal
    const p = data.personal || {};
    if (document.getElementById('fullName')) document.getElementById('fullName').value = p.fullName || '';
    if (document.getElementById('title')) document.getElementById('title').value = p.title || '';
    if (document.getElementById('email')) document.getElementById('email').value = p.email || '';
    if (document.getElementById('phone')) document.getElementById('phone').value = p.phone || '';
    if (document.getElementById('location')) document.getElementById('location').value = p.location || '';
    if (document.getElementById('dob')) document.getElementById('dob').value = p.dob || '';
    if (document.getElementById('about')) document.getElementById('about').value = p.about || '';
    if (p.photo) {
      avatarBase64 = p.photo;
      displayAvatar(p.photo);
    }

    // Education
    educationContainer.innerHTML = '';
    if (data.education && data.education.length > 0) {
      data.education.forEach(edu => window.addEducationEntry(edu));
    } else {
      window.addEducationEntry(); // default empty one
    }

    // Skills
    skillsList = data.skills ? [...data.skills] : [];
    renderSkills();

    // Projects
    projectsContainer.innerHTML = '';
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach(proj => window.addProjectEntry(proj));
    } else {
      window.addProjectEntry(); // default empty one
    }

    // Certifications
    certsContainer.innerHTML = '';
    if (data.certifications && data.certifications.length > 0) {
      data.certifications.forEach(cert => window.addCertEntry(cert));
    }

    // Experience
    experienceContainer.innerHTML = '';
    if (data.experience && data.experience.length > 0) {
      data.experience.forEach(exp => window.addExpEntry(exp));
    }

    // Social Links
    const s = data.social || {};
    if (document.getElementById('socialGithub')) document.getElementById('socialGithub').value = s.github || '';
    if (document.getElementById('socialLinkedin')) document.getElementById('socialLinkedin').value = s.linkedin || '';
    if (document.getElementById('socialInstagram')) document.getElementById('socialInstagram').value = s.instagram || '';
    if (document.getElementById('socialWebsite')) document.getElementById('socialWebsite').value = s.website || '';
    if (document.getElementById('socialTwitter')) document.getElementById('socialTwitter').value = s.twitter || '';

    // Template
    if (data.template) {
      selectedTemplate = data.template;
      const card = document.querySelector(`.template-radio-card[data-template="${data.template}"]`);
      if (card) {
        templateCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      }
    }
  }

  // ==========================================
  // 12. DEMO DATA LOADER (1-CLICK FILL)
  // ==========================================
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/api/demo-data');
        if (response.ok) {
          const res = await response.json();
          if (res.success && res.data) {
            populateForm(res.data);
            PortfolioGenerator.saveDraft(res.data);
            alert('Sample student details populated successfully! You can customize any field.');
            return;
          }
        }
      } catch (err) {
        console.warn('API fetch failed, loading fallback local demo data...', err);
      }

      // Built-in fallback demo data if offline
      const fallbackDemo = {
        template: 'modern-dark',
        personal: {
          fullName: 'Alex Vance',
          title: 'Computer Science Student & Full Stack Developer',
          email: 'alex.vance@university.edu',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
          dob: '2003-08-15',
          about: 'Undergraduate Computer Science student passionate about distributed cloud architectures, human-centered UI/UX, and machine learning models.'
        },
        education: [
          {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            department: 'Computer Science',
            startYear: '2022',
            gradYear: '2026',
            score: '3.92 CGPA'
          }
        ],
        skills: [
          { name: 'JavaScript', level: 'Advanced' },
          { name: 'React.js', level: 'Advanced' },
          { name: 'Node.js', level: 'Intermediate' },
          { name: 'Python', level: 'Advanced' },
          { name: 'HTML & CSS', level: 'Advanced' }
        ],
        projects: [
          {
            name: 'StudySync Campus Hub',
            description: 'A collaborative real-time study platform for university students featuring synchronized markdown whiteboards.',
            technologies: 'React, Node.js, WebSockets, Tailwind',
            projectUrl: 'https://example.com/demo',
            githubUrl: 'https://github.com/example/studysync'
          }
        ],
        certifications: [
          {
            name: 'Meta Front-End Developer',
            organization: 'Meta / Coursera',
            year: '2024',
            url: 'https://coursera.org/verify'
          }
        ],
        experience: [
          {
            company: 'Vanguard Software Labs',
            position: 'Software Engineering Intern',
            duration: 'Summer 2024',
            description: 'Developed responsive UI modules using React and reduced bundle load latency by 25%.'
          }
        ],
        social: {
          github: 'https://github.com/example',
          linkedin: 'https://linkedin.com/in/example',
          website: 'https://alexvance.dev'
        }
      };
      populateForm(fallbackDemo);
      PortfolioGenerator.saveDraft(fallbackDemo);
      alert('Sample student details populated! You can now browse each step or generate right away.');
    });
  }

  // Clear Form Button
  if (clearFormBtn) {
    clearFormBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all entered details? This will reset your form.')) {
        PortfolioGenerator.clearAll();
        window.location.reload();
      }
    });
  }

  // ==========================================
  // 13. GENERATE PORTFOLIO ACTION
  // ==========================================
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      // Validate all critical steps
      if (!validateStep(1)) {
        currentStep = 1;
        updateWizardUI();
        return;
      }

      // Collect data
      const finalData = gatherFormData();

      // Show generation modal/spinner
      const modalHtml = `
        <div class="modal fade show" id="generatingModal" tabindex="-1" style="display:block; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:9999;">
          <div class="modal-dialog modal-dialog-centered">
            <div class="custom-modal-content text-center p-4" style="background:#141721; border:1px solid #e63946; border-radius:18px;">
              <div class="spinner-border text-danger mb-3" style="width: 3.5rem; height: 3.5rem;" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <h3 class="text-white mb-2" style="font-family:'Outfit', sans-serif;">Generating Your Portfolio...</h3>
              <p class="text-secondary mb-0">Applying template design, formatting sections, and preparing live preview...</p>
            </div>
          </div>
        </div>
      `;
      const tempDiv = document.createElement('div');
      tempDiv.id = 'genModalWrap';
      tempDiv.innerHTML = modalHtml;
      document.body.appendChild(tempDiv);

      // Save to LocalStorage
      PortfolioGenerator.saveData(finalData);

      // Smooth redirection to preview page after 800ms
      setTimeout(() => {
        window.location.href = '/preview';
      }, 800);
    });
  }

  // ==========================================
  // 14. INITIALIZE ON LOAD
  // ==========================================
  // Check if we have an existing draft or saved portfolio data
  const existingData = PortfolioGenerator.getData() || PortfolioGenerator.getDraft();
  if (existingData) {
    populateForm(existingData);
  } else {
    // Add default initial empty rows
    window.addEducationEntry();
    window.addProjectEntry();
  }

  updateWizardUI();
});
