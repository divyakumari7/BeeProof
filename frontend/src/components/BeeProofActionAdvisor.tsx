import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Droplets,
  Wrench,
  QrCode,
  Layers,
  AlertTriangle,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Clock,
  Check
} from 'lucide-react';

export interface AdvisorySituation {
  id: string;
  emoji: string;
  titleEn: string;
  titleHi: string;
  recommendationEn: string;
  recommendationHi: string;
  tagEn: string;
  tagHi: string;
  categoryEn: string;
  categoryHi: string;
  badgeColor: string;
  borderColor: string;
  bgGradient: string;
  actionType?: 'harvest' | 'cv_scan' | 'register_hive' | 'batch_list' | 'training';
}

export const ADVISORY_SITUATIONS: AdvisorySituation[] = [
  {
    id: 'healthy_stable',
    emoji: '🟢',
    titleEn: 'Hive healthy & stable',
    titleHi: 'छत्ता स्वस्थ और स्थिर है',
    recommendationEn: 'No urgent action. Check/prepare frames and equipment for upcoming cycle.',
    recommendationHi: 'कोई तत्काल कार्रवाई आवश्यक नहीं। आगामी चक्र के लिए फ्रेम और उपकरणों की जांच व तैयारी करें।',
    tagEn: 'Normal / Healthy',
    tagHi: 'सामान्य / स्वस्थ',
    categoryEn: 'Routine Care',
    categoryHi: 'दैनिक देखभाल',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderColor: 'border-emerald-300 hover:border-emerald-500',
    bgGradient: 'from-emerald-50/70 to-emerald-100/30'
  },
  {
    id: 'honey_flow',
    emoji: '🍯',
    titleEn: 'Honey-flow period',
    titleHi: 'शहद प्रवाह का मौसम (Honey-flow)',
    recommendationEn: 'Monitor weight and prepare for upcoming honey harvest.',
    recommendationHi: 'छत्ते के वजन की निगरानी करें और आगामी शहद निष्कर्षण (हार्वेस्ट) की तैयारी करें।',
    tagEn: 'Active Flow',
    tagHi: 'सक्रिय प्रवाह',
    categoryEn: 'Harvesting',
    categoryHi: 'कटाई व निष्कर्षण',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    borderColor: 'border-amber-300 hover:border-amber-500',
    bgGradient: 'from-amber-50/70 to-amber-100/30',
    actionType: 'harvest'
  },
  {
    id: 'before_harvesting',
    emoji: '🧰',
    titleEn: 'Before harvesting',
    titleHi: 'शहद निकालने से पहले',
    recommendationEn: 'Clean extractor, check frames and prepare food-grade containers.',
    recommendationHi: 'शहद निकालने वाले यंत्र (एक्सट्रैक्टर) को साफ करें, फ्रेम की जांच करें और खाद्य-ग्रेड कंटेनर तैयार रखें।',
    tagEn: 'Pre-Harvest',
    tagHi: 'तैयारी प्रोटोकॉल',
    categoryEn: 'Harvesting',
    categoryHi: 'कटाई व निष्कर्षण',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    borderColor: 'border-orange-300 hover:border-orange-500',
    bgGradient: 'from-orange-50/70 to-orange-100/30'
  },
  {
    id: 'after_harvest',
    emoji: '🍯',
    titleEn: 'After honey harvest',
    titleHi: 'शहद निकालने के बाद',
    recommendationEn: 'Create batch, complete quality testing and generate traceability/QR record.',
    recommendationHi: 'शहद बैच बनाएं, गुणवत्ता परीक्षण पूरा करें और ब्लॉकचेन ट्रैसेबिलिटी/QR रिकॉर्ड जनरेट करें।',
    tagEn: 'Traceability & QR',
    tagHi: 'ट्रैसेबिलिटी व QR',
    categoryEn: 'Traceability',
    categoryHi: 'प्रमाणन व रिकॉर्ड',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    borderColor: 'border-purple-300 hover:border-purple-500',
    bgGradient: 'from-purple-50/70 to-purple-100/30',
    actionType: 'harvest'
  },
  {
    id: 'wax_collected',
    emoji: '🐝',
    titleEn: 'Wax collected',
    titleHi: 'मोम एकत्रित होने पर',
    recommendationEn: 'Clean and properly process recovered wax for possible reuse as foundation sheets.',
    recommendationHi: 'प्राप्त मोम को साफ व ठीक से प्रोसेस करें ताकि इसे पुनः कॉम्ब फाउंडेशन शीट के रूप में इस्तेमाल किया जा सके।',
    tagEn: 'Wax Upcycling',
    tagHi: 'मोम पुनर्चक्रण',
    categoryEn: 'Processing',
    categoryHi: 'प्रसंस्करण',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    borderColor: 'border-yellow-300 hover:border-yellow-500',
    bgGradient: 'from-yellow-50/70 to-yellow-100/30'
  },
  {
    id: 'abnormal_condition',
    emoji: '⚠️',
    titleEn: 'Abnormal hive condition',
    titleHi: 'छत्ते की असामान्य स्थिति / बीमारी का संकेत',
    recommendationEn: 'Inspect the hive and follow the recommended corrective action.',
    recommendationHi: 'छत्ते का बारीकी से निरीक्षण करें और अनुशंसित सुधारात्मक उपचारात्मक कार्रवाई का पालन करें।',
    tagEn: 'Alert / Action',
    tagHi: 'चेतावनी / उपचार',
    categoryEn: 'Health & Treatment',
    categoryHi: 'स्वास्थ्य व उपचार',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    borderColor: 'border-red-300 hover:border-red-500',
    bgGradient: 'from-red-50/70 to-red-100/30',
    actionType: 'cv_scan'
  },
  {
    id: 'low_activity',
    emoji: '📚',
    titleEn: 'Low-activity period',
    titleHi: 'कम गतिविधि / खाली समय (Low-activity period)',
    recommendationEn: 'Complete recommended short training based on your hive’s needs.',
    recommendationHi: 'अपने छत्ते की जरूरतों के आधार पर अनुशंसित संक्षिप्त प्रशिक्षण/कौशल मॉड्यूल पूरा करें।',
    tagEn: 'Upskill & Training',
    tagHi: 'प्रशिक्षण व कौशल',
    categoryEn: 'Skill & Learning',
    categoryHi: 'कौशल विकास',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    borderColor: 'border-sky-300 hover:border-sky-500',
    bgGradient: 'from-sky-50/70 to-sky-100/30',
    actionType: 'training'
  },
  {
    id: 'before_next_cycle',
    emoji: '🔄',
    titleEn: 'Before next production cycle',
    titleHi: 'अगले उत्पादन चक्र से पहले',
    recommendationEn: 'Prepare equipment, frames and other required inputs.',
    recommendationHi: 'उपकरणों, नए फ्रेमों और अन्य आवश्यक आपूर्तियों को तैयार करें।',
    tagEn: 'Cycle Prep',
    tagHi: 'चक्र तैयारी',
    categoryEn: 'Routine Care',
    categoryHi: 'दैनिक देखभाल',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    borderColor: 'border-teal-300 hover:border-teal-500',
    bgGradient: 'from-teal-50/70 to-teal-100/30'
  }
];

