import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ArrowUpRight, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  Activity, 
  Compass, 
  Layers, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Users, 
  Sun,
  Building2,
  Clock,
  Crown
} from 'lucide-react';
import { translations } from '../i18n/translations';
import MarqueeTicker from './MarqueeTicker';
import NewsDetailModal from './NewsDetailModal';
import { getSavedHeroCard, getSavedNewsPosts, getSavedHeroBackground, mergeNewsPostsResiliently } from '../services/api';
import { fetchCloudNews, fetchCloudHeroCard } from '../services/supabase';
import { safeStorageSet } from '../utils/imageCompressor';
import { resolveAsset } from '../utils/assets';

export default function Hero3D({ summaryData, setActiveTab, theme, user, onOpenGoogleAuth, lang = 'ar', tickerNews }) {
  const t = translations[lang] || translations.ar;
  const progressVal = summaryData?.overallProgress ?? 68.5;

  // Dynamic Hero 4K Background State (Controllable from Dashboard)
  const [heroBg, setHeroBg] = useState(getSavedHeroBackground);

  // Dynamic Hero Showcase Card State (Controllable from Dashboard - Preserved for Desktop)
  const [heroCard, setHeroCard] = useState(getSavedHeroCard);

  // Selected News / Project Modal State
  const [selectedNewsPost, setSelectedNewsPost] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchCloudHeroCard().then(card => {
      if (isMounted && card && typeof card === 'object') {
        setHeroCard(card);
        safeStorageSet('portal-hero-showcase-card', card);
      }
    }).catch(() => {});

    const handleStorageChange = () => {
      if (!isMounted) return;
      setHeroCard(getSavedHeroCard());
      setHeroBg(getSavedHeroBackground());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cloud_hero_updated', handleStorageChange);
    window.addEventListener('cloud_hero_bg_updated', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cloud_hero_updated', handleStorageChange);
      window.removeEventListener('cloud_hero_bg_updated', handleStorageChange);
    };
  }, []);

  // Stabilized Memoized Ticker Items to prevent animation restarts
  const activeTickerItems = useMemo(() => {
    return Array.isArray(tickerNews) ? tickerNews.filter(n => n && n.active !== false) : [];
  }, [tickerNews]);

  // Circular progress calculation for SVG
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressVal / 100) * circumference;

  return (
    <section 
      id="hero-section" 
      className="relative min-h-0 sm:min-h-[85vh] lg:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-grid-pattern select-none pt-16 sm:pt-22 pb-2 sm:pb-4"
    >
      
      {/* ── 4K Cinematic Background Road Photo (Direct GPU Hardware Texture & Dynamic Control) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <picture className="w-full h-full block">
          {/* Mobile Portrait 9:16 Ultra-Sharp Image */}
          <source 
            media="(max-width: 768px)" 
            srcSet={resolveAsset(heroBg.mobileImage || heroBg.image || './road-hero-mobile.jpg')} 
          />
          {/* Desktop & Tablet 2.5K/4K Panoramic Widescreen Image */}
          <source 
            media="(min-width: 769px)" 
            srcSet={resolveAsset(heroBg.image || './hero-desert-road.jpg')} 
          />
          <img 
            src={resolveAsset(heroBg.image || './hero-desert-road.jpg')} 
            alt="مشروع طريق أوباري - غات 4K" 
            fetchpriority="high"
            decoding="async"
            style={{
              filter: heroBg.filter || 'none',
              objectPosition: heroBg.objectPosition || 'center'
            }}
            className="w-full h-full object-cover object-center transition-all duration-700"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = resolveAsset('./road-paving-official.jpg');
            }}
          />
        </picture>

        {/* 3D Glowing Road Horizon Guide Trajectory */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="w-full h-full bg-gradient-to-t from-amber-500/10 via-transparent to-transparent" />
        </div>

        {/* Multi-Layer Gradient Overlays for High-Contrast Readability */}
        <div 
          style={{ opacity: (heroBg.overlayOpacity ?? 70) / 100 }}
          className={`hero-overlay-left absolute inset-0 transition-opacity duration-500 ${
            theme === 'light'
              ? 'bg-gradient-to-r from-[#F8FAFC]/85 via-[#F8FAFC]/50 to-transparent'
              : 'bg-gradient-to-r from-[#06080E]/95 via-[#06080E]/70 to-transparent'
          }`} 
        />
        {/* Mobile vertical contrast scrim to prevent text bleed over bright photos on phone */}
        <div 
          style={{ opacity: (heroBg.overlayOpacity ?? 70) / 100 }}
          className={`sm:hidden absolute inset-0 transition-opacity duration-500 ${
            theme === 'light'
              ? 'bg-gradient-to-b from-[#F8FAFC]/90 via-[#F8FAFC]/50 to-[#F8FAFC]/95'
              : 'bg-gradient-to-b from-[#06080E]/90 via-[#06080E]/50 to-[#06080E]/95'
          }`} 
        />
        <div className={`hero-overlay-top absolute inset-0 ${
          theme === 'light'
            ? 'bg-gradient-to-t from-[#F8FAFC] via-transparent to-[#F8FAFC]/25'
            : 'bg-gradient-to-t from-[#06080E] via-transparent to-[#06080E]/40'
        }`} />
        <div className={`absolute bottom-0 left-0 right-0 h-36 ${
          theme === 'light'
            ? 'bg-gradient-to-t from-[#F8FAFC] to-transparent'
            : 'bg-gradient-to-t from-[#06080E] to-transparent'
        }`} />
      </div>

      {/* ── Ambient Radial Glows (GPU-friendly zero-blur radial gradients) ── */}
      <div 
        className="absolute z-[1] rounded-full pointer-events-none opacity-60"
        style={{
          width: '420px', height: '420px',
          right: '5%', top: '10%',
          background: 'radial-gradient(circle, rgba(255,171,0,0.18) 0%, rgba(255,171,0,0.03) 50%, transparent 75%)',
        }}
      />
      <div 
        className="absolute z-[1] rounded-full pointer-events-none opacity-50"
        style={{
          width: '360px', height: '360px',
          left: '8%', bottom: '12%',
          background: 'radial-gradient(circle, rgba(0,245,212,0.12) 0%, transparent 70%)',
        }}
      />

      {/* ── Single Moving Live Marquee Ticker Directly Under Header ── */}
      <div className="w-full relative z-30 mb-2 sm:mb-4 select-none">
        <MarqueeTicker 
          variant="hero" 
          theme={theme} 
          lang={lang}
          direction={lang === 'ar' ? 'rtl' : 'ltr'} 
          items={activeTickerItems}
        />
      </div>

      {/* ── Main Hero Content ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full space-y-4 sm:space-y-8 my-auto py-2 sm:py-4">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 lg:gap-16">
          
          {/* ── Right Text Column: Clean Government Hierarchy ── */}
          <div className="w-full lg:w-7/12 space-y-4 sm:space-y-6 animate-fadeIn text-start gsap-header">
            
            {/* Official Kicker */}
            <div className="flex items-center gap-2 text-[11px] sm:text-sm font-bold text-amber-500">
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <span>{lang === 'ar' ? 'دولة ليبيا • جهاز تنفيذ مشروعات المواصلات' : 'State of Libya • Transportation Projects Authority'}</span>
            </div>

            {/* 4K Hero Title */}
            <div className="space-y-2 sm:space-y-4">
              <h1 
                style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', 'Almarai', sans-serif" }}
                className={`text-xl xs:text-2xl sm:text-5xl lg:text-6xl font-black leading-normal sm:leading-[1.3] ${
                  theme === 'light' ? 'text-slate-950' : 'text-white'
                }`}
              >
                <span className="block mb-0.5 sm:mb-2 text-slate-900 dark:text-white text-base xs:text-xl sm:text-4xl lg:text-5xl">{t.heroMainTitle1}</span>
                <span 
                  style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', 'Almarai', sans-serif" }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 px-1 pe-2 pt-3 pb-3 text-2xl xs:text-3xl sm:text-5xl lg:text-6xl overflow-visible font-black tracking-normal"
                >
                  {t.heroMainTitle2}
                </span>
                <span className="inline-block text-sm xs:text-base sm:text-3xl font-light text-slate-500 dark:text-white/85 ms-1.5 sm:ms-3">
                  (360 كم)
                </span>
              </h1>
              
              <p className={`text-xs xs:text-sm sm:text-lg lg:text-xl font-bold leading-relaxed ${
                theme === 'light' ? 'text-slate-800' : 'text-white'
              }`}>
                {t.heroSubtitle}
              </p>

              <p className={`text-[11px] xs:text-xs sm:text-sm lg:text-base max-w-xl leading-relaxed font-normal ${
                theme === 'light' ? 'text-slate-700' : 'text-white'
              }`}>
                {t.heroDesc}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-0.5 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              {/* Primary Action Button */}
              <button
                onClick={() => {
                  const el = document.getElementById('projects-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer text-center active:scale-98"
              >
                {lang === 'ar' ? 'استكشف المشاريع' : 'Explore Projects'}
              </button>
            </div>

          </div>

          {/* ── Left Column: News Post Card on Mobile / Desktop Showcase Card with GPU Hover ── */}
          <div 
            className="w-full lg:w-5/12 flex flex-col items-center lg:items-end animate-scaleUp gsap-scale-in"
          >
            
            
            <div 
              onClick={() => setSelectedNewsPost(heroCard)}
              className={`w-full max-w-md rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl text-start glass-card-hover cursor-pointer ${
              theme === 'light' 
                ? 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/80' 
                : 'bg-[#0b101e]/95 border-white/15 text-white shadow-black/80'
            }`}>
              
              {/* Photo with clean caption */}
              <div 
                className="h-44 xs:h-52 sm:h-64 relative overflow-hidden group cursor-pointer"
                data-cursor-image="true"
                data-cursor-label={lang === 'ar' ? 'معاينة 4K ↗' : 'View 4K ↗'}
              >
                <img 
                  src={resolveAsset(heroCard.image || "./road-paving-official.jpg")} 
                  alt={heroCard.title || "أعمال رصف وتأهيل طريق أوباري غات"} 
                  className="w-full h-full object-cover photo-hover-zoom group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = resolveAsset('./road-paving-official.jpg');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                
                <div className="absolute bottom-3 sm:bottom-4 start-3.5 sm:start-5 end-3.5 sm:end-5 text-white">
                  <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 block mb-0.5 sm:mb-1">
                    {lang === 'ar' ? (heroCard.tag || 'الموقف التنفيذي الميداني المعتمد') : (heroCard.tagEn || heroCard.tag || 'Field Operations Status')}
                  </span>
                  <h3 className="text-sm sm:text-lg font-black leading-snug">
                    {lang === 'ar' ? (heroCard.title || 'أعمال رصف وتأهيل مسار 360 كم') : (heroCard.titleEn || heroCard.title || '360km Highway Paving Operations')}
                  </h3>
                </div>
              </div>

              {/* Clean metrics content */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>
                      {lang === 'ar' ? 'نسبة الإنجاز الإجمالي الفعلي:' : 'Overall Progress:'}
                    </span>
                    <span className="font-mono text-sm sm:text-base font-black text-amber-500">
                      {heroCard.progress ?? progressVal}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${heroCard.progress ?? progressVal}%` }} 
                    />
                  </div>
                </div>

                {/* 4 Clean Key Data Items */}
                <div className={`grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t text-[11px] sm:text-xs ${
                  theme === 'light' ? 'border-slate-100' : 'border-white/10'
                }`}>
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {lang === 'ar' ? 'المسافة الإجمالية:' : 'Total Distance:'}
                    </span>
                    <strong className="font-bold text-slate-800 dark:text-slate-100">
                      {lang === 'ar' ? (heroCard.distance || '360 كيلومتراً') : (heroCard.distanceEn || heroCard.distance || '360 km')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {lang === 'ar' ? 'الجهة المشرفة:' : 'Supervising Agency:'}
                    </span>
                    <strong className="font-bold text-slate-800 dark:text-slate-100 truncate block">
                      {lang === 'ar' ? (heroCard.supervisor || 'مشروعات المواصلات') : (heroCard.supervisorEn || heroCard.supervisor || 'Transport Projects')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {lang === 'ar' ? 'معايير الرصف والسلامة:' : 'Paving & Safety Code:'}
                    </span>
                    <strong className="font-bold text-slate-800 dark:text-slate-100">
                      {lang === 'ar' ? 'كود الطرق الدولي AASHTO' : 'AASHTO Highway Standard'}
                    </strong>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ── Full News Post Modal (يظهر الخبر بالكامل عند النقر) ── */}
      <NewsDetailModal 
        post={selectedNewsPost}
        isOpen={Boolean(selectedNewsPost)}
        onClose={() => setSelectedNewsPost(null)}
        theme={theme}
        lang={lang}
      />

    </section>
  );
}
