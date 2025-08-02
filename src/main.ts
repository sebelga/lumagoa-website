import PhotoSwipeLightbox from "photoswipe/lightbox";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

const lightbox = new PhotoSwipeLightbox({
  gallery: "#gallery",
  children: "a",
  pswpModule: () => import("photoswipe"),
});

lightbox.init();

const grid = document.querySelector("#masonry-grid");
if (!grid) {
  console.error("Masonry grid element not found");
} else {
  console.log("Initializing Masonry on grid:", grid);
  const msnry = new Masonry(grid, {
    itemSelector: ".grid-item",
    columnWidth: ".grid-sizer", // Uses sizer for precise column width
    gutter: ".gutter-sizer", // Uses sizer for precise gutter
    percentPosition: true,
  });

  imagesLoaded(grid).on("progress", function () {
    // Re-layout Masonry after each image loads
    console.log("Images loaded, relayout Masonry");
    msnry.layout?.();
  });

  // Handle resize for responsiveness
  window.addEventListener("resize", () => msnry.layout?.());
}
