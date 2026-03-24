import React, { useEffect, useRef } from 'react'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ChevronDown} from 'lucide-react';

import './ScrollAnimation.css'

// IMPORT IMAGES
import slice1 from '../assets/scrollanimation/slice1.jpg'
import slice2 from '../assets/scrollanimation/slice2.jpg'
import slice3 from '../assets/scrollanimation/slice3.jpg'


const ScrollAnimation = () => {

    const cardContainerRef = useRef(null);
    const stickyHeaderRef = useRef(null);
    const card1Ref = useRef(null)
    const card2Ref = useRef(null)
    const card3Ref = useRef(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add(
            (time) => { lenis.raf(time * 1000); }
        );
        gsap.ticker.lagSmoothing(0);

        const cardContainer = cardContainerRef.current;
        const stickyHeader = stickyHeaderRef.current;
        const cards = [card1Ref.current, card2Ref.current, card3Ref.current];

        // Tracking animation instances
        let isGapAnimationCompleted = false;
        let isFlipAnimationCompleted = false;

        function initAnimations() {
            ScrollTrigger.getAll().forEach((t) => t.kill());

            // gsap's media queries
            const mm = gsap.matchMedia();

            // mobile screen
            mm.add("(max-width: 768px)", () => {
                gsap.set([...cards, cardContainer, stickyHeader], { clearProps: "all" });
            });

            // Desktop screen
            mm.add("(min-width: 769px)", () => {
                ScrollTrigger.create({
                    trigger: ".sticky-section",
                    start: "top top",
                    end: "+=300%",
                    pin: true,
                    scrub: true,

                    onUpdate: (self) => {
                        const progress = self.progress;

                        if (progress >= 0.10 && progress <= 0.25) {
                            const mappedY = gsap.utils.mapRange(0.10, 0.25, 50, 0, progress);
                            const mappedOpacity = gsap.utils.mapRange(0.10, 0.25, 0, 1, progress);

                            gsap.set(stickyHeader, {
                                y: mappedY,
                                opacity: mappedOpacity
                            });
                        }
                        else if (progress < 0.10) {
                            gsap.set(stickyHeader, {
                                y: 50,
                                opacity: 0
                            })
                        }
                        else {
                            gsap.set(cardContainer, { width: "75vw" });
                        }

                        if (progress <= 0.25) {

                            const widthVal = gsap.utils.mapRange(0, 0.25, 30, 75, progress);

                            gsap.set(cardContainer, { width: `${widthVal}vw` });
                        }
                        else {
                            gsap.set(cardContainer, { width: "75vw" });
                        }

                        if (progress >= 0.35 && !isGapAnimationCompleted) {

                            gsap.to(cardContainer, { gap: "2rem", duration: 0.5 });
                            gsap.to(cards, { borderRadius: "24px", duration: 0.5 });
                            isGapAnimationCompleted = true;
                        }
                        else if (progress < 0.35 && isGapAnimationCompleted) {

                            gsap.to(cardContainer, { gap: "0rem", duration: 0.5 });
                            gsap.to(card1Ref.current, { borderRadius: "24px 0 0 24px", duration: 0.5 });
                            gsap.to(card2Ref.current, { borderRadius: "0px", duration: 0.5 });
                            gsap.to(card3Ref.current, { borderRadius: "0 24px 24px 0", duration: 0.5 });
                            isGapAnimationCompleted = false;
                        }

                        if (progress >= 0.70 && !isFlipAnimationCompleted) {
                            gsap.to(cards, {
                                rotateY: 180,
                                stagger: 0.1,
                                duration: 0.8,
                                ease: "power2.out"
                            });

                            gsap.to(card1Ref.current, {
                                y: 30,
                                rotateZ: -4,
                                duration: 0.8,
                                ease: "power2.out"
                            });

                            gsap.to(card3Ref.current, {
                                y: 30,
                                rotateZ: 4,
                                duration: 0.8,
                                ease: "power2.out"
                            });

                            isFlipAnimationCompleted = true;
                        }
                        else if (progress < 0.70 && isFlipAnimationCompleted) {
                            gsap.to(cards, {
                                rotateY: 0,
                                stagger: {
                                    amount: 0.1,
                                    from: "end"
                                },
                                duration: 0.8,
                                ease: "power2.out"
                            });
                            gsap.to(card1Ref.current, {
                                y: 0,
                                rotateZ: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            });
                            gsap.to(card3Ref.current, {
                                y: 0,
                                rotateZ: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            });

                            isFlipAnimationCompleted = false;
                        }
                    }
                })
            });
        };

        initAnimations();

        // RESIZE HANDLER
        let resizeTimer;

        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(initAnimations, 200);
        };

        window.addEventListener("resize", handleResize);

        return () => {

            // CLEANUP FUNCTION
            window.removeEventListener("resize", handleResize);
            ScrollTrigger.getAll().forEach((t) => t.kill());
            lenis.destroy();

        };

    }, [])


    return (
        <section
            className="bg-[#171717] text-[#f0ece6] overflow-x-hidden
            font-['Playfair_Display',serif] overflow-y-hidden"
        >
            {/* INTRO */}
            <section
                className='h-screen flex items-center justify-center'
            >
                <h1
                    className='text-6xl font-bold'
                >
                    <span>Every movement dictates the rhythm</span>
                    <p className='flex justify-center text-[12rem] pt-30 '>
                        <ChevronDown size={100}/>
                    </p>
                </h1>
            </section>

            {/* STICKY SECTION */}
            <section
                className='sticky-section h-screen flex flex-col
                items-center justify-center relative'
            >
                {/* STICKY HEADER */}
                <div
                    ref={stickyHeaderRef}
                    className='z-10 text-center px-8 py-10'
                    style={{ opacity: 0, transform: "translateY(50px)" }}
                >
                    <h1 className='text-5xl font-bold leading-tight'>Defying the laws of motion</h1>
                </div>

                {/* CARD CONTAINER */}
                <div
                    ref={cardContainerRef}
                    className='flex justify-center items-center'
                    style={{
                        width: "30vw",
                        perspective: "1000px",
                        gap: "0"
                    }}
                >
                    {/* CARD1 */}
                    <div
                        ref={card1Ref}
                        className='card relative flex-1'
                        style={{
                            aspectRatio: "5/7",
                            height: "60vh",
                            transformOrigin: "top center",
                            borderRadius: "24px 0 0 24px",
                        }}
                    >
                        {/* CARD FRONT */}
                        <div
                            className='card-face absolute inset-0 overflow-hidden'
                            style={{ borderRadius: "inherit" }}
                        >
                            <img src={slice1} className='w-full h-full object-cover' />
                        </div>

                        {/* CARD BACK */}
                        <div
                            className='card-face absolute inset-0 flex flex-col
                            justify-center items-center p-8 
                            bg-[#e3dccb] text-[#171717]'
                            style={{
                                borderRadius: "inherit",
                                transform: "rotateY(180deg)"
                            }}
                        >
                            <span
                                className='absolute top-5 left-5 opacity-50 text-sm'
                            >
                                ( 01 )
                            </span>
                            <span className='text-xl font-semibold pb-5'>
                                The Mastery of Inertia
                            </span>
                            <p className='text-sm tracking-wide text-center'>
                                Momentum is a suggestion he chooses to ignore,
                                freezing time with a sudden, silent halt
                                before vanishing into a space that wasn't there.
                            </p>
                        </div>
                    </div>

                    {/* CARD2 */}
                    <div
                        ref={card2Ref}
                        className='card relative flex-1'
                        style={{
                            aspectRatio: "5/7",
                            height: "60vh",
                            transformOrigin: "top center",
                            borderRadius: "0",
                        }}
                    >
                        {/* CARD FRONT */}
                        <div
                            className='card-face absolute inset-0 overflow-hidden'
                            style={{ borderRadius: "inherit" }}
                        >
                            <img src={slice2} className='w-full h-full object-cover' />
                        </div>

                        {/* CARD BACK */}
                        <div
                            className='card-face absolute inset-0 flex flex-col
                            justify-center items-center p-8 
                            bg-[#252525] text-[#f0ece6]'
                            style={{
                                borderRadius: "inherit",
                                transform: "rotateY(180deg)"
                            }}
                        >
                            <span
                                className='absolute top-5 left-5 opacity-50 text-sm'
                            >
                                ( 02 )
                            </span>
                            <span className='text-xl font-semibold pb-5'>
                                The Weight of Grace
                            </span>
                            <p className='text-sm tracking-wide text-center'>
                                Gravity bows to a lower center of command,
                                allowing him to glide through a storm of tackles
                                while remaining perfectly anchored to his own rhythm.
                            </p>
                        </div>
                    </div>

                    {/* CARD3 */}
                    <div
                        ref={card3Ref}
                        className='card relative flex-1'
                        style={{
                            aspectRatio: "5/7",
                            height: "60vh",
                            transformOrigin: "top center",
                            borderRadius: "0 24px 24px 0",
                        }}
                    >
                        {/* CARD FRONT */}
                        <div
                            className='card-face absolute inset-0 overflow-hidden'
                            style={{ borderRadius: "inherit" }}
                        >
                            <img src={slice3} className='w-full h-full object-cover' />
                        </div>

                        {/* CARD BACK */}
                        <div
                            className='card-face absolute inset-0 flex flex-col
                            justify-center items-center p-8 
                            bg-[#be3931] text-white'
                            style={{
                                borderRadius: "inherit",
                                transform: "rotateY(180deg)"
                            }}
                        >
                            <span
                                className='absolute top-5 left-5 opacity-50 text-sm'
                            >
                                ( 03 )
                            </span>
                            <span className='text-xl font-semibold pb-5'>
                                The Magnetic Thread
                            </span>
                            <p className='text-sm tracking-wide text-center'>
                                The ball is a loyal extension of his shadow,
                                tethered by an invisible force that defies friction,
                                turning every chaotic sprint into a calculated masterpiece.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUTRO */}
            <section className='h-screen flex items-center justify-center'>
                <h1 className='text-6xl font-bold'>
                    <span>A timeline measured in golden moments</span>
                    <p className='flex justify-center text-[12rem] pt-40 '>
                        <ChevronDown size={100}/>
                    </p>
                </h1>
            </section>
        </section>
    )
}

export default ScrollAnimation