'use strict';

class ResultsStorage {
  constructor(address) {
    this.AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";
    this.storage = {};
    this.address = address;
  }
  getStorageInfo() {
    $.ajax({
      url: this.AjaxHandlerScript,
      type: 'POST',
      data: {
        f: 'READ',
        n: this.address
      },
      cache: false,
      success: (response) => {
        if (response.result) {
          const result = JSON.parse(response.result);
          self.storage = result;
        } else {
          self.storage = {};
        }
      },
      error: this.errorHandler
    });
  }
  addValue(name, info) {
    this.storage[name] = info;
    this.unlockStorageInfo();
  }
  deleteValue(name) {
    if (this.storage[name]) {
      delete this.storage[name];
    }
    this.unlockStorageInfo();
  }
  unlockStorageInfo() {
    const password = '123d';
    $.ajax({
      url: this.AjaxHandlerScript,
      type: 'POST',
      data: {
        f: 'LOCKGET',
        n: this.address,
        p: password
      },
      cache: false,
      success: () => {
        $.ajax({
          url: this.AjaxHandlerScript,
          type: 'POST',
          data: {
            f: 'UPDATE',
            n: this.address,
            p: password,
            v: JSON.stringify(this.storage)
          },
          cache: false,
          error: this.errorHandler
        })
      },
      error: this.errorHandler
    })
  }
  getKeys() {
    const keys = [];

    for (let i in this.storage) {
      keys.push(i);
    }
    return keys;
  }
  errorHandler() {
    throw new Error('Error');
  }
}

