import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Flame, Zap, Award, Radio, MapPin, CheckCircle2 } from 'lucide-react';
import { getSavedSelectedWorkItems } from '../services/api';

const cleanTickerText = (val) => typeof val === 'string' ? val.replace(/[✦★✨⭐*•]/g, '').trim() : (val || '');

function MarqueeTicker({ 
  items = [], 
  speed = 'normal', 
  theme = 'dark', 
  variant = 'hero', // 'hero' | 'selected-work'
  direction = 'rtl',
  lang = 'ar'
}) {
  const defaultHeroItems = [
    { text: 'دخول اعمال الرصف طريق اوباري-غات الي بلدية العوينات.', textEn: 'Asphalt Paving Operations on Ubari - Ghat Corridor Enter Al-Awaynat Municipality', tag: 'بيان معتمد', tagEn: 'Official Update' },
    { text: 'في إطار المتابعة الميدانية: نسبة الإنجاز الإجمالية تبلغ 68.5% ووصول أعمال الرصف إلى مشارف العوينات', textEn: 'Field Inspection: 68.5% overall progress with pavement reaching Al-Awaynat outskirts', tag: 'متابعة ميدانية', tagEn: 'Field Progress' },
    { text: 'مشروع صيانة ورصف وتوسعة طريق أوباري – غات الاستراتيجي بطول 360 كم تحت إشراف جهاز تنفيذ المشروعات', textEn: 'Strategic 360km Ubari - Ghat Highway Rehabilitation under Transportation Projects Authority', tag: 'مشروع وطني', tagEn: 'National Project' },
    { text: 'توريد وتركيب الشواخص المرورية واللوحات الإرشادية والسياج الواقي', textEn: 'Supplying and installing traffic safety signs, guideboards and guardrails', tag: 'السلامة المرورية', tagEn: 'Road Safety' },
    { text: 'فحص جودة خلطات الأسفلت والدمك عبر المعامل الجيوتقنية المعتمدة', textEn: 'Testing asphalt mix quality and compaction density at certified labs', tag: 'ضبط الجودة', tagEn: 'Quality Control' },
    { text: 'إشراف هندسي ميداني متواصل ومتابعة مستمرة لكافة مراحل الرصف الميداني', textEn: 'Continuous on-site engineering supervision across all paving stages', tag: 'الإشراف الهندسي', tagEn: 'Site Supervision' }
  ];

  const [dynamicSelectedWorkItems, setDynamicSelectedWorkItems] = useState(() => getSavedSelectedWorkItems());

  useEffect(() => {
    if (variant !== 'selected-work') return;
    const handleUpdate = () => {
      setDynamicSelectedWorkItems(getSavedSelectedWorkItems());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('cloud_road_sectors_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('cloud_road_sectors_updated', handleUpdate);
    };
  }, [variant]);

  const candidateItems = items && items.length > 0 
    ? items 
    : (variant === 'hero' ? defaultHeroItems : dynamicSelectedWorkItems);

  const safeItems = candidateItems && candidateItems.length > 0 ? candidateItems : defaultHeroItems;

  // Filter active items if specified
  const validItems = safeItems.filter(item => item && (item.text || item.title) && item.active !== false);
  const pool = validItems.length > 0 ? validItems : safeItems;

  // Ensure base list has enough items for widescreen displays (minimum 12 items, safe from infinite loops)
  let baseList = [...pool];
  while (baseList.length < 12 && pool.length > 0) {
    baseList = [...baseList, ...pool];
  }

  // Calculate speed: calm, comfortable reading velocity with continuous 0s delay
  const getDuration = () => {
    if (typeof speed === 'number') return `${speed}s`;
    if (speed === 'fast') return '50s';
    if (speed === 'slow') return '100s';
    return '75s'; // Calm, comfortable, slower tempo as requested by user
  };
  const animDuration = getDuration();

  // ── Variant 1: Selected Work Grid Marquee (Seamless Dual-Track with Alpha Faded Edges) ──
  if (variant === 'selected-work') {
    return (
      <div 
        className="w-full overflow-hidden py-3 select-none relative marquee-container group"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)'
        }}
      >
        <div className="flex w-full overflow-hidden select-none" dir="ltr">
          {/* Track 1 */}
          <div 
            className="flex shrink-0 animate-marquee items-center gap-4 sm:gap-6 pe-4 sm:pe-6 py-2 will-change-transform"
            style={{ animationDuration: animDuration }}
          >
            {baseList.map((item, idx) => (
              <div
                key={`work1-${idx}`}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                className={`flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl border shadow-md transition-transform duration-200 hover:scale-[1.02] flex-shrink-0 ${
                  theme === 'light'
                    ? 'bg-white border-amber-300/80 text-slate-900 shadow-slate-200/50'
                    : 'bg-[#0b101e] border-amber-500/25 text-white shadow-black/60'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-start min-w-0">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <span className="text-xs sm:text-sm font-black whitespace-nowrap">{lang === 'ar' ? item.title : (item.titleEn || item.title)}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shrink-0 whitespace-nowrap shadow-sm">
                      {lang === 'ar' ? item.stat : (item.statEn || item.stat)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap mt-0.5">{lang === 'ar' ? item.badge : (item.badgeEn || item.badge)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Track 2 (Clone for infinite seamless loop) */}
          <div 
            aria-hidden="true"
            className="flex shrink-0 animate-marquee items-center gap-4 sm:gap-6 pe-4 sm:pe-6 py-2 will-change-transform"
            style={{ animationDuration: animDuration }}
          >
            {baseList.map((item, idx) => (
              <div
                key={`work2-${idx}`}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                className={`flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl border shadow-md transition-transform duration-200 hover:scale-[1.02] flex-shrink-0 ${
                  theme === 'light'
                    ? 'bg-white border-amber-300/80 text-slate-900 shadow-slate-200/50'
                    : 'bg-[#0b101e] border-amber-500/25 text-white shadow-black/60'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-start min-w-0">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <span className="text-xs sm:text-sm font-black whitespace-nowrap">{lang === 'ar' ? item.title : (item.titleEn || item.title)}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shrink-0 whitespace-nowrap shadow-sm">
                      {lang === 'ar' ? item.stat : (item.statEn || item.stat)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap mt-0.5">{lang === 'ar' ? item.badge : (item.badgeEn || item.badge)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Variant 2: Hero Ticker (State-of-the-Art Translucent Glassmorphic Ribbon) ──
  const isRtl = direction === 'rtl' || lang === 'ar';

  return (
    <div 
      className={`w-full overflow-hidden py-2 sm:py-2.5 px-3 sm:px-6 relative select-none z-30 transition-all duration-500 border-y backdrop-blur-xl ${
        theme === 'light'
          ? 'bg-white/40 border-amber-500/20 shadow-[0_4px_24px_rgba(245,158,11,0.06)]'
          : 'bg-[#060a16]/45 border-amber-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.35)]'
      }`}
    >
      {/* Top and Bottom Subtle Shimmer Rim Highlights */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4 relative">
        
        {/* ── Fixed Live Broadcast Badge (Refined Frosted Glass Pill) ── */}
        <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black text-[10px] sm:text-xs shadow-md shadow-amber-500/25 z-20 border border-amber-300/40 transition-transform duration-200 hover:scale-[1.02]">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-sm"></span>
          </span>
          <span className="tracking-wide whitespace-nowrap">
            <span className="inline sm:hidden">{lang === 'ar' ? 'المستجدات' : 'Updates'}</span>
            <span className="hidden sm:inline">{lang === 'ar' ? 'المستجدات الميدانية' : 'Field Updates'}</span>
          </span>
        </div>

        {/* ── Marquee Track ── */}
        <div className="relative flex-1 overflow-hidden marquee-container group">
          {/* Continuous Moving Track: Smooth pause on hover */}
          <div className="flex w-full overflow-hidden select-none group-hover:[&>div]:[animation-play-state:paused]" dir="ltr">
            {/* Primary Track 1 */}
            <div 
              className="flex shrink-0 animate-marquee items-center gap-3.5 sm:gap-5 pe-3.5 sm:pe-5 py-0.5 will-change-transform"
              style={{ animationDuration: animDuration }}
            >
              {baseList.map((item, idx) => (
                <div key={`track1-${idx}`} dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap text-xs sm:text-sm font-bold">
                  {/* News Tag Micro-Pill */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wide border transition-all ${
                    theme === 'light'
                      ? 'bg-amber-500/10 text-amber-950 border-amber-500/25 shadow-sm'
                      : 'bg-amber-400/10 text-amber-300 border-amber-400/25 shadow-sm backdrop-blur-sm'
                  }`}>
                    {cleanTickerText(lang === 'ar' ? item.tag : (item.tagEn || item.tag)) || (lang === 'ar' ? 'متابعة دورية' : 'Field Update')}
                  </span>

                  {/* News Headline - High Clarity & Sharp Legibility */}
                  <span className={`tracking-normal transition-colors cursor-pointer select-text ${
                    theme === 'light' 
                      ? 'text-slate-900 hover:text-amber-600' 
                      : 'text-slate-100 hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                  }`}>
                    {cleanTickerText(lang === 'ar' ? item.text : (item.textEn || item.text))}
                  </span>
                </div>
              ))}
            </div>

            {/* Seamless Sibling Track 2 (Cloned for 100% infinite loop with zero delay) */}
            <div 
              aria-hidden="true"
              className="flex shrink-0 animate-marquee items-center gap-3.5 sm:gap-5 pe-3.5 sm:pe-5 py-0.5 will-change-transform"
              style={{ animationDuration: animDuration }}
            >
              {baseList.map((item, idx) => (
                <div key={`track2-${idx}`} dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap text-xs sm:text-sm font-bold">
                  {/* News Tag Micro-Pill */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wide border transition-all ${
                    theme === 'light'
                      ? 'bg-amber-500/10 text-amber-950 border-amber-500/25 shadow-sm'
                      : 'bg-amber-400/10 text-amber-300 border-amber-400/25 shadow-sm backdrop-blur-sm'
                  }`}>
                    {cleanTickerText(lang === 'ar' ? item.tag : (item.tagEn || item.tag)) || (lang === 'ar' ? 'متابعة دورية' : 'Field Update')}
                  </span>

                  {/* News Headline - High Clarity & Sharp Legibility */}
                  <span className={`tracking-normal transition-colors cursor-pointer select-text ${
                    theme === 'light' 
                      ? 'text-slate-900 hover:text-amber-600' 
                      : 'text-slate-100 hover:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                  }`}>
                    {cleanTickerText(lang === 'ar' ? item.text : (item.textEn || item.text))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
function areTickerPropsEqual(prevProps, nextProps) {
  if (prevProps.theme !== nextProps.theme) return false;
  if (prevProps.lang !== nextProps.lang) return false;
  if (prevProps.variant !== nextProps.variant) return false;
  if (prevProps.speed !== nextProps.speed) return false;
  if (prevProps.direction !== nextProps.direction) return false;
  const pItems = prevProps.items || [];
  const nItems = nextProps.items || [];
  if (pItems.length !== nItems.length) return false;
  for (let i = 0; i < pItems.length; i++) {
    if (pItems[i]?.id !== nItems[i]?.id ||
        pItems[i]?.text !== nItems[i]?.text ||
        pItems[i]?.textEn !== nItems[i]?.textEn ||
        pItems[i]?.tag !== nItems[i]?.tag ||
        pItems[i]?.active !== nItems[i]?.active) {
      return false;
    }
  }
  return true;
}

export default React.memo(MarqueeTicker, areTickerPropsEqual);
