const API_KEY = 'eafc4329-54aeed01-a90cd52b-f749534c';
const BASE_URL = 'https://fortniteapi.io/v2';

export interface FortnitePrice {
  regularPrice: number;
  finalPrice: number;
  floorPrice: number;
}

export interface FortniteImage {
  icon: string;
  featured: string | null;
  background: string | null;
  full_background: string;
}

export interface FortniteGranted {
  id: string;
  type: {
    id: string;
    name: string;
  };
  name: string;
  description: string;
  image: string;
  video: string | null;
  series: {
    id: string;
    name: string;
    colors: string[];
  } | null;
  rarity: {
    id: string;
    name: string;
  };
}

export interface FortniteItem {
  mainId: string;
  displayName: string;
  displayDescription: string;
  displayType: string;
  mainType: string;
  offerId: string;
  displayAssets: {
    displayAsset: string;
    materialInstance: string;
    url: string;
    flipbook?: string;
    background_texture?: string;
    background?: string;
    full_background: string;
  }[];
  firstReleaseDate: string;
  previousReleaseDate: string;
  giftAllowed: boolean;
  buyAllowed: boolean;
  price: FortnitePrice;
  rarity: {
    id: string;
    name: string;
    color: string;
  };
  series: {
    id: string;
    name: string;
    colors: string[];
  } | null;
  banner: {
    id: string;
    name: string;
    intensity: string;
  } | null;
  granted: FortniteGranted[];
  images: FortniteImage;
  gameplayTags: string[];
  added: string;
  shopHistory: string[];
}

export interface FortniteShopResponse {
  result: boolean;
  fullShop: boolean;
  lastUpdate: {
    date: string;
    uid: string;
  };
  currentRotation: {
    featured: string;
    daily: string;
  };
  shop: FortniteItem[];
}

export const getDailyShop = async (): Promise<FortniteItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/shop?lang=es`, {
      headers: {
        'Authorization': API_KEY
      }
    });
    
    const data: FortniteShopResponse = await response.json();
    return data.shop || [];
  } catch (error) {
    console.error('Error fetching Fortnite shop:', error);
    return [];
  }
}; 