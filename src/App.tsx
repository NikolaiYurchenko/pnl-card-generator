import { useState } from "react";
import "./App.css";
import {PnlCard1} from "./components/PnlCard1";
import {PnlCard2} from "./components/PnlCard2";

const tabs: {[key: string]: { name: string, value: number }} = {
  first: { name: "First Edition", value: 0 },
  second: { name: "Second Edition", value: 1 },
}

function App() {
  const [currentTab, setCurrentTab] = useState<number>(tabs.first.value);

  return (
      <div className="main">
        <header className="main-header">
          {Object.keys(tabs).map((key) => (
              <div key={key} className={`navigationItem ${currentTab === tabs[key].value ? 'active' : ''}`} onClick={() => setCurrentTab(tabs[key].value)}>{tabs[key].name}</div>
          ))}
        </header>
        {
          currentTab === tabs.first.value ? <PnlCard1 /> : <PnlCard2 />
        }
      </div>
  );
}

export default App;
