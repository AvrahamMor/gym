// שירות סנכרון ענן בזמן אמת מבוסס Firebase Firestore
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

const FIREBASE_STORAGE_CONFIG_KEY = 'fitcouple_firebase_config_v1';
const CLOUD_DOC_PATH = ['couples', 'avraham_and_babzi'];

/**
 * קבלת הגדרות Firebase מ-Env או מ-localStorage
 */
export function getFirebaseConfig() {
  // 1. קודם בדיקה אם נשמר בהגדרות המשתמש בדפדפן
  try {
    const saved = localStorage.getItem(FIREBASE_STORAGE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading saved firebase config', e);
  }

  // 2. בדיקה ממשתני סביבה (Vite / Vercel)
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };

  if (envConfig.projectId && envConfig.apiKey) {
    return envConfig;
  }

  return null;
}

/**
 * שמירת קונפיגורציית Firebase
 */
export function saveFirebaseConfig(config) {
  try {
    localStorage.setItem(FIREBASE_STORAGE_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save firebase config', e);
  }
}

/**
 * מחיקת קונפיגורציית Firebase
 */
export function removeFirebaseConfig() {
  try {
    localStorage.removeItem(FIREBASE_STORAGE_CONFIG_KEY);
  } catch (e) {}
}

let dbInstance = null;

/**
 * אתחול חיבור ל-Firestore
 */
export function getFirebaseDb() {
  if (dbInstance) return dbInstance;

  const config = getFirebaseConfig();
  if (!config || !config.projectId) {
    return null;
  }

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.warn('Firebase init error:', err);
    return null;
  }
}

/**
 * האם Firebase מוגדר ופעיל כעת?
 */
export function isFirebaseActive() {
  return !!getFirebaseDb();
}

/**
 * שמירת מצב האפליקציה ב-Firestore בענן (מעדכן את שני האייפונים במקביל)
 */
export async function syncStateToCloud(appData) {
  const db = getFirebaseDb();
  if (!db) return false;

  try {
    const docRef = doc(db, CLOUD_DOC_PATH[0], CLOUD_DOC_PATH[1]);
    await setDoc(
      docRef,
      {
        ...appData,
        lastSyncedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Cloud sync write error:', err);
    return false;
  }
}

/**
 * האזנה בזמן אמת לעדכונים מהענן (ברגע שאחד מבני הזוג מעדכן משהו - השני רואה מיד!)
 */
export function listenToCloudSync(onDataReceived) {
  const db = getFirebaseDb();
  if (!db) return () => {};

  try {
    const docRef = doc(db, CLOUD_DOC_PATH[0], CLOUD_DOC_PATH[1]);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onDataReceived(data);
        }
      },
      (error) => {
        console.warn('Cloud sync listen error:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to listen to cloud sync:', err);
    return () => {};
  }
}
