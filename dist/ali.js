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
 * aliInteraction
 * The parent class for all interactions.
 */

var aliInteraction = function () {
    function aliInteraction(element, type) {
        _classCallCheck(this, aliInteraction);

        this.$el = $(element);
        var d = new Date();
        this._data = {
            'id': this.$el.attr('id'),
            'start': d.getTime(),
            'type': type,
            'correct_responses': [],
            'learner_response': [],
            'result': null,
            'latency': 0,
            'description': 'Ali Interaction'
        };
    }

    _createClass(aliInteraction, [{
        key: 'setDescription',
        value: function setDescription(description) {
            this._data.description = description;
        }

        ///TODO: We'll have to do this once all the interactions are built.
        ///TODO: I don't have a clear idea of what all this will need to encompass.

    }, {
        key: 'setResponses',
        value: function setResponses(responses) {}

        ///TODO: We'll have to do this once all the interactions are built.
        ///TODO: I don't have a clear idea of what all this will need to encompass.

    }, {
        key: 'setCorrectResponses',
        value: function setCorrectResponses(responses) {}
    }, {
        key: 'ready',
        value: function ready() {}
    }, {
        key: 'selectionChanged',
        value: function selectionChanged($item) {}
    }, {
        key: 'itemComplete',
        value: function itemComplete($item) {
            var status = arguments.length <= 1 || arguments[1] === undefined ? 'complete' : arguments[1];
        }
    }, {
        key: 'complete',
        value: function complete() {
            var status = arguments.length <= 0 || arguments[0] === undefined ? 'complete' : arguments[0];
        }
    }]);

    return aliInteraction;
}();
;'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var aliAccordion = function ($) {

    var TAB = '.accordion-tab';
    var OPEN_TAB = '.accordion-tab[aria-expanded="true"]';
    var PANEL = '.accordion-panel';

    var Accordion = function (_aliInteraction) {
        _inherits(Accordion, _aliInteraction);

        function Accordion(element) {
            _classCallCheck(this, Accordion);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Accordion).call(this, element));

            _this.$el.aria({
                'role': "tablist",
                'multiselectable': 'true'
            });

            _this.$tabs = $(TAB, _this.$el);
            var $openTabs = $(OPEN_TAB);
            _this.$tabs.each(function (i, el) {
                var $tab = $(el);
                var id = _this._makeID($tab);
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
            _this.ready();
            return _this;
        }

        _createClass(Accordion, [{
            key: 'getMeasuredHeight',
            value: function getMeasuredHeight($panel) {
                var $div = $('<div id="ali-temp" aria-hidden="true" style="overflow:hidden;height:1px;width:100%;visibility: hidden"></div>').appendTo(this.$el);
                var $tmp = $('<dd class="accordion-panel"></dd>').html($panel.html()).appendTo($div);
                var h = $tmp.height();
                $div.remove();
                return h;
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
                }).focus();
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
    }(aliInteraction);

    $.fn.accordion = Accordion._jQuery;
    $.fn.accordion.Constructor = Accordion;
    $.fn.accordion.noConflict = function () {
        $.fn['accordion'] = $.fn['accordion'];
        return Accordion._jQuery;
    };

    return Accordion;
}(jQuery);
