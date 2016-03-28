'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var aliAccordion = function ($) {

	var DESCRIPTION = 'Accordion interaction.';

	var TAB = '.accordion-tab';
	var OPEN_TAB = '.accordion-tab[aria-expanded="true"]';
	var PANEL = '.accordion-panel';

	var Accordion = function (_aliMultipartInteract) {
		_inherits(Accordion, _aliMultipartInteract);

		function Accordion(element) {
			_classCallCheck(this, Accordion);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Accordion).call(this, element, DESCRIPTION));

			_this.$el.aria({
				'role': "tablist",
				'multiselectable': 'true'
			});
			_this.$tabs = $(TAB, _this.$el);
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
					'data-height': _this.getMeasuredHeight($panel)
				}).off('keydown.ali').on('keydown.ali', _this.panel_onKeyDown.bind(_this));
			});

			if ($openTabs.length > 0) {
				_this.show($($openTabs[0]));
			} else {
				_this.getFirstTab().aria('tabindex', 0);
			}
			$(window).on('resize', _this.requestResize.bind(_this));
			return _this;
		}

		_createClass(Accordion, [{
			key: 'hide',
			value: function hide($tab) {
				this.getPanelFromTab($tab).aria({
					'hidden': 'true',
					'tabindex': "-1"
				}).removeAttr('style');
				$tab.aria('expanded', 'false');
			}
		}, {
			key: 'hideAll',
			value: function hideAll() {
				this.$tabs.each(function (i, el) {
					this.hide($(el));
				}.bind(this));
				if (this.firstRun) {
					$('#panel-0').aria('hidden', 'true');
				}
			}
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
				if ($('.viewed', this.$el).length === this.$tabs.length) {
					this.complete();
				}
			}
		}, {
			key: 'getPanelFromTab',
			value: function getPanelFromTab($tab) {
				return $('#' + $tab.aria('controls'));
			}
		}, {
			key: 'getTabFromPanel',
			value: function getTabFromPanel($panel) {
				return $(TAB + '[aria-controls="' + $panel.attr('id') + '"]');
			}
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
		}, {
			key: 'getFirstTab',
			value: function getFirstTab() {
				return this.$tabs.first();
			}
		}, {
			key: 'getLastTab',
			value: function getLastTab() {
				return this.$tabs.last();
			}
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
		}, {
			key: 'onResize',
			value: function onResize(e) {
				this._width = $(document).width();
				this.requestResize();
			}
		}, {
			key: 'requestResize',
			value: function requestResize() {
				if (!this._resizing) {
					requestAnimationFrame(this.resizePanels.bind(this));
					this._resizing = true;
				}
			}
		}, {
			key: 'resizePanels',
			value: function resizePanels() {
				var _this2 = this;

				this.$tabs.each(function (i, el) {
					var $panel = $(el).next(PANEL);
					$panel.attr('data-height', _this2.getMeasuredHeight($panel));
					if ($panel.aria('hidden') === 'false') {
						$panel.css('min-height', _this2.getMeasuredHeight($panel) + 'px');
					}
				});

				this._resizing = false;
			}
		}, {
			key: 'getMeasuredHeight',
			value: function getMeasuredHeight($panel) {
				var $div = $('<div id="ali-temp" aria-hidden="true" style="overflow:hidden;height:1px;width:100%;visibility: hidden"></div>').appendTo(this.$el);
				var $tmp = $('<dd class="accordion-panel"></dd>').html($panel.html()).appendTo($div);
				var h = $tmp.height();
				$div.remove();
				return h;
			}
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

	$.fn.accordion = Accordion._jQuery;
	$.fn.accordion.Constructor = Accordion;
	$.fn.accordion.noConflict = function () {
		$.fn['accordion'] = $.fn['accordion'];
		return Accordion._jQuery;
	};

	return Accordion;
}(jQuery);
