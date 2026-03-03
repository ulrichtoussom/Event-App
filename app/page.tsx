
import EventList  from '@/components/EventList'
import HeroBanner from '@/components/HeroBanner'
import Hero from '@/components/Hero'
import CategoryTabs from '@/components/CategoryTabs'

export default  async function Home() {


  return(
    <div className='min-h-screen bg-gray-50'>
      {/* Tu peux ajouter un Hero Banner ici plus tard */} 
      <HeroBanner />
      <Hero />
      <CategoryTabs />
      <EventList />
    </div>
  )
}