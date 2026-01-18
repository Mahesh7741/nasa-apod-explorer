import { useState, useEffect } from 'react'

export default function RecentGallery({ onSelectImage, isFavorite, onToggleFavorite }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [count, setCount] = useState(10)
  const [search, setSearch] = useState('')

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

  const filteredImages = images.filter(image =>
    image.title.toLowerCase().includes(search.toLowerCase()) ||
    image.explanation.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="recent-gallery">
        <div className="gallery-header">
          <h2>Recent APOD Gallery</h2>
        </div>
        <div className="gallery-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" style={{ height: '250px' }}>
              <div className="skeleton-image" style={{ height: '100%' }}></div>
            </div>
          ))}
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
      <div className="gallery-controls">
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[5, 10, 20, 30].map((c) => (
            <button
              key={c}
              className={`nav-btn ${count === c ? 'active' : ''}`}
              onClick={() => setCount(c)}
              style={{ padding: '10px 16px', fontSize: '0.9em' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', opacity: 0.6 }}>
          <p>{search ? 'No images match your search' : 'No images found'}</p>
        </div>
      ) : (
        <>
          <div className="gallery-grid">
            {filteredImages.map((image, index) => (
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
                <div className="gallery-item-content">
                  <div className="gallery-item-title" title={image.title}>
                    {image.title}
                  </div>
                  <button 
                    className="gallery-favorite-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(image)
                    }}
                    title={isFavorite(image) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite(image) ? '⭐' : '☆'}
                  </button>
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
            <p>Showing {filteredImages.length} of {images.length} images</p>
          </div>
        </>
      )}
    </div>
  )
}
