const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyDU_H-CrxgvRdYgEuv6vsnzYr8n8GDUPLo",
  authDomain: "chatroom-2bbb4.firebaseapp.com",
  projectId: "chatroom-2bbb4",
  storageBucket: "chatroom-2bbb4.appspot.com",
  messagingSenderId: "894282066038",
  appId: "1:894282066038:web:d3fc2d226b25825b0a5757",
  measurementId: "G-TYRQTMDW45"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db };
