import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  UploadCloud,
  Eye,
  CheckCircle2,
  Monitor,
  Smartphone,
  SlidersHorizontal,
  ImagePlus,
  RefreshCw,
  Globe,
  Check,
  Crown,
  Edit2,
  Wallpaper,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  getSavedHeroBackground,
  saveHeroBackground,
  resetHeroBackground,
  initialHeroBackground,
  getSavedHeroCard,
  saveHeroCard
} from '../services/api';
import { compressHighResImageFile } from '../utils/imageCompressor';
import { resolveAsset } from '../utils/assets';

export default function HeroMediaControlStudio({ showToast = () => {}, setActiveSidebarItem = () => {} }) {
  // State
  const [heroBg, setHeroBg] = useState(getSavedHeroBackground);
  const [heroCard, setHeroCard] = useState(getSavedHeroCard);
  const [activeTab, setActiveTab] = useState('background'); // 'background' | 'showcase-card'
  const [devicePreview, setDevicePreview] = useState('desktop'); // 'desktop' | 'mobile'
  const [isUploading, setIsUploading] = useState(false);
  const [isCardUploading, setIsCardUploading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [customUrl, setCustomUrl] = useState('');
  const [overlayOpacity, setOverlayOpacity] = useState(() => getSavedHeroBackground().overlayOpacity ?? 70);

  const bgFileInputRef = useRef(null);
  const cardFileInputRef = useRef(null);

  // Sync with storage / cloud events
  useEffect(() => {
    const handleUpdate = () => {
      setHeroBg(getSavedHeroBackground());
      setHeroCard(getSavedHeroCard());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cloud_hero_bg_updated', handleUpdate);
    window.addEventListener('cloud_hero_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cloud_hero_bg_updated', handleUpdate);
      window.removeEventListener('cloud_hero_updated', handleUpdate);
    };
  }, []);

  // Official 4K Background Presets
  const officialHeroBgPresets = [
    {
      id: 'desert-road',
      title: 'طريق أوباري غات - المسار الصحراوي الأصلي',
      badge: 'الافتراضي 4K',
      image: './hero-desert-road.jpg',
      mobileImage: './road-hero-mobile.jpg',
      desc: 'المسار الأسفلتي العريض الممتد عبر الصحراء مع تخطيط الألوان المرورية وخط الأفق'
    },
    {
      id: 'asphalt-paver',
      title: 'آليات رصف الأسفلت والدمك الحديثة',
      badge: 'ميداني مباشر',
      image: './road-paving-official.jpg',
      mobileImage: './road-paving-official.jpg',
      desc: 'كوادر الرصف الميدانية أثناء العمل مع فاردة الأسفلت العملاقة وقت الغروب'
    },
    {
      id: 'aerial-highway',
      title: 'المسار من الجو - خط الأفق الصحراوي',
      badge: 'منظور بانورامي',
      image: './road-aerial-highway.jpg',
      mobileImage: './road-aerial-highway.jpg',
      desc: 'لقطة جوية لطريق أوباري غات تبرز جودة طبقة الرصف وانسيابية المنعطفات'
    },
    {
      id: 'grader-earthwork',
      title: 'أعمال التسوية الترابية والجريدر',
      badge: 'تجهيز المسار',
      image: './road-grader-earthwork.jpg',
      mobileImage: './road-grader-earthwork.jpg',
      desc: 'آليات الجريدر الثقيلة خلال تنفيذ طبقة الأساس الحبيبي والتسوية الجيوتقنية'
    },
    {
      id: 'rollers-compaction',
      title: 'مداحل وضغط الأسفلت الميدانية',
      badge: 'جودة معتمدة',
      image: './road-rollers-compaction.jpg',
      mobileImage: './road-rollers-compaction.jpg',
      desc: 'أسطول المداحل الاهتزازية أثناء تحقيق درجات الدمك القياسية للخلطة الساخنة'
    },
    {
      id: 'solar-lighting',
      title: 'إنارة الطاقة الشمسية الذكية للمسار',
      badge: 'سلامة مرورية',
      image: './road-grader-earthwork.jpg',
      mobileImage: './road-grader-earthwork.jpg',
      desc: 'أعمدة الإنارة الموفرة بالطاقة الشمسية الممتدة على طول التقاطعات والمحطات'
    }
  ];

  // Upload High-Res Background Image Handler
  const handleUploadBg = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const result = await compressHighResImageFile(file, 2880, 1620, 0.88);
      const updated = {
        ...heroBg,
        image: result.dataUrl,
        mobileImage: result.dataUrl,
        overlayOpacity,
        isCustom: true
      };
      setHeroBg(updated);
      saveHeroBackground(updated);
      setUploadInfo({
        label: result.resolutionLabel,
        dimensions: `${result.origWidth || result.width} × ${result.origHeight || result.height}`,
        size: `${Math.round(result.compressedSize / 1024)} KB`,
        format: result.format?.toUpperCase()
      });
      showToast(`تم رفع وتطبيق الصورة بدقة ${result.resolutionLabel} على خلفية البوابة بنجاح!`);
    } catch (err) {
      alert(err.message || 'تعذر معالجة الصورة عالية الدقة');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Direct High-Res URL Handler
  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      showToast('يرجى إدخال رابط الصورة 4K');
      return;
    }
    const updated = {
      ...heroBg,
      image: customUrl.trim(),
      mobileImage: customUrl.trim(),
      overlayOpacity,
      isCustom: true
    };
    setHeroBg(updated);
    saveHeroBackground(updated);
    setUploadInfo({
      label: 'رابط سحابي مباشر 4K/8K',
      dimensions: 'دقة فائقة أصلية',
      size: 'سحابي خارجي',
      format: 'Direct URL'
    });
    setCustomUrl('');
    showToast('تم تطبيق الرابط الخارجي عالي الدقة على خلفية البوابة!');
  };

  // Preset Selection Handler
  const handleSelectPreset = (preset) => {
    const updated = {
      ...heroBg,
      image: preset.image,
      mobileImage: preset.mobileImage || preset.image,
      overlayOpacity,
      isCustom: true
    };
    setHeroBg(updated);
    saveHeroBackground(updated);
    setUploadInfo({
      label: preset.title,
      dimensions: '2560 × 1440 (2.5K Widescreen)',
      size: 'مُعتمد رسمي',
      format: '4K Presets'
    });
    showToast(`تم تطبيق خلفية "${preset.title}" بنجاح!`);
  };

  // Reset to Default Handler
  const handleReset = () => {
    if (window.confirm('هل تريد استعادة الخلفية الافتراضية الأصلية للبوابة؟')) {
      resetHeroBackground();
      setHeroBg(initialHeroBackground);
      setUploadInfo(null);
      showToast('تمت استعادة الخلفية الافتراضية الأصلية للبوابة بنجاح');
    }
  };

  // Update Opacity
  const handleUpdateOpacity = (val) => {
    const num = Number(val);
    setOverlayOpacity(num);
    const updated = { ...heroBg, overlayOpacity: num };
    setHeroBg(updated);
    saveHeroBackground(updated);
  };

  // Upload Showcase Card Photo
  const handleUploadCardPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCardUploading(true);
      const res = await compressHighResImageFile(file, 2560, 1600, 0.88);
      const updatedCard = {
        ...heroCard,
        image: res.dataUrl
      };
      setHeroCard(updatedCard);
      saveHeroCard(updatedCard);
      showToast(`تم تحديث صورة بطاقة الواجهة بنجاح بدقة ${res.resolutionLabel}!`);
    } catch (err) {
      alert(err.message || 'تعذر معالجة صورة البطاقة');
    } finally {
      setIsCardUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-start">
      
      {/* ── Main Studio Header Banner ── */}
      <div className="bg-gradient-to-r from-[#0A1128] via-[#101935] to-[#0A1128] rounded-3xl p-6 sm:p-7 border border-amber-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>استوديو صور وخلفيات البوابة بدقة فائقة 4K</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>مزامنة مباشرة مع البوابة العامة</span>
              </span>
              {uploadInfo && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {uploadInfo.label} • {uploadInfo.dimensions}
                </span>
              )}
            </div>
            
            <h3 className="text-xl sm:text-3xl font-black text-white">
              التحكم في الصورة الرئيسية وخلفية البوابة العامة
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              يمكنك هنا رفع أي صورة بدقة فائقة (4K UHD أو 2.5K) لتكون هي الخلفية البانورامية للموقع بأكمله، أو تغيير صورة بطاقة الموقف التنفيذي الميداني. يتم تطبيق التعديلات فوراً على الواجهة دون إعادة تحميل.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => bgFileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'جاري المعالجة والرفع 4K...' : 'رفع صورة 4K من جهازك'}</span>
            </button>
            
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('hero-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>معاينة الواجهة العامة ↗</span>
            </button>
          </div>
        </div>

        {/* Subtabs Selector */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('background')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'background'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Wallpaper className="w-4 h-4" />
            <span>خلفية البوابة الرئيسية 4K</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('showcase-card')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'showcase-card'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>صورة بطاقة الموقف التنفيذي</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input for Background */}
      <input
        type="file"
        ref={bgFileInputRef}
        accept="image/*"
        onChange={handleUploadBg}
        className="hidden"
      />

      {/* ── TAB 1: HERO 4K BACKGROUND ── */}
      {activeTab === 'background' && (
        <div className="space-y-6">
          
          {/* Row 1: Dual-Device Live Mockup & Opacity Tuner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-500" />
                  <span>المعاينة الحية الفورية على شاشات الزوار:</span>
                </h4>
                <p className="text-xs text-slate-500">
                  شاهد كيف تبدو الصورة المعتمدة الآن على البوابة العامة مع الخطوط والعناوين بدقة فائقة
                </p>
              </div>

              {/* Device Toggle Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setDevicePreview('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    devicePreview === 'desktop'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>الكمبيوتر (16:9)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setDevicePreview('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    devicePreview === 'mobile'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>الهاتف (9:16)</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Mockup Frame */}
            <div className="flex justify-center bg-slate-950 p-4 sm:p-8 rounded-2xl border border-slate-800 overflow-hidden">
              {devicePreview === 'desktop' ? (
                /* Desktop 16:9 Panoramic Mockup */
                <div className="w-full max-w-4xl aspect-[16/9] relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between p-6 sm:p-10 select-none bg-slate-900">
                  {/* Background Photo */}
                  <img
                    src={resolveAsset(heroBg.image || './hero-desert-road.jpg')}
                    alt="Preview 4K Background"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = resolveAsset('./road-paving-official.jpg');
                    }}
                  />
                  
                  {/* Overlays */}
                  <div 
                    style={{ opacity: (overlayOpacity ?? 70) / 100 }}
                    className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent transition-opacity" 
                  />
                  <div 
                    style={{ opacity: (overlayOpacity ?? 70) / 100 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity" 
                  />

                  {/* Desktop Mockup Content */}
                  <div className="relative z-10 flex items-center justify-between text-white text-[10px] pb-2 border-b border-white/15">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>جهاز تنفيذ مشروعات المواصلات • طريق أوباري - غات</span>
                    </span>
                    <span className="font-mono text-amber-400 font-bold">4K ULTRA HD ACTIVE</span>
                  </div>

                  <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
                    {/* Text side */}
                    <div className="col-span-8 text-start space-y-2">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        خطة عودة الحياة • مشروع وطني استراتيجي
                      </span>
                      <h2 className="text-sm sm:text-2xl font-black text-white leading-tight font-['Noto_Sans_Arabic']">
                        مشروع صيانة وتأهيل <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                          طريق أوباري - غات
                        </span> (360 كم)
                      </h2>
                      <p className="text-[10px] sm:text-xs text-slate-300 line-clamp-2 max-w-md">
                        إعادة إعمار وتطوير الطريق الشرياني الرابط بين أوباري وغات مع تطبيق معايير السلامة المرورية المعتمدة.
                      </p>
                      <div className="pt-1">
                        <span className="inline-block px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px]">
                          استكشف المشاريع
                        </span>
                      </div>
                    </div>

                    {/* Mini Showcase Card on Left */}
                    <div className="col-span-4">
                      <div className="w-full rounded-xl overflow-hidden border border-white/20 bg-black/60 backdrop-blur-md p-2 space-y-1.5">
                        <div className="h-16 rounded-lg overflow-hidden bg-slate-800">
                          <img 
                            src={resolveAsset(heroCard.image || './road-paving-official.jpg')} 
                            alt="Mini Card" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="text-[9px] text-white">
                          <span className="text-amber-400 font-bold block truncate">{heroCard.tag || 'الموقف التنفيذي'}</span>
                          <span className="font-black block truncate">{heroCard.title || 'أعمال الرصف 360 كم'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
                    <span>طريق أوباري - غات (360 كم)</span>
                    <span className="text-emerald-400 font-bold">● متصل ومحدث حياً</span>
                  </div>
                </div>
              ) : (
                /* Mobile 9:16 Mockup */
                <div className="w-64 aspect-[9/16] relative rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl flex flex-col justify-between p-4 select-none bg-slate-900">
                  {/* Background Photo */}
                  <img
                    src={resolveAsset(heroBg.mobileImage || heroBg.image || './road-hero-mobile.jpg')}
                    alt="Mobile Preview"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div 
                    style={{ opacity: (overlayOpacity ?? 70) / 100 }}
                    className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" 
                  />

                  <div className="relative z-10 text-center text-white text-[9px] pt-1">
                    <span className="font-mono text-amber-400 font-bold">معاينة شاشة الهاتف</span>
                  </div>

                  <div className="relative z-10 text-start space-y-2">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 text-amber-400">
                      مشروع وطني
                    </span>
                    <h3 className="text-sm font-black text-white leading-tight font-['Noto_Sans_Arabic']">
                      طريق أوباري - غات <br />(360 كم)
                    </h3>
                    <p className="text-[9px] text-slate-300 line-clamp-2">
                      الشريان البري الاستراتيجي لربط وتنمية مدن وقرى الجنوب الغربي.
                    </p>
                  </div>

                  {/* Mini Mobile Card */}
                  <div className="relative z-10 rounded-xl overflow-hidden border border-white/20 bg-black/70 p-2 space-y-1">
                    <div className="h-16 rounded overflow-hidden">
                      <img src={resolveAsset(heroCard.image || './road-paving-official.jpg')} alt="Card" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-bold text-amber-400 block truncate">{heroCard.tag || 'المستجدات'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Opacity Controller Slider */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                  <span>تعتيم طبقة القراءة (Readability Contrast): {overlayOpacity}%</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  كلما زادت النسبة، كلما كانت النصوص والخطوط أوضح وأسهل للقراءة فوق الصور الساطعة
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-64">
                <span className="text-[10px] text-slate-400 font-bold">30% خفيف</span>
                <input
                  type="range"
                  min="30"
                  max="95"
                  step="5"
                  value={overlayOpacity}
                  onChange={(e) => handleUpdateOpacity(e.target.value)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 font-bold">95% داكن</span>
              </div>
            </div>
          </div>

          {/* Row 2: Upload 4K from Computer & Direct Cloud URL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Method 1: Upload File from Device */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">رفع صورة جديدة من الكمبيوتر أو الهاتف</h4>
                    <span className="text-[11px] text-slate-500">معالجة فورية بدقة 4K UHD فائقة الوضوح</span>
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onClick={() => bgFileInputRef.current?.click()}
                  className={`mt-3 p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                    isUploading
                      ? 'bg-amber-50/50 border-amber-400'
                      : 'bg-slate-50 hover:bg-amber-50/40 border-slate-300 hover:border-amber-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                    <ImagePlus className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-800 block">
                      {isUploading ? 'جاري معالجة وتجهيز الصورة فائقة الدقة...' : 'انقر هنا لاختيار ملف صورة من جهازك'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      يدعم صيغ JPG, PNG, WEBP, AVIF بدقة تصل إلى 4K و 8K
                    </span>
                  </div>

                  <span className="text-[10px] px-3 py-1 rounded-full bg-slate-200 font-bold text-slate-700">
                    المقاس الموصى به: 3840×2160 أو 2560×1440
                  </span>
                </div>
              </div>

              {/* Reset to Default Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>استعادة الخلفية الافتراضية الأصلية</span>
                </button>
                
                <span className="text-[10px] text-slate-400 font-mono">
                  {heroBg.isCustom ? '● صورة مخصصة نشطة' : '● الخلفية الافتراضية'}
                </span>
              </div>
            </div>

            {/* Method 2: Direct High-Res Image URL */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">إدخال رابط صورة خارجي مباشر (Direct 4K URL)</h4>
                    <span className="text-[11px] text-slate-500">للصور الضخمة المرفوعة على Google Drive أو Supabase</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  إذا كانت لديك صورة غير مضغوطة بحجم كبير (مثلاً 10MB أو 20MB) مرفوعة على سحابة أو موقع خارجي، الصق رابطها المباشر هنا ليتم عرضها بكامل دقتها الأصلية 4K/8K دون استهلاك ذاكرة التخزين المحلية.
                </p>

                <form onSubmit={handleApplyUrl} className="space-y-3 pt-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/desert-highway-4k.jpg"
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-amber-500 font-mono text-xs text-left"
                    dir="ltr"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#0A1128] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>تطبيق رابط الصورة على البوابة</span>
                  </button>
                </form>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>الروابط المباشرة تعمل فوراً عبر بروتوكول HTTPS وتتيح أقصى دقة وجودة للأجهزة ذات الشاشات الكبيرة.</span>
              </div>
            </div>

          </div>

          {/* Row 3: Official 4K Highway Presets Gallery */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>مكتبة الخلفيات الرسمية المعتمدة (4K Official Presets)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  اختر أي لقطة فوتوغرافية معتمدة من مسار المشروع لتطبيقها كخلفية رئيسية بنقرة واحدة
                </p>
              </div>
              
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start">
                {officialHeroBgPresets.length} خلفيات جاهزة عالية الدقة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {officialHeroBgPresets.map((preset) => {
                const isCurrent = heroBg.image === preset.image;
                return (
                  <div
                    key={preset.id}
                    className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between group ${
                      isCurrent
                        ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="relative h-36 overflow-hidden bg-black">
                        <img
                          src={resolveAsset(preset.image)}
                          alt={preset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = resolveAsset('./road-paving-official.jpg');
                          }}
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold">
                          {preset.badge}
                        </div>
                        {isCurrent && (
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-md">
                            <Check className="w-3 h-3" />
                            <span>نشط حالياً</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3.5 space-y-1 text-start">
                        <h5 className="font-black text-xs text-slate-900 leading-snug">{preset.title}</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{preset.desc}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">2.5K Widescreen</span>
                      <button
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        disabled={isCurrent}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-50 text-emerald-700 cursor-default'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm hover:scale-105'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>مفعل على البوابة</span>
                          </>
                        ) : (
                          <>
                            <Wallpaper className="w-3.5 h-3.5" />
                            <span>تطبيق هذه الخلفية</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 2: HERO SHOWCASE CARD PHOTO & METRICS ── */}
      {activeTab === 'showcase-card' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>لوحة الموقف التنفيذي الميداني المعروضة بالواجهة</span>
              </h4>
              <p className="text-xs text-slate-500">
                تحكم في الصورة والوسم والعنوان ونسبة الإنجاز الظاهرة في البطاقة البارزة أعلى الصفحة
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveSidebarItem('executive-projects')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 self-start"
            >
              <Edit2 className="w-4 h-4" />
              <span>تعديل كافة بيانات البطاقة في المشروعات</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Live Preview Card */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold text-slate-600 block">المعاينة الحية للبطاقة:</span>
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 bg-[#070b14] shadow-xl text-start">
                <div className="h-48 relative overflow-hidden bg-black">
                  <img
                    src={resolveAsset(heroCard.image || './road-paving-official.jpg')}
                    alt="Hero Showcase Card"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = resolveAsset('./road-paving-official.jpg');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 start-3.5 end-3.5 text-white">
                    <span className="text-[10px] font-bold text-amber-400 block mb-0.5">
                      {heroCard.tag || 'الموقف التنفيذي الميداني المعتمد'}
                    </span>
                    <h4 className="text-sm font-black text-white leading-snug">
                      {heroCard.title || 'أعمال رصف وتأهيل مسار 360 كم'}
                    </h4>
                  </div>
                </div>

                <div className="p-4 space-y-3 bg-[#0c1222] text-white">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">نسبة الإنجاز الإجمالي:</span>
                    <span className="font-mono font-black text-amber-400 text-sm">{heroCard.progress ?? 68.5}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${heroCard.progress ?? 68.5}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">المسافة:</span>
                      <span className="font-bold">{heroCard.distance || '360 كم'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">الإشراف:</span>
                      <span className="font-bold">{heroCard.supervisor || 'مشروعات المواصلات'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls & Fast Photo Change */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-start">
                <h5 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                  <ImagePlus className="w-4 h-4 text-amber-500" />
                  <span>تغيير صورة البطاقة بدقة عالية فوراً:</span>
                </h5>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  يمكنك اختيار أي صورة ميدانية من جهازك لتصبح هي الصورة الرئيسية المعروضة داخل بطاقة الموقف التنفيذي بالواجهة.
                </p>

                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => cardFileInputRef.current?.click()}
                    disabled={isCardUploading}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isCardUploading ? 'جاري المعالجة...' : 'رفع صورة جديدة للبطاقة'}</span>
                  </button>
                  
                  <input
                    type="file"
                    ref={cardFileInputRef}
                    accept="image/*"
                    onChange={handleUploadCardPhoto}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Presets Quick Pick for Card */}
              <div className="space-y-2 text-start">
                <span className="text-xs font-bold text-slate-700 block">أو اختر صورة جاهزة للبطاقة:</span>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { name: 'فاردة الأسفلت', src: './road-paving-official.jpg' },
                    { name: 'المسار من الجو', src: './road-aerial-highway.jpg' },
                    { name: 'الجريدر والتسوية', src: './road-grader-earthwork.jpg' },
                    { name: 'مداحل الدمك', src: './road-rollers-compaction.jpg' },
                    { name: 'فحوصات الجودة', src: './road-qa-testing-core.jpg' },
                    { name: 'الطريق الصحراوي', src: './hero-desert-road.jpg' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const updated = { ...heroCard, image: item.src };
                        setHeroCard(updated);
                        saveHeroCard(updated);
                        showToast(`تم تعيين صورة "${item.name}" لبطاقة الواجهة`);
                      }}
                      className="p-1.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white text-center cursor-pointer transition-all hover:scale-102 group"
                    >
                      <div className="h-16 rounded-lg overflow-hidden bg-slate-100 mb-1">
                        <img src={resolveAsset(item.src)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 block truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

