import React from "react";

function Result({ analysis, onRetry, onHome }) {
  const confidence = Number(analysis.Confidence || 0);
  const live = analysis.Status === "SUCCEEDED" && confidence >= 90;
  const image = analysis.ReferenceImage && analysis.ReferenceImage.Bytes;

  return (
    <section className="result">
      <div className="result-photo">
        {image ? (
          <img src={"data:image/jpeg;base64," + image} alt="Reference selfie captured during the check" />
        ) : (
          <div className="result-photo-empty">No reference image returned</div>
        )}
        <span className={live ? "badge badge-live" : "badge badge-fail"}>
          {live ? "Live person" : "Not verified"}
        </span>
      </div>

      <div className="result-copy">
        <p className="eyebrow">Step three</p>
        <h2 className="result-title">
          {live ? "You are real. Nice." : "We could not confirm liveness."}
        </h2>

        <div className="score">
          <span className="score-val">
            {confidence.toFixed(1)}
            <small>%</small>
          </span>
          <span className="score-label">confidence</span>
          <div className="score-bar">
            <div className="score-fill" style={{ width: Math.min(confidence, 100) + "%" }} />
          </div>
        </div>

        <dl className="meta">
          <div>
            <dt>Status</dt>
            <dd>{analysis.Status}</dd>
          </div>
          <div>
            <dt>Session</dt>
            <dd className="mono">{analysis.SessionId}</dd>
          </div>
        </dl>

        <div className="cta-row">
          <button className="btn btn-primary" onClick={onRetry}>
            Run another check
          </button>
          <button className="btn btn-ghost" onClick={onHome}>
            Back to start
          </button>
        </div>
      </div>
    </section>
  );
}

export default Result;
