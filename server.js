const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// View Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'create.html'));
});

app.get('/templates', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'templates.html'));
});

app.get('/preview', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'preview.html'));
});

// Comprehensive Professional Student Demo Data
app.get('/api/demo-data', (req, res) => {
  const demoData = {
    category: 'Computer Science / IT',
    template: 'corporate-professional',
    personal: {
      fullName: 'Alexander Vance',
      title: 'Computer Science Undergraduate & Software Engineering Aspirant',
      email: 'alexander.vance@university.edu',
      phone: '+1 (555) 234-5678',
      city: 'San Francisco',
      state: 'CA',
      linkedin: 'https://linkedin.com/in/alexander-vance',
      github: 'https://github.com/alexander-vance',
      website: 'https://alexandervance.dev',
      summary: 'Results-driven Computer Science student with a strong academic foundation in software design, algorithms, and distributed systems. Demonstrated experience in full-stack web development through production-ready university projects and engineering internships. Committed to building robust, accessible, and scalable digital solutions while continuously expanding technical expertise.'
    },
    careerObjective: 'Aspiring Software Engineer seeking a challenging internship or entry-level software development role. Eager to leverage hands-on proficiency in modern web frameworks, system architecture, and cloud services to contribute to high-impact enterprise engineering initiatives.',
    education: [
      {
        institution: 'University of California, Berkeley',
        universityName: 'University of California System',
        degree: 'Bachelor of Science in Computer Science',
        department: 'Department of Electrical Engineering and Computer Sciences',
        startYear: '2022',
        gradYear: '2026',
        score: '3.91 / 4.00 CGPA',
        coursework: 'Data Structures, Algorithms, Computer Systems Architecture, Database Management Systems, Software Engineering Principles, Artificial Intelligence'
      },
      {
        institution: 'Silicon Valley STEM Academy',
        universityName: 'State Board of Secondary Education',
        degree: 'High School Diploma (Science & Mathematics)',
        department: 'Science & Computer Applications',
        startYear: '2018',
        gradYear: '2022',
        score: '96.4%',
        coursework: 'Advanced Mathematics, Physics, Chemistry, Computer Science with Java'
      }
    ],
    skills: {
      programmingLanguages: 'JavaScript, TypeScript, Python, Java, C++',
      frontend: 'React.js, Next.js, HTML5, CSS3, Tailwind CSS, Bootstrap 5',
      backend: 'Node.js, Express.js, RESTful API Design, GraphQL',
      frameworks: 'FastAPI, Spring Boot (Basics), Jest',
      databases: 'PostgreSQL, MySQL, MongoDB, Redis',
      tools: 'Git, GitHub, Docker, Postman, Linux/Unix CLI, VS Code',
      softwareSkills: 'Figma, Jira, Confluence, Microsoft Office Suite',
      softSkills: 'Analytical Problem Solving, Technical Communication, Team Collaboration, Project Leadership, Agile Methodologies',
      otherSkills: 'CI/CD Pipelines, System Optimization, Unit Testing'
    },
    projects: [
      {
        name: 'Enterprise Campus Collab Portal',
        description: 'Architected and implemented a high-performance web platform that synchronizes academic resource sharing, peer collaboration, and student project management across campus departments.',
        problemStatement: 'Students lacked a centralized, real-time repository to discover cross-disciplinary research partners and manage project milestones effectively.',
        solution: 'Engineered an event-driven web portal with modular workspace channels, role-based access controls, and automated document indexing.',
        technologies: 'React, Node.js, Express, PostgreSQL, Redis, Docker',
        contribution: 'Designed database schema, implemented REST endpoints with JWT authentication, and built interactive dashboard views.',
        duration: '4 Months (Spring 2024)',
        githubUrl: 'https://github.com/alexander-vance/campus-collab',
        liveUrl: 'https://campus-collab.demo.edu'
      },
      {
        name: 'Automated Academic Assessment Assistant',
        description: 'An AI-augmented web service that processes curriculum notes and lecture transcriptions to generate adaptive diagnostic quizzes and conceptual progress reviews.',
        problemStatement: 'Undergraduate students spend excessive revision hours manually compiling practice assessments from dense multi-chapter syllabi.',
        solution: 'Integrated natural language extraction pipelines with interactive flashcard assessment modules and scoring analytics.',
        technologies: 'Python, FastAPI, Gemini API, React, Tailwind CSS',
        contribution: 'Built backend ingestion pipeline, prompt orchestration logic, and responsive user quiz interface.',
        duration: '3 Months (Fall 2023)',
        githubUrl: 'https://github.com/alexander-vance/academic-assessment-ai',
        liveUrl: 'https://assessment-ai.demo.edu'
      }
    ],
    experience: [
      {
        organization: 'Vanguard Enterprise Systems',
        position: 'Software Engineering Intern',
        experienceType: 'Internship',
        startDate: 'June 2024',
        endDate: 'August 2024',
        responsibilities: 'Collaborated within an Agile engineering team of 8 to develop client-facing portal features. Optimized frontend data fetching mechanisms and refactored reusable UI component libraries.',
        achievements: 'Decreased initial dashboard bundle loading latency by 26% and authored automated unit tests elevating test coverage to 88%.'
      },
      {
        organization: 'University Computer Science Division',
        position: 'Undergraduate Teaching Assistant (Data Structures)',
        experienceType: 'Academic Assistantship',
        startDate: 'January 2024',
        endDate: 'May 2024',
        responsibilities: 'Instructed weekly laboratory sessions covering asymptotic complexity, binary search trees, dynamic programming, and graph algorithms for over 70 undergraduate students.',
        achievements: 'Conducted weekly office hours and evaluated midterm programming assignments with detailed code quality feedback.'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner (CLF-C02)',
        organization: 'Amazon Web Services',
        issueDate: 'July 2024',
        credentialId: 'AWS-CCP-98721345',
        credentialUrl: 'https://aws.amazon.com/verification'
      },
      {
        name: 'Meta Front-End Developer Professional Certificate',
        organization: 'Meta / Coursera',
        issueDate: 'March 2024',
        credentialId: 'META-FED-554192',
        credentialUrl: 'https://coursera.org/verify/meta-frontend'
      }
    ],
    achievements: [
      {
        title: 'First Place Winner — University Hackathon 2024',
        description: 'Led a four-member engineering team to build an accessibility-first student resource locator among 65 competing teams.',
        date: 'April 2024',
        organization: 'UC Berkeley Engineering Council'
      },
      {
        title: 'Dean’s Academic Honors List',
        description: 'Recognized for consecutive semesters of academic distinction maintaining a CGPA above 3.90.',
        date: '2022 - 2024',
        organization: 'College of Engineering'
      }
    ],
    workshops: [
      {
        name: 'Modern Cloud Architecture & Microservices Intensive',
        organization: 'Google Developer Student Clubs',
        date: 'October 2023',
        description: 'Comprehensive 16-hour technical training covering containerization with Docker, Kubernetes cluster orchestration, and resilient microservices patterns.'
      },
      {
        name: 'Secure Coding & Application Vulnerability Mitigation',
        organization: 'OWASP Student Chapter',
        date: 'February 2024',
        description: 'Practical training on identifying and preventing OWASP Top 10 web application vulnerabilities through automated code reviews and defensive design.'
      }
    ],
    extracurriculars: [
      {
        title: 'Technical Lead — Computer Science Student Society',
        category: 'Leadership & Student Clubs',
        description: 'Organized 8 technical speaker seminars, coding workshops, and peer mentoring cohorts reaching over 300 undergraduate members.'
      },
      {
        title: 'STEM Outreach Volunteer',
        category: 'Volunteering',
        description: 'Mentored local high school students in introductory Python programming and fundamentals of algorithmic thinking.'
      }
    ],
    additionalInfo: {
      languages: 'English (Native/Fluent), Spanish (Professional Working Proficiency)',
      hobbies: 'Technical Writing, Open Source Contributing, Chess, Marathon Training',
      publications: 'Vance, A. (2024). "Optimizing Client-Side State Hydration in Asynchronous Academic Portals." University Student Journal of Computing, 12(2), 45-52.',
      references: 'Available upon professional request.'
    }
  };

  res.json({ success: true, data: demoData });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Professional Student Portfolio Generator Server Running`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Homepage:  http://localhost:${PORT}/`);
  console.log(`Builder:   http://localhost:${PORT}/create`);
  console.log(`Templates: http://localhost:${PORT}/templates`);
  console.log(`Preview:   http://localhost:${PORT}/preview`);
  console.log(`====================================================`);
});
