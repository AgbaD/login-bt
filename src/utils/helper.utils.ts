import { InvoiceSettingDto } from "./interface.utils";

const renderHTML = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    if (doc.body && doc.body.childNodes.length > 0) {
      return doc.body.innerHTML;
    } else {
      return html;
    }
};

const parseHTML = (formData: InvoiceSettingDto, logo: string | null, html: string) => {
    const modifiedHTML = html.replace(/\{\{\.(\w+)\}\}/g, (match, word) => {
        switch (word) {
        case "Title":
            return `Title: ${formData.BusinessName}`;
        case "BrandLogo":
            return logo || "";
        case "Content":
            return `<p>Content</p>
            <p>Bank Name: ${formData.BankName}</p>
            <p>Account Number: ${formData.AccountNumber}</p>
            <p>Account Name: ${formData.AccountName}</p>`;
        case "Terms":
            return formData.Terms;
        default:
            return match;
        }
    });

    return modifiedHTML;
};

const extractStyles = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract all <style> elements from the fetched HTML
    const styleNodes = doc.querySelectorAll("style");

    let combinedStyles = "";
    styleNodes.forEach((styleNode) => {
      combinedStyles += styleNode.innerHTML;
    });

    return combinedStyles;
};

const parseCSS = (formData: InvoiceSettingDto, cssText: string) => {
    let modifiedCSS = cssText.replace(/\bbody\b/g, "preview-invoice");

    // Replace {{.word}} patterns
    modifiedCSS = modifiedCSS.replace(/\{\{\.(\w+)\}\}/g, (match, word) => {
      switch (word) {
        case "FontStyle":
          return `${formData.FontStyle} !important`;
        case "FontColor":
          return `${formData.FontColor} !important`;
        case "BackgroundColor":
          return `${formData.BackgroundColor} !important`;
        default:
          return match;
      }
    });

    return modifiedCSS;
};

export {
    renderHTML,
    extractStyles,
    parseCSS,
    parseHTML,
}