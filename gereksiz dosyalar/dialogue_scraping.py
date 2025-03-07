import requests
from bs4 import BeautifulSoup
import sqlite3

# URL'yi belirleyelim
url = 'https://escapefromtarkov.fandom.com/wiki/Shooting_Cans'  # Örnek bir URL

# Request ile sayfayı çekelim
response = requests.get(url)

# Sayfa başarılı şekilde geldi mi kontrol edelim
if response.status_code == 200:
    print("Sayfa başarıyla çekildi!")

    # BeautifulSoup ile HTML içeriğini parse edelim
    soup = BeautifulSoup(response.content, 'html.parser')

    # Diyalog kısmını çekiyoruz
    dialog_section = soup.find('span', {'id': 'Dialogue'}).find_next('p').text.strip()

    # Çekilen veriyi yazdıralım
    print("Diyalog:", dialog_section)

    # Veritabanına kaydedelim
    conn = sqlite3.connect('escapefromtarkov.db')
    cursor = conn.cursor()

    # "Dialogue" tablosu oluşturulmuş olmalı, eğer yoksa oluşturuyoruz
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Dialogue (
            id INTEGER PRIMARY KEY,
            metin TEXT NOT NULL
        )
    ''')

    # Veritabanına insert işlemi
    cursor.execute("INSERT INTO Dialogue (metin) VALUES (?)", (dialog_section,))

    # Değişiklikleri kaydediyoruz
    conn.commit()
    print("Diyalog verisi başarıyla veritabanına eklendi!")

    # Veritabanı bağlantısını kapatalım
    conn.close()

else:
    print(f"Sayfa çekilirken bir hata oluştu: {response.status_code}")
