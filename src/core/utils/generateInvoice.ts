import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { generateQRCode } from "./generateQRCode";
import { generateBarcode } from "./generateBarcode";
import { formatTime } from "./formatTime";
import { HttpException, HttpStatus } from "@nestjs/common";

async function createInvoice(body, res) {
  let buffers = [];
  let html = await fs.readFile("./invoice.html", { encoding: "utf8" });
  
  // Update the html variable with the modified html
  html = await inject(body, html);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    width: "80mm",
    preferCSSPageSize: true,
    margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
  });

  buffers.push(pdfBuffer);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=invoice.pdf`,
    "Content-Length": Buffer.concat(buffers).length,
  });

  res.send(Buffer.concat(buffers));

  console.log("Invoice sent as response.");

  await browser.close();
}

async function inject(body, html) {
  const { discount = 0, amountPaid = 0 } = body;

  let Total = 0;
  let items = body.products.map((product) => {
    let lineTotal = product.unitCost * product.quantity;
    Total += lineTotal;
    return `
    <tr>
      <tr>
        <td><p>${lineTotal.toFixed(2)}</p></td>
        <td><p>${product.unitCost.toFixed(2)}</p></td>
        <td><p>${product.quantity}</p></td>
        <td colspan="2"><p>${product.barcode || ''}</p></td>
      </tr>
      <tr>
        <td class="sub des" colspan="4"><p>${product.description }</p></td>
        <td class="sub item" colspan="1"><p>${product.item}</p></td>
      </tr>
    </tr>
  `;
  });

  const taxRate = 0.15;
  const addedTax = Total * taxRate;
  const discountAmount = Total * (discount / 100);
  const subTotal = (Total - discountAmount) + addedTax ;
  
  if (amountPaid > subTotal) 
    throw new HttpException('the Paid Amount  Is More Than We Need', HttpStatus.PRECONDITION_FAILED);
  
  const balanceDue = subTotal - amountPaid;
  const numOfProducts = items.length;

  const dateObj = new Date();
  const date = dateObj.toLocaleDateString();
  const time = formatTime(dateObj);

  const timestamp = Date.now().toString();
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  const transactionNo = `${timestamp.slice(7)}${randomNumber}`;

const url = "https://www.linkedin.com/in/ziad-yassin-b64985266/"
const qrCodeBase64 = await generateQRCode(url);

const secondUrl = "https://www.linkedin.com/in/ziad-yassin-b64985266/"
const logoPath = `./logo.png`
const SecondqrCodeBase64 = await generateQRCode(secondUrl,logoPath);

  html = html
    .replace("{{date}}", date)
    .replace("{{transactionNo}}", transactionNo)
    .replace("{{items}}", items.join(""))
    .replace("{{numOfProducts}}", numOfProducts)
    .replace("{{subTotal}}", subTotal.toFixed(2))
    .replace("{{balanceDue}}", balanceDue.toFixed(2))
    .replace("{{SecondSubTotal}}", subTotal.toFixed(2))
    .replace("{{amountPaid}}", amountPaid.toFixed(2))
    .replace("{{secondAmountPaid}}", amountPaid.toFixed(2))
    .replace("{{ItemBarcode}}", body.barcode)
    .replace("{{total}}", Total.toFixed(2))
    .replace("{{discount}}", discount)
    .replace("{{addedTax}}", addedTax.toFixed(2)) 
    .replace("{{time}}", time)
    .replace("{{BarCode}}", `<img class="BarCode" src="data:image/png;base64,${generateBarcode(transactionNo)}" />`)
    .replace("{{QrCode}}",`<img src="data:image/png;base64,${qrCodeBase64}" />`)
    .replace("{{SecondQrCode}}",`<img src="data:image/png;base64,${SecondqrCodeBase64}" />`)
  return html;
}

export default createInvoice;
