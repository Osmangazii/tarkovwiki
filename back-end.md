# Back-End Detayları

## Kullanılan Teknolojiler
- **Node.js** (v18+)
- **Express.js** (REST API için)
- **SQLite** (hafif, dosya tabanlı veritabanı)
- **jsonwebtoken** (JWT ile kimlik doğrulama)
- **bcryptjs** (şifre hashleme)
- **dotenv** (çevresel değişken yönetimi)
- **cors** (CORS ayarları)

## Ana Özellikler
- Kullanıcı kayıt ve giriş işlemleri (JWT ile güvenli kimlik doğrulama)
- Görev (quest) ekleme, silme, tamamlama, listeleme
- Kişiye özel görev listesi (My Tasks)
- Hideout modüllerinin seviyelerini güncelleme ve takip
- Her kullanıcıya özel veri yönetimi
- RESTful API mimarisi

## Temel API Endpointleri

- `POST   /api/auth/register`   → Kullanıcı kaydı
- `POST   /api/auth/login`      → Kullanıcı girişi (JWT döner)
- `GET    /api/todo`            → Kullanıcının görev listesini getirir
- `POST   /api/todo`            → Görev ekler
- `DELETE /api/todo/:taskId`    → Görev siler
- `PATCH  /api/todo/:taskId/complete` → Görev tamamlandı olarak işaretler
- `GET    /api/hideout`         → Hideout modül listesini getirir
- `GET    /api/hideout/progress`→ Kullanıcının hideout ilerlemesini getirir
- `POST   /api/hideout/progress`→ Hideout modül seviyesini günceller

## Deployment
- **Backend:** Render.com üzerinde barındırılıyor.
- **Çevresel Değişkenler:** `.env` dosyası ile yönetiliyor (örn. JWT_SECRET, PORT).

## Güvenlik
- Tüm korumalı endpointlerde JWT doğrulaması zorunlu.
- Şifreler bcrypt ile hashlenerek saklanıyor.
- CORS ile sadece belirli domainlerden erişime izin veriliyor.

---

**Hazırlayan:** Osmangazi Metin 