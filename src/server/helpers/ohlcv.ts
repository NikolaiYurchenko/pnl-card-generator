import { Canvas, createCanvas } from "canvas";

const colors = {
  positive: 'rgba(180, 229, 89, 1)',
  neutral: 'rgba(54, 59, 67, 1)',
  negative: 'rgba(220, 87, 91, 1)',
  white: 'rgba(255, 255, 255, 1)',
};

const canvasConfig = {
  barWidth: 16,
  maxDataEntriesLength: 25,
  maxChartWidth: 568,
  maxChartHeight: 235,
  barMargin: 7,
  wicksWidth: 2,
};

type CanvasData = Array<{
  timestamp_secs: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number
}>;

type ChartProps = {
  data: CanvasData,
  isPositive?: boolean,
  isAnimeBackground?: boolean,
};

type CanvasReturnType = { data: Canvas, width: number, start: number };

export function getCanvas({data = [], isPositive = false, isAnimeBackground = false}: ChartProps): CanvasReturnType {
  if (!data.length) {
    return {
      data: createCanvas(0, 0),
      width: 0,
      start: Math.floor(canvasConfig.maxChartHeight/2),
    }
  }

  const barWidth = canvasConfig.barWidth;
  const limitedData = data.length > canvasConfig.maxDataEntriesLength ? data.slice(-canvasConfig.maxDataEntriesLength) : data;
  const chartWidth = Math.min(canvasConfig.maxChartWidth, limitedData.length * (barWidth + canvasConfig.barMargin) - canvasConfig.barMargin);
  const first = limitedData[0];
  const start = first.open > first.close ? first.high : first.low;
  const maxPrice = Math.max(...limitedData.map(d => d.high));
  const minPrice = Math.min(...limitedData.map(d => d.low));
  const startFormatted = ((maxPrice - start) / (maxPrice - minPrice)) * canvasConfig.maxChartHeight;
  const chartHeight = canvasConfig.maxChartHeight;
  const width = chartWidth;
  const height = chartHeight;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Can't find canvas context");
  }

  // Define scaling functions
  const yScale = (price: number) => chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;

  const neutralColor = isAnimeBackground ? colors.white : colors.neutral;
  const upColor = isPositive ? colors.positive : neutralColor;
  const downColor = isPositive ? neutralColor : colors.negative;
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, width, height);

  // Draw OHLC bars
  limitedData.forEach((d, i) => {
    const x = i * (barWidth + canvasConfig.barMargin);
    const isUp = d.close >= d.open;
    const color = isUp ? upColor : downColor;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = canvasConfig.wicksWidth;

    // Draw OHLC bar
    const openY = yScale(d.open);
    const closeY = yScale(d.close);
    const highY = yScale(d.high);
    const lowY = yScale(d.low);

    // Candle body
    ctx.fillRect(x, Math.min(openY, closeY), barWidth, Math.abs(closeY - openY) || 1);

    // Wicks
    ctx.beginPath();
    ctx.moveTo(x + barWidth / 2, highY);
    ctx.lineTo(x + barWidth / 2, lowY);
    ctx.stroke();
  });

  return {
    data: canvas,
    width: chartWidth,
    start: Math.floor(startFormatted),
  };
}
