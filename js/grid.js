(function () {
  window.SnakeGame = window.SnakeGame || {};

  Grid = SnakeGame.Grid = function (numRows, numCols, snake, blocks) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.snake = snake;
    this.blocks = blocks;

    this.pathStart = this.snake.segments[0].pos;
    this.pathTarget = [2, 1];
    this.recalculatePaths();
  };

  Grid.DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  Grid.prototype.inGrid = function (pos) {
    return pos[0] >= 0 &&
           pos[1] >= 0 &&
           pos[0] < this.numRows &&
           pos[1] < this.numCols;
  }

  Grid.prototype.isClear = function (pos) {
    blockAtPos = Block.atPos(this.blocks, pos);
    if (blockAtPos) {
      return false;
    }
    return true;
  }

  Grid.prototype.newPos = function (pos, direction) {
    newPos = [
      pos[0] + direction[0],
      pos[1] + direction[1]
    ];

    // NO WRAPPING FOR NOW

    // if (newPos[0] < 0) {
    //   newPos[0] = this.numRows + newPos[0];
    // } else if (newPos[0] >= this.numRows) {
    //   newPos[0] = newPos[0] - this.numRows;
    // }
    //
    // if (newPos[1] < 0) {
    //   newPos[1] = this.numCols + newPos[1];
    // } else if (newPos[1] >= this.numCols) {
    //   newPos[1] = newPos[1] - this.numCols;
    // }

    return newPos;
  };

  Grid.prototype.travelableNeighbours = function (pos) {
    var result = [];

    Grid.DIRECTIONS.forEach(function (direction) {
      neighbour = this.newPos(pos, direction);
      if (this.inGrid(neighbour) && this.isClear(neighbour)) {
        result.push(neighbour);
      }
    }.bind(this))

    return result;
  };

  Grid.prototype.findPathsToPos = function (pos) {
    this.travelableNeighbours(pos).forEach(function (neighbour) {
      if (this.paths[this.pathStart]) {
        return;
      }
      if (!this.paths[neighbour] ||
          this.paths[neighbour].length > this.paths[pos].length + 1) {
          this.paths[neighbour] = this.paths[pos].concat([pos]);
          this.findPathsToPos(neighbour);
      }
    }.bind(this))
  };

  Grid.prototype.recalculatePaths = function () {
    this.paths = {};
    this.paths[this.pathTarget] = [];
    this.pathStart = this.snake.segments[0].pos;
    this.findPathsToPos(this.pathTarget);
  };
})();
