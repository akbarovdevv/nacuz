export enum UserRole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

export enum Subject {
  MATH = 'Matematika',
  ENGLISH = 'Ingliz tili',
  COMBO = 'Combo (Mat + Ing)'
}

export enum PaymentStatus {
  PENDING = 'Kutilmoqda',
  PAID = 'To\'landi'
}

export interface Student {
  id: string; // NAC-XXXX format
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  district: string;
  school: string;
  grade: number;
  subject: Subject;
  paymentStatus: PaymentStatus;
  registeredAt: string; // ISO Date string
  score?: number; // For results
  password?: string; // Saved locally for mock auth
}

export interface RegionData {
  name: string;
  districts: string[];
}

export interface Stats {
  totalStudents: number;
  paidStudents: number;
  pendingStudents: number;
  revenue: number;
  bySubject: { name: string; value: number }[];
}

export interface GalleryItem {
  id: string;
  imageUrl: string; // Base64
  caption: string;
  uploadedAt: string;
}

export interface SamplePaper {
  id: string;
  subject: Subject;
  grade: number;
  title: string;
  fileUrl: string; // Base64
  fileName: string;
  uploadedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'alert' | 'success';
}