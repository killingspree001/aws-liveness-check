import React, { useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";

const endpoint = process.env.REACT_APP_ENV_API_URL || "";

function FaceLiveness({ faceLivenessAnalysis, onCancel }) {
  const [sessionId, setSessionId] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [fetching, setFetching] = React.useState(false);

  // Ask the backend for a fresh session when this screen opens
  useEffect(() => {
    let cancelled = false;
    const createSession = async () => {
      try {
        const res = await fetch(endpoint + "createfacelivenesssession");
        const data = await res.json();
        if (!cancelled) setSessionId(data.sessionId);
      } catch (e) {
        if (!cancelled) setError("Could not start a session. Check that the backend is deployed.");
      }
    };
    createSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAnalysisComplete = async () => {
    setFetching(true);
    try {
      const res = await fetch(endpoint + "getfacelivenesssessionresults", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ sessionid: sessionId }),
      });
      const data = await res.json();
      faceLivenessAnalysis(data.body);
    } catch (e) {
      setError("The check finished but the result could not be fetched.");
    } finally {
      setFetching(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    const msg = err && err.error ? err.error.message || String(err.error) : null;
    setError(msg || "Something went wrong with the camera check.");
  };

  let body;
  if (error) {
    body = (
      <div className="detector-state">
        <p className="detector-error">{error}</p>
        <button className="btn btn-primary" onClick={onCancel}>
          Back to start
        </button>
      </div>
    );
  } else if (!sessionId || fetching) {
    body = (
      <div className="detector-state">
        <span className="spinner" />
        <p>{fetching ? "Scoring your selfie" : "Preparing a secure session"}</p>
      </div>
    );
  } else {
    body = (
      <FaceLivenessDetector
        sessionId={sessionId}
        region={process.env.REACT_APP_REGION || "us-east-1"}
        onAnalysisComplete={handleAnalysisComplete}
        onUserCancel={onCancel}
        onError={handleError}
      />
    );
  }

  return (
    <section className="check">
      <div className="check-head">
        <div>
          <p className="eyebrow">Step two</p>
          <h2 className="check-title">Look into the camera</h2>
          <p className="check-hint">
            Center your face in the oval and keep still. The screen will flash a few colours,
            that is normal.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <div className="detector-card">{body}</div>
    </section>
  );
}

export default FaceLiveness;
