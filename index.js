var fs = require('fs');
var PNG = require('pngjs').PNG;
var Ocrad = require('ocrad.js');
var sbuff = require('simple-bufferstream');

var okrabyte = {};
okrabyte.decodeStream = function(stream, callback) {
  stream.pipe(new PNG({
    filterType: 4
  })).on('parsed', function() {
    var image = this;
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        image.data[idx] = "rgba(" 
        + this.data[idx + 1] + ","
        + this.data[idx + 2] + ","
        + this.data[idx + 3] + ","
        + this.data[idx + 4] + ")";
      }
    }
    callback(null, Ocrad(image));
  }).on('error', function(error){
    callback(error);
  });
};

okrabyte.decodeBuffer = function(buffer, callback) {
  var rstream = sbuff(buffer);
  this.decodeStream(rstream, callback);
};


okrabyte.decodeFile = function(file, callback) {
  var rstream = fs.createReadStream(file);
  this.decodeStream(rstream, callback);
};

module.exports = okrabyte;
