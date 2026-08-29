import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UltraSimpleCTA() {
  const { t } = useLanguage();

  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  return (
    <div className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          {t.readyToCreate}
        </h2>
        
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="bg-white text-purple-600 hover:bg-gray-100 text-lg font-semibold px-8 py-4 h-auto"
        >
          {t.startNow}
        </Button>
        
        <p className="text-purple-100 mt-4 text-sm">
          {t.noRegistration}
        </p>
      </div>
    </div>
  );
}
