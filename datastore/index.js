const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};
var filepath;
// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //create a new file for new todos
  counter.getNextUniqueId((err, data) => { //data = 00001
    if (err, null) {
      throw ('error getting nextId');
    } else {
      filepath = path.join(exports.dataDir, `${data}.txt`); // 00001.txt
      items[data] = text; //items 
      fs.writeFile(filepath, items[data], (err, fileData) => {
        if (err, null) {
          throw ('error writing file');
        } else {
          callback(null, { id: data, text: items[data] });
        }
      });
    }
  }); 
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err, null) {
      throw ('error reading directory');
    } else {
      var data = [];
      _.each(files, (text) => {
        text = text.split('.')[0];
        data.push({ id: text, text: text});        
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
