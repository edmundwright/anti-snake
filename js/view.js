(function () {
  window.SnakeGame = window.SnakeGame || {};

  View = SnakeGame.View = function ($main, snake, numRows, numCols) {
    this.$main = $main;

    this.blocks = [];
    this.snake = snake;

    this.numRows = numRows;
    this.numCols = numCols;

    this.buildGrid();
    this.render();
    this.setupHandlers();

    this.snake.receiveGridSize(numRows, numCols);

    setInterval(this.step.bind(this), 500);
  };

  View.prototype.buildGrid = function () {
    for (var row = 0; row < this.numRows; row++) {
      for (var col = 0; col < this.numCols; col++) {
        var $section = $("<section></section>");
        $section.data("pos", [row, col]);
        this.$main.append($section);
      }
    }
  };

  View.prototype.render = function () {
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

  View.prototype.setupHandlers = function () {
    this.setupKeypress();
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
      } else {
        this.addBlockAtPos(pos);
        $(e.currentTarget).addClass("block-here");
      }
    }.bind(this));
  };

  View.prototype.step = function () {
    this.render();
    this.snake.move();
  }

  View.prototype.addBlockAtPos = function (pos) {
    this.blocks.push(new Block("", pos));
  };

  View.prototype.deleteBlock = function (block) {
    index = this.blocks.indexOf(block)
    this.blocks.splice(index, 1);
  };

  View.prototype.blockAtPos = function (pos) {

  }
})();
