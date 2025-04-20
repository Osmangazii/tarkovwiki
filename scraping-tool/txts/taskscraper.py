import requests
from lxml import html

# Sayfanın URL'si
url = 'https://escapefromtarkov.fandom.com/wiki/Quests'

# Web sayfasını çek
response = requests.get(url)

# Sayfanın içeriğini lxml ile analiz et
tree = html.fromstring(response.content)

# Bağlantıları alacak XPath'ler ve dosya isimleri
xpaths = [
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[1]/td[3]//a/@href', '1prapordata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[7]/td[3]//a/@href', '4skierdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[5]/td[3]//a/@href', '3fencedata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[9]/td[3]//a/@href', '5peacekeeperdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[11]/td[3]//a/@href', '6mechanicdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[13]/td[3]//a/@href', '7ragmandata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[2]/tbody/tr[1]/td[3]//a/@href', '9refdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[2]/tbody/tr[3]/td[3]//a/@href', '10lightkeeperdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[2]/tbody/tr[5]/td[3]//a/@href', '11BTRdriverdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[3]/td[3]//a/@href', '2therapistdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[15]/td[3]//a/@href', '8jeagerdata.txt')
]

# Bağlantıları çekip uygun dosyaya yaz
for xpath, filename in xpaths:
    links = tree.xpath(xpath)
    with open(filename, 'w', encoding='utf-8') as file:
        for link in links:
            if link:
                # Bağlantıyı tam URL formatına getirme
                full_link = f'https://escapefromtarkov.fandom.com{link}' if link.startswith('/') else link
                file.write(f'{full_link}\n')
    print(f'Bağlantılar {filename} dosyasına yazıldı!')

