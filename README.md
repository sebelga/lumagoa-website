# Luma Goa website

[![Netlify Status](https://api.netlify.com/api/v1/badges/8b8bdeee-7054-4a94-808a-bfce1801811b/deploy-status)](https://app.netlify.com/projects/lumagoa/deploys)

This is the repo for the Luma Goa website.

## Resize images for the Gallery

Use the `resize_images.py` python script. The output will be generated in a `resized` folder inside the input folder.

```py
python3 ./scripts/resize_images.py <maxImageWidth> <folderWithImages>

# example
python3 ./scripts/resize_images.py 1600 /Users/seb/Desktop/gallery/originals
```
