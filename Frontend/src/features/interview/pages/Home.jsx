import "../style/home.scss";
import Navbar from "../components/Navbar";
import { useInterview } from "../hooks/useInterview";
import { useState } from "react";
import GeneratingProgress from "../components/GeneratingProgress";
import { useNavigate } from "react-router";
import { useToast } from "../../toast/hooks/useToast";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  MAX_TEXT_LENGTH,
  MAX_FILE_SIZE_MB,
  validateJobDescription,
  validateResumeFile,
  validateProfile,
  formatFileSize
} from "../interviewForm";

const Home = () => {
  const { generating, generateReport, generationStartedAt } = useInterview();
  const [ jobDescription, setJobDescription ] = useState("");
  const [ selfDescription, setSelfDescription ] = useState("");
  const [ resumeFile, setResumeFile ] = useState(null);
  const [ errors, setErrors ] = useState({}); 
  const navigate = useNavigate();
  const { user, checkingSession } = useAuth();
  const { showToast } = useToast();

  const handleJobDescriptionChange = (e) => {
    const value = e.target.value;
    setJobDescription(value);

    if (errors.jobDescription) {
      setErrors(prev => ({ ...prev, jobDescription: validateJobDescription(value) }));
    }
  };

  const handleJobDescriptionBlur = () => {
    setErrors(prev => ({ ...prev, jobDescription: validateJobDescription(jobDescription) }));
  };

  const handleSelfDescriptionChange = (e) => {
    const value = e.target.value;
    setSelfDescription(value);

    if (errors.profile) {
      setErrors(prev => ({ ...prev, profile: validateProfile(resumeFile, value) }));
    }
  };

  const selectFile = (file) => {
    if (!file) return;

    const fileError = validateResumeFile(file);
    if (fileError) {
      setResumeFile(null);
      setErrors(prev => ({ ...prev, profile: fileError }));
      return;
    }

    setResumeFile(file);
    setErrors(prev => ({ ...prev, profile: "" }));
  };

  const handleFileChange = (e) => {
    selectFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    selectFile(e.dataTransfer.files[0]);
  };

  const removeFile = () => {
    setResumeFile(null);
    setErrors(prev => ({ ...prev, profile: "" }));
  };

const handleGenerateReport = async () => {
  if (checkingSession) return;

  if (!user) {
    showToast({ type: "info", message: "Please log in first to generate your interview plan." });
    navigate("/login");
    return;
  }

  const newErrors = {
    jobDescription: validateJobDescription(jobDescription),
    profile: validateProfile(resumeFile, selfDescription)
  };
  setErrors(newErrors);

  if (Object.values(newErrors).some(Boolean)) return;

  const { report, fieldErrors } = await generateReport({
    jobDescription: jobDescription.trim(),
    selfDescription: selfDescription.trim(),
    resumeFile
  });

  if (!report) {
    setErrors({
      jobDescription: fieldErrors.jobDescription || "",
      profile: fieldErrors.profile || fieldErrors.selfDescription || ""
    });
    return;
  }

  if (window.location.pathname === "/") {
    navigate(`/reports/${report._id}`);
  }
};

  return (
    <>
        <Navbar />
        <div className="home-page">
          {generating && <GeneratingProgress startedAt={generationStartedAt} />}
            <div style={{ display: generating ? "none" : "contents" }}>
              <header className="page-header">
                <h1>Create Your Custom <span className="highlight">Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
              </header>

              <div className="interview-card">
                <div className="interview-card__body">
                  <div className="panel panel--left">
                    <div className="panel__header">
                      <span className='panel__icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                      </span>
                      <h2>Target Job Description</h2>
                      <span className="badge badge--required">Required</span>
                    </div>
                    <textarea
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                      onBlur={handleJobDescriptionBlur}
                      className={`panel__textarea ${errors.jobDescription ? "panel__textarea--invalid" : ""}`}
                      placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                      maxLength={MAX_TEXT_LENGTH}
                      aria-invalid={Boolean(errors.jobDescription)}
                    />
                    <div className="field-meta">
                      {errors.jobDescription && <p className="field-error">{errors.jobDescription}</p>}
                      <span className="char-counter">{jobDescription.length} / {MAX_TEXT_LENGTH} chars</span>
                    </div>
                  </div>

                  <div className="panel-divider"></div>

                  <div className="panel panel--right">
                    <div className="panel__header">
                      <span className='panel__icon'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      </span>
                      <h2>Your Profile</h2>
                    </div>

                    <div className="upload-section">
                      <label className="section-label">
                        Upload Resume
                        <span className="badge badge--best">Best Results</span>
                      </label>
                      <label
                        className={`dropzone ${resumeFile ? "dropzone--filled" : ""} ${errors.profile ? "dropzone--invalid" : ""}`}
                        htmlFor="resume"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                      >
                        <span className="dropzone__icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                        </span>

                        {resumeFile ? (
                          <>
                            <p className="dropzone__title dropzone__title--file">{resumeFile.name}</p>
                            <p className="dropzone__subtitle">{formatFileSize(resumeFile.size)} &bull; Click to choose a different file</p>
                          </>
                        ) : (
                          <>
                            <p className="dropzone__title">Click to upload or drag &amp; drop</p>
                            <p className="dropzone__subtitle">PDF only (Max {MAX_FILE_SIZE_MB}MB)</p>
                          </>
                        )}

                        <input
                          type="file"
                          id="resume"
                          name="resume"
                          accept=".pdf,application/pdf"
                          onChange={handleFileChange}
                          hidden
                        />
                      </label>

                      {resumeFile && (
                        <button type="button" className="file-remove" onClick={removeFile}>Remove File</button>
                      )}
                    </div>

                    <div className="or-divider"><span>OR</span></div>

                    <div className="self-description">
                      <label className="section-label" htmlFor="selfDescription">Quick Self-Description</label>
                      <textarea
                        value={selfDescription}
                        onChange={handleSelfDescriptionChange}
                        name="selfDescription"
                        id="selfDescription"
                        className={`panel__textarea panel__textarea--short ${(errors.profile && !resumeFile) ? "panel__textarea--invalid" : ""}`}
                        placeholder={"Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."}
                        maxLength={MAX_TEXT_LENGTH}
                      />
                    </div>

                    {errors.profile && <p className="field-error">{errors.profile}</p>}

                    <div className="info-box">
                      <div className="info-box__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                      </div>
                      <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                    </div>
                  </div>
                </div>

                <div className="interview-card__footer">
                  <span className="footer-info">AI-Powered Strategy Generation &bull; Approx 10s</span>
                  <button onClick={handleGenerateReport} className="generate-btn" disabled={checkingSession}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                    Generate My Interview Strategy
                  </button>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}

export default Home
