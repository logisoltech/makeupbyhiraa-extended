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

      const notifyIntroProgress = (progress) => {
        window.dispatchEvent(
          new CustomEvent("hero:intro-progress", {
            detail: { progress },
          })
        );
      };

      const notifyIntroComplete = () => {
        document.body.dataset.heroIntro = "done";
        notifyIntroProgress(1);
        window.dispatchEvent(new CustomEvent("hero:intro-complete"));
      };

      const notifyIntroReset = () => {
        document.body.dataset.heroIntro = "active";
        notifyIntroProgress(0);
        window.dispatchEvent(new CustomEvent("hero:intro-reset"));
      };

      // Apply before paint (useGSAP → useLayoutEffect): end CSS FOUC pending state.
      document.body.dataset.heroIntro = "active";
      notifyIntroProgress(0);
      section.classList.remove(styles.heroIntroPending);
      gsap.set(textBlocks, {
        autoAlpha: 0,
        y: 36,
        clipPath: "inset(100% 0 0 0)",
      });
      gsap.set(black, { autoAlpha: 1 });
      gsap.set([theme, vignette], { autoAlpha: 0 });
      const navbarBoot = document.querySelector("[data-main-navbar]");
      if (navbarBoot) {
        gsap.set(navbarBoot, {
          autoAlpha: 0,
          pointerEvents: "none",
        });
      }

      if (prefersReducedMotion) {
        gsap.set(black, { opacity: 0 });
        gsap.set([theme, vignette], { opacity: 1 });
        gsap.set(media, { clearProps: "all", opacity: 1, x: 0, scale: 1 });
        gsap.set(textBlocks, {
          clearProps: "all",
          autoAlpha: 1,
          y: 0,
          clipPath: "none",
        });
        const navbarReduced = document.querySelector("[data-main-navbar]");
        if (navbarReduced) {
          gsap.set(navbarReduced, {
            xPercent: -50,
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            pointerEvents: "auto",
          });
        }
        notifyIntroComplete();
        return;
      }

      // Kill any prior hero intro triggers before recreating
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.id === "heroIntro") t.kill();
      });

      const unlockScroll = () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };

      const lockScroll = () => {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      };

      lockScroll();

      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        let introDone = false;
        let animating = false;
        let touchStartY = 0;
        let navbarAttached = false;

        // Desktop: keep image in the RIGHT grid column; only animate x.
        // Force layout after removing FOUC pending class, then measure center offset.
        gsap.set(media, {
          clearProps: "position,left,top,xPercent,yPercent,margin,transform",
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
        });

        const getCenterOffset = () => {
          const mediaRect = media.getBoundingClientRect();
          const mediaCenter = mediaRect.left + mediaRect.width / 2;
          return window.innerWidth / 2 - mediaCenter;
        };

        // Flush pending→grid so getBoundingClientRect is accurate.
        void media.offsetWidth;
        const centerX = getCenterOffset();

        gsap.set(black, { autoAlpha: 1 });
        gsap.set(theme, { autoAlpha: 0 });
        gsap.set(vignette, { autoAlpha: 0 });
        gsap.set(media, { x: centerX, y: 0, scale: 1, autoAlpha: 1 });
        gsap.set(textBlocks, {
          autoAlpha: 0,
          y: 36,
          clipPath: "inset(100% 0 0 0)",
        });
        gsap.set(layout, { opacity: 1, y: 0, filter: "blur(0px)" });

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
          onUpdate: () => notifyIntroProgress(tl.progress()),
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

        const attachNavbar = () => {
          if (navbarAttached) return;
          const navbar = document.querySelector("[data-main-navbar]");
          if (!navbar) return;
          gsap.set(navbar, {
            xPercent: -50,
            autoAlpha: 0,
            y: -14,
            filter: "blur(8px)",
            pointerEvents: "none",
          });
          tl.to(
            navbar,
            {
              xPercent: -50,
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              pointerEvents: "auto",
              duration: 0.7,
              ease: "power3.out",
            },
            "heroReveal"
          );
          navbarAttached = true;
        };

        // Center → right column (x: 0). Same path reverse = no jump.
        tl.fromTo(
          media,
          { x: centerX, y: 0, scale: 1 },
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.35,
            ease: "power3.inOut",
            immediateRender: false,
          },
          0
        )
          .to(theme, { autoAlpha: 1, duration: 1.25, ease: "power2.inOut" }, 0)
          .to(black, { autoAlpha: 0, duration: 1.25, ease: "power2.inOut" }, 0)
          .to(
            vignette,
            { autoAlpha: 1, duration: 1.1, ease: "power2.out" },
            0.1
          )
          .addLabel("heroReveal", 0.55)
          .to(
            [label, ...titleLines],
            {
              autoAlpha: 1,
              y: 0,
              clipPath: "inset(0% 0 0 0)",
              duration: 0.85,
              stagger: 0.09,
              ease: "power3.out",
            },
            "heroReveal"
          )
          .to(
            desc,
            {
              autoAlpha: 1,
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
              autoAlpha: 1,
              y: 0,
              clipPath: "inset(0% 0 0 0)",
              duration: 0.65,
              ease: "power3.out",
            },
            1.05
          );

        attachNavbar();
        requestAnimationFrame(attachNavbar);

        const playIntro = () => {
          if (introDone || animating) return;
          attachNavbar();
          animating = true;
          tl.play(0);
        };

        const reverseIntro = () => {
          if (!introDone || animating) return;
          if (window.scrollY > 2) return;
          animating = true;
          lockScroll();
          // Do NOT reset body dataset before reverse — that caused CSS jumps.
          tl.reverse();
        };

        const isBookingModalOpen = () =>
          document.body.dataset.bookingLock === "true";

        const onWheel = (event) => {
          if (isBookingModalOpen()) return;
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
          if (isBookingModalOpen()) return;
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
          if (introDone && upKeys.includes(event.key) && window.scrollY <= 2) {
            event.preventDefault();
            reverseIntro();
          }
        };

        const onTouchStart = (event) => {
          if (isBookingModalOpen()) return;
          touchStartY = event.touches[0].clientY;
        };

        const onTouchMove = (event) => {
          if (isBookingModalOpen()) return;
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

        const onResize = () => {
          if (!introDone && !animating) {
            const nextCenter = getCenterOffset();
            gsap.set(media, { x: nextCenter, y: 0 });
            const mediaTween = tl.getTweensOf(media)[0];
            if (mediaTween?.vars) {
              mediaTween.vars.startAt = { x: nextCenter, y: 0, scale: 1 };
            }
          }
          ScrollTrigger.refresh();
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("resize", onResize);

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
          window.removeEventListener("wheel", onWheel);
          window.removeEventListener("keydown", onKeyDown);
          window.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("resize", onResize);
          exitTween?.scrollTrigger?.kill();
          exitTween?.kill();
          tl.kill();
        };
      });

      mm.add("(max-width: 768px)", () => {
        let introDone = false;
        let animating = false;
        let touchStartY = 0;
        let navbarAttached = false;

        // Mobile: one relative wrapper; only y/scale transforms (no position switch).
        gsap.set(media, {
          clearProps: "position,left,top,xPercent,yPercent,margin,transform",
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
        });

        // Measure natural top slot after FOUC pending class is removed.
        void media.offsetWidth;
        const rect = media.getBoundingClientRect();
        const introY =
          window.innerHeight / 2 - (rect.top + rect.height / 2);

        gsap.set(black, { autoAlpha: 1 });
        gsap.set(theme, { autoAlpha: 0 });
        gsap.set(vignette, { autoAlpha: 0 });
        gsap.set(media, { x: 0, y: introY, scale: 0.9, autoAlpha: 1 });
        gsap.set(textBlocks, {
          autoAlpha: 0,
          y: 36,
          clipPath: "inset(100% 0 0 0)",
        });
        gsap.set(layout, { opacity: 1, y: 0, filter: "blur(0px)" });

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
          onUpdate: () => notifyIntroProgress(tl.progress()),
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

        const attachNavbar = () => {
          if (navbarAttached) return;
          const navbar = document.querySelector("[data-main-navbar]");
          if (!navbar) return;
          gsap.set(navbar, {
            xPercent: -50,
            autoAlpha: 0,
            y: -14,
            filter: "blur(8px)",
            pointerEvents: "none",
          });
          tl.to(
            navbar,
            {
              xPercent: -50,
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              pointerEvents: "auto",
              duration: 0.7,
              ease: "power3.out",
            },
            "heroReveal"
          );
          navbarAttached = true;
        };

        // Centered intro → top hero slot. Frozen from/to = smooth reverse.
        tl.fromTo(
          media,
          { x: 0, y: introY, scale: 0.9 },
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.35,
            ease: "power3.inOut",
            immediateRender: false,
          },
          0
        )
          .to(theme, { autoAlpha: 1, duration: 1.25, ease: "power2.inOut" }, 0)
          .to(black, { autoAlpha: 0, duration: 1.25, ease: "power2.inOut" }, 0)
          .to(
            vignette,
            { autoAlpha: 1, duration: 1.1, ease: "power2.out" },
            0.1
          )
          .addLabel("heroReveal", 0.55)
          .to(
            [label, ...titleLines],
            {
              autoAlpha: 1,
              y: 0,
              clipPath: "inset(0% 0 0 0)",
              duration: 0.85,
              stagger: 0.09,
              ease: "power3.out",
            },
            "heroReveal"
          )
          .to(
            desc,
            {
              autoAlpha: 1,
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
              autoAlpha: 1,
              y: 0,
              clipPath: "inset(0% 0 0 0)",
              duration: 0.65,
              ease: "power3.out",
            },
            1.05
          );

        attachNavbar();
        requestAnimationFrame(attachNavbar);

        const playIntro = () => {
          if (introDone || animating) return;
          attachNavbar();
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

        const isBookingModalOpen = () =>
          document.body.dataset.bookingLock === "true";

        const onWheel = (event) => {
          if (isBookingModalOpen()) return;
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
          if (isBookingModalOpen()) return;
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
          if (introDone && upKeys.includes(event.key) && window.scrollY <= 2) {
            event.preventDefault();
            reverseIntro();
          }
        };

        const onTouchStart = (event) => {
          if (isBookingModalOpen()) return;
          touchStartY = event.touches[0].clientY;
        };

        const onTouchMove = (event) => {
          if (isBookingModalOpen()) return;
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

        const onResize = () => {
          if (!introDone && !animating) {
            gsap.set(media, { x: 0, y: 0, scale: 1 });
            const nextRect = media.getBoundingClientRect();
            const nextIntroY =
              window.innerHeight / 2 - (nextRect.top + nextRect.height / 2);
            gsap.set(media, { y: nextIntroY, scale: 0.9 });
          }
          ScrollTrigger.refresh();
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("resize", onResize);

        const nextSection = section.nextElementSibling;
        let exitTween = null;
        if (nextSection) {
          exitTween = gsap.to(layout, {
            opacity: 0,
            y: -40,
            filter: "blur(6px)",
            ease: "none",
            scrollTrigger: {
              trigger: nextSection,
              start: "top bottom",
              end: "top 30%",
              scrub: true,
            },
          });
        }

        return () => {
          window.removeEventListener("wheel", onWheel);
          window.removeEventListener("keydown", onKeyDown);
          window.removeEventListener("touchstart", onTouchStart);
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("resize", onResize);
          exitTween?.scrollTrigger?.kill();
          exitTween?.kill();
          tl.kill();
        };
      });

      return () => {
        unlockScroll();
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={`${styles.hero} ${styles.heroIntroPending}`}
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
            <Image
              src="/11.png"
              alt="Makeup By Hiraa"
              fill
              priority
              sizes="(max-width: 768px) 82vw, (max-width: 1200px) 48vw, 560px"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
