import React from "react";

const STEPS = [
  {
    n: "01",
    title: "Allow your camera",
    text: "We only use it for a few seconds and nothing is stored on this device.",
  },
  {
    n: "02",
    title: "Fit your face in the oval",
    text: "Hold still, keep good lighting, and follow the on screen prompts.",
  },
  {
    n: "03",
    title: "Get a confidence score",
    text: "Rekognition tells us how sure it is that a real person is present.",
  },
];

function Landing({ onStart }) {
  return (
    <section className="landing">
      <div className="landing-copy">
        <p className="eyebrow">Selfie liveness check</p>
        <h1 className="headline">
          Prove you are a <span className="headline-accent">real person,</span>
          <br />
          not a photo of one.
        </h1>
        <p className="lede">
          A short video selfie is enough to tell a live human from a printed
          picture, a screen replay or a mask. It takes about ten seconds and
          runs in your browser against AWS.
        </p>

        <div className="cta-row">
          <button className="btn btn-primary" onClick={onStart}>
            Start liveness check
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="cta-note">Camera permission is requested on the next screen.</span>
        </div>

        <ol className="how">
          {STEPS.map((s) => (
            <li key={s.n} className="how-item">
              <span className="how-num">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="landing-art" aria-hidden="true">
        <div className="scan-frame">
          <svg viewBox="0 0 320 400" className="scan-svg">
            <defs>
              <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#d6ff4b" stopOpacity="0" />
                <stop offset="0.5" stopColor="#d6ff4b" stopOpacity="0.9" />
                <stop offset="1" stopColor="#d6ff4b" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse cx="160" cy="200" rx="118" ry="160" className="scan-oval" />
            <ellipse cx="160" cy="200" rx="98" ry="138" className="scan-oval scan-oval-inner" />
            <g className="scan-face">
              <circle cx="128" cy="180" r="4" />
              <circle cx="192" cy="180" r="4" />
              <path d="M138 250 Q160 268 182 250" />
              <path d="M160 190 L154 222 L166 222" />
            </g>
            <rect x="30" y="0" width="260" height="60" fill="url(#beam)" className="scan-beam" />
            <g className="scan-corners">
              <path d="M22 60 V22 H60" />
              <path d="M260 22 H298 V60" />
              <path d="M298 340 V378 H260" />
              <path d="M60 378 H22 V340" />
            </g>
          </svg>
          <div className="scan-readout">
            <span>tracking</span>
            <span className="scan-readout-val">face 1 of 1</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
