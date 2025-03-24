import {useState} from "react";

type PNL = {
  name: string;
  pnlSol: number;
  pnlPercent: number;
  profitUsd: number;
  investedUsd: number;
  chartData: string;
  [key: string]: string | number;
};

const TEST_CHART_DATA = JSON.stringify([
  { "timestamp_secs": 1742506680, "open": 0.00000026, "high": 0.00000036, "low": 0.000000162, "close": 0.000000173, "volume": 144.52 },
  { "timestamp_secs": 1742506620, "open": 0.000000173, "high": 0.000000183, "low": 0.000000108, "close": 0.000000185, "volume": 52.71 },
  { "timestamp_secs": 1742506560, "open": 0.000000185, "high": 0.000000183, "low": 0.000000108, "close": 0.000000117, "volume": 107.18 },
  { "timestamp_secs": 1742506500, "open": 0.000000117, "high": 0.000000176, "low": 0.000000099, "close": 0.000000133, "volume": 104.96 },
  { "timestamp_secs": 1742506740, "open": 0.000000133, "high": 0.00000054, "low": 0.0000001, "close": 0.00000047, "volume": 125.44 },
]);
const TEST_PNL_DATA = {
  name: "someName2",
  pnlSol: 2104.5,
  pnlPercent: -504.69,
  profitUsd: -14072,
  investedUsd: 14000000.85,
  chartData: TEST_CHART_DATA
};

export function PnlCard2() {
  const [data, setData] = useState<PNL>(TEST_PNL_DATA);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:3000/pnl-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      setImageUrl(imgUrl);
    } else {
      console.error("Failed to generate image");
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setImageUrl(null);
    setData({
      ...data,
      [name as keyof PNL]: isNaN(Number(value)) ? value : parseFloat(value),
    });
  };

  return (
      <div className="container">
        {Object.keys(data).map((key) => (
            <div key={key} className="editor">
              <label className="editor-label">{key}:</label>
              <input
                  type={typeof data[key] === "number" ? "number" : "text"}
                  name={key}
                  value={data[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key}`}
                  className="editor-input"
              />
            </div>
        ))}

        <button onClick={handleGenerateImage}>{loading ? 'Loading...' : 'Generate Image'}</button>

        {imageUrl && !loading && (
            <>
              <a id='download' href={imageUrl} download="pnl-image.png">
                <button>Download</button>
              </a>
              <img src={imageUrl} alt={imageUrl} />
            </>
        )}
      </div>
  );
}
