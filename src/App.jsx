// importing images
import legacy1 from './assets/overengineeredhovereffect/legacy1.png'
import legacy2 from './assets/overengineeredhovereffect/legacy2.png'
import legacy3 from './assets/overengineeredhovereffect/legacy3.png'

import passion1 from './assets/overengineeredhovereffect/passion1.png'
import passion2 from './assets/overengineeredhovereffect/passion2.png'
import passion3 from './assets/overengineeredhovereffect/passion3.png'

import glory1 from './assets/overengineeredhovereffect/glory1.png'
import glory2 from './assets/overengineeredhovereffect/glory2.png'
import glory3 from './assets/overengineeredhovereffect/glory3.png'

import ServiceItemCard from './components/ServiceItemCard'
import ScrollAnimation from './components/ScrollAnimation'


function App() {

  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);


  const servicesData = [

    {
      id: 1,
      title: 'Legacy',
      tags: "Prodigy, Rosario, Blaugrana, La Masia Graduate, Era-Defining, Consistency, Longevity, Pioneer, Influence, Symbol, Immortal",
      images: shuffle([legacy1, legacy2, legacy3])
    },
    {
      id: 2,
      title: 'Passion',
      tags: "Albiceleste, Pride, Emotion, Determination, Heartbeat, Devotion, Fight, Spirit, Leadership, Desire, Fire",
      images: shuffle([passion1, passion2, passion3])
    },
    {
      id: 3,
      title: 'Glory',
      tags: "Ballon d'Or Winner, Silverware, Champions League, Triumph, Dominance, Records Broken, Excellence, Heroics, Greatness, Achievements, Victories",
      images: shuffle([glory1, glory2, glory3])
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#171717] 
      flex flex-col justify-center items-center">
      {/* ScrollAnimationCard */}
      <ScrollAnimation />

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
