/** @license MIT License (c) copyright 2010-2013 original author or authors */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author: Brian Cavalier
 * @author: John Hann
 * @author: Fabrice Matrat
 */
(function(define) { 'use strict';
define(function(require) {

	/**
	 * A Storage + Client datasource
	 * @constructor
	 */
	function StoreWithRest(store, client) {
		this._store = store;
		this._client = client;
		this._online = true;
		this._patches = [];
		var self = this;
		window.addEventListener('online',  function() {
			self._online = true;
			self._patches.forEach(function(data, index){
				self.patch(self._patches.splice(index, 1));
			});
		});
		window.addEventListener('offline', function(){
			self._online = false;
		});
	}

	StoreWithRest.prototype = {
		get: function(path) {
			var self = this;
			this._client.get(path).then(function(data){
				self._store.save(data);
			});
		},

		diff: function(shadow) {
			return this._store.diff(shadow, this._load());
		},

		patch: function(patch) {
			var self = this;
			if (this._online) {
				this._client.patch(patch).then(function(data){
					self._store.patch(data);
				});
			} else {
				this._store.patch(patch);
				this._storeOfflinePatch(patch);
			}
		},

		_storeOfflinePatch: function(patch) {
			this._patches.push(patch);
		}
	};

	return StoreWithRest;
});
})(typeof define == 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }
);
