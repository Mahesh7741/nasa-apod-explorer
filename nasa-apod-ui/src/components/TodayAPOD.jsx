import { useState, useEffect } from 'react'

export default function TodayAPOD() {
  const [apod, setApod] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodayAPOD()
  }, [])

  const fetchTodayAPOD = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:8080/api/apod/today')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }
      
      const data = await response.json()
      setApod(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch today\'s APOD')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="today-apod">
        <div className="loading">
          <div className="spinner"></div>
          Loading today's APOD...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="today-apod">
        <div className="error">
          <p>❌ {error}</p>
          <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
            Make sure the API server is running on http://localhost:8080
          </p>
          <button className="btn-primary" onClick={fetchTodayAPOD} style={{ marginTop: '15px' }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!apod) {
    return (
      <div className="today-apod">
        <div className="error">
          <p>No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="today-apod">
      <div className="card">
        {/* Image or Video */}
        {apod.media_type === 'image' ? (
          <div className="apod-image-container">
            <img src={apod.url} alt={apod.title} className="apod-image" />
          </div>
        ) : (
          <div className="apod-video-container">
            <iframe
              src={apod.url}
              title={apod.title}
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Title */}
        <h2 className="apod-title">{apod.title}</h2>

        {/* Date and Copyright */}
        <div className="apod-date">
          <span>📅 {new Date(apod.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>

        {apod.copyright && (
          <div className="apod-copyright">
            © {apod.copyright}
          </div>
        )}

        {/* Explanation */}
        <p className="apod-explanation">{apod.explanation}</p>

        {/* Actions */}
        <div className="apod-actions">
          <a href={apod.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            View Full Resolution
          </a>
          <a href="https://apod.nasa.gov/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            APOD Website
          </a>
        </div>
      </div>
    </div>
  )
}
