"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LooksArchive.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TITLE_WORDS = ["Looks", "That", "Speak", "Before", "Words."];

const FEATURED_IMAGE = "/r1.jpg";

const FALLBACK_IMAGE = "/r2.jpg";

const CARDS = [
  {
    id: "c1",
    left: "6%",
    top: "7%",
    rotate: -2,
    image: "/r2.jpg",
  },
  {
    id: "c2",
    left: "6%",
    top: "36%",
    rotate: 0,
    image: "/r3.jpg",
  },
  {
    id: "c3",
    left: "11%",
    top: "65%",
    rotate: 1,
    image: "/r4.jpg",
  },
  {
    id: "c4",
    left: "24%",
    top: "4%",
    rotate: 0,
    image: "/r5.jpg",
  },
  {
    id: "c5",
    left: "24%",
    top: "39%",
    rotate: -1,
    image: "/r6.jpg",
  },
  {
    id: "c6",
    left: "27%",
    top: "70%",
    rotate: 2,
    image: "/r7.jpg",
  },
  {
    id: "c7",
    left: "calc(41% + 30px)",
    top: "5%",
    rotate: 0,
    image: "/r8.jpg",
  },
  {
    id: "c8",
    right: "24%",
    top: "4%",
    rotate: 0,
    image: "/r9.jpg",
  },
  {
    id: "c9",
    right: "24%",
    top: "39%",
    rotate: 1,
    image: "/r10.jpg",
  },
  {
    id: "c10",
    right: "27%",
    top: "70%",
    rotate: -1,
    image: "/r11.jpg",
  },
  {
    id: "c11",
    right: "6%",
    top: "7%",
    rotate: 2,
    image: "/r12.jpg",
  },
  {
    id: "c12",
    right: "6%",
    top: "36%",
    rotate: 0,
    image: "/r13.jpg",
  },
  {
    id: "c13",
    right: "11%",
    top: "65%",
    rotate: -2,
    image: "/r14.jpg",
  },
  {
    id: "c14",
    left: "50%",
    top: "75%",
    centeredX: true,
    rotate: 0,
    image: "/r15.jpg",
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

      const floatTweens = [];
      const cardImages = cards.map((card) => card.querySelector("img"));

      const killFloats = () => {
        floatTweens.forEach((tween) => tween.kill());
        floatTweens.length = 0;
      };

      const pauseFloats = () => {
        floatTweens.forEach((tween) => tween.pause());
      };

      const resumeFloats = () => {
        floatTweens.forEach((tween) => tween.resume());
      };

      const startFloating = () => {
        if (reducedMotion || floatTweens.length) return;

        cards.forEach((card, index) => {
          const amplitude = 3 + (index % 3);
          const duration = 3 + (index % 5) * 0.4;
          const tween = gsap.to(card, {
            y: `+=${amplitude}`,
            duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: (index % 7) * 0.12,
          });
          floatTweens.push(tween);
        });
      };

      if (reducedMotion) {
        gsap.set([label, ...words, center], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "none",
        });
        cards.forEach((card, index) => {
          gsap.set(card, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "none",
            rotation: CARDS[index].rotate,
          });
        });
      } else {
        gsap.set(label, { opacity: 0, y: 14, filter: "blur(8px)" });
        gsap.set(words, { opacity: 0, y: 40, filter: "blur(10px)" });
        gsap.set(center, {
          opacity: 0,
          scale: 0.92,
          filter: "blur(12px)",
        });
        gsap.set(cards, {
          opacity: 0,
          scale: 0.88,
          y: 30,
          filter: "blur(10px)",
          rotation: (i) => CARDS[i].rotate,
        });
        gsap.set(cardImages.filter(Boolean), { scale: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
            onLeaveBack: killFloats,
          },
          onComplete: startFloating,
          onReverseComplete: killFloats,
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
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power4.out",
            },
            0.22
          )
          .to(
            cards,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.75,
              stagger: 0.04,
              ease: "power3.out",
            },
            "-=0.5"
          );
      }

      // Hover-to-center: clone animates to the featured card rect so layout
      // cards never leave their absolute positions.
      let active = null;
      let centerTween = null;
      let imageTween = null;

      const FEATURED_SHADOW = "0 34px 90px rgba(58, 31, 35, 0.28)";

      const getImageSrc = (card) => {
        const img = card.querySelector("img");
        return img?.currentSrc || img?.src || "";
      };

      const killHoverTweens = () => {
        active?.tween?.kill();
        centerTween?.kill();
        imageTween?.kill();
        centerTween = null;
        imageTween = null;
      };

      const resetPreviousCard = () => {
        if (!active) return;
        const prevImage = active.card.querySelector("img");
        killHoverTweens();
        active.clone.remove();
        gsap.set(active.card, { opacity: 1 });
        if (prevImage) gsap.set(prevImage, { scale: 1 });
        active = null;
      };

      const deactivate = () => {
        if (!active) return;

        const { card, clone, origin, cloneImg } = active;
        killHoverTweens();

        const liveRect = card.getBoundingClientRect();
        const leaveDuration = reducedMotion ? 0 : 0.35;
        const cardImage = card.querySelector("img");

        centerTween = gsap.to(center, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: leaveDuration,
          ease: "power3.inOut",
          overwrite: "auto",
        });

        if (cloneImg) {
          imageTween = gsap.to(cloneImg, {
            scale: 1,
            duration: leaveDuration,
            ease: "power3.inOut",
          });
        }

        active.tween = gsap.to(clone, {
          left: liveRect.left,
          top: liveRect.top,
          width: liveRect.width,
          height: liveRect.height,
          borderRadius: origin.borderRadius,
          boxShadow: origin.boxShadow,
          duration: leaveDuration,
          ease: "power3.inOut",
          onComplete: () => {
            clone.remove();
            gsap.set(card, { opacity: 1 });
            if (cardImage) gsap.set(cardImage, { scale: 1 });
            if (active?.clone === clone) active = null;
            resumeFloats();
          },
        });
      };

      const activate = (card) => {
        if (active?.card === card) return;

        if (active) resetPreviousCard();
        pauseFloats();

        const cardRect = card.getBoundingClientRect();
        const centerRect = center.getBoundingClientRect();
        const cardStyle = getComputedStyle(card);
        const centerStyle = getComputedStyle(center);
        const src = getImageSrc(card);
        if (!src) return;

        const cardImage = card.querySelector("img");
        if (cardImage && !reducedMotion) {
          gsap.to(cardImage, {
            scale: 1.06,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          });
        }

        const clone = document.createElement("div");
        clone.className = styles.hoverClone;
        clone.setAttribute("aria-hidden", "true");

        const cloneImg = document.createElement("img");
        cloneImg.className = styles.hoverCloneImg;
        cloneImg.src = src;
        cloneImg.alt = "";
        clone.appendChild(cloneImg);
        document.body.appendChild(clone);

        const centerRadius = parseFloat(centerStyle.borderRadius) || 34;
        const featuredRadius = `${centerRadius + 4}px`;

        const origin = {
          borderRadius: cardStyle.borderRadius,
          boxShadow: cardStyle.boxShadow,
        };

        gsap.set(clone, {
          left: cardRect.left,
          top: cardRect.top,
          width: cardRect.width,
          height: cardRect.height,
          borderRadius: origin.borderRadius,
          boxShadow: origin.boxShadow,
        });
        gsap.set(cloneImg, { scale: 1, transformOrigin: "center center" });

        gsap.set(card, { opacity: 0 });

        active = { card, clone, cloneImg, origin, tween: null };

        const enterDuration = reducedMotion ? 0 : 0.4;
        const enterEase = "power3.out";

        centerTween = gsap.to(center, {
          opacity: 0.35,
          scale: 0.96,
          filter: "blur(2px)",
          duration: enterDuration,
          ease: enterEase,
          overwrite: "auto",
        });

        imageTween = gsap.to(cloneImg, {
          scale: 1.06,
          duration: enterDuration,
          ease: enterEase,
        });

        active.tween = gsap.to(clone, {
          left: centerRect.left,
          top: centerRect.top,
          width: centerRect.width,
          height: centerRect.height,
          borderRadius: featuredRadius,
          boxShadow: FEATURED_SHADOW,
          duration: enterDuration,
          ease: enterEase,
        });
      };

      const listeners = cards.map((card) => {
        const onEnter = () => activate(card);
        const onLeave = () => {
          if (active?.card === card) deactivate();
        };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        return { card, onEnter, onLeave };
      });

      return () => {
        listeners.forEach(({ card, onEnter, onLeave }) => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        });
        killFloats();
        killHoverTweens();
        if (active) {
          active.clone.remove();
          gsap.set(active.card, { opacity: 1 });
          const img = active.card.querySelector("img");
          if (img) gsap.set(img, { scale: 1 });
          active = null;
        }
        gsap.set(center, { opacity: 1, scale: 1, filter: "blur(0px)" });
        gsap.set(cardImages.filter(Boolean), { scale: 1 });
      };
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
