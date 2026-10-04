import pdfplumber
import sys
import json
import re

def parse_pdf(filepath):
    records = []
    
    # Determine session type from filename
    if "EVENING" in filepath.upper():
        session_type = "Evening Session"
    elif "WEEKEND" in filepath.upper():
        session_type = "Weekend Session"
    elif "DISTANCE" in filepath.upper():
        session_type = "Distance Session"
    else:
        session_type = "Evening Session" # Default
        
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            if not tables:
                continue
                
            for table in tables:
                if len(table) < 6:
                    continue
                
                # Extract program and level
                # Usually in rows 3 and 4. Let's just find the first row containing 'MBA', 'MSc', 'MA', 'MPhil', or 'DISTANCE', 'EVENING'
                program_str = "Unknown Program"
                level_str = "Unknown Level"
                
                for row in table[0:5]:
                    row_text = " ".join([str(c) for c in row if c])
                    if "MBA" in row_text or "MSc" in row_text or "MA " in row_text or "MPhil" in row_text or "SESSION" in row_text:
                        program_str = row_text.replace('\n', ' ')
                    elif "YEAR" in row_text or "SEMESTER" in row_text:
                        level_str = row_text.replace('\n', ' ')
                        
                # Split program and session
                parts = re.split(r' \- | \u2013 |  ', program_str)
                program = parts[0].strip() if len(parts) > 0 else program_str.strip()
                
                # Now find the header row to know which columns are Day, Time, Subject, Venue
                header_idx = -1
                for i, row in enumerate(table):
                    row_text = " ".join([str(c) for c in row if c]).upper()
                    if "DAY" in row_text and "TIME" in row_text:
                        header_idx = i
                        break
                        
                if header_idx == -1 or header_idx + 1 >= len(table):
                    continue
                    
                header_row = table[header_idx]
                day_col = -1
                time_col = -1
                subj_col = -1
                venue_col = -1
                
                for c_idx, cell in enumerate(header_row):
                    if not cell: continue
                    cell_up = str(cell).upper()
                    if "DAY" in cell_up: day_col = c_idx
                    elif "TIME" in cell_up: time_col = c_idx
                    elif "SUBJECT" in cell_up: subj_col = c_idx
                    elif "LINK" in cell_up or "HALL" in cell_up or "VENUE" in cell_up: venue_col = c_idx
                
                if day_col == -1 or time_col == -1 or subj_col == -1:
                    # Fallback mapping based on typical table structure
                    non_empty = [i for i, c in enumerate(header_row) if c]
                    if len(non_empty) >= 3:
                        day_col = non_empty[0]
                        time_col = non_empty[1]
                        subj_col = non_empty[2]
                        if len(non_empty) >= 4:
                            venue_col = non_empty[3]
                            
                for r_idx in range(header_idx + 1, len(table)):
                    row = table[r_idx]
                    if not any(row): continue
                    
                    try:
                        day = str(row[day_col]).strip().replace('\n', ' ') if day_col != -1 and row[day_col] else ""
                        time = str(row[time_col]).strip().replace('\n', ' ') if time_col != -1 and row[time_col] else ""
                        subj = str(row[subj_col]).strip().replace('\n', ' ') if subj_col != -1 and row[subj_col] else ""
                        venue = str(row[venue_col]).strip().replace('\n', ' ') if venue_col != -1 and row[venue_col] else ""
                        
                        if "None" == day: day = ""
                        if "None" == time: time = ""
                        if "None" == subj: subj = ""
                        if "None" == venue: venue = ""
                        
                        if not day and not time:
                            if subj and records:
                                records[-1]['subject_lecturer'] += " " + subj
                            continue
                            
                        # Handle Wed/Thurs merged days common in UPSA timetables
                        if "WEDNESDAY" in day.upper() and "THURSDAY" in day.upper():
                            records.append({
                                "session_type": session_type,
                                "program": program,
                                "level_semester_group": level_str,
                                "day": "WEDNESDAY",
                                "time": time,
                                "subject_lecturer": subj,
                                "venue": venue
                            })
                            records.append({
                                "session_type": session_type,
                                "program": program,
                                "level_semester_group": level_str,
                                "day": "THURSDAY",
                                "time": time,
                                "subject_lecturer": subj,
                                "venue": venue
                            })
                            continue
                            
                        if day and subj:
                            records.append({
                                "session_type": session_type,
                                "program": program,
                                "level_semester_group": level_str,
                                "day": day,
                                "time": time,
                                "subject_lecturer": subj,
                                "venue": venue
                            })
                    except Exception as e:
                        print(f"Error parsing row {r_idx} in {filepath}: {e}")
                        
    return records

def main():
    filepaths = sys.argv[1:]
    all_records = []
    for f in filepaths:
        data = parse_pdf(f)
        all_records.extend(data)
        
    with open('scratch/parsed_timetables.json', 'w') as f:
        json.dump(all_records, f, indent=2)
        
    print(f"Saved {len(all_records)} records to scratch/parsed_timetables.json")

if __name__ == '__main__':
    main()
