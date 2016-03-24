'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Accordion = function ($) {

	var tabQuery = '.accordion-tab';
	var panelQuery = '.accordion-panel';

	var Accordion = function () {
		function Accordion(element) {
			var _this = this;

			_classCallCheck(this, Accordion);

			this.$el = $(element);
			this.$tabs = $(tabQuery, this.$el);

			this.$tabs.each(function (i, el) {
				var $tab = $(el);
				var id = _this._makeID($tab);
				var $panel = $tab.next(panelQuery);
				$tab.aria({
					'role': "tab",
					'tabindex': i === 0 ? "0" : "-1",
					'expanded': i === 0 ? "true" : "false",
					'controls': id
				}).off('click.ali').on('click.ali', _this.onTabClick.bind(_this)).off('keydown.ali').on('keydown.ali', _this.onTabKeyDown.bind(_this));

				$panel.aria({
					'role': "tabpanel",
					'tabindex': "0",
					'hidden': i === 0 ? "false" : "true"
				}).attr('id', id);
			});
		}

		_createClass(Accordion, [{
			key: 'getPanelFromTab',
			value: function getPanelFromTab($tab) {
				return $('#' + $tab.attr('aria-controls').replace(/tab/, 'panel'));
			}
		}, {
			key: 'getTabFromPanel',
			value: function getTabFromPanel($panel) {
				return $('#' + $panel.attr('id').replace(/panel/, 'tab'));
			}
		}, {
			key: 'hide',
			value: function hide($tab) {

				this.getPanelFromTab($tab).attr('aria-hidden', 'true');
				$tab.attr({
					'aria-expanded': 'false',
					'aria-selected': 'false',
					'tabindex': '-1'
				});
			}
		}, {
			key: 'hideAll',
			value: function hideAll() {
				console.log(this);
				this.$tabs.each(function (i, el) {
					this.hide($(el));
				}.bind(this));

				if (this.firstRun) {
					$('#panel-0').attr('aria-hidden', 'true');
				}
			}
		}, {
			key: 'show',
			value: function show($tab) {
				this.hideAll();
				this.getPanelFromTab($tab).attr('aria-hidden', 'false');
				$tab.attr({
					'aria-expanded': 'true',
					'aria-selected': 'true',
					'tabindex': '0'
				}).focus();

				this.showPresentation($tab.attr('data-figure'));
			}
		}, {
			key: 'getNextTab',
			value: function getNextTab($tab) {

				var $next = $tab.next();
				if ($next.length === 0) {
					return this.getFirstTab();
				} else {
					return $next;
				}
			}
		}, {
			key: 'getPreviousTab',
			value: function getPreviousTab($tab) {
				var $prev = $tab.prev();
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
			key: 'onTabKeyDown',
			value: function onTabKeyDown(e) {
				console.log('keydown.ali');
			}
		}, {
			key: 'onTabClick',
			value: function onTabClick(e) {
				var $target = $(e.target);
				if ($target.attr('aria-expanded') !== 'true') {
					this.hideAll();
					this.show($target);
				}
			}
		}, {
			key: '_makeID',
			value: function _makeID($el) {
				var str = $el.text().replace(/[\W_]+/g, "").toLowerCase();
				if (str.length > 10) {
					str = str.substring(0, 10);
				}
				return str;
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
	}();

	$.fn.accordion = Accordion._jQuery;
	$.fn.accordion.Constructor = Accordion;
	$.fn.accordion.noConflict = function () {
		$.fn['accordion'] = $.fn['accordion'];
		return Accordion._jQueryInterface;
	};

	return Accordion;
}(jQuery);
