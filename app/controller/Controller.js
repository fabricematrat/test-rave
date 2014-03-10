module.exports = Controller;

var csst = require('csst');
var slice = Array.prototype.slice;
var update = csst.lift(csst.toggle('hidden'));
var controllerSection = document.querySelector('.controller-section');
var state = false;

function Controller() {
}

Controller.prototype.display = function(view) {
	update(true, controllerSection);
	update(false, document.querySelector(view));
};



