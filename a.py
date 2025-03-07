import requests
from lxml import html

# Sayfanın URL'si
url = 'https://escapefromtarkov.fandom.com/wiki/Quests'

# Web sayfasını çek
response = requests.get(url)

# Sayfanın içeriğini lxml ile analiz et
tree = html.fromstring(response.content)

# Bağlantıları alacak XPath'ler
xpaths = [
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[13]/td[3]//a/@href', 'ragmandata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[1]/tbody/tr[15]/td[3]//a/@href', 'jeagerdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[2]/tbody/tr[1]/td[3]//a/@href', 'refdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[2]/tbody/tr[3]/td[3]//a/@href', 'lightkeeperdata.txt'),
    ('//*[@id="mw-content-text"]/div[1]/table[14]/tbody/tr/td/table/tbody/tr[3]/td/table[2]/tbody/tr[5]/td[3]//a/@href', 'BTRdriverdata.txt')
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
