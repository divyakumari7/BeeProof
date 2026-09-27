import React, { useState } from 'react';
import { PlusCircle, X, Check, AlertCircle, Sparkles, Box, MapPin, Calendar, Cpu, FileText } from 'lucide-react';
import { api } from '../services/api';
import { HiveDto } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onHiveCreated: (newHive: HiveDto) => void;
  lang?: 'en' | 'hi';
  clusterName?: string;
  clusterCode?: string;
  suggestedCode?: string;
}

export const RegisterHiveModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onHiveCreated,
  lang = 'en',
  clusterName = 'Sundarbans Mangrove Reserve Cluster',
  clusterCode = 'SUN-MNG-01',
  suggestedCode = 'SUN-HIVE-005'
}) => {
  const [hiveCode, setHiveCode] = useState(suggestedCode);
  const [hiveLocation, setHiveLocation] = useState('');
  const [beeSpecies, setBeeSpecies] = useState('Apis cerana indica (Indian Honey Bee)');
  const [installationDate, setInstallationDate] = useState(new Date().toISOString().split('T')[0]);
  const [hiveType, setHiveType] = useState('Langstroth 10-Frame Standard');
  const [sensorId, setSensorId] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setHiveCode(suggestedCode);
      setError(null);
    }
  }, [isOpen, suggestedCode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = hiveCode.trim().toUpperCase();
    if (!cleanCode) {
      setError(lang === 'hi' ? 'छत्ता कोड / आईडी अनिवार्य है' : 'Hive ID / Hive Code is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.registerHive({
        hiveCode: cleanCode,
        hiveLocation: hiveLocation.trim() || `${clusterName}, Sector Apiary`,
        beeSpecies,
        installationDate,
        hiveType,
        sensorId: sensorId.trim() || undefined,
        notes: notes.trim() || undefined
      });

      if (res.success && res.data) {
        onHiveCreated(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to register hive');
      }
    } catch (err: any) {
      setError(err.message || 'Error registering new hive. Please ensure the Hive ID is unique.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-sand-300 overflow-hidden space-y-0">
        {/* Modal Header */}
        <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-honey-600/20 text-honey-400 flex items-center justify-center font-bold">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                {lang === 'hi' ? 'नया छत्ता पंजीकृत करें' : 'Register New Apiary Hive'}
              </h3>
              <p className="text-[11px] text-sand-300">
                {clusterName} ({clusterCode})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sand-300 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Hive ID / Hive Code */}
          <div>
            <label className="font-semibold text-sand-800 block mb-1">
              {lang === 'hi' ? 'छत्ता कोड / आईडी *' : 'Hive ID / Hive Code *'}
            </label>
            <input
              type="text"
              required
              value={hiveCode}
              onChange={(e) => setHiveCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUN-HIVE-005"
              className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono font-bold text-forest-950 focus:ring-2 focus:ring-honey-500"
            />
            <span className="text-[10px] text-sand-500 mt-0.5 block">
              {lang === 'hi'
                ? 'अद्वितीय पहचानकर्ता जो इस छत्ते के लिए उपयोग किया जाएगा'
                : 'Unique identifier used across telemetry and harvest tracking'}
            </span>
          </div>

          {/* Hive Location */}
          <div>
            <label className="font-semibold text-sand-800 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-honey-600" />
              <span>{lang === 'hi' ? 'छत्ते का स्थान / क्षेत्र' : 'Hive Location / Apiary Area'}</span>
            </label>
            <input
              type="text"
              value={hiveLocation}
              onChange={(e) => setHiveLocation(e.target.value)}
              placeholder="e.g. Apiary Block C, South Mangrove Bank"
              className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-forest-950"
            />
          </div>

          {/* 2-Column: Bee Species & Installation Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-sand-800 block mb-1">
                {lang === 'hi' ? 'मधुमक्खी प्रजाति *' : 'Bee Species *'}
              </label>
              <select
                value={beeSpecies}
                onChange={(e) => setBeeSpecies(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-medium text-forest-950"
              >
                <option value="Apis cerana indica">Apis cerana indica (Indian Honey Bee)</option>
                <option value="Apis mellifera">Apis mellifera (European Honey Bee)</option>
                <option value="Apis dorsata">Apis dorsata (Giant Rock Bee)</option>
                <option value="Tetragonula iridipennis">Tetragonula iridipennis (Stingless Bee)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-sand-800 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-honey-600" />
                <span>{lang === 'hi' ? 'स्थापना तिथि *' : 'Installation Date *'}</span>
              </label>
              <input
                type="date"
                required
                value={installationDate}
                onChange={(e) => setInstallationDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono text-forest-950"
              />
            </div>
          </div>

          {/* Hive Type */}
          <div>
            <label className="font-semibold text-sand-800 block mb-1">
              {lang === 'hi' ? 'छत्ते का प्रकार *' : 'Hive Box Type *'}
            </label>
            <select
              value={hiveType}
              onChange={(e) => setHiveType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-forest-950"
            >
              <option value="Langstroth 10-Frame Standard">Langstroth 10-Frame Standard (Recommended)</option>
              <option value="Langstroth 8-Frame Box">Langstroth 8-Frame Box</option>
              <option value="Top Bar Hive (Kenyan / Tanzanian)">Top Bar Hive (Kenyan / Tanzanian)</option>
              <option value="Warre Vertical Hive">Warre Vertical Comb Hive</option>
              <option value="Traditional Clay / Wooden Log Hive">Traditional Clay / Wooden Log Hive</option>
            </select>
          </div>

          {/* Sensor ID (Optional) */}
          <div className="p-3.5 rounded-2xl bg-sand-100/60 border border-sand-200 space-y-1.5">
            <label className="font-semibold text-forest-950 block flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-forest-700" />
              <span>{lang === 'hi' ? 'सेंसर आईडी (वैकल्पिक)' : 'Sensor ID (Optional)'}</span>
            </label>
            <input
              type="text"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value.toUpperCase())}
              placeholder="e.g. SENS-HIVE-005-A (Leave blank if no sensor)"
              className="w-full p-2 rounded-xl border border-sand-300 bg-white font-mono text-forest-950"
            />
            <p className="text-[11px] text-sand-600">
              {lang === 'hi'
                ? 'यदि इस छत्ते में अभी कोई आईओटी सेंसर नहीं लगा है, तो इसे खाली छोड़ दें।'
                : 'Leave blank if no IoT hardware telemetry node is attached yet.'}
            </p>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="font-semibold text-sand-800 block mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-sand-500" />
              <span>{lang === 'hi' ? 'अतिरिक्त विवरण / नोट्स' : 'Apiary Notes (Optional)'}</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Colony established with 1 mated queen and 8 worker brood frames."
              className="w-full p-2.5 rounded-xl border border-sand-300 bg-white text-forest-950"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-sand-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-sand-300 rounded-xl text-sand-700 hover:bg-sand-100 transition"
            >
              {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-honey-400 border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'hi' ? 'पंजीकृत हो रहा है...' : 'Registering Hive...'}</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-honey-400" />
                  <span>{lang === 'hi' ? 'छत्ता सहेजें और पंजीकृत करें' : 'Save & Register Hive'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
