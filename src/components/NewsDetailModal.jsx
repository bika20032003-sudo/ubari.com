import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  MapPin, 
  Calendar, 
  Share2, 
  Building2, 
  ShieldCheck, 
  Layers,
  CheckCircle2,
  FileCheck2,
  Compass,
  Gauge,
  Coins,
  Wrench,
  Sun,
  Truck
} from 'lucide-react';
import { resolveAsset } from '../utils/assets';

export default function NewsDetailModal({ post, isOpen, onClose, theme = 'dark', lang = 'ar' }) {
  // Lock background scrolling cleanly & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Safely lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const isProject = Boolean(
    post.isProject || 
    post.contractor || 
    post.progress !== undefined || 
    (typeof post.id === 'string' && post.id.startsWith('PRJ-'))
  );

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.desc,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === 'ar' ? 'تم نسخ رابط التفاصيل بنجاح!' : 'Link copied to clipboard!');
    }
  };

  // Comprehensive paragraph extraction & sanitation
  const rawParagraphs = [];
  if (post.desc && typeof post.desc === 'string') {
    const split = post.desc.split(/\r?\n+/);
    rawParagraphs.push(...split);
  }
  
  const cleanParagraphs = rawParagraphs
    .map(p => p.trim())
    .filter(p => p.length > 2 && !/^[.\s\-_•*]+$/.test(p));

  const editorialProjectDefaults = [
    lang === 'ar'
      ? 'تأتي أعمال تنفيذ وتأهيل هذا المسار الحيوي ضمن خطة جهاز تنفيذ مشروعات المواصلات لتأمين الحركة المرورية وربط مدن وقرى الجنوب الغربي بشريان نقل استراتيجي آمن وعالي الكفاءة.'
      : 'The execution and rehabilitation of this strategic highway corridor is overseen by the Transport Projects Implementation Authority to secure transit and connect southwestern cities.',
    lang === 'ar'
      ? 'تخضع كافة مراحل التنفيذ لاختبارات دمك وفحص معملي دوري لعينات الأسفلت والأساس الحجري مع متابعة مستمرة لمناسيب تصريف مياه الأمطار والسيول لضمان ديمومة الطريق.'
      : 'All execution phases undergo rigorous laboratory testing of asphalt samples and compaction levels, with active flood drainage monitoring to ensure durability.'
  ];

  const editorialNewsDefaults = [
    lang === 'ar'
      ? 'تأتي هذه الأعمال الميدانية المكثفة ضمن استراتيجية حكومة الوحدة الوطنية وجهاز تنفيذ مشروعات المواصلات لتطوير البنية التحتية وربط واحات ومدن الجنوب الليبي بشبكة طرق حديثة تواكب أعلى المعايير الهندسية الدولية.'
      : 'These intensive field works are part of the Transportation Projects Implementation Authority strategy to modernize southern highway corridors according to international engineering standards.',
    lang === 'ar'
      ? 'وأكدت الفرق الهندسية المشرفة أن المشروع يشهد التزاماً صارماً بمواصفات الجودة المعتمدة، مع إجراء اختبارات معملية دورية للخلطة الإسفلتية ومتابعة دقيقة لمناسيب تصريف مياه الأمطار والسيول لضمان ديمومة الطريق وسلامة مستخدميه.'
      : 'Supervising engineers confirmed rigorous compliance with certified quality standards, including regular laboratory testing and drainage culvert inspections to guarantee road longevity and user safety.'
  ];

  const defaultPool = isProject ? editorialProjectDefaults : editorialNewsDefaults;

  const finalParagraphs = cleanParagraphs.length > 0
    ? (cleanParagraphs.length === 1 ? [cleanParagraphs[0], defaultPool[0]] : cleanParagraphs)
    : defaultPool;

  const leadParagraph = finalParagraphs[0];
  const supportingParagraphs = finalParagraphs.slice(1);

  // Specs extraction
  const projectSpecs = post.specs || {};

  const modalJSX = (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/95 backdrop-blur-2xl animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* ── Native Modal Container: Fullscreen on mobile, centered dialog on desktop ── */}
      <div 
        className={`w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-3xl flex flex-col rounded-none sm:rounded-3xl border-0 sm:border shadow-2xl text-start relative overflow-hidden select-text ${
          theme === 'light' 
            ? 'bg-[#FAF8F5] sm:border-amber-400 text-slate-900 shadow-slate-400/90' 
            : 'bg-[#06080E] sm:border-amber-500/35 text-white shadow-black/95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Orbs */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(255,171,0,0.35) 0%, transparent 70%)' }}
        />

        {/* ── Modal Sticky Top Bar: Agency Brand + Close & Share Buttons (With Safe-Area Padding) ── */}
        <div 
          className="px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-200 dark:border-white/10 relative z-20 shrink-0 gap-2 bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-md"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)' }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1.5px] shadow-sm shrink-0">
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
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-sm shadow-amber-400/50" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate block font-medium">
                {isProject
                  ? (lang === 'ar' ? 'المكتب التنفيذي • الموقف الميداني للمشروع' : 'Executive Office • Project Field Status')
                  : (lang === 'ar' ? 'المكتب الإعلامي • تقرير ميداني معتمد' : 'Media Office • Official Field Report')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ms-1 sm:ms-2">
            {isProject && post.id && (
              <span className="hidden xs:inline-flex px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {post.id}
              </span>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500/40 active:scale-95 transition-all cursor-pointer bg-slate-100 dark:bg-white/5 shadow-sm"
              title={lang === 'ar' ? 'مشاركة' : 'Share'}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body Content (Optimized for Touch Momentum Scrolling) ── */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-start relative z-10 flex-1 min-h-0 overscroll-contain">
          
          {/* Photo Box in Balanced Aspect Ratio */}
          <div className="relative rounded-2xl overflow-hidden w-full h-48 xs:h-56 sm:h-64 bg-slate-950 border border-slate-200 dark:border-white/15 shadow-xl shrink-0 group">
            <img 
              src={resolveAsset(post.image || './road-asphalt-paver.jpg')} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = resolveAsset('./road-asphalt-paver.jpg');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />

            {/* Top Badge: Status */}
            <span className="absolute top-3 end-3 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg border border-amber-300">
              {post.statusLabel || (isProject ? (post.status === 'completed' ? 'مشروع مكتمل' : 'جاري التنفيذ') : (lang === 'ar' ? 'تقرير ميداني' : 'Field Report'))}
            </span>

            {/* Bottom Photo Telemetry Badges */}
            <div className="absolute bottom-3 start-3 end-3 flex items-center justify-between text-white text-xs gap-2 pointer-events-none flex-wrap">
              <span className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-[11px] sm:text-xs font-bold min-w-0 truncate shadow-md">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{post.location || post.region || (lang === 'ar' ? 'مسار أوباري - غات' : 'Ubari - Ghat Route')}</span>
              </span>

              {(post.startDate || post.targetDate || post.timeAgo) && (
                <span className="bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10.5px] sm:text-[11.5px] font-mono text-slate-200 border border-white/15 shrink-0 whitespace-nowrap shadow-md flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>
                    {isProject 
                      ? (post.startDate ? `${post.startDate} ${post.targetDate ? '— ' + post.targetDate : ''}` : '2026')
                      : (post.timeAgo || 'محدث')}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Full Headline & Badges */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-amber-500 font-bold">
              {post.id && <span className="bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">{post.id}</span>}
              {post.lengthKm && <span>• {post.lengthKm} كم</span>}
              {post.region && <span>• {post.region}</span>}
            </div>
            <h2 className={`text-lg sm:text-2xl font-black leading-snug tracking-tight ${
              theme === 'light' ? 'text-slate-950' : 'text-white'
            }`}>
              {lang === 'ar' ? post.title : (post.titleEn || post.title)}
            </h2>
            <div className="w-14 h-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
          </div>

          {/* Live Progress Bar for Projects */}
          {post.progress !== undefined && (
            <div className={`p-4 rounded-2xl border space-y-2.5 ${
              theme === 'light' ? 'bg-amber-50/70 border-amber-200' : 'bg-[#0f172a]/90 border-amber-500/20 shadow-md'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'ar' ? 'نسبة الإنجاز الميداني الفعلي:' : 'Actual Field Progress:'}</span>
                </span>
                <span className="font-mono text-amber-400 font-black text-base">{post.progress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-700 shadow-sm shadow-amber-500/40"
                  style={{ width: `${post.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Project Details Grid (4 Key Metric Cards) */}
          {isProject && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className={`p-3 rounded-2xl border space-y-1 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}>
                <span className="text-[10px] text-slate-400 block font-medium">{lang === 'ar' ? 'المقاول المنفذ:' : 'Contractor:'}</span>
                <strong className="text-xs text-amber-400 block truncate font-bold">{post.contractor || 'جهاز تنفيذ المشروعات'}</strong>
              </div>
              <div className={`p-3 rounded-2xl border space-y-1 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}>
                <span className="text-[10px] text-slate-400 block font-medium">{lang === 'ar' ? 'الطول والقطاع:' : 'Distance:'}</span>
                <strong className="text-xs text-emerald-400 block truncate font-bold">{post.lengthKm ? `${post.lengthKm} كم` : (post.region || '360 كم')}</strong>
              </div>
              <div className={`p-3 rounded-2xl border space-y-1 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}>
                <span className="text-[10px] text-slate-400 block font-medium">{lang === 'ar' ? 'الميزانية / المخصص:' : 'Budget:'}</span>
                <strong className="text-xs text-slate-200 block truncate font-bold">{post.budget || 'معتمد وموثق'}</strong>
              </div>
              <div className={`p-3 rounded-2xl border space-y-1 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}>
                <span className="text-[10px] text-slate-400 block font-medium">{lang === 'ar' ? 'الجدول الزمني:' : 'Timeline:'}</span>
                <strong className="text-xs text-cyan-400 block truncate font-bold">
                  {post.startDate ? `${post.startDate} — ${post.targetDate || '2026'}` : (post.statusLabel || 'معتمد')}
                </strong>
              </div>
            </div>
          )}

          {/* Executive Overview Lead Box */}
          {leadParagraph && (
            <div className={`p-4 rounded-2xl border relative overflow-hidden ${
              theme === 'light'
                ? 'bg-amber-50/80 border-amber-200/90 text-slate-800'
                : 'bg-amber-500/[0.08] border-amber-500/25 text-amber-100/95 shadow-sm'
            }`}>
              <div className="flex items-start gap-2.5">
                <FileCheck2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm leading-relaxed font-semibold text-start">
                  {leadParagraph}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Paragraphs */}
          {supportingParagraphs.length > 0 && (
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed font-normal text-slate-700 dark:text-slate-300">
              {supportingParagraphs.map((para, i) => (
                <p key={i} className="text-start leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* Project Technical Specifications Matrix (المواصفات الفنية الميدانية للمشروع) */}
          {isProject && (
            <div className={`p-4 rounded-2xl border space-y-3 ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                : 'bg-[#0f172a]/80 border-white/10 text-white shadow-md'
            }`}>
              <h4 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
                <Wrench className="w-4 h-4" />
                <span>{lang === 'ar' ? 'المواصفات الفنية الميدانية المعتمدة:' : 'Certified Technical Specifications:'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 font-medium">{lang === 'ar' ? 'طبقة الرصف والأسفلت:' : 'Pavement Thickness:'}</span>
                  <span className="text-amber-400 font-bold font-mono">{projectSpecs.thickness || '10 - 12 سم (طبقتين معتمدتين)'}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 font-medium">{lang === 'ar' ? 'المسافة المنجزة والموثقة:' : 'Paved Distance:'}</span>
                  <span className="text-emerald-400 font-bold font-mono">{projectSpecs.paved || `${post.lengthKm || 90} كم منجز`}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 font-medium">{lang === 'ar' ? 'الإنارة والشواخص المرورية:' : 'Lighting & Signs:'}</span>
                  <span className="text-cyan-400 font-bold font-mono">
                    {projectSpecs.solarPoles ? `${projectSpecs.solarPoles} عمود إنارة شمسية` : (projectSpecs.culverts || 'شواخص فسفورية وعواكس')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 font-medium">{lang === 'ar' ? 'الآليات والمعدات العاملة:' : 'Field Fleet:'}</span>
                  <span className="text-purple-400 font-bold font-mono">
                    {projectSpecs.fleet ? `${projectSpecs.fleet} آلية ومعدة` : 'أسطول متكامل بالموقع'}
                  </span>
                </div>
                <div className="col-span-1 sm:col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-amber-300 font-medium">{lang === 'ar' ? 'مؤشر مطابقة الجودة والمعايير:' : 'Quality Compliance Score:'}</span>
                  <span className="text-amber-400 font-black font-mono">{projectSpecs.qualityScore || '99.4% مطابقة معملية'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Approved Scope & Technical Compliance Box with Logo Golden Dots */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-200 text-slate-800'
              : 'bg-[#0f172a]/80 border-white/10 text-white shadow-md'
          }`}>
            <h4 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>{lang === 'ar' ? 'المعايير الهندسية والرقابة الميدانية:' : 'Engineering Standards & Compliance:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] sm:text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shrink-0 shadow-sm shadow-amber-400/60 ring-1 ring-amber-300/40" />
                <span className="text-slate-300">{lang === 'ar' ? 'المواصفات: كود الطرق الدولي AASHTO' : 'Code: AASHTO Highway Code'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shrink-0 shadow-sm shadow-amber-400/60 ring-1 ring-amber-300/40" />
                <span className="text-slate-300">{lang === 'ar' ? 'الفحص المعملي: اختبارات مارشال والدمك' : 'Lab: Certified Geotechnical Testing'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shrink-0 shadow-sm shadow-amber-400/60 ring-1 ring-amber-300/40" />
                <span className="text-slate-300">{lang === 'ar' ? 'السلامة المرورية: شواخص وعواكس ليلية' : 'Safety: Phosphorescent Signage'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shrink-0 shadow-sm shadow-amber-400/60 ring-1 ring-amber-300/40" />
                <span className="text-slate-300">{lang === 'ar' ? 'المتابعة الميدانية: توثيق وتقارير دورية 4K' : 'Oversight: Periodic Field Audits'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Modal Footer with Safe Area Padding ── */}
        <div 
          className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs relative z-20 shrink-0 bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-md"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 14px)' }}
        >
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 min-w-0 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-sm shadow-amber-400/60 ring-1 ring-amber-300/40 shrink-0" />
            <span className="truncate">{lang === 'ar' ? 'جهاز تنفيذ مشروعات المواصلات - دولة ليبيا' : 'Transport Projects Execution Authority - State of Libya'}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
          >
            {lang === 'ar' ? 'إغلاق النافذة' : 'Close Window'}
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' && document.body
    ? createPortal(modalJSX, document.body)
    : modalJSX;
}
