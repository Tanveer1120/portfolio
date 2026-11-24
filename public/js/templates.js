/**
 * Professional Portfolio Templates Engine
 * Five Genuine Layout Architectures:
 * 1. Corporate (Formal, structured, navy headers, placement-ready)
 * 2. Minimal (Clean spacing, balanced typography, elegant whitespace)
 * 3. Developer (Technical focus, skills stack, GitHub & live project links)
 * 4. Academic (Education-centric, college background, coursework highlights)
 * 5. Modern Professional (Contemporary aesthetic, subtle accents, sophisticated layout)
 *
 * Strictly Clean: Professional SVG Icons, High Whitespace, No Emojis, No Childish Elements.
 */

const PortfolioTemplates = {
  catalog: [
    {
      id: 'corporate',
      name: 'Corporate',
      badge: 'Placement & Job Ready',
      description: 'Formal and structured with navy headings, crisp divider rules, and clear section blocks. Tailored for placements and corporate roles.',
      className: 'template-corporate',
      tags: ['Corporate', 'Placement Ready', 'Structured', 'A4 Optimized']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      badge: 'Editorial & Clean',
      description: 'Elegant typography, clean spacing, and simple section layouts. Focuses strictly on substance with comfortable whitespace.',
      className: 'template-minimal',
      tags: ['Minimalist', 'High Whitespace', 'Modern Typo', 'Executive']
    },
    {
      id: 'developer',
      name: 'Developer',
      badge: 'Technical & Engineering',
      description: 'Highlights technical proficiencies, developer tools, GitHub repositories, and live deployment links.',
      className: 'template-developer',
      tags: ['Software Engineer', 'Code Centric', 'Repo Links', 'Technical']
    },
    {
      id: 'academic',
      name: 'Academic',
      badge: 'Education & Research',
      description: 'Education-focused layout with academic highlights, coursework, projects, and certifications.',
      className: 'template-academic',
      tags: ['Academics', 'Coursework', 'Postgraduate', 'Research']
    },
    {
      id: 'modern-professional',
      name: 'Modern Professional',
      badge: 'Contemporary Executive',
      description: 'Contemporary design with sophisticated typography, subtle professional blue accents, and a refined two-column hierarchy.',
      className: 'template-modern-professional',
      tags: ['Contemporary', 'Executive', 'Visual Hierarchy', 'Subtle Blue']
    }
  ],

  // Safely escape HTML characters
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Fallback monogram avatar
  getAvatar(data) {
    if (data.personal && data.personal.photo) {
      return data.personal.photo;
    }
    const name = (data.personal && data.personal.fullName) || 'Candidate';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=14243A&color=FFFFFF&size=200&bold=true`;
  },

  // Helper to format contact items
  renderContacts(p, prefix) {
    const items = [];
    if (p.email) {
      items.push(`<span><strong>Email:</strong> ${this.escapeHtml(p.email)}</span>`);
    }
    if (p.phone) {
      items.push(`<span><strong>Phone:</strong> ${this.escapeHtml(p.phone)}</span>`);
    }
    if (p.location) {
      items.push(`<span><strong>Location:</strong> ${this.escapeHtml(p.location)}</span>`);
    }
    if (p.linkedin) {
      items.push(`<a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    }
    if (p.github) {
      items.push(`<a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener">GitHub</a>`);
    }
    if (p.website) {
      items.push(`<a href="${this.escapeHtml(p.website)}" target="_blank" rel="noopener">Website</a>`);
    }
    return items.join(' · ');
  },

  // Helper to render skills
  renderSkillsBadges(skills) {
    if (!skills || !skills.length) return '';
    return skills.map(s => {
      const name = typeof s === 'string' ? s : s.name;
      return `<span class="portfolio-skill-tag">${this.escapeHtml(name)}</span>`;
    }).join('');
  },

  // Helper to render languages
  renderLanguagesBadges(languages) {
    if (!languages || !languages.length) return '';
    return languages.map(lang => {
      const name = typeof lang === 'string' ? lang : lang.name;
      const prof = lang.proficiency ? ` (${lang.proficiency})` : '';
      return `<span class="portfolio-lang-tag">${this.escapeHtml(name + prof)}</span>`;
    }).join('');
  },

  // =========================================================================
  // 1. CORPORATE TEMPLATE RENDERER
  // =========================================================================
  renderCorporate(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasPhoto = !!p.photo;
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasSkills = Array.isArray(data.skills) && data.skills.length > 0;
    const hasLanguages = Array.isArray(data.languages) && data.languages.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const addl = data.additional || {};
    const hasAddl = !!(addl.interests || addl.activities || addl.workshops);

    return `
    <div class="portfolio-document-root template-corporate">
      <!-- Header -->
      <header class="corp-header">
        <div style="flex-grow: 1;">
          <h1 class="corp-name">${this.escapeHtml(p.fullName || 'Candidate Name')}</h1>
          <div class="corp-title">${this.escapeHtml(p.title || 'Professional Title / Degree Candidate')}</div>
          <div class="corp-contact-row">
            ${this.renderContacts(p, 'corp')}
          </div>
        </div>
        ${hasPhoto ? `<img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="corp-avatar" />` : ''}
      </header>

      <!-- Professional Summary -->
      ${p.summary ? `
      <section class="corp-section">
        <div class="corp-section-heading">Professional Summary</div>
        <p class="corp-item-desc" style="font-size: 13.5px; color: #1E293B;">${this.escapeHtml(p.summary)}</p>
      </section>
      ` : ''}

      <!-- Education -->
      ${hasEdu ? `
      <section class="corp-section">
        <div class="corp-section-heading">Education &amp; Academic Background</div>
        ${data.education.map(edu => `
          <div class="corp-item-block">
            <div class="corp-item-header">
              <span class="corp-item-title">${this.escapeHtml(edu.degree || 'Degree')}</span>
              <span class="corp-item-date">${this.escapeHtml(edu.studyPeriod || edu.gradYear || '')}</span>
            </div>
            <div class="corp-item-subtitle">${this.escapeHtml(edu.institution || '')}${edu.university ? ` (${this.escapeHtml(edu.university)})` : ''}</div>
            <div class="corp-item-desc">
              ${edu.department ? `<div><strong>Specialization:</strong> ${this.escapeHtml(edu.department)}</div>` : ''}
              ${edu.score ? `<div><strong>Score / CGPA:</strong> ${this.escapeHtml(edu.score)}</div>` : ''}
              ${edu.highlight ? `<div><strong>Academic Highlights:</strong> ${this.escapeHtml(edu.highlight)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Skills & Languages -->
      ${(hasSkills || hasLanguages) ? `
      <section class="corp-section">
        <div class="corp-section-heading">Skills &amp; Languages</div>
        ${hasSkills ? `
          <div style="margin-bottom: 10px;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 6px;">Core Competencies</div>
            <div class="skills-tag-group">${this.renderSkillsBadges(data.skills)}</div>
          </div>
        ` : ''}
        ${hasLanguages ? `
          <div>
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 6px;">Languages</div>
            <div class="languages-tag-group">${this.renderLanguagesBadges(data.languages)}</div>
          </div>
        ` : ''}
      </section>
      ` : ''}

      <!-- Projects -->
      ${hasProjects ? `
      <section class="corp-section">
        <div class="corp-section-heading">Projects &amp; Practical Work</div>
        ${data.projects.map(proj => `
          <div class="corp-item-block">
            <div class="corp-item-header">
              <span class="corp-item-title">${this.escapeHtml(proj.name)}</span>
            </div>
            ${proj.technologies ? `<div class="corp-item-subtitle">Technologies: ${this.escapeHtml(proj.technologies)}</div>` : ''}
            <div class="corp-item-desc">
              ${proj.description ? `<p style="margin-bottom: 4px;">${this.escapeHtml(proj.description)}</p>` : ''}
              <div style="margin-top: 4px; display: flex; gap: 14px; font-size: 12px;">
                ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener">GitHub Link</a>` : ''}
                ${proj.liveUrl ? `<a href="${this.escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener">Live Project Link</a>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Internship & Experience (Optional) -->
      ${hasExp ? `
      <section class="corp-section">
        <div class="corp-section-heading">Internship &amp; Work Experience</div>
        ${data.experience.map(exp => `
          <div class="corp-item-block">
            <div class="corp-item-header">
              <span class="corp-item-title">${this.escapeHtml(exp.position)}</span>
              <span class="corp-item-date">${this.escapeHtml(exp.duration || '')}</span>
            </div>
            <div class="corp-item-subtitle">${this.escapeHtml(exp.organization)}</div>
            <div class="corp-item-desc">${this.escapeHtml(exp.description || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Certifications & Achievements -->
      ${hasCerts ? `
      <section class="corp-section">
        <div class="corp-section-heading">Certifications &amp; Achievements</div>
        ${data.certifications.map(cert => `
          <div class="corp-item-block" style="margin-bottom: 8px;">
            <div class="corp-item-header">
              <span class="corp-item-title" style="font-size: 14px;">${this.escapeHtml(cert.name)}</span>
              <span class="corp-item-date">${this.escapeHtml(cert.year || '')}</span>
            </div>
            <div class="corp-item-desc">
              <span>${this.escapeHtml(cert.organization || '')}</span>
              ${cert.credentialUrl ? ` · <a href="${this.escapeHtml(cert.credentialUrl)}" target="_blank" rel="noopener">Credential Link</a>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Additional Information -->
      ${hasAddl ? `
      <section class="corp-section">
        <div class="corp-section-heading">Additional Information</div>
        <div class="corp-item-desc">
          ${addl.interests ? `<div><strong>Hobbies &amp; Interests:</strong> ${this.escapeHtml(addl.interests)}</div>` : ''}
          ${addl.activities ? `<div><strong>Activities &amp; Leadership:</strong> ${this.escapeHtml(addl.activities)}</div>` : ''}
          ${addl.workshops ? `<div><strong>Workshops &amp; Training:</strong> ${this.escapeHtml(addl.workshops)}</div>` : ''}
        </div>
      </section>
      ` : ''}
    </div>
    `;
  },

  // =========================================================================
  // 2. MINIMAL TEMPLATE RENDERER
  // =========================================================================
  renderMinimal(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasPhoto = !!p.photo;
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasSkills = Array.isArray(data.skills) && data.skills.length > 0;
    const hasLanguages = Array.isArray(data.languages) && data.languages.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const addl = data.additional || {};
    const hasAddl = !!(addl.interests || addl.activities || addl.workshops);

    return `
    <div class="portfolio-document-root template-minimal">
      <header class="min-header">
        <div class="min-header-flex">
          ${hasPhoto ? `<img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="min-avatar" />` : ''}
          <div>
            <h1 class="min-name">${this.escapeHtml(p.fullName || 'Candidate Name')}</h1>
            <div class="min-title">${this.escapeHtml(p.title || 'Professional Title')}</div>
            <div class="min-meta-row">${this.renderContacts(p, 'min')}</div>
          </div>
        </div>
      </header>

      ${p.summary ? `
      <section class="min-section">
        <div class="min-section-title">About Me</div>
        <p class="min-entry-text" style="font-size: 13.5px;">${this.escapeHtml(p.summary)}</p>
      </section>
      ` : ''}

      ${hasEdu ? `
      <section class="min-section">
        <div class="min-section-title">Education</div>
        ${data.education.map(edu => `
          <div class="min-entry">
            <div class="min-entry-top">
              <span class="min-entry-role">${this.escapeHtml(edu.degree || '')}</span>
              <span class="min-entry-date">${this.escapeHtml(edu.studyPeriod || edu.gradYear || '')}</span>
            </div>
            <div class="min-entry-org">${this.escapeHtml(edu.institution || '')}${edu.score ? ` · Grade: ${this.escapeHtml(edu.score)}` : ''}</div>
            ${edu.highlight ? `<div class="min-entry-text">${this.escapeHtml(edu.highlight)}</div>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${(hasSkills || hasLanguages) ? `
      <section class="min-section">
        <div class="min-section-title">Skills &amp; Languages</div>
        ${hasSkills ? `<div class="skills-tag-group mb-2">${this.renderSkillsBadges(data.skills)}</div>` : ''}
        ${hasLanguages ? `<div class="languages-tag-group">${this.renderLanguagesBadges(data.languages)}</div>` : ''}
      </section>
      ` : ''}

      ${hasProjects ? `
      <section class="min-section">
        <div class="min-section-title">Projects</div>
        ${data.projects.map(proj => `
          <div class="min-entry">
            <div class="min-entry-top">
              <span class="min-entry-role">${this.escapeHtml(proj.name)}</span>
            </div>
            ${proj.technologies ? `<div class="min-entry-org" style="font-size: 12px;">Tools: ${this.escapeHtml(proj.technologies)}</div>` : ''}
            <div class="min-entry-text">${this.escapeHtml(proj.description || '')}</div>
            <div style="margin-top: 4px; font-size: 12px; display: flex; gap: 12px;">
              ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener">GitHub</a>` : ''}
              ${proj.liveUrl ? `<a href="${this.escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener">Live Demo</a>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasExp ? `
      <section class="min-section">
        <div class="min-section-title">Experience</div>
        ${data.experience.map(exp => `
          <div class="min-entry">
            <div class="min-entry-top">
              <span class="min-entry-role">${this.escapeHtml(exp.position)}</span>
              <span class="min-entry-date">${this.escapeHtml(exp.duration || '')}</span>
            </div>
            <div class="min-entry-org">${this.escapeHtml(exp.organization)}</div>
            <div class="min-entry-text">${this.escapeHtml(exp.description || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasCerts ? `
      <section class="min-section">
        <div class="min-section-title">Certifications</div>
        ${data.certifications.map(cert => `
          <div class="min-entry" style="margin-bottom: 8px;">
            <span class="min-entry-role" style="font-size: 13.5px;">${this.escapeHtml(cert.name)}</span> — <span class="min-entry-org">${this.escapeHtml(cert.organization)}</span>
            ${cert.year ? `<span class="min-entry-date" style="float: right;">${this.escapeHtml(cert.year)}</span>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasAddl ? `
      <section class="min-section">
        <div class="min-section-title">Additional</div>
        <div class="min-entry-text">
          ${addl.interests ? `<div>Interests: ${this.escapeHtml(addl.interests)}</div>` : ''}
          ${addl.activities ? `<div>Activities: ${this.escapeHtml(addl.activities)}</div>` : ''}
          ${addl.workshops ? `<div>Workshops: ${this.escapeHtml(addl.workshops)}</div>` : ''}
        </div>
      </section>
      ` : ''}
    </div>
    `;
  },

  // =========================================================================
  // 3. DEVELOPER TEMPLATE RENDERER
  // =========================================================================
  renderDeveloper(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasPhoto = !!p.photo;
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasSkills = Array.isArray(data.skills) && data.skills.length > 0;
    const hasLanguages = Array.isArray(data.languages) && data.languages.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;

    return `
    <div class="portfolio-document-root template-developer">
      <header class="dev-header-panel">
        <div>
          <h1 class="dev-name">${this.escapeHtml(p.fullName || 'Developer Candidate')}</h1>
          <div class="dev-title">${this.escapeHtml(p.title || 'Software Engineering Student')}</div>
          <div class="dev-links-row">${this.renderContacts(p, 'dev')}</div>
        </div>
        ${hasPhoto ? `<img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="dev-avatar" />` : ''}
      </header>

      ${p.summary ? `
      <section class="dev-section">
        <div class="dev-section-title">Technical Overview</div>
        <p class="dev-project-desc" style="font-size: 13.5px;">${this.escapeHtml(p.summary)}</p>
      </section>
      ` : ''}

      ${hasSkills ? `
      <section class="dev-section">
        <div class="dev-section-title">Skills &amp; Technologies</div>
        <div class="skills-tag-group">${this.renderSkillsBadges(data.skills)}</div>
        ${hasLanguages ? `<div class="languages-tag-group mt-2" style="font-size:12px;">Languages: ${this.renderLanguagesBadges(data.languages)}</div>` : ''}
      </section>
      ` : ''}

      ${hasProjects ? `
      <section class="dev-section">
        <div class="dev-section-title">Key Projects &amp; Code Repositories</div>
        ${data.projects.map(proj => `
          <div class="dev-project-card">
            <div class="dev-project-title">
              <span>${this.escapeHtml(proj.name)}</span>
            </div>
            ${proj.technologies ? `<div class="dev-project-tech">[ Stack: ${this.escapeHtml(proj.technologies)} ]</div>` : ''}
            <div class="dev-project-desc">${this.escapeHtml(proj.description || '')}</div>
            <div style="margin-top: 8px; font-size: 12px; display: flex; gap: 14px;">
              ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener" style="color: #0969DA; font-weight: 600;">GitHub Repository</a>` : ''}
              ${proj.liveUrl ? `<a href="${this.escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener" style="color: #0969DA; font-weight: 600;">Live Demo</a>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasEdu ? `
      <section class="dev-section">
        <div class="dev-section-title">Education</div>
        ${data.education.map(edu => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14px;">
              <span>${this.escapeHtml(edu.degree || '')}</span>
              <span style="font-size: 12px; color: #57606A;">${this.escapeHtml(edu.studyPeriod || edu.gradYear || '')}</span>
            </div>
            <div style="font-size: 13px; color: #57606A;">${this.escapeHtml(edu.institution || '')}${edu.score ? ` · GPA: ${this.escapeHtml(edu.score)}` : ''}</div>
            ${edu.highlight ? `<div style="font-size: 12px; color: #24292F; margin-top: 2px;">${this.escapeHtml(edu.highlight)}</div>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasExp ? `
      <section class="dev-section">
        <div class="dev-section-title">Internship &amp; Experience</div>
        ${data.experience.map(exp => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14px;">
              <span>${this.escapeHtml(exp.position)} @ ${this.escapeHtml(exp.organization)}</span>
              <span style="font-size: 12px; color: #57606A;">${this.escapeHtml(exp.duration || '')}</span>
            </div>
            <div style="font-size: 13px; color: #24292F; margin-top: 3px;">${this.escapeHtml(exp.description || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasCerts ? `
      <section class="dev-section">
        <div class="dev-section-title">Certifications</div>
        ${data.certifications.map(c => `
          <div style="font-size: 13px; margin-bottom: 4px;">
            <strong>${this.escapeHtml(c.name)}</strong> · ${this.escapeHtml(c.organization || '')} (${this.escapeHtml(c.year || '')})
            ${c.credentialUrl ? ` · <a href="${this.escapeHtml(c.credentialUrl)}" target="_blank" rel="noopener">Verify</a>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}
    </div>
    `;
  },

  // =========================================================================
  // 4. ACADEMIC TEMPLATE RENDERER
  // =========================================================================
  renderAcademic(data) {
    const p = data.personal || {};
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasSkills = Array.isArray(data.skills) && data.skills.length > 0;
    const hasLanguages = Array.isArray(data.languages) && data.languages.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const addl = data.additional || {};

    return `
    <div class="portfolio-document-root template-academic">
      <header class="acad-header">
        <h1 class="acad-name">${this.escapeHtml(p.fullName || 'Candidate Name')}</h1>
        <div class="acad-title">${this.escapeHtml(p.title || 'Academic Candidate')}</div>
        <div class="acad-contacts">${this.renderContacts(p, 'acad')}</div>
      </header>

      ${p.summary ? `
      <section class="acad-section">
        <div class="acad-section-title">Academic Profile</div>
        <p class="acad-entry-details" style="font-size: 13.5px;">${this.escapeHtml(p.summary)}</p>
      </section>
      ` : ''}

      <!-- Education prioritized in academic template -->
      ${hasEdu ? `
      <section class="acad-section">
        <div class="acad-section-title">Academic Background</div>
        ${data.education.map(edu => `
          <div class="acad-entry">
            <div class="acad-entry-top">
              <span>${this.escapeHtml(edu.degree || '')}</span>
              <span class="acad-entry-date">${this.escapeHtml(edu.studyPeriod || edu.gradYear || '')}</span>
            </div>
            <div class="acad-entry-sub">${this.escapeHtml(edu.institution || '')}${edu.university ? `, ${this.escapeHtml(edu.university)}` : ''}</div>
            <div class="acad-entry-details">
              ${edu.score ? `<div>Grade / CGPA: <strong>${this.escapeHtml(edu.score)}</strong></div>` : ''}
              ${edu.highlight ? `<div>Academic Highlights: ${this.escapeHtml(edu.highlight)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${(hasSkills || hasLanguages) ? `
      <section class="acad-section">
        <div class="acad-section-title">Core Competencies &amp; Languages</div>
        ${hasSkills ? `<div class="skills-tag-group mb-2">${this.renderSkillsBadges(data.skills)}</div>` : ''}
        ${hasLanguages ? `<div class="languages-tag-group">${this.renderLanguagesBadges(data.languages)}</div>` : ''}
      </section>
      ` : ''}

      ${hasProjects ? `
      <section class="acad-section">
        <div class="acad-section-title">Academic &amp; Applied Projects</div>
        ${data.projects.map(proj => `
          <div class="acad-entry">
            <div class="acad-entry-top">
              <span>${this.escapeHtml(proj.name)}</span>
            </div>
            ${proj.technologies ? `<div class="acad-entry-sub" style="font-size: 12px;">Methodologies: ${this.escapeHtml(proj.technologies)}</div>` : ''}
            <div class="acad-entry-details">${this.escapeHtml(proj.description || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasExp ? `
      <section class="acad-section">
        <div class="acad-section-title">Academic Assistantships &amp; Experience</div>
        ${data.experience.map(exp => `
          <div class="acad-entry">
            <div class="acad-entry-top">
              <span>${this.escapeHtml(exp.position)}</span>
              <span class="acad-entry-date">${this.escapeHtml(exp.duration || '')}</span>
            </div>
            <div class="acad-entry-sub">${this.escapeHtml(exp.organization)}</div>
            <div class="acad-entry-details">${this.escapeHtml(exp.description || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasCerts ? `
      <section class="acad-section">
        <div class="acad-section-title">Certifications &amp; Accreditations</div>
        ${data.certifications.map(c => `
          <div class="acad-entry" style="margin-bottom: 6px;">
            ${this.escapeHtml(c.name)} — ${this.escapeHtml(c.organization || '')} (${this.escapeHtml(c.year || '')})
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${addl.activities ? `
      <section class="acad-section">
        <div class="acad-section-title">Activities &amp; Leadership</div>
        <p class="acad-entry-details">${this.escapeHtml(addl.activities)}</p>
      </section>
      ` : ''}
    </div>
    `;
  },

  // =========================================================================
  // 5. MODERN PROFESSIONAL TEMPLATE RENDERER
  // =========================================================================
  renderModernProfessional(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasPhoto = !!p.photo;
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasSkills = Array.isArray(data.skills) && data.skills.length > 0;
    const hasLanguages = Array.isArray(data.languages) && data.languages.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const addl = data.additional || {};

    return `
    <div class="portfolio-document-root template-modern-professional">
      <div class="creat-layout">
        <!-- Sidebar Column -->
        <aside class="creat-sidebar">
          ${hasPhoto ? `<img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="creat-avatar" />` : ''}
          
          <div class="creat-side-section">
            <div class="creat-side-heading">Contact Details</div>
            ${p.email ? `<div class="creat-side-item"><strong>Email:</strong><br>${this.escapeHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div class="creat-side-item"><strong>Phone:</strong><br>${this.escapeHtml(p.phone)}</div>` : ''}
            ${p.location ? `<div class="creat-side-item"><strong>Location:</strong><br>${this.escapeHtml(p.location)}</div>` : ''}
            ${p.linkedin ? `<div class="creat-side-item"><a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></div>` : ''}
            ${p.github ? `<div class="creat-side-item"><a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener">GitHub</a></div>` : ''}
            ${p.website ? `<div class="creat-side-item"><a href="${this.escapeHtml(p.website)}" target="_blank" rel="noopener">Website</a></div>` : ''}
          </div>

          ${hasSkills ? `
          <div class="creat-side-section">
            <div class="creat-side-heading">Skills</div>
            <div class="skills-tag-group">${this.renderSkillsBadges(data.skills)}</div>
          </div>
          ` : ''}

          ${hasLanguages ? `
          <div class="creat-side-section">
            <div class="creat-side-heading">Languages</div>
            <div class="languages-tag-group">${this.renderLanguagesBadges(data.languages)}</div>
          </div>
          ` : ''}

          ${hasCerts ? `
          <div class="creat-side-section">
            <div class="creat-side-heading">Certifications</div>
            ${data.certifications.map(c => `
              <div class="creat-side-item" style="margin-bottom: 6px;">
                <strong>${this.escapeHtml(c.name)}</strong><br>
                <span style="font-size: 11.5px; color: #64748B;">${this.escapeHtml(c.organization || '')} (${this.escapeHtml(c.year || '')})</span>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </aside>

        <!-- Main Column -->
        <main class="creat-main">
          <h1 class="creat-name">${this.escapeHtml(p.fullName || 'Candidate Name')}</h1>
          <div class="creat-title">${this.escapeHtml(p.title || 'Professional Title')}</div>

          ${p.summary ? `
          <section class="creat-main-section">
            <div class="creat-main-heading">Summary</div>
            <p class="creat-card-desc" style="font-size: 13.5px;">${this.escapeHtml(p.summary)}</p>
          </section>
          ` : ''}

          ${hasEdu ? `
          <section class="creat-main-section">
            <div class="creat-main-heading">Education</div>
            ${data.education.map(edu => `
              <div class="creat-card">
                <div class="creat-card-top">
                  <span class="creat-card-title">${this.escapeHtml(edu.degree || '')}</span>
                  <span class="creat-card-date">${this.escapeHtml(edu.studyPeriod || edu.gradYear || '')}</span>
                </div>
                <div class="creat-card-sub">${this.escapeHtml(edu.institution || '')}${edu.score ? ` · Grade: ${this.escapeHtml(edu.score)}` : ''}</div>
                ${edu.highlight ? `<div class="creat-card-desc">${this.escapeHtml(edu.highlight)}</div>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${hasProjects ? `
          <section class="creat-main-section">
            <div class="creat-main-heading">Featured Projects</div>
            ${data.projects.map(proj => `
              <div class="creat-card">
                <div class="creat-card-top">
                  <span class="creat-card-title">${this.escapeHtml(proj.name)}</span>
                </div>
                ${proj.technologies ? `<div class="creat-card-sub" style="font-size: 12px;">Tools: ${this.escapeHtml(proj.technologies)}</div>` : ''}
                <div class="creat-card-desc">
                  ${this.escapeHtml(proj.description || '')}
                  <div style="margin-top: 4px; display: flex; gap: 12px; font-size: 12px;">
                    ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener">Code</a>` : ''}
                    ${proj.liveUrl ? `<a href="${this.escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener">Live Demo</a>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${hasExp ? `
          <section class="creat-main-section">
            <div class="creat-main-heading">Experience &amp; Internships</div>
            ${data.experience.map(exp => `
              <div class="creat-card">
                <div class="creat-card-top">
                  <span class="creat-card-title">${this.escapeHtml(exp.position)}</span>
                  <span class="creat-card-date">${this.escapeHtml(exp.duration || '')}</span>
                </div>
                <div class="creat-card-sub">${this.escapeHtml(exp.organization)}</div>
                <div class="creat-card-desc">${this.escapeHtml(exp.description || '')}</div>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${(addl.interests || addl.activities) ? `
          <section class="creat-main-section">
            <div class="creat-main-heading">Additional Information</div>
            <div class="creat-card-desc">
              ${addl.interests ? `<div><strong>Interests:</strong> ${this.escapeHtml(addl.interests)}</div>` : ''}
              ${addl.activities ? `<div><strong>Activities:</strong> ${this.escapeHtml(addl.activities)}</div>` : ''}
            </div>
          </section>
          ` : ''}
        </main>
      </div>
    </div>
    `;
  },

  // Main render dispatcher (accepts corporate, minimal, developer, academic, modern-professional and legacy aliases)
  render(templateId, data) {
    switch (templateId) {
      case 'minimal':
      case 'modern-minimal':
        return this.renderMinimal(data);
      case 'developer':
      case 'developer-portfolio':
        return this.renderDeveloper(data);
      case 'academic':
      case 'academic-portfolio':
        return this.renderAcademic(data);
      case 'modern-professional':
      case 'professional-creative':
      case 'modern':
      case 'creative':
        return this.renderModernProfessional(data);
      case 'corporate':
      case 'corporate-professional':
      default:
        return this.renderCorporate(data);
    }
  }
};

// Export to window and module
if (typeof window !== 'undefined') {
  window.PortfolioTemplates = PortfolioTemplates;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioTemplates;
}
