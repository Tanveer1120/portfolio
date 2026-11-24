# AI_CONTEXT.md — Project & Session Memory Bank

> **Purpose**: This document serves as persistent memory and architectural context across AI assistant sessions. Whenever a new chat or session starts, reading this file provides complete, unambiguous context on project specifications, design preferences, codebase structure, features implemented, and Git history.

---

## 1. Project Overview & Core Philosophy

- **Project Name**: Personal Portfolio Website (Student Portfolio Generator)
- **Target Audience**: College students, fresh graduates, job seekers, internship applicants, postgraduate research candidates, and early-career professionals.
- **Strict Non-Negotiable Requirements**:
  - ❌ **No Registration / No Sign-up**
  - ❌ **No Login / No Authentication**
  - ❌ **No Subscription / No Paywalls / No Fees**
  - ❌ **No Emojis, No Cartoon Illustrations, No Childish Elements**
  - ⚡ **Instant & Frictionless**: Open website &rarr; Select Academic Category &rarr; Fill details (or 1-click sample data) &rarr; Select Template &rarr; Preview &rarr; Download A4 Multi-Page PDF.

---

## 2. Technology Stack & Design System

| Layer | Technologies & Specifications |
|---|---|
| **Frontend** | HTML5, CSS3, Modern JavaScript (ES6+), Bootstrap 5.3.3, Clean SVG Icons (Lucide-style) |
| **Colour Palette** | Primary Navy: `#14243A` | Professional Blue: `#2563EB` | Light Background: `#F5F7FA` | Text: `#263238` | Border: `#E2E8F0` | Card White: `#FFFFFF` |
| **Typography** | Inter, Roboto, Arial, Roboto Mono (Technical code/URLs) |
| **PDF Generation** | `html2pdf.js` v0.10.1 configured for A4 Portrait (210mm x 297mm), 15mm professional margins, letterRendering, vector text, and page-break avoidance |
| **Backend** | Node.js (v20.18.0 LTS), Express.js (v4.19.2), CORS |
| **Storage** | Client-side `LocalStorage` (`student_portfolio_data` & `student_portfolio_form_draft`) |
| **Local Port** | Port `3000` (`http://localhost:3000`) |

---

## 3. Academic Category Selection (Step 0)

Before opening form sections, students select their academic discipline:
1. Computer Science / IT
2. Engineering
3. BCA / MCA
4. BBA / MBA
5. BCom / MCom
6. BSc / MSc
7. BA / MA
8. Other Degrees

Non-technical degrees are fully supported without forcing programming languages, technical projects, or GitHub repositories.

---

## 4. The 11 Student Portfolio Form Sections

- **Section 1: Personal Information**: Full Name, Professional Title, Profile Photo (with upload, preview, remove), Email, Phone, City, State, LinkedIn URL, GitHub URL, Website URL, Professional Summary.
- **Section 2: Career Objective**: Target goals, academic focus, and career aspirations.
- **Section 3: Education**: Dynamic repeater: Institution Name, Degree / Course, Department, University Name, Start Year, Graduation Year, CGPA / Percentage, Relevant Coursework.
- **Section 4: Technical & Professional Skills**: Structured into Programming Languages, Frontend, Backend, Frameworks, Databases, Developer Tools, Software Skills, Soft Skills, Other Skills.
- **Section 5: Projects**: Dynamic repeater: Project Name, Description, Problem Statement, Solution, Technologies Used, Student's Contribution, Duration, GitHub Repository URL, Live Demo URL.
- **Section 6: Internships & Experience**: Organization Name, Position, Experience Type, Start Date, End Date, Responsibilities, Key Achievements (optional for freshers).
- **Section 7: Certifications**: Certification Name, Issuing Organization, Issue Date, Credential ID, Credential URL.
- **Section 8: Achievements**: Achievement Title, Description, Date, Organization.
- **Section 9: Workshops & Training**: Workshop Name, Organization, Date, Description.
- **Section 10: Extracurricular Activities**: Volunteering, Leadership, Student Clubs, Competitions, Sports, Other Activities.
- **Section 11: Additional Information**: Languages Known, Hobbies & Interests, Publications, References.
- **Section 12: Template Selection**: Pick from 5 professional templates + "Generate Portfolio" trigger.

---

## 5. Mandatory Back Button Navigation System

- **Visible and functional Back Button throughout the entire application**:
  - Located on the **bottom-left** of every form step.
  - Paired with the **Continue** button on the **bottom-right**.
  - Left arrow SVG icon with label "Back".
  - Navigates to the immediately previous step with **ZERO data loss** (preserves all inputs, dynamic repeater rows, uploaded photos, and selected template).
- **Browser History Support**:
  - Integrated with the HTML5 History API (`history.pushState` and `window.onpopstate`).
  - Browser Back and Forward buttons navigate steps smoothly without page reloads or loops.
- **Preview Navigation**:
  - "Back to Edit Details" button returns directly to the form with all entered details intact.
  - "Change Template" selector dropdown updates view in place instantly.
  - "Download Portfolio PDF" generates multi-page A4 PDF.
  - "Print Portfolio" opens native browser print dialog.

---

## 6. The Five Professional Portfolio Templates

Each template features a genuinely different architectural layout, typography, and visual hierarchy:

1. **Corporate Professional** (`.template-corporate-professional`):
   - White background, deep navy headings (`#14243A`), crisp divider rules, and structured item blocks.
   - Standard choice for campus placements, corporate recruitment, and internships.
2. **Modern Minimal** (`.template-modern-minimal`):
   - Clean whitespace, modern typography, subtle separators, and relaxed vertical spacing.
   - Ideal for general graduate applications and consulting roles.
3. **Developer Portfolio** (`.template-developer-portfolio`):
   - Technical appearance with code-centric stack rows, repository commit styling, and deployment links.
   - Clean software engineering aesthetic with zero gaming gimmicks.
4. **Academic Portfolio** (`.template-academic-portfolio`):
   - Education-centric layout prioritizing cumulative GPA, relevant coursework, academic projects, honors, and research publications.
5. **Professional Creative** (`.template-professional-creative`):
   - Two-column asymmetric layout with an informative left profile sidebar and expansive main column.

---

## 7. Professional Multi-Page A4 PDF Engine

- **Page Configuration**:
  - A4 dimensions: `210mm x 297mm` (Portrait)
  - Margins: `15mm`
  - High-DPI (2x scale) crisp vector text
  - CSS rule `page-break-inside: avoid; break-inside: avoid;` applied to cards, sections, and item blocks to prevent entries from being split across page margins.
  - Automatic multi-page pagination (1 page for concise, 2 pages for medium, 3+ for comprehensive profiles).
  - Filename format: `${Student_Name}_Portfolio.pdf`.

---

## 8. Git & Remote Status

- **Remote URL**: `https://github.com/Tanveer1120/portfolio.git`
- **Branch**: `main`
- **Testing**: `test-e2e.js` with 12 automated unit and integration tests (`npm test`).
