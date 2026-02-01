import React, { useState, useEffect } from 'react';
import { DbService } from '../services/db';
import { Student, PaymentStatus, Subject, GalleryItem, SamplePaper, NewsItem } from '../types';
import { PRICES, GRADES, SUBJECTS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Search, Check, X, FileText, Image as ImageIcon, Trash2, Upload, LayoutDashboard, Users, FileStack, Bell, Plus } from 'lucide-react';

export const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'content' | 'news'>('dashboard');
  
  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [samplePapers, setSamplePapers] = useState<SamplePaper[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter/Search
  const [searchTerm, setSearchTerm] = useState('');

  // Upload States
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [newPaper, setNewPaper] = useState<File | null>(null);
  const [paperSubject, setPaperSubject] = useState<Subject>(SUBJECTS[0]);
  const [paperGrade, setPaperGrade] = useState(1);
  const [uploading, setUploading] = useState(false);

  // News States
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsType, setNewsType] = useState<'info' | 'alert' | 'success'>('info');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await DbService.loginAdmin(password)) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert("Parol noto'g'ri");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const s = await DbService.getStudents();
    const g = await DbService.getGalleryItems();
    const p = await DbService.getSamplePapers();
    const n = await DbService.getStudentNews();
    setStudents(s);
    setGalleryItems(g);
    setSamplePapers(p);
    setNewsItems(n);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const togglePayment = async (id: string, currentStatus: PaymentStatus) => {
    const newStatus = currentStatus === PaymentStatus.PAID ? PaymentStatus.PENDING : PaymentStatus.PAID;
    await DbService.updatePaymentStatus(id, newStatus);
    fetchData(); 
  };

  // --- Upload Handlers ---
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;
    setUploading(true);
    try {
      const base64 = await DbService.fileToBase64(newImage);
      await DbService.addGalleryItem({
        imageUrl: base64,
        caption: imageCaption
      });
      setNewImage(null);
      setImageCaption('');
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Rasmni o'chirasizmi?")) {
      await DbService.deleteGalleryItem(id);
      fetchData();
    }
  };

  const handleUploadPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaper) return;
    setUploading(true);
    try {
      const base64 = await DbService.fileToBase64(newPaper);
      await DbService.addSamplePaper({
        subject: paperSubject,
        grade: paperGrade,
        title: `${paperSubject} - ${paperGrade} Sinf`,
        fileUrl: base64,
        fileName: newPaper.name
      });
      setNewPaper(null);
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePaper = async (id: string) => {
    if (confirm("Faylni o'chirasizmi?")) {
      await DbService.deleteSamplePaper(id);
      fetchData();
    }
  };

  // --- News Handlers ---
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await DbService.addNewsItem({
        title: newsTitle,
        content: newsContent,
        type: newsType
      });
      setNewsTitle('');
      setNewsContent('');
      setNewsType('info');
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
     if (confirm("Yangilikni o'chirasizmi?")) {
       await DbService.deleteNewsItem(id);
       fetchData();
     }
  };

  const filteredStudents = students.filter(s => 
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalRevenue = students.reduce((acc, curr) => {
    if (curr.paymentStatus === PaymentStatus.PAID) {
      return acc + (curr.subject.includes('Combo') ? PRICES.COMBO : PRICES.SINGLE);
    }
    return acc;
  }, 0);

  const subjectStats = [
    { name: 'Math', value: students.filter(s => s.subject.includes('Mat')).length },
    { name: 'English', value: students.filter(s => s.subject.includes('Ing')).length },
    { name: 'Combo', value: students.filter(s => s.subject.includes('Combo')).length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-nac-navy">Admin Panel</h2>
          <input 
            type="password" 
            placeholder="Password (admin123)" 
            className="w-full p-3 border rounded mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="w-full bg-nac-navy text-white p-3 rounded font-bold">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-nac-navy text-white flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-xl font-bold text-nac-gold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center space-x-2 px-4 py-3 rounded transition ${activeTab === 'dashboard' ? 'bg-white/20 text-nac-gold' : 'hover:bg-white/10'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('students')} 
            className={`w-full flex items-center space-x-2 px-4 py-3 rounded transition ${activeTab === 'students' ? 'bg-white/20 text-nac-gold' : 'hover:bg-white/10'}`}
          >
            <Users size={20} />
            <span>O'quvchilar</span>
          </button>
          <button 
            onClick={() => setActiveTab('content')} 
            className={`w-full flex items-center space-x-2 px-4 py-3 rounded transition ${activeTab === 'content' ? 'bg-white/20 text-nac-gold' : 'hover:bg-white/10'}`}
          >
            <FileStack size={20} />
            <span>Kontent (Test/Rasm)</span>
          </button>
          <button 
            onClick={() => setActiveTab('news')} 
            className={`w-full flex items-center space-x-2 px-4 py-3 rounded transition ${activeTab === 'news' ? 'bg-white/20 text-nac-gold' : 'hover:bg-white/10'}`}
          >
            <Bell size={20} />
            <span>Yangiliklar</span>
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => window.location.reload()} className="text-sm text-gray-400 hover:text-white">Chiqish</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Umumiy Statistika</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm">Jami O'quvchilar</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <p className="text-gray-500 text-sm">To'lov qilganlar</p>
                <p className="text-2xl font-bold">{students.filter(s => s.paymentStatus === PaymentStatus.PAID).length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
                <p className="text-gray-500 text-sm">Kutilmoqda</p>
                <p className="text-2xl font-bold">{students.filter(s => s.paymentStatus === PaymentStatus.PENDING).length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-nac-gold">
                <p className="text-gray-500 text-sm">Tushum (Taxminiy)</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} so'm</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold mb-4">Fanlar kesimi</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={subjectStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                        {subjectStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">O'quvchilar Ro'yxati</h2>
                <button onClick={DbService.exportToCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
                  <Download size={18} /> Excel Yuklash
                </button>
             </div>
             
             <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b flex items-center gap-4">
                   <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Qidirish (ID yoki Familiya)" 
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-nac-gold"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ism Familiya</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viloyat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((s) => (
                        <tr key={s.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{s.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{s.firstName} {s.lastName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.region}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              s.paymentStatus === PaymentStatus.PAID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {s.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                            <button 
                              onClick={() => togglePayment(s.id, s.paymentStatus)}
                              className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded" title="To'lov holatini o'zgartirish"
                            >
                               {s.paymentStatus === PaymentStatus.PAID ? <X size={16}/> : <Check size={16} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            
            {/* Sample Papers Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText /> Namunaviy Testlar (Sample Papers)</h2>
              <form onSubmit={handleUploadPaper} className="grid md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded">
                 <div>
                   <label className="block text-xs text-gray-500 mb-1">Fan</label>
                   <select value={paperSubject} onChange={e => setPaperSubject(e.target.value as Subject)} className="w-full p-2 border rounded">
                     {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs text-gray-500 mb-1">Sinf</label>
                   <select value={paperGrade} onChange={e => setPaperGrade(Number(e.target.value))} className="w-full p-2 border rounded">
                     {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs text-gray-500 mb-1">PDF Fayl</label>
                   <input type="file" accept=".pdf" onChange={e => setNewPaper(e.target.files?.[0] || null)} className="w-full p-1 border rounded bg-white text-sm" />
                 </div>
                 <div className="flex items-end">
                   <button disabled={uploading} className="w-full bg-nac-navy text-white p-2 rounded flex justify-center items-center gap-2 hover:bg-blue-900 disabled:opacity-50">
                     <Upload size={16} /> {uploading ? '...' : 'Yuklash'}
                   </button>
                 </div>
              </form>

              <div className="grid gap-2">
                {samplePapers.map(paper => (
                   <div key={paper.id} className="flex justify-between items-center p-3 bg-gray-50 border rounded">
                      <div className="flex items-center gap-3">
                         <FileText className="text-red-500" />
                         <div>
                            <p className="font-bold text-sm">{paper.title}</p>
                            <p className="text-xs text-gray-500">{paper.fileName}</p>
                         </div>
                      </div>
                      <button onClick={() => handleDeletePaper(paper.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                   </div>
                ))}
                {samplePapers.length === 0 && <p className="text-gray-400 text-sm text-center">Hozircha fayllar yo'q.</p>}
              </div>
            </section>

            {/* Gallery Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ImageIcon /> Galereya (Gallery)</h2>
              <form onSubmit={handleUploadImage} className="grid md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded">
                 <div className="md:col-span-2">
                   <label className="block text-xs text-gray-500 mb-1">Rasm (JPG, PNG)</label>
                   <input type="file" accept="image/*" onChange={e => setNewImage(e.target.files?.[0] || null)} className="w-full p-1 border rounded bg-white text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs text-gray-500 mb-1">Izoh (Caption)</label>
                   <input type="text" value={imageCaption} onChange={e => setImageCaption(e.target.value)} className="w-full p-2 border rounded" placeholder="Tadbir nomi..." />
                 </div>
                 <div className="flex items-end">
                   <button disabled={uploading} className="w-full bg-nac-navy text-white p-2 rounded flex justify-center items-center gap-2 hover:bg-blue-900 disabled:opacity-50">
                     <Upload size={16} /> {uploading ? '...' : 'Yuklash'}
                   </button>
                 </div>
              </form>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryItems.map(item => (
                   <div key={item.id} className="relative group border rounded-lg overflow-hidden">
                      <img src={item.imageUrl} alt={item.caption} className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                         <button onClick={() => handleDeleteImage(item.id)} className="text-white bg-red-600 p-2 rounded-full"><Trash2 size={16} /></button>
                      </div>
                      <div className="p-2 text-xs truncate bg-white">{item.caption || "Untitled"}</div>
                   </div>
                ))}
                 {galleryItems.length === 0 && <p className="text-gray-400 text-sm col-span-4 text-center">Hozircha rasmlar yo'q.</p>}
              </div>
            </section>

          </div>
        )}

        {/* NEWS TAB (New) */}
        {activeTab === 'news' && (
          <div className="space-y-8">
             <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell /> Yangiliklar va Eslatmalar</h2>
              <form onSubmit={handleAddNews} className="space-y-4 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Sarlavha</label>
                   <input 
                      required
                      type="text" 
                      value={newsTitle} 
                      onChange={e => setNewsTitle(e.target.value)} 
                      className="w-full p-2 border rounded focus:ring-1 focus:ring-nac-gold outline-none" 
                      placeholder="Masalan: Imtihon sanasi o'zgardi" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Mazmuni</label>
                   <textarea 
                      required
                      rows={3}
                      value={newsContent} 
                      onChange={e => setNewsContent(e.target.value)} 
                      className="w-full p-2 border rounded focus:ring-1 focus:ring-nac-gold outline-none" 
                      placeholder="Batafsil ma'lumot..." 
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Turi</label>
                      <select 
                        value={newsType} 
                        onChange={e => setNewsType(e.target.value as any)} 
                        className="w-full p-2 border rounded bg-white"
                      >
                        <option value="info">Ma'lumot (Moviy)</option>
                        <option value="alert">Diqqat (Qizil)</option>
                        <option value="success">Yutuq/Tabrik (Yashil)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button disabled={uploading} className="w-full bg-nac-navy text-white p-2 rounded flex justify-center items-center gap-2 hover:bg-blue-900 font-bold">
                        <Plus size={18} /> {uploading ? 'Saqlanmoqda...' : 'E\'lon qilish'}
                      </button>
                    </div>
                 </div>
              </form>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-500 text-sm uppercase">Joriy Yangiliklar</h3>
                {newsItems.map(item => (
                   <div key={item.id} className={`flex justify-between items-start p-4 border rounded-lg ${
                     item.type === 'alert' ? 'bg-red-50 border-red-200' : 
                     item.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                   }`}>
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-nac-navy">{item.title}</span>
                            <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border">{item.date}</span>
                         </div>
                         <p className="text-sm text-gray-700">{item.content}</p>
                      </div>
                      <button onClick={() => handleDeleteNews(item.id)} className="text-red-500 hover:text-red-700 p-2 bg-white rounded shadow-sm"><Trash2 size={16} /></button>
                   </div>
                ))}
                {newsItems.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Yangiliklar yo'q.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};