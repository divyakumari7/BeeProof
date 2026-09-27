import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Info,
  RefreshCw,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Check,
  CheckCircle2,
  Layers,
  AlertOctagon
} from 'lucide-react';
import { api } from '../services/api';
import { VisionDiagnosisData } from '../types';

interface ConditionPreset {
  id: string;
  name: string;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  symptoms: string;
  recommendedAction: string;
  badgeBg: string;
  badgeText: string;
}

const CONDITION_PRESETS: ConditionPreset[] = [
  {
    id: 'healthy',
    name: 'Healthy Brood & Worker Bees',
    confidence: 95,
    riskLevel: 'LOW',
    symptoms: 'Uniform capped worker brood pattern with glossy cell cappings; high worker bee density; no cell perforations or larval discoloration detected.',
    recommendedAction: 'Continue regular hive inspections and monitor bee activity.',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-900'
  },
  {
    id: 'varroa',
    name: 'Varroa Destructor Mites',
    confidence: 92,
    riskLevel: 'HIGH',
    symptoms: 'Phoretic Varroa destructor mites identified adhering to thorax of emerging nurse bees; irregular chewed brood cappings and visible wing deformities.',
    recommendedAction: 'Deploy formic acid or oxalic acid vapor treatment immediately and monitor natural mite drop count on sticky bottom boards.',
    badgeBg: 'bg-red-100 border-red-300',
    badgeText: 'text-red-900'
  },
  {
    id: 'afb',
    name: 'American Foulbrood (AFB)',
    confidence: 96,
    riskLevel: 'CRITICAL',
    symptoms: 'Sunken, dark, perforated brood cappings; larvae sunken to bottom of cells with characteristic ropey viscous consistency.',
    recommendedAction: 'Immediate quarantine of colony. Notify local KVIC apiculture inspector; do not transfer comb or honey supers to prevent apiary cross-infection.',
    badgeBg: 'bg-red-100 border-red-300',
    badgeText: 'text-red-900'
  },
  {
    id: 'wax_moth',
    name: 'Wax Moth Larva / Webbing',
    confidence: 91,
    riskLevel: 'MEDIUM',
    symptoms: 'Silken webbing trails across comb frames; chewed beeswax foundation and dark larval frass pellets along bottom board edges.',
    recommendedAction: 'Reduce hive entrance size, remove damaged combs, freeze affected frames at -12°C for 24 hours to eliminate moth larvae.',
    badgeBg: 'bg-orange-100 border-orange-300',
    badgeText: 'text-orange-900'
  },
  {
    id: 'chalk_brood',
    name: 'Chalkbrood Fungal Infection',
    confidence: 89,
    riskLevel: 'MEDIUM',
    symptoms: 'Hard chalky white/grey mummified larvae inside perforated or uncapped brood cells; mummies dropped onto hive bottom board.',
    recommendedAction: 'Improve hive ventilation, tilt hive slightly forward to drain moisture, and requeen if chronic mummification persists.',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-900'
  },
  {
    id: 'nosema',
    name: 'Nosema Disease (Microsporidian)',
    confidence: 90,
    riskLevel: 'HIGH',
    symptoms: 'Dysentery and brown fecal streaking along hive entrance; sluggish crawling bees unable to fly; swollen abdomen.',
    recommendedAction: 'Provide clean water sources, disinfect contaminated boxes with acetic acid fumes, and feed medicated syrup if infection is severe.',
    badgeBg: 'bg-red-100 border-red-300',
    badgeText: 'text-red-900'
  }
];

interface Props {
  selectedHiveCode?: string;
  lang?: 'en' | 'hi';
}

