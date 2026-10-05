import pdfplumber
import sys

def main():
    filepath = sys.argv[1]
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for i, table in enumerate(tables):
                print(f"--- Table {i} on page {page.page_number} ---")
                for row in table:
                    print(row)
            print("====================================")

if __name__ == '__main__':
    main()
