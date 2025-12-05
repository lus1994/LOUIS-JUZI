
import React, { useState, useMemo, useEffect } from 'react';
import { ClothingItem, DiaryEntry, Mood, MoodColors } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Camera, Smile, X, Save, Edit3, Image as ImageIcon } from 'lucide-react';
import { loadDiaryEntries, saveDiaryEntry } from '../services/storageService';

interface DiaryViewProps {
  items: ClothingItem[];
}

const DiaryView: React.FC<DiaryViewProps> = ({ items }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [editingMood, setEditingMood] = useState<Mood | undefined>(undefined);
  const [editingNote, setEditingNote] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    setEntries(loadDiaryEntries());
  }, []);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    
    // Load existing entry
    const entry = entries.find(e => e.date === dateStr);
    setEditingMood(entry?.mood);
    setEditingNote(entry?.note || '');
    setEditingPhoto(entry?.photoUrl);
    
    setIsEditorOpen(true);
  };

  const handleSaveEntry = () => {
    if (!selectedDateStr) return;
    
    const newEntry: DiaryEntry = {
      date: selectedDateStr,
      mood: editingMood,
      note: editingNote,
      photoUrl: editingPhoto
    };

    saveDiaryEntry(newEntry);
    setEntries(loadDiaryEntries()); // Reload
    setIsEditorOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    const data: { day: number; items: ClothingItem[]; dateStr: string; entry?: DiaryEntry }[] = [];

    // Fill empty slots
    for (let i = 0; i < firstDay; i++) {
      data.push({ day: 0, items: [], dateStr: '' });
    }

    // Fill days
    for (let day = 1; day <= days; day++) {
      const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const wornItems = items.filter(item => 
        item.wearLog?.some(log => log.startsWith(targetDateStr))
      );
      
      const entry = entries.find(e => e.date === targetDateStr);
      
      data.push({ day, items: wornItems, dateStr: targetDateStr, entry });
    }
    
    return data;
  }, [currentDate, items, entries]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const moods: Mood[] = ['Happy', 'Confident', 'Relaxed', 'Tired', 'Excited'];

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-32 pt-14 px-6 bg-[#FDFBF7] relative md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xs text-[#AAB3AB] font-bold tracking-[0.2em] uppercase mb-1">Journal</h2>
            <h1 className="font-serif text-3xl text-[#4A4A4A]">生活手账</h1>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#D4A373]">
            <CalendarIcon size={20} />
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#4A4A4A]">
            <ChevronLeft size={24} />
          </button>
          <span className="font-serif text-xl font-medium text-[#4A4A4A]">
            {monthNames[currentDate.getMonth()]} <span className="text-[#D4A373]">{currentDate.getFullYear()}</span>
          </span>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#4A4A4A]">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-[#AAB3AB] tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 md:gap-x-4 md:gap-y-6">
            {monthData.map((cell, idx) => {
              if (cell.day === 0) return <div key={idx} />;

              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), cell.day).toDateString();
              const hasItems = cell.items.length > 0;
              const hasEntry = !!cell.entry;
              const mainItem = hasItems ? cell.items[0] : null;

              return (
                <div key={idx} className="flex flex-col items-center gap-1 group" onClick={() => handleDayClick(cell.day)}>
                  {/* Date Cell */}
                  <div 
                    className={`w-full aspect-square rounded-2xl relative overflow-hidden transition-all duration-300 cursor-pointer
                      ${hasEntry || hasItems 
                        ? 'shadow-md ring-2 ring-white hover:shadow-lg hover:scale-105' 
                        : 'bg-white/50 border border-dashed border-[#AAB3AB]/30 hover:border-[#D4A373]/50'
                      }
                      ${isToday && !hasEntry && !hasItems ? 'bg-[#D4A373]/10' : ''}
                    `}
                  >
                    {/* Priority: Life Photo -> Outfit Photo -> Mood Color -> Empty */}
                    {cell.entry?.photoUrl ? (
                      <img src={cell.entry.photoUrl} className="w-full h-full object-cover" />
                    ) : mainItem ? (
                      <>
                        <img src={mainItem.imageUrl} alt="OOTD" className="w-full h-full object-cover" />
                        {cell.items.length > 1 && (
                          <div className="absolute top-1 right-1 bg-black/60 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold backdrop-blur-sm">
                            +{cell.items.length - 1}
                          </div>
                        )}
                      </>
                    ) : cell.entry?.mood ? (
                      <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: MoodColors[cell.entry.mood] + '40'}}>
                          <div className="w-3 h-3 rounded-full" style={{backgroundColor: MoodColors[cell.entry.mood]}}></div>
                      </div>
                    ) : (
                      isToday && (
                        <div className="w-full h-full flex items-center justify-center text-[#D4A373]/50">
                          <Edit3 size={14} />
                        </div>
                      )
                    )}
                    
                    {/* Mood Dot Indicator */}
                    {cell.entry?.mood && (hasItems || cell.entry.photoUrl) && (
                      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white" style={{backgroundColor: MoodColors[cell.entry.mood]}} />
                    )}
                  </div>
                  
                  {/* Day Number */}
                  <span className={`text-xs font-medium ${isToday ? 'text-[#D4A373] font-bold' : 'text-[#8C8C8C]'}`}>
                    {cell.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* JOURNAL EDITOR SHEET */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center animate-fade-in">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />
            <div className="relative w-full max-w-md md:max-w-2xl bg-[#FDFBF7] rounded-t-[32px] md:rounded-[32px] shadow-2xl h-[85vh] md:h-auto md:max-h-[85vh] flex flex-col p-6 animate-slide-up">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                      <p className="text-xs text-[#AAB3AB] font-bold uppercase tracking-wider">Journal Entry</p>
                      <h2 className="font-serif text-2xl text-[#4A4A4A]">{selectedDateStr}</h2>
                  </div>
                  <button onClick={() => setIsEditorOpen(false)} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100">
                      <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                  <div className="space-y-6">
                    {/* Mood Selector */}
                    <div>
                        <label className="block text-sm font-bold text-[#4A4A4A] mb-3 flex items-center gap-2"><Smile size={16}/> 今日心情</label>
                        <div className="flex justify-between">
                          {moods.map(m => (
                              <button 
                                key={m}
                                onClick={() => setEditingMood(m)}
                                className={`flex flex-col items-center gap-1 transition-all ${editingMood === m ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
                              >
                                <div 
                                    className="w-10 h-10 rounded-full shadow-sm border-2 border-white flex items-center justify-center" 
                                    style={{backgroundColor: MoodColors[m]}}
                                >
                                    {editingMood === m && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-[10px] text-[#8C8C8C]">{m}</span>
                              </button>
                          ))}
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-bold text-[#4A4A4A] mb-3 flex items-center gap-2"><ImageIcon size={16}/> 生活瞬间</label>
                        <div className="relative w-full aspect-video bg-white rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group hover:border-[#D4A373]/50 transition-colors">
                            {editingPhoto ? (
                              <>
                                  <img src={editingPhoto} className="w-full h-full object-cover" />
                                  <button onClick={() => setEditingPhoto(undefined)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12}/></button>
                              </>
                            ) : (
                              <div className="text-center">
                                  <Camera className="mx-auto text-[#AAB3AB] mb-2" />
                                  <span className="text-xs text-[#8C8C8C]">点击上传照片</span>
                              </div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoUpload} />
                        </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Note Area */}
                    <div>
                        <label className="block text-sm font-bold text-[#4A4A4A] mb-3 flex items-center gap-2"><Edit3 size={16}/> 随笔</label>
                        <textarea 
                          value={editingNote}
                          onChange={(e) => setEditingNote(e.target.value)}
                          placeholder="记录今天发生的小确幸..."
                          className="w-full h-32 md:h-48 p-4 bg-white rounded-2xl border-none focus:ring-1 focus:ring-[#D4A373] text-sm leading-relaxed resize-none shadow-sm"
                        />
                    </div>

                    {/* OOTD Display (Read Only) */}
                    <div>
                        <label className="block text-sm font-bold text-[#4A4A4A] mb-3">今日穿搭</label>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {items.filter(item => item.wearLog?.some(log => log.startsWith(selectedDateStr || ''))).map(item => (
                              <div key={item.id} className="w-20 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm">
                                <img src={item.imageUrl} className="w-full h-full object-cover" />
                              </div>
                          ))}
                          {items.filter(item => item.wearLog?.some(log => log.startsWith(selectedDateStr || ''))).length === 0 && (
                              <p className="text-xs text-[#AAB3AB] italic">暂无穿搭记录</p>
                          )}
                        </div>
                    </div>
                  </div>

                </div>

                {/* Save Button */}
                <button 
                  onClick={handleSaveEntry}
                  className="w-full bg-[#D4A373] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#D4A373]/20 flex items-center justify-center gap-2 mt-4"
                >
                  <Save size={18} /> 保存日记
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryView;
