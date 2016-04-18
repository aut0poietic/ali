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

    var DESCRIPTION = 'A multiple choice interaction.';
    var TYPE = ali.TYPE.choice;

    ali.Card = function (element) {
        this.$el = $(element);
        if ($('.card-front select', this.$el).length > 0) {
            ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        }

        // initialize the turn-to-back functionality
        $('.show-back', this.$el)
            .aria('controls', this.$el.attr('id'))
            .off('click.ali').on('click.ali', this.showBack.bind(this));

        // initialize the turn-to-front functionality
        $('.show-front', this.$el)
            .aria('controls', this.$el.attr('id'))
            .off('click.ali').on('click.ali', this.showFront.bind(this));

        $('.evaluate-card', this.$el)
            .aria('controls', this.$el.attr('id'))
            .off('click.ali').on('click.ali', this.evaluate.bind(this));

        this.showFront();
    };

    // Inherits from ali.Interaction
    ali.Card.prototype = Object.create(ali.Interaction.prototype);
    ali.Card.prototype.constructor = ali.Card;


    ali.Card.prototype.showBack = function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.card-back', this.$el).aria('hidden', 'false');
        $('.card-front', this.$el).aria('hidden', 'true');
    };

    ali.Card.prototype.showFront = function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        $('.card-back', this.$el).aria('hidden', 'true');
        $('.card-front', this.$el).aria('hidden', 'false');
    };

    ali.Card.prototype.evaluate = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $select = $('.card-front select', this.$el);
        var selected = parseInt($select[0].selectedIndex, 10);
        var correct = parseInt($select.attr('data-ali-correct'), 10) - 1;
        var is_correct = selected == correct;

        this.$el.removeClass('correct incorrect').addClass(is_correct ? 'correct' : 'incorrect');

        this.setCorrectResponses([$select.val()]);
        this.setLearnerResponses([$('option:selected', $select).val()]);
        this.complete(is_correct ? ali.STATUS.correct : ali.STATUS.incorrect);
        $('.card-back', this.$el).aria('hidden', 'false');
        $('.card-front', this.$el).aria('hidden', 'true');
    };
    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.Card(this);
        });
    }

    var old = $.fn.card;
    $.fn.card = Plugin;
    $.fn.card.Constructor = ali.Card;

    $.fn.card.noConflict = function () {
        $.fn.card = old;
        return this;
    };

})(jQuery);