import PhotoSwipeLightbox from "photoswipe/lightbox";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import { googleMap } from "./google_map";
import { addPswpAttributes } from "./gallery_img_metadata";
import { updateDailyQuote } from "./daily_quote";

function gallery() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: "#gallery",
    children: "a",
    pswpModule: () => import("photoswipe"),
  });

  lightbox.init();
}

function masonry() {
  const grid = document.querySelector("#masonry-grid");
  if (!grid) {
    console.error("Masonry grid element not found");
    return;
  } else {
    const msnry = new Masonry(grid, {
      itemSelector: ".grid-item",
      columnWidth: ".grid-sizer", // Uses sizer for precise column width
      gutter: ".gutter-sizer", // Uses sizer for precise gutter
      percentPosition: true,
    });

    imagesLoaded(grid).on("progress", function () {
      // Re-layout Masonry after each image loads
      msnry.layout?.();
    });

    // Handle resize for responsiveness
    window.addEventListener("resize", () => {
      msnry.layout?.();
    });
  }
}

(function init() {
  addPswpAttributes();
  gallery();
  masonry();
  googleMap();
  updateDailyQuote();
})();
