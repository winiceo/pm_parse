module.exports = (function() {
  var habitat = require( "habitat" );
  
  habitat.load(__dirname+'/../.env');
  return new habitat();
}());
