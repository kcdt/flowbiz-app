import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { InvoiceWithDetails, SaleItem } from '../types/sale.types';

export const generatePDF = async (invoiceData: InvoiceWithDetails) => {
  return new Promise((resolve, reject) => {
    try {
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const filePath = path.join(tempDir, `invoice_${invoiceData.id}.pdf`);
      const doc = new PDFDocument({ margin: 50 });
      
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      
      doc.fontSize(20).text('FACTURE', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12);
      doc.text(`Numéro de facture: ${invoiceData.invoiceNumber}`);
      doc.text(`Date d'émission: ${new Date(invoiceData.issuedDate).toLocaleDateString()}`);
      doc.text(`Statut: ${invoiceData.status}`);
      doc.moveDown();
      
      doc.text('Vendeur:');
      doc.text(`${invoiceData.sale.company.name}`);
      doc.text(`Email: ${invoiceData.sale.company.email}`);
      if (invoiceData.sale.company.phone) {
        doc.text(`Téléphone: ${invoiceData.sale.company.phone}`);
      }
      doc.moveDown();
      
      if (invoiceData.sale.buyerName) {
        doc.text('Acheteur:');
        doc.text(`${invoiceData.sale.buyerName}`);
        if (invoiceData.sale.buyerAddress) {
          doc.text(`Adresse: ${invoiceData.sale.buyerAddress}`);
        }
        doc.moveDown();
      }
      
      doc.text('Détails de la commande:', { underline: true });
      doc.moveDown(0.5);
      
      const tableTop = doc.y;
      const itemX = 50;
      const descriptionX = 150;
      const quantityX = 280;
      const priceX = 350;
      const amountX = 450;
      
      doc.font('Helvetica-Bold');
      doc.text("Article", itemX, tableTop);
      doc.text("Description", descriptionX, tableTop);
      doc.text("Qté", quantityX, tableTop);
      doc.text("Prix", priceX, tableTop);
      doc.text("Total", amountX, tableTop);
      doc.moveDown();
      
      doc.font('Helvetica');
      let y = doc.y;
      
      invoiceData.sale.items.forEach((item: SaleItem) => {
        doc.text(item.product.name, itemX, y);
        doc.text(item.product.description || "-", descriptionX, y, { width: 120 });
        doc.text(item.quantity.toString(), quantityX, y);
        doc.text(`${item.unitPrice} €`, priceX, y);
        doc.text(`${(item.quantity * Number(item.unitPrice)).toFixed(2)} €`, amountX, y);
        
        y = doc.y + 10;
        doc.moveDown();
      });
      
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      
      doc.font('Helvetica-Bold');
      doc.text(`Total: ${invoiceData.totalAmount} €`, { align: 'right' });
      
      doc.moveDown(2);
      doc.font('Helvetica');
      doc.fontSize(10);
      doc.text('Merci pour votre confiance !', { align: 'center' });
      
      doc.end();
      
      stream.on('finish', () => {
        resolve(filePath);
      });
      
    } catch (error) {
      reject(error);
    }
  });
};