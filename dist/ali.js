/*!
 * Ali - Accessible Learning Interactions
 * https://github.com/aut0poietic/ali
 */
"use strict";
;'use strict';

/**
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
 *
 * @todo Extend behavior to allow for near-automatic component creation such as:
 * $('li.tab').not(':first').aria.init('tab') ;
 * $('li.tab:first').aria.init('tab', {'selected' : true, 'expanded' : 'true', 'tabindex' : 0 }
 */

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
				this.aria(i, prop[i]);
			}
		} else if (undefined !== prop && undefined !== value) {
			this.each(function () {
				if (_isValidAria(prop)) {
					var $el = $(this);
					var attr = _addARIA(prop);
					$el.attr(attr, value);
				}
			});
		}
		return this;
	};
}(jQuery);
