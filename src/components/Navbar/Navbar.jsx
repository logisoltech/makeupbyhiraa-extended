"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useBookingModal } from "@/components/BookingModal/BookingModalContext";
import styles from "./Navbar.module.css";

const LINKS = [
  { id: "home", label: "Home", href: "#" },
  { id: "services", label: "Services", href: "#services" },
  { id: "booking", label: "Booking", href: "#contact", booking: true },
];

function BookingArrow() {
  return (
    <svg
      className={styles.bookingArrow}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function resolveNavMode(heroReady, heroProgress) {
  if (!heroReady || heroProgress < 0.95) return "hidden";

  const hero = document.querySelector("[data-hero]");
  const heroHeight = hero?.offsetHeight || window.innerHeight;
  const threshold = Math.max(heroHeight - 80, window.innerHeight * 0.7);

  if (window.scrollY < threshold) return "full";
  return "compact";
}

export default function Navbar() {
  const { openBooking } = useBookingModal();
  const fullRef = useRef(null);
  const compactRef = useRef(null);
  const menuRef = useRef(null);
  const modeRef = useRef("hidden");
  const heroReadyRef = useRef(false);
  const heroProgressRef = useRef(0);
  const fullTween = useRef(null);
  const compactTween = useRef(null);
  const menuTween = useRef(null);

  const [mode, setMode] = useState("hidden");
  const [menuOpen, setMenuOpen] = useState(false);
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const full = fullRef.current;
    const compact = compactRef.current;
    if (!full || !compact) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.set(full, {
      opacity: 0,
      y: -20,
      filter: "blur(8px)",
      pointerEvents: "none",
      visibility: "hidden",
    });
    gsap.set(compact, {
      opacity: 0,
      x: -20,
      yPercent: -50,
      scale: 0.95,
      pointerEvents: "none",
      visibility: "hidden",
    });

    const applyMode = (nextMode) => {
      if (modeRef.current === nextMode) return;
      modeRef.current = nextMode;
      setMode(nextMode);
      setCompactMenuOpen(false);

      fullTween.current?.kill();
      compactTween.current?.kill();

      const hideFull = (duration = 0.25) => {
        fullTween.current = gsap.to(full, {
          opacity: 0,
          y: -18,
          filter: reducedMotion ? "none" : "blur(8px)",
          pointerEvents: "none",
          duration: reducedMotion ? 0 : duration,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(full, { visibility: "hidden" });
          },
        });
      };

      const showFull = () => {
        gsap.set(full, { visibility: "visible" });
        fullTween.current = gsap.to(full, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          pointerEvents: "auto",
          duration: reducedMotion ? 0 : 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const hideCompact = (duration = 0.25) => {
        compactTween.current = gsap.to(compact, {
          opacity: 0,
          x: -20,
          yPercent: -50,
          scale: 0.95,
          pointerEvents: "none",
          duration: reducedMotion ? 0 : duration,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(compact, { visibility: "hidden" });
          },
        });
      };

      const showCompact = () => {
        gsap.set(compact, { visibility: "visible", yPercent: -50 });
        compactTween.current = gsap.to(compact, {
          opacity: 1,
          x: 0,
          yPercent: -50,
          scale: 1,
          pointerEvents: "auto",
          duration: reducedMotion ? 0 : 0.45,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      if (nextMode === "hidden") {
        // Instant hide for black intro — never leave navbar flashing.
        gsap.set(full, {
          opacity: 0,
          y: -20,
          filter: "blur(8px)",
          pointerEvents: "none",
          visibility: "hidden",
        });
        gsap.set(compact, {
          opacity: 0,
          x: -20,
          yPercent: -50,
          scale: 0.95,
          pointerEvents: "none",
          visibility: "hidden",
        });
        setMenuOpen(false);
        return;
      }

      if (nextMode === "full") {
        hideCompact(0.25);
        showFull();
        return;
      }

      if (nextMode === "compact") {
        hideFull(0.25);
        showCompact();
      }
    };

    const syncMode = () => {
      const next = resolveNavMode(heroReadyRef.current, heroProgressRef.current);
      applyMode(next);
      setScrolled(window.scrollY > 24);

      const services = document.getElementById("services");
      const contact = document.getElementById("contact");
      const y = window.scrollY + window.innerHeight * 0.28;

      if (contact && y >= contact.offsetTop) setActive("booking");
      else if (services && y >= services.offsetTop) setActive("services");
      else setActive("home");
    };

    const onProgress = (event) => {
      const progress = event.detail?.progress ?? 0;
      heroProgressRef.current = progress;
      if (progress < 0.95) {
        heroReadyRef.current = false;
      }
      syncMode();
    };

    const onComplete = () => {
      heroReadyRef.current = true;
      heroProgressRef.current = 1;
      syncMode();
    };

    const onReset = () => {
      heroReadyRef.current = false;
      heroProgressRef.current = 0;
      syncMode();
    };

    // Initial: always hidden (black intro).
    if (document.body.dataset.heroIntro === "done") {
      heroReadyRef.current = true;
      heroProgressRef.current = 1;
    } else {
      heroReadyRef.current = false;
      heroProgressRef.current = 0;
    }
    syncMode();

    window.addEventListener("hero:intro-progress", onProgress);
    window.addEventListener("hero:intro-complete", onComplete);
    window.addEventListener("hero:intro-reset", onReset);
    window.addEventListener("scroll", syncMode, { passive: true });
    window.addEventListener("resize", syncMode);

    return () => {
      window.removeEventListener("hero:intro-progress", onProgress);
      window.removeEventListener("hero:intro-complete", onComplete);
      window.removeEventListener("hero:intro-reset", onReset);
      window.removeEventListener("scroll", syncMode);
      window.removeEventListener("resize", syncMode);
      fullTween.current?.kill();
      compactTween.current?.kill();
      menuTween.current?.kill();
    };
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    menuTween.current?.kill();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (compactMenuOpen) {
      gsap.set(menu, { display: "flex" });
      menuTween.current = gsap.fromTo(
        menu,
        { opacity: 0, x: -10, scale: 0.96 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: reducedMotion ? 0 : 0.3,
          ease: "power3.out",
        }
      );
    } else {
      menuTween.current = gsap.to(menu, {
        opacity: 0,
        x: -10,
        scale: 0.96,
        duration: reducedMotion ? 0 : 0.2,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(menu, { display: "none" });
        },
      });
    }
  }, [compactMenuOpen]);

  useEffect(() => {
    if (!menuOpen && !compactMenuOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCompactMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, compactMenuOpen]);

  const handleNav = (event, link) => {
    event.preventDefault();

    if (link.booking) {
      openBooking();
      setActive("booking");
      setMenuOpen(false);
      setCompactMenuOpen(false);
      return;
    }

    if (link.href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActive("home");
    } else {
      const target = document.querySelector(link.href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      setActive(link.id);
    }

    setMenuOpen(false);
    setCompactMenuOpen(false);
  };

  const fullActive = mode === "full";
  const compactActive = mode === "compact";

  return (
    <>
      <div
        ref={fullRef}
        className={`${styles.shell} ${fullActive ? styles.shellActive : ""}`}
        aria-hidden={!fullActive}
      >
        <nav
          className={`${styles.bar} ${scrolled ? styles.barScrolled : ""}`}
          aria-label="Primary"
        >
          <a
            href="#"
            className={styles.logo}
            tabIndex={fullActive ? 0 : -1}
            onClick={(event) => handleNav(event, LINKS[0])}
          >
            Makeup By Hiraa
          </a>

          <div className={styles.desktopNav}>
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                tabIndex={fullActive ? 0 : -1}
                className={[
                  styles.link,
                  link.booking ? styles.booking : "",
                  active === link.id ? styles.linkActive : "",
                  link.booking && active === link.id ? styles.bookingActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(event) => handleNav(event, link)}
              >
                <span>{link.label}</span>
                {link.booking ? <BookingArrow /> : null}
              </a>
            ))}
          </div>

          <button
            type="button"
            className={`${styles.menuBtn} ${menuOpen ? styles.menuOpen : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            tabIndex={fullActive ? 0 : -1}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.menuIcon}>
              <span />
              <span />
              <span />
            </span>
          </button>

          <div
            className={`${styles.mobilePanel} ${
              menuOpen ? styles.mobilePanelOpen : ""
            }`}
          >
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                tabIndex={fullActive && menuOpen ? 0 : -1}
                className={[
                  styles.mobileLink,
                  link.booking ? styles.mobileBooking : "",
                  active === link.id ? styles.mobileLinkActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(event) => handleNav(event, link)}
              >
                <span>{link.label}</span>
                {link.booking ? <BookingArrow /> : null}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div
        ref={compactRef}
        className={`${styles.compact} ${
          compactActive ? styles.compactActive : ""
        }`}
        aria-hidden={!compactActive}
      >
        <div className={styles.compactBar}>
          <span className={styles.compactMark} aria-hidden="true">
            H
          </span>

          <button
            type="button"
            className={`${styles.compactPlus} ${
              compactMenuOpen ? styles.compactPlusOpen : ""
            }`}
            aria-label={compactMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={compactMenuOpen}
            tabIndex={compactActive ? 0 : -1}
            onClick={() => setCompactMenuOpen((open) => !open)}
          >
            <span className={styles.plusIcon} aria-hidden="true" />
          </button>

          <div ref={menuRef} className={styles.compactMenu}>
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                tabIndex={compactActive && compactMenuOpen ? 0 : -1}
                className={[
                  styles.compactLink,
                  link.booking ? styles.compactBooking : "",
                  active === link.id ? styles.compactLinkActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={(event) => handleNav(event, link)}
              >
                <span>{link.label}</span>
                {link.booking ? <BookingArrow /> : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
