import React from "react";
import { Amplify } from "aws-amplify";
import { ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

import Landing from "./Components/Landing";
import FaceLiveness from "./Components/FaceLiveness";
import Result from "./Components/Result";
import awsexports from "./aws-exports";

Amplify.configure(awsexports);

const STEPS = ["Intro", "Check", "Result"];

function App() {
  // landing -> check -> result
  const [view, setView] = React.useState("landing");
  const [analysis, setAnalysis] = React.useState(null);

  const startCheck = () => {
    setAnalysis(null);
    setView("check");
  };

  const handleAnalysis = (data) => {
    if (data && data.Confidence !== undefined) {
      setAnalysis(data);
      setView("result");
    }
  };

  const goHome = () => {
    setAnalysis(null);
    setView("landing");
  };

  const stepIndex = view === "landing" ? 0 : view === "check" ? 1 : 2;

  return (
    <ThemeProvider>
      <div className="shell">
        <header className="topbar">
          <button className="wordmark" onClick={goHome} aria-label="Back to start">
            <span className="wordmark-dot" />
            Liveness<em>Lab</em>
          </button>
          <ol className="steps" aria-label="Progress">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={
                  i === stepIndex ? "step is-current" : i < stepIndex ? "step is-done" : "step"
                }
              >
                <span className="step-num">0{i + 1}</span>
                <span className="step-label">{label}</span>
              </li>
            ))}
          </ol>
        </header>

        <main className="stage">
          {view === "landing" && <Landing onStart={startCheck} />}
          {view === "check" && (
            <FaceLiveness faceLivenessAnalysis={handleAnalysis} onCancel={goHome} />
          )}
          {view === "result" && (
            <Result analysis={analysis} onRetry={startCheck} onHome={goHome} />
          )}
        </main>

        <footer className="foot">
          <span>Powered by Amazon Rekognition Face Liveness</span>
          <span className="foot-region">us-east-1</span>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
