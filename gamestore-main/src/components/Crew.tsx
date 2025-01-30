import React from 'react';
import { Crown, Gift, Calendar, Star, Shield, Sparkles, ArrowRight } from 'lucide-react';

const Crew = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-[#FAFAFA] z-0" />
        <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full mb-6">
              <Crown className="w-5 h-5" />
              <span className="font-medium">Fortnite Crew</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Únete al <span className="text-primary-600">Crew de Fortnite</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Obtén el Pase de Batalla, skins exclusivas mensuales y 1,000 V-Bucks cada mes
            </p>
          </div>

          {/* Planes de Suscripción */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Plan Mensual",
                  price: "11.99",
                  period: "mes",
                  description: "Perfecto para probar el Crew",
                  features: [
                    "Skin mensual exclusiva",
                    "1,000 V-Bucks mensuales",
                    "Pase de batalla incluido",
                    "Sin compromiso mensual"
                  ],
                  isPopular: false
                },
                {
                  name: "Plan Trimestral",
                  price: "29.99",
                  period: "3 meses",
                  description: "Ahorra un 17% respecto al plan mensual",
                  features: [
                    "3 Skins exclusivas garantizadas",
                    "3,000 V-Bucks en total",
                    "Pase de batalla incluido",
                    "Bonus de 500 V-Bucks"
                  ],
                  isPopular: true
                },
                {
                  name: "Plan Semestral",
                  price: "54.99",
                  period: "6 meses",
                  description: "Ahorra un 23% respecto al plan mensual",
                  features: [
                    "6 Skins exclusivas garantizadas",
                    "6,000 V-Bucks en total",
                    "Pase de batalla incluido",
                    "Bonus de 1,000 V-Bucks"
                  ],
                  isPopular: false
                },
                {
                  name: "Plan Anual",
                  price: "99.99",
                  period: "año",
                  description: "Ahorra un 30% respecto al plan mensual",
                  features: [
                    "12 Skins exclusivas garantizadas",
                    "12,000 V-Bucks en total",
                    "Pase de batalla incluido",
                    "Bonus de 2,000 V-Bucks"
                  ],
                  isPopular: false
                }
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    plan.isPopular ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Más Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-primary-600">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                      plan.isPopular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Seleccionar Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Beneficios del Crew */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Beneficios del Crew</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Gift className="w-8 h-8" />,
              title: "Skin Mensual Exclusiva",
              description: "Recibe cada mes una skin única y exclusiva para miembros del Crew"
            },
            {
              icon: <Calendar className="w-8 h-8" />,
              title: "1,000 V-Bucks Mensuales",
              description: "1,000 V-Bucks se añaden automáticamente a tu cuenta cada mes"
            },
            {
              icon: <Star className="w-8 h-8" />,
              title: "Pase de Batalla",
              description: "Acceso al Pase de Batalla actual y futuros mientras seas miembro"
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: "Beneficios Extras",
              description: "Acceso a contenido exclusivo de Spotify Premium y otros beneficios"
            }
          ].map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Crew; 