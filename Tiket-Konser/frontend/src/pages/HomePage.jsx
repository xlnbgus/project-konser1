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
  return (
    <div>
      <TickerBanner />
      <Navbar />
      <HeroSection />
      <PromoSection />
      <TopEvents />
      <FeaturedArtists />
      <UpcomingEvents />
      <HowItWorks />
      <Footer />
    </div>
  )
}
