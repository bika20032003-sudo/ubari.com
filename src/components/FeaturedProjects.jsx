import NewsDetailModal from './NewsDetailModal';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Building2, 
  Wrench, 
  FileText, 
  Info, 
  X,
  ImagePlus,
  UploadCloud,
  Eye,
  Camera,
  Loader2
} from 'lucide-react';
import { nationalProjects } from '../services/api';
import MarqueeTicker from './MarqueeTicker';
import { compressImageFile, safeStorageSet, safeStorageGet } from '../utils/imageCompressor';
import { resolveAsset } from '../utils/assets';
import { fetchCloudProjects, saveCloudProjects } from '../services/supabase';

const PROJECT_PRESET_IMAGES = [
  { title: 'آليات رصف الأسفلت الساخن ومتابعة درجات الحرارة', category: 'رصف الأسفلت', src: './road-paving-official.jpg' },
  { title: 'دمك الأسفلت بالمداحل الأسطوانية والمطاطية', category: 'الدمك وضبط المناسيب', src: './road-rollers-compaction.jpg' },
  { title: 'تسوية الأساس الحجري بالكاشطات الموتورية', category: 'كشط وتأسيس', src: './road-grader-earthwork.jpg' },
  { title: 'تركيب الشواخص المرورية وتخطيط مسارات الطريق', category: 'السلامة المرورية والإرشاد', src: './road-grader-earthwork.jpg' },
  { title: 'فحص عينات الكور الإسفلتي ومطابقة الجودة المعملية', category: 'ضبط الجودة المعملي', src: './road-qa-testing-core.jpg' },
  { title: 'مشهد جوي بانورامي لمسار الطريق الصحراوي (360 كم)', category: 'بانوراما جوية', src: './road-aerial-highway.jpg' }
];

