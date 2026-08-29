import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, AlertCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PlatformSuggestions() {
  const { t } = useLanguage();

  const platformStatus = [
    {
      platform: "YouTube",
      status: "optimal",
      icon: Check,
      description: "Videos públicos funcionan perfectamente",
      tips: ["Videos públicos", "Shorts de YouTube", "Videos sin restricciones de edad"],
      examples: ["https://youtube.com/watch?v=...", "https://youtu.be/..."]
    },
    {
      platform: "TikTok",
      status: "good",
      icon: Check,
      description: "Videos públicos generalmente funcionan",
      tips: ["Videos públicos", "Sin restricciones de edad", "Cuentas públicas"],
      examples: ["https://tiktok.com/@usuario/video/..."]
    },
    {
      platform: "Instagram",
      status: "limited",
      icon: AlertCircle,
      description: "Acceso limitado por políticas de privacidad",
      tips: ["Solo algunos videos públicos", "Mejor usar YouTube o TikTok"],
      examples: ["Recomendamos usar otras plataformas"]
    }
  ];

  return (
    <div className="space-y-4">
      <Alert className="border-orange-200 bg-orange-50 text-orange-800">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription>
          <strong>Recomendación:</strong> Para mejores resultados, usa videos públicos de YouTube o TikTok. 
          Instagram requiere autenticación por políticas de privacidad.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        {platformStatus.map((platform) => (
          <Card key={platform.platform} className="relative">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <platform.icon 
                  className={`h-5 w-5 ${
                    platform.status === 'optimal' ? 'text-green-500' :
                    platform.status === 'good' ? 'text-blue-500' :
                    'text-orange-500'
                  }`} 
                />
                <h3 className="font-semibold">{platform.platform}</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {platform.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">
                  Consejos:
                </h4>
                <ul className="text-xs space-y-1">
                  {platform.tips.map((tip, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-current rounded-full" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 pt-3 border-t">
                <h4 className="text-xs font-medium text-muted-foreground uppercase mb-1">
                  Formato URL:
                </h4>
                {platform.examples.map((example, index) => (
                  <div key={index} className="text-xs font-mono bg-muted p-1 rounded">
                    {example}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
            ✓ Consejos para análisis exitoso:
          </h3>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            <li>• Usa videos con audio claro y sin música de fondo muy alta</li>
            <li>• Los videos en español funcionan mejor para el análisis</li>
            <li>• Videos de 15 segundos a 5 minutos son ideales</li>
            <li>• TikTok público funciona excelente (como se demostró en los logs)</li>
            <li>• YouTube público siempre es confiable</li>
            <li>• Evita Instagram por restricciones de autenticación</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}