import csv
import sys
import re
import os
import io
import time
import requests
from dotenv import load_dotenv

try:
    import pyperclip
except ImportError:
    pyperclip = None

# Load environment variables from .env file
load_dotenv()

def get_csv_rows(source):
    """
    Fetches data from a local file path or a URL with a cache-busting timestamp.
    Returns a list of rows.
    """
    if source.startswith(('http://', 'https://')):
        # Append a timestamp query parameter to bypass cache
        timestamp = int(time.time())
        separator = '&' if '?' in source else '?'
        cache_busting_url = f"{source}{separator}t={timestamp}"
        
        response = requests.get(cache_busting_url)
        response.raise_for_status()
        
        # Use io.StringIO to treat the string response like a file
        f = io.StringIO(response.text)
        reader = csv.reader(f)
    else:
        with open(source, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
        return list(reader)
    
    return list(reader)

def generate_html(rows):
    header = rows[0]
    body_rows = rows[1:]

    # Regex for time: 1-2 digits + colon/minutes OR 1-2 digits + am/pm
    time_pattern = re.compile(r'(\d{1,2}:\d{2})|(\d{1,2}\s?(am|pm))', re.IGNORECASE)

    html = ['<table class="w-full min-w-[1000px] table-fixed border-collapse bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100">']
    
    html.append('<thead class="bg-stone-50 border-b border-stone-100">')
    html.append('<tr>')
    for i, col in enumerate(header):
        if i == 0:
            html.append(f'<th class="w-32 p-5 text-left font-display text-stone-400 italic font-light">{col}</th>')
        else:
            html.append(f'<th class="w-[13%] p-5 text-left font-display text-stone-800">{col}</th>')
    html.append('</tr>')
    html.append('</thead>')
    
    html.append('<tbody class="divide-y divide-stone-50">')
    
    for row in body_rows:
        time_label = row[0]
        is_evening = (time_label == "Evening")
        
        row_class = ''
        if is_evening: row_class = ' class="bg-stone-900 text-stone-200"'
        elif time_label == "Morning": row_class = ' class="bg-stone-50/30"'

        if is_evening:
            time_td_class = "p-5 py-6 align-top font-medium text-secondary italic"
        else:
            time_td_class = "p-5 py-8 align-top font-medium text-emerald-800 bg-stone-50/30"
            if time_label in ["Morning", "Afternoon"]: time_td_class += " italic"

        html.append(f'<tr{row_class}>')
        html.append(f'<td class="{time_td_class}">{time_label}</td>')

        skip_count = 0
        for cell in row[1:]:
            if skip_count > 0:
                skip_count -= 1
                continue

            if not cell or cell.strip() in ["", "—"]:
                border_color = "stone-800" if is_evening else "stone-50"
                html.append(f'<td class="p-5 align-top border-l border-{border_color} text-stone-300 italic"></td>')
                continue

            parts = cell.split('|')
            colspan_val = next((p.split('=')[1] for p in parts if p.startswith("colspan=")), None)
            if colspan_val:
                skip_count = int(colspan_val) - 1
            
            clean_parts = [p for p in parts if not p.startswith("colspan=")]
            colspan_attr = f' colspan="{colspan_val}"' if colspan_val else ""
            
            is_private_session = "Private Sessions" in cell
            
            if is_private_session:
                td_class = "p-5 text-stone-400 text-xs italic"
            elif is_evening:
                td_class = "p-5 align-top border-l border-stone-800"
            else:
                td_class = "p-5 align-top border-l border-stone-50"

            html.append(f'<td{colspan_attr} class="{td_class}">')
            
            for i, text in enumerate(clean_parts):
                if is_private_session:
                    html.append(text)
                elif time_pattern.search(text):
                    time_color = "text-secondary" if is_evening else "text-emerald-700"
                    html.append(f'<span class="text-xs {time_color} font-bold block mb-1">{text}</span>')
                elif i == len(clean_parts) - 1 and len(clean_parts) > 1:
                    instructor_color = "text-stone-500" if is_evening else "text-stone-400"
                    html.append(f'<span class="text-xs {instructor_color} uppercase tracking-widest">{text}</span>')
                else:
                    title_color = "text-stone-200" if is_evening else "text-stone-800"
                    html.append(f'<span class="block font-medium leading-tight mb-1 {title_color}">{text}</span>')

            html.append('</td>')
        html.append('</tr>')

    html.append('</tbody>')
    html.append('</table>')
    
    return "\n".join(html)

if __name__ == "__main__":
    # Determine source: Arg first, then .env
    source = sys.argv[1] if len(sys.argv) > 1 else os.getenv("SCHEDULE_SPREADSHEET")

    if not source:
        print("Error: No CSV file provided and SCHEDULE_SPREADSHEET not found in .env")
        sys.exit(1)

    try:
        csv_rows = get_csv_rows(source)
        output_html = generate_html(csv_rows)
        
        # Print output to terminal
        print(output_html)
        
        # Copy to clipboard
        if pyperclip:
            pyperclip.copy(output_html)
            print("\n--- HTML copied to clipboard! ---")
    except Exception as e:
        print(f"Error processing schedule: {e}")