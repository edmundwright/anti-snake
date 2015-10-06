(function () {
  window.SnakeGame = window.SnakeGame || {};

  View = SnakeGame.View = function ($main, word, numSquares) {
    this.$main = $main;

    this.chooseDimensions(numSquares);
    this.buildHTMLGrid();

    this.walls = [];
    this.snake = new SnakeGame.Snake(word, [Math.round(this.dimensions.numRows / 2), 2]);

    this.grid = new SnakeGame.Grid(
      this.dimensions.numRows,
      this.dimensions.numCols,
      this.snake,
      this.walls
    );

    this.snake.receiveGrid(this.grid);

    this.setupHandlers();
    setInterval(this.step.bind(this), 250);
  };

  View.prototype.chooseDimensions = function (numSquares) {
    this.dimensions = {};

    this.dimensions.verticalMargin = parseInt($main.css("margin-top"));

    var smallestWindowDimension = Math.min(
      $(window).width(), $(window).height()
    );

    this.dimensions.mainBorder = Math.round(Math.max(smallestWindowDimension * 0.006, 1));
    this.dimensions.sectionBorder = Math.round(Math.max(smallestWindowDimension * 0.0015, 1));

    this.dimensions.height = $(window).height() -
      (this.dimensions.verticalMargin * 2) - (this.dimensions.mainBorder * 2);
    this.dimensions.width = $(window).width() -
      (this.dimensions.verticalMargin * 2) - (this.dimensions.mainBorder * 2);

    var ratio = this.dimensions.height / this.dimensions.width;

    this.dimensions.numCols = Math.round(Math.sqrt(numSquares / ratio));
    this.dimensions.numRows = Math.round(numSquares / this.dimensions.numCols);

    this.dimensions.squareWidth = Math.min(
      Math.floor(
        (this.dimensions.width / this.dimensions.numCols) -
        (this.dimensions.sectionBorder * 2)
      ),
      Math.floor(
        (this.dimensions.height / this.dimensions.numRows) -
        (this.dimensions.sectionBorder * 2)
      )
    );

    this.dimensions.height =
      (this.dimensions.squareWidth + (this.dimensions.sectionBorder * 2)) *
      this.dimensions.numRows;
    this.dimensions.width =
      (this.dimensions.squareWidth + (this.dimensions.sectionBorder * 2)) *
      this.dimensions.numCols;

    this.dimensions.verticalMargin =
      (($(window).height() - this.dimensions.height) / 2) -
      this.dimensions.mainBorder;
    this.dimensions.horizontalMargin =
      (($(window).width() - this.dimensions.width) / 2) -
      this.dimensions.mainBorder;
  };

  View.prototype.buildHTMLGrid = function () {
    $main.css("height", this.dimensions.height + "px");
    $main.css("width", this.dimensions.width + "px");
    $main.css("font-size", this.dimensions.squareWidth * 0.9 + "px");
    $main.css("border-width", this.dimensions.mainBorder + "px");
    $main.css("margin",
      this.dimensions.verticalMargin + "px " +
      this.dimensions.horizontalMargin + "px");

    for (var row = 0; row < this.dimensions.numRows; row++) {
      for (var col = 0; col < this.dimensions.numCols; col++) {
        var $section = $("<section></section>");
        $section.data("pos", [row, col]);
        this.$main.append($section);
      }
    }

    $main.find("section").css(
      "width", this.dimensions.squareWidth + "px"
    ).css(
      "height", this.dimensions.squareWidth + "px"
    ).css(
      "border-width", this.dimensions.sectionBorder + "px"
    );
  };

  View.prototype.updateHTMLSnake = function () {
    var snake = this.snake;
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
    this.setupMouseEnter();
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
      } else if (!this.snake.segmentAtPos(pos)) {
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

  View.prototype.setupMouseEnter = function () {
    this.$main.on('mouseenter', "section", function (e) {
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
        } else if (this.addingWalls && !this.snake.segmentAtPos(pos)) {
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
