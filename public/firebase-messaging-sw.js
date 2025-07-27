// public/firebase-messaging-sw.js
/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBtO4xVtu8t8bUj3WAZ6nY67v96F90v-Y0",
  authDomain: "chat-app-ebdf7.firebaseapp.com",
  projectId: "chat-app-ebdf7",
  storageBucket: "chat-app-ebdf7.appspot.com",
  messagingSenderId: "334171912164",
  appId: "1:334171912164:web:7d22f6f02f8b39e6e279f1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/chat-icon.png", // optional icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// ✅ Fallback for non-standard push
self.addEventListener("push", (event) => {
  const data = event.data?.json();
  const notificationTitle = data?.notification?.title || "New Message";
  const notificationOptions = {
    body: data?.notification?.body || "You have a new message",
    icon: "/image/ani5.png",
    badge: "/image/ani5.png",
    data: data,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // Navigate to chat or open if not already open
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/dashboard/chat");
    })
  );
});
