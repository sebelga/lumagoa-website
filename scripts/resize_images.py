import os
import sys
from PIL import Image

# Check for correct number of arguments
if len(sys.argv) != 3:
    print("Usage: python3 resize_images.py <width> <input_folder>")
    print("Example: python3 resize_images.py 800 /path/to/your/folder")
    sys.exit(1)

# Parse arguments
try:
    desired_width = int(sys.argv[1])
except ValueError:
    print("Error: The first argument (width) must be an integer.")
    sys.exit(1)

input_folder = sys.argv[2]

# Validate input folder
if not os.path.isdir(input_folder):
    print(f"Error: '{input_folder}' is not a valid directory.")
    sys.exit(1)

# Set output folder
output_folder = os.path.join(input_folder, 'resized')
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Resize images only if larger than desired width
for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp')):
        img_path = os.path.join(input_folder, filename)
        with Image.open(img_path) as img:
            original_width = img.size[0]
            if original_width <= desired_width:
                # Save original if already smaller or equal
                img.save(os.path.join(output_folder, filename))
            else:
                # Calculate proportional height and resize
                width_percent = (desired_width / float(original_width))
                new_height = int((float(img.size[1]) * float(width_percent)))
                resized_img = img.resize((desired_width, new_height), Image.LANCZOS)
                resized_img.save(os.path.join(output_folder, filename))

print("Resizing complete! Output saved to:", output_folder)