import { useState } from 'react'

export default function DatePicker({ onSelectImage }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [apod, setApod] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getMinDate = () => {
    const minDate = new Date('1995-06-16')
    return minDate.toISOString().split('T')[0]
  }

  const handleSearch = async () => {
    if (!selectedDate) {
      setError('Please select a date')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setApod(null)

      const response = await fetch(
        `http://localhost:8080/api/apod?date=${selectedDate}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const data = await response.json()
      setApod(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch APOD for this date')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="date-picker-container">
      {/* Date Picker Section */}
      <div className="date-picker-section">
        <div className="form-group">
          <label htmlFor="date-input">Select a Date</label>
          <input
            id="date-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            onKeyPress={handleKeyPress}
            min={getMinDate()}
            max={getTodayDate()}
          />
          <small style={{ color: 'var(--text-muted)' }}>
            Available from June 16, 1995 to today
          </small>
        </div>
        <button className="btn-search" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          Fetching APOD...
        </div>
      )}

      {/* Result */}
      {apod && (
        <div className="card">
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

          <h2 className="apod-title">{apod.title}</h2>

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

          <p className="apod-explanation">{apod.explanation}</p>

          <div className="apod-actions">
            <a href={apod.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              View Full Resolution
            </a>
            <button className="btn-secondary" onClick={() => onSelectImage(apod)}>
              View Details
            </button>
          </div>
        </div>
      )}

      {!apod && !loading && !error && (
        <div className="card" style={{ textAlign: 'center', opacity: 0.6 }}>
          <p>👆 Select a date to view the APOD from that day</p>
        </div>
      )}
    </div>
  )
}
