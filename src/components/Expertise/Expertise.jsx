"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Expertise.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARDS = [
  {
    title: "Bridal Makeup",
    image: "/p4.jpg",
  },
  {
    title: "Hair Styling",
    image: "/p2.jpg",
  },
  {
    title: "Soft Glam",
    image: "/p3.jpg",
  },
  {
    title: "Special Occasions",
    image: "/p1.jpg",
  },
  {
    title: "Formals",
    image: "/p5.jpg",
  },
  {
    title: "Editorial Beauty",
    image: "/p6.jpg",
  },
  {
    title: "Party Glam",
    image: "/p7.png",
  },
  {
    title: "Final Touchups",
    image:
      "/p8.jpg",
  },
];

const DESKTOP_FAN = [
  { x: -340, rotation: -12, y: 36 },
  { x: -245, rotation: -8, y: 12 },
  { x: -145, rotation: -5, y: -8 },
  { x: -48, rotation: -2, y: -18 },
  { x: 48, rotation: 2, y: -18 },
  { x: 145, rotation: 5, y: -8 },
  { x: 245, rotation: 8, y: 12 },
  { x: 340, rotation: 12, y: 36 },
];

const TABLET_FAN = [
  { x: -230, rotation: -10, y: 32 },
  { x: -165, rotation: -7, y: 12 },
  { x: -100, rotation: -4, y: -4 },
  { x: -34, rotation: -1, y: -14 },
  { x: 34, rotation: 1, y: -14 },
  { x: 100, rotation: 4, y: -4 },
  { x: 165, rotation: 7, y: 12 },
  { x: 230, rotation: 10, y: 32 },
];

const MOBILE_FAN = [
  { x: -58, rotation: -7, y: 78 },
  { x: -40, rotation: -5, y: 48 },
  { x: -22, rotation: -2, y: 22 },
  { x: -8, rotation: -1, y: 0 },
  { x: 8, rotation: 1, y: 0 },
  { x: 22, rotation: 2, y: 22 },
  { x: 40, rotation: 5, y: 48 },
  { x: 58, rotation: 7, y: 78 },
];

function getFanLayout() {
  if (typeof window === "undefined") return DESKTOP_FAN;
  if (window.matchMedia("(max-width: 640px)").matches) return MOBILE_FAN;
  if (window.matchMedia("(max-width: 1024px)").matches) return TABLET_FAN;
  return DESKTOP_FAN;
}

const TITLE_WORDS = [
  "Beauty",
  "Expertise,",
  "Crafted",
  "For",
  "Every",
  "Moment.",
];

export default function Expertise() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const labelRef = useRef(null);
  const wordRefs = useRef([]);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const header = headerRef.current;
      const label = labelRef.current;
      const titleWords = wordRefs.current.filter(Boolean);
      const cards = cardsRef.current.filter(Boolean);

      if (!section || !header || !label || titleWords.length === 0 || cards.length === 0)
        return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const leadIndex = 3;

      const setStacked = () => {
        cards.forEach((card, i) => {
          const depth = Math.abs(i - leadIndex);
          gsap.set(card, {
            x: 0,
            y: 0,
            rotation: (i - leadIndex) * 0.45,
            scale: 1,
            opacity: 1,
            zIndex: 20 - depth,
          });
        });
      };

      setStacked();

      if (prefersReducedMotion) {
        gsap.set(label, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(titleWords, { opacity: 1, y: 0, filter: "blur(0px)" });
        const fan = getFanLayout();
        cards.forEach((card, i) => {
          gsap.set(card, {
            x: fan[i].x,
            y: fan[i].y,
            rotation: fan[i].rotation,
          });
        });
        return;
      }

      // Premium heading reveal — plays when section enters, before pinned fan.
      gsap.set(label, { opacity: 0, y: 20, filter: "blur(8px)" });
      gsap.set(titleWords, { opacity: 0, y: 80, filter: "blur(10px)" });

      const headingTl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: header,
          start: "top 75%",
          end: "top 45%",
          toggleActions: "play none none reverse",
        },
      });

      headingTl
        .to(label, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
        })
        .to(
          titleWords,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
            stagger: 0.09,
            ease: "power4.out",
          },
          0.1
        );

      // Pin + scrub with an early hold so the section settles before fanning.
      // 0–30%: hold (heading + stacked cards)
      // 30–100%: cards fan out
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1500",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Hold ~30% of the pinned scroll (~450px of 1500)
      tl.to({}, { duration: 0.3 });

      tl.to(cards, {
        x: (i) => getFanLayout()[i].x,
        y: (i) => getFanLayout()[i].y,
        rotation: (i) => getFanLayout()[i].rotation,
        duration: 0.7,
        stagger: {
          each: 0.012,
          from: "center",
        },
        ease: "power2.inOut",
      });

      const onResize = () => {
        const progress = tl.scrollTrigger?.progress ?? 0;
        if (progress < 0.3) {
          setStacked();
        } else {
          const fan = getFanLayout();
          const fanProgress = (progress - 0.3) / 0.7;
          cards.forEach((card, i) => {
            gsap.set(card, {
              x: fan[i].x * fanProgress,
              y: fan[i].y * fanProgress,
              rotation:
                (i - leadIndex) * 0.45 * (1 - fanProgress) +
                fan[i].rotation * fanProgress,
            });
          });
        }
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        headingTl.scrollTrigger?.kill();
        headingTl.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Our Expertise"
    >
      <div ref={headerRef} className={styles.header}>
        <p ref={labelRef} className={styles.label}>
          Our Expertise
        </p>
        <h2 className={styles.title}>
          {TITLE_WORDS.map((word, index) => (
            <span key={`${word}-${index}`} className={styles.wordMask}>
              <span
                ref={(el) => {
                  wordRefs.current[index] = el;
                }}
                className={styles.wordInner}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div ref={stageRef} className={styles.stage}>
        <div className={styles.deck}>
          {CARDS.map((card, index) => (
            <article
              key={card.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={styles.card}
              aria-label={card.title}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 250px"
                className={styles.cardImage}
              />
              <div className={styles.cardFade} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
