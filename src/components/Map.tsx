import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { WebcamLocation } from '../types';
import { defaultMarkerIcon, savedMarkerIcon } from '../lib/leaflet-icons';
import { ExternalLink, Check, BookmarkPlus, Mountain } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  locations: WebcamLocation[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  focusedLocation: WebcamLocation | null;
}

// Helper to center map on selection
function MapController({ focusedLocation }: { focusedLocation: WebcamLocation | null }) {
  const map = useMap();
  useEffect(() => {
    if (focusedLocation) {
      map.flyTo([focusedLocation.latitude, focusedLocation.longitude], 13, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [focusedLocation, map]);
  return null;
}

function WebcamPopupCard({ loc, isSaved, onToggleSave }: { loc: WebcamLocation, isSaved: boolean, onToggleSave: (id: string) => void }) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  return (
    <div className="flex flex-col bg-white w-[320px] sm:w-[400px]">
      {/* Header Photo */}
      <div className="relative h-56 bg-[#E5E2D9]">
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/40 to-transparent p-4 z-10 flex">
          <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow-sm whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Cached 12:00 CEST
          </span>
        </div>
        <img 
          src={loc.current_image_url} 
          alt={`Webcam ${loc.name}`} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Info Body */}
      <div className="p-6 space-y-4">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-serif italic text-[#5A5A40] leading-tight m-0">{loc.name}</h3>
            <span className="text-xs font-mono font-bold bg-[#F9F8F3] text-[#5A5A40] px-2 py-1 border border-[#E5E2D9] rounded shrink-0 shadow-sm">
              {loc.altitude_meters}m
            </span>
          </div>
          <p className="text-[11px] text-[#2A2A25]/60 mt-2 uppercase tracking-tight">Altitude Rating</p>
        </div>

        {/* Expandable Description */}
        <div 
          className="cursor-pointer group flex flex-col rounded-lg -mx-2 p-2 hover:bg-[#F9F8F3] transition-colors"
          onClick={() => setIsDescExpanded(!isDescExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]/70 group-hover:text-[#5A5A40] transition-colors">
              {isDescExpanded ? 'Hide Information ↑' : 'Show Information ↓'}
            </span>
            <div className="flex-1 h-px bg-[#E5E2D9] group-hover:bg-[#5A5A40]/20 transition-colors"></div>
          </div>
          
          {isDescExpanded && (
            <p className="text-xs text-[#2A2A25]/80 leading-relaxed m-0 mt-2 animate-fade-in">
              {loc.location_description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onToggleSave(loc.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-opacity flex justify-center items-center gap-2 ${
              isSaved 
                ? "bg-[#5A5A40] text-white hover:opacity-90 shadow-md" 
                : "bg-[#FDFCF8] border border-[#E5E2D9] text-[#5A5A40] hover:bg-[#F9F8F3]"
            }`}
          >
            {isSaved ? "Hikable ✓ Saved" : "Mark Hikable"}
          </button>
          <a 
            href={loc.webcam_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-3 border border-[#E5E2D9] rounded-xl hover:bg-[#F9F8F3] transition-colors text-[#5A5A40] flex items-center justify-center shrink-0"
            title="Live Webcam"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MapComponent({ locations, savedIds, onToggleSave, focusedLocation }: MapComponentProps) {
  // Center of Bavarian Alps initially
  const ALPS_CENTER: [number, number] = [47.5, 11.5];

  return (
    <div className="w-full h-full z-0 relative">
      <MapContainer 
        center={ALPS_CENTER} 
        zoom={9} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((loc) => {
          const isSaved = savedIds.includes(loc.id);
          
          return (
            <Marker 
              key={loc.id} 
              position={[loc.latitude, loc.longitude]}
              icon={isSaved ? savedMarkerIcon : defaultMarkerIcon}
            >
              <Popup className="custom-popup" maxWidth={440} minWidth={320}>
                <WebcamPopupCard 
                  loc={loc} 
                  isSaved={isSaved} 
                  onToggleSave={onToggleSave} 
                />
              </Popup>
            </Marker>
          );
        })}
        
        <MapController focusedLocation={focusedLocation} />
      </MapContainer>
    </div>
  );
}
