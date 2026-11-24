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
  },

  // Generate HTML using the reference executive two-column architecture for preview & export
  generate(data, templateId) {
    if (!data) return '<div class="executive-pdf-wrapper"></div>';
    return this.renderExecutivePdfTemplate(data);
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
