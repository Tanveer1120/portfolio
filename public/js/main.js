/**
 * Main Site Script - Homepage & Navigation Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navbar Toggle close on link click
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.querySelector('.navbar-collapse');
  if (navCollapse) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.bootstrap && bootstrap.Collapse) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  // Interactive Live Template Preview Modal
  window.openTemplatePreview = function(templateId) {
    const modalEl = document.getElementById('templatePreviewModal');
    const modalTitle = document.getElementById('modalTemplateTitle');
    const modalContainer = document.getElementById('modalTemplateContainer');
    const modalUseBtn = document.getElementById('modalUseTemplateBtn');

    if (!modalEl || !modalContainer) return;

    // Sample data to preview
    const previewData = {
      template: templateId,
      personal: {
        fullName: 'Alex Vance',
        title: 'Computer Science Student & Full-Stack Engineer',
        email: 'alex.vance@university.edu',
        phone: '+1 (555) 019-2834',
        location: 'California, USA',
        about: 'Passionate student technologist focused on clean architectural design, scalable microservices, and reactive web applications.'
      },
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'B.S. in Computer Science',
          department: 'EECS',
          startYear: '2022',
          gradYear: '2026',
          score: '3.92 CGPA'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 'Advanced' },
        { name: 'Python', level: 'Advanced' },
        { name: 'React.js', level: 'Advanced' },
        { name: 'Node.js', level: 'Intermediate' },
        { name: 'SQL', level: 'Intermediate' }
      ],
      projects: [
        {
          name: 'StudySync Campus Hub',
          description: 'A collaborative real-time study platform for university students featuring synchronized markdown whiteboards.',
          technologies: 'React, Node.js, WebSockets',
          projectUrl: 'https://example.com/demo',
          githubUrl: 'https://github.com/example/studysync'
        },
        {
          name: 'AI Tutor & Quiz Engine',
          description: 'Interactive exam prep assistant that converts lecture notes into flashcards and automated quizzes.',
          technologies: 'Python, FastAPI, OpenAI, React',
          projectUrl: 'https://example.com/ai-tutor',
          githubUrl: 'https://github.com/example/ai-tutor'
        }
      ],
      certifications: [
        {
          name: 'AWS Cloud Practitioner',
          organization: 'Amazon Web Services',
          year: '2024',
          url: 'https://aws.amazon.com'
        }
      ],
      experience: [
        {
          company: 'Vanguard Software Labs',
          position: 'Software Engineering Intern',
          duration: 'Summer 2024',
          description: 'Engineered responsive frontend modules and optimized API performance.'
        }
      ],
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com'
      }
    };

    // Set title
    const templateMeta = (window.PortfolioTemplates && window.PortfolioTemplates.catalog.find(t => t.id === templateId)) || { name: 'Template Preview' };
    if (modalTitle) modalTitle.textContent = `${templateMeta.name} — Live Preview`;

    // Render preview HTML
    if (window.PortfolioTemplates) {
      modalContainer.innerHTML = window.PortfolioTemplates.render(templateId, previewData);
    }

    // Set "Use This Template" link
    if (modalUseBtn) {
      modalUseBtn.href = `/create?template=${templateId}`;
    }

    // Show modal
    if (window.bootstrap && bootstrap.Modal) {
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  };

  // Homepage Hero Mockup interactive rotation
  const heroMockup = document.querySelector('.mockup-card');
  if (heroMockup) {
    let templates = ['modern-dark', 'minimal-professional', 'creative-student', 'developer-portfolio'];
    let idx = 0;
    heroMockup.addEventListener('click', () => {
      idx = (idx + 1) % templates.length;
      const previewAddress = document.querySelector('.mockup-address');
      if (previewAddress) {
        previewAddress.textContent = `portfolio.local/${templates[idx]}`;
      }
    });
  }
});
