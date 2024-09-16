var JsBarcode = require('jsbarcode');
var { createCanvas } = require("canvas");

export function generateBarcode(invoiceNumber) {
    const canvas = createCanvas(200, 100);
    
    JsBarcode(canvas, invoiceNumber, {
      format: "CODE128",
      displayValue: false,
      width: 2,               
      height: 40,             
     });
  
    return canvas.toBuffer("image/png").toString("base64");  // Return base64 string
  }
  