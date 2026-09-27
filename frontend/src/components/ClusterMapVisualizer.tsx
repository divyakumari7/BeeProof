import React, { useState } from 'react';
import { ClusterDto } from '../types';
import { MapPin, Navigation, Info, Eye } from 'lucide-react';

interface Props {
  clusters: ClusterDto[];
  onSelectCluster: (cluster: ClusterDto) => void;
}

export const ClusterMapVisualizer: React.FC<Props> = ({ clusters, onSelectCluster }) => {
  const [hoveredCluster, setHoveredCluster] = useState<ClusterDto | null>(null);

  // Convert Indian geo-coordinates (Lat ~8 to 35, Long ~68 to 97) to SVG viewbox percentages (800 x 600)
  const getCoordinates = (lat: number, lng: number) => {
    // Normalization bounds for India
    const minLat = 7.5;
    const maxLat = 35.5;
    const minLng = 68.0;
    const maxLng = 97.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    // Invert y because latitude increases upwards
    const y = 550 - ((lat - minLat) / (maxLat - minLat)) * 500;
    return { x, y };
  };

  return (
    <div className="bg-forest-950 text-white rounded-2xl border border-sand-800 shadow-md p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-honey-400" />
            <h3 className="font-display font-bold text-base text-white">
              National Honey Cluster Geographic Visualizer
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-honey-300 border border-amber-500/40">
              DEMO / APPROXIMATE GEOGRAPHIC LOCATIONS
            </span>
          </div>
          <p className="text-xs text-sand-400 mt-1">
            Real-time geospatial representation of KVIC apiary clusters across Indian biogeographical zones
          </p>
        </div>
        <div className="text-xs text-sand-400 flex items-center gap-1.5 bg-forest-900/60 px-3 py-1.5 rounded-xl border border-sand-800">
          <Info className="w-3.5 h-3.5 text-honey-400" />
          <span>Click on any cluster pin to inspect hierarchical drill-down</span>
        </div>
      </div>

      {/* Interactive Map Canvas */}
      <div className="relative w-full h-[420px] bg-[#0c1813] rounded-xl border border-forest-800/80 overflow-hidden flex items-center justify-center">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
          {/* Stylized Abstract Outline of India */}
          <path
            d="M 280 90 L 320 60 L 350 70 L 380 120 L 400 170 L 460 180 L 520 200 L 580 190 L 640 210 L 610 250 L 530 250 L 490 280 L 480 340 L 420 400 L 380 480 L 360 540 L 340 540 L 320 470 L 290 400 L 240 330 L 200 300 L 200 240 L 230 190 L 260 140 Z"
            fill="#14261d"
            stroke="#2d4a3b"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="transition-all"
          />

          {/* Regional connecting lines */}
          {clusters.map((cl, idx) => {
            const current = getCoordinates(cl.latitude, cl.longitude);
            const next = getCoordinates(
              clusters[(idx + 1) % clusters.length].latitude,
              clusters[(idx + 1) % clusters.length].longitude
            );
            return (
              <line
                key={`line-${cl.id}`}
                x1={current.x}
                y1={current.y}
                x2={next.x}
                y2={next.y}
                stroke="#d4af37"
                strokeWidth="1"
                strokeOpacity="0.2"
                strokeDasharray="2 4"
              />
            );
          })}

          {/* Cluster Markers */}
          {clusters.map((cl) => {
            const coords = getCoordinates(cl.latitude, cl.longitude);
            const isHovered = hoveredCluster?.id === cl.id;

            return (
              <g
                key={cl.id}
                className="cursor-pointer transition-transform duration-300"
                onClick={() => onSelectCluster(cl)}
                onMouseEnter={() => setHoveredCluster(cl)}
                onMouseLeave={() => setHoveredCluster(null)}
              >
                {/* Outer animated pulse ring */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 24 : 16}
                  className="fill-honey-400/20 animate-ping"
                />
                {/* Secondary ring */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 14 : 9}
                  fill="#d4af37"
                  fillOpacity={isHovered ? 0.9 : 0.6}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2 : 1}
                />
                {/* Inner dot */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={4}
                  fill="#ffffff"
                />

                {/* Pin Label */}
                <text
                  x={coords.x}
                  y={coords.y - 15}
                  textAnchor="middle"
                  className={`text-[11px] font-sans font-bold fill-sand-200 transition-all ${
                    isHovered ? 'fill-honey-300 scale-110 font-extrabold' : ''
                  }`}
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {cl.name.split(' ')[0]} ({cl.clusterCode})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredCluster && (
          <div className="absolute top-4 right-4 z-20 w-72 p-4 rounded-xl bg-forest-900/95 backdrop-blur-md border border-honey-500/50 shadow-2xl text-xs space-y-2 pointer-events-none animate-fadeIn">
            <div className="flex items-center justify-between border-b border-sand-700/60 pb-2">
              <span className="font-bold text-white text-sm">{hoveredCluster.name}</span>
              <span className="font-mono text-honey-400 font-bold">{hoveredCluster.clusterCode}</span>
            </div>
            <div className="space-y-1 text-sand-300 text-[11px]">
              <div><strong className="text-sand-100">State / Region:</strong> {hoveredCluster.district}, {hoveredCluster.state}</div>
              <div><strong className="text-sand-100">Flora:</strong> {hoveredCluster.predominantFlora}</div>
              <div className="flex justify-between pt-1">
                <span>Active Hives: <strong className="text-white font-mono">{hoveredCluster.hiveCount}</strong></span>
                <span>Beekeepers: <strong className="text-white font-mono">{hoveredCluster.beekeeperCount}</strong></span>
              </div>
              <div className="text-[10px] text-sand-400 font-mono pt-1">
                Lat: {Number(hoveredCluster.latitude ?? 0).toFixed(2)}°N | Long: {Number(hoveredCluster.longitude ?? 0).toFixed(2)}°E
              </div>
            </div>
            <div className="pt-2 text-[10px] text-honey-400 flex items-center justify-end gap-1 font-semibold">
              <Eye className="w-3 h-3" />
              <span>Click to view cluster hierarchy</span>
            </div>
          </div>
        )}
      </div>

      {/* Cluster Quick Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {clusters.map((cl) => (
          <button
            key={cl.id}
            onClick={() => onSelectCluster(cl)}
            className="p-3 rounded-xl bg-forest-900/50 hover:bg-forest-900 border border-sand-800 hover:border-honey-500/60 text-left transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-mono text-honey-400 font-bold">{cl.clusterCode}</span>
              <h4 className="text-xs font-semibold text-white group-hover:text-honey-300 truncate">
                {cl.name}
              </h4>
              <p className="text-[11px] text-sand-400">{cl.state}</p>
            </div>
            <Eye className="w-4 h-4 text-sand-500 group-hover:text-honey-400 shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
};
