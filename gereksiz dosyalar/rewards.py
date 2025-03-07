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

    # Task kısmını bulalım (örneğin, görevin adı)
    task_name = soup.find('h1').text.strip()  # Bu örnekte, görev adı genellikle h1'de olur.

    # Rewards kısmını bulalım
    rewards_section = soup.find('span', {'id': 'Rewards'}).find_next('ul')  # Rewards kısmındaki listeyi alıyoruz
    
    # Listedeki her bir ödülü alalım
    rewards_list = []
    for item in rewards_section.find_all('li'):
        rewards_list.append(item.text.strip())

    # Veritabanına kaydedelim
    conn = sqlite3.connect('escapefromtarkov.db')
    cursor = conn.cursor()

    # Tasks tablosunu oluşturuyoruz (eğer yoksa)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Tasks (
            task_id INTEGER PRIMARY KEY,
            task_name TEXT NOT NULL
        )
    ''')

    # Rewards tablosunu oluşturuyoruz (eğer yoksa)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Rewards (
            reward_id INTEGER PRIMARY KEY,
            reward TEXT NOT NULL,
            task_id INTEGER,
            FOREIGN KEY (task_id) REFERENCES Tasks (task_id)
        )
    ''')

    # Görevi Tasks tablosuna ekliyoruz
    cursor.execute("INSERT INTO Tasks (task_name) VALUES (?)", (task_name,))
    task_id = cursor.lastrowid  # Bu, eklediğimiz görevin task_id'si olacak

    # Rewards verilerini Rewards tablosuna ekliyoruz
    for reward in rewards_list:
        cursor.execute("INSERT INTO Rewards (reward, task_id) VALUES (?, ?)", (reward, task_id))

    # Değişiklikleri kaydediyoruz
    conn.commit()
    print("Görev ve ödüller başarıyla veritabanına eklendi!")

    # Veritabanı bağlantısını kapatalım
    conn.close()

else:
    print(f"Sayfa çekilirken bir hata oluştu: {response.status_code}")
