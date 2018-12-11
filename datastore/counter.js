const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => { //zeroPaddedNumber
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0); // 00000
    } else {
      callback(null, Number(fileData)); //'00001' => 1
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter((err, data) => {
    if (err, null) {
      throw ('error reading counter');
    } else {
      data++; //increment the counter
      writeCounter(data, (err, count) => {
        if (err, null) {
          throw ('error writing counter');
        } else {
          callback(null, count);
        }
      });
    }
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
