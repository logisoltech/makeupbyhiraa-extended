"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LooksArchive.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TITLE_WORDS = ["Looks", "That", "Speak", "Before", "Words."];

const FEATURED_IMAGE =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=82";

const CARDS = [
  {
    id: "c1",
    left: "6%",
    top: "7%",
    rotate: -2,
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c2",
    left: "6%",
    top: "36%",
    rotate: 0,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c3",
    left: "11%",
    top: "65%",
    rotate: 1,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c4",
    left: "24%",
    top: "4%",
    rotate: 0,
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c5",
    left: "24%",
    top: "39%",
    rotate: -1,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c6",
    left: "27%",
    top: "70%",
    rotate: 2,
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c7",
    left: "calc(41% + 30px)",
    top: "5%",
    rotate: 0,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c8",
    right: "24%",
    top: "4%",
    rotate: 0,
    image:
      "https://images.unsplash.com/photo-1595475038665-8de2a4b727d7?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c9",
    right: "24%",
    top: "39%",
    rotate: 1,
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c10",
    right: "27%",
    top: "70%",
    rotate: -1,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c11",
    right: "6%",
    top: "7%",
    rotate: 2,
    image:
      "https://images.unsplash.com/photo-1606170033648-5d55a83be8e5?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c12",
    right: "6%",
    top: "36%",
    rotate: 0,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c13",
    right: "11%",
    top: "65%",
    rotate: -2,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=82",
  },
  {
    id: "c14",
    left: "50%",
    top: "75%",
    centeredX: true,
    rotate: 0,
    image:
      "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=600&q=82",
  },
];

function handleImageError(event) {
  if (event.currentTarget.dataset.fallback === "true") return;
  event.currentTarget.dataset.fallback = "true";
  event.currentTarget.src = FALLBACK_IMAGE;
}

export default function LooksArchive() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const wordRefs = useRef([]);
  const stageRef = useRef(null);
  const centerRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const label = labelRef.current;
      const words = wordRefs.current.filter(Boolean);
      const center = centerRef.current;
      const cards = cardRefs.current.filter(Boolean);

      if (
        !section ||
        !stage ||
        !label ||
        words.length !== TITLE_WORDS.length ||
        !center ||
        cards.length !== CARDS.length
      ) {
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const toCenterOffset = (card) => ({
        x: stage.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2),
        y: stage.clientHeight / 2 - (card.offsetTop + card.offsetHeight / 2),
      });

      if (reducedMotion) {
        gsap.set([label, ...words, center, ...cards], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "none",
        });
        return;
      }

      gsap.set(label, { opacity: 0, y: 14, filter: "blur(8px)" });
      gsap.set(words, { opacity: 0, y: 40, filter: "blur(10px)" });
      gsap.set(center, { opacity: 0, scale: 0.95, y: 20 });

      cards.forEach((card) => {
        const offset = toCenterOffset(card);
        gsap.set(card, {
          opacity: 0,
          x: offset.x,
          y: offset.y,
          scale: 0.6,
          rotation: 0,
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      });

      tl.to(label, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
      })
        .to(
          words,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.68,
            stagger: 0.05,
            ease: "power4.out",
          },
          0.05
        )
        .to(
          center,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: "power4.out",
          },
          0.28
        )
        .to(
          cards,
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: (i) => CARDS[i].rotate,
            duration: 0.6,
            stagger: 0.035,
          },
          0.42
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className={styles.section}
      aria-label="Looks Archive"
    >
      <header className={styles.header}>
        <p ref={labelRef} className={styles.label}>
          Portfolio
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
      </header>

      <div ref={stageRef} className={styles.stage}>
        {CARDS.map((card, index) => (
          <article
            key={card.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`${styles.card} ${card.centeredX ? styles.cardCenteredX : ""}`}
            style={{
              left: card.left,
              right: card.right,
              top: card.top,
            }}
            aria-hidden="true"
          >
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(max-width: 640px) 64px, (max-width: 1024px) 100px, 135px"
              className={styles.image}
              onError={handleImageError}
            />
          </article>
        ))}

        <article
          ref={centerRef}
          className={styles.centerCard}
          aria-label="Featured beauty portrait"
        >
          <Image
            src={FEATURED_IMAGE}
            alt="Featured beauty portrait"
            fill
            sizes="(max-width: 640px) 190px, (max-width: 1024px) 250px, 300px"
            className={styles.image}
            onError={handleImageError}
            priority
          />
        </article>
      </div>
    </section>
  );
}
