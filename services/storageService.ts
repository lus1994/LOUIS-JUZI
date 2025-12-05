
import { ClothingItem, DiaryEntry, Outfit } from "../types";

const ITEMS_KEY = 'smart_wardrobe_items';
const DIARY_KEY = 'smart_wardrobe_diary';
const OUTFITS_KEY = 'smart_wardrobe_outfits';

// --- ITEMS ---
export const saveItems = (items: ClothingItem[]): void => {
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save items", e);
  }
};

export const loadItems = (): ClothingItem[] => {
  try {
    const data = localStorage.getItem(ITEMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const updateItem = (updatedItem: ClothingItem): ClothingItem[] => {
  const items = loadItems();
  const index = items.findIndex(i => i.id === updatedItem.id);
  if (index !== -1) {
    items[index] = updatedItem;
    saveItems(items);
  }
  return items;
};

// --- DIARY ---
export const saveDiaryEntry = (entry: DiaryEntry): void => {
  const entries = loadDiaryEntries();
  const index = entries.findIndex(e => e.date === entry.date);
  if (index !== -1) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(DIARY_KEY, JSON.stringify(entries));
};

export const loadDiaryEntries = (): DiaryEntry[] => {
  try {
    const data = localStorage.getItem(DIARY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// --- OUTFITS ---
export const saveOutfit = (outfit: Outfit): Outfit[] => {
  const outfits = loadOutfits();
  const newOutfits = [outfit, ...outfits];
  localStorage.setItem(OUTFITS_KEY, JSON.stringify(newOutfits));
  return newOutfits;
};

export const loadOutfits = (): Outfit[] => {
  try {
    const data = localStorage.getItem(OUTFITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const deleteOutfit = (id: string): Outfit[] => {
    const outfits = loadOutfits().filter(o => o.id !== id);
    localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
    return outfits;
}
