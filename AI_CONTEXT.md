# AI_CONTEXT.md — Project & Session Memory Bank

> **Purpose**: This document serves as persistent memory and architectural context across AI assistant sessions. Whenever a new chat or session starts, reading this file provides complete, unambiguous context on project specifications, design preferences, codebase structure, features implemented, and Git history.

---

## 1. Project Overview & Core Philosophy

- **Project Name**: Personal Portfolio Website (Student Portfolio Generator)
- **Target Audience**: Students, college graduates, and early-career developers looking to generate and export professional personal portfolios without technical hurdles.
- **Strict Non-Negotiable Requirements**:
  - ❌ **No Registration / No Sign-up**
  - ❌ **No Login / No Authentication**
  - ❌ **No Subscription / No Paywalls / No Fees**
  - ❌ **No Database Required** (Client-first architecture utilizing browser `LocalStorage`)
  - ⚡ **Instant & Frictionless**: Open website &rarr; Enter info (or 1-click fill demo) &rarr; Pick template &rarr; Generate portfolio &rarr; Preview &rarr; Download as PDF or export HTML.

---

## 2. Technology Stack & Environment

| Layer | Technologies Used |
|---|---|
| **Frontend** | HTML5, CSS3, Modern JavaScript (ES6+), Bootstrap 5.3.3, Bootstrap Icons 1.11.3 |
| **Typography** | Google Fonts: `Plus Jakarta Sans`, `Outfit`, `Inter`, `Fira Code` (monospace) |
| **PDF Generation** | `html2pdf.js` v0.10.1 (high-DPI vector canvas with page-break tuning) |
| **Backend** | Node.js (v20.18.0 LTS), Express.js (v4.19.2), CORS |
| **Storage** | Browser `LocalStorage` (`student_portfolio_data` & `student_portfolio_form_draft`) |
| **Local Runtime** | Node.js portable installed at `C:\Users\mrjok\AppData\Local\nodejs` |
| **Local Port** | Port `3000` (`http://localhost:3000`) |

---

## 3. UI/UX Design System & User Preferences

- **Color Theme**:
  - Primary Background: Obsidian / Pitch Black (`#0a0b0e`, `#0d0f14`, `#12141a`)
  - Accent Red: Crimson Red (`#e63946`, `#dc2626`, `#ff3344`, `#ff4d5a`)
  - Card & Glass Surface: `#151821`, border `rgba(255, 255, 255, 0.08)`
  - Text: Clean white (`#f8fafc`, `#ffffff`) and muted slate (`#94a3b8`, `#64748b`)
- **Aesthetic**: Modern SaaS product feel, glassmorphism, micro-interactions, rounded cards (`16px-24px`), smooth CSS transitions, glowing badges.
- **Responsiveness**: Mobile-first architecture tested across mobile, tablet, and desktop viewports.

---

## 4. The 4 Distinct Portfolio Templates

Each template features a completely different architectural layout, typography, and visual hierarchy (not merely different colors):

1. **Minimal Professional** (`.portfolio-template-minimal`):
   - Crisp white canvas, elegant black typography (Inter + Outfit).
   - Clean editorial grid, subtle red accent rules, print-friendly layout.
   - Ideal for corporate, academic, and business consulting applications.

2. **Modern Dark** (`.portfolio-template-dark`):
   - Sleek obsidian theme (`#0b0c10`), crimson neon accents (`#ff3344`), glassmorphism cards.
   - High contrast, interactive hover glow effects.
   - Popular choice for software engineers and tech innovators.

3. **Creative Student** (`.portfolio-template-creative`):
   - Vibrant gradient hero header (`#1b0c10` to `#151124`), curved pill tags, colorful badge borders.
   - Playful yet professional layout tailored for design, multimedia, and UI/UX students.

4. **Developer Portfolio** (`.portfolio-template-developer`):
   - UNIX terminal and IDE aesthetic (`#0d1117`), Fira Code monospace font.
   - Bio presented as `profile.json`, skills formatted as bash terminal outputs, and projects styled as Git repository commit cards with public repo links.

---

## 5. File Structure & Responsibilities

```
personal-portfolio-website/
├── public/
│   ├── css/
│   │   ├── style.css         # Master styles: theme variables, navbar, hero, cards, badges, modal, footer
│   │   ├── form.css          # Multi-step wizard UI, progress tracker, repeaters, image preview box
│   │   └── templates.css     # Complete scoped styling for all 4 templates + print rules
│   ├── js/
│   │   ├── main.js           # Homepage mockup interactions, live template modal preview launcher
│   │   ├── form.js           # 7-Step form wizard logic, repeaters, validation, LocalStorage auto-save, demo loader
│   │   ├── generator.js      # Portfolio generation engine, LocalStorage persistence, PDF & HTML export
│   │   └── templates.js      # Template renderers (minimal, dark, creative, developer) with XSS sanitization
│   ├── images/               # Image assets
│   └── uploads/              # Local upload directory
├── views/
│   ├── index.html            # Homepage: Hero, Features, How It Works, Templates Showcase, Footer
│   ├── create.html           # 7-Step Form Wizard & Template Picker
│   ├── templates.html        # Interactive Templates Catalog & Live Modal Viewer
│   └── preview.html          # Portfolio viewer with floating toolbar: Edit, Template Switcher, PDF Export
├── server.js                 # Express server & /api/demo-data endpoint
├── test-e2e.js               # 12-suite automated test verification runner
├── package.json              # Project configuration and npm scripts
├── README.md                 # User-facing documentation and local run instructions
└── AI_CONTEXT.md             # This file (Persistent AI memory bank)
```

