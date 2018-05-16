'use strict';


const g = new Game();
/*function resize() {
  /!*const gameArea = document.getElementById('gameArea');*!/
  const gameCanvas = document.getElementById('game');
  const widthToHeight = 0.6291;
  console.log("widthToHeight: ", widthToHeight);
  let newWidth = window.innerWidth;
  console.log("newWidth: ", newWidth);
  let newHeight = window.innerHeight;
  console.log("newHeight: ", newHeight);
  const newWidthToHeight = newWidth / newHeight;
  console.log("newWidthToHeight: ", newWidthToHeight);
  if (gameCanvas) {
    gameCanvas.style.width = newWidth + 'px';
    gameCanvas.style.height = newHeight + 'px';
    if (newWidthToHeight > widthToHeight) {
      newWidth = newHeight * widthToHeight;
      /!*gameArea.style.height = Math.floor(newHeight / 1.362) + 'px';
      gameArea.style.width = newWidth + 'px';*!/
    } else {
      newHeight = newWidth / widthToHeight;
      /!*gameArea.style.width = newWidth + 'px';
      gameArea.style.height = newHeight + 'px';*!/
    }

    /!*gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';*!/


    gameCanvas.width = newWidth;
    console.log("gameCanvas.width: ", gameCanvas.width);
    gameCanvas.height = newHeight;
    console.log("gameCanvas.height: ", gameCanvas.height);
  }
}*/
window.addEventListener("DOMContentLoaded",g.start());
/*window.addEventListener('resize', resize());
window.addEventListener('orientationchange', resize);*/
