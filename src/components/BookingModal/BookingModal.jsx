"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useBookingModal } from "./BookingModalContext";
import styles from "./BookingModal.module.css";

const SERVICES = [
  "Bridal Makeup",
  "Hair Styling",
  "Special Occasion",
  "Formal Look",
];

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  service: "",
  eventDate: "",
  message: "",
};

export default function BookingModal() {
  const { isOpen, closeBooking } = useBookingModal();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      setVisible(true);
      setSubmitted(false);
      setForm(INITIAL_FORM);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
  }, [isOpen, mounted]);

  useLayoutEffect(() => {
    if (!visible) return;

    const overlay = overlayRef.current;
    const card = cardRef.current;
    if (!overlay || !card) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    tweenRef.current?.kill();

    if (isOpen) {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(card, { opacity: 0, y: 40, scale: 0.94 });

      tweenRef.current = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(overlay, {
          opacity: 1,
          duration: reducedMotion ? 0 : 0.45,
        })
        .to(
          card,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: reducedMotion ? 0 : 0.45,
          },
          0
        );
      return;
    }

    tweenRef.current = gsap
      .timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          setVisible(false);
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
        },
      })
      .to(overlay, {
        opacity: 0,
        duration: reducedMotion ? 0 : 0.3,
      })
      .to(
        card,
        {
          opacity: 0,
          y: 24,
          scale: 0.96,
          duration: reducedMotion ? 0 : 0.3,
        },
        0
      );

    return () => {
      tweenRef.current?.kill();
    };
  }, [isOpen, visible]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event) => {
      if (event.key === "Escape") closeBooking();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeBooking]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      tweenRef.current?.kill();
    };
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <button
        ref={overlayRef}
        type="button"
        className={styles.overlay}
        aria-label="Close booking form"
        onClick={closeBooking}
      />

      <div ref={cardRef} className={styles.card}>
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          onClick={closeBooking}
        >
          ×
        </button>

        <p className={styles.label}>Book Your Look</p>
        <h2 id="booking-modal-title" className={styles.title}>
          Let’s Create Your Dream Glow
        </h2>
        <p className={styles.copy}>
          Tell us a little about your event and we’ll get back to you with
          availability and details.
        </p>

        {submitted ? (
          <div className={styles.success}>
            <h3 className={styles.successTitle}>Request received</h3>
            <p className={styles.successCopy}>
              Thank you — Hiraa will review your details and get back to you
              shortly.
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Full Name</span>
              <input
                className={styles.input}
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Email Address</span>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@email.com"
                required
                autoComplete="email"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Phone Number</span>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="04xx xxx xxx"
                required
                autoComplete="tel"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Service Type</span>
              <select
                className={styles.select}
                name="service"
                value={form.service}
                onChange={onChange}
                required
              >
                <option value="" disabled>
                  Select a service
                </option>
                {SERVICES.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span className={styles.fieldLabel}>Event Date</span>
              <input
                className={styles.input}
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={onChange}
                required
              />
            </label>

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span className={styles.fieldLabel}>Message / Notes</span>
              <textarea
                className={styles.textarea}
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Share your event details, location, or preferred look..."
                rows={4}
              />
            </label>

            <button type="submit" className={styles.submit}>
              <span>Send Booking Request</span>
              <span className={styles.submitArrow} aria-hidden="true">
                →
              </span>
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
