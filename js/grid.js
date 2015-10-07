(function () {
  window.SnakeGame = window.SnakeGame || {};

  Grid = SnakeGame.Grid = function (options) {
    this.numRows = options.numRows;
    this.numCols = options.numCols;
    this.snake = options.snake;

    this.snake.receiveGrid(this);

    this.walls = [];
    this.applePos = [Math.round(options.numRows / 2) - 1, 2];

    this.score = 0;
    this.appleScore = 0;

    this.findPaths();
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

  Grid.prototype.wallCanBePlaced = function (pos) {
    return !this.snake.segmentAtPos(pos) && !this.appleAtPos(pos);
  };

  Grid.prototype.appleAtPos = function (pos) {
    return SnakeGame.Util.samePos(this.applePos, pos);
  };

  Grid.prototype.wallAtPos = function (pos) {
    return Block.inArrayAtPos(this.walls, pos);
  };

  Grid.prototype.newApplePos = function () {
    this.applePos = null;

    while (this.applePos === null ||
           this.wallAtPos(this.applePos) ||
           this.snake.segmentAtPos(this.applePos))
    {
      this.applePos = [
        Math.floor(Math.random() * this.numRows),
        Math.floor(Math.random() * this.numCols)
      ];
    }

    this.score += this.appleScore;
    this.appleScore = 0;
    this.snake.addSegment();
  };

  Grid.prototype.travelableNeighbours = function (pos) {
    var result = [];

    Grid.DIRECTIONS.forEach(function (direction) {
      neighbour = SnakeGame.Util.newPos(pos, direction);
      if (this.inGrid(neighbour) && !this.wallAtPos(neighbour)) {
        result.push(neighbour);
      }
    }.bind(this));

    return result;
  };

  Grid.prototype.stepTowardsFarAway = function () {
    var start = this.snake.firstPos();
    var currentStep = this.farthestStep.slice(0);

    var prevStep;
    var nextSteps = {};

    while (!SnakeGame.Util.samePos(currentStep, start)) {
      prevStep = this.prevSteps[currentStep];
      nextSteps[prevStep] = currentStep;
      currentStep = prevStep;
    }

    return nextSteps[start];
  };

  Grid.prototype.findPaths = function () {
    var start = this.snake.firstPos();
    var target = this.applePos;

    var prevSteps = this.prevSteps = {};
    this.farthestStep = null;

    var frontier = [];
    var stepNumbers = {};

    frontier.push(start);
    prevSteps[start] = null;
    stepNumbers[start] = 0;

    var currentStep, neighbours, i, neighbour, segmentHere;

    while (frontier.length !== 0) {
      currentStep = frontier.shift();
      segmentHere = this.snake.segmentAtPos(currentStep);

      if (currentStep === start ||
          !segmentHere ||
          (this.snake.segments.length - segmentHere.idx) <=
            stepNumbers[currentStep])
      {
        if (!this.farthestStep ||
            stepNumbers[this.farthestStep] < stepNumbers[currentStep])
        {
          if (stepNumbers[currentStep] > 0) {
            this.farthestStep = currentStep.slice(0);
          }
        }

        neighbours = this.travelableNeighbours(currentStep);
        for (i = 0; i < neighbours.length; i++) {
          neighbour = neighbours[i];
          if (!(neighbour in prevSteps)) {
            frontier.push(neighbour);
            prevSteps[neighbour] = currentStep;
            stepNumbers[neighbour] = stepNumbers[currentStep] + 1;
          }
        }
      }
    }

    if (prevSteps[target]) {
      this.nextSteps = {};
      currentStep = target;

      var prevStep;
      while (!SnakeGame.Util.samePos(currentStep, start)) {
        prevStep = prevSteps[currentStep];
        this.nextSteps[prevStep] = currentStep;
        currentStep = prevStep;
      }
    } else {
      this.nextSteps = null;
    }
  };

  Grid.prototype.addWallAtPos = function (pos) {
    this.walls.push(new Block("", pos));
  };

  Grid.prototype.deleteWall = function (wall) {
    index = this.walls.indexOf(wall);
    this.walls.splice(index, 1);
  };
})();
