'use strict';

class Form {
  constructor() {
    this.page = document.getElementById('play');
    this.modal = document.createElement('div');
    this.form = document.createElement('form');
    this.input = document.createElement('input');
    this.inputBtn = document.createElement('input');
    this.p = document.createElement('p');
  }
  popUpMessage(msg) {
    this.p.innerHTML = `Your score is <span id="score">${msg}</span></br>Please, enter your name`;
    this.modal.className = 'modal';
    this.input.setAttribute('type', 'text');
    this.input.id = 'name';
    this.input.className = 'name-field';
    this.inputBtn.setAttribute('type', 'button');
    this.inputBtn.setAttribute('value', 'OK');
    this.inputBtn.id = 'btn';
    this.inputBtn.className = 'btn';
    this.modal.appendChild(this.p);
    this.modal.appendChild(this.input);
    this.modal.appendChild(this.inputBtn);
    this.page.appendChild(this.modal);
    const player = {
      name: this.input.value,
      score: msg
    };
    console.log(player);
  }
}