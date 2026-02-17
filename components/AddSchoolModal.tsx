
import React, { useState } from 'react';
import { School, SchoolType } from '../types';
import { TYPE_LABELS } from '../constants';
import { X, MapPin, Search, Loader2 } from 'lucide-react';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (school: Omit<School, 'id'>) => void;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    type: SchoolType.DEMO,
    grades: ''
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeocoding(true);

    try {
      // Mock Geocoding using OSM Nominatim
      const query = `${formData.address}, ${formData.city}, Israel`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();

      if (data && data.length > 0) {
        onSave({
          ...formData,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          region: 'מרכז' // Simplification
        });
        onClose();
      } else {
        alert("לא הצלחנו למצוא את המיקום. אנא נסה כתובת מדויקת יותר.");
      }
    } catch (err) {
      console.error(err);
      alert("שגיאה בחיפוש המיקום.");
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-200">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">הוספת מוסד חדש</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg text-gray-400"><X className="w-5 h-5"/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">שם המוסד</label>
            <input 
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="למשל: דמוקרטי לב השרון"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">סוג</label>
              <select 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as SchoolType})}
              >
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">שכבות גיל</label>
              <input 
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="א-יב"
                value={formData.grades}
                onChange={e => setFormData({...formData, grades: e.target.value})}
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
             <div className="flex items-center gap-2 text-blue-700 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold">מיקום גיאוגרפי</span>
             </div>
             <div className="grid grid-cols-2 gap-2">
                <input 
                  required
                  className="bg-white border border-blue-100 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
                  placeholder="עיר"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
                <input 
                  required
                  className="bg-white border border-blue-100 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
                  placeholder="רחוב ומספר"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
             </div>
             <p className="text-[10px] text-blue-400 leading-tight">נשתמש בשירותי מפות כדי למקם את המוסד באופן אוטומטי על המפה.</p>
          </div>

          <button 
            type="submit" 
            disabled={isGeocoding}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGeocoding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>מחשב מיקום...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>שמור והוסף למפה</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSchoolModal;
