const http = require('http');
const assert = require('assert');

// Test PortfolioTemplates engine
const PortfolioTemplates = require('./public/js/templates.js');
const PortfolioGenerator = require('./public/js/generator.js');

console.log('🧪 Starting Automated Testing Suite for Redesigned Personal Portfolio Website...\n');

// 1. UNIT TEST: Templates Engine Tests (All 5 Professional Templates)
console.log('🔹 [Test 1] Testing PortfolioTemplates Registry & Rendering for 5 Professional Templates...');
assert(PortfolioTemplates.catalog.length === 5, `Should have exactly 5 curated templates, found ${PortfolioTemplates.catalog.length}`);

const testData = {
  category: 'Computer Science / IT',
  template: 'corporate-professional',
  personal: {
    fullName: 'Jane Doe <script>alert(1)</script>',
    title: 'Software Developer',
    email: 'jane.doe@university.edu',
    phone: '+1 (555) 987-6543',
    city: 'Boston',
    state: 'MA',
    summary: 'Dedicated computer science student with a passion for scalable architectures.'
  },
  careerObjective: 'Aspiring software developer eager to contribute to enterprise cloud platforms.',
  education: [
    {
      institution: 'MIT',
      degree: 'B.S. in Computer Science',
      department: 'EECS',
      startYear: '2022',
      gradYear: '2026',
      score: '4.0 CGPA',
      coursework: 'Algorithms, Data Structures, Computer Architecture'
    }
  ],
  skills: {
    programmingLanguages: 'JavaScript, TypeScript, Python',
    frontend: 'React.js, HTML5, CSS3',
    backend: 'Node.js, Express.js'
  },
  projects: [
    {
      name: 'Campus Resource Hub',
      description: 'Collaborative student portal for sharing research and notes.',
      problemStatement: 'Siloed academic resources.',
      solution: 'Centralized indexing and access control.',
      technologies: 'Node.js, Express, React, PostgreSQL',
      duration: '3 Months',
      githubUrl: 'https://github.com/example/repo',
      liveUrl: 'https://demo.example.com'
    }
  ],
  experience: [
    {
      organization: 'Tech Innovations Corp',
      position: 'Frontend Engineering Intern',
      experienceType: 'Internship',
      startDate: 'June 2024',
      endDate: 'August 2024',
      responsibilities: 'Built responsive UI modules with React.'
    }
  ],
  certifications: [
    {
      name: 'AWS Cloud Practitioner',
      organization: 'Amazon Web Services',
      issueDate: '2024'
    }
  ],
  achievements: [
    {
      title: 'Dean’s Honor List',
      description: 'Awarded for academic excellence',
      date: '2023'
    }
  ],
  workshops: [
    {
      name: 'Microservices Design Workshop',
      organization: 'Tech Club',
      date: '2024',
      description: 'In-depth coverage of Docker and Kubernetes.'
    }
  ],
  extracurriculars: [
    {
      title: 'Student Society Lead',
      category: 'Leadership',
      description: 'Organized campus tech conferences.'
    }
  ],
  additionalInfo: {
    languages: 'English (Fluent), French (Intermediate)',
    hobbies: 'Chess, Technical Blogging'
  }
};

const templates = [
  'corporate',
  'minimal',
  'developer',
  'academic',
  'modern-professional',
  'corporate-professional',
  'modern-minimal',
  'developer-portfolio',
  'academic-portfolio',
  'professional-creative'
];

templates.forEach(tmpl => {
  const rendered = PortfolioTemplates.render(tmpl, testData);
  assert(rendered && rendered.length > 500, `Template ${tmpl} should generate substantial HTML`);
  assert(rendered.includes('Jane Doe &lt;script&gt;alert(1)&lt;/script&gt;'), `Template ${tmpl} must safely escape XSS characters`);
  assert(rendered.includes('Software Developer'), `Template ${tmpl} must contain professional title`);
  assert(rendered.includes('MIT'), `Template ${tmpl} must contain education institution`);
  assert(rendered.includes('Campus Resource Hub'), `Template ${tmpl} must contain project title`);
  console.log(`  ✅ Template '${tmpl}' rendered and validated successfully.`);
});

// 2. UNIT TEST: Empty Optional Sections Graceful Handling
console.log('\n🔹 [Test 2] Testing Graceful Omission of Empty Optional Sections...');
const minimalData = {
  template: 'corporate',
  personal: {
    fullName: 'Minimal Candidate'
  },
  education: [],
  skills: [],
  languages: [],
  projects: [],
  experience: [],
  certifications: [],
  additional: {}
};

['corporate', 'minimal', 'developer', 'academic', 'modern-professional'].forEach(tmpl => {
  const html = PortfolioTemplates.render(tmpl, minimalData);
  assert(html && html.includes('Minimal Candidate'), `Template ${tmpl} must render candidate name even with all optional fields empty`);
  assert(!html.includes('Certifications</div>'), `${tmpl}: Should omit certifications section when empty`);
  assert(!html.includes('Internships &amp; Experience</div>'), `${tmpl}: Should omit experience section when empty`);
  console.log(`  ✅ Template '${tmpl}' generates successfully with all optional fields empty.`);
});
console.log('  ✅ Empty optional sections omitted smoothly without broken markup.');

