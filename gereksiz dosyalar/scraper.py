import requests
from bs4 import BeautifulSoup
import sqlite3
import time

# Dosyadan URL'leri okuma
url_file = "tarkov_tasks_urls.txt"
try:
    with open(url_file, "r") as file:
        # Her satırı bir URL olarak alalım ve boşlukları temizleyelim
        urls = [line.strip() for line in file if line.strip()]
    print(f"{len(urls)} adet URL okundu.")
except FileNotFoundError:
    print(f"{url_file} dosyasi bulunamadi. Lütfen bu dosyayi oluşturun ve URL'leri satir satir yazin.")
    exit()

# veritabani baglantisini olusturma
conn = sqlite3.connect('escapefromtarkov.db')
cursor = conn.cursor()

# Traders adlarini manuel olarak ekle(Eğer yoksa)
traders = [
    'Prapor', 'Therapist', 'Fence', 'Skier', 'Peacekeeper', 
    'Mechanic', 'Ragman', 'Jaeger', 'Ref', 'Lightkeeper', 'BTR Driver', 'Any'
]

# Locations verilerini manuel olarak ekle
locations = [
    'Factory', 'Customs', 'Woods', 'Interchange', 'Reserve', 
    'Shoreline', 'Labs', 'Streets of Tarkov', 'The Lab', 'Ground Zero', 'Any'
]

# Traders tablosunu oluşturma (eğer yoksa)
cursor.execute(''' 
    CREATE TABLE IF NOT EXISTS Traders (
        trader_id INTEGER PRIMARY KEY,
        trader_name TEXT NOT NULL UNIQUE
    )
''')

# Locations tablosunu oluşturma (eğer yoksa)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Locations (
        location_id INTEGER PRIMARY KEY,
        map_name TEXT NOT NULL UNIQUE
    )
''')

# Tasks tablosunu oluşturma (eğer yoksa)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Tasks (
        task_id INTEGER PRIMARY KEY,
        task_name TEXT NOT NULL,
        trader_id INTEGER,
        location_id INTEGER,
        required_for_kappa BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (trader_id) REFERENCES Traders (trader_id),
        FOREIGN KEY (location_id) REFERENCES Locations (location_id)
    )
''')

# Rewards tablosunu oluşturma (eğer yoksa)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Rewards (
        reward_id INTEGER PRIMARY KEY,
        reward TEXT NOT NULL,
        task_id INTEGER,
        FOREIGN KEY (task_id) REFERENCES Tasks (task_id)
    )
''')

# Objectives tablosunu oluşturuyoruz (eğer yoksa)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Objectives (
        objective_id INTEGER PRIMARY KEY,
        objective TEXT NOT NULL,
        task_id INTEGER,
        FOREIGN KEY (task_id) REFERENCES Tasks (task_id)
    )
''')

# Locations verilerini manuel olarak ekliyoruz
for location in locations:
    cursor.execute("INSERT OR IGNORE INTO Locations (map_name) VALUES (?)", (location,))

# Traders verilerini manuel olarak ekleyelim
for trader in traders:
    cursor.execute("INSERT OR IGNORE INTO Traders (trader_name) VALUES (?)", (trader,))

# Değişiklikleri kaydediyoruz
conn.commit()

