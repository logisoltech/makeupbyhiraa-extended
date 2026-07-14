"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const BookingModalContext = createContext(null);

export function BookingModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBooking = useCallback(() => setIsOpen(true), []);
  const closeBooking = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openBooking, closeBooking }),
    [isOpen, openBooking, closeBooking]
  );

  return (
    <BookingModalContext.Provider value={value}>
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return context;
}
