export default function DetailedView({ image, onClose, isFavorite, onToggleFavorite }) {
  const downloadImage = async () => {
    if (!image || image.media_type !== 'image') return
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `apod-${image.date}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const copyToClipboard = () => {
    if (!image) return
    const text = `${image.title}\n\n${image.explanation}\n\nDate: ${image.date}${image.copyright ? `\nCopyright: ${image.copyright}` : ''}`
    navigator.clipboard.writeText(text)
    alert('✓ Copied to clipboard!')
  }

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
        {/* Title with Favorite */}
        <div className="title-section">
          <h1 className="detail-title">{image.title}</h1>
          <button 
            className="favorite-btn favorite-btn-large" 
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>

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
            📥 Open Original
          </a>
          {image.media_type === 'image' && (
            <button className="btn-secondary" onClick={downloadImage}>
              💾 Download
            </button>
          )}
          <button className="btn-secondary" onClick={copyToClipboard}>
            📋 Copy Info
          </button>
          <a href="https://apod.nasa.gov/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            🌐 Learn More
          </a>
          <button className="btn-secondary" onClick={onClose}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}
