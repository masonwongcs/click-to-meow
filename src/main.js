import howler from "howler";
import data from "./cat.json";

const pawsArr = [
  require("./paws/paw1.svg"),
  require("./paws/paw2.svg"),
  require("./paws/paw3.svg"),
  require("./paws/paw4.svg"),
  require("./paws/paw5.svg"),
  require("./paws/paw6.svg"),
  require("./paws/paw7.svg"),
  require("./paws/paw8.svg"),
  require("./paws/paw9.svg"),
  require("./paws/paw10.svg"),
];

const meow = require("./sound/meow.mp3");
const meow2 = require("./sound/meow2.mp3");
const meow3 = require("./sound/meow3.mp3");

let clickCount = 0;
let pawsCount = 0;
let meowSoundCount = 0;

document.addEventListener("DOMContentLoaded", init, false);

const meowSound = [
  new Howl({
    src: [meow],
  }),
  new Howl({
    src: [meow2],
  }),
  new Howl({
    src: [meow3],
  }),
];

function getXAndY(e) {
  let x, y;
  if (
    e.type == "touchstart" ||
    e.type == "touchmove" ||
    e.type == "touchend" ||
    e.type == "touchcancel"
  ) {
    var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
  } else if (
    e.type == "mousedown" ||
    e.type == "mouseup" ||
    e.type == "mousemove" ||
    e.type == "mouseover" ||
    e.type == "mouseout" ||
    e.type == "mouseenter" ||
    e.type == "mouseleave"
  ) {
    x = e.clientX;
    y = e.clientY;
  } else {
    x = e.offsetX;
    y = e.offsetY;
  }

  return { x, y };
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function randomMove({ button, originalHeight, originalWidth, PADDING }) {
  const randomTop =
    Math.random() * window.innerHeight - originalHeight - PADDING;
  const randomLeft = Math.abs(
    Math.random() * window.innerWidth - originalWidth - PADDING
  );

  button.style.top = randomTop + "px";
  button.style.left = randomLeft + "px";
  button.style.width = originalWidth + "px";
}

function handleClick() {
  clickCount += 1;

  const countDOM = document.querySelector(".count");
  countDOM.classList.add("count");
  countDOM.innerHTML = clickCount;

  if (countDOM) {
    const clone = countDOM.cloneNode(true);
    countDOM.replaceWith(clone);
  }
}

function handlePaws({ x, y }) {
  pawsCount += 1;
  meowSoundCount += 1;
  if (pawsCount === pawsArr.length) {
    pawsCount = 0;
  }

  if (meowSoundCount === meowSound.length) {
    meowSoundCount = 0;
  }
  const arm = document.createElement("div");

  let randomRotate;
  const windowWidth = window.innerWidth;
  arm.classList.add("arm");

  if (x > windowWidth / 2) {
    // console.log("right");
    randomRotate = randomNumber(180, 360);
  } else {
    // console.log("left");
    randomRotate = randomNumber(0, 180);
  }

  arm.style.left = x - windowWidth / 2 / 2 + "px";
  arm.style.top = y + "px";
  arm.style.rotate = randomRotate + "deg";
  arm.style.background = `url(${pawsArr[pawsCount]}) center top / contain no-repeat`;
  document.body.appendChild(arm);

  const soundId = meowSound[meowSoundCount].play();
  const isPlaying = meowSound[meowSoundCount].playing(soundId);

  if (!isPlaying) {
    meowSound[meowSoundCount].play();
  }

  arm.addEventListener("animationend", function () {
    arm.remove();
  });

  handleClick();
}

function loadLottie() {
  const animation = bodymovin.loadAnimation({
    container: document.getElementById("lottie"), // Required
    animationData: data, // Required
    renderer: "canvas", // Required
    loop: true, // Optional
    autoplay: true, // Optional
    name: "Hello World", // Name for future reference. Optional.
  });

  animation.setSpeed(0.8);
}

function init() {
  const PADDING = 20;
  const button = document.querySelector(".no");
  const body = document.body;

  if (button) {
    const originalWidth = button.getBoundingClientRect().width;
    const originalHeight = button.getBoundingClientRect().height;

    button.style.left = window.innerWidth / 2 + originalWidth / 2 + "px";
    button.style.width = originalWidth + "px";

    button.addEventListener("mouseenter", function () {
      randomMove({
        button,
        originalHeight,
        originalWidth,
        PADDING,
      });
    });

    button.addEventListener("focus", function () {
      button.classList.add("disabled");
    });

    button.addEventListener("blur", function () {
      button.classList.remove("disabled");
    });

    button.addEventListener("touchstart", function () {
      randomMove({
        button,
        originalHeight,
        originalWidth,
        PADDING,
      });
    });
  }

  window.addEventListener("click", function (e) {
    handlePaws(getXAndY(e));
  });

  window.addEventListener("touchstart", function (e) {
    handlePaws(getXAndY(e));
  });

  loadLottie();
}
