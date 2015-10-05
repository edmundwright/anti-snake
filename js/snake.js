(function () {
  window.SnakeGame = window.SnakeGame || {};

  var Snake = SnakeGame.Snake = function (word, firstPos) {
    this.word = word;

    this.segments = [];

    for (letterIdx = 0; letterIdx < this.word.length; letterIdx++) {
      var thisPos = [firstPos[0], firstPos[1] + letterIdx];
      this.segments.push(new SnakeGame.Block(this.word[letterIdx], thisPos));
    }
  };

  Snake.prototype.segmentAtPos = function (pos) {
    return Block.inArrayAtPos(this.segments, pos);
  };

  Snake.prototype.receiveGrid = function (grid) {
    this.grid = grid;
  };

  Snake.prototype.move = function () {
    for (var segIdx = this.segments.length - 1; segIdx > 0; segIdx--) {
      this.segments[segIdx].pos[0] = this.segments[segIdx - 1].pos[0];
      this.segments[segIdx].pos[1] = this.segments[segIdx - 1].pos[1];
    }

    this.segments[0].pos = this.grid.newPos(
      this.segments[0].pos,
      this.direction
    );
  };

  Snake.prototype.chooseDirection = function () {
    var frontPos = this.segments[0].pos;

    while (!this.grid.paths[frontPos] ||
           (frontPos[0] == this.grid.pathTarget[0] &&
            frontPos[1] == this.grid.pathTarget[1]) ||
           this.grid.wallAtPos(this.grid.pathTarget) ||
           this.segmentAtPos(this.grid.pathTarget)) {
      this.grid.pathTarget = [
        Math.floor(Math.random() * this.grid.numRows),
        Math.floor(Math.random() * this.grid.numCols)
      ];
      this.grid.recalculatePaths();
    }

    var path = this.grid.paths[frontPos];
    var nextStep = path[path.length - 1];

    if (this.grid.wallAtPos(nextStep)) {
      this.grid.recalculatePaths();
      path = this.grid.paths[frontPos];
      nextStep = path[path.length - 1];
    }

    this.direction = [
      nextStep[0] - frontPos[0],
      nextStep[1] - frontPos[1]
    ];
  };
})();
