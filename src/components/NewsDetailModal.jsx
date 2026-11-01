import React, { useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Share2, 
  Building2, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { resolveAsset } from '../utils/assets';

export default function NewsDetailModal({ post, isOpen, onClose, theme = 'dark', lang = 'ar' }) {
  // Close on Escape key press & prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.desc,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignored or cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === 'ar' ? 'تم نسخ رابط الخبر بنجاح!' : 'Link copied to clipboard!');
    }
  };

  // Clean description and provide comprehensive editorial paragraphs without stray dots
  const cleanedDesc = (post.desc && typeof post.desc === 'string' && post.desc.trim() && post.desc.trim() !== '.' && post.desc.trim() !== '..') 
    ? post.desc.trim() 
    : null;

  const defaultParagraphs = [
    lang === 'ar'
      ? 'تأتي هذه الأعمال الميدانية المكثفة ضمن استراتيجية حكومة الوحدة الوطنية وجهاز تنفيذ مشروعات المواصلات لتطوير البنية التحتية وربط واحات ومدن الجنوب الليبي بشبكة طرق حديثة تواكب أعلى المعايير الهندسية الدولية.'
      : 'These intensive field works are part of the Transportation Projects Implementation Authority strategy to modernize southern highway corridors according to international engineering standards.',
    lang === 'ar'
      ? 'وأكدت الفرق الهندسية المشرفة أن المشروع يشهد التزاماً صارماً بمواصفات الجودة المعتمدة، مع إجراء اختبارات معملية دورية للخلطة الإسفلتية ومتابعة دقيقة لمناسيب تصريف مياه الأمطار والسيول لضمان ديمومة الطريق وسلامة مستخدميه.'
      : 'Supervising engineers confirmed rigorous compliance with certified quality standards, including regular laboratory testing and drainage culvert inspections to guarantee road longevity and user safety.'
  ];

  const paragraphsToRender = cleanedDesc ? [cleanedDesc, ...defaultParagraphs] : defaultParagraphs;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`w-full sm:max-w-2xl h-[92dvh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-[26px] sm:rounded-3xl border border-b-0 sm:border-b shadow-2xl text-start relative overflow-hidden animate-slideUp sm:animate-scaleUp ${
          theme === 'light' 
            ? 'bg-white border-amber-300/80 text-slate-900 shadow-slate-300/90' 
            : 'bg-[#090e1a]/98 border-amber-500/35 text-white shadow-black/95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Orbs */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(255,171,0,0.3) 0%, transparent 70%)' }}
        />

        {/* ── Native Pull/Drag Indicator for Mobile Phones ── */}
        <div className="w-12 h-1 bg-slate-400/40 dark:bg-white/20 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* ── Modal Header: Agency Brand + Close & Share Buttons ── */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-slate-100 dark:border-white/10 relative z-10 shrink-0 gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1.5px] shadow-sm shrink-0">
              <img 
                src={resolveAsset('./logo-agency.jpg')} 
                alt="جهاز تنفيذ مشروعات المواصلات" 
                className="w-full h-full object-contain rounded-[10px] bg-white"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden text-start">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-black text-xs sm:text-sm text-amber-500 truncate block">
                  {lang === 'ar' ? 'جهاز تنفيذ مشروعات المواصلات' : 'Transport Projects Authority'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate block">
                {lang === 'ar' ? 'المكتب الإعلامي • تقرير ميداني معتمد' : 'Media Office • Official Field Report'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ms-1 sm:ms-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500/40 active:scale-90 transition-all cursor-pointer bg-slate-50 dark:bg-white/5"
              title={lang === 'ar' ? 'مشاركة الخبر' : 'Share Article'}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500/40 active:scale-90 transition-all cursor-pointer text-base font-bold bg-slate-50 dark:bg-white/5"
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Scrollable Body Content (Optimized for Touch Scrolling) ── */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-start relative z-10 flex-1 overscroll-contain">
          
          {/* Post Photo in Responsive Ratio across all Devices */}
          <div className="relative rounded-2xl overflow-hidden w-full aspect-[16/10] sm:aspect-[16/9] max-h-[300px] sm:max-h-[360px] bg-slate-950 border border-slate-200 dark:border-white/10 shadow-lg shrink-0">
            <img 
              src={resolveAsset(post.image || './road-asphalt-paver.jpg')} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = resolveAsset('./road-asphalt-paver.jpg');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* Bottom Photo Telemetry Badges */}
            <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-white text-xs gap-2 pointer-events-none">
              <span className="flex items-center gap-1.5 bg-black/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-xl border border-white/15 text-[10.5px] sm:text-[11.5px] font-bold min-w-0 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{post.location || (lang === 'ar' ? 'مسار أوباري - غات' : 'Ubari - Ghat Highway')}</span>
              </span>

              <span className="bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-mono text-slate-300 border border-white/10 shrink-0 whitespace-nowrap">
                {post.timeAgo || (lang === 'ar' ? 'اليوم' : 'Today')}
              </span>
            </div>
          </div>

          {/* Post Metadata Pills */}
          <div className="flex items-center justify-between text-xs flex-wrap gap-2 pt-1 border-b border-slate-100 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[10.5px] sm:text-[11.5px] font-medium flex-wrap">
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px] sm:max-w-none">{post.author || (lang === 'ar' ? 'قسم الإعلام والعلاقات' : 'Media Office')}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{post.timeAgo || (lang === 'ar' ? 'منذ يومين' : '2 days ago')}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-black shrink-0">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'ar' ? 'متابعة رسمية معتمدة' : 'Official Update'}</span>
            </div>
          </div>

          {/* Full Headline */}
          <h2 className={`text-base sm:text-xl md:text-2xl font-black leading-snug ${
            theme === 'light' ? 'text-slate-950' : 'text-white'
          }`}>
            {lang === 'ar' ? post.title : (post.titleEn || post.title)}
          </h2>

          {/* Detailed Paragraphs */}
          <div className="space-y-3 text-xs sm:text-sm leading-relaxed sm:leading-loose font-normal text-slate-700 dark:text-slate-300">
            {paragraphsToRender.map((para, i) => (
              <p key={i} className="text-justify leading-relaxed sm:leading-loose">
                {para}
              </p>
            ))}
          </div>

          {/* Technical Specifications Highlights Box */}
          <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-2.5 ${
            theme === 'light'
              ? 'bg-amber-50/70 border-amber-200 text-slate-800'
              : 'bg-amber-500/10 border-amber-500/25 text-white'
          }`}>
            <h4 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{lang === 'ar' ? 'المعايير الفنية والتقنية المرتبطة بالعمل:' : 'Technical Specifications:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] sm:text-[11.5px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{lang === 'ar' ? 'المواصفات: كود الطرق AASHTO' : 'Code: AASHTO Standards'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{lang === 'ar' ? 'الفحص: مختبر جيوتقني معتمد' : 'Lab: Geotechnical Lab'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                <span>{lang === 'ar' ? 'السلامة: شواخص وعواكس ليلية' : 'Safety: Night Traffic Reflectors'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                <span>{lang === 'ar' ? 'المتابعة: توثيق ميداني دوري' : 'Surveillance: Periodic Field Docs'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Modal Footer with Safe Area Padding ── */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs relative z-10 shrink-0 bg-slate-50/90 dark:bg-black/40 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)]">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 min-w-0 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate">{lang === 'ar' ? 'جهاز تنفيذ مشروعات المواصلات - دولة ليبيا' : 'Transport Projects Execution Authority - State of Libya'}</span>
          </span>
          <span className="text-[9.5px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0 ms-2">
            {lang === 'ar' ? 'بوابة المشروعات الرسمية' : 'Official Portal'}
          </span>
        </div>

      </div>
    </div>
  );
}
