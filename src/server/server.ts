import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import path from "path";
import * as fs from "node:fs";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const THOUSAND = 1000;

const formatToString = (val: number) => {
  let value = val;

  if (val >= THOUSAND || val <= -THOUSAND) {
    value = Math.trunc(val);
  }

  return {
    value: `${ val < 0 ? '' : '+' }${Number(value).toLocaleString("en-US")}`,
    isNegative: val < 0,
  }
}

const getNameFontSize = (name: string) => {
  const config = {
    maxSize: 120,
    minSize: 10,
    letterSpacing: .5,
  };

  const containerWidth = 567;
  const nameLength = name.length;

  if (nameLength < 5) {
    return `${config.maxSize}px`;
  }

  const spacingInPixels = config.letterSpacing * 16 * (nameLength - 2);

  const fontSize = Math.max(
      config.minSize,
      Math.min(config.maxSize, (containerWidth - spacingInPixels) / (nameLength * 1.2))
  );

  return `${fontSize}px`;
}

app.post("/generate-image", async (req, res) => {
  try {
    const pageSize = {
      width: 1900,
      height: 1042,
    }
    const { name, pnlSol, pnlUsd, return: returnValue, investedSol } = req.body;

    // Launch Puppeteer with headless mode as false to debug
    const browser = await puppeteer.launch({ headless: true, args: ['--allow-file-access-from-files', '--enable-local-file-accesses', '--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    await page.setViewport({ ...pageSize });

    // Load the font as Base64
    const fontPath = path.join(__dirname, "assets", "fonts", "Akira", "Akira.otf");
    const fontBase64 = fs.readFileSync(fontPath).toString('base64');

    // Load the background images as Base64
    const positiveBgPath = path.join(__dirname, "assets", "images", "template-positive.png");
    const negativeBgPath = path.join(__dirname, "assets", "images", "template-negative.png");
    const positiveBgBase64 = fs.readFileSync(positiveBgPath).toString('base64');
    const negativeBgBase64 = fs.readFileSync(negativeBgPath).toString('base64');

    const inlineCSS = `
      @font-face {
        font-family: "Akira";
        src: url("data:font/otf;base64,${fontBase64}") format("opentype");
      }
      body {
        font-family: "Akira", sans-serif;
        background-color: #f9f9f9;
        margin: 0 !important;
      }
      #capture {
        width: ${pageSize.width}px;
        height: ${pageSize.height}px;
        background-size: cover;
        background-repeat: no-repeat;
        font-family: Akira, sans-serif;
        letter-spacing: 0.5rem;
      }
      #capture.positive {
        background-image: url("data:image/png;base64,${positiveBgBase64}");
      }
      #capture.negative {
        background-image: url("data:image/png;base64,${negativeBgBase64}");
      }
      #capture > div.captureContainer {
          position: relative;
          width: 100%;
          height: 100%;
      }
      
      #capture > div.captureContainer > div.tokenNameContainer {
          position: absolute;
          top: 468px;
          left: 125px;
          width: 567px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          box-sizing: border-box;
          margin: 0;
          overflow: hidden;
      }
      #capture > div.captureContainer > div.tokenNameContainer > p.tokenName {
          font-weight: 400;
          color: white;
          width: 100%;
          font-size: 40px;
          margin-block-start: 0;
          margin-block-end: 0;
          letter-spacing: 8px;
      }
      
      #capture > div.captureContainer > p.pnlSol {
          position: absolute;
          top: 254px;
          right: 198px;
          font-weight: 800;
          font-size: 110px;
          line-height: 127px;
          margin-block-start: 0;
          margin-block-end: 0;
          color: rgba(15, 255, 75, 1);
          text-shadow: 7px 12px 35px rgba(15, 255, 75, .5);
      }
      #capture.negative > div.captureContainer > p.pnlSol {
          color: rgba(251, 40, 40, 1);
          text-shadow: 7px 12px 35px rgba(251, 40, 40, .5);
      }
      
      #capture > div.captureContainer > p.pnlUsd {
          position: absolute;
          color: white;
          top: 407px;
          right: 260px;
          font-weight: 400;
          font-size: 50px;
          line-height: 68px;
          margin-block-start: 0;
          margin-block-end: 0;
      }
      
      #capture > div.captureContainer > p.return {
          position: absolute;
          color: white;
          top: 709px;
          right: 81px;
          font-weight: 400;
          font-size: 56px;
          line-height: 100%;
          margin-block-start: 0;
          margin-block-end: 0;
      }
      
      #capture > div.captureContainer > p.investedSol {
          position: absolute;
          color: white;
          bottom: 74px;
          right: 150px;
          font-weight: 800;
          font-size: 56px;
          line-height: 100%;
          margin-block-start: 0;
          margin-block-end: 0;
      }
      
      .visible {
          visibility: visible;
      }
      
      .hidden {
          visibility: hidden;
      }
      
      .editor {
          margin-bottom: 10px;
      }
      
      .editor .editor-label {
          display: block;
          font-weight: bold;
          color: black;
      }
      
      .editor .editor-input {
          width: 100%;
          padding: 5px;
          border-radius: 5px;
          border: 1px solid black;
      }
    `;

    // Set the page content inline with CSS
    await page.setContent(`
      <html>
        <head>
          <style>${inlineCSS}</style>
        </head>
        <body>
          <div id="capture" class="${formatToString(pnlSol).isNegative ? 'negative' : 'positive'}">
            <img id="background" style="display: none" src="${path.join(__dirname, "assets", "images", `"template-${pnlSol < 0 ? 'negative' : 'positive'}.png"`)}"  alt="back image"/>
            <div class="captureContainer">
              <div class="tokenNameContainer">
                <p class="tokenName" style="font-size: ${getNameFontSize(name)}">${name.toUpperCase()}</p>
              </div>
              <p class="pnlSol ${pnlSol < 0 ? 'negative' : ''}">${formatToString(pnlSol).value}</p>
              <p class="pnlUsd">${formatToString(pnlUsd).value}</p>
              <p class="return">${formatToString(returnValue).value} %</p>
              <p class="investedSol">${investedSol}</p>
            </div>
          </div>
        </body>
      </html>
    `);

    const screenshotPath = path.join(__dirname, 'screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true, omitBackground: false });

    res.setHeader("Content-Type", "image/png");
    res.sendFile(screenshotPath);
  } catch (error: any) {
    res.status(500).send(`Failed to generate image: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
