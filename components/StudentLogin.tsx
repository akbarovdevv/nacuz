import React, { useState } from 'react';
import { DbService } from '../services/db';
import { Student } from '../types';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface StudentLoginProps {
  onLoginSuccess: (student: Student) => void;
  onRegisterClick: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onLoginSuccess, onRegisterClick }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const student = await DbService.loginStudent(id, password);
      if (student) {
        onLoginSuccess(student);
      } else {
        setError('ID raqam yoki parol noto\'g\'ri');
      }
    } catch (e) {
      setError('Tizim xatosi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-nac-navy p-6 text-center">
           <h2 className="text-2xl font-bold text-white mb-2">O'quvchi Kirishi</h2>
           <p className="text-gray-300 text-sm">Shaxsiy kabinetga kirish uchun ID va parolingizni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded flex items-center gap-2 text-sm">
               <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">ID Raqam</label>
             <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={id}
                  onChange={e => setId(e.target.value)}
                  placeholder="NAC-2026-0001"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-navy focus:border-transparent outline-none transition"
                  required
                />
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
             <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nac-navy focus:border-transparent outline-none transition"
                  required
                />
             </div>
          </div>

          <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-nac-gold text-nac-navy font-bold py-3 rounded-lg shadow hover:bg-yellow-400 transition flex items-center justify-center gap-2"
          >
             {loading ? 'Tekshirilmoqda...' : 'Kirish'} <ArrowRight size={18} />
          </button>

          <div className="text-center pt-4 border-t">
             <p className="text-sm text-gray-600">Hali ro'yxatdan o'tmaganmisiz?</p>
             <button 
                type="button" 
                onClick={onRegisterClick}
                className="text-nac-navy font-bold hover:underline mt-1"
             >
                Ro'yxatdan o'tish
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};