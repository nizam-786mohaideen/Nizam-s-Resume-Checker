import { useRef, useState } from "react";

const maxFileSize = 10 * 1024 * 1024;
const defaultPrompt = "Drop your resume here";

function App() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);

  function selectFile(selectedFile) {
    setError("");
    setSubmission(null);

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

  async function handleAnalyze() {
    if (!file || !jobDescription.trim() || isSubmitting) return;
    setError("");
    setSubmission(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("/api/comparisons", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save your request.");
      setSubmission(result);
    } catch (requestError) {
      setError(requestError.message || "Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              Compare your resume with a job description and get an AI-powered
              match score with practical feedback.
            </p>

            <div className="upload-card">
              <div className="upload-card-heading">
                <span className="upload-step">01</span>
                <div>
                  <h2>Add your resume and job description</h2>
                  <p>Your resume text is sent to Labd to generate your score.</p>
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
                <span className="file-hint">PDF only | Up to 10 MB</span>
              </label>
              <label className="job-description-label" htmlFor="job-description">
                Job description
              </label>
              <textarea
                id="job-description"
                className="job-description-input"
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setError("");
                  setSubmission(null);
                }}
                maxLength={30000}
                rows={5}
                placeholder="Paste the job description here..."
                aria-describedby="upload-error"
              />
              <p className="character-count">{jobDescription.length.toLocaleString()} / 30,000 characters</p>
              <p
                className="upload-error"
                id="upload-error"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
              {submission && (
                <section className="analysis-result" aria-live="polite" aria-label="Resume comparison result">
                  <div className="analysis-result-heading">
                    <span className="analysis-score">{submission.analysis.score}<small>/100</small></span>
                    <div>
                      <strong>Resume match score</strong>
                      <p>{submission.analysis.summary}</p>
                    </div>
                  </div>
                  <div className="analysis-lists">
                    {submission.analysis.matchedSkills.length > 0 && (
                      <div>
                        <h3>Skills that match</h3>
                        <ul>{submission.analysis.matchedSkills.map((skill, index) => <li key={`${skill}-${index}`}>{skill}</li>)}</ul>
                      </div>
                    )}
                    {submission.analysis.missingSkills.length > 0 && (
                      <div>
                        <h3>Skills to build</h3>
                        <ul>{submission.analysis.missingSkills.map((skill, index) => <li key={`${skill}-${index}`}>{skill}</li>)}</ul>
                      </div>
                    )}
                  </div>
                  {submission.analysis.improvements.length > 0 && (
                    <div className="analysis-improvements">
                      <h3>Suggested next steps</h3>
                      <ul>{submission.analysis.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                  )}
                  {submission.analysis.strengths.length > 0 && (
                    <div className="analysis-improvements">
                      <h3>Resume strengths</h3>
                      <ul>{submission.analysis.strengths.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
                    </div>
                  )}
                  {Number.isFinite(submission.creditsPercentLeft) && (
                    <p className="credits-note">Labd allowance: {submission.creditsPercentLeft}% remaining</p>
                  )}
                </section>
              )}

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
                  Resume text is sent to Labd for scoring
                </span>
                <button
                  className="analyze-button"
                  type="button"
                  disabled={!file || !jobDescription.trim() || isSubmitting}
                  onClick={handleAnalyze}
                >
                  {isSubmitting ? "Comparing..." : "Compare my resume"}
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
                EXAMPLE SCORE
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
                  A sample result shows the score and skill feedback you will receive.
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
              Example preview only. Your score appears here after you submit both documents.
            </p>
            <div className="preview-decoration" aria-hidden="true" />
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <span>Made for the next chapter.</span>
        <span>Resume comparison powered by Labd</span>
      </footer>
    </>
  );
}

export default App;
