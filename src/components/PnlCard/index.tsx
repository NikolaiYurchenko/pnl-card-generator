import React, { useState } from "react";
import { SliderComp } from "../SliderComp";

type PNL = {
  name: string;
  pnlSol: number;
  pnlPercent: number;
  profitUsd: number;
  investedUsd: number;
  chartData: string;
  bgType: number;
  customImage: string;
  relativePath: string;
  [key: string]: string | number;
};

export type CardData = {
  imageUrl: string;
  imageName: string;
  chartType: string;
}

type CandleData = {
  timestamp_secs: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const TEST_SHORT_DATA: CandleData[] = [
  { "timestamp_secs": 1742506680, "open": 0.00000018, "high": 0.00000036, "low": 0.000000162, "close": 0.000000173, "volume": 144.52 },
  { "timestamp_secs": 1742506620, "open": 0.000000173, "high": 0.000000183, "low": 0.000000108, "close": 0.000000185, "volume": 52.71 },
  { "timestamp_secs": 1742506560, "open": 0.000000185, "high": 0.000000183, "low": 0.000000108, "close": 0.000000117, "volume": 107.18 },
  { "timestamp_secs": 1742506500, "open": 0.000000117, "high": 0.000000176, "low": 0.000000099, "close": 0.000000133, "volume": 104.96 },
  { "timestamp_secs": 1742506740, "open": 0.000000133, "high": 0.0000004, "low": 0.0000001, "close": 0.00000027, "volume": 125.44 },
];
const TEST_LONG_DATA: CandleData[] = [
  { "timestamp_secs": 1742506680, "open": 0.00000018, "high": 0.00000036, "low": 0.000000162, "close": 0.000000173, "volume": 144.52 },
  { "timestamp_secs": 1742506740, "open": 0.000000209, "high": 0.000000268, "low": 0.000000156, "close": 0.000000212, "volume": 80.52 },
  { "timestamp_secs": 1742506800, "open": 0.000000212, "high": 0.000000252, "low": 0.000000153, "close": 0.000000208, "volume": 124.12 },
  { "timestamp_secs": 1742506860, "open": 0.000000208, "high": 0.000000274, "low": 0.000000148, "close": 0.000000189, "volume": 65.01 },
  { "timestamp_secs": 1742506920, "open": 0.000000189, "high": 0.00000025, "low": 0.000000177, "close": 0.000000187, "volume": 140.61 },
  { "timestamp_secs": 1742506980, "open": 0.000000187, "high": 0.000000206, "low": 0.000000168, "close": 0.000000196, "volume": 86.08 },
  { "timestamp_secs": 1742507040, "open": 0.000000196, "high": 0.000000248, "low": 0.000000181, "close": 0.00000024, "volume": 104.27 },
  { "timestamp_secs": 1742507100, "open": 0.00000024, "high": 0.000000323, "low": 0.000000195, "close": 0.000000231, "volume": 142.11 },
  { "timestamp_secs": 1742507160, "open": 0.000000231, "high": 0.000000249, "low": 0.000000174, "close": 0.000000246, "volume": 71.52 },
  { "timestamp_secs": 1742507220, "open": 0.000000246, "high": 0.000000333, "low": 0.000000205, "close": 0.000000264, "volume": 55.00 },
  { "timestamp_secs": 1742507280, "open": 0.000000264, "high": 0.000000314, "low": 0.00000025, "close": 0.00000029, "volume": 105.96 },
  { "timestamp_secs": 1742507340, "open": 0.00000029, "high": 0.00000034, "low": 0.000000205, "close": 0.000000311, "volume": 72.54 },
  { "timestamp_secs": 1742507400, "open": 0.000000311, "high": 0.000000411, "low": 0.000000229, "close": 0.000000253, "volume": 60.85 },
  { "timestamp_secs": 1742507460, "open": 0.000000253, "high": 0.000000286, "low": 0.000000233, "close": 0.000000278, "volume": 59.43 },
  { "timestamp_secs": 1742507520, "open": 0.000000278, "high": 0.000000313, "low": 0.000000198, "close": 0.000000261, "volume": 137.92 },
  { "timestamp_secs": 1742507580, "open": 0.000000261, "high": 0.000000323, "low": 0.000000201, "close": 0.000000299, "volume": 131.30 },
  { "timestamp_secs": 1742507640, "open": 0.000000299, "high": 0.000000375, "low": 0.000000266, "close": 0.000000277, "volume": 74.02 },
  { "timestamp_secs": 1742507700, "open": 0.000000277, "high": 0.000000312, "low": 0.000000235, "close": 0.00000026, "volume": 74.76 },
  { "timestamp_secs": 1742507760, "open": 0.00000026, "high": 0.000000317, "low": 0.000000212, "close": 0.000000312, "volume": 86.08 },
  { "timestamp_secs": 1742507820, "open": 0.000000312, "high": 0.000000465, "low": 0.000000265, "close": 0.000000328, "volume": 87.63 },
  { "timestamp_secs": 1742507880, "open": 0.000000328, "high": 0.000000391, "low": 0.000000269, "close": 0.00000034, "volume": 116.97 },
  { "timestamp_secs": 1742507940, "open": 0.00000034, "high": 0.00000044, "low": 0.000000309, "close": 0.000000391, "volume": 146.22 },
  { "timestamp_secs": 1742508000, "open": 0.000000391, "high": 0.000000515, "low": 0.000000348, "close": 0.000000476, "volume": 117.62 },
  { "timestamp_secs": 1742508060, "open": 0.000000476, "high": 0.000000592, "low": 0.000000388, "close": 0.000000406, "volume": 124.18 },
  { "timestamp_secs": 1742508120, "open": 0.000000406, "high": 0.000000551, "low": 0.000000287, "close": 0.000000503, "volume": 86.48 },
  { "timestamp_secs": 1742508180, "open": 0.000000503, "high": 0.000000559, "low": 0.000000427, "close": 0.000000431, "volume": 106.17 },
  { "timestamp_secs": 1742508240, "open": 0.000000431, "high": 0.000000506, "low": 0.000000334, "close": 0.000000478, "volume": 69.29 },
];
const TEST_EMPTY_CHART_DATA = JSON.stringify([]);
const TEST_POSITIVE_PARTIAL_CHART_DATA = JSON.stringify(TEST_SHORT_DATA);
const TEST_POSITIVE_MAX_CHART_DATA = JSON.stringify(TEST_LONG_DATA);

const TEST_NEGATIVE_PARTIAL_CHART_DATA = JSON.stringify(TEST_SHORT_DATA.reverse());
const TEST_NEGATIVE_MAX_CHART_DATA = JSON.stringify(TEST_LONG_DATA.reverse());

const TEST_PNL_DATA = {
  name: "someName2",
  pnlSol: 2104.5,
  pnlPercent: -504.69,
  profitUsd: -14072,
  investedUsd: 14000000.85,
  bgType: 0,
  chartData: TEST_EMPTY_CHART_DATA,
  customImage: '',
  relativePath: 'pnl_cards/chau14',
};

const backgrounds = [
  { label: 'Default', value: 0 },
  { label: 'Attack on Titans', value: 1 },
  { label: 'Jujutsu Kaisen', value: 2 },
  { label: 'Spy Family', value: 3 },
  { label: 'Spirited Away', value: 4 },
]

const chartDataOptions = [
  { label: 'Empty', value: TEST_EMPTY_CHART_DATA },
  { label: 'Positive partial', value: TEST_POSITIVE_PARTIAL_CHART_DATA },
  { label: 'Positive max', value: TEST_POSITIVE_MAX_CHART_DATA },
  { label: 'Negative partial', value: TEST_NEGATIVE_PARTIAL_CHART_DATA },
  { label: 'Negative max', value: TEST_NEGATIVE_MAX_CHART_DATA },
]

export function PnlCard() {
  const [data, setData] = useState<PNL>(TEST_PNL_DATA);
  const [cardData, setCardData] = useState<Array<CardData>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bgFile, setBgFile] = useState<File | null>(null);

  const clearCustomBackground = () => {
    setBgFile(null);
    setData({ ...data, customImage: '' });
    const inputElement = document.getElementById("image-upload") as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  }

  const handleGenerateImage = async () => {
    setLoading(true);
    const response = await fetch("https://5e40-84-151-16-115.ngrok-free.app/pnl-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      const chartType = chartDataOptions.find((cd) => cd.value === data.chartData)?.label;
      const imageName = data.customImage ? bgFile?.name : backgrounds.find((bg) => bg.value === data.bgType)?.label;
      setCardData([...cardData, { imageUrl: imgUrl, imageName: imageName || '', chartType: chartType || '' }]);
      clearCustomBackground();
    } else {
      console.error("Failed to generate image");
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name as keyof PNL]: isNaN(Number(value)) ? value : parseFloat(value),
    });
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    const selectedBackground = backgrounds.find((bg) => bg.value === value);
    if (selectedBackground) setData({ ...data, bgType: selectedBackground.value });
  };

  const handleChartDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selectedChartData = chartDataOptions.find((cd) => cd.value === value);
    if (selectedChartData) setData({ ...data, chartData: selectedChartData.value });
  };

  const resizeImage = (file: File, width: number, height: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          // Calculate aspect ratios
          const imgRatio = img.width / img.height;
          const targetRatio = width / height;

          let drawWidth;
          let drawHeight;
          let offsetX = 0;
          let offsetY = 0;

          // Adjust dimensions to "cover"
          if (imgRatio > targetRatio) {
            drawHeight = height;
            drawWidth = img.width * (height / img.height);
            offsetX = (width - drawWidth) / 2;
          } else {
            drawWidth = width;
            drawHeight = img.height * (width / img.width);
            offsetY = (height - drawHeight) / 2;
          }

          // Draw image (cover behavior)
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          resolve(canvas.toDataURL("image/png"));
      }};

      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      console.error("Please upload an image file.");
      clearCustomBackground();
      return;
    }

    setBgFile(file);
    const resizedImage = await resizeImage(file, 600, 800);
    setData((prev) => ({ ...prev, customImage: resizedImage }));
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      await handleImageUpload(e.target.files[0]);
    }
  };

  // Drag-and-drop handlers
  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      await handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const notEditableKeyByDefault = ['bgType', 'chartData', 'customImage', 'relativePath'];

  return (
      <div className="container">
        {Object.keys(data).map((key) => (
            (!notEditableKeyByDefault.includes(key)) ? <div key={key} className="editor">
              <label className="editor-label">{key}:</label>
              <input
                  type="text"
                  name={key}
                  value={data[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key}`}
                  className="editor-input"
              />
            </div> : null
        ))}
        <div className="editorSelect">
          <label className="editor-label">Chart data:</label>
          <select id="background" value={data.chartData} onChange={handleChartDataChange}>
            {chartDataOptions.map((cd) => (
                <option key={cd.value} value={cd.value}>
                  {cd.label}
                </option>
            ))}
          </select>
        </div>

        <div className="editorSelect">
          <label className="editor-label">Background type:</label>
          <select id="background" value={data.bgType} onChange={handleBgChange}>
            {backgrounds.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {bg.label}
                </option>
            ))}
          </select>
        </div>


        <div className="editorSelect">
          <label className="editor-label" htmlFor="image-upload">Or upload a background image:</label>
          <input className="fileInput" id="image-upload" type="file" accept="image/*" onChange={onFileChange}/>
        </div>
        <div
            onDrop={onDrop}
            onDragOver={preventDefaults}
            onDragEnter={preventDefaults}
            className="dropArea"
        >
          {bgFile?.name ? bgFile?.name : 'Drag & drop an image here'}
          <p className="clearButton" onClick={clearCustomBackground}>Reset</p>
        </div>

        <div className="generateButton">
          <button onClick={handleGenerateImage}>{loading ? 'Loading...' : 'Generate Image'}</button>
        </div>

        <div className="carousel">
          {
              cardData.length > 0 && cardData.length < 2 && <>
                {cardData.map((cd) => (
                    <div key={cd.imageUrl} className="imagePreviewSlide fixedCard">
                      <img className="imagePreviewSlideImage fixedCard" src={cd.imageUrl} alt={cd.imageUrl}/>
                      <a id='downloadButton' href={cd.imageUrl} download="pnl-image.png">
                        Download
                      </a>
                    </div>
                ))}
            </>
          }
          {cardData.length > 1 && (
              <SliderComp
                  autoplay={false}
                  autoplaySpeed={3000}
                  slideNum={1}
                  data={cardData}
              />
          )}
        </div>
      </div>
  );
}
