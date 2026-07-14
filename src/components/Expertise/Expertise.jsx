"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBookingModal } from "@/components/BookingModal/BookingModalContext";
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
  { x: -52, rotation: -6, y: 18 },
  { x: -36, rotation: -4, y: 10 },
  { x: -20, rotation: -2, y: 4 },
  { x: -6, rotation: -1, y: 0 },
  { x: 6, rotation: 1, y: 0 },
  { x: 20, rotation: 2, y: 4 },
  { x: 36, rotation: 4, y: 10 },
  { x: 52, rotation: 6, y: 18 },
];

function getFanLayout() {
  if (typeof window === "undefined") return DESKTOP_FAN;
  if (window.matchMedia("(max-width: 768px)").matches) return MOBILE_FAN;
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
  const { openBooking } = useBookingModal();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const labelRef = useRef(null);
  const wordRefs = useRef([]);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const header = headerRef.current;
      const label = labelRef.current;
      const titleWords = wordRefs.current.filter(Boolean);
      const cards = cardsRef.current.filter(Boolean);
      const cta = ctaRef.current;

      if (!section || !header || !label || titleWords.length === 0 || cards.length === 0)
        return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (cta) {
        if (prefersReducedMotion) {
          gsap.set(cta, { opacity: 1, y: 0, filter: "none" });
        } else {
          gsap.set(cta, { opacity: 0, y: 20, filter: "blur(6px)" });
          gsap.to(cta, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cta,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }

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

      // Desktop: pin + scrub fan. Mobile: short/no-pin scrub to avoid huge blank gaps.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
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
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(max-width: 768px)", () => {
        // No pin / no pin-spacer — keeps section height compact on phone.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "+=450",
            pin: false,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.to(cards, {
          x: (i) => getFanLayout()[i].x,
          y: (i) => getFanLayout()[i].y,
          rotation: (i) => getFanLayout()[i].rotation,
          duration: 1,
          stagger: {
            each: 0.01,
            from: "center",
          },
          ease: "power2.inOut",
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          setStacked();
        };
      });

      return () => {
        headingTl.scrollTrigger?.kill();
        headingTl.kill();
        mm.revert();
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
                alt=""
                fill
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 250px"
                className={styles.cardImage}
              />
            </article>
          ))}
        </div>
      </div>

      <div className={styles.ctaWrap}>
        <button
          ref={ctaRef}
          type="button"
          className={styles.ctaSmallGlass}
          onClick={openBooking}
        >
          <span>Book Your Look</span>
          <span className={styles.ctaArrow} aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
