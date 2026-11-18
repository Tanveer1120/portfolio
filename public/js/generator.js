/**
 * Portfolio Generator Core Engine
 * Handles generation, LocalStorage persistence, PDF printing, Standalone HTML export, and Data Sharing.
 */

const PortfolioGenerator = {
  STORAGE_KEY: 'student_portfolio_data',
  DRAFT_KEY: 'student_portfolio_form_draft',

  // Save full finalized portfolio data
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
    const selectedTemplate = templateId || data.template || 'modern-dark';
    if (!window.PortfolioTemplates) {
      console.error('PortfolioTemplates library not loaded.');
      return '<div>Error: Templates engine not loaded.</div>';
    }
    return window.PortfolioTemplates.render(selectedTemplate, data);
  },

  // High Quality PDF Download via html2pdf or fallback print
  async downloadPdf(element, filename = 'My-Personal-Portfolio.pdf') {
    if (!element) {
      console.error('PDF element not found');
      return;
    }

    // If html2pdf is available on the window
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
    const activeTemplate = templateId || data.template || 'modern-dark';
    const bodyContent = this.generate(data, activeTemplate);
    const fullName = (data.personal && data.personal.fullName) || 'Student Portfolio';

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${window.PortfolioTemplates.escapeHtml(fullName)} - Personal Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <style>
    /* Embed critical styles */
    body { margin: 0; padding: 0; }
  </style>
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/templates.css">
</head>
<body>
  ${bodyContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-portfolio.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export data as JSON
  exportJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const name = (data.personal && data.personal.fullName) || 'portfolio';
    link.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-data.json`;
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
