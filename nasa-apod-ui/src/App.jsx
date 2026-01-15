import { useState, useEffect } from 'react'
import './App.css'
import TodayAPOD from './components/TodayAPOD'
import DatePicker from './components/DatePicker'
import RecentGallery from './components/RecentGallery'
import DetailedView from './components/DetailedView'

function App() {
  const [activeTab, setActiveTab] = useState('today')
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🌌 NASA APOD Explorer</h1>
          <p>Explore the Universe's Most Beautiful Images</p>
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('today')
            setSelectedImage(null)
          }}
        >
          Today's APOD
        </button>
        <button 
          className={`nav-btn ${activeTab === 'date' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('date')
            setSelectedImage(null)
          }}
        >
          Pick a Date
        </button>
        <button 
          className={`nav-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('recent')
            setSelectedImage(null)
          }}
        >
          Recent Gallery
        </button>
      </nav>

      <main className="app-main">
        {selectedImage ? (
          <DetailedView 
            image={selectedImage} 
            onClose={() => setSelectedImage(null)}
          />
        ) : (
          <>
            {activeTab === 'today' && <TodayAPOD />}
            {activeTab === 'date' && <DatePicker onSelectImage={setSelectedImage} />}
            {activeTab === 'recent' && <RecentGallery onSelectImage={setSelectedImage} />}
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
