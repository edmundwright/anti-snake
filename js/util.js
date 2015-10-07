(function () {
  window.SnakeGame = window.SnakeGame || {};

  Util = SnakeGame.Util = {};

  Util.samePos = function (pos1, pos2) {
    return pos1[0] === pos2[0] && pos1[1] === pos2[1];
  };

  Util.newPos = function (pos, direction) {
    return [
      pos[0] + direction[0],
      pos[1] + direction[1]
    ];
  };
})();
