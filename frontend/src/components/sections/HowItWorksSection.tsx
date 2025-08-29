import React from 'react';
import { Search, MessageCircle, HandHeart, Shield } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Recherchez',
    description: 'Parcourez nos annonces ou utilisez nos filtres avancés pour trouver exactement ce que vous cherchez',
    step: '01'
  },
  {
    icon: MessageCircle,
    title: 'Contactez',
    description: 'Échangez directement avec les propriétaires via notre messagerie sécurisée',
    step: '02'
  },
  {
    icon: HandHeart,
    title: 'Louez',
    description: 'Finalisez votre location en toute confiance avec nos garanties de sécurité',
    step: '03'
  },
  {
    icon: Shield,
    title: 'Profitez',
    description: 'Bénéficiez de votre location avec le support de notre équipe dédiée',
    step: '04'
  }
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un processus simple et sécurisé en 4 étapes pour vos locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.step} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border-2 border-blue-100">
                    <span className="text-xs font-bold text-blue-600">{step.step}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-xl text-gray-900 mb-3">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full">
                    <div className="h-0.5 bg-gray-300 w-1/2"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};