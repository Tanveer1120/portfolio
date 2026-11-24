/**
 * Professional Portfolio Templates Engine
 * Five Genuine Architectural Layouts:
 * 1. Corporate Professional
 * 2. Modern Minimal
 * 3. Developer Portfolio
 * 4. Academic Portfolio
 * 5. Professional Creative
 * Strictly Professional: Clean Typography, High Whitespace, No Emojis, No Childish Graphics
 */

const PortfolioTemplates = {
  catalog: [
    {
      id: 'corporate-professional',
      name: 'Corporate Professional',
      badge: 'Placement & Job Ready',
      description: 'Structured corporate layout with navy headings, crisp divider rules, and prominent sections. Ideal for placements, internships, and corporate employment.',
      className: 'template-corporate-professional',
      tags: ['Corporate', 'Placement Ready', 'Structured', 'A4 Optimized']
    },
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      badge: 'Editorial & Clean',
      description: 'Refined typography with balanced whitespace and subtle dividers. Tailored for graduates seeking an elegant, distraction-free career presentation.',
      className: 'template-modern-minimal',
      tags: ['Minimalist', 'High Whitespace', 'Modern Typo', 'Executive']
    },
    {
      id: 'developer-portfolio',
      name: 'Developer Portfolio',
      badge: 'Technical & Engineering',
      description: 'Clean developer layout emphasizing programming competencies, technical stacks, GitHub repositories, and architectural project summaries.',
      className: 'template-developer-portfolio',
      tags: ['Software Engineer', 'Code Centric', 'Repository Links', 'Technical']
    },
    {
      id: 'academic-portfolio',
      name: 'Academic Portfolio',
      badge: 'Research & Education',
      description: 'Education-first design with comprehensive coursework details, academic projects, honors, and publications. Ideal for research and university admissions.',
      className: 'template-academic-portfolio',
      tags: ['Academics', 'Postgraduate', 'Coursework', 'Publications']
    },
    {
      id: 'professional-creative',
      name: 'Professional Creative',
      badge: 'Two-Column Executive',
      description: 'Sophisticated two-column asymmetric layout with a structured profile sidebar and expansive project details. Great for engineering and product roles.',
      className: 'template-professional-creative',
      tags: ['Two Column', 'Executive', 'Visual Hierarchy', 'Balanced']
    }
  ],

  // Utility to safely escape HTML to prevent XSS
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Fallback avatar generator (clean monogram, no cartoon illustrations)
  getAvatar(data) {
    if (data.personal && data.personal.photo) {
      return data.personal.photo;
    }
    const name = (data.personal && data.personal.fullName) || 'Student';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=14243A&color=FFFFFF&size=200&bold=true`;
  },

  // =========================================================================
  // 1. CORPORATE PROFESSIONAL TEMPLATE RENDERER
  // =========================================================================
  renderCorporate(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasPhoto = !!p.photo;
    const hasCareerObj = !!(data.careerObjective && data.careerObjective.trim());
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const hasAchieve = Array.isArray(data.achievements) && data.achievements.length > 0;
    const hasWorkshops = Array.isArray(data.workshops) && data.workshops.length > 0;
    const hasExtracurriculars = Array.isArray(data.extracurriculars) && data.extracurriculars.length > 0;
    const addl = data.additionalInfo || {};
    const hasAddl = !!(addl.languages || addl.hobbies || addl.publications || addl.references);

    return `
    <div class="portfolio-document-root template-corporate-professional">
      <!-- Header -->
      <header class="corp-header">
        <div style="flex-grow: 1;">
          <h1 class="corp-name">${this.escapeHtml(p.fullName || 'Student Name')}</h1>
          <div class="corp-title">${this.escapeHtml(p.title || 'Professional Title / Degree Candidate')}</div>
          
          <div class="corp-contact-row">
            ${p.email ? `<span class="corp-contact-item"><strong>Email:</strong> ${this.escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span class="corp-contact-item"><strong>Phone:</strong> ${this.escapeHtml(p.phone)}</span>` : ''}
            ${(p.city || p.state) ? `<span class="corp-contact-item"><strong>Location:</strong> ${this.escapeHtml([p.city, p.state].filter(Boolean).join(', '))}</span>` : ''}
            ${p.linkedin ? `<span class="corp-contact-item"><a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></span>` : ''}
            ${p.github ? `<span class="corp-contact-item"><a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener">GitHub</a></span>` : ''}
            ${p.website ? `<span class="corp-contact-item"><a href="${this.escapeHtml(p.website)}" target="_blank" rel="noopener">Portfolio Website</a></span>` : ''}
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

      <!-- Career Objective (if provided) -->
      ${hasCareerObj ? `
      <section class="corp-section">
        <div class="corp-section-heading">Career Objective</div>
        <p class="corp-item-desc" style="font-size: 13.5px; color: #1E293B;">${this.escapeHtml(data.careerObjective)}</p>
      </section>
      ` : ''}

      <!-- Education -->
      ${hasEdu ? `
      <section class="corp-section">
        <div class="corp-section-heading">Education</div>
        ${data.education.map(edu => `
          <div class="corp-item-block">
            <div class="corp-item-header">
              <span class="corp-item-title">${this.escapeHtml(edu.degree || 'Degree')}</span>
              <span class="corp-item-date">${this.escapeHtml(edu.startYear || '')} - ${this.escapeHtml(edu.gradYear || 'Present')}</span>
            </div>
            <div class="corp-item-subtitle">${this.escapeHtml(edu.institution || '')}${edu.universityName ? ` (${this.escapeHtml(edu.universityName)})` : ''}</div>
            <div class="corp-item-desc">
              ${edu.department ? `<div><strong>Department:</strong> ${this.escapeHtml(edu.department)}</div>` : ''}
              ${edu.score ? `<div><strong>Score / CGPA:</strong> ${this.escapeHtml(edu.score)}</div>` : ''}
              ${edu.coursework ? `<div><strong>Relevant Coursework:</strong> ${this.escapeHtml(edu.coursework)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Skills Section -->
      ${this.hasSkills(data.skills) ? `
      <section class="corp-section">
        <div class="corp-section-heading">Technical &amp; Professional Competencies</div>
        <div class="corp-skills-grid">
          ${this.renderSkillsGrid(data.skills, 'corp')}
        </div>
      </section>
      ` : ''}

      <!-- Projects -->
      ${hasProjects ? `
      <section class="corp-section">
        <div class="corp-section-heading">Key Projects</div>
        ${data.projects.map(proj => `
          <div class="corp-item-block">
            <div class="corp-item-header">
              <span class="corp-item-title">${this.escapeHtml(proj.name)}</span>
              ${proj.duration ? `<span class="corp-item-date">${this.escapeHtml(proj.duration)}</span>` : ''}
            </div>
            ${proj.technologies ? `<div class="corp-item-subtitle">Technologies: ${this.escapeHtml(proj.technologies)}</div>` : ''}
            <div class="corp-item-desc">
              ${proj.description ? `<p style="margin-bottom: 4px;">${this.escapeHtml(proj.description)}</p>` : ''}
              ${proj.problemStatement ? `<p style="margin-bottom: 2px;"><strong>Problem:</strong> ${this.escapeHtml(proj.problemStatement)}</p>` : ''}
              ${proj.solution ? `<p style="margin-bottom: 2px;"><strong>Solution:</strong> ${this.escapeHtml(proj.solution)}</p>` : ''}
              ${proj.contribution ? `<p style="margin-bottom: 2px;"><strong>Role / Contribution:</strong> ${this.escapeHtml(proj.contribution)}</p>` : ''}
              <div style="margin-top: 4px; display: flex; gap: 14px;">
                ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener">GitHub Repository</a>` : ''}
                ${proj.liveUrl ? `<a href="${this.escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener">Live Project Demo</a>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Experience & Internships (Optional) -->
      ${hasExp ? `
      <section class="corp-section">
        <div class="corp-section-heading">Internships &amp; Experience</div>
        ${data.experience.map(exp => `
          <div class="corp-item-block">
            <div class="corp-item-header">
              <span class="corp-item-title">${this.escapeHtml(exp.position)}</span>
              <span class="corp-item-date">${this.escapeHtml(exp.startDate || '')} - ${this.escapeHtml(exp.endDate || 'Present')}</span>
            </div>
            <div class="corp-item-subtitle">${this.escapeHtml(exp.organization)}${exp.experienceType ? ` · ${this.escapeHtml(exp.experienceType)}` : ''}</div>
            <div class="corp-item-desc">
              ${exp.responsibilities ? `<p style="margin-bottom: 2px;">${this.escapeHtml(exp.responsibilities)}</p>` : ''}
              ${exp.achievements ? `<p style="margin-bottom: 2px;"><strong>Achievements:</strong> ${this.escapeHtml(exp.achievements)}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Certifications -->
      ${hasCerts ? `
      <section class="corp-section">
        <div class="corp-section-heading">Certifications</div>
        ${data.certifications.map(cert => `
          <div class="corp-item-block" style="margin-bottom: 8px;">
            <div class="corp-item-header">
              <span class="corp-item-title" style="font-size: 14px;">${this.escapeHtml(cert.name)}</span>
              <span class="corp-item-date">${this.escapeHtml(cert.issueDate || '')}</span>
            </div>
            <div class="corp-item-desc">
              <span>${this.escapeHtml(cert.organization || '')}</span>
              ${cert.credentialId ? ` · ID: ${this.escapeHtml(cert.credentialId)}` : ''}
              ${cert.credentialUrl ? ` · <a href="${this.escapeHtml(cert.credentialUrl)}" target="_blank" rel="noopener">Verify</a>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Achievements & Awards -->
      ${hasAchieve ? `
      <section class="corp-section">
        <div class="corp-section-heading">Achievements &amp; Honors</div>
        ${data.achievements.map(ach => `
          <div class="corp-item-block" style="margin-bottom: 8px;">
            <div class="corp-item-header">
              <span class="corp-item-title" style="font-size: 14px;">${this.escapeHtml(ach.title)}</span>
              <span class="corp-item-date">${this.escapeHtml(ach.date || '')}</span>
            </div>
            <div class="corp-item-desc">${this.escapeHtml(ach.description || '')}${ach.organization ? ` (${this.escapeHtml(ach.organization)})` : ''}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Workshops and Training -->
      ${hasWorkshops ? `
      <section class="corp-section">
        <div class="corp-section-heading">Workshops &amp; Technical Training</div>
        ${data.workshops.map(ws => `
          <div class="corp-item-block" style="margin-bottom: 8px;">
            <div class="corp-item-header">
              <span class="corp-item-title" style="font-size: 14px;">${this.escapeHtml(ws.name)}</span>
              <span class="corp-item-date">${this.escapeHtml(ws.date || '')}</span>
            </div>
            <div class="corp-item-desc"><strong>${this.escapeHtml(ws.organization || '')}:</strong> ${this.escapeHtml(ws.description || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Extracurricular Activities -->
      ${hasExtracurriculars ? `
      <section class="corp-section">
        <div class="corp-section-heading">Extracurricular Activities &amp; Leadership</div>
        ${data.extracurriculars.map(extra => `
          <div class="corp-item-block" style="margin-bottom: 8px;">
            <span class="corp-item-title" style="font-size: 14px;">${this.escapeHtml(extra.title)}</span>
            ${extra.category ? `<span class="corp-item-subtitle" style="margin-left: 6px;">[${this.escapeHtml(extra.category)}]</span>` : ''}
            <div class="corp-item-desc">${this.escapeHtml(extra.description || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      <!-- Additional Information -->
      ${hasAddl ? `
      <section class="corp-section">
        <div class="corp-section-heading">Additional Information</div>
        <div class="corp-item-desc">
          ${addl.languages ? `<div><strong>Languages Known:</strong> ${this.escapeHtml(addl.languages)}</div>` : ''}
          ${addl.hobbies ? `<div><strong>Interests:</strong> ${this.escapeHtml(addl.hobbies)}</div>` : ''}
          ${addl.publications ? `<div><strong>Publications:</strong> ${this.escapeHtml(addl.publications)}</div>` : ''}
          ${addl.references ? `<div><strong>References:</strong> ${this.escapeHtml(addl.references)}</div>` : ''}
        </div>
      </section>
      ` : ''}
    </div>
    `;
  },

  // =========================================================================
  // 2. MODERN MINIMAL TEMPLATE RENDERER
  // =========================================================================
  renderMinimal(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasPhoto = !!p.photo;
    const hasCareerObj = !!(data.careerObjective && data.careerObjective.trim());
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const hasAchieve = Array.isArray(data.achievements) && data.achievements.length > 0;
    const addl = data.additionalInfo || {};
    const hasAddl = !!(addl.languages || addl.hobbies || addl.publications);

    return `
    <div class="portfolio-document-root template-modern-minimal">
      <header class="min-header">
        <div class="min-header-flex">
          ${hasPhoto ? `<img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="min-avatar" />` : ''}
          <div>
            <h1 class="min-name">${this.escapeHtml(p.fullName || 'Student Name')}</h1>
            <div class="min-title">${this.escapeHtml(p.title || 'Professional Title')}</div>
            <div class="min-meta-row">
              ${p.email ? `<span>${this.escapeHtml(p.email)}</span>` : ''}
              ${p.phone ? `<span>${this.escapeHtml(p.phone)}</span>` : ''}
              ${(p.city || p.state) ? `<span>${this.escapeHtml([p.city, p.state].filter(Boolean).join(', '))}</span>` : ''}
              ${p.linkedin ? `<a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
              ${p.github ? `<a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
            </div>
          </div>
        </div>
      </header>

      ${p.summary ? `
      <section class="min-section">
        <div class="min-section-title">Summary</div>
        <p class="min-entry-text" style="font-size: 13.5px;">${this.escapeHtml(p.summary)}</p>
      </section>
      ` : ''}

      ${hasCareerObj ? `
      <section class="min-section">
        <div class="min-section-title">Objective</div>
        <p class="min-entry-text" style="font-size: 13.5px;">${this.escapeHtml(data.careerObjective)}</p>
      </section>
      ` : ''}

      ${hasEdu ? `
      <section class="min-section">
        <div class="min-section-title">Education</div>
        ${data.education.map(edu => `
          <div class="min-entry">
            <div class="min-entry-top">
              <span class="min-entry-role">${this.escapeHtml(edu.degree || '')}</span>
              <span class="min-entry-date">${this.escapeHtml(edu.startYear || '')} - ${this.escapeHtml(edu.gradYear || 'Present')}</span>
            </div>
            <div class="min-entry-org">${this.escapeHtml(edu.institution || '')}${edu.score ? ` · Grade: ${this.escapeHtml(edu.score)}` : ''}</div>
            ${edu.coursework ? `<div class="min-entry-text">Coursework: ${this.escapeHtml(edu.coursework)}</div>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${this.hasSkills(data.skills) ? `
      <section class="min-section">
        <div class="min-section-title">Skills &amp; Expertise</div>
        <div class="min-skills-wrap">
          ${this.renderSkillsFlat(data.skills, 'min-skill-tag')}
        </div>
      </section>
      ` : ''}

      ${hasProjects ? `
      <section class="min-section">
        <div class="min-section-title">Projects</div>
        ${data.projects.map(proj => `
          <div class="min-entry">
            <div class="min-entry-top">
              <span class="min-entry-role">${this.escapeHtml(proj.name)}</span>
              ${proj.duration ? `<span class="min-entry-date">${this.escapeHtml(proj.duration)}</span>` : ''}
            </div>
            ${proj.technologies ? `<div class="min-entry-org" style="font-size: 12px;">Stack: ${this.escapeHtml(proj.technologies)}</div>` : ''}
            <div class="min-entry-text">${this.escapeHtml(proj.description || '')}</div>
            <div style="margin-top: 4px; font-size: 12px; display: flex; gap: 12px;">
              ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener">Code Repository</a>` : ''}
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
              <span class="min-entry-date">${this.escapeHtml(exp.startDate || '')} - ${this.escapeHtml(exp.endDate || 'Present')}</span>
            </div>
            <div class="min-entry-org">${this.escapeHtml(exp.organization)}</div>
            <div class="min-entry-text">${this.escapeHtml(exp.responsibilities || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${(hasCerts || hasAchieve) ? `
      <section class="min-section">
        <div class="min-section-title">Certifications &amp; Honors</div>
        ${(data.certifications || []).map(cert => `
          <div class="min-entry" style="margin-bottom: 8px;">
            <span class="min-entry-role" style="font-size: 13.5px;">${this.escapeHtml(cert.name)}</span> — <span class="min-entry-org">${this.escapeHtml(cert.organization)}</span>
            <span class="min-entry-date" style="float: right;">${this.escapeHtml(cert.issueDate || '')}</span>
          </div>
        `).join('')}
        ${(data.achievements || []).map(ach => `
          <div class="min-entry" style="margin-bottom: 8px;">
            <span class="min-entry-role" style="font-size: 13.5px;">${this.escapeHtml(ach.title)}</span> — <span class="min-entry-text">${this.escapeHtml(ach.description || '')}</span>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasAddl ? `
      <section class="min-section">
        <div class="min-section-title">Additional</div>
        <div class="min-entry-text">
          ${addl.languages ? `<div>Languages: ${this.escapeHtml(addl.languages)}</div>` : ''}
          ${addl.hobbies ? `<div>Interests: ${this.escapeHtml(addl.hobbies)}</div>` : ''}
          ${addl.publications ? `<div>Publications: ${this.escapeHtml(addl.publications)}</div>` : ''}
        </div>
      </section>
      ` : ''}
    </div>
    `;
  },

  // =========================================================================
  // 3. DEVELOPER PORTFOLIO TEMPLATE RENDERER
  // =========================================================================
  renderDeveloper(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasPhoto = !!p.photo;
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;

    return `
    <div class="portfolio-document-root template-developer-portfolio">
      <header class="dev-header-panel">
        <div>
          <h1 class="dev-name">${this.escapeHtml(p.fullName || 'Developer Name')}</h1>
          <div class="dev-title">${this.escapeHtml(p.title || 'Software Engineering Student')}</div>
          
          <div class="dev-links-row">
            ${p.email ? `<span>email: ${this.escapeHtml(p.email)}</span>` : ''}
            ${p.github ? `<a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener">github.com</a>` : ''}
            ${p.linkedin ? `<a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener">linkedin.com</a>` : ''}
            ${p.website ? `<a href="${this.escapeHtml(p.website)}" target="_blank" rel="noopener">portfolio.web</a>` : ''}
            ${(p.city || p.state) ? `<span>loc: ${this.escapeHtml([p.city, p.state].filter(Boolean).join(', '))}</span>` : ''}
          </div>
        </div>
        ${hasPhoto ? `<img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="dev-avatar" />` : ''}
      </header>

      ${p.summary ? `
      <section class="dev-section">
        <div class="dev-section-title">Technical Overview</div>
        <p class="dev-project-desc" style="font-size: 13.5px;">${this.escapeHtml(p.summary)}</p>
      </section>
      ` : ''}

      ${this.hasSkills(data.skills) ? `
      <section class="dev-section">
        <div class="dev-section-title">Technical Stack &amp; Tooling</div>
        <div style="background-color: #F6F8FA; border: 1px solid #D0D7DE; padding: 14px; border-radius: 6px;">
          ${this.renderSkillsDevRows(data.skills)}
        </div>
      </section>
      ` : ''}

      ${hasProjects ? `
      <section class="dev-section">
        <div class="dev-section-title">Software Engineering Projects</div>
        ${data.projects.map(proj => `
          <div class="dev-project-card">
            <div class="dev-project-title">
              <span>${this.escapeHtml(proj.name)}</span>
              ${proj.duration ? `<span style="font-size: 11.5px; color: #57606A; font-weight: 500;">${this.escapeHtml(proj.duration)}</span>` : ''}
            </div>
            ${proj.technologies ? `<div class="dev-project-tech">[ ${this.escapeHtml(proj.technologies)} ]</div>` : ''}
            <div class="dev-project-desc">
              <p style="margin-bottom: 4px;">${this.escapeHtml(proj.description || '')}</p>
              ${proj.problemStatement ? `<div style="font-size: 12.5px;"><strong>Problem:</strong> ${this.escapeHtml(proj.problemStatement)}</div>` : ''}
              ${proj.solution ? `<div style="font-size: 12.5px;"><strong>Solution:</strong> ${this.escapeHtml(proj.solution)}</div>` : ''}
            </div>
            <div style="margin-top: 8px; font-size: 12px; display: flex; gap: 14px;">
              ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener" style="color: #0969DA; font-weight: 600;">Repository Source</a>` : ''}
              ${proj.liveUrl ? `<a href="${this.escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener" style="color: #0969DA; font-weight: 600;">Live Deployment</a>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasEdu ? `
      <section class="dev-section">
        <div class="dev-section-title">Education &amp; Credentials</div>
        ${data.education.map(edu => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14px;">
              <span>${this.escapeHtml(edu.degree || '')}</span>
              <span style="font-size: 12px; color: #57606A;">${this.escapeHtml(edu.startYear || '')} - ${this.escapeHtml(edu.gradYear || 'Present')}</span>
            </div>
            <div style="font-size: 13px; color: #57606A;">${this.escapeHtml(edu.institution || '')}${edu.score ? ` · GPA: ${this.escapeHtml(edu.score)}` : ''}</div>
            ${edu.coursework ? `<div style="font-size: 12.5px; color: #24292F; margin-top: 2px;">Key Modules: ${this.escapeHtml(edu.coursework)}</div>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasExp ? `
      <section class="dev-section">
        <div class="dev-section-title">Professional Experience</div>
        ${data.experience.map(exp => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14px;">
              <span>${this.escapeHtml(exp.position)} @ ${this.escapeHtml(exp.organization)}</span>
              <span style="font-size: 12px; color: #57606A;">${this.escapeHtml(exp.startDate || '')} - ${this.escapeHtml(exp.endDate || 'Present')}</span>
            </div>
            <div style="font-size: 13px; color: #24292F; margin-top: 3px;">${this.escapeHtml(exp.responsibilities || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasCerts ? `
      <section class="dev-section">
        <div class="dev-section-title">Certifications</div>
        ${data.certifications.map(c => `
          <div style="font-size: 13px; margin-bottom: 4px;">
            <strong>${this.escapeHtml(c.name)}</strong> · ${this.escapeHtml(c.organization || '')} (${this.escapeHtml(c.issueDate || '')})
            ${c.credentialUrl ? ` · <a href="${this.escapeHtml(c.credentialUrl)}" target="_blank" rel="noopener">Verify</a>` : ''}
          </div>
        `).join('')}
      </section>
      ` : ''}
    </div>
    `;
  },

  // =========================================================================
  // 4. ACADEMIC PORTFOLIO TEMPLATE RENDERER
  // =========================================================================
  renderAcademic(data) {
    const p = data.personal || {};
    const hasCareerObj = !!(data.careerObjective && data.careerObjective.trim());
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const hasAchieve = Array.isArray(data.achievements) && data.achievements.length > 0;
    const hasWorkshops = Array.isArray(data.workshops) && data.workshops.length > 0;
    const addl = data.additionalInfo || {};

    return `
    <div class="portfolio-document-root template-academic-portfolio">
      <header class="acad-header">
        <h1 class="acad-name">${this.escapeHtml(p.fullName || 'Student Name')}</h1>
        <div class="acad-title">${this.escapeHtml(p.title || 'Academic Candidate')}</div>
        <div class="acad-contacts">
          ${p.email ? `<span>Email: ${this.escapeHtml(p.email)}</span>` : ''}
          ${p.phone ? `<span>Tel: ${this.escapeHtml(p.phone)}</span>` : ''}
          ${(p.city || p.state) ? `<span>Location: ${this.escapeHtml([p.city, p.state].filter(Boolean).join(', '))}</span>` : ''}
          ${p.linkedin ? `<a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
        </div>
      </header>

      ${hasCareerObj ? `
      <section class="acad-section">
        <div class="acad-section-title">Academic &amp; Research Objective</div>
        <p class="acad-entry-details" style="font-size: 13.5px;">${this.escapeHtml(data.careerObjective)}</p>
      </section>
      ` : (p.summary ? `
      <section class="acad-section">
        <div class="acad-section-title">Scholarly Profile</div>
        <p class="acad-entry-details" style="font-size: 13.5px;">${this.escapeHtml(p.summary)}</p>
      </section>
      ` : '')}

      <!-- Education First in Academic Portfolio -->
      ${hasEdu ? `
      <section class="acad-section">
        <div class="acad-section-title">Education &amp; Qualifications</div>
        ${data.education.map(edu => `
          <div class="acad-entry">
            <div class="acad-entry-top">
              <span>${this.escapeHtml(edu.degree || '')}</span>
              <span class="acad-entry-date">${this.escapeHtml(edu.startYear || '')} - ${this.escapeHtml(edu.gradYear || 'Present')}</span>
            </div>
            <div class="acad-entry-sub">${this.escapeHtml(edu.institution || '')}${edu.universityName ? `, ${this.escapeHtml(edu.universityName)}` : ''}</div>
            <div class="acad-entry-details">
              ${edu.score ? `<div>Cumulative Performance: <strong>${this.escapeHtml(edu.score)}</strong></div>` : ''}
              ${edu.coursework ? `<div>Relevant Coursework: ${this.escapeHtml(edu.coursework)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${this.hasSkills(data.skills) ? `
      <section class="acad-section">
        <div class="acad-section-title">Core Competencies &amp; Methodologies</div>
        <div class="acad-entry-details">
          ${this.renderSkillsAcademic(data.skills)}
        </div>
      </section>
      ` : ''}

      ${hasProjects ? `
      <section class="acad-section">
        <div class="acad-section-title">Academic &amp; Applied Projects</div>
        ${data.projects.map(proj => `
          <div class="acad-entry">
            <div class="acad-entry-top">
              <span>${this.escapeHtml(proj.name)}</span>
              ${proj.duration ? `<span class="acad-entry-date">${this.escapeHtml(proj.duration)}</span>` : ''}
            </div>
            ${proj.technologies ? `<div class="acad-entry-sub" style="font-size: 12px;">Methodologies: ${this.escapeHtml(proj.technologies)}</div>` : ''}
            <div class="acad-entry-details">
              <p style="margin-bottom: 3px;">${this.escapeHtml(proj.description || '')}</p>
              ${proj.solution ? `<p style="margin-bottom: 2px;"><strong>Findings / Solution:</strong> ${this.escapeHtml(proj.solution)}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${hasExp ? `
      <section class="acad-section">
        <div class="acad-section-title">Academic &amp; Professional Experience</div>
        ${data.experience.map(exp => `
          <div class="acad-entry">
            <div class="acad-entry-top">
              <span>${this.escapeHtml(exp.position)}</span>
              <span class="acad-entry-date">${this.escapeHtml(exp.startDate || '')} - ${this.escapeHtml(exp.endDate || 'Present')}</span>
            </div>
            <div class="acad-entry-sub">${this.escapeHtml(exp.organization)}</div>
            <div class="acad-entry-details">${this.escapeHtml(exp.responsibilities || '')}</div>
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${(hasAchieve || hasCerts) ? `
      <section class="acad-section">
        <div class="acad-section-title">Honors, Awards &amp; Certifications</div>
        ${(data.achievements || []).map(ach => `
          <div class="acad-entry" style="margin-bottom: 6px;">
            <strong>${this.escapeHtml(ach.title)}</strong> — ${this.escapeHtml(ach.description || '')} (${this.escapeHtml(ach.date || '')})
          </div>
        `).join('')}
        ${(data.certifications || []).map(c => `
          <div class="acad-entry" style="margin-bottom: 6px;">
            ${this.escapeHtml(c.name)} — ${this.escapeHtml(c.organization || '')} (${this.escapeHtml(c.issueDate || '')})
          </div>
        `).join('')}
      </section>
      ` : ''}

      ${addl.publications ? `
      <section class="acad-section">
        <div class="acad-section-title">Publications &amp; Working Papers</div>
        <p class="acad-entry-details">${this.escapeHtml(addl.publications)}</p>
      </section>
      ` : ''}
    </div>
    `;
  },

  // =========================================================================
  // 5. PROFESSIONAL CREATIVE TEMPLATE RENDERER
  // =========================================================================
  renderCreative(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasPhoto = !!p.photo;
    const hasEdu = Array.isArray(data.education) && data.education.length > 0;
    const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
    const hasExp = Array.isArray(data.experience) && data.experience.length > 0;
    const hasCerts = Array.isArray(data.certifications) && data.certifications.length > 0;
    const hasAchieve = Array.isArray(data.achievements) && data.achievements.length > 0;
    const addl = data.additionalInfo || {};

    return `
    <div class="portfolio-document-root template-professional-creative">
      <div class="creat-layout">
        <!-- Sidebar Column -->
        <aside class="creat-sidebar">
          ${hasPhoto ? `<img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="creat-avatar" />` : ''}
          
          <div class="creat-side-section">
            <div class="creat-side-heading">Contact</div>
            ${p.email ? `<div class="creat-side-item"><strong>Email:</strong><br>${this.escapeHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div class="creat-side-item"><strong>Phone:</strong><br>${this.escapeHtml(p.phone)}</div>` : ''}
            ${(p.city || p.state) ? `<div class="creat-side-item"><strong>Location:</strong><br>${this.escapeHtml([p.city, p.state].filter(Boolean).join(', '))}</div>` : ''}
            ${p.linkedin ? `<div class="creat-side-item"><a href="${this.escapeHtml(p.linkedin)}" target="_blank" rel="noopener">LinkedIn Profile</a></div>` : ''}
            ${p.github ? `<div class="creat-side-item"><a href="${this.escapeHtml(p.github)}" target="_blank" rel="noopener">GitHub Profile</a></div>` : ''}
            ${p.website ? `<div class="creat-side-item"><a href="${this.escapeHtml(p.website)}" target="_blank" rel="noopener">Personal Website</a></div>` : ''}
          </div>

          <!-- Skills Sidebar -->
          ${this.hasSkills(data.skills) ? `
          <div class="creat-side-section">
            <div class="creat-side-heading">Skills</div>
            ${this.renderSkillsSidebar(data.skills)}
          </div>
          ` : ''}

          <!-- Certifications Sidebar -->
          ${hasCerts ? `
          <div class="creat-side-section">
            <div class="creat-side-heading">Certifications</div>
            ${data.certifications.map(c => `
              <div class="creat-side-item" style="margin-bottom: 8px;">
                <strong>${this.escapeHtml(c.name)}</strong><br>
                <span style="font-size: 11.5px; color: #64748B;">${this.escapeHtml(c.organization || '')} (${this.escapeHtml(c.issueDate || '')})</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Languages Sidebar -->
          ${addl.languages ? `
          <div class="creat-side-section">
            <div class="creat-side-heading">Languages</div>
            <div class="creat-side-item">${this.escapeHtml(addl.languages)}</div>
          </div>
          ` : ''}
        </aside>

        <!-- Main Column -->
        <main class="creat-main">
          <h1 class="creat-name">${this.escapeHtml(p.fullName || 'Student Name')}</h1>
          <div class="creat-title">${this.escapeHtml(p.title || 'Candidate for Professional Roles')}</div>

          ${p.summary ? `
          <section class="creat-main-section">
            <div class="creat-main-heading">Profile</div>
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
                  <span class="creat-card-date">${this.escapeHtml(edu.startYear || '')} - ${this.escapeHtml(edu.gradYear || 'Present')}</span>
                </div>
                <div class="creat-card-sub">${this.escapeHtml(edu.institution || '')}${edu.score ? ` · GPA: ${this.escapeHtml(edu.score)}` : ''}</div>
                ${edu.coursework ? `<div class="creat-card-desc">Coursework: ${this.escapeHtml(edu.coursework)}</div>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${hasProjects ? `
          <section class="creat-main-section">
            <div class="creat-main-heading">Key Projects</div>
            ${data.projects.map(proj => `
              <div class="creat-card">
                <div class="creat-card-top">
                  <span class="creat-card-title">${this.escapeHtml(proj.name)}</span>
                  ${proj.duration ? `<span class="creat-card-date">${this.escapeHtml(proj.duration)}</span>` : ''}
                </div>
                ${proj.technologies ? `<div class="creat-card-sub" style="font-size: 12px;">${this.escapeHtml(proj.technologies)}</div>` : ''}
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
                  <span class="creat-card-date">${this.escapeHtml(exp.startDate || '')} - ${this.escapeHtml(exp.endDate || 'Present')}</span>
                </div>
                <div class="creat-card-sub">${this.escapeHtml(exp.organization)}</div>
                <div class="creat-card-desc">${this.escapeHtml(exp.responsibilities || '')}</div>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${hasAchieve ? `
          <section class="creat-main-section">
            <div class="creat-main-heading">Achievements</div>
            ${data.achievements.map(ach => `
              <div class="creat-card" style="margin-bottom: 8px;">
                <span class="creat-card-title" style="font-size: 13.5px;">${this.escapeHtml(ach.title)}</span>
                <span class="creat-card-date" style="float: right;">${this.escapeHtml(ach.date || '')}</span>
                <div class="creat-card-desc">${this.escapeHtml(ach.description || '')}</div>
              </div>
            `).join('')}
          </section>
          ` : ''}
        </main>
      </div>
    </div>
    `;
  },

  // =========================================================================
  // HELPER SKILL PARSERS & RENDERERS
  // =========================================================================
  hasSkills(skills) {
    if (!skills) return false;
    if (typeof skills === 'string') return skills.trim().length > 0;
    if (Array.isArray(skills)) return skills.length > 0;
    if (typeof skills === 'object') {
      return Object.values(skills).some(val => val && String(val).trim().length > 0);
    }
    return false;
  },

  renderSkillsGrid(skills, prefix) {
    if (!skills) return '';
    if (typeof skills === 'string') {
      return `<div class="${prefix}-skill-cell"><div class="${prefix}-skill-cat">Core Skills</div><div class="${prefix}-skill-val">${this.escapeHtml(skills)}</div></div>`;
    }
    if (Array.isArray(skills)) {
      return skills.map(s => {
        const name = typeof s === 'string' ? s : s.name;
        const level = s.level ? ` (${s.level})` : '';
        return `<div class="${prefix}-skill-cell"><div class="${prefix}-skill-val">${this.escapeHtml(name + level)}</div></div>`;
      }).join('');
    }
    // Object with categorized fields
    const labels = {
      programmingLanguages: 'Programming Languages',
      frontend: 'Frontend Technologies',
      backend: 'Backend Technologies',
      frameworks: 'Frameworks & Libraries',
      databases: 'Databases',
      tools: 'Developer Tools',
      softwareSkills: 'Software & Applications',
      softSkills: 'Professional & Soft Skills',
      otherSkills: 'Other Skills'
    };

    let html = '';
    for (const [key, label] of Object.entries(labels)) {
      if (skills[key] && skills[key].trim()) {
        html += `
          <div class="${prefix}-skill-cell">
            <div class="${prefix}-skill-cat">${label}</div>
            <div class="${prefix}-skill-val">${this.escapeHtml(skills[key])}</div>
          </div>
        `;
      }
    }
    return html;
  },

  renderSkillsFlat(skills, className) {
    if (!skills) return '';
    let items = [];
    if (typeof skills === 'string') {
      items = skills.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(skills)) {
      items = skills.map(s => typeof s === 'string' ? s : s.name);
    } else if (typeof skills === 'object') {
      for (const val of Object.values(skills)) {
        if (val) {
          items.push(...val.split(',').map(s => s.trim()).filter(Boolean));
        }
      }
    }
    return items.map(it => `<span class="${className}">${this.escapeHtml(it)}</span>`).join('');
  },

  renderSkillsDevRows(skills) {
    if (!skills) return '';
    const labels = {
      programmingLanguages: 'Languages:',
      frontend: 'Frontend:',
      backend: 'Backend:',
      frameworks: 'Frameworks:',
      databases: 'Databases:',
      tools: 'Developer Tools:',
      softwareSkills: 'Software Tools:',
      softSkills: 'Soft Skills:'
    };

    if (typeof skills === 'object' && !Array.isArray(skills)) {
      let rows = '';
      for (const [key, lbl] of Object.entries(labels)) {
        if (skills[key] && skills[key].trim()) {
          rows += `
            <div class="dev-skill-group">
              <span class="dev-skill-lbl">${lbl}</span>
              <span class="dev-skill-txt">${this.escapeHtml(skills[key])}</span>
            </div>
          `;
        }
      }
      return rows;
    }
    return `<div class="dev-skill-group"><span class="dev-skill-txt">${this.escapeHtml(JSON.stringify(skills))}</span></div>`;
  },

  renderSkillsAcademic(skills) {
    if (!skills) return '';
    if (typeof skills === 'string') return `<div>${this.escapeHtml(skills)}</div>`;
    if (Array.isArray(skills)) return `<div>${skills.map(s => typeof s === 'string' ? s : s.name).join(', ')}</div>`;
    return Object.entries(skills)
      .filter(([k, v]) => v && v.trim())
      .map(([k, v]) => `<div><strong>${k.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> ${this.escapeHtml(v)}</div>`)
      .join('');
  },

  renderSkillsSidebar(skills) {
    if (!skills) return '';
    if (typeof skills === 'string') return `<div class="creat-side-item">${this.escapeHtml(skills)}</div>`;
    if (Array.isArray(skills)) return skills.map(s => `<div class="creat-side-item">${this.escapeHtml(typeof s === 'string' ? s : s.name)}</div>`).join('');
    return Object.entries(skills)
      .filter(([k, v]) => v && v.trim())
      .map(([k, v]) => `
        <div class="creat-side-item" style="margin-bottom: 6px;">
          <strong style="font-size: 11.5px; color: #14243A;">${k.replace(/([A-Z])/g, ' $1')}:</strong><br>
          ${this.escapeHtml(v)}
        </div>
      `).join('');
  },

  // Main render dispatcher
  render(templateId, data) {
    switch (templateId) {
      case 'modern-minimal':
        return this.renderMinimal(data);
      case 'developer-portfolio':
        return this.renderDeveloper(data);
      case 'academic-portfolio':
        return this.renderAcademic(data);
      case 'professional-creative':
        return this.renderCreative(data);
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
