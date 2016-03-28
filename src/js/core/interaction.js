'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * --------------------------------------------------------------------------
 * Ali: interaction.es6
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * aliInteraction
 * The parent class for all interactions.
 */

var aliInteraction = function () {
	/**
  *
  * @param element
  * @param type
  */

	function aliInteraction(element) {
		var type = arguments.length <= 1 || arguments[1] === undefined ? ali.TYPE.other : arguments[1];
		var description = arguments.length <= 2 || arguments[2] === undefined ? 'Ali Interaction' : arguments[2];

		_classCallCheck(this, aliInteraction);

		this.$el = $(element);
		var d = new Date();
		this._data = {
			'id': this.$el.attr('id'),
			'start': d.getTime(),
			'type': type,
			'correct_responses': [],
			'learner_response': [],
			'result': 'unknown',
			'latency': 0,
			'description': description
		};
	}

	/**
  * Event data object for the interaction.
  * @returns {{id: string, start: number, type: string, correct_responses: Array, learner_response: Array, result: string, latency: number, description: string}|*}
  */


	_createClass(aliInteraction, [{
		key: 'makeTargetID',


		/**
   * Utility function that creates an ID using the the ID of the passed element or the text of the passed element.
   * @param $el Element used to define the ID.
   * @returns {string} Target ID for use with `aria-controls`
   */
		value: function makeTargetID($el) {
			var str = $el.attr('id');
			if (str === undefined) {
				str = $el.text().replace(/[\W_]+/g, "").toLowerCase();
				if (str.length > 10) {
					str = str.substring(0, 10);
				}
			} else {
				str += '-target';
			}
			return str;
		}

		/**
   * Forces a method to be called later, just before the next UI update.
   * @param callback
   */

	}, {
		key: 'defer',
		value: function defer(callback) {
			var func = function func() {
				callback.apply(this);
			};
			requestAnimationFrame(func.bind(this));
		}
	}, {
		key: 'complete',


		/**
   * Complete event. Fired when all unique user actions have been performed for this interaction.
   * This could be once all items have been viewed, or when the question or questions have been judged.
   * @param status : string From the ali.STATUS constant; Should indicate the status of the interaction, including
   * correct or incorrect, if appropriate.
   */
		value: function complete() {
			var status = arguments.length <= 0 || arguments[0] === undefined ? 'complete' : arguments[0];

			var d = new Date();
			this.data.result = status;
			this.data.latency = d.getTime() - this.data.start;
			var e = new jQuery.Event('ali:complete');
			this.$el.trigger(e, [this.data]);
		}
	}, {
		key: 'data',
		get: function get() {
			return this._data;
		}
	}, {
		key: 'learnerResponses',


		/**
   * Allows interactions to set their learner responses for this interaction.
   * @param responses : array An array of responses specific to the interaction
   */
		set: function set(responses) {
			if ($.getType(responses) === 'array') {
				this.data.learner_response = responses;
			}
		}

		/**
   * Allows interactions to set their correct responses for this interaction.
   * @param responses : array An array of responses specific to the interaction
   */

	}, {
		key: 'correctResponses',
		set: function set(responses) {
			if ($.getType(responses) === 'array') {
				this.data.correct_responses = responses;
			}
		}
	}]);

	return aliInteraction;
}();
