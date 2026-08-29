import { Star, Quote, TrendingUp, Users, Play, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "María González",
    role: "Influencer de Moda",
    platform: "Instagram",
    followers: "250K",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "KimScript cambió completamente mi estrategia de contenido. Mis reels ahora tienen 3x más engagement y he ganado 50K seguidores en 2 meses.",
    results: {
      views: "+300%",
      engagement: "+250%",
      followers: "+50K"
    },
    videoUrl: "#"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    role: "Emprendedor Tech",
    platform: "TikTok",
    followers: "180K",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "La IA de KimScript entiende perfectamente mi audiencia. Mis videos de productos ahora se vuelven virales consistentemente.",
    results: {
      views: "+500%",
      engagement: "+400%",
      sales: "+200%"
    },
    videoUrl: "#"
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Coach de Vida",
    platform: "YouTube",
    followers: "95K",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "Los scripts generados por KimScript son increíbles. Mi canal creció de 20K a 95K suscriptores en solo 6 meses.",
    results: {
      subscribers: "+375%",
      watchTime: "+280%",
      revenue: "+150%"
    },
    videoUrl: "#"
  }
];

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTest = testimonials[currentTestimonial];

  return (
    <section className="py-20 bg-gradient-to-br from-violet-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Casos de Éxito Reales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo nuestros usuarios están transformando su contenido y alcanzando resultados increíbles
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-100 to-blue-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-violet-100 rounded-full translate-y-24 -translate-x-24 opacity-50"></div>

          <div className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Testimonial Content */}
              <div className="space-y-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-violet-600 mb-4" />

                <blockquote className="text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
                  "{currentTest.content}"
                </blockquote>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {currentTest.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{currentTest.name}</div>
                    <div className="text-gray-600">{currentTest.role}</div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{currentTest.platform}</span>
                      <span>•</span>
                      <span>{currentTest.followers} seguidores</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Resultados Alcanzados:</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(currentTest.results).map(([key, value], index) => (
                    <div key={key} className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl p-4 border border-violet-100">
                      <div className="text-2xl font-bold text-violet-600 mb-1">{value}</div>
                      <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <Play className="h-4 w-4" />
                    <span>Ver Video</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Heart className="h-4 w-4" />
                    <span>2.5K me gusta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                index === currentTestimonial ? 'ring-2 ring-violet-500 scale-105' : 'hover:scale-105'
              }`}
              onClick={() => setCurrentTestimonial(index)}
            >
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <blockquote className="text-gray-700 mb-4 line-clamp-3">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{testimonial.followers}</span> seguidores en {testimonial.platform}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-2xl px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-violet-600">4.9/5</div>
              <div className="text-sm text-gray-600">Calificación Promedio</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2,500+</div>
              <div className="text-sm text-gray-600">Reseñas</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
