import {Canvas, createCanvas} from "canvas";

type CanvasData = Array<{
  timestamp_secs: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume: number
}>;

const colors = {
  positive: 'rgba(180, 229, 89, 1)',
  neutral: 'rgba(54, 59, 67, 1)',
  negative: 'rgba(220, 87, 91, 1)',
}

export function getCanvas(data: CanvasData, isPositive?: boolean): { data: Canvas, width: number, start: number } {
  if (!data.length) {
    return {
      data: createCanvas(0, 0),
      width: 0,
      start: 117,
    }
  }

  const barWidth = 16;
  const chartWidth = Math.min(584, data.length * barWidth);
  const first = data[0];
  const start = first.open > first.close ? first.high : first.low;
  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const startFormatted = ((maxPrice - start) / (maxPrice - minPrice)) * 235;
  const chartHeight = 235;
  const width = chartWidth;
  const height = chartHeight;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Can't find canvas context");
  }

  // Define scaling functions
  const yScale = (price: number) => chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;

  const upColor = isPositive ? colors.positive : colors.neutral;
  const downColor = isPositive ? colors.neutral : colors.negative;
  ctx.fillStyle = "rgba(27, 30, 34, 1)";
  ctx.fillRect(0, 0, width, height);

  // Draw OHLC bars
  data.forEach((d, i) => {
    const x = i * barWidth;
    const isUp = d.close >= d.open;
    const color = isUp ? upColor : downColor;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

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
