
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Map as MapIcon, 
  Plus, 
  Sparkles, 
  List, 
  ChevronRight, 
  LayoutDashboard, 
  Info,
  Menu,
  X,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { School, SchoolType, GradeCategory } from './types';
import { TYPE_LABELS, COLORS } from './constants';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import AIAdvisorModal from './components/AIAdvisorModal';
import AddSchoolModal from './components/AddSchoolModal';
import StatsDashboard from './components/StatsDashboard';
import WelcomeModal from './components/WelcomeModal';

// Static seed data for fallback/init
const INITIAL_DATA: Partial<School>[] = [
  { name: "נפתלי", type: SchoolType.FOREST, city: "יבניאל", region: "צפון", lat: 32.708, lng: 35.502, grades: "א-ו" },
  { name: "דמוקרטי חדרה", type: SchoolType.DEMO, city: "חדרה", region: "מרכז", lat: 32.436, lng: 34.920, grades: "א-יב" },
  { name: "זומר", type: SchoolType.ANTHRO, city: "רמת גן", region: "מרכז", lat: 32.072, lng: 34.815, grades: "א-ח" },
  { name: "יחד מודיעין", type: SchoolType.MIXED, city: "מודיעין", region: "מרכז", lat: 31.907, lng: 35.007, grades: "א-יב" },
  { name: "מקס ריין", type: SchoolType.BILINGUAL, city: "ירושלים", region: "ירושלים", lat: 31.750, lng: 35.195, grades: "א-יב" },
  { name: "ראשית", type: SchoolType.INCLUSIVE, city: "אלון שבות", region: "ירושלים", lat: 31.656, lng: 35.126, grades: "א-ו" },
  { name: "אבני דרך", type: SchoolType.MONTESSORI, city: "הרצליה", region: "מרכז", lat: 32.162, lng: 34.844, grades: "א-ו" }
];

export default function App() {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<SchoolType[]>(Object.values(SchoolType));
  const [gradeFilter, setGradeFilter] = useState<GradeCategory | 'all'>('all');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<'ai' | 'add' | 'stats' | 'welcome' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Data loading (Simulating Firestore fetch)
  useEffect(() => {
    const saved = localStorage.getItem('netivim_schools');
    if (saved) {
      setSchools(JSON.parse(saved));
    } else {
      const seeded = INITIAL_DATA.map((s, idx) => ({ ...s, id: `seed-${idx}` } as School));
      setSchools(seeded);
      setActiveModal('welcome');
    }
  }, []);

  // Persistence
  useEffect(() => {
    if (schools.length > 0) {
      localStorage.setItem('netivim_schools', JSON.stringify(schools));
    }
  }, [schools]);

  const filteredSchools = useMemo(() => {
    return schools.filter(s => {
      const typeMatch = selectedTypes.includes(s.type);
      const searchMatch = !searchQuery || s.name.includes(searchQuery) || s.city.includes(searchQuery);
      // Grade filter logic would go here if we were using the utility
      return typeMatch && searchMatch;
    });
  }, [schools, selectedTypes, searchQuery]);

  const handleAddSchool = (newSchool: Omit<School, 'id'>) => {
    const school: School = { ...newSchool, id: Date.now().toString() };
    setSchools(prev => [...prev, school]);
    setSelectedSchoolId(school.id);
  };

  const handleSchoolSelect = useCallback((id: string) => {
    setSelectedSchoolId(id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900" dir="rtl">
      {/* Top Header */}
      <header className="h-16 bg-blue-900 text-white flex items-center justify-between px-4 z-[2000] shadow-md border-b border-blue-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg">
              <MapIcon className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">נתיבים 360</h1>
              <span className="text-[10px] text-blue-200 opacity-80">מפת החינוך הייחודי בישראל</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveModal('stats')}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors hidden md:flex items-center gap-2 text-sm font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            <span>סטטיסטיקה</span>
          </button>
          <button 
            onClick={() => setActiveModal('add')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">הוסף מוסד</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div className={`
          fixed md:relative inset-y-0 right-0 z-[1500] 
          transition-all duration-300 transform 
          ${isSidebarOpen ? 'translate-x-0 w-full md:w-[350px] lg:w-[400px]' : 'translate-x-full w-0'}
          bg-white shadow-2xl md:shadow-none border-l border-gray-100 flex flex-col
        `}>
          <Sidebar 
            schools={filteredSchools}
            totalCount={schools.length}
            selectedTypes={selectedTypes}
            onToggleType={(type) => setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
            onSelectAll={() => setSelectedTypes(Object.values(SchoolType))}
            onClearAll={() => setSelectedTypes([])}
            onSchoolSelect={handleSchoolSelect}
            selectedId={selectedSchoolId}
            onClose={() => setIsSidebarOpen(false)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Map View */}
        <div className="flex-1 relative z-0">
          <MapComponent 
            schools={filteredSchools} 
            onMarkerClick={handleSchoolSelect}
            selectedId={selectedSchoolId}
          />

          {/* Floating AI Trigger */}
          <button 
            onClick={() => setActiveModal('ai')}
            className="absolute bottom-6 right-6 z-[1000] bg-white text-blue-600 p-4 rounded-full shadow-2xl border border-blue-50 hover:scale-110 active:scale-95 transition-all animate-bounce group"
            title="יועץ חינוכי AI"
          >
            <Sparkles className="w-6 h-6 group-hover:text-yellow-500" />
            <span className="absolute -top-1 -left-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </button>

          {/* Mobile Overlay Toggle */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 right-4 z-[1000] md:hidden bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-100"
            >
              <Search className="w-6 h-6 text-blue-600" />
            </button>
          )}
        </div>
      </main>

      {/* Modals */}
      <AIAdvisorModal 
        isOpen={activeModal === 'ai'} 
        onClose={() => setActiveModal(null)} 
        schools={schools}
      />
      <AddSchoolModal 
        isOpen={activeModal === 'add'} 
        onClose={() => setActiveModal(null)}
        onSave={handleAddSchool}
      />
      <StatsDashboard 
        isOpen={activeModal === 'stats'} 
        onClose={() => setActiveModal(null)}
        schools={schools}
      />
      <WelcomeModal 
        isOpen={activeModal === 'welcome'} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
}
