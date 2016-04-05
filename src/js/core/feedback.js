/*
 * --------------------------------------------------------------------------
 * Ali: feedback.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function ($) {
    "use strict";

    /**
     * Template local
     */
    var _t = window.htmlTemplates;


    Mustache.parse(_t.feedback);
    Mustache.parse(_t.feedbackContainer);

    var FEEDBACK_CONTENT = '.feedback-content';

    /**
     * Reusable Dialog object
     * @type {{_instance: jQuery, show: ali.Dialog.show, hide: ali.Dialog.hide}}
     */
    window.ali.Feedback = {
        _count : 0,

        /**
         * Initializes an interaction,  adding an element with the role "status" and
         * aria-live so that it is read for assistive technology.
         * @param $control
         */
        initInteraction : function ($control) {
            if ($control.length > 0) {
                $control.append(_t.feedbackContainer);
            }
        },

        /**
         * Returns a jQuery set of any feedback content elements.
         * @param $el {jQuery} An interaction
         * @returns {jQuery} a set of jQuery feedback elements.
         */
        getFeedbackElements : function ($el) {
            return $(FEEDBACK_CONTENT, $el);
        },

        /**
         * Returns true if the interaction contains an feedback element
         * @param $el
         * @returns {boolean}
         */
        hasFeedback : function ($el) {
            return this.getFeedbackElements($el).length > 0;
        },

        /**
         * Returns a feedback content element for this interaction with the given className, if available.
         * @param $el an interaction
         * @param className a className
         * @returns {jQuery}
         */
        getFeedbackContent : function ($el, className) {
            var $content = this.getFeedbackElements($el);
            if (className === undefined || $content.length === 1) {
                return $($content[0]);
            } else {
                for( var i = 0; i < $content.length; i++){
                    var $fc = $( $content.get(i));
                    if ($fc.is(className)) {
                        return $fc;
                    }
                }
            }
        },

        /**
         * Finds and displays the appropriate feedback
         * @param $el
         * @param className
         * @returns {boolean}
         */
        showFeedback : function ($el, className) {
            if (this.hasFeedback($el)) {
                var $content = this.getFeedbackContent($el, className);

                if ($content.length > 0) {
                    this.show($content, $el);
                    return true;
                }
            }
            return false;
        },

        /**
         * Displays the feedback
         * @param $content
         * @param $el
         */
        show : function ($content, $el) {
            var $instance = $(Mustache.render(_t.feedback, { count : ++this._count, content : $content.html() }));
            var cl = $content[0].classList;
            for (var i = 0; i < cl.length; i++) {
                if (cl.item(i).indexOf('feedback') < 0) {
                    $instance.addClass(cl.item(i));
                }
            }
            $('[role="status"]', $el).append($instance);
            this.scrollToAndFocus($instance);
        },

        /**
         * Animates scrolling the browser window to the feedback element and sets the
         * focus on the element once in position.
         * @param $el
         */
        scrollToAndFocus : function ($el) {
            $('html,body').animate(
                {
                    scrollTop : $el.offset().top
                },
                {
                    duration : 1000,
                    easing : '',
                    complete : function () {
                        $el.trigger('focus');
                    }
                }
            );
        }
    };

})(jQuery);