import {useRef, useState} from 'react';
import html2canvas from 'html2canvas';
import './App.css';

type PNL = {
  name: string;
  pnlSol: number;
  pnlUsd: number;
  return: number;
  investedSol: number;
  [key: string]: string | number;
}

const TEST_DATA: PNL = {
  name: 'melania',
  pnlSol: -2104.5,
  pnlUsd: -413284.38,
  return: -14072,
  investedSol: 14.85
}
const THOUSAND = 1000;

function App() {
  const [data, setData] = useState<PNL>(TEST_DATA);
  const hiddenRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  const formatToString = (val: number) => {
    let value = val;

    if (val >= THOUSAND || val <= -THOUSAND) {
      value = Math.trunc(val);
    }

    return {
      value: `${ val < 0 ? '' : '+' }${Number(value).toLocaleString("en-US")}`,
      isNegative: val < 0,
    }
  }

  const captureAndDownload = async () => {
    setIsVisible(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (hiddenRef.current) {
      html2canvas(hiddenRef.current).then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${data.name.toLowerCase()}-pnl.png`;
        link.click();
        setIsVisible(false);
      });
    }
  }

  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name as keyof PNL]: isNaN(Number(value)) ? value : parseFloat(value),
    });
  };

  const getNameFontSize = () => {
    const config = {
      maxSize: 120,
      minSize: 10,
      letterSpacing: .5,
    };

    const containerWidth = 567;
    const nameLength = data.name.length;

    if (nameLength < 5) {
      return `${config.maxSize}px`;
    }

    const spacingInPixels = config.letterSpacing * 16 * (nameLength - 2);

    const fontSize = Math.max(
      config.minSize,
      Math.min(config.maxSize, (containerWidth - spacingInPixels) / (nameLength * 1.2))
    );

    return `${fontSize}px`;
  }

  return (
    <>
      <div className="container">
        <div
            ref={hiddenRef}
            id="capture"
            className={`${isVisible ? "visible" : "hidden"} ${ formatToString(data.pnlSol).isNegative ? 'negative' : 'positive' }`}
        >
          <div className="captureContainer">
            <div className="tokenNameContainer">
              <p
                className="tokenName"
                style={{fontSize: getNameFontSize(),}}
              >{data.name.toUpperCase()}</p>
            </div>
            <p className="pnlSol">{formatToString(data.pnlSol).value}</p>
            <p className="pnlUsd">{formatToString(data.pnlUsd).value}</p>
            <p className="return">{`${formatToString(data.return).value}%`}</p>
            <p className="investedSol">{data.investedSol}</p>
          </div>
        </div>
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
        <button onClick={captureAndDownload}>Download as PNG</button>
      </div>
    </>
  )
}

export default App
