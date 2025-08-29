import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, MapPin, Calendar, User, Star, MessageSquare, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const AnnonceDetailPage: React.FC = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [comment, setComment] = useState('');

  // Mock data
  const annonce = {
    id: 1,
    title: 'Appartement moderne 3 pièces avec balcon',
    price: '85,000 F/mois',
    location: 'Cotonou, Fidjrossè',
    category: 'Immobilier',
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: `Magnifique appartement de 3 pièces situé dans un quartier résidentiel calme de Fidjrossè. 

L'appartement comprend :
• 2 chambres spacieuses
• 1 salon/salle à manger lumineux  
• 1 cuisine équipée moderne
• 1 salle de bain avec douche
• 1 balcon avec vue dégagée
• Parking sécurisé

Équipements inclus : climatisation, eau chaude, internet WiFi, gardiennage 24h/24.

Idéalement situé près des commerces, écoles et transports en commun.`,
    owner: {
      name: 'Marie Adjovi',
      rating: 4.8,
      reviews: 24,
      joinDate: 'Membre depuis 2022',
      verified: true
    },
    details: {
      surface: '75 m²',
      chambres: '2 chambres',
      salleBain: '1 salle de bain',
      etage: '2ème étage'
    },
    amenities: ['Climatisation', 'WiFi', 'Parking', 'Gardiennage', 'Eau chaude', 'Balcon'],
    rating: 4.8,
    reviews: 12
  };

  const comments = [
    {
      id: 1,
      user: 'Kossi M.',
      rating: 5,
      comment: 'Très bel appartement, propriétaire sympathique et reactive.',
      date: 'Il y a 2 semaines'
    },
    {
      id: 2,
      user: 'Fatou D.',
      rating: 4,
      comment: 'Appartement conforme aux photos, quartier calme et sécurisé.',
      date: 'Il y a 1 mois'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Image Gallery */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2">
              <img
                src={annonce.images[currentImage]}
                alt={annonce.title}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
            <div className="p-4 grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-4">
              {annonce.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Vue ${index + 1}`}
                  className={`w-full h-24 lg:h-32 object-cover rounded cursor-pointer transition-all ${
                    index === currentImage ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2">{annonce.category}</Badge>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {annonce.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {annonce.location}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Surface</p>
                    <p className="font-semibold">{annonce.details.surface}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Chambres</p>
                    <p className="font-semibold">{annonce.details.chambres}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Salle de bain</p>
                    <p className="font-semibold">{annonce.details.salleBain}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Étage</p>
                    <p className="font-semibold">{annonce.details.etage}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Équipements inclus</h3>
                  <div className="flex flex-wrap gap-2">
                    {annonce.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Description</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {annonce.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  Avis ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="font-semibold text-blue-600">{comment.user.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{comment.user}</p>
                            <div className="flex items-center">
                              {[...Array(comment.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                              ))}
                              <span className="text-xs text-gray-500 ml-2">{comment.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Laisser un commentaire</h4>
                  <div className="space-y-4">
                    <Input
                      placeholder="Votre commentaire..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button>Publier</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price and Contact */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {annonce.price}
                  </p>
                  <p className="text-gray-500">Prix de location</p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter le propriétaire
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Propriétaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center">
                      {annonce.owner.name}
                      {annonce.owner.verified && (
                        <Badge variant="success" className="ml-2 text-xs">Vérifié</Badge>
                      )}
                    </p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">
                        {annonce.owner.rating} ({annonce.owner.reviews} avis)
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">{annonce.owner.joinDate}</p>
                
                <Button variant="outline" className="w-full">
                  Voir le profil
                </Button>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Conseils de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="text-xs text-gray-600 space-y-2">
                  <li>• Rencontrez le propriétaire en personne</li>
                  <li>• Vérifiez l'identité avant tout paiement</li>
                  <li>• Visitez le bien avant de signer</li>
                  <li>• Utilisez notre messagerie sécurisée</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};