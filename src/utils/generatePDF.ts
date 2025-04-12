
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TimeUnit } from './timeCalculations';
import translations, { Language } from './translations';

export async function generatePDF(elementId: string, birthDate: Date, lifeExpectancy: number, timeUnit: TimeUnit, language: Language): Promise<void> {
  const t = translations[language];
  
  try {
    const canvas = await html2canvas(document.getElementById(elementId)!, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // A4 paper size
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(width / imgWidth, height / imgHeight);
    const imgX = (width - imgWidth * ratio) / 2;
    const imgY = 20;
    
    // Add title and info
    pdf.setFontSize(20);
    pdf.text(t.title, width / 2, 10, { align: 'center' });
    
    // Add the canvas image
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Add footer with metadata
    const footerY = height - 10;
    pdf.setFontSize(8);
    pdf.text(`${t.birthday}: ${birthDate.toLocaleDateString()}`, 10, footerY);
    pdf.text(`${t.lifeExpectancy}: ${lifeExpectancy}`, width / 2, footerY, { align: 'center' });
    pdf.text(`${t.timeUnit}: ${t[timeUnit]}`, width - 10, footerY, { align: 'right' });
    
    // Save the PDF
    pdf.save(`TimeCanvas_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
