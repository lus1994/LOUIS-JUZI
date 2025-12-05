
import React from 'react';
import { Shirt, Plus, Sparkles, PieChart, BookHeart } from 'lucide-react';
import { ViewState } from '../types';

interface NavBarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'wardrobe', label: '衣橱', icon: <Shirt size={22} /> },
    { id: 'diary', label: '日记', icon: <BookHeart size={22} /> },
    { id: 'stylist', label: '灵感', icon: <Sparkles size={22} /> },
    { id: 'stats', label: '数据', icon: <PieChart size={22} /> },
  ];

  return (
    <>
      {/* Gradient fade at bottom to blend content behind nav */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none z-[40]" />
      
      {/* Navbar Container - Constrained width on Desktop */}
      <div className="fixed bottom-6 left-0 right-0 z-[50] flex justify-center px-6">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(212,163,115,0.15)] rounded-[32px] px-6 py-4 flex justify-between items-center relative">
          
          {navItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {/* Insert spacer for the floating button in the middle */}
              {index === 2 && <div className="w-8" />} 
              
              <button
                onClick={() => setView(item.id as ViewState)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  currentView === item.id 
                    ? 'text-[#D4A373] scale-110' 
                    : 'text-[#AAB3AB] hover:text-[#8C8C8C]'
                }`}
              >
                {item.icon}
                <span className={`text-[10px] font-medium tracking-wide ${currentView === item.id ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  {item.label}
                </span>
              </button>
            </React.Fragment>
          ))}

          {/* Floating Add Button centered absolutely relative to the nav container */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setView('add-item')}
              className="bg-[#D4A373] hover:bg-[#C59265] text-white rounded-full p-4 shadow-[0_10px_25px_rgba(212,163,115,0.5)] transition-all active:scale-95 border-4 border-[#FDFBF7]"
            >
              <Plus size={28} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
