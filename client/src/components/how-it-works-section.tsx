import { Upload, Brain, Zap, Download, ArrowRight, Clock, Target, Check } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    id: 1,
    icon: Upload,
    title: "Pega tu URL de Video",
    description: "Simplemente copia y pega la URL de cualquier video de TikTok, Instagram o YouTube",
    time: "5 segundos",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100"
  },
  {
    id: 2,
    icon: Brain,
    title: "IA Analiza el Contenido",
    description: "Nuestra IA avanzada analiza el video, identifica patrones virales y extrae insights clave",
    time: "15 segundos",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
    iconBg: "bg-violet-100"
  },
  {
    id: 3,
    icon: Zap,
    title: "Genera Script Personalizado",
    description: "Crea un script optimizado usando neuro-marketing y frameworks probados para tu audiencia",
    time: "10 segundos",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100"
  },
  {
    id: 4,
    icon: Download,
    title: "Descarga y Usa",
    description: "Obtén tu script listo para usar, optimizado para la plataforma que elijas",
    time: "Instantáneo",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    iconBg: "bg-orange-100"
  }
];

const features = [
  "Análisis de sentimientos y emociones",
  "Identificación de hooks virales",
  "Optimización para cada plataforma",
  "Framework AIDA + Neuro-marketing",
  "Análisis de competencia",
  "Predicción de viralidad",
  "Múltiples versiones del script",
  "Exportación en diferentes formatos"
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cómo Funciona KimScript
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En solo 30 segundos, transforma cualquier video en un script viral optimizado para tu audiencia
          </p>
        </div>

        {/* Steps */}
        <div className="relative mb-16">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 via-green-200 to-orange-200 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setActiveStep(step.id)}
                onClick={() => setActiveStep(step.id)}
              >
                {/* Step Card */}
                <div className={`${step.bgColor} rounded-2xl p-6 text-center transform transition-all duration-300 ${
                  activeStep === step.id ? 'scale-105 shadow-xl' : 'hover:scale-105 hover:shadow-lg'
                }`}>
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${step.iconBg} flex items-center justify-center`}>
                    <step.icon className={`h-8 w-8 text-gray-700`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                  
                  {/* Time */}
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{step.time}</span>
                  </div>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Tecnología Avanzada Incluida
            </h3>
            <p className="text-lg text-gray-600">
              Nuestra IA utiliza las últimas técnicas de neuro-marketing y análisis de contenido
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
