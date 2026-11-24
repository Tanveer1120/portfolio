/**
 * Main Site Script - Professional Homepage & Navigation Interactions
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

    // Professional sample data to preview
    const previewData = {
      category: 'Computer Science / IT',
      template: templateId,
      personal: {
        fullName: 'Alexander Vance',
        title: 'Computer Science Undergraduate & Software Engineering Aspirant',
        email: 'alexander.vance@university.edu',
        phone: '+1 (555) 234-5678',
        city: 'San Francisco',
        state: 'CA',
        linkedin: 'https://linkedin.com/in/alexander-vance',
        github: 'https://github.com/alexander-vance',
        summary: 'Results-driven Computer Science student with a strong academic foundation in software design, algorithms, and distributed systems. Committed to building robust, accessible, and scalable digital solutions.'
      },
      careerObjective: 'Aspiring Software Engineer seeking an internship or entry-level software development role to contribute to high-impact enterprise engineering initiatives.',
      education: [
        {
          institution: 'University of California, Berkeley',
          universityName: 'University of California System',
          degree: 'Bachelor of Science in Computer Science',
          department: 'EECS',
          startYear: '2022',
          gradYear: '2026',
          score: '3.91 CGPA',
          coursework: 'Data Structures, Algorithms, Computer Systems Architecture, Database Management Systems'
        }
      ],
      skills: {
        programmingLanguages: 'JavaScript, TypeScript, Python, Java, C++',
        frontend: 'React.js, Next.js, HTML5, CSS3, Tailwind CSS',
        backend: 'Node.js, Express.js, RESTful API Design',
        databases: 'PostgreSQL, MongoDB',
        tools: 'Git, GitHub, Docker, Linux/Unix CLI'
      },
      projects: [
        {
          name: 'Enterprise Campus Collab Portal',
          description: 'A high-performance web platform that synchronizes academic resource sharing and project collaboration.',
          technologies: 'React, Node.js, Express, PostgreSQL',
          githubUrl: 'https://github.com/alexander-vance/campus-collab',
          liveUrl: 'https://campus-collab.demo.edu',
          duration: '4 Months (Spring 2024)'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Cloud Practitioner',
          organization: 'Amazon Web Services',
          issueDate: 'July 2024',
          credentialId: 'AWS-CCP-98721345'
        }
      ],
      achievements: [
        {
          title: 'First Place Winner — University Hackathon 2024',
          description: 'Led a four-member engineering team to build an accessibility-first student locator.',
          date: 'April 2024'
        }
      ]
    };

    // Set title
    const templateMeta = (window.PortfolioTemplates && window.PortfolioTemplates.catalog.find(t => t.id === templateId)) || { name: 'Template Preview' };
    if (modalTitle) modalTitle.textContent = `${templateMeta.name} — Live A4 Preview`;

    // Render preview HTML
    if (window.PortfolioTemplates) {
      modalContainer.innerHTML = window.PortfolioTemplates.render(templateId, previewData);
    }

    // Set "Use This Template" link
    if (modalUseBtn) {
      modalUseBtn.href = `/create?template=${templateId}`;
    }

    // Show modal via Bootstrap 5
    if (window.bootstrap && bootstrap.Modal) {
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  };
});
