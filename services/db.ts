import { Student, PaymentStatus, Subject, GalleryItem, SamplePaper, NewsItem } from '../types';

// Define our "JSON Files" that act as the database
const DB_FILES = {
  STUDENTS: 'reg.json',
  GALLERY: 'gallery.json',
  SAMPLES: 'samples.json',
  NEWS: 'news.json'
};

// Simulate a backend network delay to make it feel realistic
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to read from our "File System" (LocalStorage acting as JSON files)
const readJSON = <T>(filename: string): T[] => {
  try {
    const data = localStorage.getItem(filename);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Error reading ${filename}`, e);
    return [];
  }
};

// Helper to write to our "File System"
const writeJSON = <T>(filename: string, data: T[]) => {
  try {
    localStorage.setItem(filename, JSON.stringify(data));
    // Dispatch a storage event to sync across tabs if needed
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error(`Error writing to ${filename}`, e);
    alert("Ma'lumotlar bazasi to'ldi! Iltimos, eski ma'lumotlarni o'chiring yoki rasmlar hajmini kichraytiring.");
  }
};

export const DbService = {
  // --- Students (reg.json) ---
  getStudents: async (): Promise<Student[]> => {
    await delay(300);
    return readJSON<Student>(DB_FILES.STUDENTS);
  },

  addStudent: async (student: Omit<Student, 'id' | 'registeredAt' | 'paymentStatus'>): Promise<Student> => {
    await delay(500);
    const students = readJSON<Student>(DB_FILES.STUDENTS);
    
    // Generate ID: NAC-YEAR-XXXX
    const count = students.length + 1;
    const newId = `NAC-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;
    
    const newStudent: Student = {
      ...student,
      id: newId,
      registeredAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.PENDING,
      score: 0
    };

    students.push(newStudent);
    writeJSON(DB_FILES.STUDENTS, students);
    return newStudent;
  },

  updatePaymentStatus: async (id: string, status: PaymentStatus): Promise<void> => {
    const students = readJSON<Student>(DB_FILES.STUDENTS);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index].paymentStatus = status;
      writeJSON(DB_FILES.STUDENTS, students);
    }
  },

  getStudentById: async (id: string): Promise<Student | null> => {
    await delay(300);
    const students = readJSON<Student>(DB_FILES.STUDENTS);
    return students.find(s => s.id.toLowerCase() === id.toLowerCase()) || null;
  },

  loginStudent: async (id: string, password: string): Promise<Student | null> => {
    await delay(500);
    const students = readJSON<Student>(DB_FILES.STUDENTS);
    const student = students.find(s => s.id.toLowerCase() === id.toLowerCase());
    
    if (student && student.password === password) {
      return student;
    }
    return null;
  },

  // --- News (news.json) ---
  getStudentNews: async (): Promise<NewsItem[]> => {
    await delay(300);
    let news = readJSON<NewsItem>(DB_FILES.NEWS);
    
    // Seed initial news if empty so the page isn't blank
    if (news.length === 0) {
      news = [
        {
          id: '1',
          title: 'Olimpiada sanasi e\'lon qilindi!',
          content: 'Hurmatli ishtirokchi, viloyat bosqichi 2026-yil 15-mart kuni bo\'lib o\'tadi.',
          date: '2026-02-01',
          type: 'info'
        },
        {
          id: '2',
          title: 'Xush kelibsiz!',
          content: 'National Academic Challenge platformasiga xush kelibsiz. Shaxsiy kabinetingizdan foydalanishingiz mumkin.',
          date: '2026-01-20',
          type: 'success'
        }
      ];
      writeJSON(DB_FILES.NEWS, news);
    }
    return news;
  },

  addNewsItem: async (item: Omit<NewsItem, 'id' | 'date'>): Promise<NewsItem> => {
    await delay(500);
    const items = readJSON<NewsItem>(DB_FILES.NEWS);
    const newItem: NewsItem = {
      ...item,
      id: `NEWS-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    items.unshift(newItem);
    writeJSON(DB_FILES.NEWS, items);
    return newItem;
  },

  deleteNewsItem: async (id: string): Promise<void> => {
    const items = readJSON<NewsItem>(DB_FILES.NEWS);
    const filtered = items.filter(i => i.id !== id);
    writeJSON(DB_FILES.NEWS, filtered);
  },

  // --- Gallery (gallery.json) ---
  getGalleryItems: async (): Promise<GalleryItem[]> => {
    await delay(300);
    return readJSON<GalleryItem>(DB_FILES.GALLERY);
  },

  addGalleryItem: async (item: Omit<GalleryItem, 'id' | 'uploadedAt'>): Promise<GalleryItem> => {
    await delay(500);
    const items = readJSON<GalleryItem>(DB_FILES.GALLERY);
    const newItem: GalleryItem = {
      ...item,
      id: `IMG-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    items.unshift(newItem);
    writeJSON(DB_FILES.GALLERY, items);
    return newItem;
  },

  deleteGalleryItem: async (id: string): Promise<void> => {
    const items = readJSON<GalleryItem>(DB_FILES.GALLERY);
    const filtered = items.filter(i => i.id !== id);
    writeJSON(DB_FILES.GALLERY, filtered);
  },

  // --- Sample Papers (samples.json) ---
  getSamplePapers: async (): Promise<SamplePaper[]> => {
    await delay(300);
    return readJSON<SamplePaper>(DB_FILES.SAMPLES);
  },

  addSamplePaper: async (item: Omit<SamplePaper, 'id' | 'uploadedAt'>): Promise<SamplePaper> => {
    await delay(500);
    const items = readJSON<SamplePaper>(DB_FILES.SAMPLES);
    const newItem: SamplePaper = {
      ...item,
      id: `DOC-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    items.unshift(newItem);
    writeJSON(DB_FILES.SAMPLES, items);
    return newItem;
  },

  deleteSamplePaper: async (id: string): Promise<void> => {
    const items = readJSON<SamplePaper>(DB_FILES.SAMPLES);
    const filtered = items.filter(i => i.id !== id);
    writeJSON(DB_FILES.SAMPLES, filtered);
  },

  // --- Auth & Admin ---
  loginAdmin: async (password: string): Promise<boolean> => {
    await delay(500);
    return password === 'admin123';
  },

  // --- Utility: Download Database as JSON Files ---
  // This helps admin "see" the files or back them up
  downloadDatabase: () => {
    const download = (filename: string) => {
      const data = localStorage.getItem(filename);
      if (!data) return;
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    download(DB_FILES.STUDENTS);
    download(DB_FILES.GALLERY);
    download(DB_FILES.NEWS);
  },

  exportToCSV: async () => {
    const students = readJSON<Student>(DB_FILES.STUDENTS);
    const headers = ["ID", "Ism", "Familiya", "Telefon", "Viloyat", "Tuman", "Maktab", "Sinf", "Fan", "Status", "Sana"];
    
    const rows = students.map(s => [
      s.id, s.firstName, s.lastName, s.phone, s.region, s.district, s.school, s.grade, s.subject, s.paymentStatus, s.registeredAt
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(c => `"${c}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `NAC_Students_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
};