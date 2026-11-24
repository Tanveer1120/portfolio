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
  - ⚡ **Instant & Frictionless**: Open website &rarr; Enter information in 4 organized steps &rarr; Select Template &rarr; Preview &rarr; Download A4 Multi-Page PDF.

---

## 2. Technology Stack & Design System

| Layer | Technologies & Specifications |
|---|---|
| **Frontend** | HTML5, CSS3, Modern JavaScript (ES6+), Bootstrap 5.3.3, Clean SVG Icons (Lucide-style) |
| **Colour Palette** | Primary Navy: `#14243A` | Professional Blue: `#2563EB` | Light Background: `#F5F7FA` | Text: `#263238` | Border: `#E2E8F0` | Card White: `#FFFFFF` |
| **Typography** | Inter, Roboto, Arial, Roboto Mono (Technical code/URLs) |
| **PDF Generation** | `html2pdf.js` v0.10.1 configured for exact A4 Portrait (210mm x 297mm), 15mm professional margins, letterRendering, vector text, and page-break avoidance (`page-break-inside: avoid`) |
| **Backend** | Node.js LTS, Express.js, CORS |
| **Storage** | Client-side `LocalStorage` (`student_portfolio_data` & `student_portfolio_form_draft`) |
| **Local Port** | Port `3000` (`http://localhost:3000`) |
| **Remote Git** | `https://github.com/Tanveer1120/portfolio.git` on branch `main` |

---

## 3. Streamlined 4-Step Architecture

The form has been redesigned from a lengthy 12-step wizard into **4 high-efficiency, intuitive steps**:

### Step 1: Profile & Contact Information
- **Personal Details**: Full Name (required), Professional Title / Headline (required), Profile Photo Upload (with preview & remove), Short About Me / Professional Summary, Current City / Location.
- **Contact Details**: Email Address (required, email-validated), Phone Number, LinkedIn Profile URL, GitHub Profile URL, Personal Website URL.
- **Navigation**: Bottom-left "Home" button, Bottom-right "Continue to Education & Skills" button.

### Step 2: Education, Skills & Languages
- **Academic Background**: Dynamic repeatable cards with Institution Name, Degree / Course, Department / Specialization, University (optional), Study Period (Start - End Year), Graduation Year, CGPA / Percentage, Academic Highlights / Coursework. Button: "+ Add Education".
- **Searchable Skills Selector**:
  - Filter tabs: All, Technical Skills, Programming Languages, Web Technologies, Frameworks, Databases, Software & Tools, Professional Skills.
  - Real-time search box filtering across 40+ predefined chips.
  - One-click chip selection toggling.
  - Selected skills tags container with count badge and '×' removal buttons.
  - Custom skill text input + "Add" button.
  - "Clear All" button.
  - Non-technical students fully supported without forced tech skills.
- **Languages with Proficiency**:
  - Predefined datalist + custom input.
  - Proficiency levels: Basic, Intermediate, Fluent, Native.
  - Selected language tags container with '×' removal buttons.
- **Navigation**: Bottom-left "Back to Profile" button, Bottom-right "Continue to Experience & Projects" button.

### Step 3: Experience & Projects
- **Projects & Practical Work**: Dynamic repeatable cards with Project Name, Tools / Technologies Used, Short Project Description, GitHub Repository URL (optional), Live Demo URL (optional). Button: "+ Add Project".
- **Internships & Work Experience (Optional)**: Optional for freshers and college students. Organization Name, Position / Role, Duration, Responsibilities & Work Description. Button: "+ Add Experience".
- **Certifications & Achievements (Optional)**: Certification / Award Name, Issuing Organization, Year, Credential Link / ID. Button: "+ Add Certification".
- **Navigation**: Bottom-left "Back to Education" button, Bottom-right "Continue to Final Details & Design" button.

### Step 4: Final Details & Portfolio Template Design
- **Additional Information (Optional)**: Professional Interests & Hobbies, Extracurricular Activities & Leadership, Academic Workshops / Seminars / Conferences.
- **Template Selection**: 5 curated cards with radio toggles and layout previews:
  1. Corporate
  2. Minimal
  3. Developer
  4. Academic
  5. Modern Professional
- **Navigation**: Bottom-left "Back to Projects" button, Bottom-right prominent **"Generate Portfolio"** button.

---

## 4. Mandatory Back Button Navigation System & State Preservation

- **Visible and functional Back Button on every step**:
  - Bottom-left "Back", Bottom-right "Continue" / "Generate Portfolio".
  - Navigates immediately to previous step with **ZERO data loss**.
  - All form inputs, dynamic repeater rows, uploaded photo base64 strings, skills chips, and selected template persist cleanly.
