import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'es' ? 'English' : 'Español'}
    </Button>
  );
}