"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Testimonials.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TITLE_WORDS = ["Loved", "By", "Our", "Beautiful", "Clients"];

const TESTIMONIALS = [
  {
    quote:
      "Hiraa made me feel so confident and beautiful on my big day. The makeup lasted perfectly.",
    name: "Amelia R.",
    service: "Bridal Makeup",
    rating: 5,
  },
  {
    quote:
      "The soft glam was exactly what I wanted. Elegant, natural, and flawless.",
    name: "Sarah M.",
    service: "Special Occasion",
    rating: 5,
  },
  {
    quote:
      "My hair and makeup looked amazing in every photo. Such a calm and professional experience.",
    name: "Olivia K.",
    service: "Hair Styling",
    rating: 5,
  },
  {
    quote:
      "She understood my look instantly and created something even better than I imagined.",
    name: "Jessica T.",
    service: "Bridal Makeup",
    rating: 5,
  },
  {
    quote:
      "Beautiful finish, soft skin, and the whole look felt so polished.",
    name: "Mia L.",
    service: "Formal Look",
    rating: 5,
  },
  {
    quote:
      "I felt comfortable, relaxed, and completely ready for my event.",
    name: "Hannah S.",
    service: "Special Occasion",
    rating: 5,
  },
];

function Stars({ count = 5 }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, index) => (
        <svg
          key={index}
          className={styles.star}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.35 4.76 5.25.76-3.8 3.7.9 5.23L10 13.77l-4.7 2.18.9-5.23-3.8-3.7 5.25-.76L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className={styles.card}>
      <span className={styles.quoteMark} aria-hidden="true">
        “
      </span>
      <p className={styles.quote}>{item.quote}</p>
      <div className={styles.meta}>
        <div className={styles.metaText}>
          <p className={styles.name}>{item.name}</p>
          <p className={styles.service}>{item.service}</p>
        </div>
        <Stars count={item.rating} />
      </div>
    </article>
  );
}

function MarqueeRow({ items, direction = "left", duration = 36 }) {
  const track = [...items, ...items];

  return (
    <div
      className={`${styles.marqueeViewport} ${
        direction === "right" ? styles.marqueeRight : styles.marqueeLeft
      }`}
      style={{ "--marquee-duration": `${duration}s` }}
    >
      <div className={styles.marqueeTrack}>
        {track.map((item, index) => (
          <TestimonialCard
            key={`${item.name}-${direction}-${index}`}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const labelRef = useRef(null);
  const wordRefs = useRef([]);
  const copyRef = useRef(null);
  const marqueeRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const header = headerRef.current;
      const label = labelRef.current;
      const titleWords = wordRefs.current.filter(Boolean);
      const copy = copyRef.current;
      const marquee = marqueeRef.current;

      if (
        !section ||
        !header ||
        !label ||
        titleWords.length === 0 ||
        !copy ||
        !marquee
      ) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set([label, ...titleWords, copy, marquee], {
          opacity: 1,
          y: 0,
          filter: "none",
        });
        return;
      }

      gsap.set(label, { opacity: 0, y: 20, filter: "blur(8px)" });
      gsap.set(titleWords, { opacity: 0, y: 70, filter: "blur(10px)" });
      gsap.set(copy, { opacity: 0, y: 16 });
      gsap.set(marquee, { opacity: 0, y: 28 });

      const intro = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      intro
        .to(label, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
        })
        .to(
          titleWords,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
            stagger: 0.08,
          },
          0.1
        )
        .to(
          copy,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          0.35
        )
        .to(
          marquee,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          0.45
        );
    },
    { scope: sectionRef }
  );

  const rowTwo = [...TESTIMONIALS].reverse();

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={styles.section}
      aria-label="Testimonials"
    >
      <div className={styles.inner}>
        <header ref={headerRef} className={styles.header}>
          <p ref={labelRef} className={styles.label}>
            Kind Words
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
          <p ref={copyRef} className={styles.copy}>
            Real moments, soft glam, and unforgettable looks shared by clients
            across Melbourne.
          </p>
        </header>
      </div>

      <div ref={marqueeRef} className={styles.marqueeBlock}>
        <MarqueeRow items={TESTIMONIALS} direction="left" duration={38} />
        <div className={styles.secondRow}>
          <MarqueeRow items={rowTwo} direction="right" duration={42} />
        </div>
      </div>
    </section>
  );
}
