/*
 * --------------------------------------------------------------------------
 * Ali: ordered-items.js
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

    var TRANSITION_DURATION = 400;

    /**
     * Ordered Items interaction class
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


    /**
     * Collection of items ( usually 'li' elements ).
     * @type {undefined}
     */
    ali.OrderedItems.prototype.$items = undefined;

    /**
     * Collection of items ( usually 'select' elements ).
     * @type {undefined}
     */
    ali.OrderedItems.prototype.$selects = undefined;

    /**
     * Flag used in rAF to debounce
     * @type {boolean}
     * @private
     */
    ali.OrderedItems.prototype._resizing = false;

    /**
     * Container for the currently moving item
     * Required as some rAF uses lose their locals
     * @type {jQuery}
     */
    ali.OrderedItems.prototype.$currentItem = undefined;

    /**
     * Initializes the Interaction. Called from constructor.
     */
    ali.OrderedItems.prototype.init = function () {
        this.$items = $('.list-elements li', this.$el);
        this.createElements();

        this.$selects = $('select', this.el);
        this.$el.off('submit.ali').on('submit.ali', this.form_onSubmit.bind(this));
        $(window).on('resize', this.window_onResize.bind(this));
        this.updateHeight();
        this.updateClasses();
    };

    /**
     * Adds the select dropdown and icon base HTML for each list item.
     */
    ali.OrderedItems.prototype.createElements = function () {
        var num = this.$items.length;
        // only create the select drop-down once
        var $sel = $('<select></select>');
        for (var i = 1; i <= num; i++) {
            $sel.append('<option>' + i + '</option>');
        }

        this.$items.each((function (index, el) {
            var $el = $(el);
            var id = this.$el.attr('id') + "-item-" + index;

            // clone the drop-down and attach the generated ID and index
            var $selInstance = $sel.clone();
            $selInstance.attr('id', id);
            $selInstance[0].selectedIndex = index;

            // Add the select and icon to the current element
            var $sl = $('<span class="item-select"></span>').append($selInstance);
            $el.append($sl).prepend('<i>' + (index + 1) + '</i>');

            // link user-created label to the code-created select drop-down
            $('label', $el).attr('for', id);
        }).bind(this));
    };

    /**
     * Event Handler for the resize event. Handler de-bounces the events
     * using rAF and a _resizing flag.
     * @see updateHeight
     */
    ali.OrderedItems.prototype.window_onResize = function () {
        if (!this._resizing) {
            this._resizing = true;
            window.requestAnimationFrame(this.updateHeight.bind(this));
        }
    };

    /**
     *  Equalizes the height of all items and updates the height of the list element itself
     *  Only called by rAF and on init
     */
    ali.OrderedItems.prototype.updateHeight = function () {
        // Equalize the elements height based on the height of the label with padding
        var h = 0;
        this.$items.each(function (i, el) {
            h = Math.max(h, $('label', el).outerHeight());
        });
        this.$items.height(h);

        //UPDATED: IE10 can't use calc with translate, so we
        // figure height by the outerHeight * 124%,
        // the 24% being the margin used in the CSS file.
        var oH = $(this.$items[0]).outerHeight();
        $('.list-elements', this.$el).height(( oH * this.$items.length * 1.24));

        // reset the flag
        this._resizing = false;
    };

    /**
     * Adds the focus and change events to the select drop-downs
     */
    ali.OrderedItems.prototype.addSelectEvents = function () {
        this.$selects
            .off('change.ali').on('change.ali', this.select_onChange.bind(this))
            .off('focus.ali').on('focus.ali', this.select_onFocus.bind(this));
    };

    /**
     * Removes the focus and change events from the select drop-downs so we can
     * manipulate them without generating too events
     */
    ali.OrderedItems.prototype.removeSelectEvents = function () {
        this.$selects.off('change.ali').off('focus.ali');
    };

    /**
     * Very simple event handler that assigns a data value to the
     * element containing the current value.
     * @param e {Event}
     */
    ali.OrderedItems.prototype.select_onFocus = function (e) {
        $(e.target).attr('data-prev-value', e.target.selectedIndex);
    };

    /**
     * Event handler for the change event
     * @param e
     */
    ali.OrderedItems.prototype.select_onChange = function (e) {
        // remove the events on the drop-downs so we don't create
        // pointless events while manipulating the selects
        this.removeSelectEvents();
        this.$currentItem = $(e.target);

        // add the 'moving' class to the current item
        // in the base style this adds the shadow and a z-index
        $(this.$currentItem.parents('li'))
            .addClass('moving')
            // Remove the class on transition end
            // Much love to the Bootstrap crew for the
            // emulation pattern
            .one(ali.transitionEnd, function (e) {
                $(e.target).removeClass('moving');
            })
            .emulateTransitionEnd(TRANSITION_DURATION);

        this.itemSelected(this.$currentItem);
        // reordering is a little time-consuming so defer it
        // until before the next paint
        window.requestAnimationFrame(this.reorderValues.bind(this));
    };

    /**
     *
     * @param e
     */
    ali.OrderedItems.prototype.form_onSubmit = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var correct = true;
        var selectedOrder = [];
        var correctOrder = [];

        this.$items.each(function () {
            var $el = $(this);
            var $sel = $('select', $el);
            // get the correct and selected index
            var cIndex = parseInt($el.attr('data-correct'), 10);
            var sIndex = parseInt($sel[0].selectedIndex + 1);

            //create SCORM/xAPI arrays for correct & selected
            var label = $('label', $el).text();
            selectedOrder[sIndex] = label;
            correctOrder[cIndex] = label;

            // If one step is out of order, this was answered incorrectly.
            if (cIndex !== sIndex) {
                correct = false;
            }
        });

        this.setCorrectResponses(correctOrder);
        this.setLearnerResponses(selectedOrder);

        //Added in 0.8.3 - disable form on submit
        this.$el.off('submit.ali').on('submit.ali', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        $('button').aria('disabled', 'true');

        this.complete(correct ? ali.STATUS.correct : ali.STATUS.incorrect);


    };

    /**
     * Re-orders the elements based off of the current select element.
     * @todo There has to be a less complex way of handling this -- future
     */
    ali.OrderedItems.prototype.reorderValues = function () {
        var newValue = this.$currentItem[0].selectedIndex;
        var previousValue = this.previousValue(this.$currentItem);

        // Remove this item from the order
        // moving the others up
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
        // moving the others down.
        this.$selects.each((function (i, el) {
            var $el = $(el);
            if (!$el.is(this.$currentItem)) {
                var localVal = $el[0].selectedIndex;
                if (localVal >= newValue) {
                    $el[0].selectedIndex = localVal + 1;
                }
            }
        }).bind(this));
        // Altering the UI should wait until the next paint
        window.requestAnimationFrame(this.updateClasses.bind(this));
    };

    /**
     * Adds classes to the list elements, causing the elements to animate into
     * their new position.
     */
    ali.OrderedItems.prototype.updateClasses = function () {
        this.$items.each(function (i, el) {
            var $el = $(el);
            var $select = $('select', $el);
            $el.removeClass(function (index, css) {
                return (css.match(/(^|\s)item-\S+/g) || []).join(' ');
            }).addClass('item-' + $select.val());
            $('i', $el).text($select.val());
        });

        // add the events back
        this.addSelectEvents();

        if (this.$currentItem && this.$currentItem.length > 0) {
            // trigger the focus event on the current item so that the
            // current value is populated
            this.$currentItem.trigger('focus');
        }
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