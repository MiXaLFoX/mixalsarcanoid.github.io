function GameModel (game) {

  this.running = true;
  this.isLost = false;
  this.width = 600;
  this.height = 700;
  this.score = 0;
  this.sprites = {
    paddle: undefined,
    background: undefined,
    brickYellow: undefined,
    brickGreen: undefined,
    brickRed: undefined,
    ball: undefined
  };
  this.bricks = [];
  this.level = 1;
  let gameView = null;
  let gameControls = null;

  this.start = function (view, controls) {
    gameView = view;
    gameControls = controls;
  };

  this.updateView = function () {
    if (gameView) {
      gameView.updateView();
    }
  };
}