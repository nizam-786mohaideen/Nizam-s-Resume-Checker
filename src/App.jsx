import { useRef, useState } from "react";

const maxFileSize = 10 * 1024 * 1024;
const defaultPrompt = "Drop your resume here";

function App() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(selectedFile) {
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setError("Please choose a PDF file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setFile(null);
      setError("That file is over 10 MB. Please choose a smaller PDF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
  }

  function handleFileChange(event) {
    selectFile(event.currentTarget.files?.[0] ?? null);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  function handleAnalyze() {
    if (!file) return;
    setError(
      "This is a visual demo. Resume scoring and skill matching aren't connected yet.",
    );
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Nizam's Resume Checker home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7 3.75h7l5 5V20a.75.75 0 0 1-.75.75h-11.5A.75.75 0 0 1 6 20V4.75A1 1 0 0 1 7 3.75Z" />
              <path d="M14 4v5h5M9 14h6M9 17h6" />
              <path d="m9 10.5 1.25 1.25L13 9" />
            </svg>
          </span>
          <span>
            Nizam&apos;s <strong>Resume Checker</strong>
          </span>
        </a>
        <span className="header-note">
          <span className="status-dot" />
          Your next opportunity starts here
        </span>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              A little clarity goes a long way
            </div>
            <h1 id="hero-title">
              Your next role
              <br />
              looks good on <span>you.</span>
            </h1>
            <p className="hero-description">
              See how your resume stacks up. Get a quick score, celebrate the
              skills you have, and spot the ones to work on next.
            </p>

            <div className="upload-card">
              <div className="upload-card-heading">
                <span className="upload-step">01</span>
                <div>
                  <h2>Start with your resume</h2>
                  <p>One PDF is all you need.</p>
                </div>
              </div>

              <label
                className={`drop-zone${isDragging ? " is-dragging" : ""}`}
                htmlFor="resume-file"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  id="resume-file"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  aria-describedby="upload-error"
                />
                <span className="upload-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v4A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-4" />
                  </svg>
                </span>
                <span className="drop-zone-title">
                  {file?.name ?? defaultPrompt}
                </span>
                <span className="drop-zone-subtitle">
                  or <span>browse files</span> on your device
                </span>
                <span className="file-hint">PDF only · Up to 10 MB</span>
              </label>
              <p
                className="upload-error"
                id="upload-error"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>

              <div className="upload-footer">
                <span className="privacy-note">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <rect
                      x="4.25"
                      y="8.25"
                      width="11.5"
                      height="8.5"
                      rx="1.5"
                    />
                    <path d="M6.75 8V5.75a3.25 3.25 0 0 1 6.5 0V8M10 11.5v2" />
                  </svg>
                  Your file stays on your device
                </span>
                <button
                  className="analyze-button"
                  type="button"
                  disabled={!file}
                  onClick={handleAnalyze}
                >
                  Check my resume
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 10h12m0 0-5-5m5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="trust-note">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="m10 2.5 6.25 2.25v4.5c0 3.75-2.5 6.25-6.25 8.25-3.75-2-6.25-4.5-6.25-8.25v-4.5L10 2.5Z" />
                <path d="m7.5 9.75 1.75 1.75 3.5-3.5" />
              </svg>
              No account. No fuss. Just a clearer next step.
            </p>
          </div>

          <aside className="preview" aria-label="Example resume score preview">
            <div className="preview-topline">
              <span className="preview-label">
                <span />
                YOUR SNAPSHOT
              </span>
              <span className="demo-badge">EXAMPLE</span>
            </div>
            <div className="score-wrap">
              <div className="score-ring" aria-label="Example score: 78 out of 100">
                <svg viewBox="0 0 160 160" aria-hidden="true">
                  <circle className="ring-track" cx="80" cy="80" r="69" />
                  <circle className="ring-progress" cx="80" cy="80" r="69" />
                </svg>
                <div className="score-value">
                  <strong>78</strong>
                  <span>/ 100</span>
                </div>
              </div>
              <div className="score-copy">
                <span className="score-kicker">RESUME SCORE</span>
                <h2>A strong start.</h2>
                <p>
                  There’s a lot to like here, with a few more skills to explore.
                </p>
              </div>
            </div>
            <div className="preview-divider" />
            <div className="skills-heading">
              <div>
                <span className="score-kicker">THE SKILLS BREAKDOWN</span>
                <h3>Your toolkit, at a glance.</h3>
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-group-label">
                <span className="skill-label-present">
                  <span />
                  Skills found
                </span>
                <span className="skill-count">05</span>
              </div>
              <div className="skill-chips">
                <span className="skill-chip present">JavaScript</span>
                <span className="skill-chip present">React</span>
                <span className="skill-chip present">Node.js</span>
                <span className="skill-chip present">REST APIs</span>
                <span className="skill-chip present">Git</span>
              </div>
            </div>
            <div className="skill-group missing-group">
              <div className="skill-group-label">
                <span className="skill-label-missing">
                  <span />
                  Skills to consider
                </span>
                <span className="skill-count">04</span>
              </div>
              <div className="skill-chips">
                <span className="skill-chip missing">TypeScript</span>
                <span className="skill-chip missing">AWS</span>
                <span className="skill-chip missing">Docker</span>
                <span className="skill-chip missing">Jest</span>
              </div>
            </div>
            <p className="preview-disclaimer">
              A friendly example of what your results could look like.
            </p>
            <div className="preview-decoration" aria-hidden="true" />
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <span>Made for the next chapter.</span>
        <span>Mock demo · No files are uploaded or analyzed</span>
      </footer>
    </>
  );
}

export default App;
