import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import path from "path";
import * as fs from "node:fs";
import { getCanvas } from "./helpers/ohlcv";
import { formatNumber, formatToString, getNameFontSize } from "./helpers/formatters";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

    const imagePath = path.join(__dirname, `pnl-${name}.png`);
    await page.screenshot({ path: imagePath, fullPage: true, omitBackground: false });

    res.setHeader("Content-Type", "image/png");
    res.sendFile(imagePath, () => {
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    });
  } catch (error: any) {
    res.status(500).send(`Failed to generate image: ${error.message}`);
  }
});

app.post("/pnl-card", async (req, res) => {
    try {
      const { name, pnlSol, pnlPercent, profitUsd, investedUsd, chartData } = req.body;

      const canvasData = getCanvas(JSON.parse(chartData), pnlSol > 0);

      const pageSize = {
        width: 600,
        height: 800 - (chartData.length > 0 ? 0 : 235),
      }

      // Launch Puppeteer with headless mode as false to debug
      const browser = await puppeteer.launch({ headless: true, args: ['--allow-file-access-from-files', '--enable-local-file-accesses', '--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();

      await page.setViewport({ ...pageSize });

      const bgImagePath = path.join(__dirname, "assets", "images", "logo-bg-vector.png");
      const bgImageBase64 = fs.readFileSync(bgImagePath).toString('base64');
      const logoPath = path.join(__dirname, "assets", "images", "logo.png");
      const logoBase64 = fs.readFileSync(logoPath).toString('base64');

      // Load the font as Base64
      const fontPath = path.join(__dirname, "assets", "fonts", "Manrope", "Manrope-Semibold.ttf");
      const fontBase64 = fs.readFileSync(fontPath).toString('base64');
      const inlineCSS = `
        @font-face {
          font-family: "Manrope";
          src: url("data:font/ttf;base64,${fontBase64}") format("truetype");
        }
        body {
          font-family: "Manrope", sans-serif;
          background-color: #f9f9f9;
          margin: 0 !important;
        }
        p {
          margin-block-start: 0;
          margin-block-end: 0;
        }
        #capture {
          display: flex;
          flex-direction: column;
          justify-content: space-between; 
          width: ${pageSize.width}px;
          height: ${pageSize.height}px;
          font-family: Manrope, sans-serif;
          padding: 32px 8px;
          box-sizing: border-box;
          letter-spacing: 2;
          position: relative;
        }
        #capture:before {
          content: '';
          background: url("data:image/png;base64,${bgImageBase64}");
          position: absolute;
          top: 0;
          left: 0;
          width: 496px;
          height: 756px;
        }
        #capture.positive {
          background: linear-gradient(180deg, rgba(180, 229, 89, 0.08) 54%, rgba(180, 229, 89, 0) 74%, rgba(180, 229, 89, 0.08) 95%),
                      linear-gradient(0deg, #1B1E22, #1B1E22);
        }
        #capture.negative {
          background: linear-gradient(180deg, rgba(220, 87, 91, 0.12) 54%, rgba(220, 87, 91, 0) 74%, rgba(220, 87, 91, 0.12) 95%),
                      linear-gradient(0deg, #1B1E22, #1B1E22);
        }
        .tokenName {
          font-size: 40px;
          color: white;
          margin: 0 32px;
        }
        .pnlContainer {
          display: flex;
          align-items: center;
          justify-content: flex-start; 
          height: 120px;
          margin: 0 32px;
        }
        .pnlContainer .symbol {
          font-size: 56px;
          color: rgba(180, 229, 89, 1);
        }
        .pnlContainer .symbol.negative {
          color: rgba(220, 87, 91, 1);
        }
        .pnlContainer .pnlSol {
          font-size: 88px;
          color: white;
        }
        .pnlContainer .solana {
          height: 88px;
          font-size: 40px;
          color: rgba(180, 229, 89, 1);
        }
        .pnlContainer .solana.negative {
          color: rgba(220, 87, 91, 1);
        }
        .percent {
          font-size: 48px;
          color: rgba(168, 179, 184, 1);
          margin: 0 32px 8px 32px;
        }
        .percent span {
          position: relative;
        }
        .percent span::after {
          content: "%";
          font-size: 32px;
          position: absolute;
          top: 11px;
          left: 100%;
          line-height: 100%;
        }
        .dataContainer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 36px 32px 0 32px;
        }
        .dataContainer .label {
          font-size: 26px;
          color: rgba(168, 179, 184, 1);
        }
        .dataContainer .value {
          font-size: 36px;
          color: white;
        }
        .chartContainer {
          position: relative;
          width: 100%;
          height: 235px;
        }
        .chartContainer .candles {
          position: absolute;
          top: ${canvasData.start - 1}px;
          left: 0;
          width: calc(100% - ${canvasData.width}px);
          height: 3px;
          background: repeating-linear-gradient(
            to right, 
            rgba(54, 59, 67, 1), 
            rgba(54, 59, 67, 1) 16.33px, 
            transparent 16.33px, 
            transparent 32.66px
          );
          z-index: 1;
        }
        .chartContainer .chart {
          position: absolute;
          right: 0;
          height: 100%;
          overflow: hidden;
          width: ${canvasData.width}px;
          z-index: 2;
        }
        .chartContainer .chart #chart {
          position: absolute;
          right: 0;
          top: 0;
        }
        .footer {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
      `;

      const isPnlNegative = pnlSol < 0;

      // Set the page content inline with CSS
      await page.setContent(`
        <html>
          <head>
            <style>${inlineCSS}</style>
          </head>
          <body>
            <div id="capture" class="${formatToString(pnlSol).isNegative ? 'negative' : 'positive'}">
              <div class="captureContainer">
                <p class="tokenName">${name.toUpperCase()}</p>
                <div class="pnlContainer">
                    <span class="symbol ${isPnlNegative ? 'negative' : ''}">${isPnlNegative ? '-' : '+'}</span>
                    <p class="pnlSol">${Number(Math.abs(pnlSol)).toLocaleString("en-US")}</p>
                    <span class="solana ${isPnlNegative ? 'negative' : ''}">SOL</span>
                </div>
                <p class="percent"><span>${formatNumber(pnlPercent)}</span></p>
                <div class="dataContainer">
                    <p class="label">TOTAL INVESTED</p>
                    <p class="value">${formatNumber(investedUsd, true)}</p>
                </div>
                <div class="dataContainer">
                    <p class="label">TOTAL PROFIT</p>
                    <p class="value">${formatNumber(profitUsd, true)}</p>
                </div>
                <div class="chartContainer">
                    <div class="candles"></div>
                    <div class="chart">
                        <img id="chart" src="${canvasData.data.toDataURL('image/png')}" alt="chart image" />
                    </div>
                </div>
              </div>
              <div class="footer">
                <img id="logoImage" src="data:image/png;base64,${logoBase64}" alt="logo image" />
              </div>
            </div>
          </body>
        </html>
      `);

      const imagePath = path.join(__dirname, `pnl-${name}.png`);
      await page.screenshot({ path: imagePath, fullPage: true, omitBackground: false });

      res.setHeader("Content-Type", "image/png");
      res.sendFile(imagePath, () => {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      });
    } catch (error: any) {
      res.status(500).send(`Failed to generate image: ${error.message}`);
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
