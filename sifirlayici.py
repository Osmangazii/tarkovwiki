import sqlite3

# Veritabanına bağlan
conn = sqlite3.connect('escapefromtarkov.db')
cursor = conn.cursor()

# Eski tabloları silelim
cursor.execute('DROP TABLE IF EXISTS Rewards')
cursor.execute('DROP TABLE IF EXISTS Tasks')
cursor.execute('DROP TABLE IF EXISTS Objectives')
cursor.execute('DROP TABLE IF EXISTS Dialogue')
cursor.execute('DROP TABLE IF EXISTS Traders')
cursor.execute('DROP TABLE IF EXISTS Locations')

# Veritabanı bağlantısını kapatalım
conn.commit()
conn.close()

print("Tablolar silindi, veritabanı sıfırlandı.")