import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Car, Tv, Calendar, Briefcase, Music } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

const categories = [
  {
    id: 'immobilier',
    name: 'Immobilier',
    icon: Home,
    description: 'Maisons, appartements, bureaux',
    count: '1,250+ annonces',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'vehicules',
    name: 'Véhicules',
    icon: Car,
    description: 'Voitures, motos, utilitaires',
    count: '850+ annonces',
    color: 'bg-green-50 text-green-600'
  },
  {
    id: 'electromenager',
    name: 'Électroménager',
    icon: Tv,
    description: 'Appareils et équipements',
    count: '620+ annonces',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'evenementiel',
    name: 'Événementiel',
    icon: Calendar,
    description: 'Matériel pour vos événements',
    count: '340+ annonces',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'professionnel',
    name: 'Professionnel',
    icon: Briefcase,
    description: 'Équipements professionnels',
    count: '280+ annonces',
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'loisirs',
    name: 'Loisirs',
    icon: Music,
    description: 'Sport, musique, divertissement',
    count: '195+ annonces',
    color: 'bg-pink-50 text-pink-600'
  }
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explorez nos catégories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trouvez exactement ce que vous cherchez dans nos différentes catégories de location
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={`/annonces?category=${category.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-lg ${category.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">{category.count}</p>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};