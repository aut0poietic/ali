/*
 * --------------------------------------------------------------------------
 * Ali: thinking-question.js
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

    var DESCRIPTION = 'Long-form text answer';
    var TYPE = ali.TYPE.longAnswer;

    /**
     * Answer Set Interaction
     * @param element DOMElement
     * @constructor
     */
    ali.ThinkingQuestion = function (element) {
        ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        this.init();
    };

    // Inherits from ali.Interaction
    ali.ThinkingQuestion.prototype = Object.create(ali.Interaction.prototype);
    ali.ThinkingQuestion.prototype.constructor = ali.ThinkingQuestion;

    ali.ThinkingQuestion.prototype.init = function () {
        this.$el.off('submit.ali').on('submit.ali', this.form_onSubmit.bind(this));
        var previous = '';
        try {
            previous = localStorage.getItem(this.$el.attr('id'));
        } catch (error) {
            previous = '';
        }
        $('textarea', this.$el).val(previous);
    };

    ali.ThinkingQuestion.prototype.form_onSubmit = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if ($('textarea', this.$el).val().length > 0) {
            $('button, textarea').aria('disabled', 'true');
            this.complete(ali.STATUS.complete);

            try {
                window.localStorage.setItem(this.$el.attr('id'), $('textarea', this.$el).val());
            }
            catch (error) {
                return false;
            }
        }

    };


    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.ThinkingQuestion(this);
        });
    }

    var old = $.fn.answerset;
    $.fn.thinkingquestion = Plugin;
    $.fn.thinkingquestion.Constructor = ali.ThinkingQuestion;

    $.fn.thinkingquestion.noConflict = function () {
        $.fn.thinkingquestion = old;
        return this;
    };

})(jQuery);