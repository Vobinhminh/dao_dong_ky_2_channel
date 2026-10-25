const CACHE_NAME = 'foxlab-oscillo-v1';

// Danh sách các file cần lưu cache (giả sử file giao diện của bạn tên là index.html)
const urlsToCache = [
  './',
  './index.html'
];

// Sự kiện Cài đặt (Lưu file vào Cache)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Sự kiện Kích hoạt (Xóa cache cũ nếu có bản cập nhật)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Sự kiện Fetch (Xử lý khi ứng dụng yêu cầu dữ liệu)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. BỎ QUA CACHE cho API Chatbot và QR Code (Để hàm catch trong HTML tự lo việc trả lời Offline)
  if (url.hostname === 'script.google.com' || url.hostname === 'api.qrserver.com') {
    return; // Trình duyệt sẽ tự báo lỗi Network nếu offline, HTML sẽ tự gọi fallback
  }

  // 2. LƯU CACHE Google Fonts (Để giao diện không bị lỗi font khi Offline)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Xử lý các file nội bộ (HTML, CSS, JS...) ưu tiên Cache trước
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Trả về kết quả từ Cache nếu có
        if (response) {
          return response;
        }
        // Nếu không có trong Cache thì lấy từ Network
        return fetch(event.request).catch(() => {
          // Bắt lỗi nếu mất mạng mà chưa có cache
          console.log('Báo lỗi: Đang ngoại tuyến và file chưa được lưu cache.');
        });
      })
  );
});
