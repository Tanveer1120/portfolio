# Personal Portfolio Website — Student Portfolio Generator

A modern, responsive web application designed to help university students, fresh graduates, and career starters generate and export professional personal portfolios without programming knowledge, registration, or login.

---

## 🌟 Key Features

- **No Registration or Login Required**: Open the app and begin creating immediately.
- **100% Free**: No subscriptions, paywalls, or gated features.
- **Academic Category Selection**: Tailor-made for Computer Science/IT, Engineering, BCA/MCA, BBA/MBA, BCom/MCom, BSc/MSc, BA/MA, and other degrees.
- **Corporate Minimal Design System**: Clean corporate palette (Primary Navy `#14243A`, Professional Blue `#2563EB`, Light Background `#F5F7FA`, Main Text `#263238`), crisp typography (Inter, Roboto), subtle shadows, and zero emojis/childish graphics.
- **Mandatory Back Button Navigation**:
  - Visible on the bottom-left of every single step.
  - Paired with Continue on the bottom-right.
  - Zero data loss during backward and forward navigation.
  - Full browser History API support.
- **Complete 11 Student Portfolio Sections**:
  1. Personal Information & Headshot Photo Upload
  2. Career Objective & Aspirations
  3. Education Details (Multiple degrees, CGPA, coursework)
  4. Technical & Professional Skills (Categorized for technical and non-technical tracks)
  5. Projects Showcase (Problem statements, solutions, contribution, repo and demo URLs)
  6. Internships & Professional Experience (Optional for freshers)
  7. Certifications & Credentials
  8. Academic & Professional Achievements
  9. Workshops & Technical Training
  10. Extracurricular Activities & Leadership
  11. Additional Information (Languages, hobbies, publications, references)
- **5 Genuine Professional Templates**:
  1. **Corporate Professional**: Navy headings, structured sections, placement drive standard.
  2. **Modern Minimal**: Editorial layout with generous whitespace and subtle dividers.
  3. **Developer Portfolio**: Code-centric stack layout with GitHub repository and live deployment links.
  4. **Academic Portfolio**: Education first, detailed coursework, honors, and publications.
  5. **Professional Creative**: Two-column executive layout with informative sidebar.
- **Critical: Multi-Page A4 PDF Generation**:
  - Calibrated to exact A4 portrait dimensions (210mm x 297mm).
  - 15mm standard margins with vector-quality text.
  - Page-break protection on cards and sections.
  - Multi-page pagination (1 page for short, 2 pages for medium, 3+ for long).
  - Native print formatting with `@media print`.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Modern JavaScript (ES6+), Bootstrap 5.3.3, Clean SVG Icons (Lucide-style), Google Fonts (Inter, Roboto Mono), `html2pdf.js`.
- **Backend**: Node.js (v20 LTS), Express.js, CORS.
- **Storage**: Client-side `LocalStorage`.

---

## 🚀 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the application**:
   ```bash
   npm start
   ```

3. **Run the automated test suite**:
   ```bash
   npm test
   ```

4. **Open in browser**:
   - Homepage: `http://localhost:3000/`
   - Form Builder: `http://localhost:3000/create`
   - Template Catalog: `http://localhost:3000/templates`
   - Live Preview: `http://localhost:3000/preview`

---

## 📝 License
MIT License. Free and open for students and educators worldwide.
