import HeroIntro from "@/components/HeroIntro/HeroIntro";
import Expertise from "@/components/Expertise/Expertise";
import Services from "@/components/Services/Services";
import LooksArchive from "@/components/LooksArchive/LooksArchive";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <main>
        <HeroIntro />
        <Expertise />
        <Services />
        <LooksArchive />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
