import sys
from PIL import Image
import os
from pillow_heif import register_heif_opener

# Register HEIF opener for Pillow
register_heif_opener()

def crop_to_aspect(img, target_width, target_height):
    """Crop image to match target aspect ratio, centering the crop."""
    img_width, img_height = img.size
    target_ratio = target_width / target_height
    img_ratio = img_width / img_height
    
    if img_ratio > target_ratio:
        # Image is wider, crop width
        new_width = int(img_height * target_ratio)
        offset = (img_width - new_width) // 2
        img = img.crop((offset, 0, offset + new_width, img_height))
    elif img_ratio < target_ratio:
        # Image is taller, crop height
        new_height = int(img_width / target_ratio)
        offset = (img_height - new_height) // 2
        img = img.crop((0, offset, img_width, offset + new_height))
    # If ratios match, no crop needed
    return img

def resize_image(input_path, output_path, size):
    with Image.open(input_path) as img:
        img = crop_to_aspect(img, size[0], size[1])
        img = img.resize(size, Image.Resampling.LANCZOS)
        img.save(output_path, 'JPEG', quality=90)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 resize_images.py <image_path>")
        print("Example: python3 resize_images.py /path/to/hero.jpg")
        sys.exit(1)
    
    input_path = sys.argv[1]
    if not os.path.isfile(input_path):
        print(f"Error: File '{input_path}' not found.")
        sys.exit(1)
    
    # Check if file is .jpg or .heic
    if not input_path.lower().endswith(('.jpg', '.jpeg', '.heic')):
        print("Error: Only .jpg, .jpeg, or .heic files are supported.")
        sys.exit(1)
    
    base_name = os.path.splitext(input_path)[0]
    
    # Resize for display (1920x1080)
    resize_image(input_path, f"{base_name}_display.jpg", (1920, 1080))
    
    # Resize for OG (1200x630)
    resize_image(input_path, f"{base_name}_og.jpg", (1200, 630))
    
    # Resize for Twitter (1200x675)
    resize_image(input_path, f"{base_name}_twitter.jpg", (1200, 675))
    
    print("Images resized successfully:")
    print(f"- {base_name}_display.jpg")
    print(f"- {base_name}_og.jpg")
    print(f"- {base_name}_twitter.jpg")