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
    console.info("Masonry grid element not found");
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
  const isHome =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html";
  const isYogaShala = window.location.pathname === "/yoga-shala";
  console.log(window.location.pathname);

  if (isHome) {
    addPswpAttributes("gallery-img-metadata.json");
    gallery();
    masonry();
    googleMap();
  } else if (isYogaShala) {
    addPswpAttributes("gallery-shala-img-metadata.json");
    gallery();
    masonry();
  }
  updateDailyQuote();
})();
