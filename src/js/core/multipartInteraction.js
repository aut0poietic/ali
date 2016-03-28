'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * --------------------------------------------------------------------------
 * Ali: multipartinteraction.es6
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Parent class for any interaction that contains multiple pieces that can be completed independently.
 * Note that not all interactions use both the "itemSelected" and "itemComplete" events.
 */

var aliMultipartInteraction = function (_aliInteraction) {
	_inherits(aliMultipartInteraction, _aliInteraction);

	function aliMultipartInteraction(element) {
		var type = arguments.length <= 1 || arguments[1] === undefined ? ali.TYPE.other : arguments[1];
		var description = arguments.length <= 2 || arguments[2] === undefined ? 'Ali Interaction' : arguments[2];

		_classCallCheck(this, aliMultipartInteraction);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(aliMultipartInteraction).call(this, element, type, description));

		_this.lastPartEnd = _this.data.start;
		return _this;
	}

	/**
  * Event trigger method to indicate that an item has been selected.
  * @param $item : jQuery object for the element selected.
  */


	_createClass(aliMultipartInteraction, [{
		key: 'itemSelected',
		value: function itemSelected($item) {
			var e = new jQuery.Event('ali:itemSelected');
			this.$el.trigger(e, [this.data, $item]);
		}

		/**
   * Event trigger method to indicate that an item has been completed.
   * @param status : string From the ali.STATUS constant; Should indicate the status of the interaction, including
   * correct or incorrect, if appropriate.
   * @param $item : jQuery object for the element selected.
   */

	}, {
		key: 'itemComplete',
		value: function itemComplete() {
			var status = arguments.length <= 0 || arguments[0] === undefined ? ali.STATUS.complete : arguments[0];
			var $item = arguments.length <= 1 || arguments[1] === undefined ? this.$el : arguments[1];

			var clonedData = Object.assign({}, this.data);
			var d = new Date();
			clonedData.result = status;
			clonedData.latency = d.getTime() - this.lastPartEnd;
			var e = new jQuery.Event('ali:itemComplete');
			this.$el.trigger(e, [clonedData, $item]);
			this.lastPartEnd = d.getTime();
		}
	}]);

	return aliMultipartInteraction;
}(aliInteraction);
