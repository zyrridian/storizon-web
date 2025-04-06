// untuk tes notifikasi di inspect browser
// self.addEventListener('push', (event) => {
//   console.log('Service worker pushing...');

//   async function chainPromise() {
//     await self.registration.showNotification('Ada story baru untuk Anda!', {
//       body: 'Sudah lama Anda tidak membaca cerita. Yuk, cek yang baru!',
//     });
//   }

//   event.waitUntil(chainPromise());
// });

// untuk test notifikasi setelah create story
self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  async function chainPromise() {
    const data = await event.data.json();
    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }

  event.waitUntil(chainPromise());
});
