import sqlite3

# Veritabanına bağlanma
conn = sqlite3.connect('escapefromtarkov.db')  # Veritabanı yolunu doğru şekilde güncellediğinizden emin olun
cursor = conn.cursor()
# task_id 131 için required_for_lightkeeper değerini 1 yapma
cursor.execute("""
    UPDATE tasks
    SET required_for_lightkeeper = 1
    WHERE task_id = 131;
""")
conn.commit()

print("task_id 131 için required_for_lightkeeper değeri 1 olarak güncellendi.")

# Bağlantıyı kapatma
conn.close()

print("İşlem tamamlandı.")