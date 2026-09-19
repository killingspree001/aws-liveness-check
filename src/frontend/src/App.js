import React, { Suspense } from "react";
import "./App.css";

import Landing from "./Components/Landing";
import Result from "./Components/Result";

// The Amplify liveness SDK is by far the heaviest thing we ship, and it is
// only needed once someone actually starts a check. Keeping it in its own
// chunk means the landing page paints without it.
const FaceLiveness = React.lazy(() => import("./Components/FaceLiveness"));
const preloadCheck = () => import("./Components/FaceLiveness");

const STEPS = ["Intro", "Check", "Result"];

function CheckFallback() {
  return (
    <section className="check">
      <div className="check-head">
        <div>
          <p className="eyebrow">Step two</p>
          <h2 className="check-title">Warming up the camera</h2>
        </div>
      </div>
      <div className="detector-card">
        <div className="detector-state">
          <span className="spinner" />
          <p>Loading the liveness module</p>
        </div>
      </div>
    </section>
  );
}

function App() {
  // landing -> check -> result
  const [view, setView] = React.useState("landing");
  const [analysis, setAnalysis] = React.useState(null);

  const startCheck = () => {
    setAnalysis(null);
    setView("check");
  };

  const handleAnalysis = (data) => {
    // A failed check still deserves the result screen, and it arrives with a
    // Status but often no confidence score at all.
    if (data && data.Status) {
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
        {view === "landing" && <Landing onStart={startCheck} onWarm={preloadCheck} />}
        {view === "check" && (
          <Suspense fallback={<CheckFallback />}>
            <FaceLiveness faceLivenessAnalysis={handleAnalysis} onCancel={goHome} />
          </Suspense>
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
  );
}

export default App;
