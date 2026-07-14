"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { HiHome } from "react-icons/hi2";
import { useBookingModal } from "@/components/BookingModal/BookingModalContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { openBooking } = useBookingModal();
  const navRef = useRef(null);
  const homeTextRef = useRef(null);
  const homeIconRef = useRef(null);
  const servicesRef = useRef(null);
  const bookingRef = useRef(null);
  const revealTween = useRef(null);
  const modeTween = useRef(null);
  const visibleRef = useRef(false);
  const compactRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const nav = navRef.current;
    const homeText = homeTextRef.current;
    const homeIcon = homeIconRef.current;
    const services = servicesRef.current;
    const booking = bookingRef.current;
    if (!nav || !homeText || !homeIcon || !services || !booking) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.set(homeIcon, { opacity: 0, visibility: "hidden" });
    gsap.set([homeText, services, booking], { opacity: 1 });

    const setHidden = () => {
      gsap.set(nav, {
        opacity: 0,
        y: -16,
        filter: "blur(8px)",
        pointerEvents: "none",
        visibility: "hidden",
        clearProps: "width,height,padding,gap",
      });
    };

    const show = () => {
      if (visibleRef.current) return;
      visibleRef.current = true;
      setVisible(true);
      revealTween.current?.kill();

      gsap.set(nav, { visibility: "visible" });
      revealTween.current = gsap.to(nav, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        pointerEvents: "auto",
        duration: reducedMotion ? 0 : 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const hide = () => {
      visibleRef.current = false;
      compactRef.current = false;
      setVisible(false);
      setCompact(false);
      revealTween.current?.kill();
      modeTween.current?.kill();

      gsap.set(nav, {
        opacity: 0,
        y: -16,
        filter: "blur(8px)",
        pointerEvents: "none",
        visibility: "hidden",
        clearProps: "width,height,padding,gap",
      });
      gsap.set(homeIcon, { opacity: 0, visibility: "hidden" });
      gsap.set([homeText, services, booking], {
        opacity: 1,
        pointerEvents: "auto",
        clearProps: "width,padding,margin,position",
      });
      nav.classList.remove(styles.navCompact);
    };

    const toCompact = () => {
      if (!visibleRef.current || compactRef.current) return;
      compactRef.current = true;
      setCompact(true);
      modeTween.current?.kill();

      const fullWidth = nav.offsetWidth;
      const fullHeight = nav.offsetHeight;
      gsap.set(nav, { width: fullWidth, height: fullHeight });
      gsap.set([services, booking], { overflow: "hidden" });
      nav.classList.add(styles.navCompact);

      modeTween.current = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(
          [services, booking],
          {
            opacity: 0,
            width: 0,
            minWidth: 0,
            padding: 0,
            margin: 0,
            duration: reducedMotion ? 0 : 0.35,
            pointerEvents: "none",
          },
          0
        )
        .to(
          homeText,
          {
            opacity: 0,
            duration: reducedMotion ? 0 : 0.28,
          },
          0
        )
        .set(homeIcon, { visibility: "visible" }, 0)
        .to(
          homeIcon,
          {
            opacity: 1,
            duration: reducedMotion ? 0 : 0.35,
          },
          0.08
        )
        .to(
          nav,
          {
            width: 48,
            height: 48,
            padding: 0,
            gap: 0,
            duration: reducedMotion ? 0 : 0.42,
          },
          0
        );
    };

    const toFull = () => {
      if (!visibleRef.current || !compactRef.current) return;
      compactRef.current = false;
      setCompact(false);
      modeTween.current?.kill();

      // Measure natural full size with items restored but invisible.
      nav.classList.remove(styles.navCompact);
      gsap.set(nav, {
        width: "auto",
        height: "auto",
        padding: 8,
        gap: 8,
      });
      gsap.set([services, booking, homeText], {
        opacity: 0,
        width: "auto",
        minWidth: "",
        padding: "",
        margin: "",
        overflow: "",
        pointerEvents: "auto",
      });
      const targetWidth = nav.offsetWidth;
      const targetHeight = nav.offsetHeight;

      gsap.set(nav, { width: 48, height: 48, padding: 0, gap: 0 });
      nav.classList.add(styles.navCompact);

      modeTween.current = gsap
        .timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            nav.classList.remove(styles.navCompact);
            gsap.set(nav, { clearProps: "width,height,padding,gap" });
            gsap.set([services, booking], {
              clearProps: "width,minWidth,padding,margin,overflow",
            });
          },
        })
        .to(
          homeIcon,
          {
            opacity: 0,
            duration: reducedMotion ? 0 : 0.25,
            onComplete: () => {
              gsap.set(homeIcon, { visibility: "hidden" });
            },
          },
          0
        )
        .to(
          nav,
          {
            width: targetWidth,
            height: targetHeight,
            padding: 8,
            gap: 8,
            duration: reducedMotion ? 0 : 0.42,
          },
          0
        )
        .add(() => {
          nav.classList.remove(styles.navCompact);
        }, 0.02)
        .to(
          [homeText, services, booking],
          {
            opacity: 1,
            duration: reducedMotion ? 0 : 0.35,
          },
          0.12
        );
    };

    const syncCompact = () => {
      if (!visibleRef.current) return;
      if (window.scrollY > 80) toCompact();
      else toFull();
    };

    const onProgress = (event) => {
      const progress = event.detail?.progress ?? 0;
      if (progress < 0.95) hide();
    };

    const onComplete = () => {
      show();
      requestAnimationFrame(syncCompact);
    };

    setHidden();
    if (document.body.dataset.heroIntro === "done") {
      onComplete();
    }

    const onScroll = () => {
      const servicesEl = document.getElementById("services");
      const contact = document.getElementById("contact");
      const y = window.scrollY + window.innerHeight * 0.28;

      if (contact && y >= contact.offsetTop) setActive("booking");
      else if (servicesEl && y >= servicesEl.offsetTop) setActive("services");
      else setActive("home");

      syncCompact();
    };

    onScroll();
    window.addEventListener("hero:intro-progress", onProgress);
    window.addEventListener("hero:intro-complete", onComplete);
    window.addEventListener("hero:intro-reset", hide);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("hero:intro-progress", onProgress);
      window.removeEventListener("hero:intro-complete", onComplete);
      window.removeEventListener("hero:intro-reset", hide);
      window.removeEventListener("scroll", onScroll);
      revealTween.current?.kill();
      modeTween.current?.kill();
    };
  }, [mounted]);

  const goHome = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActive("home");
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

  return createPortal(
    <nav
      ref={navRef}
      className={`${styles.nav} ${compact ? styles.navCompact : ""}`}
      aria-label="Primary"
      aria-hidden={!visible}
    >
      <a
        href="#"
        className={`${styles.homeLink} ${
          active === "home" && !compact ? styles.linkActive : ""
        }`}
        tabIndex={visible ? 0 : -1}
        aria-label="Home"
        onClick={goHome}
      >
        <span ref={homeTextRef} className={styles.homeText}>
          Home
        </span>
        <span ref={homeIconRef} className={styles.homeIcon} aria-hidden="true">
          <HiHome size={21} />
        </span>
      </a>

      <a
        ref={servicesRef}
        href="#services"
        className={`${styles.link} ${
          active === "services" ? styles.linkActive : ""
        }`}
        tabIndex={visible && !compact ? 0 : -1}
        onClick={goServices}
      >
        Services
      </a>

      <a
        ref={bookingRef}
        href="#contact"
        className={`${styles.link} ${styles.booking} ${
          active === "booking" ? styles.bookingActive : ""
        }`}
        tabIndex={visible && !compact ? 0 : -1}
        onClick={goBooking}
      >
        <span>Booking</span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </a>
    </nav>,
    document.body
  );
}
