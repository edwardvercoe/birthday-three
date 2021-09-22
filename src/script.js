import "./scss/main.scss";
import "./three.js";
import Rellax from "rellax";
import inView from "in-view";

// var rellax = new Rellax(".polaroid");

inView(".color-yellow").on("enter", (el) => {
  document.querySelector("body").style.backgroundColor = "#FCEAC2";
});

inView(".color-pink").on("enter", (el) => {
  document.querySelector("body").style.backgroundColor = "#ffe2ee";
});
