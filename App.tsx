import React, { useState, useEffect } from 'react';
import { ViewState, ClothingItem, ClothingCategory, CategoryLabels } from './types';
import NavBar from './components/NavBar';
import AddItemView from './components/AddItemView';
import StylistView from './components/StylistView';
import ItemCard from './components/ItemCard';
import StatsView from './components/StatsView';
import ItemDetailModal from './components/ItemDetailModal';
import DiaryView from './components/DiaryView';
import { loadItems, saveItems, updateItem } from './services/storageService';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('wardrobe');
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filter, setFilter] = useState<ClothingCategory | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  useEffect(() => {
    const loaded = loadItems();
    setItems(loaded);
  }, []);

  const handleSaveItem = (newItem: ClothingItem) => {
    const updated = [newItem, ...items];
    setItems(updated);
    saveItems(updated);
    setView('wardrobe');
  };

  const handleWearItem = (updatedItem: ClothingItem) => {
    const newItems = updateItem(updatedItem);
    setItems(newItems);
    setSelectedItem(updatedItem); 
    setTimeout(() => setSelectedItem(null), 1000);
  };

  const handleBatchUpdateItems = (itemIds: string[]) => {
    const today = new Date().toISOString();
    const newItems = items.map(item => {
      if (itemIds.includes(item.id)) {
         return {
           ...item,
           wearCount: (item.wearCount || 0) + 1,
           lastWorn: today,
           wearLog: [...(item.wearLog || []), today]
         };
      }
      return item;
    });
    setItems(newItems);
    saveItems(newItems);
  };

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  // Render Logic based on view
  const renderContent = () => {
    switch (view) {
      case 'add-item':
        return <AddItemView onSave={handleSaveItem} onCancel={() => setView('wardrobe')} />;
      case 'stylist':
        return <StylistView items={items} onUpdateItems={handleBatchUpdateItems} />;
      case 'stats':
        return <StatsView items={items} />;
      case 'diary':
        return <DiaryView items={items} />;
      case 'wardrobe':
      default:
        return (
          <div className="min-h-full flex flex-col pb-32">
            {/* Wardrobe Header - Glassmorphic */}
            <div className="px-6 pt-14 pb-6 sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-sm transition-all">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xs text-[#AAB3AB] font-bold tracking-[0.2em] uppercase mb-1">My Collection</h2>
                  <h1 className="text-4xl text-[#4A4A4A] font-serif">Muse Closet</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                  <span className="font-serif text-[#D4A373] font-bold">{items.length}</span>
                </div>
              </div>
              
              {/* Filter Tabs - Soft Pills */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
                <button 
                  onClick={() => setFilter('All')}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm whitespace-nowrap border ${
                    filter === 'All' 
                      ? 'bg-[#4A4A4A] text-[#FDFBF7] border-[#4A4A4A]' 
                      : 'bg-white text-[#8C8C8C] border-transparent hover:bg-white/80'
                  }`}
                >
                  All
                </button>
                {Object.values(ClothingCategory).map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm whitespace-nowrap border ${
                      filter === cat 
                        ? 'bg-[#D4A373] text-white border-[#D4A373]' 
                        : 'bg-white text-[#8C8C8C] border-transparent hover:bg-white/80'
                    }`}
                  >
                    {CategoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid - Masonry-ish feel */}
            <div className="flex-1 px-6">
              {items.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-[#AAB3AB] space-y-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(212,163,115,0.2)]">
                    <Sparkles size={28} className="text-[#D4A373]" />
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-xl text-[#4A4A4A] mb-2">你的衣橱是空的</p>
                    <p className="text-sm">点击下方 + 号，添加第一件灵感单品</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pb-20">
                  {filteredItems.map(item => (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      onClick={() => setSelectedItem(item)} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-[#FDFBF7] relative shadow-2xl overflow-hidden flex flex-col">
      {view !== 'add-item' && (
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
             {renderContent()}
          </div>
      )}
      
      {view === 'add-item' && (
           <div className="absolute inset-0 z-50 bg-[#FDFBF7]">
               {renderContent()}
           </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onWear={handleWearItem}
        />
      )}

      {view !== 'add-item' && <NavBar currentView={view} setView={setView} />}
    </div>
  );
};

export default App;