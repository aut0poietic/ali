'use strict';

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
			$(window).on('resize', _this.requestResize.bind(_this));
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
				if ($('.viewed', this.$el).length === this.$tabs.length && this.data.status === ali.STATUS.incomplete) {
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
