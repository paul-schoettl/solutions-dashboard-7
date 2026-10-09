// Importiere die Firebase-Skripte für Messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBW0WzA9IJoEZ2GuTBMaUoWpOQildKfohU",
  authDomain: "solutions-dashboard-7-1f6e4.firebaseapp.com",
  projectId: "solutions-dashboard-7-1f6e4",
  storageBucket: "solutions-dashboard-7-1f6e4.firebasestorage.app",
  messagingSenderId: "339789398931",
  appId: "1:339789398931:web:93c23d5dd2edd4bbc2de66",
  measurementId: "G-LPRVVJ7RE9"
};

// Initialisiere Firebase
firebase.initializeApp(firebaseConfig);

// Hole das Messaging-Objekt
const messaging = firebase.messaging();

// Optional: Zeige Benachrichtigungen an, wenn sie empfangen werden
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // Passe den Pfad ggf. an
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});