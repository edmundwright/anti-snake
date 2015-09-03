(function () {
  window.SnakeGame = window.SnakeGame || {};

  View = SnakeGame.View = function ($main, snake, numRows, numCols) {
    this.snake = snake;
    this.$main = $main;
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
      var segmentHere = snake.segmentOnPos($(this).data('pos'));
      if (segmentHere) {
        $(this).addClass("snake");
        $(this).text(segmentHere.letter);
      } else {
        $(this).removeClass("snake");
        $(this).text("");
      }
    })
  };

  View.prototype.setupHandlers = function () {
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
      console.log(e.keyCode);
    }.bind(this));
  };

  View.prototype.step = function () {
    this.render();
    this.snake.move();
  }
})();
