import requests
from bs4 import BeautifulSoup

# URL'yi belirtin
url = 'https://escapefromtarkov.fandom.com/wiki/Quests'

# Sayfayı alın
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Tabloyu seçin, sayfa yapısını kontrol ederek doğru CSS seçici kullanalım
table = soup.select_one('table.wikitable.sortable')

# Eğer tablo bulunamazsa, hata mesajı ver
if table is None:
    print("Tablo bulunamadı!")
else:
    # Tablo içindeki tüm <th> etiketlerini al
    th_elements = table.find_all('th')

    # Sadece başlıklardaki <a> etiketlerini al
    links = []
    for th in th_elements:
        a_tag = th.find('a', href=True)
        if a_tag:
            links.append(a_tag['href'])

    # Bağlantıları yazma
    with open('quest_links.txt', 'w', encoding='utf-8') as file:
        for link in links:
            file.write('https://escapefromtarkov.fandom.com' + link + '\n')

    print("Bağlantılar 'quest_links.txt' dosyasına yazıldı.")