# Her URL'yi işleyelim
for i, url in enumerate(urls, 1):
    print(f"İşleniyor ({i}/{len(urls)}): {url}")
    
    try:
        # Request ile sayfayı çekelim
        response = requests.get(url)
        
        # Sayfa başarılı şekilde geldi mi kontrol edelim
        if response.status_code == 200:
            print("Sayfa başariyla çekildi!")

            # BeautifulSoup ile HTML içeriğini parse edelim
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Görev adı (task_name)
            task_name_element = soup.find('h1')
            if task_name_element:
                task_name = task_name_element.text.strip()  # Görev adı genellikle h1'de olur
            else:
                print("Görev adi bulunamadi, URL adini kullaniyoruz.")
                task_name = url.split('/')[-1].replace('_', ' ')  # URL'den bir isim oluştur

            # Trader adı - yeni locator kullanıyoruz
            trader_name_section = soup.select_one('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content')

            if trader_name_section:
                trader_name = trader_name_section.text.strip()
            else:
                print("Trader adi bulunamadi.")
                trader_name = "Any"  # Trader bulunamazsa 'Any' olarak atıyoruz

            # Burada trader_id 12 ise, trader_name'den yeni bir değer alıyoruz (2. koddan alınan iyileştirme)
            if trader_name not in traders:
                new_trader_name_section = soup.select_one('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(4) > td.va-infobox-content')
                if new_trader_name_section:
                    new_trader_name = new_trader_name_section.text.strip()
                    if new_trader_name in traders:
                        trader_name = new_trader_name
                        print(f"Alternatif trader adi bulundu: {trader_name}")

            # Location (Map) verisini yeni locator ile çekiyoruz
            location_section = soup.select_one('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(4) > td.va-infobox-content')

            if location_section:
                map_name = location_section.text.strip()
            else:
                print("Location (Map) adi bulunamadi.")
                map_name = "Any"  # Location bulunamazsa 'Any' olarak atıyoruz

            # Required for Kappa değerini alıyoruz
            kappa_section = soup.select_one('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(8) > td.va-infobox-content')
            if kappa_section:
                kappa_value = kappa_section.text.strip()
            else:
                # Eğer ilk seçicide veri yoksa, alternatif seçiciyi deniyoruz
                kappa_section = soup.select_one('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content')
                if kappa_section:
                    kappa_value = kappa_section.text.strip()
                else:
                    kappa_value = "No"  # Eğer hiç veri yoksa default olarak "No" kabul ediyoruz
            
            # Eğer "No, but a subsequent quest Yes" yazıyorsa, "Yes" olarak alıyoruz
            if "No, but a subsequent quest Yes" in kappa_value:
                kappa_value = "Yes"
            
            # Boolean değere çeviriyoruz
            required_for_kappa = True if kappa_value == "Yes" else False

            # Rewards kısmını bulalım
            rewards_list = []
            rewards_header = soup.find('span', {'id': 'Rewards'})
            if rewards_header:
                rewards_section = rewards_header.find_next('ul')  # Rewards kısmındaki listeyi alıyoruz
                if rewards_section:
                    for item in rewards_section.find_all('li'):
                        rewards_list.append(item.text.strip())
                else:
                    print("Rewards listesi bulunamadi.")
            else:
                print("Rewards basligi bulunamadi.")
            
            # Objectives kısmını bulalım
            objectives_list = []
            objectives_header = soup.find('span', {'id': 'Objectives'})
            if objectives_header:
                objectives_section = objectives_header.find_next('ul')  # Objectives kısmındaki listeyi alıyoruz
                if objectives_section:
                    for item in objectives_section.find_all('li'):
                        objectives_list.append(item.text.strip())
                else:
                    print("Objectives listesi bulunamadi.")
            else:
                print("Objectives başligi bulunamadi.")
            
            # Location'ı Locations tablosunda arıyoruz
            cursor.execute("SELECT location_id FROM Locations WHERE map_name = ?", (map_name,))
            location_row = cursor.fetchone()

            if location_row:
                # Location zaten var, mevcut location_id'yi alıyoruz
                location_id = location_row[0]
            else:
                # Eğer location yoksa, 'Any' olarak işlemi yapıyoruz
                cursor.execute("SELECT location_id FROM Locations WHERE map_name = 'Any'")
                location_row = cursor.fetchone()
                if location_row:
                    location_id = location_row[0]
                else:
                    # Eğer 'Any' location'ı yoksa, 'Any' location'ı ekliyoruz
                    cursor.execute("INSERT INTO Locations (map_name) VALUES ('Any')")
                    location_id = cursor.lastrowid

            # Trader'ı Traders tablosunda arıyoruz
            cursor.execute("SELECT trader_id FROM Traders WHERE trader_name = ?", (trader_name,))
            trader_row = cursor.fetchone()

            if trader_row:
                # Trader zaten var, mevcut trader_id'sini alıyoruz
                trader_id = trader_row[0]
            else:
                # Eğer trader yoksa, 'Any' olarak işlemi yapıyoruz
                cursor.execute("SELECT trader_id FROM Traders WHERE trader_name = 'Any'")
                trader_row = cursor.fetchone()
                if trader_row:
                    trader_id = trader_row[0]
                else:
                    # Eğer 'Any' trader'ı yoksa, 'Any' trader'ı ekliyoruz
                    cursor.execute("INSERT INTO Traders (trader_name) VALUES ('Any')")
                    trader_id = cursor.lastrowid

            # Görevi Tasks tablosuna ekliyoruz
            cursor.execute("SELECT task_id FROM Tasks WHERE task_name = ? AND trader_id = ?", (task_name, trader_id))
            task_row = cursor.fetchone()

            if task_row:
                # Görev zaten varsa, task_id'yi alıyoruz ve required_for_kappa değerini güncelliyoruz
                task_id = task_row[0]
                cursor.execute("UPDATE Tasks SET required_for_kappa = ? WHERE task_id = ?", (required_for_kappa, task_id))
                print(f"Görev zaten var: {task_name}. Kappa durumu güncellendi.")
                
                # Mevcut rewards ve objectives'i temizle (isteğe bağlı)
                cursor.execute("DELETE FROM Rewards WHERE task_id = ?", (task_id,))
                cursor.execute("DELETE FROM Objectives WHERE task_id = ?", (task_id,))
            else:
                # Görev yoksa, yeni bir görev ekliyoruz
                cursor.execute("INSERT INTO Tasks (task_name, trader_id, location_id, required_for_kappa) VALUES (?, ?, ?, ?)", 
                              (task_name, trader_id, location_id, required_for_kappa))
                task_id = cursor.lastrowid  # Yeni görevin task_id'sini alıyoruz
                print(f"Yeni görev eklendi: {task_name}")

            # Rewards verilerini Rewards tablosuna ekliyoruz
            for reward in rewards_list:
                cursor.execute("INSERT INTO Rewards (reward, task_id) VALUES (?, ?)", (reward, task_id))

            # Objectives verilerini Objectives tablosuna ekliyoruz
            for objective in objectives_list:
                cursor.execute("INSERT INTO Objectives (objective, task_id) VALUES (?, ?)", (objective, task_id))

            # Değişiklikleri kaydediyoruz
            conn.commit()
            print(f"Görev: {task_name} basariyla veritabanina eklendi!")
            
        else:
            print(f"Sayfa çekilirken bir hata oluştu: {response.status_code}")
    
    except Exception as e:
        print(f"URL işlenirken bir hata oluştu: {e}")
    
    # İki URL arasında server'a yük bindirmemek için biraz bekle
    if i < len(urls):
        print("Bir sonraki URL için 2 saniye bekleniyor...")
        time.sleep(2)

# Veritabanı bağlantısını kapatalım
conn.close()
print("Tüm URL'ler işlendi, veritabani bağlantisi kapatildi.")