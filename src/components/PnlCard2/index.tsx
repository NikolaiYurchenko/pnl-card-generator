import {useState} from "react";

type PNL = {
  name: string;
  pnlSol: number;
  pnlPercent: number;
  profitUsd: number;
  investedUsd: number;
  chartData: string;
  bgType: number;
  [key: string]: string | number;
};

const TEST_SHORT_DATA = [
  { "timestamp_secs": 1742506680, "open": 0.00000018, "high": 0.00000036, "low": 0.000000162, "close": 0.000000173, "volume": 144.52 },
  { "timestamp_secs": 1742506620, "open": 0.000000173, "high": 0.000000183, "low": 0.000000108, "close": 0.000000185, "volume": 52.71 },
  { "timestamp_secs": 1742506560, "open": 0.000000185, "high": 0.000000183, "low": 0.000000108, "close": 0.000000117, "volume": 107.18 },
  { "timestamp_secs": 1742506500, "open": 0.000000117, "high": 0.000000176, "low": 0.000000099, "close": 0.000000133, "volume": 104.96 },
  { "timestamp_secs": 1742506740, "open": 0.000000133, "high": 0.0000004, "low": 0.0000001, "close": 0.00000027, "volume": 125.44 },
];
const TEST_LONG_DATA = [
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
  chartData: TEST_EMPTY_CHART_DATA
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

export function PnlCard2() {
  const [data, setData] = useState<PNL>(TEST_PNL_DATA);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
      <div className="container">
        {Object.keys(data).map((key) => (
            (key !== 'bgType' && key !== 'chartData') ? <div key={key} className="editor">
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

        <div className="editor">
          <label className="editor-label">Background type:</label>
          <select id="background" value={data.bgType} onChange={handleBgChange}>
            {backgrounds.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {bg.label}
                </option>
            ))}
          </select>
        </div>

        <div className="editor">
          <label className="editor-label">Chart data:</label>
          <select id="background" value={data.chartData} onChange={handleChartDataChange}>
            {chartDataOptions.map((cd) => (
                <option key={cd.value} value={cd.value}>
                  {cd.label}
                </option>
            ))}
          </select>
        </div>

        <button onClick={handleGenerateImage}>{loading ? 'Loading...' : 'Generate Image'}</button>

        {imageUrl && !loading && (
            <>
              <a id='download' href={imageUrl} download="pnl-image.png">
                <button>Download</button>
              </a>
              <img className="imagePreview2" src={imageUrl} alt={imageUrl}/>
            </>
        )}
      </div>
  );
}
