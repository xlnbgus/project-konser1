import { useState } from 'react'
import Navbar from '../components/Navbar'
import TickerBanner from '../components/TickerBanner'
import HeroSection from '../components/HeroSection'
import UpcomingEvents from '../components/UpcomingEvents'
import TopEvents from '../components/TopEvents'
import FeaturedArtists from '../components/FeaturedArtists'
import HowItWorks from '../components/HowItWorks'
import PromoSection from '../components/PromoSection'
import Footer from '../components/Footer'

export default function HomePage() {
  const [searchQuery, setSearchQuery]       = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  return (
    <div>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <HeroSection />
      <PromoSection />
      <TopEvents searchQuery={searchQuery} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <TickerBanner />
      <FeaturedArtists />
      <UpcomingEvents searchQuery={searchQuery} />
      <HowItWorks />
      <Footer />
    </div>
  )
}
