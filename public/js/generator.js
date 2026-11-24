/**
 * Professional Portfolio Generator Engine
 * Multi-page A4 PDF Generation, Print Formatting, LocalStorage Persistence & Export
 */

const PortfolioGenerator = {
  STORAGE_KEY: 'student_portfolio_data',
  DRAFT_KEY: 'student_portfolio_form_draft',

  // Save finalized portfolio data
  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving portfolio data to LocalStorage:', e);
      return false;
    }
  },

  // Retrieve portfolio data
  getData() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Error reading portfolio data:', e);
      return null;
    }
  },

  // Save temporary form draft
  saveDraft(data) {
    try {
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Get form draft
  getDraft() {
    try {
      const raw = localStorage.getItem(this.DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  // Clear data
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.DRAFT_KEY);
  },

  // Generate HTML using selected template
  generate(data, templateId) {
    const selectedTemplate = templateId || data.template || 'corporate-professional';
    if (!window.PortfolioTemplates) {
      console.error('PortfolioTemplates library not loaded.');
      return '<div>Error: Portfolio Templates engine not loaded.</div>';
    }
    return window.PortfolioTemplates.render(selectedTemplate, data);
  },

  // Critical: Professional Multi-Page A4 PDF Generator
  async downloadPdf(element, customFilename) {
    if (!element) {
      console.error('Target element for PDF generation not found.');
      return false;
    }

    const filename = customFilename || 'Student_Portfolio.pdf';

    // If html2pdf bundle is available
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: [15, 15, 15, 15], // 15mm standard professional A4 margin
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2, // High-DPI crisp vector text
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#FFFFFF'
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['.corp-item-block', '.corp-section', '.min-entry', '.dev-project-card', '.acad-entry', '.creat-card', 'h1', 'h2', 'h3', 'h4']
        }
      };

      try {
        await html2pdf().set(opt).from(element).save();
        return true;
      } catch (err) {
        console.warn('html2pdf generation encountered an issue, falling back to window.print():', err);
        window.print();
        return false;
      }
    } else {
      // Native high-fidelity browser print dialog fallback
      window.print();
      return true;
    }
  },

  // Print Portfolio
  print() {
    window.print();
  },

  // Export full standalone self-contained HTML file
  exportStandaloneHtml(data, templateId) {
    const activeTemplate = templateId || data.template || 'corporate-professional';
    const bodyContent = this.generate(data, activeTemplate);
    const fullName = (data.personal && data.personal.fullName) || 'Student Portfolio';

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${window.PortfolioTemplates ? window.PortfolioTemplates.escapeHtml(fullName) : 'Student'} - Professional Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/templates.css">
</head>
<body style="background:#F5F7FA; margin:0; padding:40px 10px;">
  <div style="max-width:900px; margin:0 auto; background:#FFFFFF; box-shadow:0 1px 3px rgba(0,0,0,0.1); border-radius:6px; overflow:hidden;">
    ${bodyContent}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = fullName.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `${cleanName}_Portfolio.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export raw JSON data
  exportJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const name = (data.personal && data.personal.fullName) ? data.personal.fullName.replace(/[^a-zA-Z0-9]/g, '_') : 'Portfolio';
    link.download = `${name}_Data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Export to window and module
if (typeof window !== 'undefined') {
  window.PortfolioGenerator = PortfolioGenerator;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioGenerator;
}
