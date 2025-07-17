# Gereksinim Analizi

## Fonksiyonel Gereksinimler

1. **Kullanıcı Kayıt Olma:** Kullanıcılar e-posta, kullanıcı adı ve şifre ile sisteme kayıt olabilmelidir.
2. **Kullanıcı Girişi:** Kayıtlı kullanıcılar JWT tabanlı kimlik doğrulama ile giriş yapabilmelidir.
3. **Görevleri Listeleme:** Kullanıcılar tüm oyun görevlerini (quest) listeleyebilmelidir.
4. **My Tasks (Kişisel Görev Listesi):** Kullanıcılar görevleri kendi listelerine ekleyebilmelidir.
5. **Görev Tamamlama:** Kullanıcılar ekledikleri görevleri tamamlanmış olarak işaretleyebilmelidir.
6. **Görev Silme:** Kullanıcılar kendi görev listesinden görev çıkarabilmelidir.
7. **Hideout Modülü:** Kullanıcılar hideout modüllerinin seviyelerini güncelleyip takip edebilmelidir.
8. **Kişiye Özel Veri:** Her kullanıcının görev ve hideout verileri sadece kendisine özel olmalıdır.
9. **Mobil Uyum:** Uygulama mobil cihazlarda da sorunsuz çalışmalıdır.
10. **Güvenli Oturum:** Kullanıcı oturumu güvenli şekilde yönetilmeli, logout işlemi yapılabilmelidir.

## Teknik Gereksinimler

1. **Backend:** Node.js + Express ile RESTful API.
2. **Veritabanı:** SQLite kullanımı.
3. **Authentication:** JWT tabanlı kimlik doğrulama.
4. **Frontend:** React ile modern ve kullanıcı dostu arayüz.
5. **Deployment:** Frontend Vercel, Backend Render.com üzerinde yayınlanmalı.
6. **CI/CD:** GitHub Actions ile otomatik build ve test pipeline.

---

**Hazırlayan:** Osmangazi Metin 