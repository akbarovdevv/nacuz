import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Hero, AboutSection, PrizesSection } from './components/Hero';
import { Registration } from './components/Registration';
import { AdminPanel } from './components/AdminPanel';
import { StudentLogin } from './components/StudentLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { DbService } from './services/db';
import { FileText, Search, Download } from 'lucide-react';
import { Student, GalleryItem, SamplePaper } from './types';
import { SUBJECTS } from './constants';

function App() {
  const [page, setPage] = useState('home');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<Student | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');

  // Auth State
  const [currentUser, setCurrentUser] = useState<Student | null>(null);

  // Dynamic Data
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [samplePapers, setSamplePapers] = useState<SamplePaper[]>([]);

  useEffect(() => {
    if (page === 'gallery') {
      DbService.getGalleryItems().then(setGalleryItems);
    }
    if (page === 'samples') {
      DbService.getSamplePapers().then(setSamplePapers);
    }
  }, [page]);

  // Handle auto-login from registration or manual login
  const handleLoginSuccess = (student: Student) => {
    setCurrentUser(student);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('home');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchStatus('loading');
    const res = await DbService.getStudentById(searchId);
    if (res) {
      setSearchResult(res);
      setSearchStatus('found');
    } else {
      setSearchStatus('not-found');
    }
  };

  const renderContent = () => {
    switch (page) {
      case 'home':
        return (
          <>
            <Hero onRegister={() => setPage('register')} />
            <AboutSection />
            <PrizesSection />
          </>
        );
      case 'about':
        return (
           <div className="max-w-4xl mx-auto py-12 px-4">
             <h1 className="text-4xl font-serif font-bold text-nac-navy mb-8">About NAC</h1>
             <div className="prose lg:prose-xl text-gray-700">
                <p className="font-medium text-lg">National Academic Challenge (NAC) — 1–6-sinf o‘quvchilari uchun matematika va ingliz tili fanlaridan tashkil etiladigan nodavlat, mustaqil akademik olimpiada.</p>
                <h3 className="text-2xl font-bold mt-6 mb-2">Maqsad va Vazifalar</h3>
                <ul className="list-disc pl-5">
                   <li>Iqtidorli va bilimga chanqoq o‘quvchilarni aniqlash.</li>
                   <li>Mantiqiy fikrlashni rivojlantirish.</li>
                   <li>Akademik raqobat madaniyatini shakllantirish.</li>
                </ul>
                <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                   <h3 className="font-bold text-nac-navy mb-4">Yuridik Qoidalar</h3>
                   <p className="text-sm">NAC nodavlat, mustaqil akademik olimpiada bo‘lib, davlat attestatsiyasi o‘rnini bosmaydi. To‘lovlar qaytarilmaydi.</p>
                </div>
             </div>
           </div>
        );
      case 'register':
        if (currentUser) {
          // If already logged in, show dashboard instead of register
          setPage('dashboard');
          return null; 
        }
        return <Registration onAutoLogin={handleLoginSuccess} />;
      
      case 'student-login':
         return <StudentLogin onLoginSuccess={handleLoginSuccess} onRegisterClick={() => setPage('register')} />;

      case 'dashboard':
        if (!currentUser) {
          setPage('student-login');
          return null;
        }
        return <StudentDashboard student={currentUser} />;

      case 'admin':
        return <AdminPanel />;
      
      case 'samples':
         // Group papers by subject
         const mathPapers = samplePapers.filter(p => p.subject.includes('Mat'));
         const engPapers = samplePapers.filter(p => p.subject.includes('Ing'));

         return (
           <div className="max-w-7xl mx-auto py-12 px-4 text-center">
             <h2 className="text-3xl font-serif font-bold mb-8 text-nac-navy">Sample Papers</h2>
             <p className="mb-8 text-gray-600">Quyidagi namunaviy testlarni yuklab oling va tayyorgarlik ko'ring.</p>
             
             {samplePapers.length === 0 && <p className="text-gray-500 italic">Hozircha namunalar yuklanmagan.</p>}

             <div className="grid md:grid-cols-2 gap-8">
                {/* Math Column */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                   <h3 className="text-xl font-bold text-nac-blue mb-4">Matematika</h3>
                   <div className="flex flex-col gap-2">
                      {mathPapers.length > 0 ? mathPapers.sort((a,b) => a.grade - b.grade).map(p => (
                        <a key={p.id} href={p.fileUrl} download={p.fileName} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 text-sm group">
                           <span className="flex items-center gap-2"><FileText size={16} className="text-nac-gold" /> {p.grade}-sinf</span>
                           <Download size={16} className="text-gray-400 group-hover:text-nac-navy" />
                        </a>
                      )) : <p className="text-sm text-gray-400">Fayllar yo'q</p>}
                   </div>
                </div>

                {/* English Column */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                   <h3 className="text-xl font-bold text-nac-blue mb-4">Ingliz tili</h3>
                   <div className="flex flex-col gap-2">
                      {engPapers.length > 0 ? engPapers.sort((a,b) => a.grade - b.grade).map(p => (
                        <a key={p.id} href={p.fileUrl} download={p.fileName} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 text-sm group">
                           <span className="flex items-center gap-2"><FileText size={16} className="text-nac-gold" /> {p.grade}-sinf</span>
                           <Download size={16} className="text-gray-400 group-hover:text-nac-navy" />
                        </a>
                      )) : <p className="text-sm text-gray-400">Fayllar yo'q</p>}
                   </div>
                </div>
             </div>
           </div>
         );
      case 'results':
        return (
          <div className="max-w-xl mx-auto py-20 px-4 min-h-[60vh]">
             <div className="text-center mb-10">
               <h2 className="text-3xl font-serif font-bold text-nac-navy">Natijalarni Tekshirish</h2>
               <p className="text-gray-600 mt-2">ID raqamingizni kiriting</p>
             </div>
             <form onSubmit={handleSearch} className="relative mb-8">
               <input 
                 value={searchId}
                 onChange={(e) => setSearchId(e.target.value)}
                 className="w-full p-4 pl-6 pr-14 border-2 border-gray-300 rounded-full focus:outline-none focus:border-nac-gold text-lg shadow-sm"
                 placeholder="NAC-2026-XXXX"
               />
               <button type="submit" className="absolute right-2 top-2 bg-nac-navy text-white p-2.5 rounded-full hover:bg-blue-900 transition">
                  <Search size={24} />
               </button>
             </form>
             
             {searchStatus === 'loading' && <div className="text-center text-gray-500">Qidirilmoqda...</div>}
             {searchStatus === 'not-found' && <div className="text-center text-red-500 font-bold bg-red-50 p-4 rounded-lg">Bunday ID topilmadi. Qaytadan tekshiring.</div>}
             
             {searchStatus === 'found' && searchResult && (
               <div className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-nac-gold text-center">
                 <h3 className="text-2xl font-bold text-nac-navy mb-1">{searchResult.firstName} {searchResult.lastName}</h3>
                 <p className="text-gray-500 mb-6">{searchResult.grade}-sinf | {searchResult.subject}</p>
                 
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-500">Viloyat</div>
                      <div className="font-semibold">{searchResult.region}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-500">To'lov</div>
                      <div className={`font-bold ${searchResult.paymentStatus.includes('To') ? 'text-green-600' : 'text-red-500'}`}>{searchResult.paymentStatus}</div>
                    </div>
                 </div>

                 <div className="bg-blue-900 text-white p-4 rounded-lg">
                   <div className="text-sm opacity-80">Jami Ball</div>
                   <div className="text-4xl font-bold text-nac-gold">{searchResult.score || 0} / 100</div>
                 </div>
               </div>
             )}
          </div>
        );
      case 'gallery':
         return (
           <div className="max-w-7xl mx-auto py-12 px-4">
              <h2 className="text-3xl font-serif font-bold text-nac-navy mb-8 text-center">NAC Gallery</h2>
              {galleryItems.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">Hozircha rasmlar joylanmagan.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {galleryItems.map(item => (
                     <div key={item.id} className="group relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                        <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition">
                           <p className="text-white font-medium">{item.caption}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
         );
      default:
        return null;
    }
  };

  return (
    <Layout 
      currentPage={page} 
      onNavigate={setPage} 
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;