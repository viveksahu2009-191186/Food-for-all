
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2, X, CheckCircle2, Navigation, Phone, ShieldAlert, Zap, Star, ShieldCheck, ThumbsUp, AlertCircle, Building2 } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { FoodItem, FoodCategory, DonationStatus, FoodType, RiskLevel } from '../types';

const MOCK_DATA: FoodItem[] = [
  {
    id: 'relief-1',
    donorId: 'm1',
    donorName: 'City Municipal Relief',
    donorRating: 5.0,
    title: 'Relief Mass Feeding Supply',
    description: 'Bulk rice and lentils prepared for flood relief coordination. 500+ kg available.',
    category: FoodCategory.BULK_RELIEF,
    foodType: FoodType.VEG,
    quantity: '500 kg',
    expiryWindow: '12 hours',
    prepTime: 'Live Kitchen',
    location: { address: 'Relief Hub A, London', lat: 51.5, lng: -0.1 },
    imageUrl: 'https://picsum.photos/600/400?food=emergency',
    status: DonationStatus.EMERGENCY_PRIORITY,
    createdAt: new Date().toISOString(),
    allergens: [],
    priorityScore: 100,
    riskLevel: RiskLevel.LOW,
    safetyNotes: 'Maintained at constant heat. Verified by City Health Inspector.',
    hygieneVerified: true,
    isReliefMode: true
  },
  // Existing data...
  {
    id: '1',
    donorId: 'd1',
    donorName: 'Fresh Bakery Co.',
    donorRating: 4.8,
    title: 'Assorted Pastries',
    description: 'Freshly baked croissants and muffins.',
    category: FoodCategory.BAKERY,
    foodType: FoodType.VEG,
    quantity: '12 items',
    expiryWindow: '4 hours',
    prepTime: '6:00 AM Today',
    location: { address: '22 Baker St, London', lat: 51.5237, lng: -0.1585 },
    imageUrl: 'https://picsum.photos/600/400?food=1',
    status: DonationStatus.AVAILABLE,
    createdAt: new Date().toISOString(),
    allergens: ['Gluten'],
    priorityScore: 85,
    riskLevel: RiskLevel.LOW,
    safetyNotes: 'Fully sealed.',
    hygieneVerified: true,
    isReliefMode: false
  }
];

const Explore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [reliefMode, setReliefMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = MOCK_DATA.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.donorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesRelief = !reliefMode || item.status === DonationStatus.EMERGENCY_PRIORITY;
    return matchesSearch && matchesCategory && matchesRelief;
  }).sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Relief Header */}
      {reliefMode && (
        <div className="mb-10 bg-red-600 text-white p-6 rounded-[32px] shadow-2xl shadow-red-200 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
           <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl">
                 <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase tracking-widest">Active Relief Mode</h2>
                 <p className="text-sm font-medium opacity-80">Prioritizing mass feeding & rapid shelter coordination.</p>
              </div>
           </div>
           <button 
             onClick={() => setReliefMode(false)}
             className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
           >
             Disable Emergency Filter
           </button>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Live Coordination</h1>
          <p className="text-slate-500">Connecting municipal supply with community need.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search relief supply, anganwadis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <SlidersHorizontal className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing City Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className={item.status === DonationStatus.EMERGENCY_PRIORITY ? 'ring-4 ring-red-500/30 rounded-2xl transition-all' : ''}>
              <FoodCard 
                item={item} 
                onSelect={setSelectedItem} 
                showMatchPriority={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="bg-white rounded-[32px] w-full max-w-lg relative overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl flex flex-col h-[90vh]">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-slate-100 transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-56 relative shrink-0">
              <img src={selectedItem.imageUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
                <div className="flex gap-2">
                   <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase">
                    {selectedItem.foodType}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm uppercase ${
                    selectedItem.status === DonationStatus.EMERGENCY_PRIORITY ? 'bg-red-600' : 'bg-emerald-600'
                  }`}>
                    {selectedItem.status === DonationStatus.EMERGENCY_PRIORITY ? 'EMERGENCY' : selectedItem.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto flex-grow">
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedItem.title}</h2>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          {selectedItem.donorName}
                       </div>
                       <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-black text-amber-700">
                          <Star className="w-3 h-3 fill-current" />
                          {selectedItem.donorRating}
                       </div>
                    </div>
                 </div>
                 {selectedItem.priorityScore && (
                    <div className="bg-red-600 text-white px-4 py-2 rounded-2xl flex flex-col items-center">
                       <p className="text-[10px] font-black uppercase opacity-70">Priority</p>
                       <p className="text-lg font-black">{selectedItem.priorityScore}%</p>
                    </div>
                 )}
              </div>

              <div className="p-6 bg-red-50 rounded-[32px] border border-red-100 space-y-3">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-black text-red-900 uppercase tracking-widest">Relief Mode Instruction</p>
                 </div>
                 <p className="text-xs text-red-800 leading-relaxed font-medium">
                   This supply is flagged for high-need zones. Please confirm distribution plan before reserving. AI recommends immediate deployment to South Quarter Anganwadis.
                 </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Relief Pickup Zone</p>
                    <p className="text-sm font-medium text-slate-700">{selectedItem.location.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 shrink-0 bg-white">
              <button 
                onClick={() => {
                  setIsRequesting(true);
                  setTimeout(() => {
                    setIsRequesting(false);
                    setRequestSuccess(true);
                  }, 1500);
                }}
                disabled={isRequesting || requestSuccess}
                className={`w-full py-5 rounded-3xl font-black text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  requestSuccess ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                }`}
              >
                {isRequesting ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                 requestSuccess ? <CheckCircle2 className="w-6 h-6" /> : "Deploy Relief Units"}
                {requestSuccess && "Relief Mission Assigned"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