interface Props {
  lang?: 'en' | 'hi';
  onTriggerHarvest?: () => void;
  selectedHiveCode?: string;
}

export const BeeProofActionAdvisor: React.FC<Props> = ({
  lang = 'en',
  onTriggerHarvest,
  selectedHiveCode = 'SUN-HIVE-001'
}) => {
  const [selectedId, setSelectedId] = useState<string>('healthy_stable');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const selectedItem = ADVISORY_SITUATIONS.find((item) => item.id === selectedId) || ADVISORY_SITUATIONS[0];

  const categories = lang === 'hi' ? [
    { id: 'all', label: 'सभी स्थितियां' },
    { id: 'Routine Care', label: 'दैनिक व चक्र देखभाल' },
    { id: 'Harvesting', label: 'शहद निष्कर्षण' },
    { id: 'Health & Treatment', label: 'स्वास्थ्य व उपचार' },
    { id: 'Skill & Learning', label: 'खाली समय प्रशिक्षण' }
  ] : [
    { id: 'all', label: 'All Situations' },
    { id: 'Routine Care', label: 'Routine & Prep' },
    { id: 'Harvesting', label: 'Harvesting' },
    { id: 'Health & Treatment', label: 'Health & Alert' },
    { id: 'Skill & Learning', label: 'Idle-Time Training' }
  ];

  const filteredSituations = ADVISORY_SITUATIONS.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.categoryEn === activeFilter;
  });

  return (
    <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-honey-500/15 flex items-center justify-center text-honey-700">
              <Sparkles className="w-5 h-5 text-honey-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-forest-950">
              {lang === 'hi' ? 'बीप्रूफ क्रियात्मक परामर्श और सिफारिशें' : 'BeeProof Situational Recommendations'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-honey-100 text-honey-900 border border-honey-300">
              {lang === 'hi' ? 'स्मार्ट परामर्श' : 'SMART ADVISOR'}
            </span>
          </div>
          <p className="text-xs text-sand-700 mt-1">
            {lang === 'hi'
              ? 'छत्ते की वर्तमान स्थिति, मौसम चक्र या खाली समय के अनुसार अनुशंसित कार्ययोजना और दिशा-निर्देश।'
              : `Context-driven guidance and actionable best practices based on your hive state (${selectedHiveCode}) and apiary activity cycle.`}
          </p>
        </div>

        {/* Idle Time / Free Time Banner Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-300 text-xs text-amber-900">
          <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="font-medium text-[11px]">
            {lang === 'hi' ? '💡 खाली समय में फ्रेम तैयारी और प्रशिक्षण को प्राथमिकता दें' : '💡 Use free/low-activity time for equipment prep & upskilling'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition shrink-0 cursor-pointer ${
              activeFilter === cat.id
                ? 'bg-forest-900 text-white shadow-sm'
                : 'bg-sand-50 hover:bg-sand-100 text-sand-700 border border-sand-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Situation Selector on Left, Detailed Active Recommendation Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Situations List */}
        <div className="lg:col-span-6 space-y-2.5">
          <label className="block text-xs font-bold text-forest-950 uppercase tracking-wide">
            {lang === 'hi' ? 'समय / वर्तमान स्थिति चुनें' : 'SELECT TIME / SITUATION'}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredSituations.map((sit) => {
              const isSelected = selectedId === sit.id;
              return (
                <button
                  key={sit.id}
                  type="button"
                  onClick={() => setSelectedId(sit.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-honey-50/80 border-honey-600 text-forest-950 shadow-md ring-2 ring-honey-500/50'
                      : 'bg-sand-50/50 hover:bg-sand-100/70 border-sand-200 text-sand-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base shrink-0">{sit.emoji}</span>
                      <span className="font-bold leading-tight text-forest-950 text-xs">
                        {lang === 'hi' ? sit.titleHi : sit.titleEn}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-honey-600 shrink-0 mt-0.5" />}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-sand-200/60 text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full font-bold border ${sit.badgeColor}`}>
                      {lang === 'hi' ? sit.tagHi : sit.tagEn}
                    </span>
                    <span className="text-sand-500 font-medium">
                      {lang === 'hi' ? sit.categoryHi : sit.categoryEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Recommendation Spotlight Card */}
        <div className="lg:col-span-6 space-y-2.5">
          <label className="block text-xs font-bold text-forest-950 uppercase tracking-wide">
            {lang === 'hi' ? 'बीप्रूफ अनुशंसित कार्ययोजना' : 'BEEPROOF RECOMMENDATION & NEXT ACTIONS'}
          </label>

          <div className={`p-6 rounded-2xl border bg-gradient-to-br ${selectedItem.bgGradient} border-sand-300 shadow-sm space-y-5 animate-fadeIn`}>
            {/* Situation Header */}
            <div className="flex items-start justify-between gap-3 border-b border-sand-200/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-sand-200 flex items-center justify-center text-2xl shrink-0">
                  {selectedItem.emoji}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sand-600">
                    {lang === 'hi' ? 'चयनित स्थिति' : 'SELECTED SITUATION'}
                  </span>
                  <h3 className="font-display font-bold text-lg text-forest-950 leading-snug">
                    {lang === 'hi' ? selectedItem.titleHi : selectedItem.titleEn}
                  </h3>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${selectedItem.badgeColor} shrink-0`}>
                {lang === 'hi' ? selectedItem.tagHi : selectedItem.tagEn}
              </span>
            </div>

            {/* Recommendation Speech / Card */}
            <div className="p-4 rounded-xl bg-white border border-sand-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-forest-950 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-honey-600" />
                <span>{lang === 'hi' ? 'बीप्रूफ की अनुशंसित सलाह:' : 'BeeProof Direct Recommendation:'}</span>
              </div>
              <p className="text-sm font-semibold text-forest-900 leading-relaxed font-sans pl-6 border-l-2 border-honey-500">
                "{lang === 'hi' ? selectedItem.recommendationHi : selectedItem.recommendationEn}"
              </p>
            </div>

            {/* Actionable Suggestions & Context Tips */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-forest-950 uppercase tracking-wide block">
                {lang === 'hi' ? 'सुझाए गए कदम / चेकलिस्ट' : 'ACTIONABLE CHECKLIST & PROTOCOLS'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-sand-800">
                <div className="p-2.5 rounded-xl bg-white/80 border border-sand-200 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-honey-600 shrink-0" />
                  <span>
                    {selectedId === 'low_activity' || selectedId === 'before_next_cycle'
                      ? (lang === 'hi' ? 'खाली समय में 100% तैयारी' : 'Ideal for beekeeper idle time')
                      : (lang === 'hi' ? 'छत्ता चक्र के अनुरूप समय' : 'Aligned with current hive phase')}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-sand-200 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {lang === 'hi' ? 'KVIC व FSSAI मानकों के अनुकूल' : 'Compliant with KVIC & Traceability'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            {selectedItem.actionType === 'harvest' && onTriggerHarvest && (
              <button
                type="button"
                onClick={onTriggerHarvest}
                className="w-full py-2.5 px-4 rounded-xl bg-honey-600 hover:bg-honey-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>{lang === 'hi' ? 'शहद निष्कर्षण व बैच दर्ज करें (+QR)' : 'Log Honey Harvest & Create Batch (+QR)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
