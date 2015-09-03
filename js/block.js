(function () {
  window.SnakeGame = window.SnakeGame || {};

  Block = SnakeGame.Block = function (contents, pos) {
    this.contents = contents;
    this.pos = pos;
  };

  Block.atPos = function (arr, pos) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].pos[0] === pos[0] &&
          arr[i].pos[1] === pos[1]) {
        return arr[i];
      }
    }
  };
})();
