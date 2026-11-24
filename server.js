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

// Streamlined Professional Student Demo Data
app.get('/api/demo-data', (req, res) => {
  const demoData = {
    template: 'corporate',
    personal: {
      fullName: 'Alexander Vance',
      title: 'Computer Science Undergraduate & Software Engineering Aspirant',
      email: 'alexander.vance@university.edu',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/alexander-vance',
      github: 'https://github.com/alexander-vance',
      website: 'https://alexandervance.dev',
      summary: 'Results-driven Computer Science undergraduate with a solid foundation in software design, algorithmic optimization, and full-stack web engineering. Demonstrated success developing real-time collaborative web tools and optimizing backend data pipelines. Eager to contribute technical rigour, collaborative energy, and clean code practices to a dynamic engineering team.'
    },
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        department: 'EECS & Data Science',
        university: 'University of California System',
        studyPeriod: '2022 - 2026',
        gradYear: '2026',
        score: '3.91 / 4.00 CGPA',
        highlight: 'Dean’s Academic Honors List (consecutive semesters); Coursework in Distributed Systems, Algorithms, and Database Management.'
      },
      {
        institution: 'Silicon Valley STEM Academy',
        degree: 'High School Diploma (Science & Mathematics)',
        department: 'Science & Computer Applications',
        university: 'State Board of Education',
        studyPeriod: '2018 - 2022',
        gradYear: '2022',
        score: '96.4%',
        highlight: 'Academic Valedictorian; National Science Olympiad Finalist.'
      }
    ],
    skills: [
      { name: 'JavaScript', category: 'Programming Languages' },
      { name: 'TypeScript', category: 'Programming Languages' },
      { name: 'Python', category: 'Programming Languages' },
      { name: 'Java', category: 'Programming Languages' },
      { name: 'React.js', category: 'Web Technologies' },
      { name: 'HTML5 & CSS3', category: 'Web Technologies' },
      { name: 'Node.js', category: 'Frameworks' },
      { name: 'Express.js', category: 'Frameworks' },
      { name: 'Next.js', category: 'Frameworks' },
      { name: 'PostgreSQL', category: 'Databases' },
      { name: 'MongoDB', category: 'Databases' },
      { name: 'Git & GitHub', category: 'Software and Tools' },
      { name: 'Docker', category: 'Software and Tools' },
      { name: 'Problem Solving', category: 'Professional Skills' },
      { name: 'Agile Teamwork', category: 'Professional Skills' }
    ],
    languages: [
      { name: 'English', proficiency: 'Native' },
      { name: 'Spanish', proficiency: 'Intermediate' }
    ],
    projects: [
      {
        name: 'Enterprise Campus Collaboration Portal',
        description: 'Architected and implemented a high-performance web platform that synchronizes academic resource sharing, peer workspace channels, and student project management across university departments.',
        technologies: 'React.js, Node.js, Express, PostgreSQL, Redis, Docker',
        githubUrl: 'https://github.com/alexander-vance/campus-collab',
        liveUrl: 'https://campus-collab.demo.edu'
      },
      {
        name: 'Automated Academic Assessment Assistant',
        description: 'An AI-augmented web service that processes lecture transcriptions and study guides to generate adaptive diagnostic quizzes, conceptual summaries, and review flashcards.',
        technologies: 'Python, FastAPI, Gemini API, React, Tailwind CSS',
        githubUrl: 'https://github.com/alexander-vance/assessment-assistant',
        liveUrl: 'https://assessment-assistant.demo.edu'
      }
    ],
    experience: [
      {
        organization: 'Vanguard Enterprise Systems',
        position: 'Software Engineering Intern',
        duration: 'June 2024 - August 2024',
        description: 'Collaborated in an Agile team of 8 engineers developing customer-facing dashboard features. Optimized data caching mechanisms, decreasing initial load times by 26% and increasing unit test coverage to 88%.'
      },
      {
        organization: 'University Computer Science Department',
        position: 'Undergraduate Teaching Assistant',
        duration: 'January 2024 - May 2024',
        description: 'Instructed weekly laboratory sessions covering asymptotic complexity, binary trees, dynamic programming, and graph algorithms for over 70 undergraduate students.'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner',
        organization: 'Amazon Web Services',
        year: '2024',
        credentialUrl: 'https://aws.amazon.com/verification'
      },
      {
        name: 'Meta Front-End Developer Professional Certificate',
        organization: 'Meta / Coursera',
        year: '2024',
        credentialUrl: 'https://coursera.org/verify/meta-frontend'
      },
      {
        name: 'First Place Winner — University Hackathon 2024',
        organization: 'UC Berkeley Engineering Council',
        year: '2024',
        credentialUrl: ''
      }
    ],
    additional: {
      interests: 'Technical Writing, Open Source Contributing, Competitive Chess, Marathon Training',
      activities: 'Technical Lead at Computer Science Student Society; Mentored 300+ students in peer programming cohorts.',
      workshops: 'Microservices with Kubernetes Intensive (16 hours, GDG); OWASP Application Security Training (8 hours).'
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
  console.log(`Professional Portfolio Builder Server Running`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log(`Homepage:  http://localhost:${PORT}/`);
  console.log(`Builder:   http://localhost:${PORT}/create`);
  console.log(`Templates: http://localhost:${PORT}/templates`);
  console.log(`Preview:   http://localhost:${PORT}/preview`);
  console.log(`====================================================`);
});
