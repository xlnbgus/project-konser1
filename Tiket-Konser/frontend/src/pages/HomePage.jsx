import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TickerBanner from '../components/TickerBanner'
import HeroSection from '../components/HeroSection'
import UpcomingEvents from '../components/UpcomingEvents'
import TopEvents from '../components/TopEvents'
import FeaturedArtists from '../components/FeaturedArtists'
import HowItWorks from '../components/HowItWorks'
import PromoSection from '../components/PromoSection'
import PromoterSection from '../components/PromoterSection'
import FaqSection from '../components/FaqSection'
import LiveChatWidget from '../components/LiveChatWidget'
import Footer from '../components/Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery]       = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  useScrollReveal([activeCategory, searchQuery])

  const handleSelectEvent = (event) => {
    navigate('/detail', { state: { event } })
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <HeroSection onSelectEvent={handleSelectEvent} />
      <TickerBanner />
      <PromoSection />
      <TopEvents
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSelectEvent={handleSelectEvent}
      />
      <FeaturedArtists />
      <UpcomingEvents searchQuery={searchQuery} onSelectEvent={handleSelectEvent} />
      <HowItWorks />
      <PromoterSection />
      <FaqSection />
      <Footer />
      <LiveChatWidget />
    </div>
  )
}
