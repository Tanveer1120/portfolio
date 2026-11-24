/**
 * Student Portfolio Form Controller
 * Streamlined 4-Step Architecture with Searchable Skills & Languages,
 * Dynamic Repeaters, LocalStorage Auto-Saving, and History Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wizard State
  let currentStep = 1;
  const totalSteps = 4;
  let selectedTemplate = 'corporate';
  let profilePhotoBase64 = '';
  let autoSaveTimeout = null;

  // Selected Skills and Languages sets
  let selectedSkills = [];
  let selectedLanguages = [];

  const stepTitles = [
    '',
    'Profile and Introduction',
    'Education, Skills & Languages',
    'Experience & Projects',
    'Final Details & Template'
  ];

  // Predefined Skills categorized
  const PREDEFINED_SKILLS = [
    // Programming Languages
    { name: 'JavaScript', category: 'Programming Languages' },
    { name: 'TypeScript', category: 'Programming Languages' },
    { name: 'Python', category: 'Programming Languages' },
    { name: 'Java', category: 'Programming Languages' },
    { name: 'C++', category: 'Programming Languages' },
    { name: 'C', category: 'Programming Languages' },
    { name: 'C#', category: 'Programming Languages' },
    { name: 'Go', category: 'Programming Languages' },
    { name: 'Rust', category: 'Programming Languages' },
    { name: 'PHP', category: 'Programming Languages' },
    { name: 'Ruby', category: 'Programming Languages' },
    { name: 'Swift', category: 'Programming Languages' },
    { name: 'Kotlin', category: 'Programming Languages' },
    { name: 'SQL', category: 'Programming Languages' },

    // Web Technologies
    { name: 'HTML5', category: 'Web Technologies' },
    { name: 'CSS3', category: 'Web Technologies' },
    { name: 'Tailwind CSS', category: 'Web Technologies' },
    { name: 'Bootstrap', category: 'Web Technologies' },
    { name: 'Sass / SCSS', category: 'Web Technologies' },
    { name: 'Next.js', category: 'Web Technologies' },
    { name: 'Redux Toolkit', category: 'Web Technologies' },
    { name: 'Vite', category: 'Web Technologies' },

    // Frameworks
    { name: 'React', category: 'Frameworks' },
    { name: 'Node.js', category: 'Frameworks' },
    { name: 'Express.js', category: 'Frameworks' },
    { name: 'Angular', category: 'Frameworks' },
    { name: 'Vue.js', category: 'Frameworks' },
    { name: 'Django', category: 'Frameworks' },
    { name: 'Flask', category: 'Frameworks' },
    { name: 'Spring Boot', category: 'Frameworks' },
    { name: 'FastAPI', category: 'Frameworks' },

    // Databases
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'MongoDB', category: 'Databases' },
    { name: 'MySQL', category: 'Databases' },
    { name: 'SQLite', category: 'Databases' },
    { name: 'Redis', category: 'Databases' },
    { name: 'Firebase', category: 'Databases' },
    { name: 'Supabase', category: 'Databases' },

    // Software and Tools
    { name: 'Git & GitHub', category: 'Software and Tools' },
    { name: 'VS Code', category: 'Software and Tools' },
    { name: 'Postman', category: 'Software and Tools' },
    { name: 'Docker', category: 'Software and Tools' },
    { name: 'Linux / Bash', category: 'Software and Tools' },
    { name: 'AWS', category: 'Software and Tools' },
    { name: 'Figma', category: 'Software and Tools' },
    { name: 'Jira', category: 'Software and Tools' },

    // Technical Skills
    { name: 'Data Structures & Algorithms', category: 'Technical Skills' },
    { name: 'RESTful API Design', category: 'Technical Skills' },
    { name: 'Object-Oriented Programming', category: 'Technical Skills' },
    { name: 'System Architecture', category: 'Technical Skills' },
    { name: 'CI/CD Pipelines', category: 'Technical Skills' },
    { name: 'Microservices', category: 'Technical Skills' },
    { name: 'Unit Testing / Jest', category: 'Technical Skills' },

    // Professional Skills
    { name: 'Problem Solving', category: 'Professional Skills' },
    { name: 'Team Collaboration', category: 'Professional Skills' },
    { name: 'Technical Communication', category: 'Professional Skills' },
    { name: 'Project Management', category: 'Professional Skills' },
    { name: 'Critical Thinking', category: 'Professional Skills' },
    { name: 'Agile & Scrum', category: 'Professional Skills' }
  ];

  // DOM Elements
  const stepPanels = document.querySelectorAll('.form-step-panel');
  const stepperProgressFill = document.getElementById('stepperProgressFill');
  const stepperStepIndicator = document.getElementById('stepperStepIndicator');
  const stepperPillsList = document.getElementById('stepperPillsList');
  const autoSaveBadge = document.getElementById('autoSaveBadge');

  // Containers for Repeaters
  const educationContainer = document.getElementById('educationContainer');
  const projectsContainer = document.getElementById('projectsContainer');
  const experienceContainer = document.getElementById('experienceContainer');
  const certsContainer = document.getElementById('certsContainer');

  // Photo Upload Elements
  const photoFileInput = document.getElementById('photoFileInput');
  const photoPreviewImg = document.getElementById('photoPreviewImg');
  const photoPlaceholderSvg = document.getElementById('photoPlaceholderSvg');
  const removePhotoBtn = document.getElementById('removePhotoBtn');

  // Skills Elements
  const skillCategoryTabs = document.getElementById('skillCategoryTabs');
  const skillSearchInput = document.getElementById('skillSearchInput');
  const customSkillInput = document.getElementById('customSkillInput');
  const addCustomSkillBtn = document.getElementById('addCustomSkillBtn');
  const predefinedSkillsCloud = document.getElementById('predefinedSkillsCloud');
  const selectedSkillsTags = document.getElementById('selectedSkillsTags');
  const selectedSkillsCount = document.getElementById('selectedSkillsCount');
  const clearAllSkillsBtn = document.getElementById('clearAllSkillsBtn');
  const noSkillsText = document.getElementById('noSkillsText');

  // Languages Elements
  const languageInput = document.getElementById('languageInput');
  const languageProficiencySelect = document.getElementById('languageProficiencySelect');
  const addLanguageBtn = document.getElementById('addLanguageBtn');
  const selectedLanguagesTags = document.getElementById('selectedLanguagesTags');

  // Template Picker Cards
  const templateCards = document.querySelectorAll('.template-picker-card');
  const generatePortfolioBtn = document.getElementById('generatePortfolioBtn');

  // =========================================================================
  // 1. STEP NAVIGATION CONTROLLER
  // =========================================================================
  window.goToStep = function(stepIndex, pushHistory = true) {
    if (stepIndex < 1 || stepIndex > totalSteps) return;
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

    renderStepperPills();

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // History API
    if (pushHistory) {
      history.pushState({ step: currentStep }, `Step ${currentStep}`, `?step=${currentStep}`);
    }

    triggerAutoSave();
  };

  window.validateAndGoStep = function(targetStep) {
    if (currentStep === 1) {
      const nameInput = document.getElementById('inputFullName');
      const titleInput = document.getElementById('inputTitle');
      const emailInput = document.getElementById('inputEmail');

      let isValid = true;
      if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        isValid = false;
      } else {
        nameInput.classList.remove('is-invalid');
      }

      if (!titleInput.value.trim()) {
        titleInput.classList.add('is-invalid');
        isValid = false;
      } else {
        titleInput.classList.remove('is-invalid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        isValid = false;
      } else {
        emailInput.classList.remove('is-invalid');
      }

      if (!isValid) {
        const firstInvalid = document.querySelector('.form-step-panel.active .is-invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
        return;
      }
    }

    goToStep(targetStep);
  };

  function renderStepperPills() {
    if (!stepperPillsList) return;
    stepperPillsList.innerHTML = '';

    const pillLabels = [
      '1. Profile & Contact',
      '2. Education & Skills',
      '3. Projects & Experience',
      '4. Final & Design'
    ];

    for (let i = 1; i <= totalSteps; i++) {
      const li = document.createElement('li');
      li.className = 'stepper-pill-item';
      if (i === currentStep) {
        li.classList.add('active');
      } else if (i < currentStep) {
        li.classList.add('completed');
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stepper-pill-btn';
      btn.textContent = pillLabels[i - 1];

      // Allow clicking previous steps or current step
      btn.addEventListener('click', () => {
        if (i < currentStep) {
          goToStep(i);
        } else if (i > currentStep) {
          validateAndGoStep(i);
        }
      });

      li.appendChild(btn);
      stepperPillsList.appendChild(li);
    }
  }

  // Handle browser Back / Forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.step) {
      goToStep(e.state.step, false);
    } else {
      const params = new URLSearchParams(window.location.search);
      const stepParam = parseInt(params.get('step'), 10);
      if (stepParam && stepParam >= 1 && stepParam <= totalSteps) {
        goToStep(stepParam, false);
      } else {
        goToStep(1, false);
      }
    }
  });

  // =========================================================================
  // 2. SEARCHABLE SKILLS SELECTOR
  // =========================================================================
  let currentSkillCategory = 'all';

  function renderPredefinedSkills() {
    if (!predefinedSkillsCloud) return;
    predefinedSkillsCloud.innerHTML = '';

    const searchQuery = (skillSearchInput ? skillSearchInput.value : '').toLowerCase().trim();

    const filtered = PREDEFINED_SKILLS.filter(item => {
      const matchesCat = currentSkillCategory === 'all' || item.category === currentSkillCategory;
      const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      predefinedSkillsCloud.innerHTML = '<span class="text-secondary small fst-italic">No matching skills found. Add a custom skill above!</span>';
      return;
    }

    filtered.forEach(item => {
      const isSelected = selectedSkills.includes(item.name);
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `skill-cloud-chip ${isSelected ? 'selected' : ''}`;
      chip.textContent = item.name;

      chip.addEventListener('click', () => {
        toggleSkill(item.name);
      });

      predefinedSkillsCloud.appendChild(chip);
    });
  }

  function toggleSkill(skillName) {
    const idx = selectedSkills.indexOf(skillName);
    if (idx >= 0) {
      selectedSkills.splice(idx, 1);
    } else {
      selectedSkills.push(skillName);
    }
    updateSelectedSkillsUI();
    renderPredefinedSkills();
    triggerAutoSave();
  }

  function addSkill(skillName) {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (!selectedSkills.includes(trimmed)) {
      selectedSkills.push(trimmed);
      updateSelectedSkillsUI();
      renderPredefinedSkills();
      triggerAutoSave();
    }
  }

  function removeSkill(skillName) {
    selectedSkills = selectedSkills.filter(s => s !== skillName);
    updateSelectedSkillsUI();
    renderPredefinedSkills();
    triggerAutoSave();
  }

  function updateSelectedSkillsUI() {
    if (!selectedSkillsTags) return;
    selectedSkillsTags.innerHTML = '';

    if (selectedSkillsCount) {
      selectedSkillsCount.textContent = selectedSkills.length;
    }

    if (selectedSkills.length === 0) {
      if (noSkillsText) {
        selectedSkillsTags.appendChild(noSkillsText);
      }
      return;
    }

    selectedSkills.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'removable-tag';
      tag.innerHTML = `
        <span>${escapeHtml(skill)}</span>
        <button type="button" class="tag-remove-btn" title="Remove skill">&times;</button>
      `;

      tag.querySelector('.tag-remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        removeSkill(skill);
      });

      selectedSkillsTags.appendChild(tag);
    });
  }

  // Category Tabs Filter
  if (skillCategoryTabs) {
    const filterBtns = skillCategoryTabs.querySelectorAll('.category-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSkillCategory = btn.getAttribute('data-cat');
        renderPredefinedSkills();
      });
    });
  }

  // Skill Search Input
  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', () => {
      renderPredefinedSkills();
    });
  }

  // Custom Skill Add
  if (addCustomSkillBtn && customSkillInput) {
    addCustomSkillBtn.addEventListener('click', () => {
      if (customSkillInput.value.trim()) {
        addSkill(customSkillInput.value.trim());
        customSkillInput.value = '';
      }
    });

    customSkillInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addCustomSkillBtn.click();
      }
    });
  }

  // Clear All Skills
  if (clearAllSkillsBtn) {
    clearAllSkillsBtn.addEventListener('click', () => {
      selectedSkills = [];
      updateSelectedSkillsUI();
      renderPredefinedSkills();
      triggerAutoSave();
    });
  }

  // =========================================================================
  // 3. LANGUAGES SELECTOR
  // =========================================================================
  function addLanguageItem(name, proficiency = 'Fluent') {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Check if already added
    const existing = selectedLanguages.find(l => l.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      existing.proficiency = proficiency;
    } else {
      selectedLanguages.push({ name: trimmed, proficiency });
    }

    updateSelectedLanguagesUI();
    triggerAutoSave();
  }

  function removeLanguageItem(name) {
    selectedLanguages = selectedLanguages.filter(l => l.name.toLowerCase() !== name.toLowerCase());
    updateSelectedLanguagesUI();
    triggerAutoSave();
  }

  function updateSelectedLanguagesUI() {
    if (!selectedLanguagesTags) return;
    selectedLanguagesTags.innerHTML = '';

    if (selectedLanguages.length === 0) {
      selectedLanguagesTags.innerHTML = '<span class="text-secondary small fst-italic">No languages added yet.</span>';
      return;
    }

    selectedLanguages.forEach(lang => {
      const tag = document.createElement('span');
      tag.className = 'removable-tag lang-tag';
      tag.innerHTML = `
        <span><strong>${escapeHtml(lang.name)}</strong> <small class="text-secondary">(${escapeHtml(lang.proficiency)})</small></span>
        <button type="button" class="tag-remove-btn" title="Remove language">&times;</button>
      `;

      tag.querySelector('.tag-remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        removeLanguageItem(lang.name);
      });

      selectedLanguagesTags.appendChild(tag);
    });
  }

  if (addLanguageBtn && languageInput && languageProficiencySelect) {
    addLanguageBtn.addEventListener('click', () => {
      if (languageInput.value.trim()) {
        addLanguageItem(languageInput.value.trim(), languageProficiencySelect.value);
        languageInput.value = '';
      }
    });

    languageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addLanguageBtn.click();
      }
    });
  }

  // =========================================================================
  // 4. DYNAMIC REPEATERS (Education, Projects, Experience, Certifications)
  // =========================================================================

  // Helper for generating repeatable card containers
  function createRepeatableCard(title, onRemove, fieldsHtml) {
    const card = document.createElement('div');
    card.className = 'repeater-item-card';
    card.innerHTML = `
      <div class="repeater-card-header">
        <h4 class="repeater-card-title">${title}</h4>
        <button type="button" class="btn-remove-item text-danger" title="Remove this entry">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          <span>Remove</span>
        </button>
      </div>
      <div class="repeater-card-body">
        ${fieldsHtml}
      </div>
    `;

    card.querySelector('.btn-remove-item').addEventListener('click', () => {
      onRemove(card);
      triggerAutoSave();
    });

    // Auto-save on input
    card.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', triggerAutoSave);
    });

    return card;
  }

  // --- Education Repeater ---
  function addEducationRow(data = {}) {
    const count = educationContainer.querySelectorAll('.repeater-item-card').length + 1;
    const fields = `
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label-corp">College / Institution Name <span class="required-star">*</span></label>
          <input type="text" class="form-control-corp edu-institution" placeholder="e.g. Stanford University" value="${escapeAttr(data.institution || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">Degree / Course <span class="required-star">*</span></label>
          <input type="text" class="form-control-corp edu-degree" placeholder="e.g. B.S. in Computer Science" value="${escapeAttr(data.degree || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">Department / Specialization</label>
          <input type="text" class="form-control-corp edu-dept" placeholder="e.g. Artificial Intelligence &amp; Data Science" value="${escapeAttr(data.department || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">Affiliated University (Optional)</label>
          <input type="text" class="form-control-corp edu-univ" placeholder="e.g. State Technical University" value="${escapeAttr(data.university || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label-corp">Study Period (Start - End)</label>
          <input type="text" class="form-control-corp edu-period" placeholder="e.g. 2022 - 2026" value="${escapeAttr(data.studyPeriod || (data.startYear && data.gradYear ? `${data.startYear} - ${data.gradYear}` : ''))}">
        </div>
        <div class="col-md-4">
          <label class="form-label-corp">Graduation Year</label>
          <input type="text" class="form-control-corp edu-grad-year" placeholder="e.g. 2026" value="${escapeAttr(data.gradYear || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label-corp">CGPA / Percentage</label>
          <input type="text" class="form-control-corp edu-score" placeholder="e.g. 3.92 / 4.0 or 88%" value="${escapeAttr(data.score || data.cgpa || '')}">
        </div>
        <div class="col-12">
          <label class="form-label-corp">Academic Highlights / Coursework (Optional)</label>
          <input type="text" class="form-control-corp edu-highlights" placeholder="e.g. Dean's List (Top 5%), Algorithms, Operating Systems, Cloud Computing" value="${escapeAttr(data.coursework || data.highlights || '')}">
        </div>
      </div>
    `;

    const card = createRepeatableCard(`Education Entry #${count}`, (el) => {
      if (educationContainer.children.length > 1) {
        el.remove();
        updateEducationHeaders();
      } else {
        alert('At least one education record is recommended.');
      }
    }, fields);

    educationContainer.appendChild(card);
    updateEducationHeaders();
  }

  function updateEducationHeaders() {
    educationContainer.querySelectorAll('.repeater-item-card').forEach((card, index) => {
      card.querySelector('.repeater-card-title').textContent = `Education Entry #${index + 1}`;
    });
  }

  document.getElementById('addEducationBtn').addEventListener('click', () => {
    addEducationRow();
    triggerAutoSave();
  });

  // --- Projects Repeater ---
  function addProjectRow(data = {}) {
    const count = projectsContainer.querySelectorAll('.repeater-item-card').length + 1;
    const fields = `
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label-corp">Project Name <span class="required-star">*</span></label>
          <input type="text" class="form-control-corp proj-name" placeholder="e.g. AI-Powered Medical Diagnosis Hub" value="${escapeAttr(data.name || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">Technologies &amp; Tools Used</label>
          <input type="text" class="form-control-corp proj-tech" placeholder="e.g. React, Node.js, Python, PostgreSQL, Docker" value="${escapeAttr(data.technologies || '')}">
        </div>
        <div class="col-12">
          <label class="form-label-corp">Short Project Description</label>
          <textarea rows="3" class="form-control-corp proj-desc" placeholder="Explain the project scope, technical challenges solved, architecture, and measurable outcome.">${escapeHtml(data.description || '')}</textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">GitHub Repository Link (Optional)</label>
          <input type="url" class="form-control-corp proj-github" placeholder="https://github.com/username/project" value="${escapeAttr(data.githubUrl || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">Live Demo Link (Optional)</label>
          <input type="url" class="form-control-corp proj-live" placeholder="https://project-demo.com" value="${escapeAttr(data.liveUrl || '')}">
        </div>
      </div>
    `;

    const card = createRepeatableCard(`Project #${count}`, (el) => {
      el.remove();
      updateProjectHeaders();
    }, fields);

    projectsContainer.appendChild(card);
    updateProjectHeaders();
  }

  function updateProjectHeaders() {
    projectsContainer.querySelectorAll('.repeater-item-card').forEach((card, index) => {
      card.querySelector('.repeater-card-title').textContent = `Project #${index + 1}`;
    });
  }

  document.getElementById('addProjectBtn').addEventListener('click', () => {
    addProjectRow();
    triggerAutoSave();
  });

  // --- Experience Repeater ---
  function addExperienceRow(data = {}) {
    const count = experienceContainer.querySelectorAll('.repeater-item-card').length + 1;
    const fields = `
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label-corp">Organization / Company Name</label>
          <input type="text" class="form-control-corp exp-org" placeholder="e.g. Google Cloud / Startup Inc." value="${escapeAttr(data.organization || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">Position / Role</label>
          <input type="text" class="form-control-corp exp-role" placeholder="e.g. Software Engineering Intern" value="${escapeAttr(data.position || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">Duration</label>
          <input type="text" class="form-control-corp exp-duration" placeholder="e.g. June 2024 - August 2024" value="${escapeAttr(data.duration || (data.startDate && data.endDate ? `${data.startDate} - ${data.endDate}` : ''))}">
        </div>
        <div class="col-12">
          <label class="form-label-corp">Responsibilities &amp; Work Description</label>
          <textarea rows="2" class="form-control-corp exp-desc" placeholder="Detail key contributions, modules built, optimizations achieved, or teams collaborated with.">${escapeHtml(data.responsibilities || data.description || '')}</textarea>
        </div>
      </div>
    `;

    const card = createRepeatableCard(`Experience #${count}`, (el) => {
      el.remove();
      updateExperienceHeaders();
    }, fields);

    experienceContainer.appendChild(card);
    updateExperienceHeaders();
  }

  function updateExperienceHeaders() {
    experienceContainer.querySelectorAll('.repeater-item-card').forEach((card, index) => {
      card.querySelector('.repeater-card-title').textContent = `Experience #${index + 1}`;
    });
  }

  document.getElementById('addExperienceBtn').addEventListener('click', () => {
    addExperienceRow();
    triggerAutoSave();
  });

  // --- Certifications Repeater ---
  function addCertRow(data = {}) {
    const count = certsContainer.querySelectorAll('.repeater-item-card').length + 1;
    const fields = `
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label-corp">Certification / Award Name</label>
          <input type="text" class="form-control-corp cert-name" placeholder="e.g. AWS Certified Solutions Architect" value="${escapeAttr(data.name || '')}">
        </div>
        <div class="col-md-6">
          <label class="form-label-corp">Issuing Organization</label>
          <input type="text" class="form-control-corp cert-org" placeholder="e.g. Amazon Web Services" value="${escapeAttr(data.organization || '')}">
        </div>
        <div class="col-md-4">
          <label class="form-label-corp">Year</label>
          <input type="text" class="form-control-corp cert-year" placeholder="e.g. 2024" value="${escapeAttr(data.issueDate || data.year || '')}">
        </div>
        <div class="col-md-8">
          <label class="form-label-corp">Credential Link or ID (Optional)</label>
          <input type="url" class="form-control-corp cert-url" placeholder="https://credential.net/verify/..." value="${escapeAttr(data.url || data.credentialId || '')}">
        </div>
      </div>
    `;

    const card = createRepeatableCard(`Certification #${count}`, (el) => {
      el.remove();
      updateCertHeaders();
    }, fields);

    certsContainer.appendChild(card);
    updateCertHeaders();
  }

  function updateCertHeaders() {
    certsContainer.querySelectorAll('.repeater-item-card').forEach((card, index) => {
      card.querySelector('.repeater-card-title').textContent = `Certification #${index + 1}`;
    });
  }

  document.getElementById('addCertBtn').addEventListener('click', () => {
    addCertRow();
    triggerAutoSave();
  });

  // =========================================================================
  // 5. PROFILE PHOTO UPLOAD
  // =========================================================================
  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, WebP).');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Image file size must be under 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        profilePhotoBase64 = event.target.result;
        photoPreviewImg.src = profilePhotoBase64;
        photoPreviewImg.classList.remove('d-none');
        photoPlaceholderSvg.classList.add('d-none');
        removePhotoBtn.classList.remove('d-none');
        triggerAutoSave();
      };
      reader.readAsDataURL(file);
    });
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
      profilePhotoBase64 = '';
      photoFileInput.value = '';
      photoPreviewImg.src = '';
      photoPreviewImg.classList.add('d-none');
      photoPlaceholderSvg.classList.remove('d-none');
      removePhotoBtn.classList.add('d-none');
      triggerAutoSave();
    });
  }

  // =========================================================================
  // 6. TEMPLATE PICKER SELECTION
  // =========================================================================
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      templateCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      selectedTemplate = card.getAttribute('data-template');
      triggerAutoSave();
    });
  });

  // =========================================================================
  // 7. DATA SERIALIZATION & AUTOSAVE
  // =========================================================================
  function collectFormData() {
    const getVal = (id) => {
      const el = document.getElementById(id);
      return el && el.value ? el.value.trim() : '';
    };
    const getChildVal = (parent, selector) => {
      if (!parent) return '';
      const el = parent.querySelector(selector);
      return el && el.value ? el.value.trim() : '';
    };

    // 1. Personal & Contact
    const fullName = getVal('inputFullName');
    const title = getVal('inputTitle');
    const summary = getVal('inputSummary');
    const location = getVal('inputLocation');
    const email = getVal('inputEmail');
    const phone = getVal('inputPhone');
    const linkedin = getVal('inputLinkedIn');
    const github = getVal('inputGitHub');
    const website = getVal('inputWebsite');

    // 2. Education
    const education = [];
    if (educationContainer) {
      educationContainer.querySelectorAll('.repeater-item-card').forEach(card => {
        const institution = getChildVal(card, '.edu-institution');
        const degree = getChildVal(card, '.edu-degree');
        const department = getChildVal(card, '.edu-dept');
        const university = getChildVal(card, '.edu-univ');
        const studyPeriod = getChildVal(card, '.edu-period');
        const gradYear = getChildVal(card, '.edu-grad-year');
        const score = getChildVal(card, '.edu-score');
        const coursework = getChildVal(card, '.edu-highlights');

        if (institution || degree || department || score) {
          education.push({
            institution,
            degree,
            department,
            university,
            studyPeriod,
            gradYear,
            score,
            coursework
          });
        }
      });
    }

    // 3. Skills & Languages
    const skills = selectedSkills.map(s => ({ name: s }));
    const languages = selectedLanguages.map(l => ({ name: l.name, proficiency: l.proficiency }));

    // 4. Projects
    const projects = [];
    if (projectsContainer) {
      projectsContainer.querySelectorAll('.repeater-item-card').forEach(card => {
        const name = getChildVal(card, '.proj-name');
        const technologies = getChildVal(card, '.proj-tech');
        const description = getChildVal(card, '.proj-desc');
        const githubUrl = getChildVal(card, '.proj-github');
        const liveUrl = getChildVal(card, '.proj-live');

        if (name || description || technologies) {
          projects.push({
            name,
            technologies,
            description,
            githubUrl,
            liveUrl
          });
        }
      });
    }

    // 5. Experience
    const experience = [];
    if (experienceContainer) {
      experienceContainer.querySelectorAll('.repeater-item-card').forEach(card => {
        const organization = getChildVal(card, '.exp-org');
        const position = getChildVal(card, '.exp-role');
        const duration = getChildVal(card, '.exp-duration');
        const responsibilities = getChildVal(card, '.exp-desc');

        if (organization || position || responsibilities) {
          experience.push({
            organization,
            position,
            duration,
            responsibilities
          });
        }
      });
    }

    // 6. Certifications
    const certifications = [];
    if (certsContainer) {
      certsContainer.querySelectorAll('.repeater-item-card').forEach(card => {
        const name = getChildVal(card, '.cert-name');
        const organization = getChildVal(card, '.cert-org');
        const issueDate = getChildVal(card, '.cert-year');
        const url = getChildVal(card, '.cert-url');

        if (name || organization) {
          certifications.push({
            name,
            organization,
            issueDate,
            url
          });
        }
      });
    }

    // 7. Additional Info
    const interests = getVal('inputInterests');
    const activities = getVal('inputActivities');
    const workshops = getVal('inputWorkshops');

    // 8. Template
    const checkedRadio = document.querySelector('input[name="selectedTemplateRadio"]:checked');
    const template = (checkedRadio && checkedRadio.value) ? checkedRadio.value : (selectedTemplate || 'corporate');

    return {
      template,
      personal: {
        fullName: fullName || 'Student',
        title,
        photo: profilePhotoBase64,
        summary,
        location,
        email,
        phone,
        linkedin,
        github,
        website
      },
      education,
      skills,
      languages,
      projects,
      experience,
      certifications,
      additional: {
        interests,
        activities,
        workshops
      },
      additionalInfo: {
        interests,
        activities,
        workshops
      }
    };
  }

  function triggerAutoSave() {
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      try {
        const data = collectFormData();
        localStorage.setItem('student_portfolio_data', JSON.stringify(data));
        localStorage.setItem('student_portfolio_form_draft', JSON.stringify(data));

        if (autoSaveBadge) {
          autoSaveBadge.style.opacity = '1';
          setTimeout(() => {
            autoSaveBadge.style.opacity = '0.7';
          }, 1200);
        }
      } catch (err) {
        console.warn('Autosave warning:', err);
      }
    }, 400);
  }

  // Attach input listener to static form fields
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', triggerAutoSave);
  });

  // =========================================================================
  // 8. POPULATE FORM FROM DATA OBJECT
  // =========================================================================
  function populateForm(rawData) {
    if (!rawData) return;
    const data = rawData.data || rawData;

    // Template
    if (data.template) {
      selectedTemplate = data.template;
      templateCards.forEach(card => {
        if (card.getAttribute('data-template') === data.template) {
          card.classList.add('selected');
          const radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        } else {
          card.classList.remove('selected');
        }
      });
    }

    // Personal
    const p = data.personal || {};
    document.getElementById('inputFullName').value = p.fullName || '';
    document.getElementById('inputTitle').value = p.title || '';
    document.getElementById('inputSummary').value = p.summary || '';
    document.getElementById('inputLocation').value = p.location || (p.city && p.state ? `${p.city}, ${p.state}` : p.city || '');
    document.getElementById('inputEmail').value = p.email || '';
    document.getElementById('inputPhone').value = p.phone || '';
    document.getElementById('inputLinkedIn').value = p.linkedin || '';
    document.getElementById('inputGitHub').value = p.github || '';
    document.getElementById('inputWebsite').value = p.website || '';

    // Photo
    if (p.photo) {
      profilePhotoBase64 = p.photo;
      photoPreviewImg.src = profilePhotoBase64;
      photoPreviewImg.classList.remove('d-none');
      photoPlaceholderSvg.classList.add('d-none');
      removePhotoBtn.classList.remove('d-none');
    }

    // Education
    educationContainer.innerHTML = '';
    if (Array.isArray(data.education) && data.education.length > 0) {
      data.education.forEach(edu => addEducationRow(edu));
    } else {
      addEducationRow();
    }

    // Skills
    selectedSkills = [];
    if (Array.isArray(data.skills)) {
      data.skills.forEach(s => {
        const name = typeof s === 'string' ? s : s.name;
        if (name && !selectedSkills.includes(name)) {
          selectedSkills.push(name);
        }
      });
    }
    updateSelectedSkillsUI();
    renderPredefinedSkills();

    // Languages
    selectedLanguages = [];
    if (Array.isArray(data.languages)) {
      data.languages.forEach(l => {
        if (typeof l === 'string') {
          selectedLanguages.push({ name: l, proficiency: 'Fluent' });
        } else if (l && l.name) {
          selectedLanguages.push({ name: l.name, proficiency: l.proficiency || 'Fluent' });
        }
      });
    }
    updateSelectedLanguagesUI();

    // Projects
    projectsContainer.innerHTML = '';
    if (Array.isArray(data.projects) && data.projects.length > 0) {
      data.projects.forEach(proj => addProjectRow(proj));
    } else {
      addProjectRow();
    }

    // Experience
    experienceContainer.innerHTML = '';
    if (Array.isArray(data.experience) && data.experience.length > 0) {
      data.experience.forEach(exp => addExperienceRow(exp));
    } else {
      addExperienceRow();
    }

    // Certifications
    certsContainer.innerHTML = '';
    if (Array.isArray(data.certifications) && data.certifications.length > 0) {
      data.certifications.forEach(cert => addCertRow(cert));
    }

    // Additional Info
    const addl = data.additionalInfo || {};
    document.getElementById('inputInterests').value = addl.interests || '';
    document.getElementById('inputActivities').value = addl.activities || '';
    document.getElementById('inputWorkshops').value = addl.workshops || '';

    triggerAutoSave();
  }

  // =========================================================================
  // 9. SAMPLE DATA & RESET BUTTONS
  // =========================================================================
  const fillDemoBtn = document.getElementById('fillDemoBtn');
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', async () => {
      try {
        fillDemoBtn.disabled = true;
        fillDemoBtn.textContent = 'Loading...';
        const res = await fetch('/api/demo-data');
        if (!res.ok) throw new Error('Failed to load demo data');
        const json = await res.json();
        const demoData = json.data || json;
        populateForm(demoData);
        fillDemoBtn.textContent = 'Sample Loaded!';
        setTimeout(() => {
          fillDemoBtn.disabled = false;
          fillDemoBtn.textContent = 'Fill Sample Data';
        }, 1500);
      } catch (err) {
        console.error(err);
        alert('Could not load sample data: ' + err.message);
        fillDemoBtn.disabled = false;
        fillDemoBtn.textContent = 'Fill Sample Data';
      }
    });
  }

  const clearFormBtn = document.getElementById('clearFormBtn');
  if (clearFormBtn) {
    clearFormBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all form entries? This cannot be undone.')) {
        localStorage.removeItem('student_portfolio_data');
        localStorage.removeItem('student_portfolio_form_draft');
        window.location.reload();
      }
    });
  }

  // =========================================================================
  // 10. GENERATE PORTFOLIO
  // =========================================================================
  window.generatePortfolio = function() {
    try {
      const fullData = collectFormData();
      const templateToUse = fullData.template || selectedTemplate || 'corporate';

      // Store in localStorage safely
      try {
        localStorage.setItem('student_portfolio_data', JSON.stringify(fullData));
        localStorage.setItem('student_portfolio_form_draft', JSON.stringify(fullData));
      } catch (storageErr) {
        console.warn('Storage quota issue, stripping photo fallback:', storageErr);
        if (fullData.personal && fullData.personal.photo) {
          fullData.personal.photo = '';
          try {
            localStorage.setItem('student_portfolio_data', JSON.stringify(fullData));
          } catch (e2) {}
        }
      }

      // Navigate to the preview page with template query param
      window.location.href = `/preview?template=${encodeURIComponent(templateToUse)}`;
    } catch (err) {
      console.error('Error generating portfolio:', err);
      window.location.href = '/preview';
    }
  };

  if (generatePortfolioBtn) {
    generatePortfolioBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.generatePortfolio();
    });
  }

  // =========================================================================
  // 11. INITIALIZATION: RESTORE DRAFT IF EXISTS
  // =========================================================================
  renderPredefinedSkills();
  updateSelectedSkillsUI();
  updateSelectedLanguagesUI();

  try {
    const saved = localStorage.getItem('student_portfolio_data') || localStorage.getItem('student_portfolio_form_draft');
    if (saved) {
      const parsed = JSON.parse(saved);
      populateForm(parsed);
    } else {
      // Initialize with default blank rows
      addEducationRow();
      addProjectRow();
    }
  } catch (e) {
    console.error('Error loading stored portfolio data:', e);
    addEducationRow();
    addProjectRow();
  }

  // Check URL query parameters for template preselection or step
  const urlParams = new URLSearchParams(window.location.search);
  const tmplQuery = urlParams.get('template');
  if (tmplQuery) {
    const targetCard = Array.from(templateCards).find(c => c.getAttribute('data-template') === tmplQuery);
    if (targetCard) {
      targetCard.click();
    }
  }

  const stepQuery = parseInt(urlParams.get('step'), 10);
  if (stepQuery && stepQuery >= 1 && stepQuery <= totalSteps) {
    goToStep(stepQuery, false);
  } else {
    goToStep(1, false);
  }

  // Helper Escapes
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
});
