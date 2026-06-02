import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBk9WpRKJtYOeQbuIhJwjEOrU5Nu8EAtcI",
  authDomain: "smart-helmet-7183d.firebaseapp.com",
  databaseURL: "https://smart-helmet-7183d-default-rtdb.firebaseio.com",
  projectId: "smart-helmet-7183d",
  storageBucket: "smart-helmet-7183d.firebasestorage.app",
  messagingSenderId: "31232435190",
  appId: "1:31232435190:web:f0bacd888c463f21279dd7",
}

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)