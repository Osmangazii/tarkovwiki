import sqlite3

# Veritabanına bağlanma
conn = sqlite3.connect('escapefromtarkov.db')  # Veritabanı yolunu doğru şekilde güncellediğinizden emin olun
cursor = conn.cursor()

# required_for_lightkeeper sütununun olup olmadığını kontrol etme ve ekleme
cursor.execute("""
    PRAGMA table_info(tasks);
""")
columns = [column[1] for column in cursor.fetchall()]

# Eğer required_for_lightkeeper sütunu yoksa, ekleyelim ve varsayılan değeri FALSE olarak ayarlayalım
if 'required_for_lightkeeper' not in columns:
    cursor.execute("""
        ALTER TABLE tasks ADD COLUMN required_for_lightkeeper BOOLEAN DEFAULT FALSE;
    """)
    conn.commit()

# `NULL` değerlerini FALSE ile güncelleme
cursor.execute("""
    UPDATE tasks
    SET required_for_lightkeeper = FALSE
    WHERE required_for_lightkeeper IS NULL;
""")
conn.commit()

# Txt dosyasındaki görev isimlerini okuma
with open('lightkeepertasks/merged_tasks_cleaned.txt', 'r') as file:
    task_names = [line.strip() for line in file.readlines()]

# Her görev için veritabanında kontrol yapma
for task_name in task_names:
    cursor.execute("""
        SELECT 1 FROM tasks WHERE task_name = ?;
    """, (task_name,))
    result = cursor.fetchone()

    if result:
        # Eğer görev varsa, required_for_lightkeeper'ı TRUE yap
        cursor.execute("""
            UPDATE tasks
            SET required_for_lightkeeper = TRUE
            WHERE task_name = ?;
        """, (task_name,))
        conn.commit()
        print(f"'{task_name}' görevi bulundu, required_for_lightkeeper TRUE olarak güncellendi.")
    else:
        # Eğer görev yoksa, required_for_lightkeeper'ı FALSE bırak (veritabanı zaten varsayılan olarak FALSE olacak)
        print(f"'{task_name}' görevi bulunamadı, required_for_lightkeeper varsayılan olarak FALSE kaldı.")

# Bağlantıyı kapatma
conn.close()

print("İşlem tamamlandı.")
