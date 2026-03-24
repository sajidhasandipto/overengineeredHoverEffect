import React, { useRef, useState } from 'react'
import gsap from 'gsap';
import Matter from 'matter-js';
import './ServiceItemCard.css'

function getTagDimensions(text) {
    const div = document.createElement('div');
    div.className = 'absolute px-4 py-2 text-sm border rounded-full opacity-0 border-zinc-600 whitespace-nowrap font-barlow';
    div.textContent = text;
    document.body.appendChild(div);
    const { offsetWidth, offsetHeight } = div;
    div.remove();
    return { width: offsetWidth, height: offsetHeight }
}

const ServiceItemCard = ({ title, tagString, images }) => {

    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const imagesRef = useRef([]);
    const tagElementsRef = useRef([]);

    const [activeTags, setActiveTags] = useState([]);
    const engineRef = useRef(null);
    const loopRef = useRef(null);
    const timerRef = useRef(null);
    const isHoveredRef = useRef(false);

    function handleMouseEnter() {
        isHoveredRef.current = true;

        // Expand layout and change colors of the h1
        gsap.to(containerRef.current, {
            height: '22rem', 
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
        gsap.to(titleRef.current, {
            color: '#be3931',
            duration: 0.3
        });

        // Animating the images up
        gsap.to(imagesRef.current, {
            y: -100, // Move them up into view
            opacity: 1,
            stagger: 0.05,
            duration: 0.5,
            ease: 'power3.out'
        });

        // delay a bit before animating 
        timerRef.current = setTimeout(() => {
            if (!isHoveredRef.current) return;
            initPhyscis();
        }, 200);
    };

    function handleMouseLeave() {
        isHoveredRef.current = false;
        clearTimeout(timerRef.current);

        // Reversing layout and colors
        gsap.to(containerRef.current, {
            height: '10rem',
            duration: 0.6, ease: 'power3.inOut'
        });
        gsap.to(titleRef.current, {
            color: '#ffffff',
            duration: 0.3
        });

        // hide images
        gsap.to(imagesRef.current,
            { y: 0, opacity: 0, duration: 0.4 });

        // fading out tags
        if (tagElementsRef.current.length > 0) {
            gsap.to(tagElementsRef.current,
                { opacity: 0, duration: 0.3 });
        }

        // cleanup to prevent memory leaks
        setTimeout(() => {
            if (engineRef.current) {
                Matter.Engine.clear(engineRef.current);
                Matter.World.clear(engineRef.current.world);
                cancelAnimationFrame(loopRef.current);
                setActiveTags([]);
            }
        }, 400);
    }

    function initPhyscis() {
        const { Engine, World, Bodies, Body } = Matter;
        const engine = Engine.create();
        engineRef.current = engine;

        const tagLabels = tagString.split(',').map(t => t.trim());

        // Measuring DOM elements and create matching physics bodies
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

            Body.setAngle(body, (Math.random() - 0.5) * 0.5);
            World.add(engine.world, body);

            return { id: i, label, body, width, height };
        });

        // Boundaries like Ground and Walls based on container size
        const cw = containerRef.current.offsetWidth;

        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const ch = 22 * rootFontSize;

        const ground = Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true });
        const leftWall = Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true });
        const rightWall = Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true });

        World.add(engine.world, [ground, leftWall, rightWall]);
        setActiveTags(newTags);

        // Fade in tags visually
        setTimeout(() => {
            gsap.to(tagElementsRef.current,
                { opacity: 1, stagger: 0.05, duration: 0.3 });
        }, 50);

        // Syncs physics engine positions to DOM elements
        const update = () => {
            // 60 frames per secs or 1000milisecs 
            Engine.update(engine, 1000 / 60);
            newTags.forEach((tag, index) => {
                const el = tagElementsRef.current[index];
                if (el && tag.body) {
                    const { x, y } = tag.body.position;
                    el.style.transform = `translate(
                        ${x - tag.width / 2}px, 
                        ${y - tag.height / 2}px) 
                        rotate(${tag.body.angle}rad)`;
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
            className='relative w-max min-w-200 h-40 flex items-end
                justify-center
                overflow-hidden cursor-pointer will-change-[height]
                border-b border-[#2a2a2a] pb-4'

            data-tags={tagString}
        >
            {/* service name */}
            <h1
                ref={titleRef}
                className='relative uppercase font-barlow text-[6rem]
                  font-black tracking-tight-custom leading-none
                  bg-[#171717] z-2 pointer-events-none text-white'
            >
                {title}
            </h1>
            {/* service images */}
            <div
                className='absolute top-[0%] left-[50%] 
                  translate-x-[-50%] w-100 h-100 overflow-hidden'
            >
                {/* img 1*/}
                <div
                    ref={el => imagesRef.current[0] = el}
                    className='absolute top-[50%] left-[50%] translate-x-[-50%]
                    translate-y-[50%] w-60 h-40 rounded-[0.35rem] overflow-hidden
                    opacity-0 z-30'
                >
                    <img src={images[0]} className="object-cover w-full h-full" />
                </div>

                {/* img 2*/}
                <div
                    ref={el => imagesRef.current[1] = el}
                    className='absolute top-[50%] left-[50%] translate-x-[-50%]
                    translate-y-[50%] w-60 h-40 rounded-[0.35rem] overflow-hidden
                    origin-bottom-left rotate-[-5deg] -mt-6 opacity-0
                    z-20'
                >
                    <img src={images[1]} className="object-cover w-full h-full"/>
                </div>

                {/* img 3*/}
                <div
                    ref={el => imagesRef.current[2] = el}
                    className='absolute top-[50%] left-[50%] translate-x-[-50%]
                    translate-y-[50%] w-60 h-40 rounded-[0.35rem] overflow-hidden
                    origin-bottom-right rotate-[2.5deg] -mt-6 opacity-0
                    z-10'
                >
                    <img src={images[2]} className="object-cover w-full h-full"/>
                </div>
            </div>
            
            {/* Physics tags rendered here */}
            {activeTags.map((tag,i) => (
                <div
                    key={tag.id}
                    ref={el => tagElementsRef.current[i] = el}
                    className="absolute top-0 left-0 
                        px-4 py-2 rounded-full border 
                        border-zinc-600 bg-[#171717] 
                        text-white font-barlow text-sm whitespace-nowrap 
                        z-20 opacity-0 pointer-events-none"
                >
                    {tag.label}
                </div>
            ))}
        </div>
    )
}

export default ServiceItemCard