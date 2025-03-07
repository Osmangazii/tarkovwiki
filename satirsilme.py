import sqlite3

# Veritabanına bağlanalım
conn = sqlite3.connect('escapefromtarkov.db')
cursor = conn.cursor()

# "Dialogue" tablosundaki ikinci satırı silmek için
# Eğer id'si 2 olan satırı silmek istiyorsan
cursor.execute("DELETE FROM Objectives WHERE id = 3")

# Değişiklikleri kaydedelim
conn.commit()

print("İkinci satır başarıyla silindi!")

# Veritabanı bağlantısını kapatalım
conn.close()