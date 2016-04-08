/*
 * --------------------------------------------------------------------------
 * Ali: tab-control.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ($) {
    "use strict";

    // Make the global object available and abort if this file is used without it.
    var ali = window.ali;
    if ($.type(ali) !== 'object') {
        return;
    }

    var DESCRIPTION = 'Sequenced elements interaction.';
    var TYPE = ali.TYPE.sequencing;

    /**
     * Tab Control Interaction
     * @param element DOMElement
     * @constructor
     */
    ali.OrderedItems = function (element) {
        ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        this.init();
    };

    // Inherits from ali.Interaction
    ali.OrderedItems.prototype = Object.create(ali.Interaction.prototype);
    ali.OrderedItems.prototype.constructor = ali.OrderedItems;

    ali.OrderedItems.prototype.$items = [];
    /**
     * Initializes the Interaction. Called from constructor.
     */
    ali.OrderedItems.prototype.init = function () {

    };

    

    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.OrderedItems(this);
        });
    }

    var old = $.fn.ordereditems;
    $.fn.ordereditems = Plugin;
    $.fn.ordereditems.Constructor = ali.OrderedItems;

    $.fn.ordereditems.noConflict = function () {
        $.fn.ordereditems = old;
        return this;
    };
})(jQuery);