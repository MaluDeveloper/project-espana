import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Timeline from "@/components/ui/timeline";
import madrid from "@/assets/cities/madrid.jpg";
import {
  heroEyebrowClass,
  heroFontStyle,
  heroHighlightClass,
  heroHighlightStyle,
  heroTitleClass,
} from "./heroTypography";
import { useT } from "@/i18n/LanguageContext";

export const LandingFeatures = () => {
  const t = useT();

  return (
    <Timeline
      id="features"
      items={t.features.steps}
      style={heroFontStyle}
      imageUrl={madrid}
      imageAlt={t.features.imageAlt}
      duration={1.4}
      title={
        <>
          <span className={`${heroEyebrowClass} mb-[1.2vw] block text-[0.7vw] max-[600px]:mb-[3vw] max-[600px]:text-[2.6vw]`}>
            {t.features.eyebrow}
          </span>
          <span className={heroTitleClass}>
            {t.features.titlePart1}
            <br />
            <span className={heroHighlightClass} style={heroHighlightStyle}>
              {t.features.titleHighlight}
            </span>
          </span>
        </>
      }
      aside={t.features.subtitle}
      action={
        <Button asChild size="xl" variant="hero" className="group rounded-full font-normal">
          <Link to="/cadastro">
            {t.inlineCtas.afterFeatures.label}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      }
    />
  );
};
