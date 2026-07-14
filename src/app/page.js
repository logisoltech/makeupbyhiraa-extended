import Navbar from "@/components/Navbar/Navbar";
import HeroIntro from "@/components/HeroIntro/HeroIntro";
import Expertise from "@/components/Expertise/Expertise";
import Services from "@/components/Services/Services";
import LooksArchive from "@/components/LooksArchive/LooksArchive";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";
import {
  BookingModalProvider,
} from "@/components/BookingModal/BookingModalContext";
import BookingModal from "@/components/BookingModal/BookingModal";

export default function Home() {
  return (
    <BookingModalProvider>
      <Navbar />
      <main>
        <HeroIntro />
        <Expertise />
        <Services />
        <LooksArchive />
        <Testimonials />
      </main>
      <Footer />
      <BookingModal />
    </BookingModalProvider>
  );
}
