/*
 * --------------------------------------------------------------------------
 * Ali: transition.js
 * --------------------------------------------------------------------------
 * Adapted from: https://github.com/twbs/bootstrap/
 * Copyright 2011-2016 Twitter, Inc.
 * License: https://github.com/twbs/bootstrap/blob/master/LICENSE
 */

(function ($) {
    'use strict';

    // Check to see if Bootstrap has been installed --
    // no need to add this twice.
    if ($.type($.support.transition) !== 'undefined') {
        return;
    }

    // The remainder is pulled straight from twbs
    function transitionEnd() {
        var el = document.createElement('someelement');

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition : 'transitionend',
            OTransition : 'oTransitionEnd otransitionend',
            transition : 'transitionend'
        };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end : transEndEventNames[name] };
            }
        }
        return false;
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('aliTransitionEnd', function () { called = true; });
        var callback = function () {
            if (!called) {
                $($el).trigger($.support.transition.end);
            }
        };
        setTimeout(callback, duration);
        return this;
    };

    $(function () {
        $.support.transition = transitionEnd();

        if (!$.support.transition) {
            return;
        }

        $.event.special.aliTransitionEnd = {
            bindType : $.support.transition.end,
            delegateType : $.support.transition.end,
            handle : function (e) {
                if ($(e.target).is(this)) {
                    return e.handleObj.handler.apply(this, arguments);
                }
            }
        };
    });
})(jQuery);