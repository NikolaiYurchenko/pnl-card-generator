import express from "express";
import puppeteer, {Browser} from "puppeteer";
import cors from "cors";
import path from "path";
import * as fs from "node:fs";
import { getCanvas } from "./helpers/ohlcv";
import { formatNumber, formatToString } from "./helpers/formatters";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let browser: Browser;

// Start and reuse Puppeteer browser
const launchBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--allow-file-access-from-files', '--enable-local-file-accesses', '--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
};

app.post("/pnl-card", async (req, res) => {
    try {
      const { name, pnlSol, pnlPercent, profitUsd, investedUsd, chartData, bgType, customImage, relativePath } = req.body;
      const formattedChartData = JSON.parse(chartData);
      const isNotLogoBg = (customImage || bgType !== 0);

      const canvasData = getCanvas({
        data: formattedChartData,
        isPositive:  pnlSol > 0,
        isAnimeBackground: isNotLogoBg,
      });

      const pageSize = {
        width: 600,
        height: 800 - (formattedChartData.length > 0 ? 0 : 200),
      }

      // Launch Puppeteer with headless mode as false to debug
      const browser = await launchBrowser();
      const page = await browser.newPage();

      await page.setViewport({ ...pageSize });

      const backgroundPaths = {
        default: path.join(__dirname, "assets", "images", "logo-bg-vector.png"),
        anime: [
          path.join(__dirname, "assets", "images", "bg-aot.png"),
          path.join(__dirname, "assets", "images", "bg-jujutsu-kaisen.png"),
          path.join(__dirname, "assets", "images", "bg-spy-family.png"),
          path.join(__dirname, "assets", "images", "bg-spirited-away.png"),
        ],
      }

      const bgImagePath = bgType === 0 ? backgroundPaths.default : backgroundPaths.anime[bgType - 1];
      const bgImageBase64 = customImage ? customImage : `data:image/png;base64,${fs.readFileSync(bgImagePath).toString('base64')}`;
      const logoPath = path.join(__dirname, "assets", "images", "logo.png");
      const logoBase64 = fs.readFileSync(logoPath).toString('base64');

      // Load the font as Base64
      const fontPath = path.join(__dirname, "assets", "fonts", "Manrope", "Manrope-Semibold.ttf");
      const fontBase64 = fs.readFileSync(fontPath).toString('base64');

      // Styles.
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
          background: url("${bgImageBase64}");
          position: absolute;
          top: 0;
          left: 0;
          width: ${isNotLogoBg ? pageSize.width : 496}px;
          height: ${(isNotLogoBg ? 800 : 756) - (formattedChartData.length > 0 ? 0 : 200)}px;
          z-index: ${isNotLogoBg ? -1 : 1};
          filter: ${isNotLogoBg ? `hue-rotate(${formatToString(pnlSol).isNegative ? 200 : 0}deg)` : 'unset'};
        }
        #capture.darken {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0.81) 67%);
        }
        #capture.positive {
          background: linear-gradient(180deg, rgba(180, 229, 89, 0.08) 12%, rgba(180, 229, 89, 0) 59%, rgba(180, 229, 89, 0.08) 100%),
                      linear-gradient(0deg, #1B1E22, #1B1E22);
        }
        #capture.negative {
          background: linear-gradient(180deg, rgba(220, 87, 91, 0.12) 12%, rgba(220, 87, 91, 0) 59%, rgba(220, 87, 91, 0.12) 100%),
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
          display: ${formattedChartData.length > 0 ? 'block' : 'none'};
          position: relative;
          width: 100%;
          height: 235px;
        }
        .chartContainer .candles {
          position: absolute;
          top: ${canvasData.start - 1}px;
          left: calc((100% - 568px) / 2);
          width: calc(568px - ${canvasData.width}px);
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
          right: calc((100% - 568px) / 2);
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

      // Set the page content inline with CSS.
      await page.setContent(`
        <html lang="en">
          <head>
            <style>${inlineCSS}</style>
          </head>
          <body>
            <div id="capture" class="${isNotLogoBg ? 'darken' : formatToString(pnlSol).isNegative ? 'negative' : 'positive'}">
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
      const imagePath = path.join(__dirname, relativePath, `${name}.png`);
      // Check if the directory exists, and if not, create it
      const dir = path.dirname(imagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await page.screenshot({ path: imagePath, fullPage: true, omitBackground: false });

      // Sends image in response.
      res.setHeader("Content-Type", "image/png");
      res.sendFile(imagePath, () => {
        // Closes page in chrome for testing after image is sent.
        page.close();
      });
    } catch (error: any) {
      res.status(500).send(`Failed to generate image: ${error.message}`);
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
