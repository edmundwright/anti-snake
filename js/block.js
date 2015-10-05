(function () {
  window.SnakeGame = window.SnakeGame || {};

  Block = SnakeGame.Block = function (contents, pos) {
    this.contents = contents;
    this.pos = pos;
  };

  Block.prototype.isAtPos = function (pos) {
    return this.pos[0] === pos[0] && this.pos[1] === pos[1];
  };

  Block.inArrayAtPos = function (arr, pos) {
    var thisBlock;
    for (var i = 0; i < arr.length; i++) {
      thisBlock = arr[i];
      if (thisBlock.isAtPos(pos)) {
        return thisBlock;
      }
    }
  };
})();