- **Browser History Support**:
  - Integrated with HTML5 History API (`history.pushState` and `window.onpopstate`).
  - Browser Back and Forward buttons navigate wizard steps without page reloads or loops.
- **LocalStorage Auto-Saving**:
  - Debounced auto-save triggers on every field input and repeater change.
  - Visual "Auto-saved" indicator badge in top utility bar.
- **Preview Navigation**:
  - "Back to Edit Details" button returns directly to the builder with all data intact.
  - In-place template switcher dropdown renders changes instantly without page reload.
  - "Download Portfolio PDF" triggers high-DPI multi-page vector PDF generation.
  - "Print Portfolio" opens native browser print dialog.

---

## 5. The Five Curated Professional Portfolio Templates

Every template has a genuine layout, distinct CSS rules, and semantic hierarchy:

1. **Corporate** (`corporate` / alias `corporate-professional`):
   - White background, deep navy headings (`#14243A`), crisp divider rules, and structured item blocks.
   - Tailored for university placement drives, Fortune 500 internship programs, and corporate job applications.
2. **Minimal** (`minimal` / alias `modern-minimal`):
   - Clean whitespace, modern typography, subtle separators, and relaxed vertical spacing.
   - Ideal for general graduate applications, consulting, and management roles.
3. **Developer** (`developer` / alias `developer-portfolio`):
   - Technical appearance with code-centric stack tags, repository commit styling, and deployment links.
   - Clean software engineering aesthetic with zero gaming gimmicks.
4. **Academic** (`academic` / alias `academic-portfolio`):
   - Education-centric layout prioritizing cumulative GPA, relevant coursework, academic projects, honors, and research publications.
5. **Modern Professional** (`modern-professional` / alias `professional-creative`):
   - Two-column modern format featuring an informative left sidebar for contact, languages, skills, and certifications, paired with an expansive main column for education, experience, and project highlights.

---

## 6. Multi-Page A4 PDF Engine

- Configured using `html2pdf.js`:
  - Format: `A4 portrait` (`210mm x 297mm`)
  - Margins: Exactly `[15, 15, 15, 15]` mm
  - DPI: `scale: 2` for razor-sharp vector text
  - Filename format: `${Candidate_Name}_Portfolio.pdf`
  - Break avoidance: `page-break-inside: avoid` on cards, sections, headers, and entries
  - Print stylesheet: Dedicated `@media print` rules with hidden controls and pure white canvas

---

## 7. Automated Test Suite

- Automated test script: `test-e2e.js`
- Tests:
  - Unit tests for all 10 template IDs/aliases.
  - XSS escaping and safety checks.
  - Graceful omission of empty optional sections.
  - HTTP Server routes validation (200 OK on `/`, `/create`, `/templates`, `/preview`, `/api/health`, `/api/demo-data`).
  - Demo data API schema validation.
- Run command:
  ```powershell
  $serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow
  Start-Sleep -Seconds 2
  try { node test-e2e.js } finally { if ($serverProcess) { Stop-Process -Id $serverProcess.Id -Force } }
  ```

---

## 8. Git Repository Information

- **Remote URL**: `https://github.com/Tanveer1120/portfolio.git`
- **Primary Branch**: `main`
- **Security Rule**: Personal Access Tokens (PATs) must **never** be saved in source files, git config, or committed documentation.

---

## 9. Critical Bug Fix: Generate Portfolio Button Execution Flow

- **Root Cause Identified via Headless Chrome DevTools Protocol (CDP)**:
  - During script load, `goToStep(1, false)` ran prematurely at line 796 before variable declarations and `populateForm` / `generatePortfolio` definitions were reached.
  - `goToStep` called `triggerAutoSave()`, which accessed `autoSaveTimeout` before its `let` declaration at line 961, triggering an uncaught ES6 TDZ (Temporal Dead Zone) `ReferenceError: Cannot access 'autoSaveTimeout' before initialization`.
  - This exception halted script execution mid-way during `DOMContentLoaded`, leaving `window.generatePortfolio` undefined and the `#generatePortfolioBtn` event listener unattached.
  - Clicking the button triggered `ReferenceError: generatePortfolio is not defined`, making the button appear responsive to click CSS styles but performing no generation or navigation.
- **Resolution**:
  - Moved `let autoSaveTimeout = null;` to the top of `DOMContentLoaded` alongside other state variables.
  - Moved initial `goToStep(1, false)` to the end of Section 11 after all functions and drafts are loaded.
  - Unwrapped payload (`rawData.data || rawData`) in `populateForm` to ensure sample demo data populates smoothly.
  - Confirmed 100% pass across all 4 mandatory verification tests (A: core fields, B: full fields with demo data, C: minimal/empty optional fields, D: back-and-edit re-generation) in a live Google Chrome browser instance via CDP.

