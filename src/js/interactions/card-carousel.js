/*
 * --------------------------------------------------------------------------
 * Ali: card.js
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

    var DESCRIPTION = 'A collection of question/scenario - result sets.';
    var TYPE = ali.TYPE.other;

    /**
     * Card Carousel container element
     * @param element
     * @constructor
     */
    ali.CardCarousel = function (element) {
        ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        this.$el = $(element);
        this.init();
    };

    // Inherits from ali.Interaction for timing and complete event
    ali.CardCarousel.prototype = Object.create(ali.Interaction.prototype);
    ali.CardCarousel.prototype.constructor = ali.CardCarousel;

    /**
     * The index of the active element
     * @type {number}
     */
    ali.CardCarousel.prototype.activeElement = 0;

    /**
     * Initializes the carousel
     */
    ali.CardCarousel.prototype.init = function () {
        // ensure cards are wrapped in the card-wrapper class
        // Manually wrapping them in the HTML avoids jank, but this statement allowing for lazy.
        if ($('.card:first', this.$el).parents('.card-wrapper').length === 0) {
            $('.card', this.$el).wrap('<div class="card-wrapper"></div>');
        }
        // Cards *should* have a uniform height, but on the off-chance someone modifies this
        // find the max-height of all cards and apply that height to the parent element.
        var maxHeight = Math.max.apply(
            null,
            $('.card', this.$el).map(function () {
                return $(this).outerHeight(true);
            }).get()
        );
        this.$el.height(maxHeight);
        this.updateClasses();

        // Carousels don't have their own navigation elements and instead
        // binds two additional buttons on the cards themselves
        $('.show-next', this.$el).off('click.ali').on('click.ali', this.onShowNext.bind(this));
        $('.show-first', this.$el).off('click.ali').on('click.ali', this.onShowFirst.bind(this));
    };


    /**
     * Event Handler for the 'show-next' buttons. Additionally fires the complete event when all cards are viewed.
     * @param e
     */
    ali.CardCarousel.prototype.onShowNext = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.activeElement++;
        this.updateClasses();

        // activeElement is 0 indexed
        if (this.activeElement === $('.card', this.$el).length - 1) {
            this.complete(ali.STATUS.complete);
        }

        setTimeout(this.focusNextCard.bind(this), 600);
    };

    ali.CardCarousel.prototype.focusNextCard = function () {
        $('.card-wrapper[aria-hidden="false"] .card', this.$el).focus();
    };

    /**
     * Event handler for the 'show-first' button. Additionally, resets all cards.
     * @param e
     */
    ali.CardCarousel.prototype.onShowFirst = function (e) {
        e.preventDefault();
        e.stopPropagation();

        this.activeElement = 0;
        this.updateClasses();
        $('.card', this.$el).card('showFront');
        //0.8.5 patch
        setTimeout((function () {$('.card:first', this.$el).focus();}).bind(this), 300);
    };

    /**
     * Updates the classes for all cards based on the active element
     * Classes are:
     * - .before: is before the active card
     * - .after:  after the active card
     * - .hinted: card is adjacent to the active card -- can be used to allow the card to "peek" on the left/right
     *            edge of the screen, if the styles are applied.
     */
    ali.CardCarousel.prototype.updateClasses = function () {
        // Note: this method builds a string then applies it in one step
        // rather than adding/removing classes individually because I noticed
        // some jank using the individual add/remove method.
        var classString;
        $('.card-wrapper', this.$el).each((function (i, el) {
            classString = 'card-wrapper ';
            if (i !== this.activeElement) {
                if (i < this.activeElement) {
                    classString += "before ";
                    if (i === this.activeElement - 1) {
                        classString += "hinted ";
                    }
                } else {
                    classString += "after ";
                    if (i === this.activeElement + 1) {
                        classString += "hinted ";
                    }
                }
            }
            $(el).attr('class', classString)
                .aria('hidden', i === this.activeElement ? 'false' : 'true');
        }).bind(this));
    };


    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.CardCarousel(this);
        });
    }

    var old = $.fn.cardcarousel;
    $.fn.cardcarousel = Plugin;
    $.fn.cardcarousel.Constructor = ali.CardCarousel;

    $.fn.cardcarousel.noConflict = function () {
        $.fn.cardcarousel = old;
        return this;
    };

})(jQuery);