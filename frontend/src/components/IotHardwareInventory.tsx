import React, { useState } from 'react';
import {
  Cpu,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Wifi,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { HiveDto } from '../types';

export interface IotDevice {
  sensorId: string;
  hiveCode: string;
  hiveName: string;
  hardwareNode: string;
  batteryLevel: number; // percentage 0-100
  signalRssi: number; // in dBm, e.g. -68
  signalQuality: 'Strong' | 'Moderate' | 'Weak';
  firmware: string;
  lastSeen: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  activeTelemetry: {
    temp: number;
    humidity: number;
    weight: number;
  };
}

const DEFAULT_DEVICES: IotDevice[] = [
  {
    sensorId: 'SENS-HIVE-001-A',
    hiveCode: 'SUN-HIVE-001',
    hiveName: 'Alpha Brood Chamber 01',
    hardwareNode: 'ESP32-WROOM-32D / LoRaWAN Node v2.4',
    batteryLevel: 92,
    signalRssi: -68,
    signalQuality: 'Strong',
    firmware: 'v2.4.1-kvic-prod',
    lastSeen: 'Just now (18s ago)',
    status: 'ONLINE',
    activeTelemetry: { temp: 34.5, humidity: 58, weight: 42.0 }
  },
  {
    sensorId: 'SENS-HIVE-002-B',
    hiveCode: 'SUN-HIVE-002',
    hiveName: 'Beta Super Chamber 02',
    hardwareNode: 'ESP32-WROOM-32D / LoRaWAN Node v2.4',
    batteryLevel: 78,
    signalRssi: -79,
    signalQuality: 'Moderate',
    firmware: 'v2.4.1-kvic-prod',
    lastSeen: '2 mins ago',
    status: 'ONLINE',
    activeTelemetry: { temp: 35.1, humidity: 62, weight: 38.5 }
  },
  {
    sensorId: 'SENS-HIVE-003-C',
    hiveCode: 'SUN-HIVE-003',
    hiveName: 'Gamma Nuc Colony 03',
    hardwareNode: 'Nordic nRF52840 BLE/Cellular IoT',
    batteryLevel: 24,
    signalRssi: -94,
    signalQuality: 'Weak',
    firmware: 'v2.3.8-kvic-legacy',
    lastSeen: '14 mins ago',
    status: 'WARNING',
    activeTelemetry: { temp: 37.2, humidity: 71, weight: 33.0 }
  },
  {
    sensorId: 'SENS-HIVE-004-D',
    hiveCode: 'SUN-HIVE-004',
    hiveName: 'Delta Forest Comb 04',
    hardwareNode: 'ESP32-WROOM-32D / LoRaWAN Node v2.4',
    batteryLevel: 0,
    signalRssi: -115,
    signalQuality: 'Weak',
    firmware: 'v2.4.0-kvic-prod',
    lastSeen: '3 days ago',
    status: 'OFFLINE',
    activeTelemetry: { temp: 0, humidity: 0, weight: 0 }
  }
];

interface Props {
  hives?: HiveDto[];
  selectedHiveCode?: string;
  onSelectHive?: (hiveCode: string) => void;
  lang?: 'en' | 'hi';
}

export const IotHardwareInventory: React.FC<Props> = ({
  hives = [],
  selectedHiveCode = 'SUN-HIVE-001',
  onSelectHive,
  lang = 'en'
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'WARNING' | 'OFFLINE'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Match devices with existing hives if available, fallback to pre-configured realistic IoT cards
  const devices = DEFAULT_DEVICES.map(device => {
    const matchedHive = hives.find(h => h.hiveCode === device.hiveCode);
    if (matchedHive) {
      return {
        ...device,
        hiveName: `${matchedHive.hiveCode} (${matchedHive.beeSpecies || 'Apis cerana'})`
      };
    }
    return device;
  });

  const filteredDevices = filter === 'ALL'
    ? devices
    : devices.filter(d => d.status === filter);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const getBatteryIcon = (level: number) => {
    if (level > 80) return <BatteryCharging className="w-4 h-4 text-emerald-600" />;
    if (level > 30) return <Battery className="w-4 h-4 text-amber-600" />;
    return <BatteryWarning className="w-4 h-4 text-red-600" />;
  };

  const getBatteryBg = (level: number) => {
    if (level > 80) return 'bg-emerald-500';
    if (level > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-sand-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-forest-900 text-honey-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-forest-950">
              {lang === 'hi' ? 'आईओटी हार्डवेयर और डिवाइस इन्वेंटरी' : 'IoT Hardware & Device Inventory'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
              {devices.filter(d => d.status === 'ONLINE').length}/{devices.length} NODES ACTIVE
            </span>
          </div>
          <p className="text-xs text-sand-700 mt-1">
            {lang === 'hi'
              ? 'छत्तों में स्थापित सेंसर हार्डवेयर, बैटरी स्थिति, वायरलेस सिग्नल और फर्मवेयर संस्करण की निगरानी।'
              : 'Physical telemetry hardware nodes, battery capacity, LoRaWAN signal reception, and firmware build integrity.'}
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="inline-flex p-1 bg-sand-100 rounded-xl text-xs font-semibold">
            {(['ALL', 'ONLINE', 'WARNING', 'OFFLINE'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === tab
                    ? 'bg-white text-forest-950 font-bold shadow-sm'
                    : 'text-sand-700 hover:text-forest-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-sand-300 bg-white hover:bg-sand-50 text-sand-800 transition"
            title="Poll telemetry beacons"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-honey-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDevices.map((device) => {
          const isSelected = selectedHiveCode === device.hiveCode;

          return (
            <div
              key={device.sensorId}
              onClick={() => onSelectHive && onSelectHive(device.hiveCode)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative ${
                isSelected
                  ? 'border-honey-500 bg-amber-500/5 ring-1 ring-honey-500 shadow-sm'
                  : 'border-sand-200 bg-sand-50/50 hover:bg-white hover:border-sand-300 shadow-xs'
              }`}
            >
              {/* Top Row: Sensor ID & Status Badge */}
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-xs font-bold text-forest-950 bg-white px-2 py-0.5 rounded-md border border-sand-200">
                  {device.sensorId}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    device.status === 'ONLINE'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : device.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-sand-200 text-sand-800 border border-sand-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      device.status === 'ONLINE'
                        ? 'bg-emerald-600'
                        : device.status === 'WARNING'
                        ? 'bg-amber-600'
                        : 'bg-sand-500'
                    }`}
                  />
                  <span>{device.status}</span>
                </span>
              </div>

              {/* Hive Pairing */}
              <div>
                <span className="text-[10px] font-semibold text-sand-500 uppercase tracking-wider block">
                  Installed Hive
                </span>
                <p className="font-bold text-sm text-forest-950 truncate">
                  {device.hiveCode}
                </p>
                <p className="text-[11px] text-sand-600 truncate">{device.hiveName}</p>
              </div>

              {/* Hardware Node Specs */}
              <div className="p-2.5 rounded-xl bg-white/80 border border-sand-200 text-xs space-y-1">
                <span className="text-[10px] text-sand-500 block">Hardware Node</span>
                <p className="font-mono text-[11px] font-medium text-forest-900 leading-tight">
                  {device.hardwareNode}
                </p>
              </div>

              {/* Battery Level Gauge */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-sand-600 flex items-center gap-1">
                    {getBatteryIcon(device.batteryLevel)}
                    <span>Battery Level</span>
                  </span>
                  <span className="font-mono font-bold text-forest-950 text-[11px]">
                    {device.batteryLevel}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-sand-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBatteryBg(device.batteryLevel)}`}
                    style={{ width: `${device.batteryLevel}%` }}
                  />
                </div>
              </div>

              {/* Signal & Firmware Specs */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-sand-100 text-[11px]">
                <div>
                  <span className="text-[10px] text-sand-500 block flex items-center gap-0.5">
                    <Wifi className="w-3 h-3 text-sand-400" />
                    <span>Signal/RSSI</span>
                  </span>
                  <span className="font-mono font-semibold text-forest-900">
                    {device.signalRssi} dBm
                  </span>
                  <span className="text-[9px] text-sand-500 block">({device.signalQuality})</span>
                </div>

                <div>
                  <span className="text-[10px] text-sand-500 block">Firmware</span>
                  <span className="font-mono font-semibold text-sand-800 text-[10px] truncate block">
                    {device.firmware}
                  </span>
                </div>
              </div>

              {/* Last Seen Timestamp */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-sand-500 border-t border-sand-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sand-400" />
                  <span>Last Seen:</span>
                </span>
                <span className="font-medium text-forest-950">{device.lastSeen}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Note */}
      <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200 flex items-center justify-between text-[11px] text-sand-600">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-honey-600 shrink-0" />
          <span>LoRaWAN 868MHz Gateway gateway syncs every 15 minutes. Hardware telemetry is demo / simulated.</span>
        </span>
        <span className="text-sand-500 font-mono">Gateway: GW-SDR-AP-01</span>
      </div>
    </div>
  );
};
