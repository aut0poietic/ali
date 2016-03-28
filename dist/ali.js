/*!
 * --------------------------------------------------------------------------
 * Ali - Accessible Learning Interactions (
 * Copyright 2016 Jer Brand / Irresponsible Art
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

"use strict";

jQuery(function ($) {
  if (window.aliAutolInit !== false) {
    $('[data-ali="accordion"]').accordion();
  }
});
;'use strict';

var ali = {
	EVENT: {
		ready: 'ali:ready',
		complete: 'ali:complete'
	},

	STATUS: {
		complete: 'complete',
		correct: 'correct',
		incorrect: 'incorrect',
		unanticipated: 'unanticipated',
		incomplete: 'incomplete'
	},

	TYPE: {
		choice: 'choice',
		performance: 'performance',
		sequencing: 'sequencing',
		numeric: 'numeric',
		other: 'other'
	}
};
;'use strict';

/*
 * --------------------------------------------------------------------------
 * Ali: aria.es6
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 *
 * jQuery.aria
 * A simple jQuery plugin that helps quickly and easily add aria roles, states and properties
 * to any jQuery-wrapped DOM element or collection. A fairly thin wrapper around jQuery's
 * <code>attr()</code>, the aria method restricts property values to current aria properties,
 *
 * Also, you don't have to type "aria-" all the time ;)
 *
 * Example:
 *
 * $('ul.tab-container').aria( 'role', 'tablist' );
 *
 * $('li.tab').aria( {
 *      'role' : 'tab',
 *      'selected' : 'false',
 *      'expanded' : 'false',
 *      'tabindex' : -1
 * } );
 */
///TODO: Extend behavior to allow for near-automatic component creation such as:
///TODO: $('li.tab').aria.init('tab') ;
///TODO: Allow for overridding the defaults, like
///TODO: $('li.tab:first').aria.init('tab', {'selected' : true, 'expanded' : 'true', 'tabindex' : 0 }

