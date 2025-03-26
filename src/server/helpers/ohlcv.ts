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
  white: 'rgba(255, 255, 255, 1)',
}

type ChartProps = {
  data: CanvasData,
  isPositive?: boolean,
  isAnimeBackground?: boolean,
}

export function getCanvas({data = [], isPositive = false, isAnimeBackground = false}: ChartProps): { data: Canvas, width: number, start: number } {
  if (!data.length) {
    return {
      data: createCanvas(0, 0),
      width: 0,
      start: 117,
    }
  }

  const barWidth = 17;
  const limitedData = data.length > 24 ? data.slice(-24) : data;
  const chartWidth = Math.min(584, limitedData.length * (barWidth + 7) + (data.length > 24 ? 16 : 0));
  const first = limitedData[0];
  const start = first.open > first.close ? first.high : first.low;
  const maxPrice = Math.max(...limitedData.map(d => d.high));
  const minPrice = Math.min(...limitedData.map(d => d.low));
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

  const neutralColor = isAnimeBackground ? colors.white : colors.neutral;
  const upColor = isPositive ? colors.positive : neutralColor;
  const downColor = isPositive ? neutralColor : colors.negative;
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, width, height);

  // Draw OHLC bars
  limitedData.forEach((d, i) => {
    const x = i * (barWidth + 7); // with margin
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
