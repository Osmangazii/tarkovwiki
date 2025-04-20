def merge_text_files():
    """
    Merges 11 specific text files into one output file.
    Files are merged in order with their content concatenated.
    """
    # List of input file names in the desired order
    input_files = [
        "1prapordata.txt",
        "2therapistdata.txt",
        "3fencedata.txt",
        "4skierdata.txt",
        "5peacekeeperdata.txt",
        "6mechanicdata.txt",
        "7ragmandata.txt",
        "8jeagerdata.txt",
        "9refdata.txt",
        "10lightkeeperdata.txt",
        "11BTRdriverdata.txt"
    ]
    
    # Output file name
    output_file = "tarkov_tasks_urls.txt"
    
    # Open output file for writing
    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Process each input file
        for file_name in input_files:
            try:
                # Open and read input file
                with open(file_name, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    
                    # Write content to output file
                    outfile.write(content)
                    
                    # Add a newline if the file doesn't end with one
                    if content and not content.endswith('\n'):
                        outfile.write('\n')
                        
                print(f"Successfully merged {file_name}")
                
            except FileNotFoundError:
                print(f"Warning: File {file_name} not found and was skipped")
            except Exception as e:
                print(f"Error processing {file_name}: {e}")
    
    print(f"All files have been merged into {output_file}")

if __name__ == "__main__":
    merge_text_files()