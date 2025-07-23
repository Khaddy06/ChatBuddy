// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "chat-app-ebdf7.firebaseapp.com",
  projectId: "chat-app-ebdf7",
  storageBucket: "chat-app-ebdf7.appspot.com",
  messagingSenderId: "334171912164",
  appId: "1:334171912164:web:7d22f6f02f8b39e6e279f1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);

  const notificationTitle = payload.data?.title || "🛎️ New Message";
  const notificationOptions = {
    body: payload.data?.body || "You have a new message.",
    icon: "/image/ani5.png",
    data: {
      url: payload.data?.click_action || "/",
    },
  };

  console.log("🟡 Showing notification now...");
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification clicked");
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data?.url || "/";
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
