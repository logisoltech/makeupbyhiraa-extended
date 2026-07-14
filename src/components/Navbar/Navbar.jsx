"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useBookingModal } from "@/components/BookingModal/BookingModalContext";
import styles from "./Navbar.module.css";

const LINKS = [
  { id: "home", label: "Home", href: "#" },
  { id: "services", label: "Services", href: "#services" },
  { id: "booking", label: "Booking", href: "#contact", booking: true },
];

export default function Navbar() {
  const { openBooking } = useBookingModal();
  const navRef = useRef(null);
  const tweenRef = useRef(null);
  const visibleRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const nav = navRef.current;
    if (!nav) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const setHidden = () => {
      gsap.set(nav, {
        opacity: 0,
        y: -16,
        filter: "blur(8px)",
        pointerEvents: "none",
        visibility: "hidden",
      });
    };

    const show = () => {
      if (visibleRef.current) return;
      visibleRef.current = true;
      setVisible(true);
      tweenRef.current?.kill();

      gsap.set(nav, { visibility: "visible" });
      tweenRef.current = gsap.to(nav, {
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
      setVisible(false);
      tweenRef.current?.kill();

      // Instant hide during black intro — no flash.
      gsap.set(nav, {
        opacity: 0,
        y: -16,
        filter: "blur(8px)",
        pointerEvents: "none",
        visibility: "hidden",
      });
    };

    const onProgress = (event) => {
      const progress = event.detail?.progress ?? 0;
      if (progress < 0.95) hide();
    };

    setHidden();

    if (document.body.dataset.heroIntro === "done") {
      show();
    }

    const onScroll = () => {
      const services = document.getElementById("services");
      const contact = document.getElementById("contact");
      const y = window.scrollY + window.innerHeight * 0.28;

      if (contact && y >= contact.offsetTop) setActive("booking");
      else if (services && y >= services.offsetTop) setActive("services");
      else setActive("home");
    };

    onScroll();
    window.addEventListener("hero:intro-progress", onProgress);
    window.addEventListener("hero:intro-complete", show);
    window.addEventListener("hero:intro-reset", hide);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("hero:intro-progress", onProgress);
      window.removeEventListener("hero:intro-complete", show);
      window.removeEventListener("hero:intro-reset", hide);
      window.removeEventListener("scroll", onScroll);
      tweenRef.current?.kill();
    };
  }, [mounted]);

  const handleNav = (event, link) => {
    event.preventDefault();

    if (link.booking) {
      openBooking();
      setActive("booking");
      return;
    }

    if (link.href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActive("home");
      return;
    }

    const target = document.querySelector(link.href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
    setActive(link.id);
  };

  if (!mounted) return null;

  return createPortal(
    <nav
      ref={navRef}
      className={styles.nav}
      aria-label="Primary"
      aria-hidden={!visible}
    >
      {LINKS.map((link) => (
        <a
          key={link.id}
          href={link.href}
          tabIndex={visible ? 0 : -1}
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
          {link.booking ? (
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          ) : null}
        </a>
      ))}
    </nav>,
    document.body
  );
}
