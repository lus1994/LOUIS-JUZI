import React from 'react';
import { ClothingItem, CategoryLabels } from '../types';
import { Calendar } from 'lucide-react';

interface ItemCardProps {
  item: ClothingItem;
  onClick?: () => void;
  selected?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, selected }) => {
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays <= 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      onClick={onClick}
      className={`
        group relative w-full aspect-[3/4] overflow-hidden bg-white cursor-pointer transform-gpu transition-all duration-300
        rounded-[16px] sm:rounded-[20px] md:rounded-[24px]
        active:scale-95 md:hover:-translate-y-1 md:hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)]
        ${selected 
          ? 'ring-2 ring-[#D4A373] shadow-[0_8px_20px_rgba(212,163,115,0.3)]' 
          : 'shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-black/5'
        }
      `}
    >
      <img 
        src={item.imageUrl} 
        alt={item.category} 
        className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Info Overlay - Mobile: Hidden (Clean Look), Desktop: Hover */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#4A4A4A]/90 via-[#4A4A4A]/40 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 pointer-events-none">
        
        {/* Category Label */}
        <p className="text-white font-serif font-medium tracking-wide translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300 text-[11px] sm:text-xs md:text-sm">
          {CategoryLabels[item.category]}
        </p>

        {/* Brand & Color */}
        <p className="text-white/90 translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300 delay-75 truncate text-[10px] sm:text-[11px] md:text-xs mt-0.5">
          {item.color} {item.brand && item.brand !== '未知' ? `· ${item.brand}` : ''}
        </p>
        
        {/* Last Worn Indicator */}
        {item.lastWorn && (
          <div className="flex items-center gap-1.5 mt-2 text-white/80 translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300 delay-100">
            <Calendar size={10} className="sm:w-3 sm:h-3" />
            <span className="font-medium text-[9px] sm:text-[10px] md:text-[11px]">{formatDate(item.lastWorn)}</span>
          </div>
        )}
      </div>

       {/* Wear Count Badge - Responsive Positioning & Sizing */}
       {item.wearCount > 0 && (
          <div className="absolute z-10 top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full flex items-center shadow-sm border border-[#D4A373]/20 md:group-hover:scale-110 transition-transform duration-300 pointer-events-none">
            <span className="font-bold text-[#D4A373] text-[9px] sm:text-[10px] md:text-xs">
              {item.wearCount}次
            </span>
          </div>
       )}
    </div>
  );
};

export default ItemCard;