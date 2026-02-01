import { Student, PaymentStatus, GalleryItem, SamplePaper, NewsItem } from '../types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyCsxe3HzzHpQeahLRdyvfohHqEAqNv6hEk",
  authDomain: "nacuz-a97cc.firebaseapp.com",
  projectId: "nacuz-a97cc",
  storageBucket: "nacuz-a97cc.firebasestorage.app",
  messagingSenderId: "667754613801",
  appId: "1:667754613801:web:903b947c08e7951505a038",
  measurementId: "G-PWJF2SGKF9"
};

/* ================= INIT ================= */

let db: any = null;
let isFirebaseConnected = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);

    // 🔥 REAL TEKSHIRUV
    getDocs(collection(db, "__test__"))
      .then(() => {
        isFirebaseConnected = true;
        console.log("🔥 Firebase ulandi va ishlayapti!");
      })
      .catch((err) => {
        console.error("❌ Firebase bor, lekin ruxsat yo‘q:", err);
        isFirebaseConnected = false;
      });
  } else {
    console.warn("⚠️ Firebase config to‘liq emas. LocalStorage ishlaydi.");
  }
} catch (e) {
  console.error("❌ Firebase initialize xatosi:", e);
}

/* ================= CONST ================= */

const COLLECTIONS = {
  STUDENTS: 'students',
  GALLERY: 'gallery',
  SAMPLES: 'samples',
  NEWS: 'news'
};

const LS_KEYS = {
  STUDENTS: 'reg.json',
  GALLERY: 'gallery.json',
  SAMPLES: 'samples.json',
  NEWS: 'news.json'
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/* ================= HELPERS ================= */

const getAll = async <T>(collectionName: string, lsKey: string): Promise<T[]> => {
  if (isFirebaseConnected && db) {
    console.log(`📡 Firebase → ${collectionName}`);
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map(d => d.data() as T);
  } else {
    console.log(`💾 LocalStorage → ${lsKey}`);
    await delay(200);
    const data = localStorage.getItem(lsKey);
    return data ? JSON.parse(data) : [];
  }
};

const saveOne = async <T extends { id: string }>(
  collectionName: string,
  lsKey: string,
  item: T
) => {
  if (isFirebaseConnected && db) {
    await setDoc(doc(db, collectionName, item.id), item);
  } else {
    const data = localStorage.getItem(lsKey);
    const arr = data ? JSON.parse(data) : [];
    const idx = arr.findIndex((i: any) => i.id === item.id);
    idx === -1 ? arr.push(item) : (arr[idx] = item);
    localStorage.setItem(lsKey, JSON.stringify(arr));
  }
};

const deleteOne = async (collectionName: string, lsKey: string, id: string) => {
  if (isFirebaseConnected && db) {
    await deleteDoc(doc(db, collectionName, id));
  } else {
    const data = localStorage.getItem(lsKey);
    const arr = data ? JSON.parse(data).filter((i: any) => i.id !== id) : [];
    localStorage.setItem(lsKey, JSON.stringify(arr));
  }
};

/* ================= SERVICE ================= */

export const DbService = {

  /* -------- STUDENTS -------- */

  getStudents: async (): Promise<Student[]> =>
    getAll<Student>(COLLECTIONS.STUDENTS, LS_KEYS.STUDENTS),

  addStudent: async (data: Omit<Student, 'id' | 'registeredAt' | 'paymentStatus'>) => {
    const newStudent: Student = {
      ...data,
      id: `NAC-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      paymentStatus: PaymentStatus.PENDING,
      score: 0
    };
    await saveOne(COLLECTIONS.STUDENTS, LS_KEYS.STUDENTS, newStudent);
    return newStudent;
  },

  /* -------- NEWS -------- */

  getStudentNews: async (): Promise<NewsItem[]> => {
    const news = await getAll<NewsItem>(COLLECTIONS.NEWS, LS_KEYS.NEWS);
    return news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addNewsItem: async (item: Omit<NewsItem, 'id' | 'date'>) => {
    const news: NewsItem = {
      ...item,
      id: `NEWS-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    await saveOne(COLLECTIONS.NEWS, LS_KEYS.NEWS, news);
    return news;
  },

  deleteNewsItem: async (id: string) =>
    deleteOne(COLLECTIONS.NEWS, LS_KEYS.NEWS, id),

  /* -------- GALLERY -------- */

  getGalleryItems: async (): Promise<GalleryItem[]> =>
    getAll<GalleryItem>(COLLECTIONS.GALLERY, LS_KEYS.GALLERY),

  addGalleryItem: async (item: Omit<GalleryItem, 'id' | 'uploadedAt'>) => {
    const g: GalleryItem = {
      ...item,
      id: `IMG-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    await saveOne(COLLECTIONS.GALLERY, LS_KEYS.GALLERY, g);
    return g;
  },

  deleteGalleryItem: async (id: string) =>
    deleteOne(COLLECTIONS.GALLERY, LS_KEYS.GALLERY, id),

  /* -------- SAMPLES -------- */

  getSamplePapers: async (): Promise<SamplePaper[]> =>
    getAll<SamplePaper>(COLLECTIONS.SAMPLES, LS_KEYS.SAMPLES),

  addSamplePaper: async (item: Omit<SamplePaper, 'id' | 'uploadedAt'>) => {
    const s: SamplePaper = {
      ...item,
      id: `DOC-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    await saveOne(COLLECTIONS.SAMPLES, LS_KEYS.SAMPLES, s);
    return s;
  },

  deleteSamplePaper: async (id: string) =>
    deleteOne(COLLECTIONS.SAMPLES, LS_KEYS.SAMPLES, id)
};
