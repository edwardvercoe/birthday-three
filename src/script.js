import "./scss/main.scss";
import "./three.js";
// import Rellax from "rellax";
import inView from "in-view";
import Swiper, { Navigation } from "swiper";
// import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

Swiper.use([Navigation]);

// var rellax = new Rellax(".polaroid", {
//   // wrapper: "main",
// });

inView.threshold(0.5);

// inView(".color-yellow")
//   .on("enter", (el) => {
//     document.querySelector("body").style.backgroundColor = "#FCEAC2";
//     el.classList.add("active");
//   })
//   .on("exit", (el) => {
//     el.classList.remove("active");
//   });

// inView(".color-pink").on("enter", (el) => {
//   document.querySelector("body").style.backgroundColor = "#ffe2ee";
// });

const swiperImg = new Swiper(".swiper-photos", {
  // Optional parameters
  slidesPerView: 1,
  spaceBetween: 10,
  loop: true,
  grabCursor: true,

  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
  },
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiperComments = new Swiper(".swiper-comments", {
  // Optional parameters
  slidesPerView: 1,
  // spaceBetween: 10,
  loop: true,
  grabCursor: true,

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
