import React from 'react';
import { ArrowRight, Award, BookOpen, CheckCircle, Trophy, Users } from 'lucide-react';

export const Hero = ({ onRegister }: { onRegister: () => void }) => {
  return (
    <div className="relative bg-nac-navy overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#ffd700" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6">
            National Academic Challenge <br/>
            <span className="text-nac-gold">(NAC)</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Where Thinking Becomes Excellence.
            <br/>
            1–6-sinf o‘quvchilari uchun matematika va ingliz tili fanlaridan ikki bosqichli milliy akademik olimpiada.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button 
              onClick={onRegister}
              className="px-8 py-4 bg-nac-gold text-nac-navy font-bold rounded-lg shadow-lg hover:bg-yellow-400 transform hover:-translate-y-1 transition-all flex items-center"
            >
              Register Now <ArrowRight className="ml-2" size={20} />
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-nac-navy transition-all">
              Telegram Bot
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="bg-nac-blue border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around text-white text-center">
          <div className="p-2">
            <div className="text-2xl font-bold text-nac-gold">1-6</div>
            <div className="text-xs uppercase tracking-wider">Sinflar</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-bold text-nac-gold">70%</div>
            <div className="text-xs uppercase tracking-wider">Respublika Yo'llanmasi</div>
          </div>
          <div className="p-2">
            <div className="text-2xl font-bold text-nac-gold">2</div>
            <div className="text-xs uppercase tracking-wider">Bosqich</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-nac-navy">NAC Qanday Ishlaydi?</h2>
          <div className="w-24 h-1 bg-nac-gold mx-auto mt-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
             <div className="w-12 h-12 bg-blue-100 text-nac-navy rounded-full flex items-center justify-center mb-4 mx-auto">
               <Users size={24} />
             </div>
             <h3 className="text-xl font-bold text-center mb-2">1. Ro‘yxatdan o‘tish</h3>
             <p className="text-gray-600 text-center text-sm">Ishtirokchi ro‘yxatdan o‘tadi va shaxsiy identifikatsiya raqami (ID / QR-code) oladi.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
             <div className="w-12 h-12 bg-blue-100 text-nac-navy rounded-full flex items-center justify-center mb-4 mx-auto">
               <BookOpen size={24} />
             </div>
             <h3 className="text-xl font-bold text-center mb-2">2. Viloyat bosqichi</h3>
             <p className="text-gray-600 text-center text-sm">Sinf darajasiga mos topshiriqlar. 70%+ natija Respublika bosqichiga yo‘llanma beradi.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
             <div className="w-12 h-12 bg-blue-100 text-nac-navy rounded-full flex items-center justify-center mb-4 mx-auto">
               <Trophy size={24} />
             </div>
             <h3 className="text-xl font-bold text-center mb-2">3. Respublika bosqichi</h3>
             <p className="text-gray-600 text-center text-sm">Murakkablik darajasi yuqoriroq bo‘lgan topshiriqlar orqali g‘oliblar aniqlanadi.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const PrizesSection = () => {
  return (
    <section className="py-16 bg-nac-navy text-white">
       <div className="max-w-7xl mx-auto px-4 text-center">
         <h2 className="text-3xl font-serif font-bold text-nac-gold mb-12">Mukofotlar</h2>
         <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-8 rounded-lg border border-white/10">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">2-3 O'rin</h3>
              <p className="text-gray-400">Medal va Diplom</p>
            </div>
            <div className="bg-white/10 p-8 rounded-lg border-2 border-nac-gold transform scale-110 shadow-2xl relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-nac-gold text-nac-navy px-4 py-1 rounded-full text-xs font-bold">TOP</div>
              <Trophy className="w-16 h-16 text-nac-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-nac-gold">1-O'rin</h3>
              <p className="text-gray-200">Kubok, Diplom va Esdalik sovg‘alari</p>
            </div>
            <div className="bg-white/5 p-8 rounded-lg border border-white/10">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Ishtirokchi</h3>
              <p className="text-gray-400">QR-kodli xalqaro sertifikat</p>
            </div>
         </div>
       </div>
    </section>
  )
}