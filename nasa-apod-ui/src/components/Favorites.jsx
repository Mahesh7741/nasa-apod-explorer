export default function Favorites({ images, onSelectImage, onRemove }) {
  return (
    <div className="favorites-container">
      <div className="gallery-header">
        <h2>⭐ My Favorites</h2>
        <p>{images.length} saved {images.length === 1 ? 'image' : 'images'}</p>
      </div>

      {images.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '1.1em', marginBottom: '15px' }}>No favorites yet!</p>
          <p style={{ color: 'var(--text-muted)' }}>
            Star your favorite APODs to save them here
          </p>
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
                <div className="gallery-item-content">
                  <div className="gallery-item-title" title={image.title}>
                    {image.title}
                  </div>
                  <button 
                    className="gallery-favorite-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(image)
                    }}
                    title="Remove from favorites"
                  >
                    ⭐
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
            <p>Click any image to view details • Star button to remove</p>
          </div>
        </>
      )}
    </div>
  )
}
