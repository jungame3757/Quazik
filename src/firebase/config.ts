// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// 환경별 Firebase 설정 (env 우선, 없으면 기존 프로덕션 값으로 fallback)
const firebaseConfig: FirebaseOptions = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCZCOQDp6LFehxraGRSZH25h68cpNpuYI8",
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "quizshow-8ded7.firebaseapp.com",
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quizshow-8ded7",
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "quizshow-8ded7.firebasestorage.app",
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "952379230327",
	appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:952379230327:web:eabeb86c0e5c4b03451e72",
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FVRVZENGSQ",
	databaseURL:
		(import.meta.env as any).VITE_FIREBASE_DATABASE_URL ||
		"https://quizshow-8ded7-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics는 measurementId가 있는 브라우저 환경에서만 초기화
const analytics = typeof window !== "undefined" && firebaseConfig.measurementId ? getAnalytics(app) : undefined;
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, analytics, auth, db, rtdb }; 