import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { Calculator, Cpu, Battery, Weight, X, Plus, Trash2, Smartphone, Laptop, Eye, Monitor, HardDrive, Zap, Search, Sparkles, Loader2, Globe, Moon, Sun } from 'lucide-react';

// --- INITIAL DATA ---
const INITIAL_PRODUCTS = [
  {
    id: 1,
    brand: "Apple", 
    name: "MacBook Air M3",
    price: 39900,
    category: "Ultrabook", 
    specs: { cpu: "Apple M3 Chip (8-core)", ram: "8GB Unified", storage: "256GB SSD", battery: "Up to 18 hours", weight: "1.24 kg", screen: "13.6 Liquid Retina" },
    scores: { performance: 7.5, battery: 9.5, portability: 9.0, display: 8.5, features: 7.0 }
  },
  {
    id: 2,
    brand: "Lenovo",
    name: "Legion Pro 5", 
    price: 45900,
    category: "Gaming Laptop",
    specs: { cpu: "Intel Core i7-13700HX", ram: "16GB DDR5", storage: "1TB M.2 SSD", battery: "Approx 5 hours", weight: "2.50 kg", screen: "16 WQXGA 165Hz" },
    scores: { performance: 9.8, battery: 4.0, portability: 3.0, display: 8.0, features: 9.0 }
  },
  {
    id: 9, 
    brand: "Asus",
    name: "ROG Strix G16CH",
    price: 59900,
    category: "Gaming Desktop",
    specs: { cpu: "Intel Core i7-13700F", ram: "16GB DDR4", storage: "1TB SSD", battery: "N/A (Plugged)", weight: "11.0 kg", screen: "Monitor required" },
    scores: { performance: 9.9, battery: 0.0, portability: 1.0, display: 0.0, features: 8.5 }
  },
  {
    id: 10,
    brand: "Apple",
    name: "iPhone 15 Pro Max",
    price: 48900,
    category: "Flagship Phone",
    specs: { cpu: "A17 Pro", ram: "8GB", storage: "256GB", battery: "29 hours video", weight: "221 g", screen: "6.7 Super Retina XDR" },
    scores: { performance: 9.0, battery: 8.5, portability: 10.0, display: 9.5, features: 9.5 }
  },
  {
    id: 3,
    brand: "Asus",
    name: "ZenBook OLED 14",
    price: 35900,
    category: "Ultrabook",
    specs: { cpu: "Intel Core Ultra 7", ram: "16GB LPDDR5X", storage: "1TB M.2 SSD", battery: "Up to 10 hours", weight: "1.20 kg", screen: "14 3K OLED 120Hz" },
    scores: { performance: 8.0, battery: 7.5, portability: 9.5, display: 9.5, features: 8.0 }
  },
  {
    id: 5,
    brand: "Asus",
    name: "ProArt Studiobook",
    price: 79900,
    category: "Workstation Laptop",
    specs: { cpu: "Intel Core i9-13980HX", ram: "64GB DDR5", storage: "2TB SSD RAID 0", battery: "Approx 4 hours", weight: "2.40 kg", screen: "16 3.2K OLED 3D" },
    scores: { performance: 10.0, battery: 3.0, portability: 4.0, display: 10.0, features: 10.0 }
  },
  {
    id: 7,
    brand: "Asus",
    name: "TUF Gaming F15",
    price: 24990,
    category: "Gaming Laptop",
    specs: { cpu: "Intel Core i5-11400H", ram: "8GB DDR4", storage: "512GB NVMe", battery: "48WHrs", weight: "2.30 kg", screen: "15.6 FHD 144Hz" },
    scores: { performance: 7.0, battery: 5.0, portability: 4.0, display: 7.0, features: 8.0 }
  }
];

// --- UTILS ---
const getCategoryTextColor = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes("gaming")) return "text-purple-600 dark:text-purple-400";
  if (cat.includes("workstation")) return "text-blue-600 dark:text-blue-400";
  if (cat.includes("ultrabook")) return "text-emerald-600 dark:text-emerald-400";
  if (cat.includes("phone")) return "text-rose-500 dark:text-rose-400";
  return "text-gray-600 dark:text-gray-400";
};

