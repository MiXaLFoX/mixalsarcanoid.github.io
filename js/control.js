function controller () {
  let self = this;
  let model = null;
  let view = null;

  self.leftPressed = false;
  self.rightPressed = false;

  self.start = function (model, view) {
    GameModel = model;
    GameView = view;
  };

  self.addEvList = function () {
    document.addEventListener("keydown", self.keyDownHandler, false);
    document.addEventListener("keyup", self.keyUpHandler, false);
    document.addEventListener("mousemove", self.mouseMoveHandler, false);
  };

  self.keyDownHandler = function (e) {
    if ( e.keyCode === 32 ) {
      console.log(game.isWin());
      if (game.isWin()) {
        // it means you won
        game.create();
        game.ball.init();
        game.paddle.init();
        game.run();
      }
      game.paddle.releaseBall();
    } else if ( e.keyCode === 37 ) {
      game.paddle.dx = -game.paddle.velocity;
    } else if ( e.keyCode === 39 ) {
      game.paddle.dx = game.paddle.velocity;
    }
  };
  self.keyUpHandler = function() {
    game.paddle.stop();
  };

  self.mouseMoveHandler = function (e) {
    let relativeX = e.clientX - view.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < view.width) {
      GameModel.paddle.mouseMove(relativeX);
    }
  };

}