// src/App.tsx
import { useState } from 'react';
import './App.css';

function App() {
  // Page state
  const [currentPage, setCurrentPage] = useState(4); // Start on Page 4 as per your request

  // Page 8 states
  const [sceneTitle, setSceneTitle] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [duration, setDuration] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle reference upload
  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onload = (event) => setReferencePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Generate video
  const handleGenerateClip = () => {
    if (!sceneDescription.trim()) {
      alert("Please enter a scene description.");
      return;
    }
    setIsGenerating(true);

    console.log("Generating with reference:", {
      title: sceneTitle,
      description: sceneDescription,
      reference: referenceImage?.name || "None",
      duration
    });

    setTimeout(() => {
      alert("✅ Video clip generation started with reference materials!");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="studio-app">
      <header>
        <h1>MANDA STRONG STUDIO</h1>
        <p>🎬 CINEMA INTELLIGENCE PLATFORM • 2026</p>
      </header>

      {/* ==================== PAGE 4 - PROJECT HISTORY ==================== */}
      {currentPage === 4 && (
        <div className="page">
          <h2>YOUR PROJECTS</h2>
          <p>Load a previous project or start new.</p>

          <div className="projects-list">
            <button className="project-btn">AI For Humanity - Full Film</button>
            <button className="project-btn">Chapter 1 Test Render</button>
            <button className="project-btn">Climate Scene Draft</button>
          </div>

          <button 
            className="open-project-btn"
            onClick={() => setCurrentPage(8)}
          >
            OPEN PROJECT
          </button>
        </div>
      )}

      {/* ==================== PAGE 8 - VIDEO GENERATOR ==================== */}
      {currentPage === 8 && (
        <div className="page">
          <h2>🎬 VIDEO GENERATOR — PROFESSIONAL CINEMA STUDIO</h2>

          <div className="input-group">
            <label>SCENE TITLE</label>
            <input
              type="text"
              placeholder="e.g. Chapter 1 — Who Are These Hairless Apes"
              value={sceneTitle}
              onChange={(e) => setSceneTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>DESCRIBE YOUR SCENE</label>
            <textarea
              placeholder="Paste your full scene description / narration here..."
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              rows={10}
            />
          </div>

          {/* UPLOAD REFERENCE BUTTON - NORMAL SIZE, ABOVE GENERATE */}
          <div className="input-group">
            <label>REFERENCE MATERIALS</label>
            <button 
              className="upload-reference-btn"
              onClick={() => document.getElementById('ref-upload')?.click()}
            >
              📤 Upload Reference Materials
            </button>
            <input
              id="ref-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleReferenceUpload}
            />

            {referencePreview && (
              <div className="preview-small">
                <p>Reference loaded</p>
                <img src={referencePreview} alt="ref" />
              </div>
            )}
          </div>

          <div className="input-group">
            <label>DURATION</label>
            <input
              type="range"
              min="30"
              max="180"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <span>{duration} seconds</span>
          </div>

          {/* GENERATE BUTTON */}
          <button 
            className="generate-btn"
            onClick={handleGenerateClip}
            disabled={isGenerating || !sceneDescription.trim()}
          >
            {isGenerating ? "🎬 Generating..." : "🎬 GENERATE VIDEO CLIP"}
          </button>
        </div>
      )}

      {/* ==================== THANK YOU PAGE WITH BACKGROUND VIDEO ==================== */}
      {currentPage === 23 && (
        <div className="thankyou-page">
          <video 
            className="background-video" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>

          <div className="thankyou-content">
            <h1>Thank You</h1>
            <p>Your project has been saved successfully.</p>
            <button onClick={() => setCurrentPage(4)}>Back to Projects</button>
          </div>
        </div>
      )}

      <footer>
        MANDASTRONG STUDIO 2026 • PROFESSIONAL CINEMA SYNTHESIS • MandaStrong1.Etsy.com
      </footer>
    </div>
  );
}

export default App;