module.exports = TodosController;

var csst = require('csst');
var slice = Array.prototype.slice;
var update = csst.lift(csst.toggle('hidden'));
var state = false;

function TodosController() {
}

TodosController.prototype.display = function(todos, todo) {
	changeView('.todos-display');
};

TodosController.prototype.save = function(todos, todo) {
	if(todo.id === void 0) {
		todos.push(todo);
	} else {
		//find Element
		// replace ??
	}
	changeView('.todos-list');
};

TodosController.prototype.delete = function(todos, todo) {
	var i = todos.indexOf(todo);
	if(i != -1) {
		todos.splice(i, 1);
	}
	changeView('.todos-list');
};

TodosController.prototype.cancel = function(todos, todo) {
	changeView('.todos-list');
};

function changeView(view) {
	var buttonsElement = document.querySelectorAll('.todos-element');
	var buttonsList = document.querySelectorAll('.todos-list');
	slice.call(buttonsElement, 0).forEach(function(node){
		update(state, node);
	});
	slice.call(buttonsList, 0).forEach(function(node){
		update(!state, node);
	});
	slice.call(document.querySelectorAll('section.todos-section section:not(.hidden)'), 0).forEach(function(node) {
		update(true, node);
	});
	update(false, document.querySelector(view));
	state = !state;
}


