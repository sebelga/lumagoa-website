import argparse
import json
import os
from PIL import Image

def main():
    parser = argparse.ArgumentParser(description="Generate JSON metadata for images in a folder")
    parser.add_argument("folder_path", help="Path to the folder containing the image files (e.g., /User/Seb/my-repo/public/img/gallery/large)")
    parser.add_argument("basepath", help="Base path to strip for relative filenames (e.g., /User/Seb/my-repo/public)")
    parser.add_argument("--output", default="images_metadata.json", help="Output JSON file (default: images_metadata.json)")
    
    args = parser.parse_args()

    # Normalize paths
    folder_path = os.path.abspath(args.folder_path)
    basepath = os.path.abspath(args.basepath)

    metadata = {}

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            try:
                with Image.open(file_path) as img:
                    width, height = img.size
                    # Get relative path and normalize to forward slashes with leading /
                    rel_path = os.path.relpath(file_path, basepath).replace(os.sep, "/")
                    rel_path_with_leading_slash = f"/{rel_path}" if not rel_path.startswith("/") else rel_path
                    metadata[rel_path_with_leading_slash] = {
                        "filename": rel_path_with_leading_slash,
                        "width": width,
                        "height": height
                    }
            except (IOError, OSError):
                # Skip non-image files
                pass

    with open(args.output, "w") as json_file:
        json.dump(metadata, json_file, indent=4)

    print(f"Metadata written to {args.output}")

if __name__ == "__main__":
    main()