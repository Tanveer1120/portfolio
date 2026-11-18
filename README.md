# Personal Portfolio Website — Student Portfolio Generator

A complete, modern, responsive web application designed to help students, fresh graduates, and career starters create their own professional personal portfolio without needing programming knowledge, registration, or logins.

---

## 🌟 Key Features

- **No Registration or Login Required**: Open the app and begin creating immediately.
- **100% Free**: No subscriptions, paywalls, or gated features.
- **Instant 1-Click Demo Fill**: Students can click *"Fill Sample Data"* to explore a fully-populated engineering portfolio instantly.
- **Auto-Saving**: Real-time form persistence using browser `LocalStorage`. Never lose entered progress.
- **Multi-Step Guided Form**:
  1. Personal Information & Profile Photo Upload (with base64 offline preview & fallback avatars)
  2. Dynamic Education Details (multiple entries, degrees, CGPA/percentage)
  3. Technical Skills Manager (quick-add popular tech pills + custom skill level tags)
  4. Dynamic Projects Showcase (live links, GitHub repository links, tech tags)
  5. Certifications & Achievements (issuing organization, year, verification links)
  6. Work Experience & Internships (optional for students)
  7. Social Media Links & Template Selection
- **4 Distinct Professional Templates**:
  1. **Minimal Professional**: Clean white canvas, crisp black typography, structured editorial grid.
  2. **Modern Dark**: Obsidian dark theme (`#0b0c10`), crimson neon accents (`#ff3344`), glass cards.
  3. **Creative Student**: Vibrant gradient headers, curved pill tags, playful yet polished.
  4. **Developer Portfolio**: Terminal and IDE inspired theme, Fira Code font, Git commit showcase.
- **Live Preview & In-Place Template Switcher**: Preview the generated portfolio and switch templates on the fly without re-entering data.
- **Export Options**:
  - **Download as PDF**: Clean vector-quality multi-page PDF generation via `html2pdf.js`.
  - **Print Friendly**: Optimized `@media print` rules.
  - **Standalone HTML Export**: Download a self-contained `.html` file ready to open in any browser or upload to GitHub Pages / Netlify.
  - **JSON Data Backup**: Export and back up your portfolio data.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Modern JavaScript (ES6+), Bootstrap 5.3.3, Bootstrap Icons, Google Fonts (Outfit, Inter, Plus Jakarta Sans, Fira Code), `html2pdf.js`.
- **Backend**: Node.js, Express.js, CORS.
- **Storage**: Browser `LocalStorage` (zero database dependencies needed for the initial version).

---

## 📂 Project Structure

```
personal-portfolio-website/
├── public/
│   ├── css/
│   │   ├── style.css         # Global SaaS styling, Black/White/Red theme, components
│   │   ├── form.css          # Multi-step wizard, repeater cards, upload preview
│   │   └── templates.css     # 4 distinct portfolio template CSS designs & print rules
│   ├── js/
│   │   ├── main.js           # Homepage mockup interactions, template preview modal
│   │   ├── form.js           # Multi-step controller, repeaters, validation, draft saver
│   │   ├── generator.js      # Core portfolio generator, PDF export, HTML exporter
│   │   └── templates.js      # Template definitions, layout dispatchers, XSS escaping
│   ├── images/               # Project images and assets
│   └── uploads/
├── views/
│   ├── index.html            # Homepage: Hero, Features, How It Works, Templates showcase
│   ├── create.html           # 7-Step portfolio creation wizard
│   ├── templates.html        # Templates showcase & live preview gallery
│   └── preview.html          # Portfolio viewer, template switcher & PDF download
├── server.js                 # Express server & demo data API
├── package.json              # Project dependencies & scripts
└── README.md                 # Documentation
```

---

## 🚀 How to Run the Project Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation Steps

1. **Clone or navigate to the project directory**:
   ```bash
   cd "personal-portfolio-website"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

4. **Open in your browser**:
   Navigate to:
   ```
   http://localhost:3000
   ```

---

## 📄 Available Routes

| Route | Description |
|---|---|
| `http://localhost:3000/` | Homepage with hero mockup, features, template cards, and FAQ |
| `http://localhost:3000/create` | 7-Step Portfolio Creation Wizard |
| `http://localhost:3000/templates` | Interactive Templates Showcase & Live Preview Modal |
| `http://localhost:3000/preview` | Live Generated Portfolio with PDF download & Template Switcher |
| `http://localhost:3000/api/demo-data` | API endpoint serving sample student demo profile |
| `http://localhost:3000/api/health` | Server health check endpoint |

---

## 📝 License
MIT License. Free to use for students, educators, and developers worldwide.
