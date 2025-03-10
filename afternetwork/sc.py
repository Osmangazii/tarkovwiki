import requests
from lxml import html
import time

# Tarkov görevlerinin olduğu sayfanın URL'si
base_url = "https://escapefromtarkov.fandom.com"
main_url = "https://escapefromtarkov.fandom.com/wiki/Information_Source"

# Sayfa içeriğini al
response = requests.get(main_url)
tree = html.fromstring(response.content)

# XPath kullanarak görev bağlantılarını çek
task_links = tree.xpath('//*[@id="mw-content-text"]/div[1]/ul[1]/li[2]/ul/li/a')

def get_previous_tasks(task_url):
    """Bir görevin sayfasına giderek önceki görevleri bulur."""
    prev_tasks = []
    while task_url:
        print(f"Veri çekiliyor: {task_url}")
        response = requests.get(task_url)
        tree = html.fromstring(response.content)

        # Buradaki XPath ile önceki görev bağlantısını alıyoruz
        prev_task = tree.xpath('//*[@id="va-infobox0-content"]/td/table[3]/tbody/tr[4]/td[1]/a/text()')
        prev_links = tree.xpath('//*[@id="va-infobox0-content"]/td/table[3]/tbody/tr[4]/td[1]/a/@href')

        if prev_task:
            prev_tasks.append(prev_task[0])  # İlk bulduğumuz görevi ekliyoruz
        
        if prev_links:
            # Önceki görev bağlantısına yöneliyoruz
            task_url = base_url + prev_links[0]
        else:
            break
        time.sleep(1)  # Fandom'a fazla istek atmayı önlemek için bekleme süresi
    
    return prev_tasks

# Çekilen görevleri bir .txt dosyasına kaydet
with open("information_source_previous_tasks.txt", "w", encoding="utf-8") as file:
    # İlk görev olan "Information Source" sayfası üzerinden işlemi başlatıyoruz
    task_name = "Information Source"
    print(f"Görev işleniyor: {task_name}")
    file.write(f"{task_name}\n")
    
    # Önceki görevleri bul ve ekle
    previous_tasks = get_previous_tasks(main_url)
    for prev in previous_tasks:
        print(f"  -> Önceki görev bulundu: {prev}")
        file.write(f"  -> {prev}\n")

print("Görevler ve önceki görevler başarıyla 'information_source_previous_tasks.txt' dosyasına kaydedildi!")
