import { X, MapPin, Trash2, Mountain } from 'lucide-react';
import { WebcamLocation } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedLocations: WebcamLocation[];
  onFlyTo: (loc: WebcamLocation) => void;
  onRemove: (id: string) => void;
}

export default function Sidebar({ isOpen, onClose, savedLocations, onFlyTo, onRemove }: SidebarProps) {
  return (
    <>
      {/* Backdrop (mobile only) */}
      <div 
        className={`fixed inset-0 bg-[#2A2A25]/40 z-[9998] transition-opacity md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#F9F8F3] border-l border-[#E5E2D9] shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-[#E5E2D9] flex flex-row items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2A2A25]">My List</h2>
          <div className="flex items-center gap-3">
             <span className="text-xs text-[#5A5A40] font-bold">{savedLocations.length} Saved</span>
             <button 
               onClick={onClose}
               className="p-1.5 text-[#2A2A25]/60 hover:text-[#5A5A40] hover:bg-[#E5E2D9] rounded-lg transition-colors"
             >
               <X size={18} />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 space-y-3">
          {savedLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#2A2A25]/40 gap-3">
              <MapPin size={48} className="opacity-20" />
              <p className="text-center font-medium">No locations saved yet.</p>
              <p className="text-center text-xs px-4">Explore the map and mark locations as "Hikable" to plan your trip.</p>
            </div>
          ) : (
            savedLocations.map((loc) => (
              <div 
                key={loc.id} 
                className="p-3 bg-white border border-[#E5E2D9] rounded-xl flex gap-3 hover:shadow-sm group transition-shadow"
              >
                <div 
                   className="w-16 h-16 bg-[#E5E2D9] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" 
                   onClick={() => onFlyTo(loc)}
                >
                  <img 
                    src={loc.current_image_url} 
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 
                    className="text-xs font-bold text-[#2A2A25] truncate cursor-pointer hover:text-[#5A5A40]" 
                    onClick={() => onFlyTo(loc)}
                  >
                    {loc.name}
                  </h3>
                  <p className="text-[10px] text-[#2A2A25]/60 italic mt-0.5 mb-2">{loc.altitude_meters}m • Hikable Location</p>
                  
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onRemove(loc.id)}
                      className="text-[10px] uppercase font-bold tracking-wider text-[#5A5A40]/70 hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
