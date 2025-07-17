# PROJE ADI: Tarkov Tiki

## Proje Tanımı
Tarkov Tiki, Escape from Tarkov oyunundaki görevleri ve hideout ilerlemesini kolayca takip edebilmek için geliştirilmiş bir görev ve ilerleme takip platformudur. Kullanıcılar, oyun içi görevlerini ekleyip tamamlayabilir, hideout modüllerinin seviyelerini güncelleyebilir ve tüm ilerlemelerini tek bir yerde görebilirler. Modern ve kullanıcı dostu arayüzü sayesinde, oyuncular görevlerini ve hideout gelişimlerini hızlıca yönetebilir, hangi görevlerin tamamlandığını ve sıradaki hedeflerini kolayca takip edebilirler. Uygulama, güvenli kullanıcı girişi, kişiye özel görev listesi ve mobil uyumlu tasarımı ile oyun deneyimini destekler.

## Proje Kategorisi
Oyun Yardımcı Uygulaması / Görev Takip Platformu

## Referans Uygulama
https://tarkovwiki-1.vercel.app/

## Uygulama Adresi
https://tarkovwiki-1.vercel.app/

## Grup Adı
Bireysel Proje

## Proje Ekibi
Osmangazi Metin

---

### Gereksinim Analizi

[Gereksinim Analizi için tıklayın.](gereksinimler.md)

### Durum Diyagramı

![Durum Diyagramı](diyagram.pdf)

### Durum Senaryoları

[Durum Senaryosu PDF için tıklayın.](durum_senaryosu.pdf)

### Front-End

[Front-End Detayları için tıklayın.](front-end.md)

### Back-End

[Back-End Detayları için tıklayın.](back-end.md)

### Video Sunum


---



scraping-tool, TarkovTiki ile ilgili çeşitli görevleri yerine getiren Python betikleri içermektedir.

## Adımlar

Proje dosyalarınızı düzgün bir şekilde çalıştırmak için aşağıdaki adımları takip edin:

1. `lightkeepertasks/previnformat.py` ve `lightkeepertasks/prevnetwork.py` dosyalarını çalıştırınız.
2. `lightkeepertasks/merg.py` dosyasını çalıştırınız.
3. `txts/taskscraper.py` dosyasını çalıştırınız.
4. `txts/taskmerger.py` dosyasını çalıştırınız.
5. `scraper.py` dosyasını çalıştırınız.
6. `rflcolumn.py` dosyasını çalıştırınız.
7. `lightkeepertasks/whatsonthefd.py` dosyasını çalıştırınız.

Her adımın başarılı bir şekilde çalıştığından emin olduktan sonra projeye devam edebilirsiniz.

# Gerekli kütüphaneler

Aşağıdaki Python kütüphaneleri gereklidir:

- `beautifulsoup4`
- `certifi`
- `charset-normalizer`
- `idna`
- `lxml`
- `pip`
- `requests`
- `soupsieve`
- `typing_extensions`
- `urllib3`

Bu kütüphaneleri yüklemek için aşağıdaki komutu kullanabilirsiniz:

```bash
pip install beautifulsoup4 certifi charset-normalizer idna lxml pip requests soupsieve typing_extensions urllib3
```
