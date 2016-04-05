(function ($) {
    "use strict";

    // Make the global object available and abort if this file is used without it.
    var ali = window.ali;
    if ($.type(ali) !== 'object') {
        return;
    }

    var DESCRIPTION = 'A multiple choice interaction.';
    var TYPE = ali.TYPE.choice;

    /**
     * Answer Set Interaction
     * @param element DOMElement
     * @constructor
     */
    ali.MultipleChoice = function (element) {
        ali.Interaction.call(this, element, TYPE, DESCRIPTION);
        this.init();
    };

    // Inherits from ali.Interaction
    ali.MultipleChoice.prototype = Object.create(ali.Interaction.prototype);
    ali.MultipleChoice.prototype.constructor = ali.Accordion;

    /**
     * Initialization.
     */
    ali.MultipleChoice.prototype.init = function () {
        if (ali.Feedback.hasFeedback(this.$el)) {
            ali.Feedback.initInteraction(this.$el);
        }
        this.$el.off('submit.ali').on('submit.ali', this.form_onSubmit.bind(this));
        $('input', this.$el).off('change.ali').on('change.ali', this.input_onChange.bind(this));
    };

    /**
     *
     * @param e
     */
    ali.MultipleChoice.prototype.input_onChange = function (e) {
        this.itemSelected($(e.target));
    };

    /**
     * Submit Event Handler
     * @param e
     */
    ali.MultipleChoice.prototype.form_onSubmit = function (e) {
        e.preventDefault();
        e.stopPropagation();

        var result, className, answeredCorrect = true;
        var $inputs = $('input', this.$el);

        for (var i = 0; i < $inputs.length; i++) {
            var t = $($inputs[i]);
            if (this.truthy(t.attr("data-correct")) !== this.truthy(t.is(':checked'))) {
                answeredCorrect = false;
                break;
            }
        }

        result = answeredCorrect ? ali.STATUS.correct : ali.STATUS.incorrect;
        className = answeredCorrect ? '.correct' : '.incorrect';
        if (!ali.Dialog.showDialog(this.$el, className) && !ali.Feedback.showFeedback(this.$el, className)) {
            this.showMessage(
                $('.submit-row', this.$el),
                answeredCorrect ? 'Correct' : 'Incorrect',
                className.substr(1));
        }

        this.setResultData();
        this.complete(result);
        this.disableInteraction();
    };

    ali.MultipleChoice.prototype.disableInteraction = function () {
        $('input', this.$el).off('change.ali').aria('disabled', "true");
        $('button', this.$el).aria('disabled', "true");
        this.$el.off('submit.ali').aria('disabled', 'true');
    };
    /**
     * Sets the responses for complete events.
     */
    ali.MultipleChoice.prototype.setResultData = function () {
        var cr = [], ur = [];
        $('input[data-correct="true"]', this.$el).each((function (i, el) {
            cr.push(this.getResponseValue($(el)));
        }).bind(this));

        $('input:checked', this.$el).each((function (i, el) {
            ur.push(this.getResponseValue($(el)));
        }).bind(this));
        this.setCorrectResponses(cr);
        this.setLearnerResponses(ur);
    };

    /**
     * Returns the value of an option using the label's `for` value.
     * @param $input
     * @returns {XMLList|*}
     */
    ali.MultipleChoice.prototype.getResponseValue = function ($input) {
        var id = $input.attr('id');
        return $('label[for="' + id + '"]').text();
    };

    /*
     * jQuery Plugin
     */
    function Plugin() {
        return this.each(function () {
            new ali.MultipleChoice(this);
        });
    }

    var old = $.fn.answerset;
    $.fn.multiplechoice = Plugin;
    $.fn.multiplechoice.Constructor = ali.MultipleChoice;

    $.fn.multiplechoice.noConflict = function () {
        $.fn.multiplechoice = old;
        return this;
    };

})(jQuery);