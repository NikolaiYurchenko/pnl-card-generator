# PNL Image Generator

This project allows you to generate images based on financial data, including profit and loss (PNL) in Sol and USD, and other related metrics.

## To run it locally:

In the root directory of your project, run:

```bash
npm install
npx playwright install 
npm run dev
```
This will start the front-end React app on http://localhost:5173 (or another port if specified).

Start the back-end server:
In a new terminal window, navigate to the src/server directory and run:

```bash
cd src/server
ts-node server.ts
```
This will start the back-end Express server on http://localhost:3000.
