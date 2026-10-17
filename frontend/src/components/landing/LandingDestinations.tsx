import HomeHeroLandingScrollAnimation from "@/components/ui/home-hero-landing-scroll-animation";
import madridImg from "@/assets/cities/madrid.jpg";
import barcelonaImg from "@/assets/cities/barcelona.jpg";
import valenciaImg from "@/assets/cities/valencia.jpg";
import malagaImg from "@/assets/cities/malaga.jpg";
import sevillaImg from "@/assets/cities/sevilla.jpg";
import { useT } from "@/i18n/LanguageContext";

const images = [
  { src: madridImg, alt: "Madrid" },
  { src: barcelonaImg, alt: "Barcelona" },
  { src: valenciaImg, alt: "Valencia" },
  { src: malagaImg, alt: "Málaga" },
  { src: sevillaImg, alt: "Sevilla" },
];

export const LandingDestinations = () => {
  const t = useT();
  return <HomeHeroLandingScrollAnimation images={images} segments={[...t.landingDestinations.segments]} />;
};
