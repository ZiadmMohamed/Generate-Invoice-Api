import {  createCanvas, loadImage } from "canvas";

var QRCode = require('qrcode')
const path = require('path');
const sharp = require('sharp');




async function convertLogoBackgroundToWhite(inputImagePath, outputImagePath) {
      await sharp(inputImagePath)
          .flatten({ background: { r: 255, g: 255, b: 255 } }) 
          .toFile(outputImagePath);

      return outputImagePath
  
}




export async function generateQRCode(url,logoPath = null) {

    try {
      const canvas = createCanvas(100, 100);
      const ctx = canvas.getContext('2d');
      
    await QRCode.toCanvas(canvas, url, {
        errorCorrectionLevel: 'H',
        width: 100,
        margin: 0
      });

      if (logoPath) {

    const modifiedLogoPath = `modified-${path.basename(logoPath)}`;
    const processedLogoPath = await convertLogoBackgroundToWhite(logoPath, modifiedLogoPath);
    const logo = await loadImage(processedLogoPath);
    
    const logoSize = 30; 
    const x = (canvas.width - logoSize) / 2;
    const y = (canvas.height - logoSize) / 2;

    ctx.drawImage(logo, x, y, logoSize, logoSize);

      }

      const qrCodeBase64 = canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, "");
      return qrCodeBase64;

      } catch (error) {
      console.error('Error generating QR Code:', error);
      return null;
    }
  }
  