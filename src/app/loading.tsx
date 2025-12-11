export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring spinner-ring-1"></div>
          <div className="spinner-ring spinner-ring-2"></div>
          <div className="spinner-ring spinner-ring-3"></div>
          <div className="spinner-dot"></div>
        </div>
        <div className="loading-text">
          <span className="loading-text-char">L</span>
          <span className="loading-text-char">o</span>
          <span className="loading-text-char">a</span>
          <span className="loading-text-char">d</span>
          <span className="loading-text-char">i</span>
          <span className="loading-text-char">n</span>
          <span className="loading-text-char">g</span>
          <span className="loading-text-char">.</span>
          <span className="loading-text-char">.</span>
          <span className="loading-text-char">.</span>
        </div>
      </div>
    </div>
  )
}