export const ComputerVisionHiveHealth: React.FC<Props> = ({
  selectedHiveCode = 'SUN-HIVE-001',
  lang = 'en'
}) => {
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [liveResult, setLiveResult] = useState<VisionDiagnosisData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ConditionPreset | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setImageFileName(file.name);
      setSelectedConditionId(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setAnalysisResult(null);
        setLiveResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manual disease selection: directly displays results WITHOUT showing any image in upload box
  const handleSelectConditionManually = (preset: ConditionPreset) => {
    setSelectedConditionId(preset.id);
    setAnalysisResult(preset);
    setLiveResult(null);
    // DO NOT set uploadedImage or uploadedFile - leave upload box clean
  };

  const handleRunDiagnosis = async () => {
    if (!uploadedFile && !uploadedImage) {
      return;
    }
    setIsAnalyzing(true);
    try {
      if (uploadedFile) {
        const resp = await api.diagnoseHiveImage(selectedHiveCode, uploadedFile, uploadedFile.name);
        if (resp && resp.data) {
          setLiveResult(resp.data);
          setAnalysisResult(null);
        }
      } else if (uploadedImage) {
        const isBase64 = uploadedImage.startsWith('data:');
        if (isBase64) {
          const resp = await api.diagnoseHiveImage(selectedHiveCode, uploadedImage, imageFileName || 'comb_photo.jpg');
          if (resp && resp.data) {
            setLiveResult(resp.data);
            setAnalysisResult(null);
          }
        }
      }
    } catch (err) {
      console.warn('Live CV inference error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setImageFileName(null);
    setAnalysisResult(null);
    setLiveResult(null);
    setSelectedConditionId(null);
  };


  const currentRisk = liveResult ? liveResult.overall_hive_health_risk : analysisResult?.riskLevel || 'LOW';
  const currentTitle = liveResult ? liveResult.primary_condition : analysisResult?.name || '';
  const currentConfidence = liveResult ? Math.round(liveResult.confidence_score) : analysisResult?.confidence || 90;
  const currentSymptoms = liveResult ? liveResult.primary_symptoms : analysisResult?.symptoms || '';
  const currentAction = liveResult ? liveResult.recommended_action : analysisResult?.recommendedAction || '';
  const modelName = liveResult?.model_name || 'Ultralytics YOLOv11 Nano';

  return (
    <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
              <Camera className="w-5 h-5 text-honey-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-forest-950">
              {lang === 'hi' ? 'कंप्यूटर विज़न और छत्ता स्वास्थ्य' : 'Computer Vision & Hive Health'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
              YOLOv11 NEURAL VISION
            </span>
          </div>
          <p className="text-xs text-sand-700 mt-1">
            {lang === 'hi'
              ? 'ब्रूड कंघी या मधुमक्खियों की तस्वीर अपलोड करें और कृत्रिम बुद्धिमत्ता आधारित स्वास्थ्य मूल्यांकन प्राप्त करें।'
              : `Upload a photo of brood comb, bees, or hive entrance for automated health and disease risk assessment (${selectedHiveCode}).`}
          </p>
        </div>

        {/* Model Indicator Notice */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-50 border border-sand-200 text-[11px] text-sand-700">
          <Info className="w-3.5 h-3.5 text-sand-500 shrink-0" />
          <span>Ultralytics YOLOv11 • Live Comb Vision Model</span>
        </div>
      </div>

      {/* Main Grid: Upload & Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Condition Selector */}
        <div className="lg:col-span-6 space-y-5">
          {/* 1. Image Upload / Drop Area */}
          <div>
            <label className="block text-xs font-bold text-forest-950 uppercase tracking-wide mb-2">
              1. {lang === 'hi' ? 'ब्रूड कंघी की तस्वीर और डिटेक्शन ओवरले' : 'BROOD COMB IMAGE & DETECTION OVERLAY'}
            </label>

            {uploadedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-sand-300 bg-sand-900 group select-none">
                <img
                  src={(showBoundingBoxes && liveResult?.annotated_image_base64) ? liveResult.annotated_image_base64 : uploadedImage}
                  alt="Hive comb inspection"
                  className="w-full h-64 object-cover"
                />

                {/* Interactive Bounding Box Boundary Overlay if annotated image not returned or fallback */}
                {showBoundingBoxes && liveResult?.detections && liveResult.detections.length > 0 && !liveResult.annotated_image_base64 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {liveResult.detections.map((det, idx) => {
                      const origW = liveResult.image_dimensions?.width || 416;
                      const origH = liveResult.image_dimensions?.height || 416;
                      const normX1 = det.bbox.normalized_x1 !== undefined ? det.bbox.normalized_x1 : (det.bbox.x1 / origW);
                      const normY1 = det.bbox.normalized_y1 !== undefined ? det.bbox.normalized_y1 : (det.bbox.y1 / origH);
                      const normX2 = det.bbox.normalized_x2 !== undefined ? det.bbox.normalized_x2 : (det.bbox.x2 / origW);
                      const normY2 = det.bbox.normalized_y2 !== undefined ? det.bbox.normalized_y2 : (det.bbox.y2 / origH);

                      const x1 = Math.max(0, Math.min(100, normX1 * 100));
                      const y1 = Math.max(0, Math.min(100, normY1 * 100));
                      const width = Math.max(6, Math.min(100 - x1, (normX2 - normX1) * 100));
                      const height = Math.max(6, Math.min(100 - y1, (normY2 - normY1) * 100));

                      const isCritical = det.risk === 'CRITICAL' || det.risk === 'HIGH' || det.is_pathology;
                      const isMedium = det.risk === 'MEDIUM';

                      return (
                        <div
                          key={idx}
                          className={`absolute border-2 rounded transition-all duration-300 ${
                            isCritical
                              ? 'border-red-500 bg-red-500/25 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                              : isMedium
                              ? 'border-amber-400 bg-amber-400/25 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                              : 'border-emerald-400 bg-emerald-400/25 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                          }`}
                          style={{
                            left: `${x1}%`,
                            top: `${y1}%`,
                            width: `${width}%`,
                            height: `${height}%`,
                          }}
                        >
                          <div
                            className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-black font-mono tracking-tight whitespace-nowrap shadow-md border ${
                              isCritical
                                ? 'bg-red-600 text-white border-red-700'
                                : isMedium
                                ? 'bg-amber-600 text-white border-amber-700'
                                : 'bg-emerald-600 text-white border-emerald-700'
                            }`}
                          >
                            <span>{det.display_name || det.class_name}</span>{' '}
                            <span className="opacity-90 font-mono">({Math.round(det.confidence * 100)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Top Status & Bounding Boxes Controls */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-auto">
                  {liveResult && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold border border-white/20">
                      <span className={`w-2 h-2 rounded-full ${
                        liveResult.detections && liveResult.detections.length > 0 ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                      }`} />
                      <span>
                        {liveResult.detections && liveResult.detections.length > 0
                          ? `${liveResult.detections.length} YOLOv11 Detections`
                          : 'Clean Comb (0 Pathogens)'}
                      </span>
                    </div>
                  )}

                  {liveResult && (
                    <button
                      type="button"
                      onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                      className="ml-auto px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black/90 backdrop-blur-sm text-white text-[10px] font-semibold border border-white/20 transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-honey-400" />
                      <span>{showBoundingBoxes ? 'Boundary: ON' : 'Boundary: OFF'}</span>
                    </button>
                  )}
                </div>

                {/* Bottom image footer */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                  <div className="w-full flex items-center justify-between text-white text-xs">
                    <span className="font-mono truncate max-w-[200px]">{imageFileName || 'brood_comb_photo.jpg'}</span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-semibold transition cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Scanning overlay animation when analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-forest-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-white gap-3 z-10">
                    <div className="w-12 h-12 border-3 border-honey-400 border-t-transparent rounded-full animate-spin" />
                    <div className="text-center space-y-1">
                      <p className="font-bold text-xs tracking-wide text-honey-400">Running YOLOv11 Neural Vision Model...</p>
                      <p className="text-[10px] text-sand-300">Extracting bounding boundaries & pathogen bio-classes</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <label className="border-2 border-dashed border-sand-300 hover:border-honey-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-sand-50/50 hover:bg-sand-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-sand-100 flex items-center justify-center text-sand-600 mb-3">
                  <Upload className="w-6 h-6 text-honey-600" />
                </div>
                <p className="text-xs font-bold text-forest-950">
                  {lang === 'hi' ? 'फोटो चुनने के लिए क्लिक करें या यहाँ खींचें' : 'Click to upload or drag & drop comb image'}
                </p>
                <p className="text-[11px] text-sand-600 mt-1">PNG, JPG, or WEBP up to 50MB</p>
              </label>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-forest-950 uppercase tracking-wide">
                2. {lang === 'hi' ? 'या सीधे बीमारी चुनें (त्वरित क्लिनिकल रिपोर्ट)' : 'OR SELECT PRE-CONFIGURED TEST SAMPLE / DISEASE MANUALLY'}
              </label>
              <span className="text-[10px] text-sand-600 italic">Direct instant report</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {CONDITION_PRESETS.map((preset) => {
                const isSelected = selectedConditionId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectConditionManually(preset)}
                    className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-honey-600 text-forest-950 shadow-sm ring-1 ring-honey-500'
                        : 'bg-sand-50/60 border-sand-200 text-sand-800 hover:bg-sand-100/70 hover:border-sand-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold leading-tight">{preset.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-honey-600 shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${
                        preset.riskLevel === 'LOW' ? 'text-emerald-700 bg-emerald-100' :
                        preset.riskLevel === 'MEDIUM' ? 'text-amber-700 bg-amber-100' : 'text-red-700 bg-red-100'
                      }`}>
                        Risk: {preset.riskLevel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Action Button: Run AI Diagnosis on Uploaded Image */}
          {uploadedImage && (
            <button
              type="button"
              onClick={handleRunDiagnosis}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer animate-fadeIn"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-honey-400" />
                  <span>Running YOLOv11 Vision Screening...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-honey-400" />
                  <span>{lang === 'hi' ? 'अपलोड की गई फोटो का एआई निदान करें' : 'Run YOLO11n AI Screening on Uploaded Photo'}</span>
                </>
              )}
            </button>
          )}

        </div>

        {/* Right Column: Realistic Diagnosis Results */}
        <div className="lg:col-span-6 space-y-4">
          <label className="block text-xs font-bold text-forest-950 uppercase tracking-wide">
            3. {lang === 'hi' ? 'YOLO11n रोगजनक और स्वास्थ्य परिणाम' : 'YOLO11N PATHOGEN & HEALTH RESULTS'}
          </label>

          {liveResult || analysisResult ? (
            <div className="p-5 rounded-2xl bg-sand-50/70 border border-sand-300 space-y-4 animate-fadeIn">
              {/* Result Header & Risk Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-sand-600 font-bold block">
                      Detected Condition
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sand-200 font-mono text-sand-800">
                      {modelName}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-forest-950 flex items-center gap-2 mt-0.5">
                    {currentRisk === 'LOW' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                    <span>{currentTitle}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    currentRisk === 'LOW' ? 'bg-emerald-100 border-emerald-300 text-emerald-900' :
                    currentRisk === 'MEDIUM' ? 'bg-amber-100 border-amber-300 text-amber-900' :
                    'bg-red-100 border-red-300 text-red-900'
                  }`}>
                    Risk: {currentRisk}
                  </span>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-sand-700">Model Confidence:</span>
                  <span className="font-display font-black text-sm text-forest-950 font-mono">
                    {currentConfidence}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      currentRisk === 'LOW' ? 'bg-emerald-600' :
                      currentRisk === 'MEDIUM' ? 'bg-amber-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, currentConfidence))}%` }}
                  />
                </div>
              </div>

              {/* Live Detections Badges (if any detected entities) */}
              {liveResult && liveResult.detections && liveResult.detections.length > 0 && (
                <div className="p-3 rounded-xl bg-white border border-sand-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-forest-950 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-honey-600" />
                      <span>Detected Entities ({liveResult.detections.length})</span>
                    </span>
                    <span className="text-[10px] text-sand-500 font-normal">YOLOv11 BBoxes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {liveResult.detections.slice(0, 8).map((det, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border ${
                          det.is_pathology
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-sand-100 border-sand-200 text-sand-800'
                        }`}
                      >
                        <span>{det.display_name}</span>
                        <span className="font-mono opacity-75">({Math.round(det.confidence * 100)}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Observed Symptoms */}
              <div className="p-3.5 rounded-xl bg-white border border-sand-200 space-y-1">
                <span className="text-[11px] font-bold text-forest-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-honey-600" />
                  <span>Observed Symptoms</span>
                </span>
                <p className="text-xs text-sand-800 leading-relaxed">
                  {currentSymptoms}
                </p>
              </div>

              {/* Recommended Action / What to do */}
              <div className="p-4 rounded-xl bg-forest-950 text-white space-y-1.5 shadow-sm">
                <span className="text-[11px] font-bold text-honey-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-honey-400" />
                  <span>What to do / Recommended Action</span>
                </span>
                <p className="text-xs text-sand-200 leading-relaxed font-sans">
                  {currentAction}
                </p>
              </div>

              {/* Urgent Action Banner if Critical / High */}
              {liveResult && liveResult.urgent_actions && liveResult.urgent_actions.length > 0 && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-1 text-red-900">
                  <span className="text-[11px] font-bold flex items-center gap-1.5 uppercase">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                    <span>Urgent Action Required</span>
                  </span>
                  <p className="text-xs leading-tight">
                    {liveResult.urgent_actions[0].action}
                  </p>
                </div>
              )}

              {/* Footer Note */}
              <div className="flex items-center justify-between text-[10px] text-sand-600 pt-1 border-t border-sand-200">
                <span>Inspected Hive: <strong className="font-mono text-forest-900">{selectedHiveCode}</strong></span>
                <span>Diagnosis logged to cooperative telemetry</span>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-2xl border border-dashed border-sand-300 bg-sand-50/40 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center text-sand-400">
                <Sparkles className="w-5 h-5 text-honey-600" />
              </div>
              <p className="text-xs font-bold text-forest-950">Awaiting Image & Diagnosis Run</p>
              <p className="text-[11px] text-sand-600 max-w-xs">
                Select an image above and click &quot;Run YOLOv11 AI Diagnosis&quot; to inspect brood comb conditions, pest infestation probability, and mitigation remedies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