const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  const colorClass = getCategoryTextColor(category);
  if (cat.includes("phone") || cat.includes("mobile")) return <Smartphone size={32} className={colorClass} />;
  if (cat.includes("desktop") || cat.includes("pc")) return <Monitor size={32} className={colorClass} />;
  return <Laptop size={32} className={colorClass} />;
};

const getCategoryBgColor = (category, isDark) => {
  const cat = category.toLowerCase();
  if (isDark) {
    if (cat.includes("gaming")) return "bg-purple-900/30";
    if (cat.includes("workstation")) return "bg-blue-900/30";
    if (cat.includes("ultrabook")) return "bg-emerald-900/30";
    if (cat.includes("phone")) return "bg-rose-900/30";
    return "bg-slate-800";
  }
  if (cat.includes("gaming")) return "bg-purple-50";
  if (cat.includes("workstation")) return "bg-blue-50";
  if (cat.includes("ultrabook")) return "bg-emerald-50";
  if (cat.includes("phone")) return "bg-rose-50";
  return "bg-gray-100";
};

const App = () => {
  const [compareList, setCompareList] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [weights, setWeights] = useState({ performance: 50, battery: 20, portability: 30, priceSensitivity: 50 });
  const [aiProducts, setAiProducts] = useState([]); 
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // THEME STATE
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- LOGIC ---
  const handleAiSearch = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const isPhoneSearch = searchTerm.toLowerCase().includes("iphone") || searchTerm.toLowerCase().includes("samsung");
      const isDesktopSearch = searchTerm.toLowerCase().includes("pc") || searchTerm.toLowerCase().includes("desktop");
      let aiCategory = "Imported Laptop";
      if (isPhoneSearch) aiCategory = "Flagship Phone";
      else if (isDesktopSearch) aiCategory = "Custom Desktop";

      const mockAiProduct = {
        id: Date.now(), 
        brand: "AI Found",
        name: `${searchTerm} (AI Result)`,
        price: Math.floor(Math.random() * (45000 - 25000) + 25000), 
        category: aiCategory,
        specs: { cpu: "AI Selected CPU", ram: "16GB/32GB", storage: "1TB Cloud", battery: isDesktopSearch ? "N/A" : "High Cap", weight: "Unknown", screen: isDesktopSearch ? "Monitor Req" : "AI Display" },
        scores: { performance: 8.5, battery: isDesktopSearch ? 0 : 7.5, portability: isDesktopSearch ? 1 : 6.0, display: 8.0, features: 9.0 }
      };
      setAiProducts([...aiProducts, mockAiProduct]);
      setIsAiLoading(false);
    }, 1500);
  };

  const allProducts = [...INITIAL_PRODUCTS, ...aiProducts];

  const processedProducts = useMemo(() => {
    const scored = allProducts.map(product => {
      const totalWeight = weights.performance + weights.battery + weights.portability;
      const techScore = ((product.scores.performance * weights.performance) + (product.scores.battery * weights.battery) + (product.scores.portability * weights.portability)) / totalWeight;
      const maxPriceInMarket = 80000; 
      const priceFactor = 1 - (product.price / maxPriceInMarket); 
      const priceWeight = weights.priceSensitivity / 100;
      const finalScore = (techScore * 10 * (1 - priceWeight)) + (priceFactor * 100 * priceWeight);
      return { ...product, techScore, finalScore: Math.min(100, finalScore) };
    }).sort((a, b) => b.finalScore - a.finalScore);

    if (!searchTerm) return scored;
    const searchTokens = searchTerm.toLowerCase().split(/\s+/).filter(token => token.length > 0);
    return scored.filter(product => {
      const productSearchableText = [product.brand, product.name, product.category, product.price.toString(), ...Object.values(product.specs)].join(" ").toLowerCase();
      return searchTokens.every(token => productSearchableText.includes(token));
    });
  }, [weights, searchTerm, aiProducts, allProducts]);

  const toggleCompare = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert("เปรียบเทียบได้สูงสุด 3 รุ่นครับ");
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  const radarData = [
    { subject: 'Performance', fullMark: 10 },
    { subject: 'Battery', fullMark: 10 },
    { subject: 'Portability', fullMark: 10 },
    { subject: 'Display', fullMark: 10 },
    { subject: 'Features', fullMark: 10 },
  ].map(metric => {
    const dataPoint = { metric: metric.subject };
    compareList.forEach((prod, index) => {
      dataPoint[`product${index + 1}`] = prod.scores[metric.subject.toLowerCase()];
    });
    return dataPoint;
  });

  // --- THEME CLASSES HELPERS ---
  const theme = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-gray-50',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-800',
    subText: isDarkMode ? 'text-slate-400' : 'text-gray-500',
    card: isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200',
    cardHover: isDarkMode ? 'hover:border-slate-600' : 'hover:border-gray-300',
    input: isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-900' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-slate-400 focus:ring-slate-100',
    chartGrid: isDarkMode ? '#334155' : '#e2e8f0',
    chartText: isDarkMode ? '#94a3b8' : '#64748b'
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      
      {/* HEADER */}
      <header className={`${isDarkMode ? 'bg-slate-900/80 border-b border-slate-800' : 'bg-white/80 border-b border-gray-200'} backdrop-blur-md sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                SpecHunter 
                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded tracking-wider ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-white'}`}>Pro</span>
              </h1>
              <p className={`text-xs ${theme.subText}`}>ระบบวิเคราะห์ฮาร์ดแวร์อัจฉริยะ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <span className={`hidden md:block text-sm font-medium ${theme.subText} opacity-60`}>System Design Portfolio</span>
             <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}
                title="สลับธีม"
             >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Controls & List */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Controls Panel */}
          <div className={`rounded-xl shadow-sm p-6 border transition-colors ${theme.card}`}>
            <div className={`flex items-center gap-2 mb-6 border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-slate-700'}`}><Calculator size={20} /></div>
              <div>
                  <h2 className={`text-lg font-bold leading-tight ${theme.text}`}>กำหนดเกณฑ์การให้คะแนน</h2>
                  <p className={`text-xs ${theme.subText}`}>ปรับแต่งน้ำหนักการคำนวณคะแนนตามความต้องการ</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Range Inputs */}
              <div className="space-y-5">
                <div>
                    <div className="flex justify-between mb-2"><label className={`text-sm font-semibold flex items-center gap-2 ${theme.subText}`}><Cpu size={16} className="text-indigo-500"/> ความแรง (Performance)</label><span className="text-sm bg-indigo-500/10 text-indigo-500 px-2 rounded font-bold">{weights.performance}%</span></div>
                    <input type="range" min="0" max="100" value={weights.performance} onChange={(e) => setWeights({...weights, performance: parseInt(e.target.value)})} className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`} />
                </div>
                <div>
                    <div className="flex justify-between mb-2"><label className={`text-sm font-semibold flex items-center gap-2 ${theme.subText}`}><Battery size={16} className="text-emerald-500"/> แบตเตอรี่ (Battery)</label><span className="text-sm bg-emerald-500/10 text-emerald-500 px-2 rounded font-bold">{weights.battery}%</span></div>
                    <input type="range" min="0" max="100" value={weights.battery} onChange={(e) => setWeights({...weights, battery: parseInt(e.target.value)})} className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`} />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                    <div className="flex justify-between mb-2"><label className={`text-sm font-semibold flex items-center gap-2 ${theme.subText}`}><Weight size={16} className="text-orange-500"/> การพกพา (Portability)</label><span className="text-sm bg-orange-500/10 text-orange-500 px-2 rounded font-bold">{weights.portability}%</span></div>
                    <input type="range" min="0" max="100" value={weights.portability} onChange={(e) => setWeights({...weights, portability: parseInt(e.target.value)})} className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-orange-500 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`} />
                </div>
                <div>
                    <div className="flex justify-between mb-2"><label className={`text-sm font-semibold flex items-center gap-2 ${theme.subText}`}><div className="w-4 h-4 rounded-full border-2 border-red-500 flex items-center justify-center text-[10px] text-red-500 font-bold">฿</div> ความคุ้มราคา (Price Sensitivity)</label><span className="text-sm bg-red-500/10 text-red-500 px-2 rounded font-bold">{weights.priceSensitivity}%</span></div>
                    <input type="range" min="0" max="100" value={weights.priceSensitivity} onChange={(e) => setWeights({...weights, priceSensitivity: parseInt(e.target.value)})} className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
             <h3 className={`font-bold text-lg flex items-center gap-2 whitespace-nowrap ${theme.text}`}>
                รุ่นที่แนะนำสำหรับคุณ
                <span className={`text-xs font-normal px-2 py-1 rounded-full border hidden sm:inline ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-gray-200 bg-white text-gray-500'}`}>เรียงตามคะแนนที่คุณกำหนด</span>
            </h3>
            <div className="relative w-full sm:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className={`h-4 w-4 ${theme.subText}`} /></div>
              <input type="text" className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl leading-5 text-sm transition-all shadow-sm focus:outline-none focus:ring-2 ${theme.input}`} placeholder="ค้นหารุ่น, สเปค (เช่น i7, 16gb, tuf)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {searchTerm && <button onClick={() => setSearchTerm('')} className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer ${theme.subText} hover:text-red-500`}><X size={14} /></button>}
            </div>
          </div>
          
          {/* Product List */}
          <div className="space-y-3">
            {processedProducts.length > 0 ? (
              processedProducts.map((product, idx) => {
                const isSelected = compareList.find(p => p.id === product.id);
                const itemBg = isSelected 
                    ? (isDarkMode ? 'bg-slate-900 border-indigo-500/50 shadow-md shadow-indigo-900/20' : 'bg-slate-50 border-slate-800 shadow-md') 
                    : theme.card;

                return (
                  <div key={product.id} className={`rounded-xl p-5 flex flex-col sm:flex-row gap-5 transition-all duration-200 border ${itemBg} ${theme.cardHover}`}>
                    
                    {/* Icon / Brand Box */}
                    <div className="flex flex-row sm:flex-col items-center sm:justify-center gap-4 sm:gap-2 sm:w-24 flex-shrink-0">
                        <div className={`w-14 h-14 ${getCategoryBgColor(product.category, isDarkMode)} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                            {getCategoryIcon(product.category)}
                        </div>
                        <div className="text-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${theme.subText}`}>{product.brand}</span>
                            <div className={`text-[9px] px-1.5 py-0.5 rounded mt-1 inline-block ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-600'}`}>{product.category}</div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                         <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${theme.subText}`}>#{idx + 1}</span>
                                <h3 className={`font-bold text-lg cursor-pointer truncate hover:opacity-80 ${theme.text}`} onClick={() => setViewProduct(product)}>{product.name}</h3>
                            </div>
                            <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs mt-1 ${theme.subText}`}>
                                <span className="flex items-center gap-1.5"><Cpu size={12}/> {product.specs.cpu}</span>
                                <span className="flex items-center gap-1.5"><Zap size={12}/> {product.specs.ram}</span>
                                <span className="flex items-center gap-1.5"><HardDrive size={12}/> {product.specs.storage}</span>
                            </div>
                         </div>
                         <div className="text-right flex-shrink-0">
                             <div className={`text-xl font-bold ${theme.text}`}>฿{product.price.toLocaleString()}</div>
                         </div>
                      </div>
                        
                      {/* Score Bar */}
                      <div className={`rounded-lg p-3 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex justify-between items-end mb-1">
                            <span className={`text-xs font-bold ${theme.subText}`}>คะแนนความคุ้มค่า (Score)</span>
                            <span className={`text-lg font-black ${theme.text}`}>{product.finalScore.toFixed(1)}</span>
                        </div>
                        <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                            <div className={`h-2 rounded-full ${product.finalScore > 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : product.finalScore > 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`} style={{ width: `${product.finalScore}%` }}></div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-3">
                        <button onClick={() => setViewProduct(product)} className={`text-xs font-bold flex items-center gap-1 px-2 py-1 hover:opacity-80 ${theme.subText}`}><Eye size={14}/> ดูสเปค</button>
                        <button onClick={() => toggleCompare(product)} className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors border ${isSelected ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : isDarkMode ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600' : 'bg-slate-800 text-white border-slate-800 hover:bg-slate-700'}`}>{isSelected ? <><X size={12}/> ลบออก</> : <><Plus size={12}/> เปรียบเทียบ</>}</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // --- AI SEARCH UI ---
              <div className={`rounded-xl p-12 text-center border border-dashed ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-300'}`}>
                {isAiLoading ? (
                  <div className="flex flex-col items-center animate-in fade-in">
                    <Loader2 size={32} className={`animate-spin mb-3 ${isDarkMode ? 'text-indigo-400' : 'text-slate-600'}`} />
                    <h3 className={`text-base font-bold ${theme.text}`}>กำลังวิเคราะห์ฐานข้อมูลทั่วโลกสำหรับ "{searchTerm}"...</h3>
                    <p className={`text-xs mt-1 ${theme.subText}`}>จำลองการดึงข้อมูลและวิเคราะห์คะแนนด้วย AI</p>
                  </div>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-300'}`}><Globe size={24} /></div>
                    <h3 className={`text-base font-bold ${theme.text}`}>ไม่พบข้อมูลในระบบ</h3>
                    <p className={`text-sm mt-1 mb-6 ${theme.subText}`}>ต้องการให้ AI ค้นหาข้อมูลภายนอกสำหรับ <strong>"{searchTerm}"</strong> หรือไม่?</p>
                    <button 
                      onClick={handleAiSearch}
                      className={`px-5 py-2.5 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 mx-auto text-sm transition-all ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                    >
                      <Sparkles size={14} /> ให้ AI ค้นหา: "{searchTerm}"
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Comparison Area */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className={`rounded-xl shadow-lg border overflow-hidden sticky top-24 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className={`p-4 flex justify-between items-center ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
              <h2 className="font-bold text-sm flex items-center gap-2"><Laptop size={16}/> โซนเปรียบเทียบ (Comparison)</h2>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">{compareList.length}/3</span>
            </div>
            {compareList.length === 0 ? (
              <div className={`p-10 text-center ${theme.subText}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}><Plus size={24} className="opacity-30"/></div>
                <p className="text-sm">เลือกสินค้าเพื่อเปรียบเทียบ</p>
              </div>
            ) : (
              <div className="p-5 space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  {compareList.map((item, idx) => (
                     <div key={item.id} className={`rounded p-2 border relative group text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                        <button onClick={() => toggleCompare(item)} className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"><X size={10}/></button>
                        <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${idx === 0 ? 'bg-indigo-500' : idx === 1 ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                        <p className={`text-[10px] font-bold truncate w-full ${theme.text}`}>{item.name}</p>
                        <p className={`text-[10px] ${theme.subText}`}>฿{item.price.toLocaleString()}</p>
                     </div>
                  ))}
                  {[...Array(3 - compareList.length)].map((_, i) => (
                      <div key={i} className={`border border-dashed rounded p-2 flex items-center justify-center text-[10px] ${isDarkMode ? 'border-slate-700 text-slate-700' : 'border-gray-200 text-gray-300'}`}>ว่าง</div>
                  ))}
                </div>
                <div className="h-[250px] w-full relative -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke={theme.chartGrid} />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: theme.chartText, fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      {compareList.length > 0 && <Radar name={compareList[0].name} dataKey="product1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />}
                      {compareList.length > 1 && <Radar name={compareList[1].name} dataKey="product2" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} />}
                      {compareList.length > 2 && <Radar name={compareList[2].name} dataKey="product3" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />}
                      <Legend wrapperStyle={{fontSize: '10px', paddingTop: '10px'}}/>
                      <RechartsTooltip contentStyle={{fontSize:'12px', borderRadius: '8px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#000', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                {compareList.length > 1 && (
                  <div className={`p-3 rounded border text-xs leading-relaxed ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                    <strong className={`${isDarkMode ? 'text-white' : 'text-slate-800'}`}>วิเคราะห์โดย AI:</strong> รุ่น {compareList[0].name} โดดเด่นในด้าน {Object.entries(compareList[0].scores).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
                  </div>
                )}
                <button onClick={() => setCompareList([])} className={`w-full py-2 text-xs rounded transition-colors flex items-center justify-center gap-1 ${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}><Trash2 size={12}/> ล้างข้อมูลเปรียบเทียบ</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- MODAL --- */}
      {viewProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setViewProduct(null)}></div>
          <div className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in fade-in zoom-in duration-200 ${theme.card}`}>
            
            {/* Modal Header */}
            <div className={`p-6 border-b flex justify-between items-start rounded-t-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-gray-100'}`}>
                <div className="flex gap-4">
                    <div className={`w-16 h-16 ${getCategoryBgColor(viewProduct.category, isDarkMode)} rounded-xl flex items-center justify-center`}>
                        {getCategoryIcon(viewProduct.category)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-gray-200 text-gray-500'}`}>{viewProduct.brand}</span>
                             <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getCategoryTextColor(viewProduct.category)} ${isDarkMode ? 'bg-slate-800' : 'bg-indigo-50'}`}>{viewProduct.category}</span>
                        </div>
                        <h2 className={`text-2xl font-bold ${theme.text}`}>{viewProduct.name}</h2>
                        <p className={`text-xl font-medium mt-1 ${theme.subText}`}>฿{viewProduct.price.toLocaleString()}</p>
                    </div>
                </div>
                <button onClick={() => setViewProduct(null)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-white hover:bg-gray-100 text-gray-400'}`}><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="space-y-8">
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wide mb-4 flex items-center gap-2 border-l-4 border-slate-500 pl-3 ${theme.text}`}>ข้อมูลจำเพาะทางเทคนิค</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {Object.entries({
                        'ซีพียู (CPU)': { icon: Cpu, val: viewProduct.specs.cpu },
                        'แรม (Memory)': { icon: Zap, val: viewProduct.specs.ram },
                        'ความจุ (Storage)': { icon: HardDrive, val: viewProduct.specs.storage },
                        'หน้าจอ (Display)': { icon: Monitor, val: viewProduct.specs.screen },
                        'แบตเตอรี่ (Battery)': { icon: Battery, val: viewProduct.specs.battery },
                        'น้ำหนัก (Weight)': { icon: Weight, val: viewProduct.specs.weight },
                    }).map(([label, data]) => (
                        <div key={label} className={`p-3 border rounded transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                            <p className={`text-[10px] uppercase font-bold mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{label}</p>
                            <p className={`font-semibold flex items-center gap-2 ${theme.text}`}>
                                <data.icon size={14} className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}/> {data.val}
                            </p>
                        </div>
                    ))}
                  </div>
                </div>

                <div>
                   <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wide mb-4 flex items-center gap-2 border-l-4 border-indigo-500 pl-3">วิเคราะห์ประสิทธิภาพ (Performance Analysis)</h3>
                   <div className="grid grid-cols-2 gap-4">
                    {Object.entries(viewProduct.scores).map(([key, score]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs"><span className={`capitalize font-medium ${theme.subText}`}>{key}</span><span className={`font-bold ${theme.text}`}>{score}/10</span></div>
                        <div className={`w-full rounded-full h-1.5 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}><div className={`h-1.5 rounded-full ${score >= 8 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${score * 10}%`}}></div></div>
                      </div>
                    ))}
                   </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button onClick={() => { toggleCompare(viewProduct); setViewProduct(null); }} className={`flex-1 py-3 rounded-xl font-bold transition-colors shadow-lg ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20' : 'bg-slate-800 hover:bg-slate-700 text-white shadow-slate-200'}`}>นำไปเปรียบเทียบ</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;