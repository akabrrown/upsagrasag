import json
import urllib.request
import os
import sys

def main():
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Missing credentials")
        return
        
    endpoint = f"{supabase_url}/rest/v1/academic_timetables"
    
    with open('scratch/parsed_timetables.json', 'r') as f:
        data = json.load(f)
        
    print(f"Total records: {len(data)}. Starting from 50 (first batch inserted by Node)")
    
    data = data[50:] # skip first 50
    
    batch_size = 50
    for i in range(0, len(data), batch_size):
        batch = data[i:i+batch_size]
        req = urllib.request.Request(endpoint, data=json.dumps(batch).encode('utf-8'))
        req.add_header('Content-Type', 'application/json')
        req.add_header('apikey', supabase_key)
        req.add_header('Authorization', f'Bearer {supabase_key}')
        req.add_header('Prefer', 'return=minimal')
        
        try:
            with urllib.request.urlopen(req) as response:
                print(f"Inserted batch {i} to {i + len(batch)}. Status: {response.status}")
        except Exception as e:
            print(f"Error inserting batch {i}: {e}")

if __name__ == '__main__':
    main()
