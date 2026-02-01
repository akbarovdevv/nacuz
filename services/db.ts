import { Student, PaymentStatus, Subject, GalleryItem, SamplePaper, NewsItem } from '../types';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';

// --- CONFIGURATION ---
// DIQQAT: O'zingizning Firebase loyihangizdagi ma'lumotlarni shu yerga qo'ying.
// Agar bularni to'ldirmasangiz, tizim avtomatik ravishda LocalStorage (eski rejim)da ishlaydi.
const firebaseConfig = {
  apiKey: "AIzaSyCsxe3HzzHpQeahLRdyvfohHqEAqNv6hEk",
  authDomain: "nacuz-a97cc.firebaseapp.com",
  projectId: "nacuz-a97cc",
  storageBucket: "nacuz-a97cc.firebasestorage.app",
  messagingSenderId: "667754613801",
  appId: "1:667754613801:web:903b947c08e7951505a038",
  measurementId: "G-PWJF2SGKF9"
};


// Check if Firebase is configured properly
const isFirebaseConfigured = firebaseConfig.apiKey !== "API_KEY_YOZING";

let db: any;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase Connected Successfully ✅");
  } catch (error) {
    console.error("Firebase connection error:", error);
  }
} else {
  console.warn("⚠️ Firebase sozlanmagan! Tizim LocalStorage rejimida ishlamoqda. Ma'lumotlar domenlararo sinxronlanmaydi.");
}

// Collections map to JSON files concept
const COLLECTIONS = {
  STUDENTS: 'students', // reg.json
  GALLERY: 'gallery',   // gallery.json
  SAMPLES: 'samples',   // samples.json
  NEWS: 'news'          // news.json
};

// LocalStorage Keys (Fallback)
const LS_KEYS = {
  STUDENTS: 'reg.json',
  GALLERY: 'gallery.json',
  SAMPLES: 'samples.json',
  NEWS: 'news.json'
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- HELPER FUNCTIONS ---

// Generic Getter
const getAll = async <T>(collectionName: string, lsKey: string): Promise<T[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => doc.data() as T);
    } catch (e) {
      console.error(`Firebase Read Error (${collectionName}):`, e);
      return [];
    }
  } else {
    // LocalStorage Fallback
    await delay(300);
    const data = localStorage.getItem(lsKey);
    return data ? JSON.parse(data) : [];
  }
};

// Generic Setter (Add/Update)
const saveOne = async <T extends { id: string }>(collectionName: string, lsKey: string, item: T, isNew: boolean = true): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, collectionName, item.id), item);
    } catch (e) {
      console.error(`Firebase Write Error (${collectionName}):`, e);
      throw e;
    }
  } else {
    // LocalStorage Fallback
    await delay(300);
    const data = localStorage.getItem(lsKey);
    const items = data ? JSON.parse(data) : [];
    
    if (isNew) {
      items.push(item); // Add to end (or beginning handled by logic)
    } else {
      const idx = items.findIndex((i: any) => i.id === item.id);
      if (idx !== -1) items[idx] = item;
    }
    
    // Sort logic mimics the previous behavior (unshift for news/gallery)
    // Here we just save the array. The caller should handle order, 
    // but for simplicity in LS fallback we just push/update.
    // Ideally we re-sort but let's keep it simple.
    
    localStorage.setItem(lsKey, JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
  }
};

// Generic Deleter
const deleteOne = async (collectionName: string, lsKey: string, id: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
      console.error(`Firebase Delete Error (${collectionName}):`, e);
      throw e;
    }
  } else {
    const data = localStorage.getItem(lsKey);
    let items = data ? JSON.parse(data) : [];
    items = items.filter((i: any) => i.id !== id);
    localStorage.setItem(lsKey, JSON.stringify(items));
    window.dispatchEvent(new Event("storage"));
  }
};


