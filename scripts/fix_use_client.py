import os

admin_dir = r"C:\Users\akaye\Desktop\PROjects\grasag-upsa\frontend\src\app\admin"
components_dir = r"C:\Users\akaye\Desktop\PROjects\grasag-upsa\frontend\src\components"

hooks = ["useState", "useEffect", "useForm", "useRouter", "useSearchParams"]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if any(hook in content for hook in hooks):
        if not content.strip().startswith("'use client'") and not content.strip().startswith('"use client"'):
            print(f"Adding 'use client' to {filepath}")
            # Insert at the very beginning
            new_content = "'use client';\n\n" + content
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

for root, dirs, files in os.walk(admin_dir):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

for root, dirs, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
