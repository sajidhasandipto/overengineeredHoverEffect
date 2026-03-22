import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import Matter from 'matter-js';

import img1 from './assets/image_1.png';
import img2 from './assets/image_2.png';
import img3 from './assets/image_3.png';

// 1. Utility function exactly like the video to measure tag sizes before physics run
const getTagDimensions = (text) => {
  const div = document.createElement('div');
  // Match the Tailwind classes of the actual tags so measurement is 100% accurate
  div.className = 'absolute px-4 py-2 text-sm border rounded-full opacity-0 border-zinc-600 whitespace-nowrap font-barlow';
  div.textContent = text;
  document.body.appendChild(div);
  const { offsetWidth, offsetHeight } = div;
  div.remove();
  return { width: offsetWidth, height: offsetHeight };
};

// 2. We extract your exact layout into a component so physics are isolated per row
const ServiceItem = ({ title, tagsString, images }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const imagesRef = useRef([]);
  const tagElementsRef = useRef([]);
  
  const [activeTags, setActiveTags] = useState([]);
  const engineRef = useRef(null);
  const loopRef = useRef(null);
  const timerRef = useRef(null);
  const isHoveredRef = useRef(false);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;

    // GSAP: Expand Layout & Change Colors
    gsap.to(containerRef.current, { height: '350px', duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    gsap.to(titleRef.current, { color: '#ffffff', duration: 0.3 });
    
    // GSAP: Animate Images Up
    gsap.to(imagesRef.current, { 
      y: -100, // Move them up into view
      opacity: 1, 
      stagger: 0.05, 
      duration: 0.5, 
      ease: 'power3.out' 
    });

    // Wait a moment before dropping tags, just like the video
    timerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) return;
      initPhysics();
    }, 200);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    clearTimeout(timerRef.current);

    // GSAP: Reverse Layout & Colors
    gsap.to(containerRef.current, { height: '160px', duration: 0.6, ease: 'power3.inOut' });
    gsap.to(titleRef.current, { color: '#ff3831', duration: 0.3 });
    
    // GSAP: Hide Images
    gsap.to(imagesRef.current, { y: 0, opacity: 0, duration: 0.4 });
    
    // GSAP: Fade out tags
    if (tagElementsRef.current.length > 0) {
      gsap.to(tagElementsRef.current, { opacity: 0, duration: 0.3 });
    }

    // Cleanup Matter.js to prevent memory leaks
    setTimeout(() => {
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        Matter.World.clear(engineRef.current.world);
        cancelAnimationFrame(loopRef.current);
        setActiveTags([]);
      }
    }, 400);
  };

  const initPhysics = () => {
    const { Engine, World, Bodies, Body } = Matter;
    const engine = Engine.create();
    engineRef.current = engine;

    const tagLabels = tagsString.split(',').map(t => t.trim());
    
    // Measure DOM elements and create matching Physics Bodies
    const newTags = tagLabels.map((label, i) => {
      const { width, height } = getTagDimensions(label);
      
      // Spawn them randomly near the middle-top
      const startX = (containerRef.current.offsetWidth / 2) + (Math.random() * 100 - 50);
      const startY = -50 - (i * 30);
      
      const body = Bodies.rectangle(startX, startY, width, height, {
        restitution: 0.6, // Bounciness
        friction: 0.1,
        density: 0.001,
        chamfer: { radius: height / 2 } // Rounded corners like the pill shape
      });
      
      Body.setAngle(body, (Math.random() - 0.5) * 0.5); // Initial slight rotation
      World.add(engine.world, body);

      return { id: i, label, body, width, height };
    });

    // Add boundaries (Ground and Walls) based on container size
    const cw = containerRef.current.offsetWidth;
    const ch = 350; // Max expanded height
    const ground = Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true });
    const rightWall = Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true });
    
    World.add(engine.world, [ground, leftWall, rightWall]);
    setActiveTags(newTags);

    // Fade tags in visually
    setTimeout(() => {
      gsap.to(tagElementsRef.current, { opacity: 1, stagger: 0.05, duration: 0.3 });
    }, 50);

    // The Tick Loop: Syncs Physics Engine positions to DOM elements
    const update = () => {
      Engine.update(engine, 1000 / 60);
      newTags.forEach((tag, index) => {
        const el = tagElementsRef.current[index];
        if (el && tag.body) {
          const { x, y } = tag.body.position;
          // Offset by half width/height because Matter.js calculates from center, DOM from top-left
          el.style.transform = `translate(${x - tag.width / 2}px, ${y - tag.height / 2}px) rotate(${tag.body.angle}rad)`;
        }
      });
      loopRef.current = requestAnimationFrame(update);
    };
    update();
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='relative w-max min-w-[800px] h-40 flex items-end justify-center overflow-hidden cursor-pointer will-change-[height] border-b border-[#2a2a2a] pb-4'
    >
      {/* Service Name */}
      <h1 
        ref={titleRef}
        className='relative uppercase 
        font-barlow text-[10rem] 
        font-black tracking-tight leading-none 
        bg-[#171717] z-[10] pointer-events-none'
      >
        {title}
      </h1>

      {/* Service Images */}
      <div className='absolute top-0 left-[50%] translate-x-[-50%] w-[400px] h-full pointer-events-none z-[5]'>
        {/* Img 1 */}
        <div
          ref={el => imagesRef.current[0] = el}
          className='absolute top-[60%] 
          left-[50%] translate-x-[-50%] 
          w-60 h-40 rounded-[0.35rem] 
          overflow-hidden opacity-0'
        >
          <img src={images[0]} className="object-cover w-full h-full" alt="preview" />
        </div>

        {/* Img 2 (Left Tilted) */}
        <div
          ref={el => imagesRef.current[1] = el}
          className='absolute top-[60%] left-[50%] translate-x-[-50%] w-60 h-40 rounded-[0.35rem] overflow-hidden origin-bottom-left rotate-[-5deg] -mt-6 opacity-0'
        >
          <img src={images[1]} className="object-cover w-full h-full" alt="preview" />
        </div>

        {/* Img 3 (Right Tilted) */}
        <div
          ref={el => imagesRef.current[2] = el}
          className='absolute top-[60%] left-[50%] translate-x-[-50%] w-60 h-40 rounded-[0.35rem] overflow-hidden origin-bottom-right rotate-[2.5deg] -mt-6 opacity-0'
        >
          <img src={images[2]} className="object-cover w-full h-full" alt="preview" />
        </div>
      </div>

      {/* Physics Tags Rendered Here */}
      {activeTags.map((tag, i) => (
        <div
          key={tag.id}
          ref={el => tagElementsRef.current[i] = el}
          className="absolute top-0 left-0 px-4 py-2 rounded-full border border-zinc-600 bg-[#171717] text-white font-barlow text-sm whitespace-nowrap z-[20] opacity-0 pointer-events-none"
        >
          {tag.label}
        </div>
      ))}
    </div>
  );
};

// 3. Main App Component Maps Data to the ServiceItem
export default function App() {
  const servicesData = [
    { 
      id: 1, 
      title: 'Silhouette', 
      tags: "Editorial, Fashion, Monochrome, Shadow, Minimalism, Studio Potraits", 
      images: [img1, img2, img3] 
    },
    { 
      id: 2, 
      title: 'Chroma', 
      tags: "Vibrant, Color, Tone, Expression, Light, Aesthetics", 
      images: [img1, img2, img3] 
    },
    { 
      id: 3, 
      title: 'Persona', 
      tags: "Human, Emotion, Focus, Close-up, Raw, Identity", 
      images: [img1, img2, img3] 
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#171717] flex justify-center items-center">
      <section className='relative w-full 
    text-[#ff3831] flex flex-col 
      justify-center items-center gap-8 py-20'>
        {servicesData.map(service => (
          <ServiceItem 
            key={service.id}
            title={service.title}
            tagsString={service.tags}
            images={service.images}
          />
        ))}
      </section>
    </div>
  );
}