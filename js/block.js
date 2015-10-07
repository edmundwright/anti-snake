(function () {
  window.SnakeGame = window.SnakeGame || {};

  Block = SnakeGame.Block = function (contents, pos, idx) {
    this.contents = contents;
    this.pos = pos;
    this.idx = idx;
  };

  Block.prototype.isAtPos = function (pos) {
    return SnakeGame.Util.samePos(this.pos, pos);
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
