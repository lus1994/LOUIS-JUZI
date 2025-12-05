import React, { useState, useRef } from 'react';
import { Camera, X, Check, Sparkles, Shirt, Calendar, Palette, ShoppingBag, DollarSign, Clock, Edit2 } from 'lucide-react';
import { analyzeImage } from '../services/geminiService';
import { ClothingItem, ClothingCategory, Season, CategoryLabels, SeasonLabels } from '../types';

interface AddItemViewProps {
  onSave: (item: ClothingItem) => void;
  onCancel: () => void;
}

const AddItemView: React.FC<AddItemViewProps> = ({ onSave, onCancel }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [category, setCategory] = useState<ClothingCategory>(ClothingCategory.TOP);
  const [color, setColor] = useState<string>('');
  const [season, setSeason] = useState<Season>(Season.ALL_YEAR);
  const [brand, setBrand] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default today
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        runAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(base64);
      setCategory(result.category);
      // Pre-fill Color: If AI returns 'Unknown', leave it empty for user to type
      setColor(result.color === '未知' ? '' : result.color);
      setSeason(result.season);
      // Pre-fill Brand: If AI returns 'Unknown' or 'Generic', leave it empty
      setBrand(result.brand === '未知' || result.brand === '通用' ? '' : result.brand);
      setHasAnalyzed(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!image || !hasAnalyzed) return;

    // Use the current state values which might have been edited by the user
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      imageUrl: image,
      category,
      color: color || '未知', // Default back to Unknown if left empty
      season,
      brand: brand || '',
      wearCount: 0,
      purchaseDate: purchaseDate,
      price: price ? parseFloat(price) : undefined,
      lastWorn: undefined
    };

    onSave(newItem);
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFBF7] md:items-center md:justify-center md:bg-black/40 md:backdrop-blur-sm md:fixed md:inset-0 md:z-[60] animate-fade-in">
      {/* Container - Full screen on mobile, Centered Card on Tablet/Desktop */}
      <div className="flex flex-col h-full w-full bg-[#FDFBF7] md:h-[85vh] md:max-w-5xl md:rounded-[32px] md:shadow-2xl md:overflow-hidden md:animate-scale-up transition-all md:border md:border-white/20">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-12 pb-4 md:pt-6 md:pb-6 md:px-8 border-b border-gray-100 md:bg-white/80 md:backdrop-blur-xl z-10 shrink-0">
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-black/5 rounded-full transition-colors -ml-2 group"
          >
            <X size={24} className="text-[#4A4A4A] group-hover:scale-110 transition-transform" />
          </button>
          <h2 className="font-serif text-xl text-[#4A4A4A]">New Arrival</h2>
          <button 
            onClick={handleSave} 
            disabled={!hasAnalyzed || isAnalyzing}
            className={`p-2 rounded-full font-medium transition-all ${
              hasAnalyzed 
                ? 'text-[#D4A373] hover:bg-[#D4A373]/10 hover:scale-110' 
                : 'text-[#AAB3AB] cursor-not-allowed opacity-50'
            }`}
          >
            <Check size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden md:overflow-hidden">
          {/* Responsive Layout: Stack on Mobile, Side-by-Side on Tablet */}
          <div className="flex flex-col md:flex-row md:h-full">
            
            {/* Left Col: Image (Sticky on Desktop) */}
            <div className="w-full md:w-[45%] md:bg-white md:border-r md:border-gray-100 relative md:h-full shrink-0">
               <div className="p-6 md:p-8 md:h-full md:flex md:items-center md:justify-center">
                <div 
                    className={`relative aspect-[3/4] w-full max-w-sm mx-auto rounded-[32px] overflow-hidden flex flex-col items-center justify-center transition-all duration-500
                    ${image ? 'shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white' : 'border-2 border-dashed border-[#D4A373]/30 bg-white hover:bg-[#D4A373]/5'}
                    `}
                >
                    {image ? (
                    <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                        onClick={() => setImage(null)}
                        className="absolute top-4 right-4 bg-white/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/50 transition-colors shadow-sm"
                        >
                        <X size={18} />
                        </button>
                    </>
                    ) : (
                    <div className="space-y-6 text-center p-8 w-full h-full flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                        />
                        <div className="w-20 h-20 bg-[#FDFBF7] text-[#D4A373] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(212,163,115,0.2)] mb-2 group-hover:scale-110 transition-transform duration-300">
                        <Camera size={36} strokeWidth={1.5} />
                        </div>
                        <div>
                        <p className="text-[#4A4A4A] font-serif text-lg mb-1">上传美衣</p>
                        <p className="text-[#AAB3AB] text-xs font-medium uppercase tracking-wider">AI 自动识别分类与颜色</p>
                        </div>
                    </div>
                    )}
                    
                    {/* AI Loader Overlay */}
                    {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-fade-in">
                        <div className="relative">
                        <div className="w-16 h-16 border-4 border-[#D4A373]/20 border-t-[#D4A373] rounded-full animate-spin"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#D4A373]" size={20} />
                        </div>
                        <p className="text-sm font-medium text-[#4A4A4A] mt-4 tracking-wide animate-pulse font-serif">Muse AI 分析中...</p>
                    </div>
                    )}
                </div>
               </div>
            </div>

            {/* Right Col: Form (Scrollable on Desktop) */}
            <div className="w-full md:w-[55%] md:h-full md:overflow-y-auto bg-[#FDFBF7] relative">
              <div className="p-6 md:p-8 pb-32 md:pb-8">
                {!hasAnalyzed && !isAnalyzing && !image && (
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-[#AAB3AB] opacity-50 min-h-[400px]">
                    <Shirt size={48} strokeWidth={1} />
                    <p className="mt-4 font-serif text-lg">请先上传图片开始录入</p>
                    </div>
                )}

                {(hasAnalyzed || isAnalyzing || image) && (
                    <div className={`space-y-6 ${!hasAnalyzed && !isAnalyzing ? 'opacity-50 pointer-events-none grayscale' : 'animate-fade-in-up'}`}>
                    <div className="flex items-center gap-2 text-[#D4A373] font-serif text-lg">
                        <Sparkles size={20} />
                        <span>单品详情</span>
                    </div>
                    
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-white space-y-6">
                        
                        {/* Row 1: Category & Season */}
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-[#AAB3AB] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Shirt size={12} /> 分类
                            </label>
                            <div className="relative group">
                                <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                                className="w-full bg-[#FDFBF7] py-3 px-3 rounded-xl border-none text-sm text-[#4A4A4A] font-medium focus:ring-1 focus:ring-[#D4A373] appearance-none hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                                >
                                {Object.values(ClothingCategory).map(c => (
                                    <option key={c} value={c}>{CategoryLabels[c]}</option>
                                ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#AAB3AB] group-hover:text-[#D4A373] transition-colors">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] text-[#AAB3AB] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Calendar size={12} /> 季节
                            </label>
                            <div className="relative group">
                                <select 
                                value={season} 
                                onChange={(e) => setSeason(e.target.value as Season)}
                                className="w-full bg-[#FDFBF7] py-3 px-3 rounded-xl border-none text-sm text-[#4A4A4A] font-medium focus:ring-1 focus:ring-[#D4A373] appearance-none hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                                >
                                {Object.values(Season).map(s => (
                                    <option key={s} value={s}>{SeasonLabels[s]}</option>
                                ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#AAB3AB] group-hover:text-[#D4A373] transition-colors">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Row 2: Color */}
                        <div className="space-y-2">
                        <label className="text-[10px] text-[#AAB3AB] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Palette size={12} /> 颜色 <span className="ml-auto text-[9px] font-normal text-[#D4A373] bg-[#D4A373]/10 px-1.5 py-0.5 rounded-full flex items-center gap-1"><Edit2 size={8}/>可修改</span>
                        </label>
                        <div className="flex items-center gap-3 bg-[#FDFBF7] p-2 rounded-xl border border-transparent focus-within:border-[#D4A373] focus-within:bg-white transition-all group hover:bg-[#F2EFE9]">
                            {/* Color Preview Block - Visual cue only */}
                            <div className="w-8 h-8 rounded-lg shadow-sm border border-black/5 shrink-0" style={{backgroundColor: '#e5e5e5'}}></div>
                            <input 
                            type="text" 
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="例如：米白、藏青..."
                            className="w-full bg-transparent border-none text-sm text-[#4A4A4A] focus:ring-0 p-0 font-medium placeholder-[#AAB3AB]/50"
                            />
                        </div>
                        </div>

                        {/* Row 3: Brand */}
                        <div className="space-y-2">
                        <label className="text-[10px] text-[#AAB3AB] font-bold uppercase tracking-wider flex items-center gap-1">
                            <ShoppingBag size={12} /> 品牌 / 风格 <span className="ml-auto text-[9px] font-normal text-[#D4A373] bg-[#D4A373]/10 px-1.5 py-0.5 rounded-full flex items-center gap-1"><Edit2 size={8}/>可修改</span>
                        </label>
                        <input 
                            type="text" 
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="例如：Zara, 复古风..."
                            className="w-full bg-[#FDFBF7] py-3 px-4 rounded-xl border-none text-sm text-[#4A4A4A] font-medium focus:ring-1 focus:ring-[#D4A373] placeholder-[#AAB3AB] hover:bg-[#F2EFE9] transition-colors focus:bg-white"
                        />
                        </div>

                        {/* Row 4: Purchase Info (Price & Date) */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                        <div className="space-y-2">
                            <label className="text-[10px] text-[#AAB3AB] font-bold uppercase tracking-wider flex items-center gap-1">
                            <DollarSign size={12} /> 价格 (元)
                            </label>
                            <input 
                            type="number" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-[#FDFBF7] py-3 px-4 rounded-xl border-none text-sm text-[#4A4A4A] font-medium focus:ring-1 focus:ring-[#D4A373] hover:bg-[#F2EFE9] transition-colors focus:bg-white"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] text-[#AAB3AB] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock size={12} /> 购买日期
                            </label>
                            <input 
                            type="date" 
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                            className="w-full bg-[#FDFBF7] py-3 px-4 rounded-xl border-none text-sm text-[#4A4A4A] font-medium focus:ring-1 focus:ring-[#D4A373] hover:bg-[#F2EFE9] transition-colors focus:bg-white"
                            />
                        </div>
                        </div>

                    </div>
                    
                    <p className="text-center text-xs text-[#AAB3AB] pt-2 md:hidden">点击右上角 ✓ 保存到衣橱</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemView;