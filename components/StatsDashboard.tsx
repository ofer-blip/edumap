
import React, { useMemo } from 'react';
import { School, SchoolType } from '../types';
import { TYPE_LABELS, COLORS } from '../constants';
import { X, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface StatsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  schools: School[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ isOpen, onClose, schools }) => {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    schools.forEach(s => {
      counts[s.type] = (counts[s.type] || 0) + 1;
    });

    return Object.entries(counts).map(([type, value]) => ({
      name: TYPE_LABELS[type as SchoolType].split(' ')[0],
      fullType: type as SchoolType,
      value
    }));
  }, [schools]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-800">ניתוח נתונים ארצי</h2>
              <p className="text-xs text-gray-400 font-bold uppercase">פילוח מוסדות לפי זרם חינוכי</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl text-gray-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroller">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
               <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
               <div className="text-3xl font-black text-blue-900">{schools.length}</div>
               <div className="text-sm font-bold text-blue-400">מוסדות במאגר</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
               <PieChartIcon className="w-8 h-8 text-orange-600 mb-2" />
               <div className="text-3xl font-black text-orange-900">{Object.keys(TYPE_LABELS).length}</div>
               <div className="text-sm font-bold text-orange-400">זרמים חינוכיים</div>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
               <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
               <div className="text-3xl font-black text-green-900">{Array.from(new Set(schools.map(s => s.city))).length}</div>
               <div className="text-sm font-bold text-green-400">ערים ויישובים</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                התפלגות יחסית
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.fullType].replace('bg-', '#')} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                כמות מוסדות לפי סוג
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.fullType].replace('bg-', '#')} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
