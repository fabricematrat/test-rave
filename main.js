var Rest = require('./js/mk/data/aerogear/AeroGearPipeline');
var fluent = require('wire/config/fluent');
var url = 'http://localhost:8080/mytodo/';
var Controller = require('./app/controller/Controller');
var LocalStorage = require('cola/data/LocalStorage');

var TodosController = require('./app/todo/TodosController');
var TodosListTemplate = require('./app/todo/list.html');
var TodosEditTemplate = require('./app/todo/edit.html');
var TodosSectionTemplate = require('./app/todo/section.html');

module.exports = fluent(function(config) {
    return config
		.add('controller@controller', Controller)
		.add('todos@controller', TodosController)
        .add('todos@model', function() {
            return new Rest(url, 'todos');
        })
		.add('todos@view', ['render','insert','qs'], function(render, insert, qs) {
			var view = render(TodosSectionTemplate);
			insert(view, qs('.controller-section'), 'after');
			return view;
		})
		.add('todos@view', ['render','insert','qs'], function(render, insert, qs) {
			var view = render(TodosListTemplate);
			insert(view, qs('section.todos-section header'), 'after');
			return view;
		})
		.add('todos@view', ['render','insert','qs'], function(render, insert, qs) {
			var view = render(TodosEditTemplate);
			insert(view, qs('section.todos-section footer'), 'before');
			return view;
		});
});