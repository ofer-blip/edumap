
import React from 'react';
import { School, SchoolType } from '../types';
import { TYPE_LABELS, COLORS, TYPE_ICONS } from '../constants';
import { Search, X, MapPin, GraduationCap, ChevronRight, Filter } from 'lucide-react';

interface SidebarProps {
  schools: School[];
  totalCount: number;
  selectedTypes: SchoolType[];
  onToggleType: (type: SchoolType) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSchoolSelect: (id: string) => void;
  selectedId: string | null;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  schools,
  totalCount,
  selectedTypes,
  onToggleType,
  onSelectAll,
  onClearAll,
  onSchoolSelect,
  selectedId,
  onClose,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Mobile Close Button */}
      <div className="md:hidden p-4 border-b flex justify-between items-center">
        <h2 className="font-bold">חיפוש וסינון</h2>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-lg"><X className="w-5 h-5"/></button>
      </div>

      {/* Search Header */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="חפש מוסד או עיר..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pr-10 pl-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3" />
              זרמים חינוכיים
            </h3>
            <div className="flex gap-2 text-[10px] font-bold text-blue-600">
              <button onClick={onSelectAll} className="hover:underline">הכל</button>
              <span className="text-gray-200">|</span>
              <button onClick={onClearAll} className="hover:underline">נקה</button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto scroller pr-1">
            {(Object.keys(TYPE_LABELS) as SchoolType[]).map(type => (
              <label 
                key={type} 
                className={`
                  flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all
                  ${selectedTypes.includes(type) ? 'bg-blue-50 border-blue-100' : 'bg-white border-transparent hover:bg-gray-50'}
                `}
              >
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={selectedTypes.includes(type)} 
                  onChange={() => onToggleType(type)}
                />
                <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] text-white ${COLORS[type]}`}>
                   <i className={`fas ${TYPE_ICONS[type]}`}></i>
                </div>
                <span className="text-xs font-medium text-gray-700 flex-1">{TYPE_LABELS[type]}</span>
                {selectedTypes.includes(type) && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* School List */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50">
        <div className="p-4 flex justify-between items-center border-y border-gray-100 bg-white">
          <h3 className="text-xs font-bold text-gray-500">רשימת מוסדות ({schools.length})</h3>
          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400">סה"כ במאגר: {totalCount}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto scroller p-2 space-y-2">
          {schools.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">לא נמצאו מוסדות התואמים לחיפוש</p>
            </div>
          ) : (
            schools.map(school => (
              <div 
                key={school.id}
                onClick={() => onSchoolSelect(school.id)}
                className={`
                  p-3 rounded-xl border cursor-pointer transition-all group
                  ${selectedId === school.id 
                    ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500/10 scale-[1.02]' 
                    : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate mb-1">{school.name}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{school.city}</span>
                      <span className="text-gray-300">•</span>
                      <GraduationCap className="w-3 h-3 text-gray-400" />
                      <span>{school.grades}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${COLORS[school.type]}`}>
                        {TYPE_LABELS[school.type].split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  <div className={`
                    p-1.5 rounded-lg transition-colors
                    ${selectedId === school.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}
                  `}>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === school.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
