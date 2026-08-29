import Header from "@/components/header";
import ProfessionalHero from "@/components/professional-hero";
import ProfessionalFeatures from "@/components/professional-features";
import PricingSection from "@/components/pricing-section";
import NeuroScienceSection from "@/components/neuro-science-section";
import ProfessionalTestimonials from "@/components/professional-testimonials";
import ProfessionalCTA from "@/components/professional-cta";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <ProfessionalHero />
      <ProfessionalFeatures />
      <PricingSection />
      <NeuroScienceSection />
      <ProfessionalTestimonials />
      <ProfessionalCTA />
      <Footer />
    </div>
  );
}
