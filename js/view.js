(function () {
  window.SnakeGame = window.SnakeGame || {};

  View = SnakeGame.View = function ($main, snake, numRows, numCols) {
    this.$main = $main;

    this.walls = [];
    this.snake = snake;
    this.grid = new SnakeGame.Grid(numRows, numCols, this.snake, this.walls);

    this.snake.receiveGrid(this.grid);

    this.buildHTMLGrid();
    this.setupHandlers();
    setInterval(this.step.bind(this), 250);
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
      var segmentHere = snake.segmentAtPos($(this).data('pos'));

      if (segmentHere) {
        $(this).addClass("snake");
        $(this).text(segmentHere.contents);
      } else {
        $(this).removeClass("snake");
        $(this).text("");
      }
    });
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
    });
  };

  View.prototype.setupHandlers = function () {
    // this.setupKeypress();
    this.setupMouseUpAndLeave();
    this.setupMouseDown();
    this.setupMouseOver();
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

  View.prototype.setupMouseDown = function () {
    this.$main.on('mousedown', 'section', function (e) {
      e.preventDefault();

      var pos = $(e.currentTarget).data("pos");
      var wallHere = this.grid.wallAtPos(pos);

      if (wallHere) {
        this.deletingWalls = true;
        this.deleteWall(wallHere, $(e.currentTarget));
      } else if (!snake.segmentAtPos(pos)) {
        this.addingWalls = true;
        this.addWall(pos, $(e.currentTarget));
      }
    }.bind(this));
  };

  View.prototype.setupMouseUpAndLeave = function () {
    this.$main.on('mouseup mouseleave', function (e) {
      e.preventDefault();
      this.addingWalls = false;
      this.deletingWalls = false;
    }.bind(this));
  };

  View.prototype.setupMouseOver = function () {
    this.$main.on('mouseover', "section", function (e) {
      console.log("over");
      if (this.addingWalls || this.deletingWalls) {
        e.preventDefault();
        var pos = $(e.currentTarget).data("pos");
        console.log("over", pos);
        var wallHere = this.grid.wallAtPos(pos);

        if (wallHere) {
          if (this.deletingWalls) {
            this.deleteWall(wallHere, $(e.currentTarget));
          }
        } else if (this.addingWalls && !snake.segmentAtPos(pos)) {
          this.addWall(pos, $(e.currentTarget));
        }
      }
    }.bind(this));
  };

  View.prototype.step = function () {
    this.updateHTMLSnake();
    this.updateHTMLTarget();
    this.snake.chooseDirection();
    this.snake.move();
  };

  View.prototype.addWall= function (pos, $section) {
    this.walls.push(new Block("", pos));
    if ($section) {
      $section.addClass("wall-here");
    }
  };

  View.prototype.deleteWall = function (wall, $section) {
    index = this.walls.indexOf(wall);
    this.walls.splice(index, 1);
    if ($section) {
      $section.removeClass("wall-here");
    }
  };
})();
