"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBookingModal } from "@/components/BookingModal/BookingModalContext";
import styles from "./HeroIntro.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroIntro() {
  const { openBooking } = useBookingModal();
  const sectionRef = useRef(null);
  const layoutRef = useRef(null);
  const blackRef = useRef(null);
  const themeRef = useRef(null);
  const vignetteRef = useRef(null);
  const mediaRef = useRef(null);
  const labelRef = useRef(null);
  const titleLinesRef = useRef([]);
  const descRef = useRef(null);
  const ctasRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const layout = layoutRef.current;
      const black = blackRef.current;
      const theme = themeRef.current;
      const vignette = vignetteRef.current;
      const media = mediaRef.current;
      const label = labelRef.current;
      const titleLines = titleLinesRef.current.filter(Boolean);
      const desc = descRef.current;
      const ctas = ctasRef.current;

      if (!section || !layout || !black || !theme || !media) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const textBlocks = [label, ...titleLines, desc, ctas].filter(Boolean);

      const getCenterOffset = () => {
        if (window.matchMedia("(max-width: 900px)").matches) return 0;
        const mediaRect = media.getBoundingClientRect();
        const mediaCenter = mediaRect.left + mediaRect.width / 2;
        return window.innerWidth / 2 - mediaCenter;
      };

      const notifyIntroComplete = () => {
        window.dispatchEvent(new CustomEvent("hero:intro-complete"));
      };

      const notifyIntroReset = () => {
        window.dispatchEvent(new CustomEvent("hero:intro-reset"));
      };

      if (prefersReducedMotion) {
        gsap.set(black, { opacity: 0 });
        gsap.set([theme, vignette], { opacity: 1 });
        gsap.set(media, { clearProps: "all", opacity: 1, x: 0, scale: 1 });
        gsap.set(textBlocks, {
          clearProps: "all",
          opacity: 1,
          y: 0,
          clipPath: "none",
        });
        notifyIntroComplete();
        return;
      }

      let introDone = false;
      let animating = false;
      let touchStartY = 0;

      gsap.set(black, { opacity: 1 });
      gsap.set(theme, { opacity: 0 });
      gsap.set(vignette, { opacity: 0 });
      gsap.set(media, {
        x: getCenterOffset(),
        scale: 1,
        opacity: 1,
      });
      gsap.set(textBlocks, {
        opacity: 0,
        y: 36,
        clipPath: "inset(100% 0 0 0)",
      });
      gsap.set(layout, { opacity: 1, y: 0, filter: "blur(0px)" });

      // Lock page scroll until the one-scroll intro finishes
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      const unlockScroll = () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };

      const lockScroll = () => {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      };

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: () => {
          introDone = true;
          animating = false;
          unlockScroll();
          ScrollTrigger.refresh();
          notifyIntroComplete();
        },
        onReverseComplete: () => {
          introDone = false;
          animating = false;
          lockScroll();
          window.scrollTo(0, 0);
          notifyIntroReset();
        },
      });

      // Full cinematic transition — plays once on scroll intent
      tl.to(
        media,
        {
          x: 0,
          duration: 1.35,
          ease: "power3.inOut",
        },
        0
      )
        .to(
          theme,
          {
            opacity: 1,
            duration: 1.25,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          black,
          {
            opacity: 0,
            duration: 1.25,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          vignette,
          {
            opacity: 1,
            duration: 1.1,
            ease: "power2.out",
          },
          0.1
        )
        .to(
          [label, ...titleLines],
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.85,
            stagger: 0.09,
            ease: "power3.out",
          },
          0.55
        )
        .to(
          desc,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.7,
            ease: "power3.out",
          },
          0.9
        )
        .to(
          ctas,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.65,
            ease: "power3.out",
          },
          1.05
        );

      const playIntro = () => {
        if (introDone || animating) return;
        animating = true;
        tl.play(0);
      };

      const reverseIntro = () => {
        if (!introDone || animating) return;
        if (window.scrollY > 2) return;
        animating = true;
        lockScroll();
        tl.reverse();
      };

      const onWheel = (event) => {
        if (animating) {
          event.preventDefault();
          return;
        }

        if (!introDone) {
          event.preventDefault();
          if (event.deltaY > 6) playIntro();
          return;
        }

        if (event.deltaY < -6 && window.scrollY <= 2) {
          event.preventDefault();
          reverseIntro();
        }
      };

      const onKeyDown = (event) => {
        const downKeys = ["ArrowDown", "PageDown", " ", "Spacebar"];
        const upKeys = ["ArrowUp", "PageUp"];

        if (animating) {
          event.preventDefault();
          return;
        }

        if (!introDone && downKeys.includes(event.key)) {
          event.preventDefault();
          playIntro();
          return;
        }

        if (
          introDone &&
          upKeys.includes(event.key) &&
          window.scrollY <= 2
        ) {
          event.preventDefault();
          reverseIntro();
        }
      };

      const onTouchStart = (event) => {
        touchStartY = event.touches[0].clientY;
      };

      const onTouchMove = (event) => {
        const delta = touchStartY - event.touches[0].clientY;

        if (animating) {
          event.preventDefault();
          return;
        }

        if (!introDone) {
          event.preventDefault();
          if (delta > 28) playIntro();
          return;
        }

        if (introDone && window.scrollY <= 2 && delta < -28) {
          event.preventDefault();
          reverseIntro();
        }
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });

      const onResize = () => {
        if (!introDone && !animating) {
          gsap.set(media, { x: getCenterOffset() });
        }
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", onResize);

      // Soft exit of hero content when scrolling into Expertise (after intro)
      const nextSection = section.nextElementSibling;
      let exitTween = null;
      if (nextSection) {
        exitTween = gsap.to(layout, {
          opacity: 0,
          y: -60,
          filter: "blur(8px)",
          ease: "none",
          scrollTrigger: {
            trigger: nextSection,
            start: "top bottom",
            end: "top 25%",
            scrub: true,
          },
        });
      }

      return () => {
        unlockScroll();
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("resize", onResize);
        exitTween?.scrollTrigger?.kill();
        exitTween?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      data-hero
      aria-label="Makeup By Hiraa"
    >
      <div ref={blackRef} className={styles.blackBg} aria-hidden="true" />
      <div ref={themeRef} className={styles.themeBg} aria-hidden="true" />
      <div ref={vignetteRef} className={styles.vignette} aria-hidden="true" />

      <div ref={layoutRef} className={styles.layout}>
        <div className={styles.copy}>
          <p ref={labelRef} className={styles.label}>
            Melbourne Makeup &amp; Hair Artist
          </p>

          <h1 className={styles.title}>
            {["Soft Glam.", "Bridal Beauty.", "Timeless Hair."].map(
              (line, index) => (
                <span
                  key={line}
                  ref={(el) => {
                    titleLinesRef.current[index] = el;
                  }}
                  className={styles.titleLine}
                >
                  {line}
                </span>
              )
            )}
          </h1>

          <p ref={descRef} className={styles.description}>
            Certified makeup artist and hairstylist with 9+ years of experience,
            creating elegant bridal, formal, and special occasion looks across
            Melbourne.
          </p>

          <div ref={ctasRef} className={styles.ctas}>
            <button
              type="button"
              className={`${styles.glassBtn} ${styles.primary}`}
              onClick={openBooking}
            >
              <span>Book Your Look</span>
              <span className={styles.btnArrow} aria-hidden="true">
                →
              </span>
            </button>
            <a
              className={`${styles.glassBtn} ${styles.secondary}`}
              href="#portfolio"
            >
              <span>View Portfolio</span>
              <span className={styles.btnArrow} aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        <div ref={mediaRef} className={styles.media}>
          <div className={styles.portrait}>
            {/*
              Note: public/owner.png / owner1.png are opaque RGB (no alpha).
              public/11.png has real transparency. Use a clean transparent PNG
              for best cutout — CSS mask cannot remove baked-in backgrounds.
            */}
            <Image
              src="/11.png"
              alt="Makeup By Hiraa"
              fill
              priority
              sizes="(max-width: 900px) 92vw, 48vw"
              className={styles.image}
              onLoadingComplete={() => {
                ScrollTrigger.refresh();
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
