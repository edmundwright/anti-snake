(function () {
  window.SnakeGame = window.SnakeGame || {};

  Grid = SnakeGame.Grid = function (numRows, numCols, snake, walls) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.snake = snake;
    this.walls = walls;

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
  };

  Grid.prototype.isClear = function (pos) {
    return !this.wallAtPos(pos);
  };

  Grid.prototype.wallAtPos = function (pos) {
    return Block.inArrayAtPos(this.walls, pos);
  };

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
    }.bind(this));

    return result;
  };

  Grid.prototype.recalculatePaths = function () {
    this.pathStart = this.snake.segments[0].pos;
    this.findPaths(this.pathStart, this.pathTarget);
  };

  Grid.prototype.findPaths = function (start, target) {
    var frontier, nextStep, currentStep, neighbours, i, neighbour;
    frontier = [];
    frontier.push(target);
    nextStep = this.nextStep = {};
    nextStep[target] = null;

    while (frontier.length !== 0) {
      currentStep = frontier.shift();
      neighbours = this.travelableNeighbours(currentStep);
      for (i = 0; i < neighbours.length; i++) {
        neighbour = neighbours[i];
        if (!(neighbour in nextStep)) {
          frontier.push(neighbour);
          nextStep[neighbour] = currentStep;
        }
      }
    }
  };
})();
