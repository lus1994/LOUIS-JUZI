
export enum ClothingCategory {
  TOP = 'Top',
  BOTTOM = 'Bottom',
  DRESS = 'Dress',
  OUTERWEAR = 'Outerwear',
  SHOES = 'Shoes',
  ACCESSORY = 'Accessory',
  UNKNOWN = 'Unknown'
}

export const CategoryLabels: Record<ClothingCategory, string> = {
  [ClothingCategory.TOP]: '上装',
  [ClothingCategory.BOTTOM]: '下装',
  [ClothingCategory.DRESS]: '连身裙',
  [ClothingCategory.OUTERWEAR]: '外套',
  [ClothingCategory.SHOES]: '鞋履',
  [ClothingCategory.ACCESSORY]: '配饰',
  [ClothingCategory.UNKNOWN]: '其他'
};

export enum Season {
  SUMMER = 'Summer',
  WINTER = 'Winter',
  SPRING_AUTUMN = 'Spring/Autumn',
  ALL_YEAR = 'All Year'
}

export const SeasonLabels: Record<Season, string> = {
  [Season.SUMMER]: '夏季',
  [Season.WINTER]: '冬季',
  [Season.SPRING_AUTUMN]: '春秋',
  [Season.ALL_YEAR]: '四季'
};

export interface ClothingItem {
  id: string;
  imageUrl: string; // Base64 or URL
  category: ClothingCategory;
  color: string;
  season: Season;
  brand?: string;
  purchaseDate?: string;
  price?: number;
  wearCount: number;
  lastWorn?: string;
  wearLog?: string[]; // Array of ISO date strings (YYYY-MM-DD)
}

export interface OutfitSuggestion {
  outfitName: string;
  itemIds: string[];
  reasoning: string;
}

// --- NEW TYPES FOR PERFECT APP ---

export type Mood = 'Happy' | 'Confident' | 'Relaxed' | 'Tired' | 'Excited';

export const MoodColors: Record<Mood, string> = {
  'Happy': '#FFD166',      // Yellow
  'Confident': '#E5989B',  // Rose
  'Relaxed': '#AAB3AB',    // Sage
  'Tired': '#8C8C8C',      // Grey
  'Excited': '#EF476F'     // Pink
};

export interface DiaryEntry {
  date: string; // YYYY-MM-DD
  mood?: Mood;
  note?: string;
  photoUrl?: string; // Life moment photo
}

export interface Outfit {
  id: string;
  name: string;
  itemIds: string[];
  createdAt: string;
  type: 'AI' | 'Manual';
}

export type ViewState = 'wardrobe' | 'add-item' | 'stylist' | 'stats' | 'diary';
