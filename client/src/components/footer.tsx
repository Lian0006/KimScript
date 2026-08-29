import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          KimScript
        </h3>
        <p className="text-gray-400 mb-6">
          {t.heroDescription}
        </p>
        <div className="flex justify-center gap-6 mb-6">
          <a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Planes</a>
          <a href="/login" className="text-gray-400 hover:text-white transition-colors">{t.login}</a>
        </div>
        <p className="text-gray-500 text-sm">
          &copy; 2024 KimScript. {t.allRightsReserved}.
        </p>
      </div>
    </footer>
  );
}