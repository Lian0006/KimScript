import { TrendingUp, Users, Zap, Star, Target, Clock, Award, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const stats = [
  {
    icon: Zap,
    value: "2,500+",
    label: "Scripts Generados Hoy",
    change: "+12%",
    color: "from-violet-500 to-blue-500",
    bgColor: "bg-violet-50"
  },
  {
    icon: Users,
    value: "15,000+",
    label: "Creadores Activos",
    change: "+8%",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50"
  },
  {
    icon: TrendingUp,
    value: "94%",
    label: "Tasa de Viralidad Promedio",
    change: "+5%",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Calificación de Usuarios",
    change: "+0.2",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50"
  },
  {
    icon: Target,
    value: "87%",
    label: "Precisión de Análisis",
    change: "+3%",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50"
  },
  {
    icon: Clock,
    value: "30s",
    label: "Tiempo Promedio de Generación",
    change: "-5s",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50"
  },
  {
    icon: Award,
    value: "50+",
    label: "Países Alcanzados",
    change: "+3",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50"
  },
  {
    icon: Globe,
    value: "1M+",
    label: "Vistas Generadas",
    change: "+25%",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50"
  }
];

export default function StatsSection() {
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timers = stats.map((_, index) => {
        return setTimeout(() => {
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = 1;
            return newStats;
          });
        }, index * 100);
      });

      return () => timers.forEach(clearTimeout);
    }
  }, [isVisible]);

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Números que Hablan por Sí Solos
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Únete a miles de creadores que ya están generando contenido viral con KimScript
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-6 text-center transform transition-all duration-1000 ${
                animatedStats[index] ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} mb-4`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">
                {stat.label}
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-full text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Zap className="h-5 w-5 mr-2" />
            Únete a la Revolución del Contenido Viral
          </div>
        </div>
      </div>
    </section>
  );
}
