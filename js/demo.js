(function () {
  var sliderCanvas = document.querySelector(".pieces-slider__canvas");
  var imagesEl = [].slice.call(
    document.querySelectorAll(".pieces-slider__image")
  );
  var textEl = [].slice.call(document.querySelectorAll(".pieces-slider__text"));
  var slidesLength = imagesEl.length;
  var currentIndex = 0,
    currentImageIndex,
    currentTextIndex,
    currentNumberIndex;
  function updateIndexes() {
    currentImageIndex = currentIndex * 3;
    currentTextIndex = currentImageIndex + 1;
    currentNumberIndex = currentImageIndex + 2;
  }
  updateIndexes();
  var textIndexes = [];
  var numberIndexes = [];
  var windowWidth = window.innerWidth;
  var piecesSlider;
  var imageOptions = {
    angle: 45,
    extraSpacing: { extraX: 100, extraY: 200 },
    piecesWidth: function () {
      return Pieces.random(50, 200);
    },
    ty: function () {
      return Pieces.random(-400, 400);
    },
  };
  var textOptions = {
    color: "#dcdcde",
    backgroundColor: "white",
    fontSize: function () {
      return windowWidth > 720 ? 50 : 30;
    },
    padding: "15 20 10 20",
    angle: -45,
    piecesSpacing: 2,
    extraSpacing: { extraX: 0, extraY: 300 },
    piecesWidth: function () {
      return Pieces.random(50, 200);
    },
    ty: function () {
      return Pieces.random(-200, 200);
    },
    translate: function () {
      if (windowWidth > 1120) return { translateX: 200, translateY: 200 };
      if (windowWidth > 720) return { translateX: 0, translateY: 200 };
      return { translateX: 0, translateY: 100 };
    },
  };
  var numberOptions = {
    color: "#404040",
    backgroundColor: "#dcdcde",
    fontSize: function () {
      return windowWidth > 720 ? 60 : 20;
    },
    padding: function () {
      return windowWidth > 720 ? "18 35 10 38" : "18 25 10 28";
    },
    angle: 0,
    piecesSpacing: 2,
    extraSpacing: { extraX: 10, extraY: 10 },
    piecesWidth: 35,
    ty: function () {
      return Pieces.random(-200, 200);
    },
    translate: function () {
      if (windowWidth > 1120) return { translateX: -340, translateY: -180 };
      if (windowWidth > 720) return { translateX: -240, translateY: -180 };
      return { translateX: -140, translateY: -100 };
    },
  };
  var items = [];
  var imagesReady = 0;
  for (var i = 0; i < slidesLength; i++) {
    var slideImage = new Image();
    slideImage.onload = function () {
      if (++imagesReady == slidesLength) {
        initSlider();
        initEvents();
      }
    };
    items.push({ type: "image", value: imagesEl[i], options: imageOptions });
    items.push({
      type: "text",
      value: textEl[i].innerText,
      options: textOptions,
    });
    items.push({ type: "text", value: i + 1, options: numberOptions });

    textIndexes.push(i * 3 + 1);
    numberIndexes.push(i * 3 + 2);

    slideImage.src = imagesEl[i].src;
  }

  function initSlider() {
    if (piecesSlider) {
      piecesSlider.stop();
    }

    piecesSlider = new Pieces({
      canvas: sliderCanvas,
      items: items,
      x: "centerAll",
      y: "centerAll",
      piecesSpacing: 1,
      fontFamily: ["'Helvetica Neue', sans-serif"],
      animation: {
        duration: function () {
          return Pieces.random(1000, 2000);
        },
        easing: "easeOutQuint",
      },
    });

    piecesSlider.animateItems({
      items: numberIndexes,
      duration: 20000,
      angle: 360,
      loop: true,
    });

    showItems();
  }

  function initEvents() {
    document
      .querySelector(".pieces-slider__button--prev")
      .addEventListener("click", prevItem);
    document
      .querySelector(".pieces-slider__button--next")
      .addEventListener("click", nextItem);

    document.addEventListener("keydown", function (e) {
      if (e.keyCode == 37) {
        prevItem();
      } else if (e.keyCode == 39) {
        nextItem();
      }
    });

    window.addEventListener("resize", resizeStart);
  }

  function showItems() {
    piecesSlider.showPieces({
      items: currentImageIndex,
      ignore: ["tx"],
      singly: true,
      update: (anim) => {
        if (anim.progress > 60) {
          var piece = anim.animatables[0].target;
          var ty = piece.ty;
          anime.remove(piece);
          anime({
            targets: piece,
            ty:
              piece.h_ty < 300
                ? [
                    { value: ty + 10, duration: 1000 },
                    { value: ty - 10, duration: 2000 },
                    { value: ty, duration: 1000 },
                  ]
                : [
                    { value: ty - 10, duration: 1000 },
                    { value: ty + 10, duration: 2000 },
                    { value: ty, duration: 1000 },
                  ],
            duration: 2000,
            easing: "linear",
            loop: true,
          });
        }
      },
    });

    piecesSlider.showPieces({ items: currentTextIndex });
    piecesSlider.showPieces({
      items: currentNumberIndex,
      ty: function (p, i) {
        return p.s_ty - [-3, 3][i % 2];
      },
    });
  }

  function hideItems() {
    piecesSlider.hidePieces({
      items: [currentImageIndex, currentTextIndex, currentNumberIndex],
    });
  }

  function prevItem() {
    hideItems();
    currentIndex = currentIndex > 0 ? currentIndex - 1 : slidesLength - 1;
    updateIndexes();
    showItems();
  }

  function nextItem() {
    hideItems();
    currentIndex = currentIndex < slidesLength - 1 ? currentIndex + 1 : 0;
    updateIndexes();
    showItems();
  }

  var initial = true,
    hideTimer,
    resizeTimer;

  function resizeStart() {
    if (initial) {
      initial = false;
      if (hideTimer) clearTimeout(hideTimer);
      sliderCanvas.classList.add("pieces-slider__canvas--hidden");
    }
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeEnd, 300);
  }

  function resizeEnd() {
    initial = true;
    windowWidth = window.innerWidth;
    initSlider();
    hideTimer = setTimeout(() => {
      sliderCanvas.classList.remove("pieces-slider__canvas--hidden");
    }, 500);
  }
})();
