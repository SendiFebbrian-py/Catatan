/* =================================
   SERVICE WORKER — ONLINE ONLY
   ================================= */

/* INSTALL */
self.addEventListener("install", (event) => {
  // langsung aktif, tanpa cache
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    // pastikan TIDAK ADA cache tersisa
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

/* FETCH — WAJIB ONLINE */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // jika OFFLINE → TOLAK
      return new Response(
        `
        <!doctype html>
        <html lang="id">
          <head>
            <meta charset="UTF-8" />
            <title>Koneksi Diperlukan</title>
            <style>
              body {
                font-family: system-ui, Arial, sans-serif;
                background: #1e3c72;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                text-align: center;
              }
              .box {
                max-width: 320px;
              }
              h2 {
                margin-bottom: 0.5rem;
              }
            </style>
          </head>
          <body>
            <div class="box">
              <h2>❌ Offline</h2>
              <p>Aplikasi ini hanya bisa digunakan saat terhubung ke internet.</p>
              <p>Silakan aktifkan koneksi lalu muat ulang.</p>
            </div>
          </body>
        </html>
        `,
        {
          headers: { "Content-Type": "text/html" },
          status: 503,
        },
      );
    }),
  );
});
