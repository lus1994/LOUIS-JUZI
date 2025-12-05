
import React, { useState } from 'react';
import { X, Calendar, Tag, Layers, Heart, Share2, Check } from 'lucide-react';
import { ClothingItem, CategoryLabels, SeasonLabels } from '../types';

interface ItemDetailModalProps {
  item: ClothingItem;
  onClose: () => void;
  onWear: (item: ClothingItem) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, onWear }) => {
  const [isWornToday, setIsWornToday] = useState(false);

  const handleWearClick = () => {
    if (isWornToday) return;
    
    setIsWornToday(true);
    
    const today = new Date().toISOString();
    const updatedItem: ClothingItem = {
      ...item,
      wearCount: (item.wearCount || 0) + 1,
      lastWorn: today,
      wearLog: [...(item.wearLog || []), today]
    };
    
    // Delay slightly for animation before saving
    setTimeout(() => {
      onWear(updatedItem);
    }, 600);
  };

  const costPerWear = item.price && item.wearCount > 0 
    ? (item.price / item.wearCount).toFixed(0) 
    : item.price || '---';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center p-0 md:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content - Responsive: Full on mobile, Card on desktop */}
      <div className="relative w-full md:max-w-4xl md:h-[80vh] bg-[#FDFBF7] rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl h-[90vh] flex flex-col md:flex-row animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/20 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="relative h-[55%] md:h-full md:w-1/2 w-full bg-white">
          <img 
            src={item.imageUrl} 
            alt="Clothing Item" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDFBF7] to-transparent md:hidden" />
        </div>

        {/* Info Section */}
        <div className="flex-1 px-8 py-6 flex flex-col overflow-y-auto md:w-1/2 md:p-10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] text-[#AAB3AB] font-bold uppercase tracking-wider block mb-1">
                {CategoryLabels[item.category]}
              </span>
              <h2 className="font-serif text-3xl text-[#4A4A4A]">{item.color} {item.brand !== '未知' ? item.brand : '单品'}</h2>
            </div>
            <button className="text-[#E5989B] hover:text-[#d48588] transition-colors p-2 -mr-2">
              <Heart size={24} />
            </button>
          </div>

          <p className="text-[#8C8C8C] text-sm mb-8 font-light italic">
            "Every piece of clothing tells a story."
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm text-center border border-gray-50">
              <p className="text-[10px] text-[#AAB3AB] uppercase font-bold mb-1">Wear Count</p>
              <p className="font-serif text-2xl text-[#4A4A4A]">{item.wearCount}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm text-center border border-gray-50">
              <p className="text-[10px] text-[#AAB3AB] uppercase font-bold mb-1">CPW</p>
              <p className="font-serif text-2xl text-[#D4A373]">¥{costPerWear}</p>
            </div>
             <div className="bg-white p-4 rounded-2xl shadow-sm text-center border border-gray-50">
              <p className="text-[10px] text-[#AAB3AB] uppercase font-bold mb-1">Season</p>
              <p className="font-serif text-sm text-[#4A4A4A] mt-2 font-medium">{SeasonLabels[item.season]}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
             <div className="flex items-center gap-3 text-sm text-[#4A4A4A] bg-white p-3 rounded-xl border border-dashed border-[#D4A373]/30">
               <Calendar size={16} className="text-[#D4A373]" />
               <span>上次穿着: {item.lastWorn ? new Date(item.lastWorn).toLocaleDateString() : '从未'}</span>
             </div>
             
             {item.purchaseDate && (
                <div className="flex items-center gap-3 text-sm text-[#4A4A4A] bg-white p-3 rounded-xl border border-gray-50">
                  <Tag size={16} className="text-[#AAB3AB]" />
                  <span>购买于: {item.purchaseDate} (¥{item.price})</span>
                </div>
             )}
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <button
              onClick={handleWearClick}
              disabled={isWornToday}
              className={`w-full py-4 rounded-[20px] font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-500 shadow-lg ${
                isWornToday 
                  ? 'bg-[#AAB3AB] text-white cursor-default'
                  : 'bg-[#D4A373] text-white hover:bg-[#C59265] shadow-[#D4A373]/30'
              }`}
            >
              {isWornToday ? (
                <>
                  <Check size={20} /> 已记录
                </>
              ) : (
                <>
                  <Tag size={18} /> 今天穿它
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
