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

export default function Navbar() {
  const { openBooking } = useBookingModal();
  const shellRef = useRef(null);
  const revealTween = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.set(shell, {
      opacity: 0,
      y: -24,
      filter: "blur(8px)",
      pointerEvents: "none",
    });

    const reveal = () => {
      setRevealed(true);
      revealTween.current?.kill();

      if (reducedMotion) {
        gsap.set(shell, {
          opacity: 1,
          y: 0,
          filter: "none",
          pointerEvents: "auto",
        });
        return;
      }

      revealTween.current = gsap.to(shell, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        pointerEvents: "auto",
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const hide = () => {
      setRevealed(false);
      setMenuOpen(false);
      revealTween.current?.kill();

      revealTween.current = gsap.to(shell, {
        opacity: 0,
        y: -24,
        filter: reducedMotion ? "none" : "blur(8px)",
        pointerEvents: "none",
        duration: reducedMotion ? 0 : 0.35,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    };

    window.addEventListener("hero:intro-complete", reveal);
    window.addEventListener("hero:intro-reset", hide);

    return () => {
      window.removeEventListener("hero:intro-complete", reveal);
      window.removeEventListener("hero:intro-reset", hide);
      revealTween.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!revealed) {
      setScrolled(false);
      return;
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      const services = document.getElementById("services");
      const contact = document.getElementById("contact");
      const y = window.scrollY + window.innerHeight * 0.28;

      if (contact && y >= contact.offsetTop) {
        setActive("booking");
      } else if (services && y >= services.offsetTop) {
        setActive("services");
      } else {
        setActive("home");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealed]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleNav = (event, link) => {
    event.preventDefault();

    if (link.booking) {
      openBooking();
      setActive("booking");
      setMenuOpen(false);
      return;
    }

    if (link.href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActive("home");
    } else {
      const target = document.querySelector(link.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setActive(link.id);
    }
    setMenuOpen(false);
  };

  return (
    <div
      ref={shellRef}
      className={`${styles.shell} ${revealed ? styles.shellRevealed : ""}`}
      aria-hidden={!revealed}
    >
      <nav
        className={`${styles.bar} ${scrolled ? styles.barScrolled : ""}`}
        aria-label="Primary"
      >
        <a
          href="#"
          className={styles.logo}
          tabIndex={revealed ? 0 : -1}
          onClick={(event) => handleNav(event, LINKS[0])}
        >
          Makeup By Hiraa
        </a>

        <div className={styles.desktopNav}>
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              tabIndex={revealed ? 0 : -1}
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
          tabIndex={revealed ? 0 : -1}
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
              tabIndex={revealed && menuOpen ? 0 : -1}
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
  );
}