export default function FeaturedProjects({ theme, lang = 'ar' }) {
  const [selectedModalProject, setSelectedModalProject] = useState(null);
  const [projectFilter, setProjectFilter] = useState('all'); // 'all' | 'field' | 'strategic'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadTab, setUploadTab] = useState('file'); // 'file' | 'presets' | 'url'
  
  const [newProjectPhoto, setNewProjectPhoto] = useState({
    title: '',
    region: 'القطاع الأول (أوباري - الفيوات)',
    image: '/road-paving-official.jpg',
    desc: '',
    contractor: '',
    targetProject: 'new'
  });

  const mergeProjectsResiliently = (incoming, existing = []) => {
    const deletedIds = new Set(safeStorageGet('portal-deleted-project-ids', ['PRJ-UBG-DUN-120', 'PRJ-GHT-ENT-045', 'PRJ-UBG-RST-004', 'PRJ-EXEC-1463']));
    const map = new Map();
    // 1. Defaults first (excluding deleted)
    nationalProjects.filter(p => !deletedIds.has(p.id)).forEach(p => map.set(p.id, p));
    // 2. Existing items in memory (excluding deleted)
    if (Array.isArray(existing)) {
      existing.filter(p => !deletedIds.has(p.id)).forEach(p => {
        if (p && p.id) map.set(p.id, { ...map.get(p.id), ...p });
      });
    }
    // 3. Incoming items override (excluding deleted)
    if (Array.isArray(incoming)) {
      incoming.filter(p => !deletedIds.has(p.id)).forEach(p => {
        if (p && p.id) map.set(p.id, { ...map.get(p.id), ...p });
      });
    }
    const result = Array.from(map.values()).filter(p => !deletedIds.has(p.id));
    return result.length > 0 ? result : nationalProjects.filter(p => !deletedIds.has(p.id));
  };

  const loadAllExecutiveProjects = () => {
    try {
      const savedCustom = safeStorageGet('portal-national-projects', null);
      if (savedCustom && Array.isArray(savedCustom) && savedCustom.length > 0) {
        return mergeProjectsResiliently(savedCustom, nationalProjects);
      }
    } catch (e) {}
    return nationalProjects;
  };

  const [projectsList, setProjectsList] = useState(loadAllExecutiveProjects);

  // Immediate Supabase sync on mount (works on mobile, tablet, desktop without localStorage dependency)
  useEffect(() => {
    let isMounted = true;

    // 1. Immediately fetch latest cloud projects from Supabase
    fetchCloudProjects().then((cloudData) => {
      if (isMounted && cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
        setProjectsList(prev => {
          const merged = mergeProjectsResiliently(cloudData, prev);
          safeStorageSet('portal-national-projects', merged);
          return merged;
        });
      }
    }).catch(err => {
      console.warn('[FeaturedProjects] تعذر الجلب المباشر من سوبابيس:', err);
    });

    // 2. Listen to real-time sync events across tabs & devices
    const handleStorageUpdate = (e) => {
      if (!isMounted) return;
      if (e?.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setProjectsList(prev => mergeProjectsResiliently(e.detail, prev));
      } else {
        const loaded = safeStorageGet('portal-national-projects', null);
        if (loaded && Array.isArray(loaded) && loaded.length > 0) {
          setProjectsList(prev => mergeProjectsResiliently(loaded, prev));
        }
      }
    };

    window.addEventListener('cloud_projects_updated', handleStorageUpdate);
    window.addEventListener('supabase_config_changed', handleStorageUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('cloud_projects_updated', handleStorageUpdate);
      window.removeEventListener('supabase_config_changed', handleStorageUpdate);
    };
  }, []);


  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageFile(file, 1600, 1100, 0.82);
      setNewProjectPhoto(prev => ({
        ...prev,
        image: compressedDataUrl,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    } catch (err) {
      alert(err.message || 'تعذر معالجة الصورة، يرجى اختيار ملف صورة آخر');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveProjectPhoto = (e) => {
    e.preventDefault();
    if (!newProjectPhoto.title.trim()) return;

    const finalImage = newProjectPhoto.image || '/road-paving-official.jpg';
    let currentProjects = loadAllExecutiveProjects();

    // 1. If user chose to create a new executive project card:
    if (newProjectPhoto.targetProject === 'new') {
      const newCustomProject = {
        id: `PRJ-EXEC-${Date.now().toString().slice(-4)}`,
        title: newProjectPhoto.title.trim(),
        titleEn: newProjectPhoto.title.trim(),
        region: newProjectPhoto.region || 'القطاع الأول (أوباري - الفيوات)',
        regionEn: newProjectPhoto.region || 'Ubari - Ghat Sector',
        lengthKm: 35,
        progress: 88,
        status: 'in_progress',
        statusLabel: 'توثيق تنفيذي ميداني 4K',
        statusLabelEn: 'Field Execution',
        statusColor: 'amber',
                contractor: newProjectPhoto.contractor?.trim() || 'م. الموقع الميداني',
                        image: finalImage,
        desc: newProjectPhoto.desc?.trim() || `توثيق تنفيذي ميداني عالي الدقة لأعمال الرصف والتطوير بمشروع طريق أوباري - غات.`,
        isFieldDoc: true,
        isCustomUploaded: true,
        specs: {
          thickness: '10-12 سم',
          paved: 'منجز وموثق',
          solarPoles: 'معتمد',
          fleet: 'آليات عاملة',
          qualityScore: '100% مطابقة'
        }
      };

      const updated = [newCustomProject, ...currentProjects];
      safeStorageSet('portal-national-projects', updated);
      setProjectsList(updated);
      saveCloudProjects(updated).catch(() => {});
      window.dispatchEvent(new CustomEvent('cloud_projects_updated', { detail: updated }));
    } else {
      // 2. User chose to update an existing strategic project cover:
      const updated = currentProjects.map(p => {
        if (p.id === newProjectPhoto.targetProject) {
          return { ...p, image: finalImage, title: newProjectPhoto.title || p.title };
        }
        return p;
      });
      safeStorageSet('portal-national-projects', updated);
      setProjectsList(updated);
      saveCloudProjects(updated).catch(() => {});
      window.dispatchEvent(new CustomEvent('cloud_projects_updated', { detail: updated }));
    }

    // 3. Also register in field photos (portal-field-photos-v2) for the 4K media gallery:
    const newDoc = {
      id: `PH-${Date.now().toString().slice(-4)}`,
      title: newProjectPhoto.title.trim(),
      titleEn: newProjectPhoto.title.trim(),
      sector: newProjectPhoto.region,
      category: 'رصف الأسفلت',
      desc: newProjectPhoto.desc?.trim() || `توثيق تنفيذي ميداني جديد أضيف لقسم المشروعات التنفيذية.`,
      date: new Date().toISOString().split('T')[0],
      src: finalImage,
      img: finalImage,
      author: newProjectPhoto.contractor?.trim() || 'م. الموقع الميداني',
      photographer: newProjectPhoto.contractor?.trim() || 'م. الموقع الميداني'
    };

    let photos = [];
    try {
      const saved = safeStorageGet('portal-field-photos-v2', []);
      if (Array.isArray(saved)) photos = saved;
    } catch (e) {}
    photos = [newDoc, ...photos];
    safeStorageSet('portal-field-photos-v2', photos);

    // Dispatch event and update state
    window.dispatchEvent(new Event('storage'));
    setIsUploadModalOpen(false);
    setUploadSuccessAlert(newProjectPhoto.title);
    setTimeout(() => setUploadSuccessAlert(null), 4000);
    setNewProjectPhoto({
      title: '',
      region: 'القطاع الأول (أوباري - الفيوات)',
      image: '/road-paving-official.jpg',
      desc: '',
      contractor: '',
      targetProject: 'new'
    });
  };

  const handleDeleteCustomProject = (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('هل تريد بالتأكيد حذف هذا المشروع التنفيذي المرفوع؟')) return;
    const deletedIds = safeStorageGet('portal-deleted-project-ids', []);
    if (!deletedIds.includes(id)) {
      safeStorageSet('portal-deleted-project-ids', [...deletedIds, id]);
    }
    const current = loadAllExecutiveProjects();
    const updated = current.filter(p => p.id !== id);
    safeStorageSet('portal-national-projects', updated);
    setProjectsList(updated);
    saveCloudProjects(updated).catch(() => {});
    window.dispatchEvent(new CustomEvent('cloud_projects_updated', { detail: updated }));
    if (selectedModalProject && selectedModalProject.id === id) {
      setSelectedModalProject(null);
    }
    window.dispatchEvent(new Event('storage'));
  };

  const filteredProjects = projectsList.filter(p => {
    if (projectFilter === 'field') return p.isFieldDoc;
    if (projectFilter === 'strategic') return !p.isFieldDoc;
    return true;
  });

  // Ironclad non-empty display array (Guarantees projects NEVER disappear)
  const displayProjects = (filteredProjects && filteredProjects.length > 0)
    ? filteredProjects
    : (projectsList.length > 0 ? projectsList : nationalProjects);

  // Mobile Projects Navigation State with pause protection (Never disappears or drops opacity to 0)
  const [activeProjectMobileIdx, setActiveProjectMobileIdx] = useState(0);
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const [touchStartProj, setTouchStartProj] = useState(null);
  const [touchEndProj, setTouchEndProj] = useState(null);

  const safeMobileIdx = Math.min(Math.max(0, activeProjectMobileIdx), Math.max(0, displayProjects.length - 1));
  const currentMobileProject = displayProjects[safeMobileIdx] || displayProjects[0];

  const handleNextProject = () => {
    if (!displayProjects || displayProjects.length <= 1) return;
    setActiveProjectMobileIdx(prev => (prev + 1) % displayProjects.length);
  };

  const handlePrevProject = () => {
    if (!displayProjects || displayProjects.length <= 1) return;
    setActiveProjectMobileIdx(prev => (prev - 1 + displayProjects.length) % displayProjects.length);
  };

  const onTouchStartProj = (e) => {
    setIsMobilePaused(true);
    setTouchEndProj(null);
    setTouchStartProj(e.targetTouches[0].clientX);
  };

  const onTouchMoveProj = (e) => {
    setTouchEndProj(e.targetTouches[0].clientX);
  };

  const onTouchEndProj = () => {
    if (!touchStartProj || !touchEndProj) return;
    const distance = touchStartProj - touchEndProj;
    if (distance > 45) {
      handleNextProject();
    } else if (distance < -45) {
      handlePrevProject();
    }
    // Resume auto-progression after 10s of user inactivity
    setTimeout(() => setIsMobilePaused(false), 10000);
  };

  useEffect(() => {
    if (isMobilePaused || !displayProjects || displayProjects.length <= 1) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      handleNextProject();
    }, 7000);
    return () => clearInterval(interval);
  }, [isMobilePaused, displayProjects.length]);

  return (
    <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 select-none scroll-mt-20 sm:scroll-mt-24">

      {/* ── Section Title Header with GSAP Reveal ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3 gsap-header">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border shadow-sm ${theme === 'light'
            ? 'bg-amber-100/90 border-amber-300 text-amber-950'
            : 'bg-amber-500/10 border-amber-500/35 text-amber-300'
          }`}>
          <Layers className="w-4 h-4 text-amber-500" />
          <span>{lang === 'ar' ? 'مشاريع مسار طريق أوباري - غات' : 'Ubari – Ghat Road Corridor Projects'}</span>
        </div>
        <h2 className={`text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black leading-tight sm:leading-snug ${theme === 'light' ? 'text-slate-950' : 'text-white'
          }`}>
          {lang === 'ar' ? 'المشروعات التنفيذية لمسار أوباري – غات (360 كم)' : 'Execution Projects – Ubari – Ghat Highway'}
        </h2>
        <p className={`text-xs sm:text-base font-medium ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
          {lang === 'ar'
            ? 'المشاريع الهندسية المتكاملة والمتابعات الميدانية الجاري تنفيذها على امتداد قطاعات طريق أوباري - غات.'
            : 'Integrated engineering projects and field execution updates along the Ubari – Ghat highway corridor.'}
        </p>
      </div>

      {/* ── Continuous Moving Marquee for Selected Work (Full Bleed on Mobile with Soft Edges) ── */}
      <div className="-mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full overflow-hidden">
        <MarqueeTicker variant="selected-work" theme={theme} lang={lang} direction={lang === 'ar' ? 'rtl' : 'ltr'} />
      </div>



      {/* Upload Success Alert */}
      {uploadSuccessAlert && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>تمت إضافة الصورة بنجاح ودمجها مباشرة في المشروعات التنفيذية: {uploadSuccessAlert}</span>
        </div>
      )}

      {/* 1. DESKTOP ONLY: Luxury Cards Grid (Ubari - Ghat Projects) with GSAP Stagger (100% Preserved) */}
      <div className="hidden md:grid grid-cols-2 gap-6 sm:gap-8 gsap-stagger-container">
        {displayProjects.map((project) => (
          <div
            key={project.id}
            className={`p-6 sm:p-8 rounded-[36px] border shadow-2xl space-y-4 sm:space-y-6 text-start relative overflow-hidden glass-card-hover gsap-stagger-item ${
              project.isFieldDoc ? 'border-amber-500/40 ring-1 ring-amber-500/20' : ''
            } ${theme === 'light'
                ? 'bg-white border-slate-200/90 text-slate-900 shadow-slate-200/80'
                : 'bg-[#0a0f1d]/95 border-white/15 text-white shadow-black/80'
              }`}
          >
            {/* Top 4K Photo Box with Live Overlay */}
            <div 
              className="h-56 sm:h-72 rounded-[26px] overflow-hidden relative border border-slate-200 dark:border-white/10 group cursor-pointer bg-[#0c1220]" 
              onClick={() => setSelectedModalProject(project)}
              data-cursor-image="true"
              data-cursor-label={lang === 'ar' ? 'عرض 4K ↗' : 'View 4K ↗'}
            >
              <img
                src={resolveAsset(project.image)}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover photo-hover-zoom group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = resolveAsset('./road-paving-official.jpg');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-75" />

              {/* Status Badge */}
              <span className={`absolute top-3.5 right-3.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-lg border ${
                project.isFieldDoc
                  ? 'bg-amber-500 text-slate-950 border-amber-300'
                  : project.status === 'completed'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : project.status === 'in_progress'
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-rose-500 text-white border-rose-400'
                }`}>
                {project.statusLabel}
              </span>

              {/* Distance / Sector Tag */}
              <span className="absolute bottom-3.5 right-3.5 px-3 py-1.5 rounded-xl bg-black/85 text-amber-400 font-mono font-black text-xs border border-white/10">
                {project.lengthKm ? `${project.lengthKm} ${lang === 'ar' ? 'كم' : 'KM'} • ` : ''}{project.region}
              </span>
            </div>

            {/* Title and Narrative */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-500 font-mono font-bold">
                <span>{project.id}</span>
                <span>{project.progress ? `${project.progress}% نسبة الإنجاز` : ''}</span>
              </div>
              <h3 
                onClick={() => setSelectedModalProject(project)}
                className={`text-2xl font-black cursor-pointer hover:text-amber-400 transition-colors ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}
              >
                {project.title}
              </h3>
              <p className={`text-sm font-medium leading-relaxed line-clamp-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                }`}>
                {project.desc}
              </p>
            </div>

            {/* Live Progress Bar with Glow */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  {lang === 'ar' ? 'نسبة الإنجاز الفعلي:' : 'Actual Completion:'}
                </span>
                <span className="font-mono font-black text-amber-500 text-sm">{project.progress}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${theme === 'light' ? 'bg-slate-200 border-slate-300' : 'bg-slate-800 border-white/5'
                }`}>
                <div
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 h-full rounded-full shimmer-active shadow-md transition-all duration-700"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Specifications Strip & Interactive Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  <span className="truncate max-w-[140px]">{project.contractor}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{project.statusLabel || (project.status === 'completed' ? 'مشروع مكتمل' : 'جاري التنفيذ')}</span>
                </div>
              </div>

              {/* Action Button for Details */}
              <button
                type="button"
                onClick={() => setSelectedModalProject(project)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/35 transition-all duration-200 active:scale-95 shadow-sm group/btn cursor-pointer"
              >
                <span>{lang === 'ar' ? 'عرض تفاصيل المشروع' : 'View Project Details'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-[-1px] group-hover/btn:translate-y-[-1px]" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* 2. MOBILE ONLY: Seamless News-Post Style Project Card (مطابق تماماً لبوست الأخبار) */}
      <div 
        className="md:hidden text-start space-y-3"
        onTouchStart={onTouchStartProj}
        onTouchMove={onTouchMoveProj}
        onTouchEnd={onTouchEndProj}
      >
        {/* Mobile Horizontal Quick-Switch Track for all projects (موضوع فوق المشروعات مباشرة) */}
        {displayProjects && displayProjects.length > 1 && (
          <div className="pb-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-1 px-1">
              {displayProjects.map((proj, pIdx) => {
                const isSelected = pIdx === safeMobileIdx;
                return (
                  <button
                    key={proj.id || pIdx}
                    type="button"
                    onClick={() => {
                      setIsMobilePaused(true);
                      setActiveProjectMobileIdx(pIdx);
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border shrink-0 text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10">
                      <img
                        src={resolveAsset(proj.image || './road-paving-official.jpg')}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = resolveAsset('./road-paving-official.jpg');
                        }}
                      />
                    </div>
                    <div className="max-w-[125px] leading-tight">
                      <div className="text-[10px] font-bold truncate">{proj.title}</div>
                      <div className="text-[9px] text-slate-400 font-mono truncate">{proj.id}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentMobileProject && (
          <div
            onClick={() => setSelectedModalProject(currentMobileProject)}
            className={`w-full rounded-2xl overflow-hidden border shadow-xl text-start transition-all duration-300 cursor-pointer active:scale-[0.99] ${
              theme === 'light'
                ? 'bg-white border-amber-300/80 shadow-slate-200/90 text-slate-900'
                : 'bg-[#090e1a]/95 border-amber-500/30 shadow-black/90 text-white'
            }`}
          >
            {/* Post Header: Agency Brand + Tag */}
            <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-white/10 gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-sm flex-shrink-0">
                  <img 
                    src={resolveAsset('./logo-agency.jpg')} 
                    alt="جهاز تنفيذ مشروعات المواصلات" 
                    className="w-full h-full object-contain rounded-[10px] bg-white"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="text-start leading-tight min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-black text-xs truncate">
                      {lang === 'ar' ? 'مشروعات المواصلات' : 'Transport Projects'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-sm shadow-amber-400/50" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium truncate block">
                    {currentMobileProject.contractor || (lang === 'ar' ? 'المكتب التنفيذي' : 'Executive Office')} • {currentMobileProject.id}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/30 shrink-0 whitespace-nowrap">
                {currentMobileProject.statusLabel || (lang === 'ar' ? 'المشروعات التنفيذية' : 'Executive Projects')}
              </span>
            </div>

            {/* Post Photo with Nav Controls */}
            <div className="h-44 xs:h-48 relative overflow-hidden group bg-slate-950">
              <div className="w-full h-full relative transition-transform duration-500 ease-out">
                <img 
                  src={resolveAsset(currentMobileProject.image || './road-paving-official.jpg')} 
                  alt={currentMobileProject.title} 
                  className="w-full h-full object-cover transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = resolveAsset('./road-paving-official.jpg');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              </div>

              {/* Navigation Arrows for Mobile Projects */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePrevProject(); }}
                className="absolute top-1/2 start-2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs border border-white/20 active:scale-90 z-20 cursor-pointer"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNextProject(); }}
                className="absolute top-1/2 end-2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs border border-white/20 active:scale-90 z-20 cursor-pointer"
                aria-label="Next"
              >
                ›
              </button>

              {/* Slide index & Location pill */}
              <div className="absolute bottom-2 start-2.5 end-2.5 flex items-center justify-between text-white text-[10px] gap-2 pointer-events-none z-10">
                <span className="px-2 py-0.5 rounded-md bg-black/70 font-mono font-bold text-amber-400 border border-white/10 truncate min-w-0">
                  {currentMobileProject.lengthKm ? `${currentMobileProject.lengthKm} كم • ` : ''}{currentMobileProject.region}
                </span>
                <span className="font-mono bg-black/60 px-1.5 py-0.5 rounded font-bold shrink-0 whitespace-nowrap">
                  {safeMobileIdx + 1} / {displayProjects.length}
                </span>
              </div>
            </div>

            {/* Post Text & Actions (بدون وصف مطول - عنوان ونسبة إنجاز وأزرار فقط) */}
            <div className="p-3.5 space-y-2.5">
              <div className="space-y-1.5">
                <h3 className="font-black text-xs xs:text-sm leading-snug line-clamp-2">
                  {currentMobileProject.title}
                </h3>
              </div>

              {/* Live Progress Bar on Mobile Card */}
              {currentMobileProject.progress !== undefined && (
                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500 dark:text-slate-400">نسبة الإنجاز:</span>
                    <span className="font-mono font-black text-amber-500">{currentMobileProject.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <div 
                      className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentMobileProject.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Dots Indicators + Full Story Prompt ("عرض المزيد") */}
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-white/10 text-[10px]">
                <div className="flex items-center gap-1 flex-wrap">
                  {displayProjects.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setActiveProjectMobileIdx(i);
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === safeMobileIdx ? 'w-4 bg-amber-500 shadow-sm shadow-amber-500/50' : 'w-1.5 bg-amber-500/30'
                      }`}
                      aria-label={`Project ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModalProject(currentMobileProject);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-500 hover:text-slate-950 border border-amber-500/35 transition-all duration-200 active:scale-95 shadow-sm group/btn cursor-pointer shrink-0"
                >
                  <span>{lang === 'ar' ? 'عرض تفاصيل المشروع' : 'View Details'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-[-1px] group-hover/btn:translate-y-[-1px]" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── News-Style Project Detail Modal (عرض المشروع بالكامل بنفس طريقة عرض الأخبار) ── */}
      <NewsDetailModal 
        post={selectedModalProject ? {
          ...selectedModalProject,
          isProject: true,
          location: selectedModalProject.region ? `${selectedModalProject.lengthKm ? selectedModalProject.lengthKm + ' كم • ' : ''}${selectedModalProject.region}` : selectedModalProject.location,
          category: selectedModalProject.statusLabel || (lang === 'ar' ? 'المشروعات التنفيذية' : 'Executive Projects'),
          author: selectedModalProject.contractor || (lang === 'ar' ? 'جهاز تنفيذ مشروعات المواصلات' : 'Transport Projects Authority'),
          timeAgo: selectedModalProject.progress ? `${selectedModalProject.progress}% نسبة الإنجاز` : (lang === 'ar' ? 'مشروع تنفيذي معتمد' : 'Approved Project')
        } : null}
        isOpen={Boolean(selectedModalProject)}
        onClose={() => setSelectedModalProject(null)}
        theme={theme}
        lang={lang}
      />

      {/* ── Direct Upload Modal for Featured Projects ── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleSaveProjectPhoto} className={`w-full max-w-xl rounded-3xl p-6 sm:p-7 space-y-4 border shadow-2xl text-start relative animate-scaleUp max-h-[92vh] overflow-y-auto ${
            theme === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#090e1a] border-amber-500/30 text-white'
          }`}>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-black text-base flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-amber-500" />
                <span>إضافة ورفع صورة للمشروعات التنفيذية (4K)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ارفع صورة من جهازك لعرضها فوراً في بطاقات المشروعات التنفيذية بالمنصة
              </p>
            </div>

            {/* Source Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  uploadTab === 'file'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>رفع من الجهاز</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('presets')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  uploadTab === 'presets'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <span>صور المشروع</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('url')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  uploadTab === 'url'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <span>رابط خارجي</span>
              </button>
            </div>

            {/* Tab 1: File Upload */}
            {uploadTab === 'file' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {isCompressing ? (
                  <div className="border-2 border-dashed border-amber-500 rounded-2xl p-8 text-center bg-amber-500/10 animate-pulse">
                    <Loader2 className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-spin" />
                    <div className="font-black text-xs text-amber-600 dark:text-amber-400">
                      جاري معالجة وضغط الصورة بجودة 4K فائقة...
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      يتم تقليص حجم الملف تلقائياً لسرعة التحميل والحفظ
                    </div>
                  </div>
                ) : newProjectPhoto.image && (newProjectPhoto.image.startsWith('data:') || newProjectPhoto.image.startsWith('/')) ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-black">
                    <img src={newProjectPhoto.image} alt="معاينة" className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                      <span className="text-[11px] font-bold text-emerald-400 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم اختيار الصورة بنجاح</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer"
                        >
                          تغيير
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProjectPhoto(prev => ({ ...prev, image: '/road-paving-official.jpg' }))}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-white/5 hover:bg-amber-500/10 transition-all group"
                  >
                    <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      اضغط لاختيار صورة من جهازك أو هاتفك
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      يدعم ملفات JPG, PNG, WEBP بدقة 4K
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Presets */}
            {uploadTab === 'presets' && (
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                {PROJECT_PRESET_IMAGES.map(p => {
                  const isSel = newProjectPhoto.image === p.src;
                  return (
                    <div
                      key={p.src}
                      onClick={() => setNewProjectPhoto(prev => ({ ...prev, image: p.src, title: prev.title || p.title }))}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isSel ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <img src={p.src} alt={p.title} className="w-full h-16 object-cover" />
                      <div className="p-1 bg-black/60 text-[10px] font-bold text-white truncate text-center">
                        {p.category}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 3: URL */}
            {uploadTab === 'url' && (
              <div>
                <input
                  type="url"
                  value={newProjectPhoto.image.startsWith('data:') ? '' : newProjectPhoto.image}
                  onChange={(e) => setNewProjectPhoto({ ...newProjectPhoto, image: e.target.value })}
                  placeholder="https://... أو /road-paving-official.jpg"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500 bg-transparent text-xs"
                />
              </div>
            )}

            {/* Destination Selector */}
            <div className="space-y-3 text-xs pt-1 border-t border-slate-200 dark:border-white/10">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">مكان العرض في المشروعات التنفيذية:</label>
                <select
                  value={newProjectPhoto.targetProject}
                  onChange={(e) => setNewProjectPhoto({ ...newProjectPhoto, targetProject: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500 bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white"
                >
                  <option value="new">إدراج كحزمة عمل وصورة تنفيذية جديدة (تظهر في المقدمة فوراً)</option>
                  <option value="PRJ-UBG-360">تحديث الصورة الرئيسية: مشروع صيانة ورصف طريق أوباري – غات</option>
                  <option value="PRJ-UBG-SOL-1100">تحديث الصورة الرئيسية: مشروع شواخص وتخطيط مسار أوباري – غات</option>
                  <option value="PRJ-UBG-CUL-028">تحديث الصورة الرئيسية: مشروع عبّارات تصريف السيول</option>
                  <option value="PRJ-UBG-DUN-120">تحديث الصورة الرئيسية: مشروع تثبيت الكثبان الرملية وتوسعة الأكتاف</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">عنوان المشروع أو الصورة التنفيذية:</label>
                <input
                  type="text"
                  required
                  value={newProjectPhoto.title}
                  onChange={(e) => setNewProjectPhoto({ ...newProjectPhoto, title: e.target.value })}
                  placeholder="مثال: رصف الأسفلت الساخن بالقطاع الأول"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500 bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">نطاق العمل / القطاع:</label>
                  <input
                    type="text"
                    value={newProjectPhoto.region}
                    onChange={(e) => setNewProjectPhoto({ ...newProjectPhoto, region: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500 bg-transparent"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">المقاول / المهندس المشرف:</label>
                  <input
                    type="text"
                    value={newProjectPhoto.contractor}
                    onChange={(e) => setNewProjectPhoto({ ...newProjectPhoto, contractor: e.target.value })}
                    placeholder="م. عبد السلام الفزاني"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">تفاصيل العمل الهندسي:</label>
                <textarea
                  rows="2"
                  value={newProjectPhoto.desc}
                  onChange={(e) => setNewProjectPhoto({ ...newProjectPhoto, desc: e.target.value })}
                  placeholder="وصف تفصيلي للأعمال التنفيذية الموثقة..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:border-amber-500 bg-transparent resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <ImagePlus className="w-4 h-4" />
                <span>حفظ وإدراج في المشروعات التنفيذية</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </section>
  );
}
