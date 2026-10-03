import sys
import json
from docx import Document
import re

def parse_docx_tables(filepath):
    document = Document(filepath)
    records = []
    
    for i, table in enumerate(document.tables):
        if len(table.rows) < 6:
            continue
            
        row3 = [c.text.strip() for c in table.rows[3].cells]
        row4 = [c.text.strip() for c in table.rows[4].cells]
        
        program_session = row3[0].replace('\n', ' ').strip()
        level_sem = row4[0].replace('\n', ' ').strip()
        
        # Split program and session based on " - " or "\u2013"
        parts = re.split(r' \- | \u2013 ', program_session)
        program = parts[0].strip() if len(parts) > 0 else "Unknown Program"
        session = parts[1].strip() if len(parts) > 1 else "Evening Session"
        
        # normalize session type
        if "EVENING" in session.upper():
            session_type = "Evening Session"
        elif "WEEKEND" in session.upper():
            session_type = "Weekend Session"
        elif "DISTANCE" in session.upper():
            session_type = "Distance Session"
        else:
            if "EVENING" in filepath.upper():
                session_type = "Evening Session"
            elif "WEEKEND" in filepath.upper():
                session_type = "Weekend Session"
            else:
                session_type = "Evening Session"
                
        # Handle rows 6+
        for r_idx in range(6, len(table.rows)):
            row = table.rows[r_idx]
            cells = [c.text.strip().replace('\n', ' ') for c in row.cells]
            if len(cells) < 4:
                continue
                
            day = cells[0].strip()
            time = cells[1].strip()
            subj = cells[2].strip()
            venue = cells[3].strip() if len(cells) > 3 else ""
            
            # Skip empty rows or continuation rows that are merged weirdly
            if not day and not time:
                if subj and records:
                    records[-1]['subject_lecturer'] += " " + subj
                continue
            
            # fix merged wednesday thursday things
            if "WEDNESDAY" in day.upper() and "THURSDAY" in day.upper():
                day1 = "WEDNESDAY"
                day2 = "THURSDAY"
                records.append({
                    "session_type": session_type,
                    "program": program,
                    "level_semester_group": level_sem,
                    "day": day1,
                    "time": time,
                    "subject_lecturer": subj,
                    "venue": venue
                })
                records.append({
                    "session_type": session_type,
                    "program": program,
                    "level_semester_group": level_sem,
                    "day": day2,
                    "time": time,
                    "subject_lecturer": subj,
                    "venue": venue
                })
                continue
                
            if day and time and subj:
                records.append({
                    "session_type": session_type,
                    "program": program,
                    "level_semester_group": level_sem,
                    "day": day,
                    "time": time,
                    "subject_lecturer": subj,
                    "venue": venue
                })
                
    return records

def main():
    filepaths = sys.argv[1:]
    all_records = []
    for f in filepaths:
        data = parse_docx_tables(f)
        all_records.extend(data)
        
    with open('scratch/parsed_timetables.json', 'w') as f:
        json.dump(all_records, f, indent=2)

if __name__ == '__main__':
    main()
