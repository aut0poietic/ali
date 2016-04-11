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

    ali.OrderedItems.prototype.$currentItem = undefined;
    ali.OrderedItems.prototype.$items = undefined;
    ali.OrderedItems.prototype.$selects = undefined;
    ali.OrderedItems.prototype._resizing = false;


    /**
     * Initializes the Interaction. Called from constructor.
     */
    ali.OrderedItems.prototype.init = function () {
        this.$items = $('li', this.el);
        this.$selects = $('select', this.el);
        this.$el.off('submit.ali').on('submit.ali', this.form_onSubmit.bind(this));
        $(window).on('resize', this.requestHeightUpdate.bind(this));
        this.updateHeight();
        this.updateClasses();
    };

    ali.OrderedItems.prototype.requestHeightUpdate = function () {
        if (!this._resizing) {
            this._resizing = true;
            window.requestAnimationFrame(this.updateHeight.bind(this));
        }
    };

    ali.OrderedItems.prototype.updateHeight = function () {
        var h = 0;
        this.$items.each(function (i, el) {
            h = Math.max(h, $('label', el).outerHeight());
        });
        this.$items.height(h);
        $('.list-elements', this.$el).height((h * 1.2 * this.$items.length) + 24);
        this._resizing = false;
    };

    ali.OrderedItems.prototype.addSelectEvents = function () {
        this.$selects
            .off('change.ali').on('change.ali', this.select_onChange.bind(this))
            .off('focus.ali').on('focus.ali', this.select_onFocus.bind(this));
    };

    ali.OrderedItems.prototype.removeSelectEvents = function () {
        this.$selects.off('change.ali').off('focus.ali');
    };

    ali.OrderedItems.prototype.form_onSubmit = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };

    ali.OrderedItems.prototype.select_onChange = function (e) {
        this.removeSelectEvents();
        this.$currentItem = $(e.target);
        window.requestAnimationFrame(this.reorderValues.bind(this));
    };

    ali.OrderedItems.prototype.select_onFocus = function (e) {
        $(e.target).attr('data-prev-value', e.target.selectedIndex);
    };


    ali.OrderedItems.prototype.reorderValues = function (e) {
        var newValue = this.$currentItem[0].selectedIndex;
        var previousValue = this.previousValue(this.$currentItem);

        // Remove this item from the order
        this.$selects.each((function (i, el) {
            var $el = $(el);
            if (!$el.is(this.$currentItem)) {
                var localVal = $el[0].selectedIndex;
                if (localVal >= previousValue) {
                    $el[0].selectedIndex = localVal - 1;
                }
            }
        }).bind(this));

        // Insert the changed element at it's new location,
        // moving the others up.
        this.$selects.each((function (i, el) {
            var $el = $(el);
            if (!$el.is(this.$currentItem)) {
                var localVal = $el[0].selectedIndex;
                if (localVal >= newValue) {
                    $el[0].selectedIndex = localVal + 1;
                }
            }
        }).bind(this));
        window.requestAnimationFrame(this.updateClasses.bind(this));
    };

    ali.OrderedItems.prototype.updateClasses = function () {
        this.$items.each(function (i, el) {
            var $el = $(el);
            var $select = $('select', $el);
            $el.attr('class', '').addClass('item-' + $select.val());
        });
        this.addSelectEvents();
    };

    ali.OrderedItems.prototype.previousValue = function ($el) {
        return parseInt($el.attr('data-prev-value'), 10);
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
})
(jQuery);