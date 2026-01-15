export default function DetailedView({ image, onClose }) {
  return (
    <div className="detailed-view">
      <button className="close-btn" onClick={onClose}>✕</button>

      {/* Image or Video */}
      {image.media_type === 'image' ? (
        <div className="detail-image-container">
          <img src={image.url} alt={image.title} className="detail-image" />
        </div>
      ) : (
        <div className="apod-video-container">
          <iframe
            src={image.url}
            title={image.title}
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="detail-content">
        {/* Title */}
        <h1 className="detail-title">{image.title}</h1>

        {/* Metadata */}
        <div className="detail-meta">
          <div className="detail-meta-item">
            <span className="detail-meta-label">Date</span>
            <span className="detail-meta-value">
              {new Date(image.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          {image.copyright && (
            <div className="detail-meta-item">
              <span className="detail-meta-label">Copyright</span>
              <span className="detail-meta-value">{image.copyright}</span>
            </div>
          )}

          <div className="detail-meta-item">
            <span className="detail-meta-label">Type</span>
            <span className="detail-meta-value">
              {image.media_type === 'image' ? '🖼️ Image' : '🎬 Video'}
            </span>
          </div>
        </div>

        {/* Explanation */}
        <div className="detail-explanation">
          {image.explanation}
        </div>

        {/* Actions */}
        <div className="apod-actions">
          <a href={image.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            View Original
          </a>
          <a href="https://apod.nasa.gov/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            APOD Website
          </a>
          <button className="btn-secondary" onClick={onClose}>
            Back to Gallery
          </button>
        </div>
      </div>
    </div>
  )
}
