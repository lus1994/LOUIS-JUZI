
import { ClothingItem, ClothingCategory, Season } from '../types';

export const MOCK_ITEMS: ClothingItem[] = [
  // --- TOPS ---
  {
    id: 'demo-top-1',
    imageUrl: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.TOP,
    color: '白色',
    season: Season.SUMMER,
    brand: 'COS',
    wearCount: 42,
    purchaseDate: '2023-05-10',
    price: 350,
    lastWorn: '2023-10-25'
  },
  {
    id: 'demo-top-2',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.TOP,
    color: '条纹',
    season: Season.SPRING_AUTUMN,
    brand: 'Toteme',
    wearCount: 15,
    purchaseDate: '2023-09-01',
    price: 2800,
    lastWorn: '2023-10-20'
  },
  {
    id: 'demo-top-3',
    imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.TOP,
    color: '燕麦色',
    season: Season.WINTER,
    brand: 'Massimo Dutti',
    wearCount: 8,
    purchaseDate: '2023-01-15',
    price: 890,
    lastWorn: '2023-03-10'
  },
  {
    id: 'demo-top-4',
    imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.TOP,
    color: '黑色',
    season: Season.ALL_YEAR,
    brand: 'Zara',
    wearCount: 3,
    purchaseDate: '2023-08-10',
    price: 199,
    lastWorn: '2023-09-05'
  },

  // --- BOTTOMS ---
  {
    id: 'demo-bottom-1',
    imageUrl: 'https://images.unsplash.com/photo-1584370848010-d7cc637703ef?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.BOTTOM,
    color: '黑色',
    season: Season.ALL_YEAR,
    brand: 'Lululemon',
    wearCount: 65,
    purchaseDate: '2022-11-20',
    price: 850,
    lastWorn: '2023-10-28'
  },
  {
    id: 'demo-bottom-2',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.BOTTOM,
    color: '丹宁蓝',
    season: Season.ALL_YEAR,
    brand: 'Levi\'s',
    wearCount: 33,
    purchaseDate: '2023-02-14',
    price: 799,
    lastWorn: '2023-10-15'
  },
  {
    id: 'demo-bottom-3',
    imageUrl: 'https://images.unsplash.com/photo-1582142325250-fbed93a10522?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.BOTTOM,
    color: '卡其色',
    season: Season.SPRING_AUTUMN,
    brand: 'Uniqlo',
    wearCount: 12,
    purchaseDate: '2023-04-20',
    price: 299,
    lastWorn: '2023-09-30'
  },

  // --- DRESSES ---
  {
    id: 'demo-dress-1',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.DRESS,
    color: '白色',
    season: Season.SUMMER,
    brand: 'Reformation',
    wearCount: 5,
    purchaseDate: '2023-06-01',
    price: 1800,
    lastWorn: '2023-08-20'
  },
  {
    id: 'demo-dress-2',
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.DRESS,
    color: '黑色',
    season: Season.ALL_YEAR,
    brand: 'Self-Portrait',
    wearCount: 0, // 浪费单品演示
    purchaseDate: '2023-09-10',
    price: 3500,
    lastWorn: undefined
  },

  // --- OUTERWEAR ---
  {
    id: 'demo-outer-1',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.OUTERWEAR,
    color: '卡其色',
    season: Season.SPRING_AUTUMN,
    brand: 'Burberry',
    wearCount: 45,
    purchaseDate: '2021-10-01',
    price: 12500,
    lastWorn: '2023-03-15'
  },
  {
    id: 'demo-outer-2',
    imageUrl: 'https://images.unsplash.com/photo-1551488852-0801751acbe9?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.OUTERWEAR,
    color: '灰色',
    season: Season.WINTER,
    brand: 'Theory',
    wearCount: 20,
    purchaseDate: '2022-12-10',
    price: 4500,
    lastWorn: '2023-02-10'
  },
  {
    id: 'demo-outer-3',
    imageUrl: 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.OUTERWEAR,
    color: '丹宁蓝',
    season: Season.SPRING_AUTUMN,
    brand: 'Acne Studios',
    wearCount: 18,
    purchaseDate: '2023-03-05',
    price: 3200,
    lastWorn: '2023-10-12'
  },

  // --- SHOES ---
  {
    id: 'demo-shoes-1',
    imageUrl: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.SHOES,
    color: '棕色',
    season: Season.ALL_YEAR,
    brand: 'Dr. Martens',
    wearCount: 55,
    purchaseDate: '2022-09-01',
    price: 1499,
    lastWorn: '2023-10-27'
  },
  {
    id: 'demo-shoes-2',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.SHOES,
    color: '蓝色',
    season: Season.ALL_YEAR,
    brand: 'Manolo Blahnik',
    wearCount: 1,
    purchaseDate: '2023-05-20',
    price: 8500,
    lastWorn: '2023-06-15'
  },
  {
    id: 'demo-shoes-3',
    imageUrl: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.SHOES,
    color: '白色',
    season: Season.ALL_YEAR,
    brand: 'Nike',
    wearCount: 80,
    purchaseDate: '2023-01-01',
    price: 799,
    lastWorn: '2023-10-28'
  },

  // --- ACCESSORIES ---
  {
    id: 'demo-acc-1',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.ACCESSORY,
    color: '棕色',
    season: Season.ALL_YEAR,
    brand: 'Celine',
    wearCount: 90, // 高频使用
    purchaseDate: '2021-05-20',
    price: 18500,
    lastWorn: '2023-10-28'
  },
  {
    id: 'demo-acc-2',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.ACCESSORY,
    color: '灰色',
    season: Season.WINTER,
    brand: 'Acne Studios',
    wearCount: 15,
    purchaseDate: '2022-11-15',
    price: 1500,
    lastWorn: '2023-02-15'
  },
  {
    id: 'demo-acc-3',
    imageUrl: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=800&auto=format&fit=crop',
    category: ClothingCategory.ACCESSORY,
    color: '金色',
    season: Season.ALL_YEAR,
    brand: 'Missoma',
    wearCount: 25,
    purchaseDate: '2023-02-14',
    price: 1200,
    lastWorn: '2023-09-10'
  }
];
