import re

def merge_txt_files(file1_path, file2_path, output_path):
    try:
        # Dosyaları aç ve oku
        with open(file1_path, 'r', encoding='utf-8') as file1, open(file2_path, 'r', encoding='utf-8') as file2:
            file1_content = file1.readlines()
            file2_content = file2.readlines()

        # Her satırı işleyerek "->" işaretini ve diğer gereksiz karakterleri temizle
        def clean_line(line):
            # Satırdaki -> işaretini ve öncesindeki boşlukları temizle
            line = re.sub(r'^\s*->', '', line)  # -> işaretini ve öncesindeki boşlukları kaldır
            line = re.sub(r'\s*///\s*', '', line)  # /// karakterlerini temizle
            line = line.strip()  # Satırın başındaki ve sonundaki boşlukları temizle
            return line

        # Dosya içeriklerini temizle
        cleaned_content = [clean_line(line) for line in (file1_content + file2_content)]

        # Benzersiz içerikleri almak için
        unique_content = []
        seen = set()

        for line in cleaned_content:
            if line and line not in seen:
                unique_content.append(line)
                seen.add(line)

        # Temizlenmiş ve benzersiz içeriği yeni dosyaya yaz
        with open(output_path, 'w', encoding='utf-8') as output_file:
            output_file.write('\n'.join(unique_content))
        
        print(f"Dosyalar başarıyla birleştirildi, temizlendi ve tekrar eden görevler silindi: {output_path}")
    
    except Exception as e:
        print(f"Hata oluştu: {e}")

# Dosya yolları
file1_path = 'lightkeeper_tasks.txt'  # İlk dosyanın yolu
file2_path = 'information_source_previous_tasks.txt'  # İkinci dosyanın yolu
output_path = 'merged_tasks_cleaned.txt'  # Çıktı dosyasının yolu

# Fonksiyonu çağır
merge_txt_files(file1_path, file2_path, output_path)
