interface ImageMetadata {
  filename: string;
  width: number;
  height: number;
}

interface Metadata {
  [key: string]: ImageMetadata;
}

export async function addPswpAttributes() {
  try {
    const response = await fetch("/gallery-img-metadata.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    const metadata: Metadata = await response.json();

    const links = document.querySelectorAll<HTMLAnchorElement>(
      "#masonry-grid .grid-item a",
    );
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && metadata[href]) {
        const { width, height } = metadata[href];
        link.setAttribute("data-pswp-width", width.toString());
        link.setAttribute("data-pswp-height", height.toString());
      } else {
        console.warn(`No metadata found for image: ${href}`);
      }
    });
  } catch (error) {
    console.error("Error adding PhotoSwipe attributes:", error);
  }
}
