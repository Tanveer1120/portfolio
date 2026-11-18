const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

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

// Demo Data API - Sample Student Profile for 1-Click Instant Testing
app.get('/api/demo-data', (req, res) => {
  const demoData = {
    template: 'modern-dark',
    personal: {
      fullName: 'Alex Vance',
      title: 'Aspiring Full-Stack Software Engineer & AI Enthusiast',
      email: 'alex.vance@university.edu',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      dob: '2003-08-15',
      about: 'Passionate Computer Science student with a deep interest in distributed systems, modern web engineering, and machine learning. Proven track record of building performant web applications, collaborating on open-source repositories, and winning university hackathons. Dedicated to writing clean, maintainable code that solves real-world challenges.'
    },
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        department: 'Computer Science & Data Science',
        startYear: '2022',
        gradYear: '2026',
        score: '3.92 / 4.00 CGPA'
      },
      {
        institution: 'Silicon Valley STEM Academy',
        degree: 'High School Diploma',
        department: 'Science & Advanced Mathematics',
        startYear: '2018',
        gradYear: '2022',
        score: '96.5%'
      }
    ],
    skills: [
      { name: 'JavaScript (ES6+)', level: 'Advanced', category: 'Frontend' },
      { name: 'React.js', level: 'Advanced', category: 'Frontend' },
      { name: 'Node.js & Express', level: 'Intermediate', category: 'Backend' },
      { name: 'Python', level: 'Advanced', category: 'Backend' },
      { name: 'HTML5 & Modern CSS3', level: 'Advanced', category: 'Frontend' },
      { name: 'Tailwind CSS / Bootstrap', level: 'Advanced', category: 'Frontend' },
      { name: 'PostgreSQL & MongoDB', level: 'Intermediate', category: 'Database' },
      { name: 'Git & GitHub', level: 'Advanced', category: 'Tools' },
      { name: 'Docker', level: 'Intermediate', category: 'DevOps' },
      { name: 'REST APIs & GraphQL', level: 'Intermediate', category: 'Backend' }
    ],
    projects: [
      {
        name: 'StudySync - Collaborative Campus Study Rooms',
        description: 'Real-time collaborative study platform featuring peer video breakout rooms, shared markdown notes, synchronized whiteboard canvas, and smart Pomodoro study sessions.',
        technologies: 'React, Node.js, WebSockets, WebRTC, Tailwind CSS',
        projectUrl: 'https://studysync-demo.example.com',
        githubUrl: 'https://github.com/example/studysync'
      },
      {
        name: 'AI Smart Tutor & Exam Prep Agent',
        description: 'An AI-powered web assistant that parses lecture notes and textbook PDFs to generate interactive flashcards, practice quizzes, and conceptual summaries.',
        technologies: 'Python, FastAPI, Gemini API, React, ChromaDB',
        projectUrl: 'https://ai-tutor.example.com',
        githubUrl: 'https://github.com/example/ai-tutor-agent'
      },
      {
        name: 'CampusPulse - Student Events & Club Hub',
        description: 'A mobile-friendly responsive web portal connecting university students with active club events, RSVP tracking, automated calendar sync, and ticket bookings.',
        technologies: 'Express.js, MongoDB, Bootstrap 5, Leaflet Maps',
        projectUrl: 'https://campuspulse.example.com',
        githubUrl: 'https://github.com/example/campus-pulse'
      }
    ],
    certifications: [
      {
        name: 'Meta Front-End Developer Professional Certificate',
        organization: 'Meta / Coursera',
        year: '2024',
        url: 'https://coursera.org/verify/meta-frontend'
      },
      {
        name: 'AWS Certified Cloud Practitioner',
        organization: 'Amazon Web Services',
        year: '2024',
        url: 'https://aws.amazon.com/verification'
      },
      {
        name: 'Google IT Automation with Python',
        organization: 'Google',
        year: '2023',
        url: 'https://coursera.org/verify/google-python'
      }
    ],
    experience: [
      {
        company: 'Vanguard Tech Labs',
        position: 'Software Engineering Intern',
        duration: 'June 2024 - August 2024',
        description: 'Engineered responsive UI components using React and styled-components. Optimized client bundle size by 28% and integrated 12+ REST endpoints with automated unit test suites.'
      },
      {
        company: 'University Computer Science Department',
        position: 'Undergraduate Teaching Assistant (Data Structures)',
        duration: 'Jan 2024 - May 2024',
        description: 'Mentored 75+ students on binary search trees, graph algorithms, and time complexity analysis. Led bi-weekly laboratory sessions and graded programming assignments.'
      }
    ],
    social: {
      github: 'https://github.com/alexvance-student',
      linkedin: 'https://linkedin.com/in/alexvance-student',
      instagram: 'https://instagram.com/alexvance.codes',
      website: 'https://alexvance.dev',
      twitter: 'https://x.com/alexvance_dev'
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
  console.log(`🚀 Personal Portfolio Generator Server is running!`);
  console.log(`📍 Local URL: http://localhost:${PORT}`);
  console.log(`✨ Homepage:  http://localhost:${PORT}/`);
  console.log(`📝 Builder:   http://localhost:${PORT}/create`);
  console.log(`🎨 Templates: http://localhost:${PORT}/templates`);
  console.log(`👁️ Preview:   http://localhost:${PORT}/preview`);
  console.log(`====================================================`);
});
