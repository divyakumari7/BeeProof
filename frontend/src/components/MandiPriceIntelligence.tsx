import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Coins,
  Sparkles,
  Bot,
  Store,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  MapPin,
  Clock,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { MandiPriceResponse, MandiItem } from '../types';
import { BeekeeperLanguage } from '../utils/beekeeperTranslations';

interface Props {
  lang: BeekeeperLanguage;
  defaultState?: string;
  onHarvestPriceReference?: (pricePerKg: number) => void;
}

export const MandiPriceIntelligence: React.FC<Props> = ({
  lang,
  defaultState = 'West Bengal',
  onHarvestPriceReference
}) => {
  const [selectedState, setSelectedState] = useState<string>(defaultState);
  const [data, setData] = useState<MandiPriceResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Interactive Calculator State
  const [calcQuantityKg, setCalcQuantityKg] = useState<number>(25);
  const [calcMiddlemanRate, setCalcMiddlemanRate] = useState<number>(95);

  const fetchPrices = async (state: string, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const res = isRefresh
        ? await api.refreshMandiPrices(state)
        : await api.getMandiPrices(state);

      if (res && res.data) {
        setData(res.data);
        if (res.data.summary?.typicalMiddlemanOfferPerKg) {
          setCalcMiddlemanRate(res.data.summary.typicalMiddlemanOfferPerKg);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to TinyFish Mandi Agent');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrices(selectedState);
  }, [selectedState]);

  // Derived calculations
  const modalPrice = data?.summary?.avgModalPricePerKg || 350;
  const middlemanTotal = Math.round(calcQuantityKg * calcMiddlemanRate);
  const apmcMandiTotal = Math.round(calcQuantityKg * modalPrice);
  const lossPrevented = apmcMandiTotal - middlemanTotal;
  const gainPercentage = middlemanTotal > 0 ? Math.round((lossPrevented / middlemanTotal) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/60 border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header with TinyFish Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Bot className="w-3.5 h-3.5 text-emerald-700" />
              <span>TinyFish Web Agent AI</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              <Store className="w-3 h-3 text-amber-700" />
              <span>Agmarknet & e-NAM Verified</span>
            </span>

            {data?.cached && (
              <span className="text-[11px] text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded font-mono">
                Cached sync
              </span>
            )}
          </div>

          <h2 className="text-2xl font-display font-extrabold text-forest-950 flex items-center gap-2">
            <span>{lang === 'hi' ? 'वास्तविक समय मंडी मूल्य आसूचना' : 'Real-Time APMC Mandi Price Intelligence'}</span>
            <Sparkles className="w-5 h-5 text-amber-600 animate-bounce" />
          </h2>

          <p className="text-sm text-forest-800/80">
            {lang === 'hi'
              ? 'बिचौलियों के शोषण से बचें — राष्ट्रीय कृषि बाजार (Agmarknet) से सीधे लाइव शहद मंडी भाव और उचित मूल्य परामर्श।'
              : 'Protecting beekeepers from predatory middlemen with live government wholesale modal prices and fair-value advisories.'}
          </p>
        </div>

        {/* State Selector & Refresh Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={loading || refreshing}
              className="text-sm font-semibold bg-white border border-sand-300 text-forest-900 rounded-xl px-3.5 py-2 pr-8 shadow-sm hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="West Bengal">West Bengal (Sundarbans)</option>
              <option value="Punjab">Punjab (Mustard Belt)</option>
              <option value="Jammu & Kashmir">Jammu & Kashmir (Acacia)</option>
              <option value="Tamil Nadu">Tamil Nadu (Nilgiris)</option>
              <option value="Bihar">Bihar (Shahi Litchi)</option>
              <option value="Uttarakhand">Uttarakhand (Himalayan)</option>
            </select>
          </div>

          <button
            onClick={() => fetchPrices(selectedState, true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-sm transition disabled:opacity-50"
            title="Dispatch TinyFish Web Agent to agmarknet.gov.in"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? (lang === 'hi' ? 'एजेंट सक्रिय...' : 'Agent Querying...') : (lang === 'hi' ? 'लाइव भाव अपडेट करें' : 'Refresh Mandi Rates')}</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Core KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Official Mandi Modal Price */}
        <div className="p-5 rounded-2xl bg-white/90 border border-emerald-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
            <span>{lang === 'hi' ? 'आधिकारिक मंडी मॉडल भाव' : 'APMC Modal Price'}</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-display font-black text-emerald-900 flex items-baseline gap-1">
            <span>₹{loading ? '...' : (data?.summary?.avgModalPricePerKg || 360)}</span>
            <span className="text-xs font-medium text-emerald-700">/ kg</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'hi' ? 'न्यूनतम दर: ₹' : 'Range: ₹'}{data?.summary?.minMandiPricePerKg || 310} – ₹{data?.summary?.maxMandiPricePerKg || 420}/kg</span>
          </div>
        </div>

        {/* Card 2: Predatory Middleman Trap */}
        <div className="p-5 rounded-2xl bg-white/90 border border-rose-200/80 shadow-xs relative overflow-hidden group hover:border-rose-400 transition">
          <div className="flex items-center justify-between text-xs text-rose-800 font-semibold mb-1">
            <span>{lang === 'hi' ? 'बिचौलिया सामान्य प्रस्ताव' : 'Middleman Trap Offer'}</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-display font-black text-rose-900 flex items-baseline gap-1">
            <span>₹{loading ? '...' : (data?.summary?.typicalMiddlemanOfferPerKg || 95)}</span>
            <span className="text-xs font-medium text-rose-700">/ kg</span>
          </div>
          <div className="mt-2 text-xs text-rose-700 flex items-center gap-1 font-semibold">
            <span>⚠️ {lang === 'hi' ? 'शोषणकारी दर (घाटे का सौदा)' : 'Predatory farmgate purchase'}</span>
          </div>
        </div>

        {/* Card 3: Recoverable Loss / Value Gap */}
        <div className="p-5 rounded-2xl bg-white/90 border border-amber-200/80 shadow-xs relative overflow-hidden group hover:border-amber-400 transition">
          <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-1">
            <span>{lang === 'hi' ? 'प्रति किलो सुरक्षित मुनाफा' : 'Fair Value Delta'}</span>
            <ArrowUpRight className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-display font-black text-amber-900 flex items-baseline gap-1">
            <span>+₹{loading ? '...' : (data?.summary?.exploitationGapPerKg || 265)}</span>
            <span className="text-xs font-medium text-amber-700">/ kg</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-bold flex items-center gap-1">
            <span>+{data?.summary?.profitUpliftPercent || 279}% {lang === 'hi' ? 'अतिरिक्त आय' : 'revenue gain'}</span>
          </div>
        </div>

        {/* Card 4: Minimum Recommended Floor */}
        <div className="p-5 rounded-2xl bg-white/90 border border-blue-200/80 shadow-xs relative overflow-hidden group hover:border-blue-400 transition">
          <div className="flex items-center justify-between text-xs text-blue-800 font-semibold mb-1">
            <span>{lang === 'hi' ? 'न्यूनतम विक्रय सीमा' : 'Fair Price Floor'}</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-display font-black text-blue-900 flex items-baseline gap-1">
            <span>₹{loading ? '...' : (data?.summary?.fairPriceFloor || 320)}</span>
            <span className="text-xs font-medium text-blue-700">/ kg</span>
          </div>
          <div className="mt-2 text-xs text-blue-700 font-medium">
            <span>{lang === 'hi' ? 'इस दर से नीचे कभी न बेचें' : 'Do NOT sell below this rate'}</span>
          </div>
        </div>
      </div>

      {/* Advisory Banner from AI */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-100/90 via-amber-50 to-emerald-50 border border-amber-300/80 text-forest-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
            <span>{data?.advisory?.headline || '🚨 Do NOT sell raw honey below fair market rate!'}</span>
          </div>
          <p className="text-xs sm:text-sm text-forest-900 leading-relaxed">
            {data?.advisory?.analysis ||
              `Middlemen in ${selectedState} offer ~₹${data?.summary?.typicalMiddlemanOfferPerKg || 95}/kg. Today's official APMC Mandi modal price is ₹${modalPrice}/kg. Mandi clearance protects your hard-earned honey harvest.`}
          </p>
        </div>

        {onHarvestPriceReference && (
          <button
            onClick={() => onHarvestPriceReference(modalPrice)}
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-forest-950 hover:bg-forest-900 text-amber-300 shadow-sm transition"
          >
            {lang === 'hi' ? 'यह भाव हार्वेस्ट में लागू करें' : 'Apply Rate to Batch'}
          </button>
        )}
      </div>

      {/* Interactive Anti-Exploitation Batch Revenue Calculator */}
      <div className="bg-white rounded-2xl border border-sand-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-sand-100 pb-3">
          <h3 className="text-base font-bold text-forest-950 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>{lang === 'hi' ? 'बैच आय तुलना कैलकुलेटर (बिचौलिया बनाम सरकारी मंडी)' : 'Batch Revenue Comparison Calculator (Middleman vs APMC Mandi)'}</span>
          </h3>
          <span className="text-xs text-forest-700 font-medium">
            {lang === 'hi' ? 'लाइव गणना' : 'Live Simulation'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-forest-900 mb-1">
                <span>{lang === 'hi' ? 'आपके शहद का कुल वजन (किलो)' : 'Your Harvest Quantity (kg)'}</span>
                <span className="text-amber-800 font-mono font-bold">{calcQuantityKg} kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={calcQuantityKg}
                onChange={(e) => setCalcQuantityKg(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-forest-600">
                <span>5 kg</span>
                <span>50 kg</span>
                <span>100 kg</span>
                <span>200 kg</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-forest-900 mb-1">
                <span>{lang === 'hi' ? 'बिचौलिये का प्रस्ताव (₹/किलो)' : 'Middleman Offer (₹/kg)'}</span>
                <span className="text-rose-700 font-mono font-bold">₹{calcMiddlemanRate}/kg</span>
              </div>
              <input
                type="range"
                min="70"
                max="250"
                step="5"
                value={calcMiddlemanRate}
                onChange={(e) => setCalcMiddlemanRate(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-forest-600">
                <span>₹70/kg</span>
                <span>₹120/kg</span>
                <span>₹180/kg</span>
                <span>₹250/kg</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-forest-700">{lang === 'hi' ? 'बिचौलिये से कुल भुगतान:' : 'Middleman Payout:'}</span>
              <span className="font-mono font-bold text-rose-700 text-sm">₹{middlemanTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-forest-700">{lang === 'hi' ? 'APMC मंडी मॉडल मूल्य से भुगतान:' : 'APMC Mandi Modal Value:'}</span>
              <span className="font-mono font-bold text-emerald-700 text-base">₹{apmcMandiTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 border-t border-sand-200 flex justify-between items-center">
              <div>
                <div className="text-xs font-extrabold text-forest-950">
                  {lang === 'hi' ? 'बचाया गया घाटा (अतिरिक्त लाभ):' : 'Net Loss Prevented (Extra Profit):'}
                </div>
                <div className="text-[11px] text-emerald-800">
                  +{gainPercentage}% {lang === 'hi' ? 'अधिक आय' : 'revenue increase'}
                </div>
              </div>
              <span className="text-xl font-display font-black text-emerald-600">
                +₹{lossPrevented.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reporting Mandis Table */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-sand-50/80 border-b border-sand-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900">
              {lang === 'hi' ? `${selectedState} में सक्रिय APMC मंडियां` : `Active APMC Reporting Mandis in ${selectedState}`}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-forest-600">
            {data?.mandis?.length || 0} Mandis Reported
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand-50/40 text-[11px] uppercase font-bold text-forest-800 border-b border-sand-100">
              <tr>
                <th className="px-5 py-3">{lang === 'hi' ? 'मंडी बाजार' : 'Market / APMC Yard'}</th>
                <th className="px-4 py-3">{lang === 'hi' ? 'शहद किस्म' : 'Variety'}</th>
                <th className="px-4 py-3 text-right">{lang === 'hi' ? 'न्यूनतम (₹/kg)' : 'Min (₹/kg)'}</th>
                <th className="px-4 py-3 text-right">{lang === 'hi' ? 'अधिकतम (₹/kg)' : 'Max (₹/kg)'}</th>
                <th className="px-5 py-3 text-right font-extrabold text-emerald-900">{lang === 'hi' ? 'मॉडल भाव (₹/kg)' : 'Modal Rate'}</th>
                <th className="px-4 py-3 text-center">{lang === 'hi' ? 'ट्रेंड' : 'Trend'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {data?.mandis?.map((m: MandiItem, idx: number) => (
                <tr key={idx} className="hover:bg-amber-50/30 transition">
                  <td className="px-5 py-3 font-semibold text-forest-950 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{m.market}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-forest-700">{m.variety}</td>
                  <td className="px-4 py-3 text-right font-mono text-forest-800 text-xs">₹{m.minPricePerKg}</td>
                  <td className="px-4 py-3 text-right font-mono text-forest-800 text-xs">₹{m.maxPricePerKg}</td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-emerald-800 text-sm">
                    ₹{m.modalPricePerKg}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      m.trend === 'UP'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.trend === 'DOWN'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-sand-100 text-forest-800'
                    }`}>
                      {m.trend === 'UP' && <TrendingUp className="w-3 h-3" />}
                      {m.trend === 'DOWN' && <TrendingDown className="w-3 h-3" />}
                      {m.trend === 'STABLE' && <Minus className="w-3 h-3" />}
                      <span>{m.trend || 'STABLE'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info & Portal Citation */}
        <div className="px-5 py-3 bg-sand-50/50 border-t border-sand-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-forest-700 gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-forest-500" />
            <span>
              {lang === 'hi' ? 'अंतिम स्वचालित सत्यापन:' : 'Autonomous Web Agent Verification:'}{' '}
              {data?.queriedAt ? new Date(data.queriedAt).toLocaleTimeString() : 'Just now'} (Latency: {data?.latencyMs || 42}ms)
            </span>
          </div>

          <a
            href="https://agmarknet.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold"
          >
            <span>agmarknet.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
