"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { HiHome } from "react-icons/hi2";
import { useBookingModal } from "@/components/BookingModal/BookingModalContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { openBooking } = useBookingModal();
  const fullRef = useRef(null);
  const compactRef = useRef(null);
  const stateRef = useRef("hidden");
  const introDoneRef = useRef(false);
  const tweenRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [navState, setNavState] = useState("hidden");
  const [active, setActive] = useState("about");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const full = fullRef.current;
    const compact = compactRef.current;
    if (!full || !compact) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dur = reducedMotion ? 0 : 0.4;

    // Initial hidden state — hero timeline owns the first reveal at "heroReveal".
    gsap.set(full, {
      xPercent: -50,
      opacity: 0,
      y: -14,
      filter: "blur(8px)",
      pointerEvents: "none",
      visibility: "visible",
    });
    gsap.set(compact, {
      opacity: 0,
      x: -10,
      visibility: "hidden",
      pointerEvents: "none",
    });

    const setState = (next) => {
      stateRef.current = next;
      setNavState(next);
    };

    const goHidden = ({ animate = true } = {}) => {
      if (stateRef.current === "hidden") return;

      const from = stateRef.current;
      setState("hidden");
      tweenRef.current?.kill();

      // During intro reverse, hero timeline drives full-nav opacity — don't fight it.
      if (!introDoneRef.current && from === "full") {
        gsap.set(compact, {
          opacity: 0,
          x: -10,
          visibility: "hidden",
          pointerEvents: "none",
        });
        return;
      }

      if (!animate) {
        gsap.set(full, {
          xPercent: -50,
          opacity: 0,
          y: -14,
          filter: "blur(8px)",
          pointerEvents: "none",
        });
        gsap.set(compact, {
          opacity: 0,
          x: -10,
          visibility: "hidden",
          pointerEvents: "none",
        });
        return;
      }

      tweenRef.current = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (from === "full") {
        tweenRef.current.to(full, {
          xPercent: -50,
          opacity: 0,
          y: -14,
          filter: "blur(8px)",
          pointerEvents: "none",
          duration: reducedMotion ? 0 : 0.35,
        });
      }

      if (from === "compact") {
        tweenRef.current.to(
          compact,
          {
            opacity: 0,
            x: -10,
            pointerEvents: "none",
            duration: reducedMotion ? 0 : 0.3,
            onComplete: () => {
              gsap.set(compact, { visibility: "hidden" });
            },
          },
          0
        );
      }
    };

    const goFull = ({ animate = true } = {}) => {
      if (stateRef.current === "full") return;

      const from = stateRef.current;
      setState("full");
      tweenRef.current?.kill();

      // First reveal is owned by the hero GSAP timeline ("heroReveal").
      if (!introDoneRef.current && from === "hidden") {
        gsap.set(full, {
          xPercent: -50,
          visibility: "visible",
        });
        gsap.set(compact, {
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
        });
        return;
      }

      tweenRef.current = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (from === "compact") {
        tweenRef.current.to(
          compact,
          {
            opacity: 0,
            x: -10,
            pointerEvents: "none",
            duration: dur,
            onComplete: () => {
              gsap.set(compact, { visibility: "hidden" });
            },
          },
          0
        );
      }

      gsap.set(full, {
        visibility: "visible",
        xPercent: -50,
        pointerEvents: "none",
      });

      if (!animate) {
        gsap.set(full, {
          xPercent: -50,
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          pointerEvents: "auto",
        });
        return;
      }

      tweenRef.current.fromTo(
        full,
        {
          xPercent: -50,
          opacity: 0,
          y: -14,
          filter: "blur(8px)",
        },
        {
          xPercent: -50,
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          pointerEvents: "auto",
          duration: dur,
        },
        from === "compact" ? 0.08 : 0
      );
    };

    const goCompact = () => {
      if (stateRef.current === "compact") return;

      const from = stateRef.current;
      setState("compact");
      tweenRef.current?.kill();

      tweenRef.current = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (from === "full") {
        tweenRef.current.to(
          full,
          {
            xPercent: -50,
            opacity: 0,
            y: -10,
            filter: "blur(6px)",
            pointerEvents: "none",
            duration: dur,
            onComplete: () => {
              gsap.set(full, {
                y: -14,
                filter: "blur(8px)",
              });
            },
          },
          0
        );
      }

      gsap.set(compact, { visibility: "visible", pointerEvents: "none" });

      tweenRef.current.fromTo(
        compact,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          pointerEvents: "auto",
          duration: dur,
        },
        from === "full" ? 0.08 : 0
      );
    };

    const isPastHero = () => {
      const hero = document.querySelector("[data-hero]");
      if (!hero) return window.scrollY > 100;
      return window.scrollY > Math.max(90, hero.offsetHeight * 0.22);
    };

    const syncScrollMode = () => {
      if (!introDoneRef.current) return;
      if (isPastHero()) goCompact();
      else goFull({ animate: stateRef.current === "compact" });
    };

    const onProgress = (event) => {
      // Aria/state only during intro — opacity is owned by hero timeline "heroReveal".
      if (introDoneRef.current) return;
      const progress = event.detail?.progress ?? 0;
      if (progress >= 0.32) {
        if (stateRef.current !== "full") setState("full");
      } else if (stateRef.current !== "hidden") {
        setState("hidden");
      }
    };

    const onComplete = () => {
      introDoneRef.current = true;
      setState("full");
      gsap.set(full, {
        xPercent: -50,
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        pointerEvents: "auto",
        visibility: "visible",
      });
      syncScrollMode();
    };

    const onReset = () => {
      introDoneRef.current = false;
      tweenRef.current?.kill();
      setState("hidden");
      gsap.set(compact, {
        opacity: 0,
        x: -10,
        visibility: "hidden",
        pointerEvents: "none",
      });
      // Full nav opacity is reversed by the hero timeline — don't override it here.
    };

    const onScroll = () => {
      const servicesEl = document.getElementById("services");
      const contact = document.getElementById("contact");
      const y = window.scrollY + window.innerHeight * 0.28;

      if (contact && y >= contact.offsetTop) setActive("booking");
      else if (servicesEl && y >= servicesEl.offsetTop) setActive("services");
      else setActive("about");

      syncScrollMode();
    };

    if (document.body.dataset.heroIntro === "done") {
      introDoneRef.current = true;
      goFull({ animate: false });
      gsap.set(full, {
        xPercent: -50,
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        pointerEvents: "auto",
        visibility: "visible",
      });
      syncScrollMode();
    }

    onScroll();

    window.addEventListener("hero:intro-progress", onProgress);
    window.addEventListener("hero:intro-complete", onComplete);
    window.addEventListener("hero:intro-reset", onReset);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("hero:intro-progress", onProgress);
      window.removeEventListener("hero:intro-complete", onComplete);
      window.removeEventListener("hero:intro-reset", onReset);
      window.removeEventListener("scroll", onScroll);
      tweenRef.current?.kill();
    };
  }, [mounted]);

  const goAbout = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActive("about");
  };

  const goHome = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActive("about");
  };

  const goServices = (event) => {
    event.preventDefault();
    const target = document.querySelector("#services");
    if (target) target.scrollIntoView({ behavior: "smooth" });
    setActive("services");
  };

  const goBooking = (event) => {
    event.preventDefault();
    openBooking();
    setActive("booking");
  };

  if (!mounted) return null;

  const fullVisible = navState === "full";
  const compactVisible = navState === "compact";

  return createPortal(
    <>
      <nav
        ref={fullRef}
        className={`${styles.nav} main-navbar`}
        data-main-navbar
        aria-label="Primary"
        aria-hidden={!fullVisible}
      >
        <a
          href="#"
          className={`${styles.link} ${
            active === "about" ? styles.linkActive : ""
          }`}
          tabIndex={fullVisible ? 0 : -1}
          onClick={goAbout}
        >
          About
        </a>
        <a
          href="#services"
          className={`${styles.link} ${
            active === "services" ? styles.linkActive : ""
          }`}
          tabIndex={fullVisible ? 0 : -1}
          onClick={goServices}
        >
          Services
        </a>
        <a
          href="#contact"
          className={`${styles.link} ${
            active === "booking" ? styles.linkActive : ""
          }`}
          tabIndex={fullVisible ? 0 : -1}
          onClick={goBooking}
        >
          Booking
        </a>
      </nav>

      <button
        ref={compactRef}
        type="button"
        className={styles.compact}
        aria-label="Home"
        aria-hidden={!compactVisible}
        tabIndex={compactVisible ? 0 : -1}
        onClick={goHome}
      >
        <HiHome size={21} aria-hidden="true" />
      </button>
    </>,
    document.body
  );
}
