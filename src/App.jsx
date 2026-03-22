// importing images
import legacy1 from './assets/legacy1.jpg'
import legacy2 from './assets/legacy2.jpg'
import legacy3 from './assets/legacy3.jpg'

import passion1 from './assets/passion1.jpg'
import passion2 from './assets/passion2.jpg'
import passion3 from './assets/passion3.jpg'

import glory1 from './assets/glory1.jpg'
import glory2 from './assets/glory2.jpg'
import glory3 from './assets/glory3.jpg'

import ServiceItemCard from './components/ServiceItemCard'


function App() {
  
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);


  const servicesData = [

      { 
        id: 1, 
        title: 'Legacy', 
        tags: "History, Heritage, La Masia, Icons, Dynasty, Tradition, Catalonia, Generations, Philosophy, Evolution, Roots", 
        images: shuffle([legacy2,legacy1,legacy3]) 
      },
      { 
        id: 2, 
        title: 'Passion', 
        tags: "Fans, Energy, Atmosphere, Emotion, Loyalty, Chants, Camp Nou, Intensity, Devotion, Fire, Unity", 
        images: shuffle([passion2,passion1,passion3]) 
      },
      { 
        id: 3, 
        title: 'Glory', 
        tags: "Trophies, Champions, Victory, Dominance, Titles, UCL Nights, Greatness, Triumph, Records, Legends, Success", 
        images: shuffle([glory2,glory1,glory3]) 
      }
    ];

  return (
    <div className="w-full min-h-screen bg-[#171717] 
      flex justify-center items-center">
      {/* services */}
      <section className='relative w-full
        text-[#ff3831] flex flex-col
        justify-center items-center gap-8 py-20'>  
      {/* mapping out the service */}
      {servicesData.map(card => (
        <ServiceItemCard
          key={card.id}
          title={card.title}
          tagString={card.tags}
          images={card.images}
        />
      ))}
      </section>
    </div>
  )
}

export default App