// 2b. UNIT TEST: Executive Two-Column PDF Architecture (Reference Design)
console.log('\n🔹 [Test 2b] Testing Reference Executive Two-Column A4 PDF Layout Generator...');
const pdfHtml = PortfolioGenerator.renderExecutivePdfTemplate(testData);
assert(pdfHtml.includes('executive-pdf-wrapper'), 'PDF must generate executive-pdf-wrapper container');
assert(pdfHtml.includes('executive-pdf-sidebar'), 'PDF must generate left sidebar');
assert(pdfHtml.includes('executive-pdf-main'), 'PDF must generate right main column');
assert(pdfHtml.includes('executive-pdf-photo-container'), 'PDF must generate framed circular profile photo container');
assert(pdfHtml.includes('JANE DOE'), 'PDF candidate name must be uppercase in left sidebar header');
assert(pdfHtml.includes('SOFTWARE DEVELOPER'), 'PDF professional title must be present');
assert(pdfHtml.includes('Contact Me'), 'PDF sidebar must have Contact Me section');
assert(pdfHtml.includes('Education'), 'PDF sidebar must have Education section with MIT');
assert(pdfHtml.includes('MIT'), 'PDF sidebar education must contain MIT');
assert(pdfHtml.includes('executive-pdf-skill-badge'), 'PDF sidebar must render skill badges');
assert(pdfHtml.includes('JavaScript'), 'PDF sidebar must include skills');
assert(pdfHtml.includes('English (Fluent)'), 'PDF sidebar must include languages');
assert(pdfHtml.includes('About Me'), 'PDF main section must include About Me');
assert(pdfHtml.includes('Job Experience'), 'PDF main section must include Job Experience');
assert(pdfHtml.includes('Tech Innovations Corp'), 'PDF main section must include experience organization');
assert(pdfHtml.includes('Projects'), 'PDF main section must include Projects');
assert(pdfHtml.includes('Campus Resource Hub'), 'PDF main section must include project name');
assert(pdfHtml.includes('Certifications &amp; Achievements'), 'PDF main section must include Certifications');
console.log('  ✅ Executive Two-Column A4 PDF layout generated with all reference sections matching specifications.');

// Test empty fields handling in PDF template
const minimalPdfHtml = PortfolioGenerator.renderExecutivePdfTemplate(minimalData);
assert(minimalPdfHtml.includes('MINIMAL CANDIDATE'), 'Minimal PDF must include uppercase candidate name');
assert(!minimalPdfHtml.includes('executive-pdf-edu-card'), 'Minimal PDF must omit empty education cards');
assert(!minimalPdfHtml.includes('Job Experience</span>'), 'Minimal PDF must omit empty experience section');
assert(!minimalPdfHtml.includes('Projects</span>'), 'Minimal PDF must omit empty projects section');
assert(!minimalPdfHtml.includes('Certifications &amp; Achievements</span>'), 'Minimal PDF must omit empty certifications');
console.log('  ✅ Minimal PDF cleanly omits empty optional sections without blank boxes.');

// 3. INTEGRATION TEST: HTTP Server Endpoints
console.log('\n🔹 [Test 3] Testing HTTP Server Routes...');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', err => reject(err));
  });
}

async function runHttpTests() {
  const routes = ['/', '/create', '/templates', '/preview', '/api/health', '/api/demo-data'];

  for (const route of routes) {
    const res = await makeRequest(route);
    assert(res.statusCode === 200, `Route ${route} should return status 200, got ${res.statusCode}`);
    console.log(`  ✅ Route '${route}' returned status 200 OK.`);
  }

  // Verify demo data content
  const demoRes = await makeRequest('/api/demo-data');
  const demoJson = JSON.parse(demoRes.data);
  assert(demoJson.success === true, 'Demo data API should return success: true');
  assert(demoJson.data.personal.fullName === 'Alexander Vance', 'Demo data should include student Alexander Vance');
  assert(demoJson.data.projects.length >= 2, 'Demo data should have at least 2 projects');
  assert(demoJson.data.education.length >= 2, 'Demo data should have at least 2 education entries');
  assert(demoJson.data.skills.length >= 5, 'Demo data should have skills');
  assert(demoJson.data.languages.length >= 1, 'Demo data should have languages');
  assert(demoJson.data.additional && demoJson.data.additional.workshops, 'Demo data should have workshops in additional info');
  console.log('  ✅ API /api/demo-data structure validated across all sections.');

  console.log('\n🎉 ALL TEST SUITES PASSED! The redesigned application is verified and production-ready.\n');
  process.exit(0);
}

runHttpTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
