/** @license MIT License (c) copyright 2010-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author: Fabrice Matrat
 */

(function(define) { 'use strict';
define(function(require) {

	var when, JsonMetadata, jsonPointer, path;

	when = require('when');
	require('aerogear-pipeline');

	jsonPointer = require('cola/lib/jsonPointer');
	JsonMetadata = require('cola/data/metadata/JsonMetadata');
	path = require('cola/lib/path');

	/**
	 * Aa aerogear rest datasource.
	 * @constructor
	 */
	function AeroGearPipeline(client, options) {
		if(!options) {
			options = {};
		}

		this._client = AeroGear.Pipeline({
			baseURL: client
		}).add(options).pipes[options];

		this.metadata = options.metadata || new JsonMetadata(options.id);
	}

	AeroGearPipeline.prototype = {
		get: function(path) {
			var deferred = when.defer();
			this._client.read({
				success: function(data) {
					deferred.resolve(data);
				},
				error: function(error) {
					deferred.reject(error);
				}
			});
			return this._shadow = deferred.promise;
		},

		diff: function(shadow) {
			var metadata = this.metadata;
			return when(this._shadow, function(data) {
				return metadata.diff(shadow, data);
			});
		},

		patch: function(patch) {
			var identify = this.metadata.id;
			var client = this._client;
			var seen = {};
			var self = this;

			return when(this._shadow, send);

			// No HTTP PATCH Support so use old rest paradigm !
			// Need to look to add HTTP PATCH support to Grails

			function send(data) {
				self._shadow = data = self.metadata.patch(data, patch);

				// Because adds and deletes affect array indices, ideally
				// a patch for an array should be processed in descending index
				// order, but for now just assume it was generated in ascending
				// index order and reverse it.  Need a better strategy here for
				// arrays.  Using ids would work out fine regardless.
				return when.reduce(patch.reverse(), function(_, change) {
					var entity, segments;
					var p = change.path;

					if(p[0] === '/') {
						p = p.slice(1);
					}
					segments = p.split('/');
					p = segments[0];

					if(seen[p]) {
						return;
					}

					seen[p] = 1;

					if(segments.length === 1) {
						if(change.op === 'add' || change.op === 'replace') {
							entity = jsonPointer.getValue(data, p);
							var deferred = when.defer();
							client.save(entity, {
								success: function(data) {
									deferred.resolve(data);
								},
								error: function(error) {
									deferred.reject(error);
								}
							});
							return deferred.promise;
						} else if(change.op === 'remove') {
							var deferred = when.defer();
							client.remove(p, {
								success: function(data) {
									deferred.resolve(data);
								},
								error: function(error) {
									deferred.reject(error);
								}
							});
							return deferred.promise;
						}
					} else if(segments.length > 1) {
						entity = jsonPointer.getValue(data, p);
						var deferred = when.defer();
						client.save(entity, {
							success: function(data) {
								deferred.resolve(data);
							},
							error: function(error) {
								deferred.reject(error);
							}
						});
						return deferred.promise;
					}
				}, void 0);
			}
		}
	};

	return AeroGearPipeline;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));
