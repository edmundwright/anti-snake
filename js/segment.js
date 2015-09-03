(function () {
  window.SnakeGame = window.SnakeGame || {};

  SnakeGame.Segment = function (letter, initialPos) {
    this.letter = letter;
    this.pos = initialPos;
  };
})();
