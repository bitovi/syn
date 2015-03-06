/*syn@0.1.0-pre.0#syn*/
var syn = require('./synthetic');
require('./mouse.support');
require('./browsers');
require('./key.support');
require('./drag');

window.syn = syn;
module.exports = syn;

