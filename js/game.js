'use strict';

class Game {
  constructor () {
    this._rafId = null;
    this.gameState = 'ready'; // available states: stopped, ready, running
    this.minusLife = false;
    this.width = 600;
    this.height = 700;
    this.score = 0;
    this.sprites = {
      paddle: null,
      background: null,
      brickYellow: null,
      brickGreen: null,
      brickRed: null,
      brickGrey: null,
      ball: null
    };
    this.sounds = {
      snd1: null,
      snd2: null,
      snd3: null,
      snd4: null,
    };
    this.bricks = [];
    this.level = 1;
    this.lives = 3;
    this.popUp = null;
  }
  init (){
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    const begin = document.getElementById('start');
    const left = document.getElementById('left');
    const right = document.getElementById('right');
    this.ctx.font = '20px Helvetica';
    this.ctx.fillStyle = '#ff383a';
    this.paddle = new Paddle({width: this.width, height: this.height});
    this.paddle.init();
    this.ball = new Ball({width: this.width, height: this.height, paddleHeight: this.paddle.height});
    this.ball.init();
    window.addEventListener('keydown', (e) => {this.keydownListener(e)});
    window.addEventListener('keyup', (e) => this.keyupListener(e));
    begin.addEventListener('click', () => this.softStart());
    left.addEventListener('mousedown', () => this.softLeft());
    left.addEventListener('mouseup', () => this.softStop());
    right.addEventListener('mousedown', () => this.softRight());
    right.addEventListener('mouseup', () => this.softStop());
  }
  keydownListener (e){
    e = window.event || e;
    if ( e.keyCode === 32 ) {
      switch(this.gameState) {
        case 'stopped': 
          if (this.isWin()) {
            // it means you won
            this.createLevel();
          } else if (this.minusLife && this.lives > 0) {
            this.minusLife = false;
          }
          this.ball.init();
          this.paddle.init();
          this.gameState = 'ready';
          this.run();
          break;
        case 'ready': 
        case 'running':
          if(this.ball.sticky) {
            this.ball.sticky = false;
            this.releaseBall();
          }
          break;
      }
    } else if ( e.keyCode === 37 ) {
      this.paddle.dx = -this.paddle.velocity;
      if (this.ball.sticky) {
        this.ball.dx = -this.paddle.velocity;
      }
    } else if ( e.keyCode === 39 ) {
      this.paddle.dx = this.paddle.velocity;
      if (this.ball.sticky) {
        this.ball.dx = this.paddle.velocity;
      }
    }
  }
  keyupListener (){
    this.paddle.stop();
    console.log('this.paddle.x: ', this.paddle.x, '----- this.ball.x: ', this.ball.x);
    if (this.ball.sticky) {
      this.ball.stop();
    }
  }
  softStart (){
    switch(this.gameState) {
      case 'stopped':
        if (this.isWin()) {
          // it means you won
          this.createLevel();
        } else if (this.minusLife && this.lives > 0) {
          this.minusLife = false;
        }
        this.ball.init();
        this.paddle.init();
        this.gameState = 'ready';
        this.run();
        break;
      case 'ready':
      case 'running':
        if(this.ball.sticky) {
          this.ball.sticky = false;
          this.releaseBall();
        }
        break;
    }
  }
  softLeft(){
    this.paddle.dx = -this.paddle.velocity;
    if (this.ball.sticky) {
      this.ball.dx = -this.paddle.velocity;
    }
  }
  softRight(){
    this.paddle.dx = this.paddle.velocity;
    if (this.ball.sticky) {
      this.ball.dx = this.paddle.velocity;
    }
  }
  softStop (){
    this.paddle.stop();
    if (this.ball.sticky) {
      this.ball.stop();
    }
  }
  preload (){
    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = './imgs/' + key + '.png';
    }
    for (let key in this.sounds) {
      this.sounds[key] = new Audio();
      this.sounds[key].src = './sounds/' + key + '.wav';
      this.sounds[key].volume = 0.5;
    }
  }
  createLevel (){
    this.gameState = 'ready';
    const levelDefinition = CONFIG.levels[this.level - 1] || null;
    if(!levelDefinition) {
      throw new Error('No such level');
    }

    for (let row = 0; row < levelDefinition.length; row++) {
      for (let col = 0; col < levelDefinition[row].length; col++) {
        const strength = levelDefinition[row][col];
        this.bricks.push({
          strength,
          x: 74 * col + 10,
          y: 40 * row + 40,
          width: 64,
          height: 32,
        });
      }
    }
  }
  update (){
    if (this.collide(this.paddle)) {
      this.bumpPaddle(this.paddle);
    }
    if (this.ball.dx || this.ball.dy) {
      this.ball.move();
    }
    if (this.paddle.dx) {
      this.paddle.move();
    }
    this.bricks.forEach(element => {
      if (element.strength !== 0) {
        const hittedSide = this.collide(element); // false - no collide, 'v' - vertical, 'h' - horizontal
        if (!!hittedSide) {
          this.bumpBlock(element, hittedSide);
        }
      }
    });
    this.checkBounds();
  }
  render (){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.drawImage(this.sprites.background, 0, 0);
    this.ctx.drawImage(
      this.sprites.ball,
      this.ball.width * this.ball.frame, 0,
      this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    this.ctx.drawImage(this.sprites.paddle, this.paddle.x, this.paddle.y);
    this.bricks.forEach(element => {
      if (element.strength !== 0) {
        this.ctx.drawImage(this.sprites[`brick${CONFIG.brickColorMap[element.strength] || 'Yellow'}`], element.x, element.y);
      }
    });
    this.ctx.fillText('Score: ' + this.score, 5, this.height - 680);
    this.ctx.fillText('Lives: ' + this.lives, 520, this.height - 680);
    if (this.isWin()) {
      this.ctx.fillText("YOU WIN!!!", this.width / 2 - 35, this.height / 2);
      this.ctx.fillText("For the next level press SPACE", this.width / 2 - 120, this.height / 2 + 40);
    } else if (this.minusLife) {
      this.ctx.fillText("Press 'SPACE' to continue", this.width / 2 - 110, this.height / 2 + 20);
    } else if (this.lives === 0) {
      this.ctx.fillText("GAME OVER", this.width / 2 - 55, this.height / 2);
    }
  }
  run (){
    this.update();
    this.render();
    if(this._rafId) {
      window.cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this.gameState !== 'stopped') {
      this._rafId = window.requestAnimationFrame(() => {
        this.run();
      });

    }
  }
  start (){
    this.init();
    this.preload();
    this.createLevel();
    this.run();
  }
  releaseBall (){
    this.gameState = 'running';
    if (this.ball) {
      this.jump();
      this.ball.move();

      /*this.ball = false;*/
    }
  }
  jump (){
    this.ball.dy = this.ball.dx = (Math.floor(Math.random() * (1 - -1 + 1)) + -1) * this.ball.velocity || 5;
    /*if (this.ball.dy === 0){
      this.ball.dy = this.ball.dx = (Math.floor(Math.random() * (1 - -1 + 1)) + -1) * this.ball.velocity;
    } else {
      this.ball.dy = this.ball.dx = this.ball.velocity;
    }
    this.ball.animate();*/
  }
  collide (element){
    const x = this.ball.x + this.ball.dx;     // coords of the ball on the next frame
    const y = this.ball.y + this.ball.dy;     // to prevent sprites visual overlap
    if (x < element.x + element.width &&      // hit the brick from the right side
        x + this.ball.width > element.x &&    // hit the brick from the left side
        y < element.y + element.height &&     // hit the brick in the bottom
        y + this.ball.height > element.y) {   // hit the brick in the top
      return true; // return string 'v' or 'h'
    }
    return false;
  }
  checkBounds (){
    const x = this.ball.x + this.ball.dx;
    const y = this.ball.y + this.ball.dy;
    if (x < 0) {
      this.ball.x = 0;
      this.ball.dx = this.ball.velocity;
    } else if (x + this.ball.width > this.width) {
      this.ball.x = this.width - this.ball.width;
      this.ball.dx = -this.ball.velocity;
    } else if (y < 0) {
      this.ball.y = 0;
      this.ball.dy = this.ball.velocity;
    } else if (y + this.ball.height >= this.height) {
      this.lostLife();
    }
  }
  bumpPaddle (paddle){
    this.ball.dy = -this.ball.velocity;
    this.ball.dx = this.onTheLeftSide(paddle) ? -this.ball.velocity : this.ball.velocity;
    this.sounds.snd2.play();
  }
  onTheLeftSide (paddle){
    return (this.ball.x + this.ball.width / 2) < (paddle.x + paddle.width / 2);
  }
  bumpBlock (brick, side){
    brick.strength -=1;
    if (side === 'v') {
      this.ball.dx *= -1;
    } else {
      this.ball.dy *= -1;
    }
    this.sounds.snd1.play();
    this.sounds.snd1.currentTime = 0;
    this.score++;
    if (this.isWin()) {
      this.win();
    }
  }
  win (){
    this.over();
    this.sounds.snd4.play();
    this.level++;
  }
  isWin (){
    return this.bricks.filter(brickElement => brickElement.strength).length === 0;
  }
  lostLife (){
    this.minusLife = true;
    this.sounds.snd3.play();
    this.lives--;
    window.navigator.vibrate([500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500]);
    // !!this.isWin();
    this.over();
    if (this.lives < 1) {
      // this.over();
      this.popUp = new Form();
      this.popUp.popUpMessage(this.score);
    }
  }
  over (){
    this.gameState = 'stopped';
  }
}


