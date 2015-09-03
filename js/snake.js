(function () {
  window.SnakeGame = window.SnakeGame || {};

  var Snake = SnakeGame.Snake = function (word, firstPos, initialDirection) {
    this.word = word;
    this.direction = initialDirection;

    this.segments = []

    for (letterIdx = 0; letterIdx < this.word.length; letterIdx++) {
      var thisPos = [firstPos[0], firstPos[1] + letterIdx];
      this.segments.push(new SnakeGame.Block(this.word[letterIdx], thisPos));
    }
  };

  Snake.prototype.receiveGridSize = function (numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
  }

  Snake.prototype.move = function () {
    for (var segIdx = this.segments.length - 1; segIdx > 0; segIdx--) {
      this.segments[segIdx].pos[0] = this.segments[segIdx - 1].pos[0];
      this.segments[segIdx].pos[1] = this.segments[segIdx - 1].pos[1];
    }

    this.segments[0].pos = this.newPos(this.segments[0].pos);
  };

  Snake.prototype.newPos = function (pos) {
    newPos = [
      pos[0] + this.direction[0],
      pos[1] + this.direction[1]
    ];

    if (newPos[0] < 0) {
      newPos[0] = this.numRows + newPos[0];
    } else if (newPos[0] >= numRows) {
      newPos[0] = newPos[0] - this.numRows;
    }

    if (newPos[1] < 0) {
      newPos[1] = this.numCols + newPos[1];
    } else if (newPos[1] >= numCols) {
      newPos[1] = newPos[1] - this.numCols;
    }

    return newPos;
  };
})();
