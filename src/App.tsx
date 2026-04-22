import { useEffect, useState, useMemo } from 'react';
import MapComponent from './components/Map';
import Sidebar from './components/Sidebar';
import ElevationDropdown from './components/ElevationDropdown';
import { WebcamLocation, ElevationFilter } from './types';
import { Mountain, Map as MapIcon, Bookmark } from 'lucide-react';

export default function App() {
  const [locations, setLocations] = useState<WebcamLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [elevationFilter, setElevationFilter] = useState<ElevationFilter>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState<WebcamLocation | null>(null);

  // Load saved IDs on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('alpen_saved_hikable');
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch(e) {
      console.error("Local storage error:", e);
    }
  }, []);

  // Sync saved IDs to local storage
  useEffect(() => {
    localStorage.setItem('alpen_saved_hikable', JSON.stringify(savedIds));
  }, [savedIds]);

  // Fetch data from our full-stack endpoint
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/webcams');
        if (!response.ok) throw new Error("Failed to load webcams");
        const data = await response.json();
        setLocations(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds(prev => 
      prev.includes(id) 
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id]
    );
  };

  const navigateToLocation = (loc: WebcamLocation) => {
    setFocusedLocation(loc);
    setIsSidebarOpen(false);
  };

  // Filter locations based on elevation
  const filteredLocations = useMemo(() => {
    if (!elevationFilter) return locations;
    const [min, max] = elevationFilter;
    return locations.filter(loc => loc.altitude_meters >= min && loc.altitude_meters < max);
  }, [locations, elevationFilter]);

  const savedLocations = useMemo(() => {
    return locations.filter(loc => savedIds.includes(loc.id));
  }, [locations, savedIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <Mountain size={48} className="text-gray-300 animate-pulse mb-4" />
        <h1 className="text-xl font-medium text-gray-600 tracking-tight">Loading Alpine Maps...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-red-500">
        <h1 className="text-xl font-bold">Error loading map data</h1>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans bg-[#FDFCF8] text-[#2A2A25] flex flex-col">
      {/* Header Overlay Layer */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-[1000] flex flex-col sm:flex-row justify-between items-start gap-4 pointer-events-none">
        
        {/* Logo / Brand Area */}
        <div className="bg-[#FDFCF8]/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-[#E5E2D9] flex items-center gap-4 pointer-events-auto">
          <div>
            <h1 className="text-2xl font-serif italic font-bold text-[#5A5A40] leading-none">AlpenCam</h1>
            <p className="text-[10px] font-bold text-[#2A2A25]/60 uppercase tracking-widest mt-1.5">Bavaria Planner</p>
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 pointer-events-auto">
          <ElevationDropdown 
            value={elevationFilter} 
            onChange={setElevationFilter} 
          />
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-[#5A5A40] hover:bg-[#5A5A40]/90 text-white px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 group"
          >
            <Bookmark size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            <span className="mt-0.5">My Plan</span>
            {savedIds.length > 0 && (
              <span className="ml-1 bg-white text-[#5A5A40] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                {savedIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Map Layer */}
      <main className="flex-1 w-full h-full">
        <MapComponent 
          locations={filteredLocations}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          focusedLocation={focusedLocation}
        />
      </main>

      {/* Sidebar Overlay */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        savedLocations={savedLocations}
        onFlyTo={navigateToLocation}
        onRemove={toggleSave}
      />
    </div>
  );
}
