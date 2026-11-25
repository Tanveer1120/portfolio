/**
 * Professional Portfolio Generator Engine
 * Multi-page A4 PDF Generation, Print Formatting, LocalStorage Persistence & Export
 */

const PortfolioGenerator = {
  STORAGE_KEY: 'student_portfolio_data',
  DRAFT_KEY: 'student_portfolio_form_draft',

  // Save finalized portfolio data
  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving portfolio data to LocalStorage:', e);
      return false;
    }
  },

  // Retrieve portfolio data
  getData() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Error reading portfolio data:', e);
      return null;
    }
  },

  // Save temporary form draft
  saveDraft(data) {
    try {
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Get form draft
  getDraft() {
    try {
      const raw = localStorage.getItem(this.DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  // Clear data
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.DRAFT_KEY);
    localStorage.removeItem('student_portfolio_published_id');
    localStorage.removeItem('student_portfolio_published_url');
    localStorage.removeItem('student_portfolio_published_share_url');
  },

  // Generate HTML: Generates the full Personal Portfolio Website for the creator
  generate(data, templateId) {
    if (!data) return '<div class="portfolio-site-wrapper"><div class="container py-5 text-center">No portfolio data available.</div></div>';
    return this.renderPortfolioWebsite(data);
  },

  // Publish or update portfolio on the backend persistent storage
  async publishPortfolio(optData) {
    const data = optData || this.getData() || this.getDraft();
    if (!data) throw new Error('No portfolio data available to publish');

    let existingId = null;
    try {
      existingId = localStorage.getItem('student_portfolio_published_id') || null;
    } catch (e) {}

    const resp = await fetch('/api/portfolios/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, publishedId: existingId })
    });

    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      throw new Error(errJson.message || 'Server failed to publish portfolio');
    }

    const result = await resp.json();
    if (result.success && result.id) {
      try {
        localStorage.setItem('student_portfolio_published_id', result.id);
        localStorage.setItem('student_portfolio_published_url', result.publicUrl);
        localStorage.setItem('student_portfolio_published_share_url', result.fullShareUrl);
      } catch (e) {}
    }

    return result;
  },

  // Retrieve cached publishing info
  getPublishedInfo() {
    try {
      const id = localStorage.getItem('student_portfolio_published_id');
      const publicUrl = localStorage.getItem('student_portfolio_published_url');
      const fullShareUrl = localStorage.getItem('student_portfolio_published_share_url');
      if (id && publicUrl) {
        return { id, publicUrl, fullShareUrl: fullShareUrl || (window.location.origin + publicUrl) };
      }
    } catch (e) {}
    return null;
  },

  // Normalize skills into a categorized structure
  categorizeSkills(skills) {
    const groups = {
      'Programming Languages': [],
      'Web Technologies & Frameworks': [],
      'Databases & Cloud': [],
      'Tools & Software': [],
      'Professional Skills': []
    };

    if (!skills) return groups;

    if (Array.isArray(skills)) {
      skills.forEach(s => {
        if (!s) return;
        if (typeof s === 'string') {
          groups['Programming Languages'].push(s.trim());
        } else if (s.name) {
          const cat = s.category || 'Programming Languages';
          if (cat.includes('Language') || cat.includes('Programming')) groups['Programming Languages'].push(s.name);
          else if (cat.includes('Web') || cat.includes('Framework') || cat.includes('Frontend') || cat.includes('Backend')) groups['Web Technologies & Frameworks'].push(s.name);
          else if (cat.includes('Database') || cat.includes('Cloud')) groups['Databases & Cloud'].push(s.name);
          else if (cat.includes('Tool') || cat.includes('Software')) groups['Tools & Software'].push(s.name);
          else groups['Professional Skills'].push(s.name);
        }
      });
    } else if (typeof skills === 'object') {
      if (skills.programmingLanguages) {
        skills.programmingLanguages.split(/[,;\n]+/).forEach(x => x.trim() && groups['Programming Languages'].push(x.trim()));
      }
      if (skills.frontend || skills.backend) {
        [skills.frontend, skills.backend].filter(Boolean).join(',').split(/[,;\n]+/).forEach(x => x.trim() && groups['Web Technologies & Frameworks'].push(x.trim()));
      }
      if (skills.databases || skills.cloud) {
        [skills.databases, skills.cloud].filter(Boolean).join(',').split(/[,;\n]+/).forEach(x => x.trim() && groups['Databases & Cloud'].push(x.trim()));
      }
      if (skills.tools) {
        skills.tools.split(/[,;\n]+/).forEach(x => x.trim() && groups['Tools & Software'].push(x.trim()));
      }
      if (skills.soft || skills.professional) {
        [skills.soft, skills.professional].filter(Boolean).join(',').split(/[,;\n]+/).forEach(x => x.trim() && groups['Professional Skills'].push(x.trim()));
      }
    } else if (typeof skills === 'string') {
      skills.split(/[,;\n]+/).forEach(x => x.trim() && groups['Programming Languages'].push(x.trim()));
    }

    // Clean empty categories
    const result = {};
    for (const [cat, list] of Object.entries(groups)) {
      if (list.length > 0) result[cat] = list;
    }
    return result;
  },

  // Normalize languages
  normalizeLanguages(data) {
    const raw = data.languages || (data.additionalInfo && data.additionalInfo.languages) || (data.additional && data.additional.languages);
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map(l => {
        if (!l) return '';
        if (typeof l === 'string') return l.trim();
        const name = l.name || '';
        const prof = l.proficiency ? ` (${l.proficiency})` : '';
        return (name + prof).trim();
      }).filter(Boolean);
    }
    if (typeof raw === 'string') {
      return raw.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    }
    return [];
  },

  // Normalize hobbies
  normalizeHobbies(data) {
    const raw = data.hobbies || (data.additionalInfo && data.additionalInfo.hobbies) || (data.additional && data.additional.hobbies) || (data.additional && data.additional.interests);
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map(h => typeof h === 'string' ? h.trim() : (h.name || '')).filter(Boolean);
    }
    if (typeof raw === 'string') {
      return raw.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    }
    return [];
  },

  // =========================================================================
  // MAJOR OUTPUT 1: COMPLETE PERSONAL PORTFOLIO WEBSITE RENDERER
  // =========================================================================
  renderPortfolioWebsite(data) {
    if (!data) return '<div class="portfolio-site-wrapper"><p>No data</p></div>';

    const p = data.personal || {};
    const fullName = p.fullName || 'Creator Portfolio';
    const title = p.title || data.category || 'Student & Aspiring Professional';
    const summary = p.summary || data.careerObjective || '';
    const locationStr = [p.city, p.state].filter(Boolean).join(', ') || p.location || '';

    // Avatar
    let avatarUrl = p.photo;
    if (!avatarUrl) {
      if (typeof window !== 'undefined' && window.PortfolioTemplates && typeof window.PortfolioTemplates.getAvatar === 'function') {
        avatarUrl = window.PortfolioTemplates.getAvatar(data);
      } else {
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0F172A&color=FFFFFF&size=240&bold=true`;
      }
    }

    // Skills
    const categorizedSkills = this.categorizeSkills(data.skills);
    const hasSkills = Object.keys(categorizedSkills).length > 0;

    // Education
    const hasEducation = Array.isArray(data.education) && data.education.length > 0;

    // Projects
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;

    // Experience
    const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;

    // Certifications & Achievements
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const hasAchievements = Array.isArray(data.achievements) && data.achievements.length > 0;

    // Additional
    const languages = this.normalizeLanguages(data);
    const hobbies = this.normalizeHobbies(data);
    const workshops = data.workshops || (data.additional && data.additional.workshops);
    const hasWorkshops = !!workshops;
    const hasAdditional = languages.length > 0 || hobbies.length > 0 || hasWorkshops;

    return `
<div class="portfolio-site-wrapper" id="publicPortfolioSite">
  <!-- Sticky Professional Navbar -->
  <nav class="portfolio-site-nav">
    <div class="portfolio-site-nav-inner">
      <a href="#hero" class="portfolio-brand-badge">
        <img class="portfolio-brand-avatar-mini" src="${avatarUrl}" alt="${this.escapeHtml(fullName)}" onerror="this.style.display='none'">
        <span>${this.escapeHtml(fullName)}</span>
      </a>

      <ul class="portfolio-nav-links">
        ${summary ? `<li><a href="#about" class="portfolio-nav-link">About</a></li>` : ''}
        ${hasSkills ? `<li><a href="#skills" class="portfolio-nav-link">Skills</a></li>` : ''}
        ${hasProjects ? `<li><a href="#projects" class="portfolio-nav-link">Projects</a></li>` : ''}
        ${hasExperience ? `<li><a href="#experience" class="portfolio-nav-link">Experience</a></li>` : ''}
        ${hasEducation ? `<li><a href="#education" class="portfolio-nav-link">Education</a></li>` : ''}
        ${(hasCerts || hasAchievements) ? `<li><a href="#certifications" class="portfolio-nav-link">Certifications</a></li>` : ''}
        <li><a href="#contact" class="portfolio-nav-link">Contact</a></li>
      </ul>

      <div class="portfolio-nav-cta">
        <button type="button" class="btn-site-primary btn-download-resume-trigger" title="Download ATS Resume PDF">
          <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span>Resume PDF</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="hero" class="portfolio-hero-section">
    <div class="portfolio-hero-inner">
      <div class="portfolio-hero-content">
        <div class="portfolio-hero-tag">
          <span>🚀 Open to Opportunities</span>
          ${locationStr ? `<span>&bull;</span> <span>${this.escapeHtml(locationStr)}</span>` : ''}
        </div>
        <h1 class="portfolio-hero-name">${this.escapeHtml(fullName)}</h1>
        <div class="portfolio-hero-title">${this.escapeHtml(title)}</div>
        ${summary ? `<p class="portfolio-hero-summary">${this.escapeHtml(summary)}</p>` : ''}

        <div class="portfolio-hero-actions">
          ${hasProjects ? `<a href="#projects" class="btn-site-primary"><span>View My Projects &rarr;</span></a>` : ''}
          <button type="button" class="btn-site-outline btn-download-resume-trigger">
            <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>Download ATS Resume</span>
          </button>
          <a href="#contact" class="btn-site-outline"><span>Get in Touch</span></a>
        </div>

        <div class="portfolio-hero-socials">
          ${p.github ? `
            <a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener" class="portfolio-social-btn" title="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>` : ''}
          ${p.linkedin ? `
            <a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener" class="portfolio-social-btn" title="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>` : ''}
          ${p.website ? `
            <a href="${this.escapeHtml(p.website)}" target="_blank" rel="noopener" class="portfolio-social-btn" title="Website">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </a>` : ''}
          ${p.email ? `
            <a href="mailto:${this.escapeHtml(p.email)}" class="portfolio-social-btn" title="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>` : ''}
        </div>
      </div>

      <div class="portfolio-hero-photo-wrap">
        <img class="portfolio-hero-photo" src="${avatarUrl}" alt="${this.escapeHtml(fullName)}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1E293B&color=FFFFFF&size=240&bold=true'">
      </div>
    </div>
  </section>

  <!-- About Me Section -->
  ${summary ? `
  <section id="about" class="portfolio-site-section bg-white">
    <div class="portfolio-section-container">
      <div class="portfolio-section-header">
        <div class="portfolio-section-subtitle">Biography</div>
        <h2 class="portfolio-section-title">About Me</h2>
      </div>

      <div class="portfolio-about-card">
        <p class="portfolio-about-p">${this.escapeHtml(summary)}</p>
        
        <div class="portfolio-highlights-grid">
          ${(hasEducation && data.education[0]) ? `
            <div class="portfolio-highlight-item">
              <div class="portfolio-highlight-icon">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
              </div>
              <div>
                <div class="portfolio-highlight-title">Degree &amp; College</div>
                <div class="portfolio-highlight-value">${this.escapeHtml(data.education[0].degree || '')} (${this.escapeHtml(data.education[0].institution || '')})</div>
              </div>
            </div>` : ''}
          
          ${locationStr ? `
            <div class="portfolio-highlight-item">
              <div class="portfolio-highlight-icon">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <div class="portfolio-highlight-title">Location</div>
                <div class="portfolio-highlight-value">${this.escapeHtml(locationStr)}</div>
              </div>
            </div>` : ''}

          ${(hasExperience && data.experience[0]) ? `
            <div class="portfolio-highlight-item">
              <div class="portfolio-highlight-icon">
                <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <div class="portfolio-highlight-title">Experience</div>
                <div class="portfolio-highlight-value">${this.escapeHtml(data.experience[0].position)} at ${this.escapeHtml(data.experience[0].organization)}</div>
              </div>
            </div>` : ''}
        </div>
      </div>
    </div>
  </section>` : ''}

  <!-- Skills Section -->
  ${hasSkills ? `
  <section id="skills" class="portfolio-site-section">
    <div class="portfolio-section-container">
      <div class="portfolio-section-header">
        <div class="portfolio-section-subtitle">Expertise</div>
        <h2 class="portfolio-section-title">Technical &amp; Professional Skills</h2>
      </div>

      <div class="portfolio-skills-grid">
        ${Object.entries(categorizedSkills).map(([cat, list]) => `
          <div class="portfolio-skill-group-card">
            <div class="portfolio-skill-group-title">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>${this.escapeHtml(cat)}</span>
            </div>
            <div class="portfolio-skill-pill-wrap">
              ${list.map(s => `<span class="portfolio-site-skill-pill">${this.escapeHtml(s)}</span>`).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Projects Showcase -->
  ${hasProjects ? `
  <section id="projects" class="portfolio-site-section bg-white">
    <div class="portfolio-section-container">
      <div class="portfolio-section-header">
        <div class="portfolio-section-subtitle">Portfolio</div>
        <h2 class="portfolio-section-title">Featured Projects</h2>
      </div>

      <div class="portfolio-projects-grid">
        ${data.projects.map(proj => {
          if (!proj || !proj.name) return '';
          const techs = proj.technologies ? (Array.isArray(proj.technologies) ? proj.technologies : proj.technologies.split(/[,;]+/)) : [];
          return `
          <div class="portfolio-project-card">
            <div>
              <div class="portfolio-project-top">
                <h3 class="portfolio-project-name">${this.escapeHtml(proj.name)}</h3>
                ${proj.duration ? `<span class="portfolio-project-duration">${this.escapeHtml(proj.duration)}</span>` : ''}
              </div>

              ${techs.length > 0 ? `
                <div class="portfolio-project-techs">
                  ${techs.map(t => `<span class="portfolio-tech-badge">${this.escapeHtml(t.trim())}</span>`).join('')}
                </div>` : ''}

              ${proj.description ? `<p class="portfolio-project-desc">${this.escapeHtml(proj.description)}</p>` : ''}

              ${(proj.problemStatement || proj.solution) ? `
                <div style="font-size:0.86rem; color:#64748B; background:#F8FAFC; padding:0.6rem 0.8rem; border-radius:6px; margin-bottom:1rem;">
                  ${proj.problemStatement ? `<div><strong>Problem:</strong> ${this.escapeHtml(proj.problemStatement)}</div>` : ''}
                  ${proj.solution ? `<div><strong>Solution:</strong> ${this.escapeHtml(proj.solution)}</div>` : ''}
                </div>` : ''}
            </div>

            <div class="portfolio-project-links">
              ${proj.githubUrl ? `
                <a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener" class="portfolio-project-link">
                  <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                  <span>Source Code</span>
                </a>` : ''}
              ${proj.liveUrl ? `
                <a href="${this.escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener" class="portfolio-project-link">
                  <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  <span>Live Demo &rarr;</span>
                </a>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Experience & Internships -->
  ${hasExperience ? `
  <section id="experience" class="portfolio-site-section">
    <div class="portfolio-section-container">
      <div class="portfolio-section-header">
        <div class="portfolio-section-subtitle">Career Path</div>
        <h2 class="portfolio-section-title">Work Experience &amp; Internships</h2>
      </div>

      <div class="portfolio-timeline">
        ${data.experience.map(exp => {
          if (!exp || (!exp.position && !exp.organization)) return '';
          const role = exp.position || 'Role';
          const org = exp.organization || '';
          const dates = exp.duration || [exp.startDate, exp.endDate].filter(Boolean).join(' - ') || '';
          const desc = exp.description || exp.responsibilities || '';
          const expType = exp.experienceType ? ` &bull; ${exp.experienceType}` : '';

          return `
          <div class="portfolio-timeline-card">
            <div class="portfolio-timeline-header">
              <span class="portfolio-timeline-role">${this.escapeHtml(role)}</span>
              ${dates ? `<span class="portfolio-timeline-date">${this.escapeHtml(dates)}</span>` : ''}
            </div>
            <div class="portfolio-timeline-sub">${this.escapeHtml(org)}${this.escapeHtml(expType)}</div>
            ${desc ? `<p class="portfolio-timeline-desc">${this.escapeHtml(desc)}</p>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Education Section -->
  ${hasEducation ? `
  <section id="education" class="portfolio-site-section bg-white">
    <div class="portfolio-section-container">
      <div class="portfolio-section-header">
        <div class="portfolio-section-subtitle">Academic Credentials</div>
        <h2 class="portfolio-section-title">Education &amp; Qualifications</h2>
      </div>

      <div class="portfolio-timeline">
        ${data.education.map(edu => {
          if (!edu || (!edu.institution && !edu.degree)) return '';
          const years = [edu.startYear, edu.gradYear || edu.endYear].filter(Boolean).join(' - ') || edu.gradYear || edu.duration || edu.studyPeriod || '';
          const score = edu.score || edu.cgpa ? `Grade / CGPA: ${edu.score || edu.cgpa}` : '';

          return `
          <div class="portfolio-timeline-card">
            <div class="portfolio-timeline-header">
              <span class="portfolio-timeline-role">${this.escapeHtml(edu.degree || 'Degree')}</span>
              ${years ? `<span class="portfolio-timeline-date">${this.escapeHtml(years)}</span>` : ''}
            </div>
            <div class="portfolio-timeline-sub">${this.escapeHtml(edu.institution || '')}${edu.department ? ' &middot; ' + this.escapeHtml(edu.department) : ''}</div>
            ${score ? `<div style="font-size:0.9rem; font-weight:600; color:#1E293B; margin-bottom:0.4rem;">${this.escapeHtml(score)}</div>` : ''}
            ${edu.coursework ? `<div style="font-size:0.88rem; color:#64748B;"><strong>Coursework:</strong> ${this.escapeHtml(edu.coursework)}</div>` : ''}
            ${edu.highlight ? `<div style="font-size:0.88rem; color:#64748B;"><strong>Highlights:</strong> ${this.escapeHtml(edu.highlight)}</div>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Certifications & Achievements -->
  ${(hasCerts || hasAchievements) ? `
  <section id="certifications" class="portfolio-site-section">
    <div class="portfolio-section-container">
      <div class="portfolio-section-header">
        <div class="portfolio-section-subtitle">Accreditations</div>
        <h2 class="portfolio-section-title">Certifications &amp; Achievements</h2>
      </div>

      <div class="portfolio-certs-grid">
        ${(data.certifications || []).map(cert => {
          if (!cert || (!cert.name && !cert.title)) return '';
          const name = cert.name || cert.title;
          const org = cert.organization || cert.issuer || '';
          const yr = cert.year || cert.issueDate || cert.date || '';
          return `
          <div class="portfolio-cert-card">
            <div class="portfolio-cert-icon">
              <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
            <div>
              <div class="portfolio-cert-name">${this.escapeHtml(name)}</div>
              <div class="portfolio-cert-meta">${this.escapeHtml(org)}${yr ? ' &bull; ' + this.escapeHtml(yr) : ''}</div>
              ${cert.credentialUrl ? `<a href="${this.escapeHtml(cert.credentialUrl)}" target="_blank" rel="noopener" style="font-size:0.84rem; color:#2563EB; font-weight:600; text-decoration:none;">Verify Credential &rarr;</a>` : ''}
            </div>
          </div>`;
        }).join('')}

        ${(data.achievements || []).map(ach => {
          if (!ach || (!ach.title && !ach.name)) return '';
          const title = ach.title || ach.name;
          const desc = ach.description || '';
          const dt = ach.date || ach.year || '';
          return `
          <div class="portfolio-cert-card">
            <div class="portfolio-cert-icon" style="background:#ECFDF5; color:#059669;">
              <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            </div>
            <div>
              <div class="portfolio-cert-name">${this.escapeHtml(title)}</div>
              ${dt ? `<div class="portfolio-cert-meta">${this.escapeHtml(dt)}</div>` : ''}
              ${desc ? `<div style="font-size:0.86rem; color:#475569; margin-top:0.25rem;">${this.escapeHtml(desc)}</div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Additional Info (Languages, Hobbies, Workshops) -->
  ${hasAdditional ? `
  <section id="additional" class="portfolio-site-section bg-white">
    <div class="portfolio-section-container">
      <div class="portfolio-section-header">
        <div class="portfolio-section-subtitle">Beyond Technicals</div>
        <h2 class="portfolio-section-title">Languages &amp; Interests</h2>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem;">
        ${languages.length > 0 ? `
          <div class="portfolio-skill-group-card">
            <div class="portfolio-skill-group-title">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>Languages</span>
            </div>
            <div class="portfolio-skill-pill-wrap">
              ${languages.map(l => `<span class="portfolio-site-skill-pill" style="background:#EFF6FF; color:#1D4ED8;">${this.escapeHtml(l)}</span>`).join('')}
            </div>
          </div>` : ''}

        ${hobbies.length > 0 ? `
          <div class="portfolio-skill-group-card">
            <div class="portfolio-skill-group-title">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Interests &amp; Hobbies</span>
            </div>
            <div class="portfolio-skill-pill-wrap">
              ${hobbies.map(h => `<span class="portfolio-site-skill-pill">${this.escapeHtml(h)}</span>`).join('')}
            </div>
          </div>` : ''}

        ${hasWorkshops ? `
          <div class="portfolio-skill-group-card">
            <div class="portfolio-skill-group-title">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              <span>Workshops &amp; Activities</span>
            </div>
            <div style="font-size:0.92rem; color:#475569; line-height:1.6;">
              ${typeof workshops === 'string' ? this.escapeHtml(workshops) : (Array.isArray(workshops) ? workshops.map(w => typeof w === 'string' ? w : (w.name || '')).filter(Boolean).join(' &bull; ') : '')}
            </div>
          </div>` : ''}
      </div>
    </div>
  </section>` : ''}

  <!-- Contact Section -->
  <section id="contact" class="portfolio-site-section">
    <div class="portfolio-section-container">
      <div class="portfolio-contact-card">
        <h2 class="portfolio-contact-title">Let's Connect &amp; Collaborate</h2>
        <p class="portfolio-contact-desc">
          Feel free to reach out for opportunities, engineering collaborations, internship discussions, or simply to say hello.
        </p>

        <div class="portfolio-contact-pills">
          ${p.email ? `
            <a href="mailto:${this.escapeHtml(p.email)}" class="portfolio-contact-pill">
              <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span>${this.escapeHtml(p.email)}</span>
            </a>` : ''}
          ${p.phone ? `
            <a href="tel:${this.escapeHtml(p.phone)}" class="portfolio-contact-pill">
              <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <span>${this.escapeHtml(p.phone)}</span>
            </a>` : ''}
          ${p.linkedin ? `
            <a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener" class="portfolio-contact-pill">
              <svg style="width:18px;height:18px;" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              <span>LinkedIn Profile</span>
            </a>` : ''}
        </div>

        <button type="button" class="btn-site-primary btn-download-resume-trigger">
          <svg style="width:18px;height:18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span>Download ATS Resume PDF</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Site Footer -->
  <footer class="portfolio-site-footer">
    <div class="portfolio-section-container">
      <div>&copy; ${new Date().getFullYear()} ${this.escapeHtml(fullName)}. All rights reserved.</div>
      <div style="margin-top:0.35rem; font-size:0.8rem; color:#94A3B8;">
        Published with <a href="/" target="_blank">Student Personal Portfolio Builder</a>
      </div>
    </div>
  </footer>
</div>`;
  },

  // =========================================================================
  // MAJOR OUTPUT 2: ATS-FRIENDLY RESUME RENDERER (SINGLE-COLUMN, MACHINE-READABLE)
  // =========================================================================
  renderAtsResume(data) {
    if (!data) return '<div class="ats-resume-document"><p>No resume data</p></div>';

    const p = data.personal || {};
    const fullName = p.fullName || 'Candidate Name';
    const title = p.title || data.category || 'Professional Candidate';
    const summary = p.summary || data.careerObjective || '';
    const locationStr = [p.city, p.state].filter(Boolean).join(', ') || p.location || '';

    // Contacts
    const contacts = [];
    if (p.email) contacts.push(`Email: ${this.escapeHtml(p.email)}`);
    if (p.phone) contacts.push(`Phone: ${this.escapeHtml(p.phone)}`);
    if (locationStr) contacts.push(`Location: ${this.escapeHtml(locationStr)}`);
    if (p.linkedin) contacts.push(`<a href="${this.escapeHtml(p.linkedin)}" class="ats-resume-link">LinkedIn</a>`);
    if (p.github) contacts.push(`<a href="${this.escapeHtml(p.github)}" class="ats-resume-link">GitHub</a>`);
    if (p.website) contacts.push(`<a href="${this.escapeHtml(p.website)}" class="ats-resume-link">Portfolio Website</a>`);

    // Skills
    const categorizedSkills = this.categorizeSkills(data.skills);
    const hasSkills = Object.keys(categorizedSkills).length > 0;

    // Education
    const hasEducation = Array.isArray(data.education) && data.education.length > 0;

    // Projects
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;

    // Experience
    const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;

    // Certifications & Achievements
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const hasAchievements = Array.isArray(data.achievements) && data.achievements.length > 0;

    // Languages
    const languages = this.normalizeLanguages(data);

    return `
<div class="ats-resume-document" id="ats-resume-root">
  <!-- ATS Header: Centered, prominent name and standard contact line -->
  <header class="ats-resume-header">
    <div class="ats-resume-name">${this.escapeHtml(fullName)}</div>
    <div class="ats-resume-title">${this.escapeHtml(title)}</div>
    <div class="ats-resume-contacts">
      ${contacts.join(' &nbsp;|&nbsp; ')}
    </div>
  </header>

  <!-- 1. Professional Summary -->
  ${summary ? `
  <section class="ats-resume-section">
    <div class="ats-resume-section-heading">PROFESSIONAL SUMMARY</div>
    <p class="ats-resume-summary-text">${this.escapeHtml(summary)}</p>
  </section>` : ''}

  <!-- 2. Technical & Professional Skills -->
  ${hasSkills ? `
  <section class="ats-resume-section">
    <div class="ats-resume-section-heading">TECHNICAL &amp; PROFESSIONAL SKILLS</div>
    <div class="ats-resume-skills-block">
      ${Object.entries(categorizedSkills).map(([cat, list]) => `
        <div class="ats-resume-skill-row">
          <span class="ats-resume-skill-category">${this.escapeHtml(cat)}:</span>
          <span>${this.escapeHtml(list.join(', '))}</span>
        </div>`).join('')}
    </div>
  </section>` : ''}

  <!-- 3. Education -->
  ${hasEducation ? `
  <section class="ats-resume-section">
    <div class="ats-resume-section-heading">EDUCATION</div>
    ${data.education.map(edu => {
      if (!edu || (!edu.institution && !edu.degree)) return '';
      const years = [edu.startYear, edu.gradYear || edu.endYear].filter(Boolean).join(' – ') || edu.gradYear || edu.duration || edu.studyPeriod || '';
      const score = edu.score || edu.cgpa ? `Grade / CGPA: ${edu.score || edu.cgpa}` : '';
      return `
      <div class="ats-resume-item">
        <div class="ats-resume-item-header">
          <span class="ats-resume-item-title">${this.escapeHtml(edu.degree || 'Degree')}</span>
          ${years ? `<span class="ats-resume-item-date">${this.escapeHtml(years)}</span>` : ''}
        </div>
        <div class="ats-resume-item-sub">${this.escapeHtml(edu.institution || '')}${edu.department ? ', ' + this.escapeHtml(edu.department) : ''}</div>
        ${score ? `<div class="ats-resume-item-desc"><strong>${this.escapeHtml(score)}</strong></div>` : ''}
        ${edu.coursework ? `<div class="ats-resume-item-desc">Relevant Coursework: ${this.escapeHtml(edu.coursework)}</div>` : ''}
        ${edu.highlight ? `<div class="ats-resume-item-desc">${this.escapeHtml(edu.highlight)}</div>` : ''}
      </div>`;
    }).join('')}
  </section>` : ''}

  <!-- 4. Projects -->
  ${hasProjects ? `
  <section class="ats-resume-section">
    <div class="ats-resume-section-heading">PROJECTS</div>
    ${data.projects.map(proj => {
      if (!proj || !proj.name) return '';
      const techs = proj.technologies ? (Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies) : '';
      return `
      <div class="ats-resume-item">
        <div class="ats-resume-item-header">
          <span class="ats-resume-item-title">${this.escapeHtml(proj.name)}${techs ? ' | ' + this.escapeHtml(techs) : ''}</span>
          ${proj.duration ? `<span class="ats-resume-item-date">${this.escapeHtml(proj.duration)}</span>` : ''}
        </div>
        ${proj.description ? `<div class="ats-resume-item-desc">${this.escapeHtml(proj.description)}</div>` : ''}
        ${(proj.problemStatement || proj.solution) ? `
          <ul class="ats-resume-bullets">
            ${proj.problemStatement ? `<li><strong>Problem:</strong> ${this.escapeHtml(proj.problemStatement)}</li>` : ''}
            ${proj.solution ? `<li><strong>Solution:</strong> ${this.escapeHtml(proj.solution)}</li>` : ''}
          </ul>` : ''}
        ${(proj.githubUrl || proj.liveUrl) ? `
          <div class="ats-resume-item-desc" style="font-size:9pt; margin-top:2px;">
            ${proj.githubUrl ? `Repository: <a href="${this.escapeHtml(proj.githubUrl)}" class="ats-resume-link">${this.escapeHtml(proj.githubUrl)}</a> ` : ''}
            ${proj.liveUrl ? `Live: <a href="${this.escapeHtml(proj.liveUrl)}" class="ats-resume-link">${this.escapeHtml(proj.liveUrl)}</a>` : ''}
          </div>` : ''}
      </div>`;
    }).join('')}
  </section>` : ''}

  <!-- 5. Work Experience & Internships -->
  ${hasExperience ? `
  <section class="ats-resume-section">
    <div class="ats-resume-section-heading">WORK EXPERIENCE &amp; INTERNSHIPS</div>
    ${data.experience.map(exp => {
      if (!exp || (!exp.position && !exp.organization)) return '';
      const role = exp.position || 'Role';
      const org = exp.organization || '';
      const dates = exp.duration || [exp.startDate, exp.endDate].filter(Boolean).join(' – ') || '';
      const desc = exp.description || exp.responsibilities || '';
      return `
      <div class="ats-resume-item">
        <div class="ats-resume-item-header">
          <span class="ats-resume-item-title">${this.escapeHtml(role)}${exp.experienceType ? ' (' + this.escapeHtml(exp.experienceType) + ')' : ''}</span>
          ${dates ? `<span class="ats-resume-item-date">${this.escapeHtml(dates)}</span>` : ''}
        </div>
        <div class="ats-resume-item-sub">${this.escapeHtml(org)}</div>
        ${desc ? `<div class="ats-resume-item-desc">${this.escapeHtml(desc)}</div>` : ''}
      </div>`;
    }).join('')}
  </section>` : ''}

  <!-- 6. Certifications & Achievements -->
  ${(hasCerts || hasAchievements) ? `
  <section class="ats-resume-section">
    <div class="ats-resume-section-heading">CERTIFICATIONS &amp; ACHIEVEMENTS</div>
    ${(data.certifications || []).map(cert => {
      if (!cert || (!cert.name && !cert.title)) return '';
      const name = cert.name || cert.title;
      const org = cert.organization || cert.issuer || '';
      const yr = cert.year || cert.issueDate || cert.date || '';
      return `
      <div class="ats-resume-item" style="margin-bottom:6px;">
        <span style="font-weight:700;">${this.escapeHtml(name)}</span> — ${this.escapeHtml(org)}${yr ? ' (' + this.escapeHtml(yr) + ')' : ''}
        ${cert.credentialUrl ? ` | <a href="${this.escapeHtml(cert.credentialUrl)}" class="ats-resume-link">Verification</a>` : ''}
      </div>`;
    }).join('')}

    ${(data.achievements || []).map(ach => {
      if (!ach || (!ach.title && !ach.name)) return '';
      const title = ach.title || ach.name;
      const desc = ach.description || '';
      const dt = ach.date || ach.year || '';
      return `
      <div class="ats-resume-item" style="margin-bottom:6px;">
        <span style="font-weight:700;">${this.escapeHtml(title)}</span>${dt ? ' (' + this.escapeHtml(dt) + ')' : ''}${desc ? ': ' + this.escapeHtml(desc) : ''}
      </div>`;
    }).join('')}
  </section>` : ''}

  <!-- 7. Languages -->
  ${languages.length > 0 ? `
  <section class="ats-resume-section">
    <div class="ats-resume-section-heading">LANGUAGES</div>
    <div class="ats-resume-item-desc">
      ${this.escapeHtml(languages.join(' &bull; '))}
    </div>
  </section>` : ''}
</div>`;
  },

  // Download ATS-Friendly Resume PDF
  async downloadAtsResumePdf(customFilename, optData) {
    const data = optData || this.getData() || this.getDraft();
    if (!data) {
      console.error('No portfolio data available for ATS resume download.');
      return false;
    }

    const fullName = (data.personal && data.personal.fullName) ? data.personal.fullName : 'Candidate';
    const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = customFilename || `${cleanName}_ATS_Resume.pdf`;

    const container = document.createElement('div');
    container.id = 'ats-resume-capture-sandbox';
    container.setAttribute('style', 'position:absolute; left:0; top:0; width:794px; background:#FFFFFF; z-index:99999; margin:0; padding:0;');
    container.innerHTML = this.renderAtsResume(data);
    document.body.appendChild(container);
    const targetEl = container.firstElementChild || container;

    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: [12, 12, 12, 12], // 12mm standard resume margin
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        enableLinks: true,
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#FFFFFF',
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['.ats-resume-section', '.ats-resume-item', '.ats-avoid-page-break', 'h1', 'h2', 'h3', 'h4']
        }
      };

      try {
        await html2pdf().set(opt).from(targetEl).save();
        return true;
      } catch (err) {
        console.warn('html2pdf generation failed, falling back to window.print():', err);
        window.print();
        return false;
      } finally {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
    } else {
      window.print();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      return true;
    }
  },

  // HTML escaping utility
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Generates the reference executive two-column A4 PDF layout
  renderExecutivePdfTemplate(data) {
    if (!data) return '<div class="executive-pdf-wrapper"></div>';

    const p = data.personal || {};
    const fullName = p.fullName || 'Student Portfolio';
    const title = p.title || data.category || 'Professional Candidate';

    // Avatar
    let avatarUrl = p.photo;
    if (!avatarUrl) {
      if (typeof window !== 'undefined' && window.PortfolioTemplates && typeof window.PortfolioTemplates.getAvatar === 'function') {
        avatarUrl = window.PortfolioTemplates.getAvatar(data);
      } else {
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1E2228&color=FFFFFF&size=200&bold=true`;
      }
    }

    // SVG Icons
    const ICONS = {
      user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
      email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
      location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
      globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
      github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
      education: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
      skills: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      language: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      projects: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
      certificate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
      hobby: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`
    };

    // Contacts
    const contactItems = [];
    if (p.phone) {
      contactItems.push(`
        <div class="executive-pdf-contact-item">
          ${ICONS.phone}
          <span>${this.escapeHtml(p.phone)}</span>
        </div>`);
    }
    if (p.email) {
      contactItems.push(`
        <div class="executive-pdf-contact-item">
          ${ICONS.email}
          <span>${this.escapeHtml(p.email)}</span>
        </div>`);
    }
    const locationStr = [p.city, p.state].filter(Boolean).join(', ') || p.location;
    if (locationStr) {
      contactItems.push(`
        <div class="executive-pdf-contact-item">
          ${ICONS.location}
          <span>${this.escapeHtml(locationStr)}</span>
        </div>`);
    }
    if (p.linkedin) {
      contactItems.push(`
        <div class="executive-pdf-contact-item">
          ${ICONS.linkedin}
          <span>${this.escapeHtml(p.linkedin)}</span>
        </div>`);
    }
    if (p.github) {
      contactItems.push(`
        <div class="executive-pdf-contact-item">
          ${ICONS.github}
          <span>${this.escapeHtml(p.github)}</span>
        </div>`);
    }
    if (p.website) {
      contactItems.push(`
        <div class="executive-pdf-contact-item">
          ${ICONS.globe}
          <span>${this.escapeHtml(p.website)}</span>
        </div>`);
    }

    // Education
    const educationItems = [];
    if (Array.isArray(data.education) && data.education.length > 0) {
      data.education.forEach(edu => {
        if (!edu || (!edu.institution && !edu.degree)) return;
        const years = [edu.startYear, edu.gradYear || edu.endYear].filter(Boolean).join(' - ') || edu.gradYear || edu.duration || '';
        const score = edu.score || edu.cgpa ? ` | ${edu.score || edu.cgpa}` : '';
        educationItems.push(`
          <div class="executive-pdf-edu-card pdf-page-break-avoid">
            <div class="executive-pdf-edu-inst">${this.escapeHtml(edu.institution || '')}</div>
            <div class="executive-pdf-edu-degree">${this.escapeHtml(edu.degree || '')}${edu.department ? ' &middot; ' + this.escapeHtml(edu.department) : ''}</div>
            ${years || score ? `<div class="executive-pdf-edu-meta">${this.escapeHtml(years)}${this.escapeHtml(score)}</div>` : ''}
            ${edu.coursework ? `<div class="executive-pdf-edu-course">${this.escapeHtml(edu.coursework)}</div>` : ''}
          </div>`);
      });
    }

    // Skills
    const skillList = [];
    if (data.skills) {
      if (Array.isArray(data.skills)) {
        data.skills.forEach(s => {
          if (!s) return;
          const val = typeof s === 'string' ? s.trim() : (s.name || '').trim();
          if (val) skillList.push(val);
        });
      } else if (typeof data.skills === 'object') {
        Object.values(data.skills).forEach(val => {
          if (typeof val === 'string') {
            val.split(/[,;\n]+/).forEach(s => {
              const t = s.trim();
              if (t) skillList.push(t);
            });
          } else if (Array.isArray(val)) {
            val.forEach(v => {
              const t = typeof v === 'string' ? v.trim() : (v.name || '').trim();
              if (t) skillList.push(t);
            });
          }
        });
      } else if (typeof data.skills === 'string') {
        data.skills.split(/[,;\n]+/).forEach(s => {
          const t = s.trim();
          if (t) skillList.push(t);
        });
      }
    }

    // Languages
    const langList = [];
    const rawLangs = data.languages || (data.additionalInfo && data.additionalInfo.languages) || (data.additional && data.additional.languages);
    if (rawLangs) {
      if (Array.isArray(rawLangs)) {
        rawLangs.forEach(l => {
          if (!l) return;
          if (typeof l === 'string') {
            const t = l.trim();
            if (t) langList.push(t);
          } else {
            const name = l.name || '';
            const prof = l.proficiency ? ` (${l.proficiency})` : '';
            const full = (name + prof).trim();
            if (full) langList.push(full);
          }
        });
      } else if (typeof rawLangs === 'string') {
        rawLangs.split(/[,;\n]+/).forEach(l => {
          const t = l.trim();
          if (t) langList.push(t);
        });
      }
    }

    // Hobbies
    const hobbyList = [];
    const rawHobbies = data.hobbies || (data.additionalInfo && data.additionalInfo.hobbies) || (data.additional && data.additional.hobbies) || (data.additional && data.additional.interests);
    if (rawHobbies) {
      if (Array.isArray(rawHobbies)) {
        rawHobbies.forEach(h => {
          if (!h) return;
          const t = typeof h === 'string' ? h.trim() : (h.name || '').trim();
          if (t) hobbyList.push(t);
        });
      } else if (typeof rawHobbies === 'string') {
        rawHobbies.split(/[,;\n]+/).forEach(h => {
          const t = h.trim();
          if (t) hobbyList.push(t);
        });
      }
    }

    // About Me / Professional Summary
    const summaryText = p.summary || data.careerObjective || '';

    // Experience / Internships
    const expItems = [];
    if (Array.isArray(data.experience) && data.experience.length > 0) {
      data.experience.forEach(exp => {
        if (!exp || (!exp.position && !exp.organization && !exp.role)) return;
        const role = exp.position || exp.role || 'Role';
        const org = exp.organization || exp.company || '';
        const dates = exp.duration || [exp.startDate, exp.endDate].filter(Boolean).join(' - ') || '';
        const desc = exp.description || exp.responsibilities || '';
        const expType = exp.experienceType ? ` &middot; ${exp.experienceType}` : '';

        expItems.push(`
          <div class="executive-pdf-card pdf-page-break-avoid">
            <div class="executive-pdf-card-top">
              <span class="executive-pdf-card-role">${this.escapeHtml(role)}</span>
              ${dates ? `<span class="executive-pdf-card-date">${this.escapeHtml(dates)}</span>` : ''}
            </div>
            ${org ? `<div class="executive-pdf-card-sub">${this.escapeHtml(org)}${this.escapeHtml(expType)}</div>` : ''}
            ${desc ? `<div class="executive-pdf-card-desc">${this.escapeHtml(desc)}</div>` : ''}
          </div>`);
      });
    }

    // Projects
    const projectItems = [];
    if (Array.isArray(data.projects) && data.projects.length > 0) {
      data.projects.forEach(proj => {
        if (!proj || !proj.name) return;
        const techs = proj.technologies ? (Array.isArray(proj.technologies) ? proj.technologies : proj.technologies.split(/[,;]+/)) : [];

        projectItems.push(`
          <div class="executive-pdf-card pdf-page-break-avoid">
            <div class="executive-pdf-card-top">
              <span class="executive-pdf-card-role">${this.escapeHtml(proj.name)}</span>
              ${proj.duration ? `<span class="executive-pdf-card-date">${this.escapeHtml(proj.duration)}</span>` : ''}
            </div>
            ${techs.length > 0 ? `
              <div style="margin: 3px 0 5px 0;">
                ${techs.map(t => `<span class="executive-pdf-tech-pill">${this.escapeHtml(t.trim())}</span>`).join('')}
              </div>` : ''}
            ${proj.description ? `<div class="executive-pdf-card-desc">${this.escapeHtml(proj.description)}</div>` : ''}
            ${proj.problemStatement || proj.solution ? `
              <div class="executive-pdf-card-desc" style="margin-top: 3px; font-size: 9px; color: #64748B;">
                ${proj.problemStatement ? `<strong>Problem:</strong> ${this.escapeHtml(proj.problemStatement)} ` : ''}
                ${proj.solution ? `<strong>Solution:</strong> ${this.escapeHtml(proj.solution)}` : ''}
              </div>` : ''}
            ${(proj.githubUrl || proj.liveUrl) ? `
              <div style="margin-top: 5px;">
                ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" class="executive-pdf-link-btn">GitHub &rarr;</a>` : ''}
                ${proj.liveUrl ? `<a href="${this.escapeHtml(proj.liveUrl)}" target="_blank" class="executive-pdf-link-btn">Live Demo &rarr;</a>` : ''}
              </div>` : ''}
          </div>`);
      });
    }

    // Certifications & Achievements
    const certAchieveItems = [];
    if (Array.isArray(data.certifications) && data.certifications.length > 0) {
      data.certifications.forEach(cert => {
        if (!cert || (!cert.name && !cert.title)) return;
        const name = cert.name || cert.title;
        const org = cert.organization || cert.issuer || '';
        const yr = cert.year || cert.issueDate || cert.date || '';
        certAchieveItems.push(`
          <div class="executive-pdf-card pdf-page-break-avoid">
            <div class="executive-pdf-card-top">
              <span class="executive-pdf-card-role" style="font-size: 10.5px;">${this.escapeHtml(name)}</span>
              ${yr ? `<span class="executive-pdf-card-date">${this.escapeHtml(yr)}</span>` : ''}
            </div>
            ${org ? `<div class="executive-pdf-card-sub" style="font-size: 9.5px; margin-bottom: 2px;">${this.escapeHtml(org)}</div>` : ''}
            ${cert.credentialUrl ? `<a href="${this.escapeHtml(cert.credentialUrl)}" target="_blank" class="executive-pdf-link-btn">Verify Credential &rarr;</a>` : ''}
          </div>`);
      });
    }
    if (Array.isArray(data.achievements) && data.achievements.length > 0) {
      data.achievements.forEach(ach => {
        if (!ach || (!ach.title && !ach.name)) return;
        const title = ach.title || ach.name;
        const desc = ach.description || '';
        const dt = ach.date || ach.year || '';
        certAchieveItems.push(`
          <div class="executive-pdf-card pdf-page-break-avoid">
            <div class="executive-pdf-card-top">
              <span class="executive-pdf-card-role" style="font-size: 10.5px;">${this.escapeHtml(title)}</span>
              ${dt ? `<span class="executive-pdf-card-date">${this.escapeHtml(dt)}</span>` : ''}
            </div>
            ${desc ? `<div class="executive-pdf-card-desc">${this.escapeHtml(desc)}</div>` : ''}
          </div>`);
      });
    }

    // Workshops & Activities
    const workshopItems = [];
    const rawWorkshops = data.workshops || (data.additional && data.additional.workshops);
    if (rawWorkshops) {
      if (Array.isArray(rawWorkshops)) {
        rawWorkshops.forEach(w => {
          if (!w) return;
          if (typeof w === 'string') {
            workshopItems.push(`<div class="executive-pdf-card-desc pdf-page-break-avoid" style="margin-bottom: 4px;">&bull; ${this.escapeHtml(w)}</div>`);
          } else {
            workshopItems.push(`
              <div class="executive-pdf-card pdf-page-break-avoid">
                <div class="executive-pdf-card-top">
                  <span class="executive-pdf-card-role" style="font-size: 10.5px;">${this.escapeHtml(w.name || w.title || '')}</span>
                  ${w.date || w.year ? `<span class="executive-pdf-card-date">${this.escapeHtml(w.date || w.year)}</span>` : ''}
                </div>
                ${w.organization ? `<div class="executive-pdf-card-sub" style="font-size: 9.5px;">${this.escapeHtml(w.organization)}</div>` : ''}
                ${w.description ? `<div class="executive-pdf-card-desc">${this.escapeHtml(w.description)}</div>` : ''}
              </div>`);
          }
        });
      } else if (typeof rawWorkshops === 'string') {
        workshopItems.push(`<div class="executive-pdf-card-desc pdf-page-break-avoid">${this.escapeHtml(rawWorkshops)}</div>`);
      }
    }

    // Construct the Two-Column Document HTML
    return `
<div class="executive-pdf-wrapper" id="executive-pdf-root">
  <!-- LEFT SIDEBAR (~36% width, dark charcoal background) -->
  <aside class="executive-pdf-sidebar">
    <!-- Header: Name & Title -->
    <div class="executive-pdf-candidate-name">${this.escapeHtml(fullName)}</div>
    <div class="executive-pdf-candidate-title">${this.escapeHtml(title)}</div>

    <!-- Circular Profile Photo with White Frame -->
    <div class="executive-pdf-photo-container">
      <img class="executive-pdf-photo-img" src="${avatarUrl}" alt="${this.escapeHtml(fullName)}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2D333B&color=FFFFFF&size=200&bold=true'">
    </div>

    <!-- Contact Me -->
    ${contactItems.length > 0 ? `
      <div class="executive-pdf-sidebar-sec-header">
        <span class="executive-pdf-sidebar-icon-circle">${ICONS.user}</span>
        <span class="executive-pdf-sidebar-title">Contact Me</span>
      </div>
      <div>
        ${contactItems.join('')}
      </div>` : ''}

    <!-- Education -->
    ${educationItems.length > 0 ? `
      <div class="executive-pdf-sidebar-sec-header">
        <span class="executive-pdf-sidebar-icon-circle">${ICONS.education}</span>
        <span class="executive-pdf-sidebar-title">Education</span>
      </div>
      <div>
        ${educationItems.join('')}
      </div>` : ''}

    <!-- Skills -->
    ${skillList.length > 0 ? `
      <div class="executive-pdf-sidebar-sec-header">
        <span class="executive-pdf-sidebar-icon-circle">${ICONS.skills}</span>
        <span class="executive-pdf-sidebar-title">Skills</span>
      </div>
      <div class="executive-pdf-skills-wrap">
        ${skillList.map(s => `<span class="executive-pdf-skill-badge">${this.escapeHtml(s)}</span>`).join('')}
      </div>` : ''}

    <!-- Languages -->
    ${langList.length > 0 ? `
      <div class="executive-pdf-sidebar-sec-header">
        <span class="executive-pdf-sidebar-icon-circle">${ICONS.language}</span>
        <span class="executive-pdf-sidebar-title">Languages</span>
      </div>
      <div>
        ${langList.map(l => `<div class="executive-pdf-lang-item"><span class="executive-pdf-bullet">&bull;</span> <span>${this.escapeHtml(l)}</span></div>`).join('')}
      </div>` : ''}

    <!-- Hobbies / Interests -->
    ${hobbyList.length > 0 ? `
      <div class="executive-pdf-sidebar-sec-header">
        <span class="executive-pdf-sidebar-icon-circle">${ICONS.hobby}</span>
        <span class="executive-pdf-sidebar-title">Hobbies</span>
      </div>
      <div>
        ${hobbyList.map(h => `<div class="executive-pdf-hobby-item"><span class="executive-pdf-bullet">&bull;</span> <span>${this.escapeHtml(h)}</span></div>`).join('')}
      </div>` : ''}
  </aside>

  <!-- RIGHT MAIN CONTENT (~64% width, clean white background) -->
  <main class="executive-pdf-main">
    <!-- About Me / Summary -->
    ${summaryText ? `
      <div class="executive-pdf-main-sec-header" style="margin-top: 0;">
        <span class="executive-pdf-main-icon-circle">${ICONS.user}</span>
        <span class="executive-pdf-main-title">About Me</span>
      </div>
      <div class="executive-pdf-about-text">${this.escapeHtml(summaryText)}</div>` : ''}

    <!-- Job Experience / Internships -->
    ${expItems.length > 0 ? `
      <div class="executive-pdf-main-sec-header">
        <span class="executive-pdf-main-icon-circle">${ICONS.briefcase}</span>
        <span class="executive-pdf-main-title">Job Experience</span>
      </div>
      <div>
        ${expItems.join('')}
      </div>` : ''}

    <!-- Projects -->
    ${projectItems.length > 0 ? `
      <div class="executive-pdf-main-sec-header">
        <span class="executive-pdf-main-icon-circle">${ICONS.projects}</span>
        <span class="executive-pdf-main-title">Projects</span>
      </div>
      <div>
        ${projectItems.join('')}
      </div>` : ''}

    <!-- Certifications & Achievements -->
    ${certAchieveItems.length > 0 ? `
      <div class="executive-pdf-main-sec-header">
        <span class="executive-pdf-main-icon-circle">${ICONS.certificate}</span>
        <span class="executive-pdf-main-title">Certifications &amp; Achievements</span>
      </div>
      <div>
        ${certAchieveItems.join('')}
      </div>` : ''}

    <!-- Workshops & Activities -->
    ${workshopItems.length > 0 ? `
      <div class="executive-pdf-main-sec-header">
        <span class="executive-pdf-main-icon-circle">${ICONS.education}</span>
        <span class="executive-pdf-main-title">Workshops &amp; Activities</span>
      </div>
      <div>
        ${workshopItems.join('')}
      </div>` : ''}
  </main>
</div>`;
  },

  // Critical: Professional Multi-Page A4 PDF Generator
  async downloadPdf(element, customFilename, optData) {
    const data = optData || this.getData() || this.getDraft();
    const fullName = (data && data.personal && data.personal.fullName) ? data.personal.fullName : 'Student';
    const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = customFilename || `${cleanName}_Portfolio.pdf`;

    let targetEl = element;
    let tempContainer = null;

    if (data && typeof document !== 'undefined') {
      // Build dedicated reference executive two-column A4 PDF template
      tempContainer = document.createElement('div');
      tempContainer.id = 'executive-pdf-export-container';
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '0';
      tempContainer.style.top = '0';
      tempContainer.style.zIndex = '1000';
      tempContainer.style.width = '794px'; // 210mm in 96 DPI CSS pixels
      tempContainer.style.backgroundColor = '#FFFFFF';
      tempContainer.innerHTML = this.renderExecutivePdfTemplate(data);
      document.body.appendChild(tempContainer);
      targetEl = tempContainer.firstElementChild || tempContainer;
    }

    if (!targetEl) {
      console.error('Target element for PDF generation not found.');
      return false;
    }

    // If html2pdf bundle is available
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: [0, 0, 0, 0], // Edge-to-edge dark sidebar A4 layout
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2, // High-DPI crisp vector text
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#FFFFFF',
          windowWidth: 794
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['.pdf-page-break-avoid', '.executive-pdf-card', '.executive-pdf-edu-card', '.executive-pdf-sidebar-sec-header', '.executive-pdf-main-sec-header', 'h1', 'h2', 'h3', 'h4']
        }
      };

      try {
        await html2pdf().set(opt).from(targetEl).save();
        return true;
      } catch (err) {
        console.warn('html2pdf generation encountered an issue, falling back to window.print():', err);
        this.print();
        return false;
      } finally {
        if (tempContainer && tempContainer.parentNode) {
          tempContainer.parentNode.removeChild(tempContainer);
        }
      }
    } else {
      // Native high-fidelity browser print dialog fallback
      if (tempContainer && tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
      this.print();
      return true;
    }
  },

  // Print Portfolio
  print() {
    if (typeof document !== 'undefined') {
      const data = this.getData() || this.getDraft();
      if (data) {
        let printEl = document.getElementById('executive-pdf-print-root');
        if (!printEl) {
          printEl = document.createElement('div');
          printEl.id = 'executive-pdf-print-root';
          document.body.appendChild(printEl);
        }
        printEl.innerHTML = this.renderExecutivePdfTemplate(data);
      }
    }
    window.print();
  },

  // Export full standalone self-contained HTML file
  exportStandaloneHtml(data, templateId) {
    const activeTemplate = templateId || data.template || 'corporate-professional';
    const bodyContent = this.generate(data, activeTemplate);
    const fullName = (data.personal && data.personal.fullName) || 'Student Portfolio';

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${window.PortfolioTemplates ? window.PortfolioTemplates.escapeHtml(fullName) : 'Student'} - Professional Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/templates.css">
</head>
<body style="background:#F5F7FA; margin:0; padding:40px 10px;">
  <div style="max-width:900px; margin:0 auto; background:#FFFFFF; box-shadow:0 1px 3px rgba(0,0,0,0.1); border-radius:6px; overflow:hidden;">
    ${bodyContent}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `${cleanName}_Portfolio.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export raw JSON data
  exportJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const name = (data.personal && data.personal.fullName) ? data.personal.fullName.replace(/[^a-zA-Z0-9]/g, '_') : 'Portfolio';
    link.download = `${name}_Data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Export to window and module
if (typeof window !== 'undefined') {
  window.PortfolioGenerator = PortfolioGenerator;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioGenerator;
}
