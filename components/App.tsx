
import React, { useState, useEffect } from 'react';
import { ViewState, ClothingItem, ClothingCategory, CategoryLabels } from '../types';
import NavBar from './components/NavBar';
import AddItemView from './components/AddItemView';
import StylistView from './components/StylistView';
import ItemCard from './components/ItemCard';
import StatsView from './components/StatsView';
import ItemDetailModal from './components/ItemDetailModal';
import DiaryView from './components/DiaryView';
import { loadItems, saveItems, updateItem } from './services/storageService';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { MOCK_ITEMS } from './services/mockData';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('wardrobe');
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filter, setFilter] = useState<ClothingCategory | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  useEffect(() => {
    let loaded = loadItems();
    // Inject Mock Data if wardrobe is empty for demo purposes
    if (loaded.length === 0) {
      console.log("Empty wardrobe detected. Loading demo data...");
      loaded = MOCK_ITEMS;
      saveItems(loaded);
    }
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

  // --- New function for batch updates (e.g. from StylistView) ---
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

  // Demo: Force Load Mock Data
  const handleLoadDemoData = () => {
    if (window.confirm("确定要清空当前衣橱并加载演示数据吗？这将丢失您手动添加的照片。")) {
      saveItems(MOCK_ITEMS);
      setItems(MOCK_ITEMS);
      alert("演示数据加载完毕！请体验搭配和统计功能。");
    }
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
            <div className="px-6 pt-14 pb-6 sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-sm transition-all shadow-sm md:px-12 md:pt-10">
              <div className="flex justify-between items-end mb-6 max-w-7xl mx-auto w-full">
                <div>
                  <h2 className="text-xs text-[#AAB3AB] font-bold tracking-[0.2em] uppercase mb-1">My Collection</h2>
                  <h1 className="text-4xl text-[#4A4A4A] font-serif">Muse Closet</h1>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleLoadDemoData}
                    className="p-2 bg-white rounded-full text-[#AAB3AB] hover:text-[#D4A373] shadow-sm active:scale-95 transition-all"
                    title="加载演示数据"
                  >
                    <RefreshCcw size={18} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                    <span className="font-serif text-[#D4A373] font-bold">{items.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Filter Tabs - Optimized Horizontal Scroll with CSS Mask */}
              <div className="max-w-7xl mx-auto w-full">
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-6 px-6 mask-image-fade md:mx-0 md:px-0 md:mask-none">
                  <button 
                    onClick={() => setFilter('All')}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm whitespace-nowrap border ${
                      filter === 'All' 
                        ? 'bg-[#4A4A4A] text-[#FDFBF7] border-[#4A4A4A] scale-105' 
                        : 'bg-white text-[#8C8C8C] border-transparent hover:bg-white/80'
                    }`}
                  >
                    All
                  </button>
                  {Object.values(ClothingCategory).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-sm whitespace-nowrap border ${
                        filter === cat 
                          ? 'bg-[#D4A373] text-white border-[#D4A373] scale-105' 
                          : 'bg-white text-[#8C8C8C] border-transparent hover:bg-white/80'
                      }`}
                    >
                      {CategoryLabels[cat]}
                    </button>
                  ))}
                  {/* Spacer to allow scrolling to the very end */}
                  <div className="w-2 flex-shrink-0 md:hidden" />
                </div>
              </div>
            </div>

            {/* Grid - Responsive: 2 cols on mobile, more on tablet/desktop */}
            <div className="flex-1 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                {items.length === 0 ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-[#AAB3AB] space-y-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(212,163,115,0.2)]">
                      <Sparkles size={28} className="text-[#D4A373]" />
                    </div>
                    <div className="text-center">
                      <p className="font-serif text-xl text-[#4A4A4A] mb-2">你的衣橱是空的</p>
                      <p className="text-sm">点击上方刷新按钮加载演示数据</p>
                      <p className="text-sm">或点击下方 + 号添加单品</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20 pt-4">
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
          </div>
        );
    }
  };

  return (
    // Removed max-w-md constraint for responsive design
    <div className="w-full h-screen bg-[#FDFBF7] relative shadow-2xl overflow-hidden flex flex-col">
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