---

## 6. Detailed Feature Implementations

### Homepage (`views/index.html`)
- Sticky blurred glass navbar with brand badge.
- Hero Section: Main heading *"Build Your Professional Portfolio in Minutes"*, subheading, *"Create My Portfolio"* and *"Explore Templates"* buttons.
- Interactive live mockup card on the right side with animated floating badges (*"One-Click PDF"*, *"100% Responsive"*).
- Features Section: 6 grid cards (Easy Creation, Multiple Templates, No Coding, Instant Generation, PDF Download, Mobile Responsive).
- How It Works Section: 4 numbered steps.
- Templates Showcase: 4 preview cards with *"Preview"* (opens live modal) and *"Use Style"* buttons.
- Call To Action (CTA) banner & full footer.

### Multi-Step Creation Form (`views/create.html` + `public/js/form.js`)
- **Step 1: Personal Information**: Full Name (required), Title (required), Profile Photo upload (with base64 file reader and preview/remove buttons), Email (required + regex validation), Phone, Location, Date of Birth, About Me.
- **Step 2: Education Details**: Dynamic repeater with Add/Remove buttons: Institution Name, Degree, Department, Start Year, Graduation Year, CGPA/Score.
- **Step 3: Technical Skills**: Quick-add pill buttons for common technologies + custom skill name & proficiency level dropdown (Beginner, Intermediate, Advanced).
- **Step 4: Projects Showcase**: Dynamic project repeater: Project Name, Description, Technologies Used, Live URL, GitHub URL.
- **Step 5: Certifications & Achievements**: Dynamic repeater: Certificate Name, Issuing Organization, Year, Credential Verification URL.
- **Step 6: Work Experience**: Role, Company, Duration, Description (explicitly marked optional for students).
- **Step 7: Social Links & Template Selection**: GitHub, LinkedIn, Instagram, Website, Twitter/X + visual template radio card selector.
- **Quick Controls**:
  - **"Fill Sample Data"**: Fetches `/api/demo-data` and pre-populates the entire form with a realistic computer science student profile in 1 click.
  - **"Reset"**: Prompts for confirmation and resets form.
  - **"Auto-saved" Indicator**: Visual pill showing auto-save sync state.
  - **"Generate My Portfolio"**: Validates required fields, saves data to `LocalStorage`, displays a sleek loading overlay, and redirects to `/preview`.

### Live Portfolio Preview & Toolbar (`views/preview.html` + `public/js/generator.js`)
- Floating sticky action toolbar (hidden automatically during printing and PDF export):
  - **"Edit Details"**: Returns to `/create` with all entered data populated.
  - **Live Template Switcher Dropdown**: Instantly switches between all 4 templates without page reload.
  - **"Download PDF"**: Uses `html2pdf.js` with A4 portrait configuration, high scale (2x), and CSS page-break avoidance.
  - **"Print"**: Native browser print trigger formatted with print stylesheet.
  - **"Export Standalone HTML"**: Generates and downloads a self-contained `.html` file embedding the complete portfolio for offline use or deployment to GitHub Pages / Netlify.
  - **"Export JSON Data"**: Backs up raw portfolio data as JSON.
  - **"Copy Shareable Link"**: Copies preview URL to clipboard.
- Graceful empty-state fallback with a button to load demo data if visited before building.

---

## 7. Git & Repository Status

- **Remote URL**: `https://github.com/Tanveer1120/portfolio.git`
- **Default Branch**: `main`
- **Committed Files**: All frontend views, CSS, JS, backend `server.js`, tests, `.gitignore`, and `package.json`.
- **Clean Configuration**: Access token was securely passed during the push and immediately removed from the remote origin URL so no plaintext secrets remain in `.git/config`.

---

## 8. Verification & Test Suite

An automated test suite exists at `test-e2e.js` and can be run via `npm test`:
- **Test 1**: Catalog registry verification and XSS sanitization checks for all 4 templates.
- **Test 2**: Graceful omission test (empty optional sections must not render empty cards or broken markup).
- **Test 3**: HTTP integration tests for `/`, `/create`, `/templates`, `/preview`, `/api/health`, and `/api/demo-data`.

---

## 9. Quick Commands Reference

```bash
# Start the local server
npm start

# Run the automated tests
npm test

# Check git status
git status

# Push updates to remote repository
git push origin main
```
