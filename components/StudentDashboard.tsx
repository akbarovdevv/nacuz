import React, { useEffect, useState } from 'react';
import { Student, NewsItem } from '../types';
import { DbService } from '../services/db';
import { User, Bell, Download, CreditCard, BookOpen } from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await DbService.getStudentNews();
      setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const getStatusColor = (status: string) => {
    return status === 'To\'landi' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'alert': return 'border-red-500 bg-red-50';
      case 'success': return 'border-green-500 bg-green-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-nac-navy">Xush kelibsiz, {student.firstName}!</h1>
        <p className="text-gray-600">Shaxsiy kabinetingizga marhamat.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
             <div className="bg-nac-navy p-6 text-white text-center">
                <div className="w-20 h-20 bg-nac-gold rounded-full mx-auto mb-3 flex items-center justify-center text-nac-navy font-bold text-2xl">
                   {student.firstName[0]}{student.lastName[0]}
                </div>
                <h2 className="text-xl font-bold">{student.firstName} {student.lastName}</h2>
                <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs mt-2">ID: {student.id}</div>
             </div>
             <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                   <span className="text-gray-500">Viloyat</span>
                   <span className="font-semibold">{student.region}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                   <span className="text-gray-500">Sinf</span>
                   <span className="font-semibold">{student.grade}-sinf</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                   <span className="text-gray-500">Fan</span>
                   <span className="font-semibold">{student.subject}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <span className="text-gray-500">To'lov holati</span>
                   <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(student.paymentStatus)}`}>
                     {student.paymentStatus}
                   </span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen size={18} /> Tezkor Havolalar</h3>
             <div className="space-y-2">
                <button onClick={() => window.print()} className="w-full text-left p-3 rounded bg-gray-50 hover:bg-gray-100 flex items-center gap-2 text-sm text-gray-700 transition">
                  <Download size={16} /> Kvitansiyani yuklash
                </button>
                <button className="w-full text-left p-3 rounded bg-gray-50 hover:bg-gray-100 flex items-center gap-2 text-sm text-gray-700 transition">
                  <CreditCard size={16} /> To'lov qilish (Click/Payme)
                </button>
             </div>
          </div>
        </div>

        {/* Right Column: News & Feed */}
        <div className="md:col-span-2">
           <h2 className="text-2xl font-bold text-nac-navy mb-6 flex items-center gap-2">
             <Bell className="text-nac-gold" /> Yangiliklar va Eslatmalar
           </h2>

           {loading ? (
             <div className="text-center py-10 text-gray-500">Yuklanmoqda...</div>
           ) : (
             <div className="space-y-4">
               {news.map(item => (
                 <div key={item.id} className={`p-6 rounded-lg border-l-4 shadow-sm bg-white ${getTypeColor(item.type)}`}>
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg text-nac-navy">{item.title}</h3>
                       <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded">{item.date}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{item.content}</p>
                 </div>
               ))}
               {news.length === 0 && <p className="text-gray-500 text-center py-8">Hozircha yangiliklar yo'q.</p>}
             </div>
           )}

           {student.score !== undefined && student.score > 0 && (
             <div className="mt-8 bg-gradient-to-r from-blue-900 to-nac-navy p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-2xl font-bold mb-2">Sizning Natijangiz</h3>
                   <div className="text-5xl font-bold text-nac-gold mb-2">{student.score} <span className="text-xl text-white">/ 100</span></div>
                   <p className="text-gray-300">Tabriklaymiz! Sertifikatingizni yuklab olishingiz mumkin.</p>
                   <button className="mt-4 bg-nac-gold text-nac-navy font-bold py-2 px-6 rounded shadow hover:bg-yellow-400 transition">Sertifikatni Yuklash</button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                   <User size={200} />
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};