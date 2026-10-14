import React, { useState, useEffect, useRef } from "react";
import "./Fileviewer.css";

/* Icons  */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);

const IC = {
  close:     ["M18 6L6 18","M6 6l12 12"],
  download:  ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  pdf:       ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6"],
  docx:      ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M9 15h6","M9 11h6"],
  shield:    ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  zoomIn:    ["M11 8v6","M8 11h6","M21 21l-4.35-4.35","M17 11A6 6 0 105 11a6 6 0 0012 0z"],
  zoomOut:   ["M8 11h6","M21 21l-4.35-4.35","M17 11A6 6 0 105 11a6 6 0 0012 0z"],
  fullscreen:["M8 3H5a2 2 0 00-2 2v3","M21 8V5a2 2 0 00-2-2h-3","M3 16v3a2 2 0 002 2h3","M16 21h3a2 2 0 002-2v-3"],
  info:      ["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 8h.01","M11 12h1v4h1"],
  warn:      ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  spinner:   ["M12 2v4","M12 18v4","M4.93 4.93l2.83 2.83","M16.24 16.24l2.83 2.83","M2 12h4","M18 12h4"],
};

const fmtSize = (b) =>
  b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

/* DOCX Viewer using mammoth.js*/
const DocxViewer = ({ file, watermarkId, mode }) => {
  const [html,    setHtml]    = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [zoom,    setZoom]    = useState(100);

  useEffect(() => {
    if (!file?.objectUrl) {
  setError("File not available for preview.");
  setLoading(false);
  return;
}

    /* mammoth.js CDN to load */
    const loadMammoth = () => new Promise((resolve, reject) => {
      if (window.mammoth) { resolve(window.mammoth); return; }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
      script.onload  = () => resolve(window.mammoth);
      script.onerror = () => reject(new Error("Failed to load mammoth.js"));
      document.head.appendChild(script);
    });

    const convert = async () => {
      try {
        setLoading(true); setError("");
        const mammoth = await loadMammoth();
        const response = await fetch(file.objectUrl);
      const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtml(result.value || "<p>No content found in this file.</p>");
      } catch (err) {
        setError("Could not render DOCX. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    convert();
  }, [file]);

  return (
    <div className="fv-docx-wrap" style={{ zoom: zoom / 100 }}>
      {/* Watermark overlay — only in download mode */}
      {mode === "download" && watermarkId && (
        <div className="fv-watermark-overlay">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="fv-wm-text">
              {watermarkId}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="fv-loading">
          <div className="fv-loading-spinner"/>
          <div className="fv-loading-text">Rendering document…</div>
        </div>
      )}

      {error && (
        <div className="fv-error">
          <Icon d={IC.warn} size={28}/>
          <div>{error}</div>
          <div className="fv-error-sub">Try downloading the file to view it locally.</div>
        </div>
      )}

      {!loading && !error && (
        <div className="fv-docx-content" dangerouslySetInnerHTML={{ __html: html }}/>
      )}
    </div>
  );
};

/* PDF Viewer */
const PdfViewer = ({ file, watermarkId, mode }) => {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  if (!file?.objectUrl) {
    return (
      <div className="fv-error">
        <Icon d={IC.warn} size={28}/>
        <div>PDF preview not available.</div>
        <div className="fv-error-sub">Backend se file connect hone ke baad preview milegi.</div>
      </div>
    );
  }

  return (
    <div className="fv-pdf-wrap">
      {/* Watermark overlay */}
      {mode === "download" && watermarkId && (
        <div className="fv-watermark-overlay">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="fv-wm-text">{watermarkId}</div>
          ))}
        </div>
      )}

      {loading && (
        <div className="fv-loading fv-pdf-loading">
          <div className="fv-loading-spinner"/>
          <div className="fv-loading-text">Loading PDF…</div>
        </div>
      )}

      <iframe
        src={file.objectUrl}
        title={file.name}
        className="fv-pdf-iframe"
        style={{ opacity: loading ? 0 : 1 }}
        onLoad={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
      />

      {error && (
        <div className="fv-error">
          <Icon d={IC.warn} size={28}/>
          <div>Could not load PDF.</div>
          <div className="fv-error-sub">Browser may not support this file.</div>
        </div>
      )}
    </div>
  );
};

/* Demo / Mock Viewer */
const MockViewer = ({ file, watermarkId, mode }) => {
  const isPdf = file.type === "application/pdf";

  /* Fake document content for demo */
  const mockContent = isPdf ? (
    <div className="fv-mock-pdf">
      <div className="fv-mock-pdf-page">
        <div className="fv-mock-header">
          <div className="fv-mock-logo">SecureDocs</div>
          <div className="fv-mock-doc-title">{file.name}</div>
        </div>
        <div className="fv-mock-line fv-mock-line-h1"/>
        <div className="fv-mock-line fv-mock-line-h1" style={{width:"60%"}}/>
        <div style={{height:16}}/>
        {[100,85,92,78,88,95,72,83,90,68,85,75].map((w,i) => (
          <div key={i} className="fv-mock-line" style={{width:w+"%"}}/>
        ))}
        <div style={{height:20}}/>
        <div className="fv-mock-line fv-mock-line-h2"/>
        {[95,80,88,65,90,82,75,92,70,85].map((w,i) => (
          <div key={i} className="fv-mock-line" style={{width:w+"%"}}/>
        ))}
        <div style={{height:16}}/>
        {[72,88,60,95,78,83].map((w,i) => (
          <div key={i} className="fv-mock-line" style={{width:w+"%"}}/>
        ))}
        {/* Watermark */}
        {mode === "download" && watermarkId && (
          <div className="fv-watermark-overlay fv-mock-watermark">
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="fv-wm-text">{watermarkId}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="fv-mock-docx">
      <div className="fv-mock-docx-paper">
        <h1 className="fv-mock-docx-h1">{file.name.replace(/\.[^.]+$/, "")}</h1>
        <p className="fv-mock-docx-para">
          This document has been securely shared with you via SecureDocs.
          The content is protected and watermarked with your employee identity.
        </p>
        <h2 className="fv-mock-docx-h2">Section 1</h2>
        <p className="fv-mock-docx-para">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris.
        </p>
        <h2 className="fv-mock-docx-h2">Section 2</h2>
        <p className="fv-mock-docx-para">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
        <ul className="fv-mock-docx-list">
          <li>Point 1 — Important confidential information</li>
          <li>Point 2 — Restricted to authorized employees only</li>
          <li>Point 3 — Do not share outside the organization</li>
        </ul>
        {/* Watermark */}
        {mode === "download" && watermarkId && (
          <div className="fv-watermark-overlay">
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="fv-wm-text">{watermarkId}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return mockContent;
};

/* MAIN FileViewer Component  */
const FileViewer = ({ file, watermarkId, onClose, mode = "view" }) => {
  const [zoom, setZoom]   = useState(100);
  const isPdf             = file?.type === "application/pdf";
  const hasRealFile       = !!(file?.objectUrl || file?.rawFile);

  /* Lock body scroll to open viewer*/
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Keyboard */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const zoomIn  = () => setZoom(z => Math.min(z + 15, 200));
  const zoomOut = () => setZoom(z => Math.max(z - 15, 50));

  return (
    <div className="fv-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fv-modal">

        {/* Top bar*/}
        <div className="fv-topbar">
          <div className="fv-topbar-left">
            <div className={`fv-file-icon-badge ${isPdf ? "fv-badge-pdf" : "fv-badge-docx"}`}>
              <Icon d={isPdf ? IC.pdf : IC.docx} size={16}/>
            </div>
            <div className="fv-file-info">
              <div className="fv-file-name">{file?.name || "Document"}</div>
              <div className="fv-file-meta">
                {isPdf ? "PDF" : "DOCX"}
                {file?.size && <><span className="fv-sep">·</span>{fmtSize(file.size)}</>}
                {mode === "download" && watermarkId &&
                  <><span className="fv-sep">·</span>
                  <span className="fv-wm-chip"><Icon d={IC.shield} size={11}/>{watermarkId}</span></>
                }
              </div>
            </div>
          </div>

          <div className="fv-topbar-actions">
            {/* Zoom controls — only for DOCX */}
            {!isPdf && (
              <div className="fv-zoom-group">
                <button className="fv-icon-btn" onClick={zoomOut} title="Zoom Out" disabled={zoom <= 50}>
                  <Icon d={IC.zoomOut} size={15}/>
                </button>
                <span className="fv-zoom-val">{zoom}%</span>
                <button className="fv-icon-btn" onClick={zoomIn} title="Zoom In" disabled={zoom >= 200}>
                  <Icon d={IC.zoomIn} size={15}/>
                </button>
              </div>
            )}

            {/* Close */}
            <button className="fv-close-btn" onClick={onClose} title="Close (Esc)">
              <Icon d={IC.close} size={17}/>
            </button>
          </div>
        </div>

        {/* Mode indicator strip */}
        {mode === "download" && (
          <div className="fv-mode-strip fv-mode-download">
            <Icon d={IC.shield} size={13}/>
            <span>
              This document is watermarked with your identity.
              {watermarkId && <strong> ID: {watermarkId}</strong>}
            </span>
          </div>
        )}
        {mode === "view" && (
          <div className="fv-mode-strip fv-mode-view">
            <Icon d={IC.info} size={13}/>
            <span>Preview mode — downloading is tracked separately.</span>
          </div>
        )}

        {/* File content */}
        <div className="fv-body">
          {hasRealFile ? (
            isPdf
              ? <PdfViewer file={file} watermarkId={watermarkId} mode={mode}/>
              : <DocxViewer file={file} watermarkId={watermarkId} mode={mode} zoom={zoom}/>
          ) : (
            /* Demo viewer */
            <MockViewer file={file} watermarkId={watermarkId} mode={mode} zoom={zoom}/>
          )}
        </div>

        {/* Bottom bar */}
        <div className="fv-bottombar">
          <div className="fv-bottombar-left">
            {mode === "download" && (
              <div className="fv-wm-info">
                <Icon d={IC.shield} size={13}/>
                <span>Watermark embedded: <code>{watermarkId || "—"}</code></span>
              </div>
            )}
          </div>
          <div className="fv-bottombar-right">
            <button className="fv-btn-secondary" onClick={onClose}>
              <Icon d={IC.close} size={14}/> Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FileViewer;