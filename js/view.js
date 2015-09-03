(function () {
  window.SnakeGame = window.SnakeGame || {};

  View = SnakeGame.View = function ($main, snake, numRows, numCols) {
    this.$main = $main;

    this.blocks = [];
    this.snake = snake;
    this.grid = new SnakeGame.Grid(numRows, numCols, this.snake, this.blocks);

    this.snake.receiveGrid(this.grid);

    this.buildHTMLGrid();
    this.setupHandlers();
    setInterval(this.step.bind(this), 500);
  };

  View.prototype.buildHTMLGrid = function () {
    for (var row = 0; row < this.grid.numRows; row++) {
      for (var col = 0; col < this.grid.numCols; col++) {
        var $section = $("<section></section>");
        $section.data("pos", [row, col]);
        this.$main.append($section);
      }
    }
  };

  View.prototype.updateHTMLSnake = function () {
    this.$main.find("section").each(function () {
      var segmentHere = SnakeGame.Block.atPos(
        snake.segments,
        $(this).data('pos')
      );

      if (segmentHere) {
        $(this).addClass("snake");
        $(this).text(segmentHere.contents);
      } else {
        $(this).removeClass("snake");
        $(this).text("");
      }
    })
  };

  View.prototype.updateHTMLTarget = function () {
    var target = this.grid.pathTarget;
    this.$main.find("section").each(function () {
      var pos = $(this).data('pos');

      if (target[0] === pos[0] && target[1] === pos[1]) {
        $(this).addClass("target");
      } else {
        $(this).removeClass("target");
      }
    })
  };

  View.prototype.setupHandlers = function () {
    // this.setupKeypress();
    this.setupClick();
  };

  View.prototype.setupKeypress = function () {
    $(document).on("keypress", function (e) {
      switch (e.keyCode) {
        case 119:
          this.snake.direction = [-1, 0];
          break;
        case 115:
          this.snake.direction = [1, 0];
          break;
        case 97:
          this.snake.direction = [0, -1];
          break;
        case 100:
          this.snake.direction = [0, 1];
          break;
      }
    }.bind(this));
  };

  View.prototype.setupClick = function () {
    this.$main.on('click', "section", function (e) {
      var pos = $(e.currentTarget).data("pos");
      var block = Block.atPos(this.blocks, pos);

      if (block) {
        this.deleteBlock(block);
        $(e.currentTarget).removeClass("block-here");
      } else if (!Block.atPos(this.snake.segments, pos)) {
        this.addBlockAtPos(pos);
        $(e.currentTarget).addClass("block-here");
        this.grid.recalculatePaths();
      }
    }.bind(this));
  };

  View.prototype.step = function () {
    this.updateHTMLSnake();
    // this.updateHTMLTarget();
    this.snake.chooseDirection();
    this.snake.move();
  }

  View.prototype.addBlockAtPos = function (pos) {
    this.blocks.push(new Block("", pos));
  };

  View.prototype.deleteBlock = function (block) {
    index = this.blocks.indexOf(block)
    this.blocks.splice(index, 1);
  };
})();
