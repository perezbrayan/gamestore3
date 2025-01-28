import React, { useEffect, useState } from 'react';
import { ChevronRight, Star, TrendingUp, Zap, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDailyShop, FortniteItem } from '../services/fortniteApi';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState<FortniteItem[]>([]);
  const [latestItems, setLatestItems] = useState<FortniteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const shopItems = await getDailyShop();
        const filteredItems = shopItems
          .filter(item => {
            const lowerDisplayType = item.displayType?.toLowerCase() || '';
            const lowerMainId = item.mainId?.toLowerCase() || '';
            const lowerDisplayName = item.displayName?.toLowerCase() || '';
            const lowerDescription = item.displayDescription?.toLowerCase() || '';
            
            const musicKeywords = ['track', 'música', 'music', 'jam', 'beat', 'remix', 'sonido', 'sound'];
            return !musicKeywords.some(keyword => 
              lowerDisplayType.includes(keyword) || 
              lowerMainId.includes(keyword) || 
              lowerDisplayName.includes(keyword) || 
              lowerDescription.includes(keyword)
            );
          })
          .slice(0, 4);
        
        setFeaturedItems(filteredItems);
      } catch (error) {
        console.error('Error fetching Fortnite items:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestItems = async () => {
      try {
        const shopItems = await getDailyShop();
        setLatestItems(shopItems);
      } catch (error) {
        console.error('Error fetching Fortnite items:', error);
      }
    };

    fetchFeaturedItems();
    fetchLatestItems();
  }, []);

  const getBestImage = (item: FortniteItem) => {
    if (item.displayAssets?.[0]?.url) {
      return item.displayAssets[0].url;
    }
    return item.displayAssets?.[0]?.background || '';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Modernizado */}
      <section className="relative h-screen w-full flex items-center overflow-hidden hero-background">
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="w-full max-w-[1440px] mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Tu Destino<br/>
              Gaming<br/>
              <span className="text-primary-400">Definitivo</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
              Explora nuestra colección de juegos, items exclusivos y contenido<br/>
              premium para elevar tu experiencia gaming al siguiente nivel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/fortnite-shop"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                Explorar Tienda
              </Link>
              <button className="px-8 py-4 bg-black/30 hover:bg-black/40 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105">
                Ver Ofertas
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mejorado */}
      <section className="py-12 relative bg-gradient-to-b from-gray-900 via-gray-100 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">¿Por qué elegirnos?</h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">
              Descubre las ventajas que nos hacen únicos en el mundo gaming
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Entrega Instantánea</h3>
              </div>
              <p className="text-sm text-gray-600">
                Recibe tus items y códigos de juego al instante después de tu compra, sin esperas ni complicaciones.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Items Exclusivos</h3>
              </div>
              <p className="text-sm text-gray-600">
                Accede a contenido único y elementos especiales que harán destacar tu experiencia de juego.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Mejores Precios</h3>
              </div>
              <p className="text-sm text-gray-600">
                Garantizamos los mejores precios del mercado con ofertas exclusivas y descuentos especiales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fortnite Items - Renovado */}
      <section className="py-24 relative bg-gradient-to-b from-gray-100 via-[#D9DBDF] to-[#D9DBDF]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Items Destacados de Fortnite</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explora nuestra selección de items más populares y exclusivos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {loading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-2xl mb-4"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                </div>
              ))
            ) : (
              featuredItems.map((item) => (
                <div key={item.mainId} className="group">
                  <div className="relative overflow-hidden rounded-2xl mb-4 bg-gray-50">
                    {getBestImage(item) ? (
                      <img 
                        src={getBestImage(item)}
                        alt={item.displayName}
                        className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gray-100 flex items-center justify-center p-4 text-center">
                        <span className="text-gray-800 font-semibold">{item.displayName}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Link 
                          to="/fortnite-shop" 
                          className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Ver en Tienda
                        </Link>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {item.displayName}
                  </h3>
                  <p className="text-gray-600 mb-2">{item.mainType}</p>
                  <p className="text-primary-600 font-bold text-lg">{item.price.finalPrice} V-Bucks</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Items Section */}
      <section className="py-20 relative bg-gradient-to-b from-[#D9DBDF] via-white to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Últimos Items Agregados</h2>
            <p className="text-gray-600 text-lg">
              Descubre los items más recientes que hemos añadido a nuestra tienda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {latestItems?.slice(0, 4).map((item) => (
              <div
                key={item.mainId}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 p-6">
                  <img
                    src={item.displayAssets[0]?.full_background}
                    alt={item.displayName}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.displayName}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">
                      {item.price.finalPrice} V-Bucks
                    </span>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      item.rarity.id === 'Legendary' ? 'bg-orange-100 text-orange-600' :
                      item.rarity.id === 'Epic' ? 'bg-purple-100 text-purple-600' :
                      item.rarity.id === 'Rare' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {item.rarity.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Renovado */}
      <section className="py-24 relative bg-gradient-to-b from-white via-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6 text-white">
              ¿Listo para mejorar tu experiencia?
            </h2>
            <p className="text-xl mb-12 text-white/90 leading-relaxed">
              Únete a nuestra comunidad y obtén acceso a ofertas exclusivas, eventos especiales y contenido premium.
            </p>
            <Link
              to="/fortnite-shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 rounded-xl font-semibold 
                hover:bg-primary-50 transition-all duration-300 transform hover:scale-105
                shadow-lg hover:shadow-white/25"
            >
              Comenzar Ahora
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default Home;