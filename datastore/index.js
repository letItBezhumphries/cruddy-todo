var fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);


var items = {};
var filepath;
// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //create a new file for new todos
  counter.getNextUniqueId((err, data) => {
    if (err, null) {
      throw ('error getting nextId');
    } else {
      filepath = path.join(exports.dataDir, `${data}.txt`);
      items[data] = text;
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
    if (err) {
      callback(err);
    } else {
      var data = files.map(file => {
        var id = path.basename(file, '.txt');
        var filePath = path.join(exports.dataDir, file);
        return readFilePromise(filePath, 'utf8').then(fileText => {
          return {
            id: id,
            text: fileText
          };
        });
      });
      Promise.all(data).then(items => callback(err, items)).catch(err => 
        callback(err));
    }
  });
};

exports.readOne = (id, callback) => {
  var fileName = `${id}.txt`;
  var filePath = path.join(exports.dataDir, fileName);
  var text = items[id];
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (!text || err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text }); 
    }
  });
};

exports.update = (id, text, callback) => {
  var filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, (err) => {
    if (err) {
      callback(new Error('error id does not exist'));
    } else {
      fs.writeFile(filepath, text, (err, text) => {
        if (err, null) {
          throw ('error updating todo text');
        } else {
          callback(null, { id: text, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(filepath, (err, id) => {
        if (err) {
          throw err;
        } else {
          callback(null, {id});
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
