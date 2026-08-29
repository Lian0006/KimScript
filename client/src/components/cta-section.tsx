import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CTASection() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          {t.ctaTitle}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {t.ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 shadow-lg"
            onClick={handleGetStarted}
          >
            {t.getStarted}
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10"
          >
            {t.features}
          </Button>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400" 
          alt="Marketing team collaborating" 
          className="mt-12 rounded-2xl shadow-2xl mx-auto max-w-4xl"
        />
      </div>
    </section>
  );
}
