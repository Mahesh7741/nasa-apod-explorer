import { useState, useEffect } from 'react'

export default function RecentGallery({ onSelectImage }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [count, setCount] = useState(10)

  useEffect(() => {
    fetchRecentImages()
  }, [count])

  const fetchRecentImages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
        `http://localhost:8080/api/apod/recent?count=${count}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const data = await response.json()
      setImages(Array.isArray(data) ? data : [data])
    } catch (err) {
      setError(err.message || 'Failed to fetch recent APODs')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="recent-gallery">
        <div className="loading">
          <div className="spinner"></div>
          Loading gallery...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="recent-gallery">
        <div className="error">
          <p>❌ {error}</p>
          <button className="btn-primary" onClick={fetchRecentImages} style={{ marginTop: '15px' }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="recent-gallery">
      <div className="gallery-header">
        <h2>Recent APOD Gallery</h2>
        <p>Explore the latest astronomy pictures</p>
      </div>

      {/* Load More Controls */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {[5, 10, 20, 30].map((c) => (
          <button
            key={c}
            className={`nav-btn ${count === c ? 'active' : ''}`}
            onClick={() => setCount(c)}
          >
            Load {c}
          </button>
        ))}
      </div>

      {images.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', opacity: 0.6 }}>
          <p>No images found</p>
        </div>
      ) : (
        <>
          <div className="gallery-grid">
            {images.map((image, index) => (
              <div
                key={index}
                className="gallery-item-card"
                onClick={() => onSelectImage(image)}
              >
                {image.media_type === 'image' ? (
                  <img
                    src={image.url}
                    alt={image.title}
                    className="gallery-item-image"
                  />
                ) : (
                  <div className="gallery-item-image" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(102, 126, 234, 0.1)',
                    fontSize: '2em'
                  }}>
                    🎬
                  </div>
                )}
                <div className="gallery-item-title" title={image.title}>
                  {image.title}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <p>Showing {images.length} images • Click on any image to view details</p>
          </div>
        </>
      )}
    </div>
  )
}
