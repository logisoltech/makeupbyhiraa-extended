"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CTA_WORDS = ["Ready", "For", "Your", "Dream", "Glow?"];

const EXPLORE_LINKS = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const SERVICE_LINKS = [
  { label: "Bridal Makeup", href: "#services" },
  { label: "Hair Styling", href: "#services" },
  { label: "Special Occasion", href: "#services" },
  { label: "Formals", href: "#services" },
];

function ArrowIcon() {
  return (
    <span className={styles.btnArrow} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 8.5V7.2c0-.9.2-1.4 1.5-1.4H17V3h-2.4C11.8 3 10.5 4.6 10.5 7v1.5H8.5V11h2v10h3.5V11h2.4l.5-2.5h-2.9z"
        fill="currentColor"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 8l7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const labelRef = useRef(null);
  const wordRefs = useRef([]);
  const copyRef = useRef(null);
  const ctasRef = useRef(null);
  const panelRef = useRef(null);
  const brandWordRef = useRef(null);
  const legalRef = useRef(null);
  const socialRefs = useRef([]);

  useGSAP(
    () => {
      const footer = footerRef.current;
      const label = labelRef.current;
      const titleWords = wordRefs.current.filter(Boolean);
      const copy = copyRef.current;
      const ctas = ctasRef.current;
      const panel = panelRef.current;
      const brandWord = brandWordRef.current;
      const legal = legalRef.current;
      const socials = socialRefs.current.filter(Boolean);

      if (
        !footer ||
        !label ||
        titleWords.length === 0 ||
        !copy ||
        !ctas ||
        !panel ||
        !brandWord ||
        !legal
      ) {
        return;
      }

      const columns = panel.querySelectorAll(`.${styles.column}`);
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [label, ...titleWords, copy, ctas, panel, ...columns, brandWord, legal, ...socials],
          { opacity: 1, y: 0, scale: 1, filter: "none" }
        );
        return;
      }

      gsap.set(label, { opacity: 0, y: 18, filter: "blur(8px)" });
      gsap.set(titleWords, { opacity: 0, y: 64, filter: "blur(10px)" });
      gsap.set(copy, { opacity: 0, y: 14 });
      gsap.set(ctas, { opacity: 0, y: 14 });
      gsap.set(panel, { opacity: 0, y: 28 });
      gsap.set(columns, { opacity: 0, y: 22 });
      gsap.set(socials, { opacity: 0, y: 12, scale: 0.92 });
      gsap.set(brandWord, { opacity: 0, y: 24, scale: 0.97 });
      gsap.set(legal, { opacity: 0, y: 12 });

      const intro = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: footer,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      intro
        .to(label, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
        })
        .to(
          titleWords,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.07,
          },
          0.08
        )
        .to(
          copy,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0.28
        )
        .to(
          ctas,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0.36
        )
        .to(
          panel,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.42
        )
        .to(
          columns,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.5
        )
        .to(
          socials,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power3.out",
          },
          0.7
        )
        .to(
          brandWord,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          0.72
        )
        .to(
          legal,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0.9
        );
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className={styles.footer} id="contact">
      <div className={styles.inner}>
        <div className={styles.cta}>
          <p ref={labelRef} className={styles.label}>
            Let’s Create Your Look
          </p>
          <h2 className={styles.ctaTitle}>
            {CTA_WORDS.map((word, index) => (
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
          <p ref={copyRef} className={styles.ctaCopy}>
            Book your bridal, formal, or special occasion appointment with Makeup
            By Hiraa in Melbourne.
          </p>
          <div ref={ctasRef} className={styles.ctas}>
            <a href="#contact" className={`${styles.glassBtn} ${styles.primary}`}>
              Book Appointment
              <ArrowIcon />
            </a>
            <a
              href="#portfolio"
              className={`${styles.glassBtn} ${styles.secondary}`}
            >
              View Portfolio
              <ArrowIcon />
            </a>
          </div>
        </div>

        <div ref={panelRef} className={styles.panel}>
          <div className={styles.columns}>
            <div className={styles.column}>
              <p className={styles.brandName}>Makeup By Hiraa</p>
              <p className={styles.brandText}>
                Certified makeup artist and hairstylist creating bridal, formal,
                and special occasion looks across Melbourne.
              </p>
            </div>

            <div className={styles.column}>
              <p className={styles.columnTitle}>Explore</p>
              <ul className={styles.linkList}>
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.column}>
              <p className={styles.columnTitle}>Services</p>
              <ul className={styles.linkList}>
                {SERVICE_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.column}>
              <p className={styles.columnTitle}>Connect</p>
              <ul className={styles.linkList}>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.footerLink}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.footerLink}
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@makeupbyhiraa.com"
                    className={styles.footerLink}
                  >
                    Email
                  </a>
                </li>
                <li>
                  <span className={styles.location}>Melbourne, Australia</span>
                </li>
              </ul>

              <div className={styles.socials}>
                <a
                  ref={(el) => {
                    socialRefs.current[0] = el;
                  }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialBtn}
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  ref={(el) => {
                    socialRefs.current[1] = el;
                  }}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialBtn}
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  ref={(el) => {
                    socialRefs.current[2] = el;
                  }}
                  href="mailto:hello@makeupbyhiraa.com"
                  className={styles.socialBtn}
                  aria-label="Email"
                >
                  <EmailIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p ref={brandWordRef} className={styles.brandWord} aria-hidden="true">
            hiraa.
          </p>
          <div ref={legalRef} className={styles.legal}>
            <p className={styles.copyright}>
              Copyright © 2026 Makeup By Hiraa Australia. All Rights Reserved.
            </p>
            <p className={styles.credit}>
              Built with care by{" "}
              <a
                href="https://www.logisol.tech/"
                target="_blank"
                rel="noreferrer"
                className={styles.creditLink}
              >
                Logisol Technologies
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
