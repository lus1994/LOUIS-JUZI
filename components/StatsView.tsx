
import React, { useMemo } from 'react';
import { ClothingItem, ClothingCategory, CategoryLabels } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Palette, DollarSign } from 'lucide-react';

interface StatsViewProps {
  items: ClothingItem[];
}

const COLORS = ['#D4A373', '#AAB3AB', '#E5989B', '#4A4A4A', '#8C8C8C', '#F2EFE9', '#C59265'];

const StatsView: React.FC<StatsViewProps> = ({ items }) => {
  
  // Category Distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(ClothingCategory).forEach(c => counts[c] = 0);
    items.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return Object.keys(counts)
      .filter(k => counts[k] > 0)
      .map(k => ({ name: CategoryLabels[k as ClothingCategory], value: counts[k] }));
  }, [items]);

  // Total Estimated Value (Assuming default 200 RMB if no price)
  const totalValue = items.reduce((acc, item) => acc + (item.price || 0), 0);

  // Most Worn Color Calculation
  const mostWornColor = useMemo(() => {
    const colorCounts: Record<string, number> = {};
    items.forEach(item => {
      if (item.wearCount > 0 && item.color !== '未知') {
        colorCounts[item.color] = (colorCounts[item.color] || 0) + item.wearCount;
      }
    });
    
    let maxColor = '暂无数据';
    let maxCount = 0;
    Object.entries(colorCounts).forEach(([color, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxColor = color;
      }
    });
    return maxColor;
  }, [items]);

  // CPW Calculation & Ranking
  const itemsWithCPW = useMemo(() => {
    return items.map(item => ({
      ...item,
      cpw: item.wearCount > 0 ? (item.price || 200) / item.wearCount : (item.price || 200)
    })).sort((a, b) => a.cpw - b.cpw);
  }, [items]);

  const bestValueItems = itemsWithCPW.filter(i => i.wearCount > 0).slice(0, 4); // Increased to 4 for desktop grid
  const wastedItems = items.filter(i => i.wearCount === 0).sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 4);

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-32 pt-14 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xs text-[#AAB3AB] font-bold tracking-[0.2em] uppercase mb-1">Insights</h2>
          <h1 className="font-serif text-3xl text-[#4A4A4A]">衣橱数据</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          <div className="bg-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign size={48} className="text-[#D4A373]" />
            </div>
            <p className="text-[#AAB3AB] text-[10px] font-bold uppercase tracking-wider">总价值估算</p>
            <p className="font-serif text-3xl text-[#D4A373]">¥{totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-[24px] shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Palette size={48} className="text-[#E5989B]" />
            </div>
            <p className="text-[#AAB3AB] text-[10px] font-bold uppercase tracking-wider">最爱色系</p>
            <p className="font-serif text-3xl text-[#4A4A4A] truncate">{mostWornColor}</p>
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* CPW Charts - Best Value */}
          <div className="space-y-6 mb-8">
            <h3 className="font-serif font-bold text-lg text-[#4A4A4A] flex items-center gap-2">
                <TrendingUp size={20} className="text-[#D4A373]" />
                Best Value (最低 CPW)
            </h3>
            {bestValueItems.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {bestValueItems.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm text-center">
                            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-2">
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <p className="font-serif text-[#D4A373] font-bold">¥{item.cpw.toFixed(0)}</p>
                            <p className="text-[10px] text-[#AAB3AB]">次均成本</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-[#8C8C8C] italic">记录更多穿搭来解锁此数据...</p>
            )}
          </div>

          {/* CPW Charts - Waste Alert */}
          <div className="space-y-6 mb-8">
            <h3 className="font-serif font-bold text-lg text-[#4A4A4A] flex items-center gap-2">
                <TrendingDown size={20} className="text-[#AAB3AB]" />
                待宠幸 (高价未穿)
            </h3>
            {wastedItems.length > 0 ? (
                <div className="space-y-3">
                    {wastedItems.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm flex items-center gap-4">
                            <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0">
                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#4A4A4A]">{item.color} {CategoryLabels[item.category]}</p>
                                <p className="text-[10px] text-[#AAB3AB]">购入价: ¥{item.price || 0}</p>
                            </div>
                            <div className="px-3 py-1 bg-[#FDFBF7] rounded-full text-xs text-[#E5989B] font-bold whitespace-nowrap">
                                0次
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-[#8C8C8C] italic">太棒了！你的衣橱利用率很高。</p>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6 max-w-2xl mx-auto">
          <h3 className="font-serif font-bold text-lg text-[#4A4A4A] mb-6">衣橱构成</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
              {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-[#8C8C8C]">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                      {entry.name}
                  </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
