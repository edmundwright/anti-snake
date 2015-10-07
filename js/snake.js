(function () {
  window.SnakeGame = window.SnakeGame || {};

  var Snake = SnakeGame.Snake = function (options) {
    this.word = options.word;

    this.segments = [];

    for (var letterIdx = 0; letterIdx < options.initialLength; letterIdx++) {
      var thisPos = [options.firstPos[0], options.firstPos[1] + letterIdx];
      this.segments.push(
        new SnakeGame.Block(this.word[letterIdx], thisPos, letterIdx)
      );
    }
  };

  Snake.prototype.firstPos = function () {
    return this.segments[0].pos;
  };

  Snake.prototype.receiveGrid = function (grid) {
    this.grid = grid;
  };

  Snake.prototype.addSegment = function () {
    this.segments.push(new SnakeGame.Block(
      this.word[this.segments.length] || "",
      this.segments[this.segments.length - 1].pos.slice(0),
      this.segments.length
    ));
  };

  Snake.prototype.segmentAtPos = function (pos) {
    return Block.inArrayAtPos(this.segments, pos);
  };

  Snake.prototype.move = function () {
    for (var segIdx = this.segments.length - 1; segIdx > 0; segIdx--) {
      this.segments[segIdx].pos = this.segments[segIdx - 1].pos.slice(0);
    }

    this.segments[0].pos = SnakeGame.Util.newPos(
      this.segments[0].pos,
      this.direction
    );
  };

  Snake.prototype.chooseDirection = function () {
    var nextStep;
    var firstPos = this.firstPos();

    if (SnakeGame.Util.samePos(firstPos, this.grid.applePos)) {
      this.grid.newApplePos();
      this.grid.findPaths();
    }

    if (!this.grid.nextSteps ||
        this.grid.wallAtPos(this.grid.nextSteps[firstPos]) ||
        this.segmentAtPos(this.grid.nextSteps[firstPos]))
    {
      this.grid.findPaths();
    }

    if (!this.grid.nextSteps) {
      if (this.grid.farthestStep &&
          SnakeGame.Util.samePos(firstPos, this.grid.farthestStep))
      {
        this.grid.findPaths();
      }

      if (this.grid.farthestStep) {
        nextStep = this.grid.stepTowardsFarAway();
      }
    } else {
      nextStep = this.grid.nextSteps[firstPos];
    }

    if (nextStep) {
      this.direction = [
        nextStep[0] - firstPos[0],
        nextStep[1] - firstPos[1]
      ];
    } else {
      this.stopped = true;
    }
  };

  // Snake.prototype.pathFromSegment = function () {
  //   return this.segments.some(function (segment) {
  //     return !!this.grid.nextStep[segment.pos];
  //   }.bind(this));
  // };
})();