export const DbService = {
  // --- STUDENTS ---
  getStudents: async (): Promise<Student[]> => {
    return getAll<Student>(COLLECTIONS.STUDENTS, LS_KEYS.STUDENTS);
  },

  addStudent: async (studentData: Omit<Student, 'id' | 'registeredAt' | 'paymentStatus'>): Promise<Student> => {
    const students = await DbService.getStudents();
    
    // Generate ID
    const count = students.length + 1;
    const newId = `NAC-${new Date().getFullYear()}-${count.toString().padStart(4, '0')}`;
    
    const newStudent: Student = {
      ...studentData,
      id: newId,
      registeredAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.PENDING,
      score: 0
    };

    await saveOne(COLLECTIONS.STUDENTS, LS_KEYS.STUDENTS, newStudent);
    return newStudent;
  },

  updatePaymentStatus: async (id: string, status: PaymentStatus): Promise<void> => {
    // We need to fetch the specific student first to update efficiently in LS, 
    // but for Firebase we can use updateDoc if we knew the ID existed. 
    // To keep logic unified:
    const students = await DbService.getStudents();
    const student = students.find(s => s.id === id);
    
    if (student) {
      const updatedStudent = { ...student, paymentStatus: status };
      // In Firebase setDoc with merge:true or just overwrite works if we send full object
      await saveOne(COLLECTIONS.STUDENTS, LS_KEYS.STUDENTS, updatedStudent, false);
    }
  },

  getStudentById: async (id: string): Promise<Student | null> => {
    const students = await DbService.getStudents();
    return students.find(s => s.id.toLowerCase() === id.toLowerCase()) || null;
  },

  loginStudent: async (id: string, password: string): Promise<Student | null> => {
    const students = await DbService.getStudents();
    const student = students.find(s => s.id.toLowerCase() === id.toLowerCase());
    if (student && student.password === password) {
      return student;
    }
    return null;
  },

  // --- NEWS ---
  getStudentNews: async (): Promise<NewsItem[]> => {
    let news = await getAll<NewsItem>(COLLECTIONS.NEWS, LS_KEYS.NEWS);
    
    // Seed initial news if totally empty (only for LS usually, but good for demo)
    if (news.length === 0 && !isFirebaseConfigured) {
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
          content: 'National Academic Challenge platformasiga xush kelibsiz.',
          date: '2026-01-20',
          type: 'success'
        }
      ];
      localStorage.setItem(LS_KEYS.NEWS, JSON.stringify(news));
    }
    // Sort news by date descending
    return news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addNewsItem: async (item: Omit<NewsItem, 'id' | 'date'>): Promise<NewsItem> => {
    const newItem: NewsItem = {
      ...item,
      id: `NEWS-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    await saveOne(COLLECTIONS.NEWS, LS_KEYS.NEWS, newItem);
    return newItem;
  },

  deleteNewsItem: async (id: string): Promise<void> => {
    await deleteOne(COLLECTIONS.NEWS, LS_KEYS.NEWS, id);
  },

  // --- GALLERY ---
  getGalleryItems: async (): Promise<GalleryItem[]> => {
    const items = await getAll<GalleryItem>(COLLECTIONS.GALLERY, LS_KEYS.GALLERY);
    // Sort newest first
    return items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  },

  addGalleryItem: async (item: Omit<GalleryItem, 'id' | 'uploadedAt'>): Promise<GalleryItem> => {
    const newItem: GalleryItem = {
      ...item,
      id: `IMG-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    await saveOne(COLLECTIONS.GALLERY, LS_KEYS.GALLERY, newItem);
    return newItem;
  },

  deleteGalleryItem: async (id: string): Promise<void> => {
    await deleteOne(COLLECTIONS.GALLERY, LS_KEYS.GALLERY, id);
  },

  // --- SAMPLES ---
  getSamplePapers: async (): Promise<SamplePaper[]> => {
    return getAll<SamplePaper>(COLLECTIONS.SAMPLES, LS_KEYS.SAMPLES);
  },

  addSamplePaper: async (item: Omit<SamplePaper, 'id' | 'uploadedAt'>): Promise<SamplePaper> => {
    const newItem: SamplePaper = {
      ...item,
      id: `DOC-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    await saveOne(COLLECTIONS.SAMPLES, LS_KEYS.SAMPLES, newItem);
    return newItem;
  },

  deleteSamplePaper: async (id: string): Promise<void> => {
    await deleteOne(COLLECTIONS.SAMPLES, LS_KEYS.SAMPLES, id);
  },

  // --- AUTH ---
  loginAdmin: async (password: string): Promise<boolean> => {
    await delay(500);
    return password === 'admin123'; // Hardcoded for simplicity
  },

  exportToCSV: async () => {
    const students = await DbService.getStudents();
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
