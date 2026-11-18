/**
 * Portfolio Templates Engine & Layout Definitions
 * 4 Distinct Templates:
 * 1. minimal-professional
 * 2. modern-dark
 * 3. creative-student
 * 4. developer-portfolio
 */

const PortfolioTemplates = {
  // Registry metadata
  catalog: [
    {
      id: 'minimal-professional',
      name: 'Minimal Professional',
      badge: 'Editorial Clean',
      description: 'Clean white canvas, timeless typography, structured grid layout. Ideal for business, consulting, and classic academic portfolios.',
      accent: '#e63946',
      bgClass: 'portfolio-template-minimal',
      tags: ['Light Theme', 'Minimalist', 'Clean Grid', 'Fast Loading']
    },
    {
      id: 'modern-dark',
      name: 'Modern Dark',
      badge: 'Popular Choice',
      description: 'High-contrast obsidian theme with vibrant crimson accents, glass cards, and glowing interactive elements.',
      accent: '#ff3344',
      bgClass: 'portfolio-template-dark',
      tags: ['Dark Theme', 'SaaS Modern', 'Glowing Accents', 'Glassmorphism']
    },
    {
      id: 'creative-student',
      name: 'Creative Student',
      badge: 'Dynamic & Bold',
      description: 'Expressive gradient headers, curved floating cards, and stylish badges tailored for design, multimedia, and student innovators.',
      accent: '#e63946',
      bgClass: 'portfolio-template-creative',
      tags: ['Gradients', 'Playful & Polished', 'Floating UI', 'Visual Impact']
    },
    {
      id: 'developer-portfolio',
      name: 'Developer Portfolio',
      badge: 'Tech & Code',
      description: 'Terminal and IDE inspired design with syntax badges, repository commit styling, and prominent code project showcases.',
      accent: '#ff5555',
      bgClass: 'portfolio-template-developer',
      tags: ['Monospace Font', 'Terminal Vibe', 'GitHub Repo Cards', 'Code-Centric']
    }
  ],

  // Utility to safely escape HTML
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Fallback avatar generator
  getAvatar(data) {
    if (data.personal && data.personal.photo) {
      return data.personal.photo;
    }
    const name = (data.personal && data.personal.fullName) || 'Student Portfolio';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e63946&color=fff&size=256&bold=true`;
  },

  // 1. MINIMAL PROFESSIONAL RENDERER
  renderMinimal(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasEdu = data.education && data.education.length > 0;
    const hasSkills = data.skills && data.skills.length > 0;
    const hasProjects = data.projects && data.projects.length > 0;
    const hasCerts = data.certifications && data.certifications.length > 0;
    const hasExp = data.experience && data.experience.length > 0;
    const social = data.social || {};

    let html = `
    <div class="portfolio-render-root portfolio-template-minimal">
      <!-- Navbar -->
      <nav class="min-nav">
        <div class="min-nav-container">
          <a href="#" class="min-brand">${this.escapeHtml(p.fullName || 'Student Portfolio')}</a>
          <ul class="min-links">
            ${hasEdu ? '<li><a href="#education">Education</a></li>' : ''}
            ${hasSkills ? '<li><a href="#skills">Skills</a></li>' : ''}
            ${hasProjects ? '<li><a href="#projects">Projects</a></li>' : ''}
            ${hasExp ? '<li><a href="#experience">Experience</a></li>' : ''}
            ${hasCerts ? '<li><a href="#certifications">Certifications</a></li>' : ''}
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <div class="min-container">
        <!-- Hero Section -->
        <header class="min-hero">
          <img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="min-avatar" />
          <div class="min-hero-text">
            <h1>${this.escapeHtml(p.fullName || 'Your Name')}</h1>
            <div class="min-title">${this.escapeHtml(p.title || 'Professional Title')}</div>
            <p class="min-bio">${this.escapeHtml(p.about || 'Welcome to my professional personal portfolio.')}</p>
            
            <div class="min-meta-pills">
              ${p.location ? `<span><i class="bi bi-geo-alt"></i> ${this.escapeHtml(p.location)}</span>` : ''}
              ${p.email ? `<span><i class="bi bi-envelope"></i> ${this.escapeHtml(p.email)}</span>` : ''}
              ${p.phone ? `<span><i class="bi bi-telephone"></i> ${this.escapeHtml(p.phone)}</span>` : ''}
            </div>
          </div>
        </header>

        <!-- Education Section -->
        ${hasEdu ? `
        <section id="education" class="min-section">
          <h2 class="min-section-title">Education</h2>
          <div>
            ${data.education.map(edu => `
              <div class="min-timeline-item">
                <div class="min-period">
                  ${this.escapeHtml(edu.startYear || '')} — ${this.escapeHtml(edu.gradYear || 'Present')}
                  ${edu.score ? `<div style="color: #e63946; font-size: 0.85rem; margin-top: 4px;">Score: ${this.escapeHtml(edu.score)}</div>` : ''}
                </div>
                <div class="min-content">
                  <h3>${this.escapeHtml(edu.degree || '')} ${edu.department ? `<span style="font-weight: 400; color: #6b7280;">in ${this.escapeHtml(edu.department)}</span>` : ''}</h3>
                  <div class="min-institution">${this.escapeHtml(edu.institution || '')}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Technical Skills Section -->
        ${hasSkills ? `
        <section id="skills" class="min-section">
          <h2 class="min-section-title">Technical Expertise</h2>
          <div class="min-skills-grid">
            ${data.skills.map(skill => `
              <div class="min-skill-tag">
                <strong>${this.escapeHtml(skill.name)}</strong>
                ${skill.level ? `<span style="color:#6b7280; font-size:0.8rem; margin-left:6px;">(${this.escapeHtml(skill.level)})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Projects Section -->
        ${hasProjects ? `
        <section id="projects" class="min-section">
          <h2 class="min-section-title">Featured Projects</h2>
          <div class="min-projects-grid">
            ${data.projects.map(proj => `
              <div class="min-project-card">
                <h3>${this.escapeHtml(proj.name)}</h3>
                <p>${this.escapeHtml(proj.description || '')}</p>
                ${proj.technologies ? `<div class="min-project-tech">${this.escapeHtml(proj.technologies)}</div>` : ''}
                <div class="min-project-links">
                  ${proj.projectUrl ? `<a href="${this.escapeHtml(proj.projectUrl)}" target="_blank" rel="noopener">Live Demo <i class="bi bi-box-arrow-up-right"></i></a>` : ''}
                  ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener">Source Code <i class="bi bi-github"></i></a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Experience Section (Optional) -->
        ${hasExp ? `
        <section id="experience" class="min-section">
          <h2 class="min-section-title">Experience & Internships</h2>
          <div>
            ${data.experience.map(exp => `
              <div class="min-timeline-item">
                <div class="min-period">${this.escapeHtml(exp.duration || '')}</div>
                <div class="min-content">
                  <h3>${this.escapeHtml(exp.position || '')}</h3>
                  <div class="min-institution">${this.escapeHtml(exp.company || '')}</div>
                  <p>${this.escapeHtml(exp.description || '')}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Certifications Section -->
        ${hasCerts ? `
        <section id="certifications" class="min-section">
          <h2 class="min-section-title">Certifications & Honors</h2>
          <div class="min-projects-grid">
            ${data.certifications.map(cert => `
              <div class="min-project-card" style="padding: 1.25rem;">
                <h3 style="font-size: 1.05rem;">${this.escapeHtml(cert.name)}</h3>
                <div style="color: #e63946; font-size: 0.88rem; font-weight: 500; margin-bottom: 0.5rem;">${this.escapeHtml(cert.organization)} (${this.escapeHtml(cert.year)})</div>
                ${cert.url ? `<a href="${this.escapeHtml(cert.url)}" target="_blank" rel="noopener" style="font-size: 0.82rem; color: #000; text-decoration: underline;">View Credential <i class="bi bi-patch-check"></i></a>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Contact Section -->
        <section id="contact" class="min-section" style="border-bottom: none;">
          <h2 class="min-section-title">Get in Touch</h2>
          <p style="color: #4b5563; font-size: 1.05rem; margin-bottom: 1.5rem;">Feel free to reach out for project collaborations, internships, or open opportunities.</p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            ${p.email ? `<a href="mailto:${this.escapeHtml(p.email)}" class="btn-red" style="font-size: 0.95rem;"><i class="bi bi-envelope"></i> Email Me</a>` : ''}
            ${social.linkedin ? `<a href="${this.escapeHtml(social.linkedin)}" target="_blank" rel="noopener" class="btn-outline-red" style="color:#000;"><i class="bi bi-linkedin"></i> LinkedIn</a>` : ''}
            ${social.github ? `<a href="${this.escapeHtml(social.github)}" target="_blank" rel="noopener" class="btn-outline-red" style="color:#000;"><i class="bi bi-github"></i> GitHub</a>` : ''}
          </div>
        </section>
      </div>

      <!-- Footer -->
      <footer class="min-footer">
        <div class="min-social-links">
          ${social.github ? `<a href="${this.escapeHtml(social.github)}" target="_blank"><i class="bi bi-github"></i></a>` : ''}
          ${social.linkedin ? `<a href="${this.escapeHtml(social.linkedin)}" target="_blank"><i class="bi bi-linkedin"></i></a>` : ''}
          ${social.instagram ? `<a href="${this.escapeHtml(social.instagram)}" target="_blank"><i class="bi bi-instagram"></i></a>` : ''}
          ${social.website ? `<a href="${this.escapeHtml(social.website)}" target="_blank"><i class="bi bi-globe"></i></a>` : ''}
        </div>
        <p>&copy; ${new Date().getFullYear()} ${this.escapeHtml(p.fullName || 'Student Portfolio')}. All rights reserved.</p>
      </footer>
    </div>
    `;
    return html;
  },

  // 2. MODERN DARK RENDERER
  renderDark(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasEdu = data.education && data.education.length > 0;
    const hasSkills = data.skills && data.skills.length > 0;
    const hasProjects = data.projects && data.projects.length > 0;
    const hasCerts = data.certifications && data.certifications.length > 0;
    const hasExp = data.experience && data.experience.length > 0;
    const social = data.social || {};

    let html = `
    <div class="portfolio-render-root portfolio-template-dark">
      <!-- Navbar -->
      <nav class="dark-nav">
        <div class="dark-nav-container">
          <a href="#" class="dark-brand">
            <span class="dark-brand-dot"></span>
            ${this.escapeHtml(p.fullName || 'Student Portfolio')}
          </a>
          <ul class="dark-links">
            ${hasEdu ? '<li><a href="#dark-edu">Education</a></li>' : ''}
            ${hasSkills ? '<li><a href="#dark-skills">Skills</a></li>' : ''}
            ${hasProjects ? '<li><a href="#dark-projects">Projects</a></li>' : ''}
            ${hasExp ? '<li><a href="#dark-exp">Experience</a></li>' : ''}
            ${hasCerts ? '<li><a href="#dark-certs">Certifications</a></li>' : ''}
            <li><a href="#dark-contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <div class="dark-container">
        <!-- Hero Section -->
        <header class="dark-hero">
          <div class="dark-hero-glow"></div>
          <div class="dark-hero-grid">
            <div>
              <span class="dark-greeting"><i class="bi bi-stars"></i> Available for Opportunities</span>
              <h1 class="dark-hero-title">${this.escapeHtml(p.fullName || 'Your Name')}</h1>
              <div class="dark-hero-subtitle">${this.escapeHtml(p.title || 'Software Engineer & Innovator')}</div>
              <p class="dark-hero-bio">${this.escapeHtml(p.about || 'Welcome to my digital space. Explore my background, technical stack, and recent software builds.')}</p>
              
              <div class="dark-hero-actions">
                ${p.email ? `<a href="mailto:${this.escapeHtml(p.email)}" class="btn-red"><i class="bi bi-send-fill"></i> Get in Touch</a>` : ''}
                ${social.github ? `<a href="${this.escapeHtml(social.github)}" target="_blank" rel="noopener" class="btn-ghost-dark"><i class="bi bi-github"></i> GitHub</a>` : ''}
              </div>
            </div>

            <div class="dark-avatar-wrapper">
              <img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="dark-avatar" />
            </div>
          </div>
        </header>

        <!-- Education Section -->
        ${hasEdu ? `
        <section id="dark-edu" class="dark-section">
          <div class="dark-section-title-wrap">
            <span class="dark-section-tag">Academic Background</span>
            <h2 class="dark-section-title">Education & Qualifications</h2>
          </div>
          <div class="dark-grid-2">
            ${data.education.map(edu => `
              <div class="dark-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.8rem;">
                  <span style="font-size:0.8rem; background: rgba(255,51,68,0.12); color:#ff5f6d; padding:0.25rem 0.65rem; border-radius:999px;">
                    ${this.escapeHtml(edu.startYear || '')} — ${this.escapeHtml(edu.gradYear || 'Present')}
                  </span>
                  ${edu.score ? `<span style="font-size:0.85rem; color:#38ef7d; font-weight:600;"><i class="bi bi-award"></i> ${this.escapeHtml(edu.score)}</span>` : ''}
                </div>
                <h3 style="font-size:1.25rem; color:#fff; margin-bottom:0.35rem;">${this.escapeHtml(edu.degree || '')}</h3>
                ${edu.department ? `<div style="color:#94a3b8; font-size:0.95rem; margin-bottom:0.5rem;">Major: ${this.escapeHtml(edu.department)}</div>` : ''}
                <div style="color:#ff3344; font-weight:600; font-size:0.95rem;"><i class="bi bi-building"></i> ${this.escapeHtml(edu.institution || '')}</div>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Technical Skills Section -->
        ${hasSkills ? `
        <section id="dark-skills" class="dark-section">
          <div class="dark-section-title-wrap">
            <span class="dark-section-tag">Core Competencies</span>
            <h2 class="dark-section-title">Technical Skills</h2>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${data.skills.map(skill => `
              <div class="dark-skill-pill">
                <span class="dot"></span>
                <strong>${this.escapeHtml(skill.name)}</strong>
                ${skill.level ? `<span style="color:#94a3b8; font-size:0.8rem;">· ${this.escapeHtml(skill.level)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Projects Section -->
        ${hasProjects ? `
        <section id="dark-projects" class="dark-section">
          <div class="dark-section-title-wrap">
            <span class="dark-section-tag">Portfolio Showcase</span>
            <h2 class="dark-section-title">Featured Projects</h2>
          </div>
          <div class="dark-grid-3">
            ${data.projects.map(proj => `
              <div class="dark-card" style="display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <i class="bi bi-folder-fill" style="color:#ff3344; font-size:1.4rem;"></i>
                  <div style="display:flex; gap:0.6rem;">
                    ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" style="color:#cbd5e1; font-size:1.1rem;"><i class="bi bi-github"></i></a>` : ''}
                    ${proj.projectUrl ? `<a href="${this.escapeHtml(proj.projectUrl)}" target="_blank" style="color:#cbd5e1; font-size:1.1rem;"><i class="bi bi-box-arrow-up-right"></i></a>` : ''}
                  </div>
                </div>
                <h3 style="font-size:1.15rem; color:#fff; margin-bottom:0.5rem;">${this.escapeHtml(proj.name)}</h3>
                <p style="color:#94a3b8; font-size:0.9rem; flex-grow:1; margin-bottom:1.25rem;">${this.escapeHtml(proj.description || '')}</p>
                ${proj.technologies ? `
                  <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
                    ${proj.technologies.split(',').map(tech => `
                      <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:0.2rem 0.5rem; border-radius:4px; color:#cbd5e1;">${this.escapeHtml(tech.trim())}</span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Experience Section (Optional) -->
        ${hasExp ? `
        <section id="dark-exp" class="dark-section">
          <div class="dark-section-title-wrap">
            <span class="dark-section-tag">Professional History</span>
            <h2 class="dark-section-title">Work Experience</h2>
          </div>
          <div class="dark-grid-2">
            ${data.experience.map(exp => `
              <div class="dark-card">
                <span style="font-size:0.8rem; color:#ff3344; font-weight:600;">${this.escapeHtml(exp.duration || '')}</span>
                <h3 style="font-size:1.2rem; color:#fff; margin-top:0.35rem; margin-bottom:0.2rem;">${this.escapeHtml(exp.position || '')}</h3>
                <div style="color:#94a3b8; font-size:0.92rem; margin-bottom:0.75rem;"><i class="bi bi-briefcase"></i> ${this.escapeHtml(exp.company || '')}</div>
                <p style="color:#cbd5e1; font-size:0.9rem; margin:0;">${this.escapeHtml(exp.description || '')}</p>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Certifications Section -->
        ${hasCerts ? `
        <section id="dark-certs" class="dark-section">
          <div class="dark-section-title-wrap">
            <span class="dark-section-tag">Verified Credentials</span>
            <h2 class="dark-section-title">Certifications</h2>
          </div>
          <div class="dark-grid-3">
            ${data.certifications.map(cert => `
              <div class="dark-card">
                <i class="bi bi-patch-check-fill" style="color:#38ef7d; font-size:1.5rem; margin-bottom:0.5rem; display:block;"></i>
                <h4 style="font-size:1.05rem; color:#fff; margin-bottom:0.3rem;">${this.escapeHtml(cert.name)}</h4>
                <div style="color:#94a3b8; font-size:0.85rem; margin-bottom:0.75rem;">${this.escapeHtml(cert.organization)} · ${this.escapeHtml(cert.year)}</div>
                ${cert.url ? `<a href="${this.escapeHtml(cert.url)}" target="_blank" rel="noopener" style="color:#ff3344; font-size:0.82rem; font-weight:600;">Verify Badge <i class="bi bi-arrow-right"></i></a>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Contact Section -->
        <section id="dark-contact" class="dark-section" style="text-align: center; max-width: 650px; margin: 0 auto;">
          <span class="dark-section-tag">Let's Connect</span>
          <h2 class="dark-section-title" style="margin-bottom: 1rem;">Start a Conversation</h2>
          <p style="color: #94a3b8; margin-bottom: 2rem;">Interested in working together or discussing potential opportunities? My inbox is always open.</p>
          ${p.email ? `<a href="mailto:${this.escapeHtml(p.email)}" class="btn-red" style="font-size: 1.05rem; padding: 0.8rem 2rem;"><i class="bi bi-envelope-fill"></i> ${this.escapeHtml(p.email)}</a>` : ''}
        </section>
      </div>

      <!-- Footer -->
      <footer class="dark-footer">
        <div class="dark-footer-socials">
          ${social.github ? `<a href="${this.escapeHtml(social.github)}" target="_blank" class="dark-social-btn"><i class="bi bi-github"></i></a>` : ''}
          ${social.linkedin ? `<a href="${this.escapeHtml(social.linkedin)}" target="_blank" class="dark-social-btn"><i class="bi bi-linkedin"></i></a>` : ''}
          ${social.instagram ? `<a href="${this.escapeHtml(social.instagram)}" target="_blank" class="dark-social-btn"><i class="bi bi-instagram"></i></a>` : ''}
          ${social.website ? `<a href="${this.escapeHtml(social.website)}" target="_blank" class="dark-social-btn"><i class="bi bi-globe"></i></a>` : ''}
        </div>
        <p style="color: #64748b; font-size: 0.85rem; margin: 0;">&copy; ${new Date().getFullYear()} ${this.escapeHtml(p.fullName || 'Student Portfolio')}. Built with Personal Portfolio Builder.</p>
      </footer>
    </div>
    `;
    return html;
  },

  // 3. CREATIVE STUDENT RENDERER
  renderCreative(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasEdu = data.education && data.education.length > 0;
    const hasSkills = data.skills && data.skills.length > 0;
    const hasProjects = data.projects && data.projects.length > 0;
    const hasCerts = data.certifications && data.certifications.length > 0;
    const hasExp = data.experience && data.experience.length > 0;
    const social = data.social || {};

    let html = `
    <div class="portfolio-render-root portfolio-template-creative">
      <!-- Creative Hero -->
      <header class="creative-hero">
        <div class="creative-hero-content">
          <div class="creative-avatar-box">
            <img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="creative-avatar" />
          </div>
          <h1>${this.escapeHtml(p.fullName || 'Creative Student')}</h1>
          <span class="creative-badge-title"><i class="bi bi-palette-fill"></i> ${this.escapeHtml(p.title || 'Creator & Innovator')}</span>
          <p class="creative-bio">${this.escapeHtml(p.about || 'Welcome! I craft engaging digital experiences combining design, code, and creative problem solving.')}</p>

          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            ${p.email ? `<a href="mailto:${this.escapeHtml(p.email)}" class="btn-red"><i class="bi bi-envelope-paper-fill"></i> Reach Out</a>` : ''}
            ${social.linkedin ? `<a href="${this.escapeHtml(social.linkedin)}" target="_blank" class="btn-outline-red"><i class="bi bi-linkedin"></i> Connect</a>` : ''}
          </div>
        </div>
      </header>

      <div class="creative-container">
        <!-- Education & Academics -->
        ${hasEdu ? `
        <div class="creative-card">
          <span class="creative-card-badge">Education</span>
          <h2 class="creative-section-title"><i class="bi bi-mortarboard-fill" style="color:#ff3344;"></i> Academic Journey</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            ${data.education.map(edu => `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem;">
                <div style="color:#ff3344; font-weight:700; font-size:0.9rem; margin-bottom:0.3rem;">${this.escapeHtml(edu.startYear)} - ${this.escapeHtml(edu.gradYear)}</div>
                <h3 style="font-size:1.2rem; color:#fff; margin-bottom:0.25rem;">${this.escapeHtml(edu.degree)}</h3>
                <div style="color:#cbd5e1; font-size:0.95rem; margin-bottom:0.5rem;">${this.escapeHtml(edu.department)}</div>
                <div style="color:#94a3b8; font-size:0.9rem;">${this.escapeHtml(edu.institution)}</div>
                ${edu.score ? `<div style="margin-top:0.6rem; color:#ff8a93; font-weight:600; font-size:0.85rem;">Result: ${this.escapeHtml(edu.score)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Skills Gallery -->
        ${hasSkills ? `
        <div class="creative-card">
          <span class="creative-card-badge">Toolkit</span>
          <h2 class="creative-section-title"><i class="bi bi-lightning-charge-fill" style="color:#ff8c42;"></i> Skills & Superpowers</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.8rem;">
            ${data.skills.map(skill => `
              <span style="background: linear-gradient(135deg, rgba(255,51,68,0.15), rgba(255,140,66,0.15)); border: 1px solid rgba(255,80,90,0.3); color:#fff; font-weight:600; padding:0.5rem 1.1rem; border-radius:999px; font-size:0.92rem;">
                ${this.escapeHtml(skill.name)}
                ${skill.level ? `<span style="opacity:0.75; font-size:0.8rem; margin-left:4px;">· ${this.escapeHtml(skill.level)}</span>` : ''}
              </span>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Creative Projects -->
        ${hasProjects ? `
        <div class="creative-card">
          <span class="creative-card-badge">Showcase</span>
          <h2 class="creative-section-title"><i class="bi bi-stars" style="color:#ff3344;"></i> Creative Projects</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            ${data.projects.map(proj => `
              <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 1.6rem; display: flex; flex-direction: column;">
                <h3 style="font-size:1.25rem; color:#fff; margin-bottom:0.5rem;">${this.escapeHtml(proj.name)}</h3>
                <p style="color:#cbd5e1; font-size:0.92rem; flex-grow:1; margin-bottom:1.2rem;">${this.escapeHtml(proj.description)}</p>
                ${proj.technologies ? `<div style="font-size:0.8rem; color:#ff8a93; margin-bottom:1.2rem;">${this.escapeHtml(proj.technologies)}</div>` : ''}
                <div style="display:flex; gap:0.8rem;">
                  ${proj.projectUrl ? `<a href="${this.escapeHtml(proj.projectUrl)}" target="_blank" class="btn-red btn-sm-custom">Demo <i class="bi bi-box-arrow-up-right"></i></a>` : ''}
                  ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" class="btn-ghost-dark btn-sm-custom">Code <i class="bi bi-github"></i></a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Certifications & Experience (Optional) -->
        ${(hasExp || hasCerts) ? `
        <div class="creative-card">
          <span class="creative-card-badge">Milestones</span>
          <h2 class="creative-section-title"><i class="bi bi-trophy-fill" style="color:#ffbd2e;"></i> Experience & Accreditations</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            ${(data.experience || []).map(exp => `
              <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                <div style="color:#ff3344; font-size:0.8rem; font-weight:700;">${this.escapeHtml(exp.duration)}</div>
                <h4 style="color:#fff; font-size:1.1rem; margin:0.25rem 0;">${this.escapeHtml(exp.position)}</h4>
                <div style="color:#94a3b8; font-size:0.9rem;">${this.escapeHtml(exp.company)}</div>
                <p style="color:#cbd5e1; font-size:0.85rem; margin-top:0.5rem;">${this.escapeHtml(exp.description)}</p>
              </div>
            `).join('')}
            ${(data.certifications || []).map(cert => `
              <div style="padding: 1.25rem; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                <span style="color:#10b981; font-size:0.8rem; font-weight:700;">CERTIFIED (${this.escapeHtml(cert.year)})</span>
                <h4 style="color:#fff; font-size:1.05rem; margin:0.25rem 0;">${this.escapeHtml(cert.name)}</h4>
                <div style="color:#94a3b8; font-size:0.9rem;">${this.escapeHtml(cert.organization)}</div>
                ${cert.url ? `<a href="${this.escapeHtml(cert.url)}" target="_blank" style="font-size:0.8rem; color:#ff3344; margin-top:0.4rem; display:inline-block;">Verify <i class="bi bi-box-arrow-up-right"></i></a>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <footer style="text-align: center; padding: 3rem 1.5rem; background: #090a0e; border-top: 1px solid rgba(255,255,255,0.06);">
        <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem;">Created by ${this.escapeHtml(p.fullName || 'Student')} · Crafted with Personal Portfolio Builder</p>
        <div style="display: flex; justify-content: center; gap: 1rem;">
          ${social.github ? `<a href="${this.escapeHtml(social.github)}" target="_blank" style="color:#fff; font-size:1.2rem;"><i class="bi bi-github"></i></a>` : ''}
          ${social.linkedin ? `<a href="${this.escapeHtml(social.linkedin)}" target="_blank" style="color:#fff; font-size:1.2rem;"><i class="bi bi-linkedin"></i></a>` : ''}
          ${social.instagram ? `<a href="${this.escapeHtml(social.instagram)}" target="_blank" style="color:#fff; font-size:1.2rem;"><i class="bi bi-instagram"></i></a>` : ''}
        </div>
      </footer>
    </div>
    `;
    return html;
  },

  // 4. DEVELOPER PORTFOLIO RENDERER
  renderDeveloper(data) {
    const p = data.personal || {};
    const avatar = this.getAvatar(data);
    const hasEdu = data.education && data.education.length > 0;
    const hasSkills = data.skills && data.skills.length > 0;
    const hasProjects = data.projects && data.projects.length > 0;
    const hasCerts = data.certifications && data.certifications.length > 0;
    const hasExp = data.experience && data.experience.length > 0;
    const social = data.social || {};

    let html = `
    <div class="portfolio-render-root portfolio-template-developer">
      <!-- Terminal Window Bar -->
      <div class="dev-window-bar">
        <div class="dev-dots">
          <span class="dot-red"></span>
          <span class="dot-yellow"></span>
          <span class="dot-green"></span>
        </div>
        <div class="dev-prompt-header">bash - user@portfolio:~ (${this.escapeHtml(p.fullName || 'developer')})</div>
        <div style="font-size: 0.75rem; color: #58a6ff;">v2.0.0-release</div>
      </div>

      <div class="dev-container">
        <!-- Hero Terminal Box -->
        <div class="dev-terminal-box">
          <div class="dev-prompt-line">
            <span>$</span> <span>cat</span> <span style="color:#7ee787;">profile.json</span>
          </div>

          <div class="dev-hero-grid">
            <img src="${avatar}" alt="${this.escapeHtml(p.fullName)}" class="dev-avatar" />
            <div>
              <div class="dev-name">${this.escapeHtml(p.fullName || 'Developer Name')}</div>
              <div class="dev-role">&gt; ${this.escapeHtml(p.title || 'Full Stack Engineer')}</div>
              <div class="dev-comment">/* ${this.escapeHtml(p.about || 'Specialized in modern computing, algorithm design, and reliable web architectures.')} */</div>
              
              <div style="font-size: 0.85rem; color: #8b949e; margin-bottom: 1rem;">
                ${p.location ? `<span>📍 ${this.escapeHtml(p.location)}</span> | ` : ''}
                ${p.email ? `<span>✉️ ${this.escapeHtml(p.email)}</span>` : ''}
              </div>

              <div class="dev-badge-grid">
                ${social.github ? `<a href="${this.escapeHtml(social.github)}" target="_blank" class="dev-badge red"><i class="bi bi-github"></i> github</a>` : ''}
                ${social.linkedin ? `<a href="${this.escapeHtml(social.linkedin)}" target="_blank" class="dev-badge"><i class="bi bi-linkedin"></i> linkedin</a>` : ''}
                ${p.email ? `<a href="mailto:${this.escapeHtml(p.email)}" class="dev-badge"><i class="bi bi-envelope"></i> email</a>` : ''}
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Section: $ ./list_skills.sh -->
        ${hasSkills ? `
        <div class="dev-terminal-box">
          <div class="dev-prompt-line">
            <span>$</span> <span>npm</span> <span style="color:#7ee787;">run skills:list</span>
          </div>
          <div class="dev-badge-grid" style="gap: 0.75rem;">
            ${data.skills.map(s => `
              <div class="dev-badge" style="padding: 0.5rem 0.85rem; font-size: 0.9rem;">
                <span style="color:#ff7b72;">const</span> <strong style="color:#f0f6fc;">${this.escapeHtml(s.name)}</strong> = <span style="color:#7ee787;">"${this.escapeHtml(s.level || 'proficient')}"</span>;
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Projects Section: $ git log --projects -->
        ${hasProjects ? `
        <div class="dev-terminal-box">
          <div class="dev-prompt-line">
            <span>$</span> <span>git</span> <span style="color:#7ee787;">showcase --featured</span>
          </div>
          
          <div>
            ${data.projects.map(proj => `
              <div class="dev-project-card">
                <div class="dev-project-header">
                  <div>
                    <i class="bi bi-terminal" style="color:#ff5555; margin-right:6px;"></i>
                    <a href="${this.escapeHtml(proj.projectUrl || proj.githubUrl || '#')}" target="_blank" class="dev-repo-name">${this.escapeHtml(proj.name)}</a>
                  </div>
                  <div style="font-size:0.8rem; color:#8b949e;">Public Repo</div>
                </div>

                <p style="color:#8b949e; font-size:0.9rem; margin-bottom:0.75rem;">${this.escapeHtml(proj.description)}</p>
                
                ${proj.technologies ? `<div style="color:#58a6ff; font-size:0.82rem; margin-bottom:0.85rem;">[Stack: ${this.escapeHtml(proj.technologies)}]</div>` : ''}

                <div style="display:flex; gap:1rem; font-size:0.85rem;">
                  ${proj.projectUrl ? `<a href="${this.escapeHtml(proj.projectUrl)}" target="_blank" style="color:#7ee787;"><i class="bi bi-box-arrow-up-right"></i> Live Deployment</a>` : ''}
                  ${proj.githubUrl ? `<a href="${this.escapeHtml(proj.githubUrl)}" target="_blank" style="color:#58a6ff;"><i class="bi bi-git"></i> Repository</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Education & Academics -->
        ${hasEdu ? `
        <div class="dev-terminal-box">
          <div class="dev-prompt-line">
            <span>$</span> <span>cat</span> <span style="color:#7ee787;">/etc/education.log</span>
          </div>
          <div>
            ${data.education.map(edu => `
              <div style="border-left: 2px solid #30363d; padding-left: 1rem; margin-bottom: 1.25rem;">
                <div style="color:#ff7b72; font-size:0.85rem;">[${this.escapeHtml(edu.startYear)} - ${this.escapeHtml(edu.gradYear)}] ${edu.score ? `:: CGPA/Grade: ${this.escapeHtml(edu.score)}` : ''}</div>
                <div style="color:#f0f6fc; font-weight:700; font-size:1.1rem;">${this.escapeHtml(edu.degree)} ${edu.department ? `- ${this.escapeHtml(edu.department)}` : ''}</div>
                <div style="color:#8b949e; font-size:0.92rem;">${this.escapeHtml(edu.institution)}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Experience & Internships (Optional) -->
        ${hasExp ? `
        <div class="dev-terminal-box">
          <div class="dev-prompt-line">
            <span>$</span> <span>ps</span> <span style="color:#7ee787;">aux | grep experience</span>
          </div>
          <div>
            ${data.experience.map(exp => `
              <div style="border-left: 2px solid #58a6ff; padding-left: 1rem; margin-bottom: 1.25rem;">
                <div style="color:#7ee787; font-size:0.85rem;">${this.escapeHtml(exp.duration)}</div>
                <div style="color:#f0f6fc; font-weight:700; font-size:1.05rem;">${this.escapeHtml(exp.position)} @ ${this.escapeHtml(exp.company)}</div>
                <div style="color:#8b949e; font-size:0.9rem; margin-top:0.25rem;">${this.escapeHtml(exp.description)}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Certifications -->
        ${hasCerts ? `
        <div class="dev-terminal-box">
          <div class="dev-prompt-line">
            <span>$</span> <span>gpg</span> <span style="color:#7ee787;">--verify certifications.sig</span>
          </div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
            ${data.certifications.map(cert => `
              <div style="background:#0d1117; border:1px solid #30363d; border-radius:4px; padding:1rem;">
                <div style="color:#7ee787; font-size:0.8rem;">[VALIDATED ${this.escapeHtml(cert.year)}]</div>
                <div style="color:#f0f6fc; font-weight:700; font-size:0.95rem; margin:0.2rem 0;">${this.escapeHtml(cert.name)}</div>
                <div style="color:#8b949e; font-size:0.85rem;">${this.escapeHtml(cert.organization)}</div>
                ${cert.url ? `<a href="${this.escapeHtml(cert.url)}" target="_blank" style="color:#58a6ff; font-size:0.8rem; margin-top:0.4rem; display:inline-block;">Key / Link <i class="bi bi-box-arrow-up-right"></i></a>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div style="background:#161b22; border-top:1px solid #30363d; padding:2rem 1.5rem; text-align:center; color:#8b949e; font-size:0.85rem;">
        <div>/* Process finished with exit code 0. &copy; ${new Date().getFullYear()} ${this.escapeHtml(p.fullName || 'Developer')} */</div>
      </div>
    </div>
    `;
    return html;
  },

  // Main render dispatcher
  render(templateId, data) {
    switch (templateId) {
      case 'minimal-professional':
        return this.renderMinimal(data);
      case 'creative-student':
        return this.renderCreative(data);
      case 'developer-portfolio':
        return this.renderDeveloper(data);
      case 'modern-dark':
      default:
        return this.renderDark(data);
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
