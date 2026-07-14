"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Services.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SERVICES = [
  {
    title: "Bridal Makeup",
    description:
      "Elegant, timeless bridal looks designed to photograph beautifully and last throughout your special day.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Hair Styling",
    description:
      "Soft waves, sleek finishes, and polished hairstyles tailored to complement your overall look.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Special Occasion",
    description:
      "Refined makeup and hair styling for formals, events, and celebrations that call for a flawless finish.",
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1400&q=80",
  },
];

function Sparkle({ className }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1.5L13.7 9.2L21 12L13.7 14.8L12 22.5L10.3 14.8L3 12L10.3 9.2L12 1.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export default function Services() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const header = headerRef.current;
      const cards = cardsRef.current.filter(Boolean);

      if (!section || !header || cards.length !== 3) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(header, { opacity: 1, y: 0 });
        gsap.set(cards, { opacity: 0, y: 0, scale: 1, pointerEvents: "none" });
        gsap.set(cards[0], {
          opacity: 1,
          zIndex: 3,
          pointerEvents: "auto",
        });
        return;
      }

      gsap.set(header, { opacity: 0, y: 28 });

      gsap.set(cards[0], {
        y: 0,
        scale: 1,
        opacity: 1,
        zIndex: 3,
        pointerEvents: "auto",
      });
      gsap.set(cards[1], {
        y: 100,
        scale: 0.97,
        opacity: 0,
        zIndex: 4,
        pointerEvents: "none",
      });
      gsap.set(cards[2], {
        y: 100,
        scale: 0.97,
        opacity: 0,
        zIndex: 5,
        pointerEvents: "none",
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        header,
        {
          opacity: 1,
          y: 0,
          duration: 0.12,
          ease: "power2.out",
        },
        0
      );

      tl.to({}, { duration: 0.18 }, 0.12);

      tl.to(
        cards[0],
        {
          opacity: 0,
          y: -60,
          scale: 0.97,
          duration: 0.22,
          ease: "power2.inOut",
          pointerEvents: "none",
        },
        0.3
      );

      tl.to(
        cards[1],
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.22,
          ease: "power2.inOut",
          pointerEvents: "auto",
        },
        0.32
      );

      tl.to({}, { duration: 0.18 }, 0.54);

      tl.to(
        cards[1],
        {
          opacity: 0,
          y: -60,
          scale: 0.97,
          duration: 0.22,
          ease: "power2.inOut",
          pointerEvents: "none",
        },
        0.72
      );

      tl.to(
        cards[2],
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.22,
          ease: "power2.inOut",
          pointerEvents: "auto",
        },
        0.74
      );

      tl.to({}, { duration: 0.16 }, 0.96);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className={styles.section}
      aria-label="Our Services"
    >
      <div className={styles.background} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <header ref={headerRef} className={styles.header}>
          <p className={styles.label}>Our Services</p>
          <h2 className={styles.title}>Signature Beauty Services</h2>
          <p className={styles.intro}>
            Thoughtfully crafted looks for bridal moments, hair styling, and
            special occasions.
          </p>
        </header>

        <div ref={stageRef} className={styles.stage}>
          {SERVICES.map((service, index) => (
            <article
              key={service.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={styles.card}
            >
              <div className={styles.media}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 900px) 92vw, 55vw"
                  className={styles.image}
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>

              <div className={styles.contentArea}>
                <div className={styles.contentTexture} aria-hidden="true" />

                <div className={styles.innerBox}>
                  <Sparkle className={`${styles.sparkle} ${styles.sparkleTop}`} />
                  <Sparkle
                    className={`${styles.sparkle} ${styles.sparkleBottom}`}
                  />

                  <h3 className={styles.cardTitle}>{service.title}</h3>

                  <div className={styles.divider} aria-hidden="true">
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerSpark}>✦</span>
                    <span className={styles.dividerLine} />
                  </div>

                  <p className={styles.cardDescription}>{service.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
