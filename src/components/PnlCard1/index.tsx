import {useState} from "react";

type PNL = {
  name: string;
  pnlSol: number;
  pnlUsd: number;
  return: number;
  investedSol: number;
  [key: string]: string | number;
};

const TEST_DATA: PNL = {
  name: "melania1",
  pnlSol: -2104.5,
  pnlUsd: -413284.38,
  return: -14072,
  investedSol: 14.85,
};

export function PnlCard1() {
  const [data, setData] = useState<PNL>(TEST_DATA);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:3000/generate-image", {
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
              <img className="imagePreview1" src={imageUrl} alt={imageUrl} />
            </>
        )}
      </div>
  );
}
