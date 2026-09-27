import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Truck, MapPin, AlertCircle, Check, X, CheckCircle2, Send, Clock } from 'lucide-react';

export const DistributorPortal: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [packagedBatches, setPackagedBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Dispatch Modal State
  const [dispatchingBatch, setDispatchingBatch] = useState<any | null>(null);
  const [deliveringEvent, setDeliveringEvent] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [trackingNumber, setTrackingNumber] = useState('');
  const [origin, setOrigin] = useState('Northern Apex Processing Hub, Kolkata');
  const [destination, setDestination] = useState('National Cold-Chain Distribution Depot, Delhi');
  const [quantity, setQuantity] = useState<string | number>('');
  const [vehicle, setVehicle] = useState('WB-04-TR-9182');
  const [transitTemp, setTransitTemp] = useState('21.4');
  const [recipientSignoff, setRecipientSignoff] = useState('Depot Operations Manager S. Roy');

  const fetchData = async () => {
    try {
      const [overviewRes, packagedRes] = await Promise.allSettled([
        api.getDistributorOverview(),
        api.getDistributorPackagedBatches()
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value.success) {
        setData(overviewRes.value.data);
      }

      if (packagedRes.status === 'fulfilled' && packagedRes.value.success && Array.isArray(packagedRes.value.data)) {
        setPackagedBatches(packagedRes.value.data);
      } else if (overviewRes.status === 'fulfilled' && overviewRes.value.data?.packagedBatches) {
        setPackagedBatches(overviewRes.value.data.packagedBatches);
      }
    } catch (err: any) {
      console.error('Failed to load distributor data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDispatchModal = (batch: any) => {
    setDispatchingBatch(batch);
    setTrackingNumber(`TRK-ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setQuantity(batch.totalQuantityKg ?? 50);
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingBatch) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const res = await api.distributorDispatchBatch(dispatchingBatch.batchNumber, {
        trackingReference: trackingNumber,
        originLocation: origin,
        destinationLocation: destination,
        quantityKg: Number(quantity) || dispatchingBatch.totalQuantityKg,
        vehicleNumber: vehicle,
        transitAmbientTempCelsius: Number(transitTemp)
      });

      if (res.success) {
        setActionSuccess(`Batch ${dispatchingBatch.batchNumber} dispatched under consignment ${trackingNumber}.`);
        setDispatchingBatch(null);
        fetchData();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to dispatch consignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeliverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveringEvent) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const res = await api.distributorDeliverBatch(deliveringEvent.batchNumber, {
        deliverySignoff: recipientSignoff
      });

      if (res.success) {
        setActionSuccess(`Consignment ${deliveringEvent.trackingReference} confirmed delivered.`);
        setDeliveringEvent(null);
        fetchData();
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to confirm delivery');
    } finally {
      setSubmitting(false);
    }
  };

  const activeEvents = (data?.events || []).filter((ev: any) => ['DISPATCHED', 'IN_TRANSIT'].includes(ev.status));
  const deliveredEvents = (data?.events || []).filter((ev: any) => ev.status === 'DELIVERED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-800 text-white flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-forest-950">
                Supply Chain & Distribution Network Portal
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 text-orange-900 border border-orange-300">
                DISTRIBUTOR
              </span>
            </div>
            <p className="text-xs text-sand-800 mt-0.5">
              Operator: <strong className="text-sand-900">{user?.fullName}</strong> • Logistics Partner: {data?.distributorName || 'EcoLogistics'} ({data?.licenseNumber || 'DIST-KVIC-DL-2026'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 font-medium">
            Cold Chain Adherence: {data?.coldChainCompliantRate ?? '99.8%'}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-700 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Packaged Batches Ready for Dispatch</span>
          <p className="font-display font-bold text-3xl text-forest-950">{packagedBatches.length}</p>
          <p className="text-xs text-sand-800">Awaiting consignment pickup</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Consignments In Transit</span>
          <p className="font-display font-bold text-3xl text-forest-950">{activeEvents.length}</p>
          <p className="text-xs text-orange-700 font-medium">Under continuous temperature telemetry</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
          <span className="text-xs font-semibold text-sand-800 uppercase tracking-wide">Confirmed Deliveries</span>
          <p className="font-display font-bold text-3xl text-forest-950">{deliveredEvents.length}</p>
          <p className="text-xs text-emerald-700 font-medium">Delivered to retail & regional depots</p>
        </div>
      </div>

      {/* Section 1: Ready for Dispatch */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-forest-950">Packaged Batches Ready for Dispatch</h3>
            <p className="text-xs text-sand-600">Hermetically sealed and serialized jars ready for cold-chain dispatch</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-900">
            {packagedBatches.length} Ready
          </span>
        </div>

        {packagedBatches.length === 0 ? (
          <p className="text-xs text-sand-600 py-4 text-center">No packaged batches currently awaiting dispatch.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Source / Cluster</th>
                  <th className="p-3">Packaging Info</th>
                  <th className="p-3">Packaging Date</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {packagedBatches.map((b) => (
                  <tr key={b._id || b.id} className="hover:bg-sand-50/70">
                    <td className="p-3 font-mono font-bold text-forest-900">{b.batchNumber}</td>
                    <td className="p-3 text-sand-800">
                      <div>{b.clusterName || b.clusterCode || 'Apiary Cluster'}</div>
                      <div className="text-[10px] text-sand-500 font-sans">{b.floralSource}</div>
                    </td>
                    <td className="p-3 text-sand-800">
                      {b.packageInfo ? (
                        <div>
                          <span className="font-mono font-medium text-forest-800">{b.packageInfo.lotNumber}</span>
                          <span className="text-sand-500 text-[11px] block">{b.packageInfo.unitSizeGrams ? `${b.packageInfo.unitSizeGrams}g Jars` : 'Sterile Jars'}</span>
                        </div>
                      ) : (
                        <span className="text-sand-500 italic">Hermetically Sealed</span>
                      )}
                    </td>
                    <td className="p-3 text-sand-700 font-mono text-[11px]">
                      {b.packageInfo?.packagingDate
                        ? new Date(b.packageInfo.packagingDate).toLocaleDateString()
                        : (b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : 'Recent')}
                    </td>
                    <td className="p-3 font-mono font-bold">{b.totalQuantityKg} kg</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openDispatchModal(b)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-700 hover:bg-orange-800 text-white font-medium text-xs rounded-xl shadow-sm transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Consignment</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Active Consignments in Transit */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-forest-950">Active Consignments In Transit</h3>
            <p className="text-xs text-sand-600">Dispatched shipments moving under refrigerated cold-chain transit</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
            {activeEvents.length} Active
          </span>
        </div>

        {activeEvents.length === 0 ? (
          <p className="text-xs text-sand-600 py-4 text-center">No consignments currently in transit.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Tracking Reference</th>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Transit Ambient Temp</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 font-mono">
                {activeEvents.map((ev: any) => (
                  <tr key={ev._id || ev.id} className="hover:bg-sand-50/70 font-sans">
                    <td className="p-3 font-mono font-bold text-forest-800">{ev.trackingReference}</td>
                    <td className="p-3 font-mono text-sand-900">{ev.batchNumber}</td>
                    <td className="p-3 text-sand-800">{ev.destinationLocation}</td>
                    <td className="p-3 font-mono font-bold">{ev.quantityKg ? `${ev.quantityKg} kg` : (ev.quantity ? `${ev.quantity} kg` : 'N/A')}</td>
                    <td className="p-3 font-mono">{ev.transitAmbientTempCelsius}°C</td>
                    <td className="p-3 text-sand-700">{ev.vehicleNumber}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setDeliveringEvent(ev)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow-sm transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Delivered</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: Confirmed Deliveries */}
      <div className="p-6 rounded-2xl bg-white border border-sand-200 space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-forest-950">Confirmed Deliveries</h3>
          <p className="text-xs text-sand-600">Successfully completed consignments verified at destination depots</p>
        </div>
        {deliveredEvents.length === 0 ? (
          <p className="text-xs text-sand-600 py-4 text-center">No confirmed deliveries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 text-sand-800 uppercase font-semibold">
                <tr>
                  <th className="p-3">Tracking Reference</th>
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Destination Depot</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Delivery Date</th>
                  <th className="p-3">Sign-off</th>
                  <th className="p-3">Transit Temp</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 font-mono">
                {deliveredEvents.map((ev: any) => (
                  <tr key={ev._id || ev.id} className="hover:bg-sand-50/70 font-sans">
                    <td className="p-3 font-mono font-bold text-forest-800">{ev.trackingReference}</td>
                    <td className="p-3 font-mono text-sand-900">{ev.batchNumber}</td>
                    <td className="p-3 text-sand-800">{ev.destinationLocation}</td>
                    <td className="p-3 font-mono font-bold">{ev.quantityKg ? `${ev.quantityKg} kg` : (ev.quantity ? `${ev.quantity} kg` : 'N/A')}</td>
                    <td className="p-3 font-mono text-[11px] text-sand-700">
                      {ev.deliveryDate
                        ? new Date(ev.deliveryDate).toLocaleDateString() + ' ' + new Date(ev.deliveryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : (ev.updatedAt ? new Date(ev.updatedAt).toLocaleDateString() : 'N/A')}
                    </td>
                    <td className="p-3 text-sand-800 text-[11px]">{ev.deliverySignoff || 'Depot Electronic Signature'}</td>
                    <td className="p-3 font-mono">{ev.transitAmbientTempCelsius}°C</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        DELIVERED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Dispatch */}
      {dispatchingBatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl shadow-2xl border border-sand-300 overflow-hidden">
            <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-honey-400" />
                <h3 className="font-bold text-sm">Dispatch Consignment — {dispatchingBatch.batchNumber}</h3>
              </div>
              <button onClick={() => setDispatchingBatch(null)} className="text-sand-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-sand-800 block mb-1">Consignment Tracking Reference *</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-sand-800 block mb-1">Destination Depot *</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-sand-800 block mb-1">Consignment Quantity (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-sand-800 block mb-1">Origin Facility</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-sand-800 block mb-1">Vehicle License</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-sand-800 block mb-1">Transit Ambient Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={transitTemp}
                    onChange={(e) => setTransitTemp(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sand-300 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchingBatch(null)}
                  className="px-4 py-2 border border-sand-300 rounded-xl text-sand-700 hover:bg-sand-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-xl shadow transition"
                >
                  {submitting ? 'Recording on Blockchain...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Deliver */}
      {deliveringEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl shadow-2xl border border-sand-300 overflow-hidden">
            <div className="bg-forest-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-honey-400" />
                <h3 className="font-bold text-sm">Confirm Delivery — {deliveringEvent.trackingReference}</h3>
              </div>
              <button onClick={() => setDeliveringEvent(null)} className="text-sand-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeliverSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-sand-100 rounded-xl space-y-1">
                <span className="text-sand-600 block">Consignment: {deliveringEvent.trackingReference}</span>
                <span className="text-sand-600 block">Batch: {deliveringEvent.batchNumber}</span>
                <span className="font-bold text-forest-950 block">Destination: {deliveringEvent.destinationLocation}</span>
                <span className="text-sand-700 block font-mono">Quantity: {deliveringEvent.quantityKg ? `${deliveringEvent.quantityKg} kg` : (deliveringEvent.quantity ? `${deliveringEvent.quantity} kg` : 'N/A')}</span>
              </div>

              <div>
                <label className="font-semibold text-sand-800 block mb-1">Receiving Depot Sign-off / Signature *</label>
                <input
                  type="text"
                  value={recipientSignoff}
                  onChange={(e) => setRecipientSignoff(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sand-300 bg-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeliveringEvent(null)}
                  className="px-4 py-2 border border-sand-300 rounded-xl text-sand-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl"
                >
                  {submitting ? 'Recording on Blockchain...' : 'Confirm Delivery Handover'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
