import React, { useEffect, useState } from 'react';
import { getDailyShop } from '../services/fortniteApi';
import { ShoppingCart, Star, Info, Loader2, X, Filter } from 'lucide-react';

interface ShopItem {
  mainId: string;
  displayName: string;
  displayDescription: string;
  price: {
    regularPrice: number;
    finalPrice: number;
    floorPrice: number;
  };
  granted: {
    id: string;
    type: {
      id: string;
      name: string;
    };
    name: string;
    description: string;
    rarity: {
      id: string;
      name: string;
    };
    series: {
      id: string;
      name: string;
    } | null;
    images: {
      icon: string;
      featured: string | null;
      background: string;
      full_background: string;
    };
    juno?: {
      icon: string;
    };
    beans?: {
      icon: string;
    };
  }[];
  bundle: {
    name: string;
    info: string;
    image: string;
  } | null;
  displayAssets?: {
    full_background: string;
  }[];
}

const FortniteShop: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeRarityFilters, setActiveRarityFilters] = useState<string[]>([]);

  // Categorías disponibles con iconos SVG
  const categories = [
    { 
      id: 'outfit', 
      name: 'Trajes',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 7.27V4C20.5 3.45 20.05 3 19.5 3H4.5C3.95 3 3.5 3.45 3.5 4V7.27C3.5 8.03 3.82 8.76 4.39 9.27L7.5 12V20C7.5 20.55 7.95 21 8.5 21H15.5C16.05 21 16.5 20.55 16.5 20V12L19.61 9.27C20.18 8.76 20.5 8.03 20.5 7.27Z"/>
        </svg>
      )
    },
    { 
      id: 'backpack', 
      name: 'Mochilas',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V10C22 8.9 21.1 8 20 8ZM20 20H4V10H20V20ZM18 2H6C4.9 2 4 2.9 4 4V6H20V4C20 2.9 19.1 2 18 2Z"/>
        </svg>
      )
    },
    { 
      id: 'pickaxe', 
      name: 'Picos',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.79,10.62L3.5,21.91L2.09,20.5L13.38,9.21L14.79,10.62M19.27,7.73L19.86,7.14L19.07,6.35L19.71,5.71L18.29,4.29L17.65,4.93L16.86,4.14L16.27,4.73C14.53,3.31 12.57,2.17 10.47,1.37L9.64,3.16C11.39,3.85 13.03,4.8 14.5,6C15.7,7.5 16.65,9.14 17.34,10.89L19.13,10.06C18.33,7.96 17.19,6 15.77,4.26L19.27,7.73Z"/>
        </svg>
      )
    },
    { 
      id: 'glider', 
      name: 'Alas Delta',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,4C8,4 4,6 4,9C4,10 4,11 8,11C8,11 8,11 8,11L8,18H10V11C10,11 12,11 12,11C12,11 14,11 14,11V18H16V11C16,11 16,11 16,11C20,11 20,10 20,9C20,6 16,4 12,4Z"/>
        </svg>
      )
    },
    { 
      id: 'wrap', 
      name: 'Envoltorios',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z"/>
        </svg>
      )
    },
    { 
      id: 'bundle', 
      name: 'Paquetes',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z"/>
        </svg>
      )
    },
    { 
      id: 'emote', 
      name: 'Gestos',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z"/>
        </svg>
      )
    }
  ];

  // Lista de rarezas disponibles con sus colores
  const rarities = [
    { id: 'all', name: 'Todos', color: 'gray-700' },
    { id: 'common', name: 'Común', color: 'gray-500' },
    { id: 'uncommon', name: 'Poco común', color: 'green-500' },
    { id: 'rare', name: 'Raro', color: 'blue-500' },
    { id: 'epic', name: 'Épico', color: 'purple-500' },
    { id: 'legendary', name: 'Legendario', color: 'orange-500' },
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getDailyShop();
        // Filtrado más exhaustivo de items musicales
        const filteredItems = data.filter((item: ShopItem) => {
          const nameLower = item.displayName.toLowerCase();
          const descLower = item.displayDescription.toLowerCase();
          const grantedTypes = item.granted.map(g => g.type.name.toLowerCase());
          
          // Lista exhaustiva de términos musicales a filtrar
          const musicTerms = [
            'music', 'música', 'track', 'pista', 
            'remix', 'beat', 'song', 'canción', 
            'lobby', 'audio', 'sound', 'sonido', 
            'tune', 'melodía', 'melody', 'ritmo', 
            'rhythm'
          ];

          // Verificar si algún término musical está presente
          const hasMusicTerm = musicTerms.some(term => 
            nameLower.includes(term) || 
            descLower.includes(term) ||
            grantedTypes.some(type => type.includes(term))
          );

          return !hasMusicTerm;
        });
        
        setItems(filteredItems);
        setFilteredItems(filteredItems);
      } catch (err) {
        setError('Error al cargar la tienda. Por favor, intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Función para manejar los filtros de rareza
  const handleRarityFilter = (rarityId: string) => {
    if (rarityId === 'all') {
      setActiveRarityFilters([]);
      applyAllFilters(activeFilters, []);
      return;
    }

    setActiveRarityFilters(prev => {
      const newFilters = prev.includes(rarityId)
        ? prev.filter(f => f !== rarityId)
        : [...prev, rarityId];
      
      applyAllFilters(activeFilters, newFilters);
      return newFilters;
    });
  };

  // Función para manejar los filtros de categoría
  const handleFilter = (categoryId: string) => {
    setActiveFilters(prev => {
      const newFilters = prev.includes(categoryId)
        ? prev.filter(f => f !== categoryId)
        : [...prev, categoryId];
      
      applyAllFilters(newFilters, activeRarityFilters);
      return newFilters;
    });
  };

  // Función para aplicar todos los filtros
  const applyAllFilters = (categoryFilters: string[], rarityFilters: string[]) => {
    let filtered = items;

    // Aplicar filtros de categoría
    if (categoryFilters.length > 0) {
      filtered = filtered.filter(item => {
        // Para bundles, verificar si el item tiene múltiples granted items
        if (categoryFilters.includes('bundle') && item.granted.length > 1) {
          return true;
        }
        
        // Verificar si alguno de los items granted coincide con las categorías seleccionadas
        return item.granted.some(grantedItem => 
          categoryFilters.includes(grantedItem.type.id.toLowerCase())
        );
      });
    }

    // Aplicar filtros de rareza
    if (rarityFilters.length > 0) {
      filtered = filtered.filter(item =>
        item.granted.some(grantedItem =>
          rarityFilters.includes(grantedItem.rarity.id.toLowerCase())
        )
      );
    }

    setFilteredItems(filtered);
  };

  const getItemImage = (item: ShopItem): string => {
    // Intentar obtener la imagen del display asset
    if (item.displayAssets?.[0]?.full_background) {
      return item.displayAssets[0].full_background;
    }

    // Intentar obtener la imagen del primer item granted
    if (item.granted?.[0]) {
      const grantedItem = item.granted[0];
      
      // Intentar diferentes propiedades de imagen en orden de preferencia
      if (grantedItem.images?.full_background) {
        return grantedItem.images.full_background;
      }
      if (grantedItem.images?.featured) {
        return grantedItem.images.featured;
      }
      if (grantedItem.images?.icon) {
        return grantedItem.images.icon;
      }
      if (grantedItem.juno?.icon) {
        return grantedItem.juno.icon;
      }
      if (grantedItem.beans?.icon) {
        return grantedItem.beans.icon;
      }
    }

    // Si no se encuentra ninguna imagen, usar un placeholder
    return 'https://via.placeholder.com/512x512.png?text=No+Image';
  };

  const getRarityColor = (rarity: string): string => {
    const rarityColors: { [key: string]: string } = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500',
      mythic: 'bg-red-500',
      default: 'bg-gray-500'
    };
    return rarityColors[rarity.toLowerCase()] || rarityColors.default;
  };

  const formatPrice = (price: { regularPrice: number; finalPrice: number }) => {
    if (price.regularPrice === price.finalPrice) {
      return `${price.finalPrice} V-Bucks`;
    }
    return (
      <div className="flex flex-col">
        <span className="text-gray-400 line-through text-sm">{price.regularPrice} V-Bucks</span>
        <span className="text-green-500 font-bold">{price.finalPrice} V-Bucks</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-600">Cargando tienda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Tienda Diaria de Fortnite</h1>
          <p className="text-lg text-gray-600">
            Explora los items más recientes de la tienda de Fortnite. Actualizada diariamente con<br/>
            los mejores cosméticos y paquetes.
          </p>
        </div>

        {/* Filtros de Rareza */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:w-64">
            {/* Filtros de Rareza */}
            <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-gray-800">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filtrar por Rareza</span>
              </div>
              <div className="flex flex-col gap-2">
                {rarities.map((rarity) => (
                  <button
                    key={rarity.id}
                    onClick={() => handleRarityFilter(rarity.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                      rarity.id === 'all'
                        ? activeRarityFilters.length === 0
                          ? 'bg-gray-100 text-gray-900'
                          : 'hover:bg-gray-50 text-gray-700'
                        : activeRarityFilters.includes(rarity.id)
                        ? `bg-${rarity.color}/10 text-${rarity.color}`
                        : `hover:bg-${rarity.color}/5 text-gray-700`
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        rarity.id === 'all'
                          ? 'bg-gray-700'
                          : `bg-${rarity.color}`
                      }`}
                    />
                    {rarity.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorías */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <Filter className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
              </div>
              
              <div className="flex flex-col gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleFilter(category.id)}
                    className={`
                      group flex items-center gap-3 p-3 rounded-lg
                      transition-all duration-200
                      ${activeFilters.includes(category.id)
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${activeFilters.includes(category.id)
                        ? 'bg-white/10'
                        : 'bg-white shadow-sm group-hover:shadow-md'
                      }
                    `}>
                      {category.icon(activeFilters.includes(category.id))}
                    </div>
                    <span className="font-medium">{category.name}</span>
                    {activeFilters.includes(category.id) && (
                      <span className="ml-auto text-sm bg-white/20 px-2 py-0.5 rounded-full">
                        {filteredItems.filter(item => 
                          category.id === 'bundle' 
                            ? item.granted.length > 1
                            : item.granted.some(g => g.type.id.toLowerCase() === category.id)
                        ).length}
                      </span>
                    )}
                  </button>
                ))}

                {activeFilters.length > 0 && (
                  <button
                    onClick={() => {
                      setActiveFilters([]);
                      setFilteredItems(items);
                    }}
                    className="mt-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 justify-center border border-red-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Limpiar filtros</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <main className="flex-1">
            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                  key={`${item.mainId}-${index}`}
                  className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
                >
                  {/* Item Image */}
                  <div className="relative aspect-square">
                    <img
                      src={getItemImage(item)}
                      alt={item.displayName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/512x512.png?text=Error+Loading+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Item Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {item.displayName}
                      </h3>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white ${getRarityColor(item.granted[0].rarity.name)}`}>
                        <Star className="w-4 h-4" />
                        {item.granted[0].rarity.name}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.displayDescription}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(item.price)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                          title="Ver detalles"
                        >
                          <Info className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
                          title="Añadir al carrito"
                        >
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No se encontraron items para los filtros seleccionados.
                </p>
              </div>
            )}
          </main>
        </div>

        {/* Modal de Detalles */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={getItemImage(selectedItem)}
                  alt={selectedItem.displayName}
                  className="w-full aspect-video object-cover rounded-t-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/512x512.png?text=Error+Loading+Image';
                  }}
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedItem.displayName}
                  </h2>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium text-white ${getRarityColor(selectedItem.granted[0].rarity.name)}`}>
                    {selectedItem.granted[0].rarity.name}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">
                  {selectedItem.displayDescription}
                </p>

                {selectedItem.bundle && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Contenido del Paquete
                    </h3>
                    <p className="text-gray-600">
                      {selectedItem.bundle.info}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(selectedItem.price)}
                  </span>
                  <button
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FortniteShop;