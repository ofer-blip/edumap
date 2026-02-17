
import React from 'react';
import { X, Map as MapIcon, Sparkles, Navigation } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-3xl p-10 text-center flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8 rotate-3">
          <MapIcon className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-4">ברוכים הבאים ל-נתיבים 360</h2>
        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
          המפה הקהילתית המקיפה ביותר לחינוך ייחודי בישראל. 
          גלו מוסדות אנתרופוסופיים, דמוקרטיים, מונטסוריים ועוד - הכל במקום אחד.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
            <Navigation className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-sm text-gray-800">חקירה גיאוגרפית</h3>
            <p className="text-[10px] text-gray-400">חפשו מוסדות לפי מיקום וזרם חינוכי</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h3 className="font-bold text-sm text-gray-800">יועץ AI אישי</h3>
            <p className="text-[10px] text-gray-400">קבלו המלצות פדגוגיות מבוססות בינה מלאכותית</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
        >
          בואו נתחיל
        </button>

        <p className="mt-6 text-[10px] text-gray-300 font-bold uppercase tracking-widest">Version 2.0 • Data Powered by Community</p>
      </div>
    </div>
  );
};

export default WelcomeModal;
