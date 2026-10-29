/* Trust ERP — Service Worker لإشعارات Push في الخلفية.
   لازم يتحط في نفس فولدر index.html على GitHub Pages (بنفس الاسم ده بالظبط). */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDkrAPP0PtdlSuA06qc4ATbymIJJqhm1Zk",
  authDomain: "trust-group-erp.firebaseapp.com",
  projectId: "trust-group-erp",
  storageBucket: "trust-group-erp.firebasestorage.app",
  messagingSenderId: "113101269874",
  appId: "1:113101269874:web:f0cfdf163f3f3e1c720beb"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const n = payload.notification || {};
  const data = payload.data || {};
  self.registration.showNotification(n.title || 'Trust ERP', {
    body: n.body || '',
    dir: 'rtl',
    lang: 'ar',
    data: data,
    tag: data.tag || undefined,
    icon: n.icon || undefined
  });
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cl) {
      for (const c of cl) {
        try { if ('focus' in c) { if (c.navigate) c.navigate(url); return c.focus(); } } catch (err) {}
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
