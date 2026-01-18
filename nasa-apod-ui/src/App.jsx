import { useState, useEffect } from 'react'
import './App.css'
import TodayAPOD from './components/TodayAPOD'
import DatePicker from './components/DatePicker'
import RecentGallery from './components/RecentGallery'
import DetailedView from './components/DetailedView'
import Favorites from './components/Favorites'

function App() {
  const [activeTab, setActiveTab] = useState('today')
  const [selectedImage, setSelectedImage] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('apod-favorites')
    return saved ? JSON.parse(saved) : []
  })
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('apod-theme')
    return saved || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('apod-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('apod-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleFavorite = (image) => {
    const exists = favorites.some(fav => fav.date === image.date)
    if (exists) {
      setFavorites(favorites.filter(fav => fav.date !== image.date))
    } else {
      setFavorites([...favorites, image])
    }
  }

  const isFavorite = (image) => {
    return favorites.some(fav => fav.date === image.date)
  }

  return (
    <div className="app" data-theme={theme}>
      <header className="app-header">
        <div className="header-content">
          <h1>🌌 NASA APOD Explorer</h1>
          <p>Explore the Universe's Most Beautiful Images</p>
        </div>
        <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('today')
            setSelectedImage(null)
          }}
        >
          📅 Today's APOD
        </button>
        <button 
          className={`nav-btn ${activeTab === 'date' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('date')
            setSelectedImage(null)
          }}
        >
          📆 Pick a Date
        </button>
        <button 
          className={`nav-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('recent')
            setSelectedImage(null)
          }}
        >
          🖼️ Gallery
        </button>
        <button 
          className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('favorites')
            setSelectedImage(null)
          }}
        >
          ⭐ Favorites ({favorites.length})
        </button>
      </nav>

      <main className="app-main">
        {selectedImage ? (
          <DetailedView 
            image={selectedImage} 
            onClose={() => setSelectedImage(null)}
            isFavorite={isFavorite(selectedImage)}
            onToggleFavorite={() => toggleFavorite(selectedImage)}
          />
        ) : (
          <>
            {activeTab === 'today' && <TodayAPOD isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />}
            {activeTab === 'date' && <DatePicker onSelectImage={setSelectedImage} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />}
            {activeTab === 'recent' && <RecentGallery onSelectImage={setSelectedImage} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />}
            {activeTab === 'favorites' && <Favorites images={favorites} onSelectImage={setSelectedImage} onRemove={toggleFavorite} />}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Data from NASA's Astronomy Picture of the Day API</p>
        <p className="footer-links">
          <a href="https://apod.nasa.gov/" target="_blank" rel="noopener noreferrer">APOD Website</a> • 
          <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA API</a>
        </p>
      </footer>
    </div>
  )
}

export default App
