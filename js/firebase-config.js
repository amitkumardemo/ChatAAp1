import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsqyeSiS7ZQWBkbwUX-aHuZqaGo4c5zQg",
  authDomain: "e-commerce-707d4.firebaseapp.com",
  projectId: "e-commerce-707d4",
  storageBucket: "e-commerce-707d4.firebasestorage.app",
  messagingSenderId: "325088744154",
  appId: "1:325088744154:web:13502c7e300f6bdfdb0be3",
  measurementId: "G-N6KDKNN6MJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
