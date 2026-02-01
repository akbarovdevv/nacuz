import React, { useState } from 'react';
import { REGIONS, SUBJECTS, GRADES, PRICES } from '../constants';
import { DbService } from '../services/db';
import { Student } from '../types';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface RegistrationProps {
  onAutoLogin: (student: Student) => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onAutoLogin }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '+998',
    region: '',
    district: '',
    school: '',
    grade: 1,
    subject: SUBJECTS[0],
    password: ''
  });
  const [createdStudent, setCreatedStudent] = useState<Student | null>(null);

  const availableDistricts = REGIONS.find(r => r.name === formData.region)?.districts || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const student = await DbService.addStudent(formData);
      setCreatedStudent(student);
      setStep(2);
    } catch (error) {
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2 && createdStudent) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl shadow-lg text-center border-t-4 border-nac-gold">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-nac-navy mb-2">Muvaffaqiyatli ro‘yxatdan o‘tdingiz!</h2>
        <p className="text-gray-600 mb-6">Sizning ID raqamingiz:</p>
        <div className="text-4xl font-mono font-bold text-nac-navy bg-gray-100 py-4 rounded-lg mb-6 tracking-widest">
          {createdStudent.id}
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg text-left mb-6">
          <h3 className="font-bold text-nac-navy mb-4 border-b border-blue-200 pb-2">Muhim Eslatma</h3>
          <p className="text-sm text-gray-700">ID raqamingiz va parolingizni saqlab qo'ying. Shaxsiy kabinetga kirish uchun ular kerak bo'ladi.</p>
        </div>

        <button 
          onClick={() => onAutoLogin(createdStudent)}
          className="w-full bg-nac-navy text-white py-4 rounded-lg font-bold shadow-lg hover:bg-blue-900 transition flex items-center justify-center gap-2 text-lg"
        >
          Shaxsiy Kabinetga Kirish <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-nac-navy">Ro‘yxatdan o‘tish</h2>
        <p className="text-gray-600 mt-2">National Academic Challenge olimpiadasida ishtirok eting</p>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
           <span className="font-bold text-gray-500">1-6 Sinf O'quvchilari uchun</span>
           <span className="text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/> Barcha maydonlar majburiy</span>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 grid md:grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none" placeholder="Ismingizni kiriting" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none" placeholder="Familiyangizni kiriting" />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
            <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none" placeholder="+998" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol (Keyinchalik kirish uchun)</label>
            <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none" placeholder="********" />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Viloyat</label>
            <select required name="region" value={formData.region} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none bg-white">
              <option value="">Tanlang...</option>
              {REGIONS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuman</label>
            <select required name="district" disabled={!formData.region} value={formData.district} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none bg-white disabled:bg-gray-100">
              <option value="">Tanlang...</option>
              {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Maktab nomi / raqami</label>
            <input required name="school" value={formData.school} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none" placeholder="Masalan: 21-umumiy o'rta ta'lim maktabi" />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sinf</label>
            <select required name="grade" value={formData.grade} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none bg-white">
              {GRADES.map(g => <option key={g} value={g}>{g}-sinf</option>)}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fan yo'nalishi</label>
            <select required name="subject" value={formData.subject} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-gold focus:border-transparent outline-none bg-white">
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Narx: {formData.subject.includes('Combo') ? PRICES.COMBO.toLocaleString() : PRICES.SINGLE.toLocaleString()} so'm
            </p>
          </div>
          
          <div className="col-span-2 mt-4">
             <div className="flex items-start gap-2 text-sm text-gray-600 mb-6">
               <input type="checkbox" required className="mt-1" />
               <p>Men <span className="font-bold text-nac-navy">NAC Nizomi</span> bilan tanishdim va shaxsiy ma'lumotlarimni qayta ishlashga rozilik beraman. To'lov qaytarilmasligini tushunaman.</p>
             </div>
             <button disabled={loading} type="submit" className="w-full bg-nac-navy text-white font-bold py-4 rounded-lg shadow-lg hover:bg-blue-900 transition flex items-center justify-center">
               {loading ? <Loader2 className="animate-spin mr-2" /> : null}
               {loading ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish va ID olish'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};