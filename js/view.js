(function () {
  window.SnakeGame = window.SnakeGame || {};

  View = SnakeGame.View = function (options) {
    this.options = options;

    this.$main = options.$main;

    this.chooseDimensions(options.numSquares);
    this.buildHTML();

    this.startGame();
    this.playing = false;

    this.setupHandlers();
    this.startTimer();

    this.revealWelcomeModal();
  };

  View.prototype.chooseDimensions = function (numSquares) {
    this.dimensions = {};

    this.chooseGridDimensions(numSquares);

    this.chooseSectionBorder();
    this.chooseBlockWidth();
    this.chooseSize();
    this.chooseMargins();
    this.chooseModalDimensions();
  };

  View.prototype.chooseSectionBorder = function () {
    var smallestDimension = Math.min(
      $(window).width(), $(window).height()
    );
    this.dimensions.sectionBorder = Math.round(
      Math.max(smallestDimension * 0.0015, 1)
    );
  };

  View.prototype.chooseGridDimensions = function (numSquares) {
    var aspectRatio = $(window).height() / $(window).width();
    this.dimensions.numCols = Math.round(Math.sqrt(numSquares / aspectRatio));
    this.dimensions.numRows = Math.round(numSquares / this.dimensions.numCols);
  };

  View.prototype.chooseBlockWidth = function () {
    this.dimensions.blockWidth = Math.min(
      Math.floor(
        ($(window).width() / this.dimensions.numCols) -
        (this.dimensions.sectionBorder * 2)
      ),
      Math.floor(
        ($(window).height()/ this.dimensions.numRows) -
        (this.dimensions.sectionBorder * 2)
      )
    );
  };

  View.prototype.chooseSize = function () {
    this.dimensions.height =
      (this.dimensions.blockWidth + (this.dimensions.sectionBorder * 2)) *
      this.dimensions.numRows;
    this.dimensions.width =
      (this.dimensions.blockWidth + (this.dimensions.sectionBorder * 2)) *
      this.dimensions.numCols;
  };

  View.prototype.chooseMargins = function () {
    this.dimensions.verticalMargin =
      ($(window).height() - this.dimensions.height) / 2;
    this.dimensions.horizontalMargin =
      ($(window).width() - this.dimensions.width) / 2;
  };

  View.prototype.chooseModalDimensions = function () {
    this.dimensions.modalWidth = Math.min(this.dimensions.width, 600);
    this.dimensions.modalHeight = Math.min(this.dimensions.height, 500);
  };

  View.prototype.buildHTML = function () {
    this.$main.css("height", this.dimensions.height + "px");
    this.$main.css("width", this.dimensions.width + "px");
    this.$main.css("font-size", this.dimensions.blockWidth * 0.9 + "px");
    this.$main.css(
      "margin",
      this.dimensions.verticalMargin + "px " +
      this.dimensions.horizontalMargin + "px"
    );

    this.buildHTMLGrid();
    this.buildHTMLScore();
    this.buildHTMLModals();
  };

  View.prototype.buildHTMLGrid = function () {
    for (var row = 0; row < this.dimensions.numRows; row++) {
      for (var col = 0; col < this.dimensions.numCols; col++) {
        var $section = $("<section></section>");
        $section.data("pos", [row, col]);
        this.$main.append($section);
      }
    }

    this.$main.find("section").css(
      "width", this.dimensions.blockWidth + "px"
    ).css(
      "height", this.dimensions.blockWidth + "px"
    ).css(
      "border-width", this.dimensions.sectionBorder + "px"
    );
  };

  View.prototype.buildHTMLScore = function () {
    this.$scoreDisplay = $("<h1>");
    this.$scoreDisplay.addClass("score");
    this.$main.append(this.$scoreDisplay);
  };

  View.prototype.buildHTMLModals = function () {
    var size = this.dimensions.modalWidth * this.dimensions.modalHeight;
    var padding = Math.sqrt(size) * 0.03;

    this.$main.find("div.modal").css(
      "width", (this.dimensions.modalWidth - padding * 2) + "px"
    ).css(
      "left", ((this.dimensions.width - this.dimensions.modalWidth) / 2) + "px"
    ).css(
      "padding", padding + "px"
    ).css(
      "font-size", Math.sqrt(size) * 0.04 + "px"
    );

    var dimensions = this.dimensions;
    this.$main.find("div.modal").each(function () {
      var height = parseInt($(this).css("height"));
      $(this).css(
        "top", ((dimensions.height - height - padding * 2) / 2.4) + "px"
      );
    });
};

  View.prototype.startGame = function () {
    this.snake = new SnakeGame.Snake({
      word: this.options.word,
      initialLength: this.options.initialLength,
      firstPos: [
        Math.round(this.dimensions.numRows / 2) - 1,
        this.dimensions.numCols - 1
      ]
    });

    this.grid = new SnakeGame.Grid({
      numRows: this.dimensions.numRows,
      numCols: this.dimensions.numCols,
      snake: this.snake
    });
  };

  View.prototype.setupHandlers = function () {
    this.setupMouseUp();
    this.setupMouseDown();
    this.setupMouseEnter();
    this.setupButtons();
  };

  View.prototype.setupMouseDown = function () {
    this.$main.on('mousedown', 'section', function (e) {
      e.preventDefault();

      if (!this.playing) {
        return;
      }

      var pos = $(e.currentTarget).data("pos");
      var wallHere = this.grid.wallAtPos(pos);

      if (wallHere) {
        this.deletingWalls = true;
        this.deleteWall(wallHere, $(e.currentTarget));
      } else if (this.grid.wallCanBePlaced(pos)) {
        this.addingWalls = true;
        this.addWall(pos, $(e.currentTarget));
      }
    }.bind(this));
  };

  View.prototype.setupMouseUp = function () {
    $(document).on('mouseup', function (e) {
      e.preventDefault();
      this.addingWalls = false;
      this.deletingWalls = false;
    }.bind(this));
  };

  View.prototype.setupMouseEnter = function () {
    this.$main.on('mouseenter', "section", function (e) {
      e.preventDefault();

      if (!this.playing) {
        return;
      }

      if (this.addingWalls || this.deletingWalls) {
        var pos = $(e.currentTarget).data("pos");
        var wallHere = this.grid.wallAtPos(pos);

        if (wallHere) {
          if (this.deletingWalls) {
            this.deleteWall(wallHere, $(e.currentTarget));
          }
        } else if (this.addingWalls && this.grid.wallCanBePlaced(pos)) {
          this.addWall(pos, $(e.currentTarget));
        }
      }
    }.bind(this));
  };

  View.prototype.setupButtons = function () {
    this.$main.on("click", "button.start", function (e) {
      this.$main.find("div.modal.welcome").addClass("hidden");
      this.startGame();
      this.playing = true;
    }.bind(this));

    this.$main.on("click", "button.restart", function (e) {
      this.$main.find("div.modal.game-over").addClass("hidden");
      this.startGame();
      this.playing = true;
      this.startTimer();
      this.removeHTMLBlocks();
    }.bind(this));
  };

  View.prototype.addWall= function (pos, $section) {
    this.grid.addWallAtPos(pos);
    if ($section) {
      $section.addClass("wall");
    }
  };

  View.prototype.deleteWall = function (wall, $section) {
    this.grid.deleteWall(wall);
    if ($section) {
      $section.removeClass("wall");
    }
  };

  View.prototype.startTimer = function () {
    this.timer = setInterval(this.step.bind(this), this.options.difficulty);
  };

  View.prototype.stopTimer = function () {
    clearInterval(this.timer);
  };

  View.prototype.step = function () {
    this.updateHTML();

    this.incrementAppleScore();
    this.snake.chooseDirection();

    if (this.snake.stopped) {
      if (this.playing) {
        this.playing = false;
        this.revealGameOverModal();
        this.stopTimer();
      } else {
        this.startGame();
      }
    } else {
      this.snake.move();
    }
  };

  View.prototype.incrementAppleScore = function () {
    if (this.grid.appleScore < 1) {
      this.grid.appleScore += 0.03;
    } else {
      this.grid.appleScore *= 1.02;
    }

    if (this.grid.appleScore >= 100) {
      this.grid.appleScore = 0;
    }
  };

  View.prototype.updateHTML = function () {
    this.updateHTMLBlocks();
    this.updateHTMLScore();
  };

  View.prototype.updateHTMLBlocks = function () {
    var snake = this.snake;
    var applePos = this.grid.applePos;

    var appleScore;
    if (this.grid.appleScore < 10) {
      appleScore = "0" + Math.floor(this.grid.appleScore);
    } else {
      appleScore = Math.floor(this.grid.appleScore);
    }

    this.$main.find("section").each(function () {
      var pos = $(this).data('pos');
      var segmentHere = snake.segmentAtPos($(this).data('pos'));

      if (segmentHere) {
        $(this).removeClass("apple");
        $(this).addClass("snake");
        $(this).text(segmentHere.contents);
      } else if (SnakeGame.Util.samePos(applePos, pos)) {
        $(this).removeClass("snake");
        $(this).addClass("apple");
        $(this).text(appleScore);
      } else {
        $(this).removeClass("apple").removeClass("snake");
        $(this).text("");
      }
    });
  };

  View.prototype.removeHTMLBlocks = function () {
    this.$main.find("section").removeClass("wall");
  };

  View.prototype.updateHTMLScore = function () {
    if (this.playing) {
      this.$scoreDisplay.text(Math.floor(this.grid.score));
    }
  };

  View.prototype.revealWelcomeModal = function () {
    this.$main.find("div.modal.welcome").removeClass("hidden");
  };

  View.prototype.revealGameOverModal = function () {
    this.$main.find("div.modal.game-over").removeClass("hidden");
  };
})();
