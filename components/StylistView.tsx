
import React, { useState, useEffect } from 'react';
import { generateOutfitSuggestions } from '../services/geminiService';
import { ClothingItem, OutfitSuggestion, Outfit, ClothingCategory } from '../types';
import { Sparkles, CloudSun, Briefcase, Coffee, CalendarHeart, Loader2, Layers, Plus, Save, Trash2, Check } from 'lucide-react';
import ItemCard from './ItemCard';
import { saveOutfit, loadOutfits, deleteOutfit } from '../services/storageService';

interface StylistViewProps {
  items: ClothingItem[];
  onUpdateItems: (itemIds: string[]) => void;
}

const StylistView: React.FC<StylistViewProps> = ({ items, onUpdateItems }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'studio'>('ai');
  
  // AI State
  const [occasion, setOccasion] = useState('日常出街');
  const [weather, setWeather] = useState('晴朗, 25°C');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);

  // Studio State
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>([]);
  const [studioSelection, setStudioSelection] = useState<{
    [key in 'top' | 'bottom' | 'shoes' | 'acc']?: ClothingItem
  }>({});
  const [isSelectingFor, setIsSelectingFor] = useState<'top' | 'bottom' | 'shoes' | 'acc' | null>(null);
  const [wornOutfitId, setWornOutfitId] = useState<string | null>(null);

  useEffect(() => {
    setSavedOutfits(loadOutfits());
  }, []);

  const handleGenerate = async () => {
    if (items.length < 2) {
      alert("请先添加更多衣物到衣橱！");
      return;
    }
    setIsGenerating(true);
    setSuggestions([]);
    try {
      const results = await generateOutfitSuggestions(items, occasion, weather);
      setSuggestions(results);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveStudioOutfit = () => {
    const itemIds = Object.values(studioSelection)
      .filter((i): i is ClothingItem => !!i)
      .map(i => i.id);
      
    if (itemIds.length < 2) return;

    const newOutfit: Outfit = {
      id: Date.now().toString(),
      name: `我的拼搭 ${new Date().toLocaleDateString()}`,
      itemIds,
      createdAt: new Date().toISOString(),
      type: 'Manual'
    };
    
    const updated = saveOutfit(newOutfit);
    setSavedOutfits(updated);
    setStudioSelection({});
    alert("搭配已保存到灵感库！");
  };

  const handleDeleteOutfit = (id: string) => {
      const updated = deleteOutfit(id);
      setSavedOutfits(updated);
  }

  const handleWearOutfit = (outfitId: string, itemIds: string[]) => {
      onUpdateItems(itemIds);
      setWornOutfitId(outfitId);
      setTimeout(() => setWornOutfitId(null), 2000);
  };

  const presetOccasions = [
    { label: '通勤', icon: <Briefcase size={16} />, text: '办公室职场穿搭' },
    { label: '约会', icon: <CalendarHeart size={16} />, text: '浪漫晚餐约会' },
    { label: '休闲', icon: <Coffee size={16} />, text: '周末朋友聚会' },
  ];

  const getItemsForCategory = (slot: string) => {
    switch(slot) {
      case 'top': return items.filter(i => i.category === ClothingCategory.TOP || i.category === ClothingCategory.OUTERWEAR || i.category === ClothingCategory.DRESS);
      case 'bottom': return items.filter(i => i.category === ClothingCategory.BOTTOM);
      case 'shoes': return items.filter(i => i.category === ClothingCategory.SHOES);
      case 'acc': return items.filter(i => i.category === ClothingCategory.ACCESSORY);
      default: return items;
    }
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-32 pt-14 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xs text-[#AAB3AB] font-bold tracking-[0.2em] uppercase mb-1">Styling Studio</h2>
            <h1 className="font-serif text-3xl text-[#4A4A4A] flex items-center gap-3">
              灵感工作室
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white rounded-xl shadow-sm mb-8 border border-gray-100 max-w-md">
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'ai' ? 'bg-[#4A4A4A] text-white shadow-md' : 'text-[#8C8C8C] hover:bg-gray-50'}`}
          >
            AI 搭配师
          </button>
          <button 
            onClick={() => setActiveTab('studio')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'studio' ? 'bg-[#D4A373] text-white shadow-md' : 'text-[#8C8C8C] hover:bg-gray-50'}`}
          >
            My Studio
          </button>
        </div>

        {activeTab === 'ai' ? (
          // AI VIEW
          <div className="md:grid md:grid-cols-3 md:gap-8">
            <div className="bg-white p-6 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6 mb-8 md:mb-0 border border-white h-fit">
              <div>
                <label className="block text-xs font-bold text-[#AAB3AB] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CloudSun size={14} /> 天气
                </label>
                <input
                  type="text"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full p-4 bg-[#FDFBF7] border-none rounded-xl text-sm text-[#4A4A4A] focus:ring-1 focus:ring-[#D4A373] placeholder-[#AAB3AB]"
                  placeholder="例如：下雨, 15°C"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#AAB3AB] uppercase tracking-wider mb-3">场景</label>
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                  {presetOccasions.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => setOccasion(preset.text)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                        occasion === preset.text 
                          ? 'bg-[#4A4A4A] text-white border-[#4A4A4A] shadow-md' 
                          : 'bg-[#FDFBF7] text-[#8C8C8C] border-transparent hover:bg-[#F2EFE9]'
                      }`}
                    >
                      {preset.icon}
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full p-4 bg-[#FDFBF7] border-none rounded-xl text-sm text-[#4A4A4A] focus:ring-1 focus:ring-[#D4A373]"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-[#D4A373] text-white rounded-xl font-bold tracking-wide shadow-[0_10px_20px_rgba(212,163,115,0.3)] hover:bg-[#C59265] disabled:bg-[#E5D5C5] disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {isGenerating ? 'Designing...' : '生成搭配方案'}
              </button>
            </div>

            <div className="space-y-8 md:col-span-2 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-white rounded-[32px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] h-fit">
                  <div className="mb-5 border-b border-[#FDFBF7] pb-4">
                    <h3 className="font-serif font-bold text-xl text-[#4A4A4A]">{suggestion.outfitName}</h3>
                    <p className="text-[#8C8C8C] text-sm leading-relaxed mt-2">{suggestion.reasoning}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {suggestion.itemIds.map(id => {
                      const item = items.find(i => i.id === id);
                      if (!item) return null;
                      return <ItemCard key={id} item={item} />;
                    })}
                  </div>
                  {/* AI Suggestion Wear Button */}
                  <button
                      onClick={() => handleWearOutfit(`ai-${idx}`, suggestion.itemIds)}
                      className={`w-full mt-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                          wornOutfitId === `ai-${idx}` 
                          ? 'bg-[#AAB3AB] text-white scale-95 shadow-inner' 
                          : 'bg-[#FDFBF7] text-[#D4A373] hover:bg-[#F2EFE9] hover:shadow-sm'
                      }`}
                  >
                      {wornOutfitId === `ai-${idx}` ? <Check size={16} className="animate-bounce"/> : <Plus size={16}/>}
                      {wornOutfitId === `ai-${idx}` ? '已记录穿着 & 频率+1' : '采纳此搭配'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // STUDIO VIEW
          <div className="animate-fade-in md:flex md:gap-8 md:items-start">
            {/* Canvas */}
            <div className="md:w-1/3 md:sticky md:top-20">
              <div className="bg-white rounded-[32px] p-6 shadow-sm mb-8 border border-gray-50 relative">
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={handleSaveStudioOutfit}
                        disabled={Object.keys(studioSelection).length < 2}
                        className="bg-[#4A4A4A] text-white p-3 rounded-full shadow-lg disabled:opacity-50 hover:scale-105 transition-transform"
                    >
                        <Save size={20} />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 aspect-[3/4]">
                    {/* Top Slot */}
                    <button 
                        onClick={() => setIsSelectingFor('top')}
                        className={`rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-all ${isSelectingFor === 'top' ? 'border-[#D4A373] bg-[#D4A373]/5 ring-2 ring-[#D4A373]/20' : 'border-gray-200 hover:border-[#D4A373]/50'}`}
                    >
                        {studioSelection.top ? (
                            <img src={studioSelection.top.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-[#AAB3AB] font-bold uppercase">Top / Dress</span>
                        )}
                    </button>

                    {/* Accessory Slot */}
                    <button 
                        onClick={() => setIsSelectingFor('acc')}
                        className={`rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-all ${isSelectingFor === 'acc' ? 'border-[#D4A373] bg-[#D4A373]/5 ring-2 ring-[#D4A373]/20' : 'border-gray-200 hover:border-[#D4A373]/50'}`}
                    >
                        {studioSelection.acc ? (
                            <img src={studioSelection.acc.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-[#AAB3AB] font-bold uppercase">Accessory</span>
                        )}
                    </button>

                      {/* Bottom Slot */}
                      <button 
                        onClick={() => setIsSelectingFor('bottom')}
                        className={`rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-all ${isSelectingFor === 'bottom' ? 'border-[#D4A373] bg-[#D4A373]/5 ring-2 ring-[#D4A373]/20' : 'border-gray-200 hover:border-[#D4A373]/50'}`}
                    >
                        {studioSelection.bottom ? (
                            <img src={studioSelection.bottom.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-[#AAB3AB] font-bold uppercase">Bottom</span>
                        )}
                    </button>

                      {/* Shoes Slot */}
                      <button 
                        onClick={() => setIsSelectingFor('shoes')}
                        className={`rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden transition-all ${isSelectingFor === 'shoes' ? 'border-[#D4A373] bg-[#D4A373]/5 ring-2 ring-[#D4A373]/20' : 'border-gray-200 hover:border-[#D4A373]/50'}`}
                    >
                        {studioSelection.shoes ? (
                            <img src={studioSelection.shoes.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-[#AAB3AB] font-bold uppercase">Shoes</span>
                        )}
                    </button>
                </div>
              </div>

              {/* Item Selector Drawer (Inline) */}
              {isSelectingFor && (
                  <div className="mb-8 animate-slide-up">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-bold text-[#4A4A4A]">Select {isSelectingFor}</p>
                        <button onClick={() => setIsSelectingFor(null)} className="text-xs text-[#8C8C8C] hover:text-[#D4A373]">Close</button>
                      </div>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mask-image-fade">
                          {getItemsForCategory(isSelectingFor).map(item => (
                              <div 
                                key={item.id} 
                                onClick={() => {
                                    setStudioSelection(prev => ({...prev, [isSelectingFor]: item}));
                                    setIsSelectingFor(null);
                                }}
                                className="w-24 flex-shrink-0"
                              >
                                <ItemCard item={item} />
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>

            {/* Saved Gallery */}
            <div className="md:flex-1">
              <h3 className="font-serif font-bold text-xl text-[#4A4A4A] mb-4">My Collection</h3>
              <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                  {savedOutfits.map(outfit => (
                      <div key={outfit.id} className="bg-white p-4 rounded-3xl shadow-sm relative border border-gray-50 transition-all hover:shadow-md">
                          <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-bold text-[#4A4A4A]">{outfit.name}</span>
                              <button onClick={() => handleDeleteOutfit(outfit.id)} className="text-[#E5989B] bg-red-50 p-2 rounded-full hover:bg-red-100"><Trash2 size={14} /></button>
                          </div>
                          <div className="flex -space-x-4 overflow-hidden py-2 px-2 mb-3">
                              {outfit.itemIds.map(id => {
                                  const item = items.find(i => i.id === id);
                                  if(!item) return null;
                                  return (
                                      <div key={id} className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-white shrink-0">
                                          <img src={item.imageUrl} className="w-full h-full object-cover" />
                                      </div>
                                  )
                              })}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                              <div className="text-[10px] text-[#AAB3AB] flex gap-2">
                                  <span>{new Date(outfit.createdAt).toLocaleDateString()}</span>
                                  <span className="bg-[#FDFBF7] px-2 rounded-full border border-gray-100">{outfit.type}</span>
                              </div>
                              <button 
                                    onClick={() => handleWearOutfit(outfit.id, outfit.itemIds)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 transition-all duration-300 ${
                                        wornOutfitId === outfit.id
                                        ? 'bg-[#AAB3AB] text-white scale-95'
                                        : 'bg-[#D4A373] text-white hover:bg-[#C59265] shadow-sm hover:shadow-md'
                                    }`}
                              >
                                    {wornOutfitId === outfit.id ? <Check size={12} className="animate-bounce"/> : <Sparkles size={12} />}
                                    {wornOutfitId === outfit.id ? '已记录' : 'Wear Now'}
                              </button>
                          </div>
                      </div>
                  ))}
                  {savedOutfits.length === 0 && (
                      <div className="text-center py-10 opacity-50 md:col-span-2">
                          <Layers size={48} className="mx-auto text-[#AAB3AB] mb-2" strokeWidth={1}/>
                          <p className="text-sm font-serif">还没有保存的搭配</p>
                      </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StylistView;
