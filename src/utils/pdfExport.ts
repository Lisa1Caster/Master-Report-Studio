import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportOptions {
  filename?: string;
  onProgress?: (step: string) => void;
}

export async function exportReportToPdf(
  elementId: string,
  options: PdfExportOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Report container element #${elementId} not found`);
  }

  const { filename = 'SEO-Performance-Report.pdf', onProgress } = options;

  onProgress?.('Preparing high-resolution document capture...');

  // Scroll to top and wait a brief moment for any rendering/fonts
  window.scrollTo(0, 0);
  await new Promise((resolve) => setTimeout(resolve, 200));

  onProgress?.('Rendering vector and chart layers...');

  const canvas = await html2canvas(element, {
    scale: 2, // High DPI for crisp text and graphics
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    backgroundColor: '#ffffff',
  });

  onProgress?.('Structuring A4 pages...');

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  // Additional pages if report height exceeds 1 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  onProgress?.('Finalizing and downloading PDF...');
  pdf.save(filename);
}

export function triggerNativePrint(): void {
  window.print();
}