var ARIA = function ($) {
	var _attrs = ['role', 'tabindex', 'activedescendant', 'atomic', 'autocomplete', 'busy', 'checked', 'controls', 'describedby', 'disabled', 'dropeffect', 'expanded', 'flowto', 'grabbed', 'haspopup', 'hidden', 'invalid', 'label', 'labelledby', 'level', 'live', 'multiline', 'multiselectable', 'orientation', 'owns', 'posinset', 'pressed', 'readonly', 'relevant', 'required', 'selected', 'setsize', 'sort', 'valuemax', 'valuemin', 'valuenow', 'valuetext'];

	function _addARIA(prop) {
		prop = ('' + prop).toLowerCase().trim();
		return prop !== 'role' && prop !== 'tabindex' ? 'aria-' + prop : prop;
	}

	function _isValidAria(prop) {
		return _attrs.indexOf(prop) > -1;
	}

	$.fn.aria = function (prop, value) {
		if ('object' === $.type(prop)) {
			for (var i in prop) {
				if (prop.hasOwnProperty(i)) {
					this.aria(i, prop[i]);
				}
			}
		} else if (undefined !== prop && undefined !== value) {
			this.each(function () {
				if (_isValidAria(prop)) {
					var $el = $(this);
					var attr = _addARIA(prop);
					$el.attr(attr, value);
				}
			});
		} else if (undefined !== prop) {
			return this.attr(_addARIA(prop));
		}
		return this;
	};
}(jQuery);
;'use strict';

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
			'result': ali.STATUS.incomplete,
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
;'use strict';

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
;'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var aliAccordion = function ($) {

	var DESCRIPTION = 'Accordion interaction.';
	var TYPE = ali.TYPE.other;

	/**
  * Saved jQuery paths.
  */
	var TAB = '.accordion-tab';
	var OPEN_TAB = '.accordion-tab[aria-expanded="true"]';
	var PANEL = '.accordion-panel';

	var Accordion = function (_aliMultipartInteract) {
		_inherits(Accordion, _aliMultipartInteract);

		function Accordion(element) {
			_classCallCheck(this, Accordion);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Accordion).call(this, element, TYPE, DESCRIPTION));

			_this.$el.aria({
				'role': "tablist",
				'multiselectable': 'true'
			});
			_this.$tabs = $(TAB, _this.$el);
			// before we begin manipulation, fetch a reference to any
			// tabs that were set to expanded so we can restore them
			// after initialization
			var $openTabs = $(OPEN_TAB);

			_this.$tabs.each(function (i, el) {
				var $tab = $(el);
				var id = _this.makeTargetID($tab);
				var $panel = $tab.next(PANEL);
				$tab.aria({
					'role': "tab",
					'tabindex': "0",
					'expanded': "false",
					'controls': id
				}).off('click.ali').on('click.ali', _this.tab_onClick.bind(_this)).off('keydown.ali').on('keydown.ali', _this.tab_onKeyDown.bind(_this));

				$panel.aria({
					'role': "tabpanel",
					'tabindex': "-1",
					'hidden': "true"
				}).attr({
					'id': id,
					'data-height': _this._getMeasuredHeight($panel)
				}).off('keydown.ali').on('keydown.ali', _this.panel_onKeyDown.bind(_this));
			});

			// If there was an expanded tab set by the user, expand that tab.
			// Otherwise, just make the first element in the list active
			if ($openTabs.length > 0) {
				/// DIRTY HACK: deferring this "show" call so that event handlers have a chance to be attached
				/// before it fires.
				_this.defer(function () {
					_this.show($($openTabs[0]));
				});
			} else {
				_this.getFirstTab().aria('tabindex', 0);
			}
			$(window).on('resize', _this._requestResize.bind(_this));
			return _this;
		}

		/**
   * Hides the panel corresponding to the provided tab and sets that tab to unexpanded.
   * @param $tab
   */


		_createClass(Accordion, [{
			key: 'hide',
			value: function hide($tab) {
				this.getPanelFromTab($tab).aria({
					'hidden': 'true',
					'tabindex': "-1"
				}).removeAttr('style');
				$tab.aria('expanded', 'false');
			}

			/**
    *  Hides all panels
    */

		}, {
			key: 'hideAll',
			value: function hideAll() {
				var _this2 = this;

				this.$tabs.each(function (i, el) {
					_this2.hide($(el));
				});
			}

			/**
    * Shows the panel corresponding to the provided $tab and fires an `ali:itemSelected`.
    * If all tabs have been viewed, fires an `ali:complete` event.
    * @param $tab
    */

		}, {
			key: 'show',
			value: function show($tab) {
				var $panel = this.getPanelFromTab($tab);
				var panelHeight = parseInt($panel.attr('data-height'));
				this.hideAll();
				$panel.aria({
					'hidden': 'false',
					'tabindex': "0"
				});
				if (panelHeight > 0) {
					$panel.css('max-height', panelHeight + 'px');
				}
				$tab.aria({
					'expanded': 'true',
					'selected': 'true',
					'tabindex': '0'
				}).addClass('viewed').focus();

				this.itemSelected($tab);

				if ($('.viewed', this.$el).length === this.$tabs.length && this.data.result === ali.STATUS.incomplete) {
					this.complete();
				}
			}

			/**
    * Returns a panel controlled by the provided tab.
    * @param $tab : jQuery
    * @returns jQuery object for the panel.
    */

		}, {
			key: 'getPanelFromTab',
			value: function getPanelFromTab($tab) {
				return $('#' + $tab.aria('controls'));
			}

			/**
    * Returns a tab that controls the provided panel.
    * @param $panel : jQuery
    * @returns jQuery object for the tab
    */

		}, {
			key: 'getTabFromPanel',
			value: function getTabFromPanel($panel) {
				return $(TAB + '[aria-controls="' + $panel.attr('id') + '"]');
			}

			/**
    * Iterates through all siblings following the provided tab until another tab is found.
    * If no tab is found, returns an empty jQuery object.
    * @param $tab
    * @returns {jQuery}
    * @note Maximum iterations is 2 * {number of tabs}
    * @private
    */

		}, {
			key: '_nextTab',
			value: function _nextTab($tab) {
				var $next = $tab.next();
				var count = this.$tabs.length * 2;
				while ($next.length > 0 && !$next.is(TAB) && count-- != 0) {
					$next = $next.next();
				}
				return $next;
			}

			/**
    * Returns the next tab in the accordion or the first tab if no next tab can be found.
    * @param $tab
    * @returns {jQuery}
    */

		}, {
			key: 'getNextTab',
			value: function getNextTab($tab) {
				var $next = this._nextTab($tab);
				if ($next.length === 0) {
					return this.getFirstTab();
				} else {
					return $next;
				}
			}

			/**
    * Iterates over all siblings preceding the provided tab until another tab is found.
    * If no tab is found, returns an empty jQuery object.
    * @param $tab
    * @returns {jQuery}
    * @note Maximum iterations is 2 * {number of tabs}
    * @private
    */

		}, {
			key: '_previousTab',
			value: function _previousTab($tab) {
				var $prev = $tab.prev();
				var count = this.$tabs.length * 2;
				while ($prev.length > 0 && !$prev.is(TAB) && count-- != 0) {
					$prev = $prev.prev();
				}
				return $prev;
			}

			/**
    * Returns the previous tab in the accordion or the last tab if no previous tab can be found.
    * @param $tab
    * @returns {jQuery}
    */

		}, {
			key: 'getPreviousTab',
			value: function getPreviousTab($tab) {
				var $prev = this._previousTab($tab);
				if ($prev.length === 0) {
					return this.getLastTab();
				} else {
					return $prev;
				}
			}

			/**
    * Gets the first tab in the list.
    * @returns {jQuery}
    */

		}, {
			key: 'getFirstTab',
			value: function getFirstTab() {
				return this.$tabs.first();
			}

			/**
    * Gets the last tab in the list.
    * @returns {jQuery}
    */

		}, {
			key: 'getLastTab',
			value: function getLastTab() {
				return this.$tabs.last();
			}

			/**
    * Keyboard event handler for when keyboard focus in on the tabs.
    * @private
    */

		}, {
			key: 'tab_onKeyDown',
			value: function tab_onKeyDown(e) {
				switch (e.which) {
					case 13: // ENTER
					case 32:
						// SPACE
						e.preventDefault();
						e.stopPropagation();
						this.tab_onClick(e);
						break;
					case 37: // LEFT
					case 38:
						// UP
						e.preventDefault();
						e.stopPropagation();
						this.show(this.getPreviousTab($(e.currentTarget)));
						break;
					case 39: // RIGHT
					case 40:
						// DOWN
						e.preventDefault();
						e.stopPropagation();
						this.show(this.getNextTab($(e.currentTarget)));
						break;
					case 35:
						// END
						e.preventDefault();
						e.stopPropagation();
						this.show(this.getLastTab());
						break;
					case 36:
						// HOME
						e.preventDefault();
						e.stopPropagation();
						this.show(this.getFirstTab());
						break;
				}
			}

			/**
    * Tab click event
    * @private
    */

		}, {
			key: 'tab_onClick',
			value: function tab_onClick(e) {
				var $target = $(e.target);
				if ($target.aria('expanded') !== 'true') {
					this.hideAll();
					this.show($target);
				} else {
					this.hide($target);
				}
			}

			/**
    * Keyboard event handler for when keyboard focus is in a panel.
    * @private
    */

		}, {
			key: 'panel_onKeyDown',
			value: function panel_onKeyDown(e) {
				if ((e.ctrlKey || e.metaKey) && e.currentTarget) {
					var $tab, $newTab;
					var $panel = $(e.currentTarget);
					switch (e.which) {
						case 38:
							// UP
							e.preventDefault();
							e.stopPropagation();
							this.getTabFromPanel($panel).focus();
							break;
						case 33:
							// PAGE UP
							e.preventDefault();
							e.stopPropagation();
							$tab = this.getFirstTab();
							if ($tab.aria('expanded') === 'false') {
								this.show($tab);
							}
							$tab.focus();
							break;
						case 40:
							//  DOWN
							e.preventDefault();
							e.stopPropagation();
							$tab = this.getLastTab();
							if ($tab.aria('expanded') === 'false') {
								this.show($tab);
							}
							$tab.focus();
							break;
					}
				}
			}

			/**
    * Window resize handler.
    * @param e
    */

		}, {
			key: 'onResize',
			value: function onResize(e) {
				this._width = $(document).width();
				this._requestResize();
			}

			/**
    * Requests a resize event if the current control is not currently performing a resize event.
    * Events are handled before the next paint and debounced using requestAnimationFrame
    * @private
    */

		}, {
			key: '_requestResize',
			value: function _requestResize() {
				if (!this._resizing) {
					requestAnimationFrame(this._resizePanels.bind(this));
					this._resizing = true;
				}
			}

			/**
    * Callback passed to requestAnimationFrame; sets the max-height for each panel, adjusting the height
    * for any panel currently open.
    * @private
    */

		}, {
			key: '_resizePanels',
			value: function _resizePanels() {
				var _this3 = this;

				this.$tabs.each(function (i, el) {
					var $panel = $(el).next(PANEL);
					$panel.attr('data-height', _this3._getMeasuredHeight($panel));
					if ($panel.aria('hidden') === 'false') {
						$panel.css('min-height', _this3._getMeasuredHeight($panel) + 'px');
					}
				});
				this._resizing = false;
			}

			/**
    * Creates an clone element on the DOM of the provided panel and measures it's height.
    * @param $panel
    * @returns {int} height of element
    * @private
    */

		}, {
			key: '_getMeasuredHeight',
			value: function _getMeasuredHeight($panel) {
				var $div = $('<div id="ali-temp" aria-hidden="true" style="overflow:hidden;height:1px;width:100%;visibility: hidden"></div>').appendTo(this.$el);
				var $tmp = $('<dd class="accordion-panel"></dd>').html($panel.html()).appendTo($div);
				var h = $tmp.height();
				$div.remove();
				return h;
			}

			/**
    * jQuery Plugin interface method -- simply creates a new Accordion instance
    * for each element in the current query.
    */

		}], [{
			key: '_jQuery',
			value: function _jQuery() {
				return this.each(function () {
					new Accordion(this);
				});
			}
		}]);

		return Accordion;
	}(aliMultipartInteraction);

	/**
  * JQUERY PLUGIN
  */

	$.fn.accordion = Accordion._jQuery;
	$.fn.accordion.Constructor = Accordion;
	$.fn.accordion.noConflict = function () {
		$.fn['accordion'] = $.fn['accordion'];
		return Accordion._jQuery;
	};

	return Accordion;
}(jQuery);
