/*!
 * --------------------------------------------------------------------------
 * Ali - Accessible Learning Interactions (
 * Copyright 2016 Jer Brand / Irresponsible Art
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
window.ali = {
    EVENT : {
        ready : 'ali:ready',
        complete : 'ali:complete'
    },

    STATUS : {
        complete : 'complete',
        correct : 'correct',
        incorrect : 'incorrect',
        unanticipated : 'unanticipated',
        incomplete : 'incomplete'
    },

    TYPE : {
        choice : 'choice',
        performance : 'performance',
        sequencing : 'sequencing',
        numeric : 'numeric',
        shortAnswer : 'fill-in',
        longAnswer : 'long-fill-in',
        other : 'other'
    },
    Interaction : null,
    transitionEnd : 'bsTransitionEnd aliTransitionEnd'
};

jQuery(function ($) {
    "use strict";
    if (window.aliAutolInit !== false) {
        $('[data-ali="accordion"]').accordion();
        $('[data-ali="tab-control"]').tabcontrol();
        $('[data-ali="answer-set"]').answerset();
        $('[data-ali="multiple-choice"]').multiplechoice();
        $('[data-ali="ordered-items"]').ordereditems();
        $('[data-ali="thinking-question"]').thinkingquestion();
    }
});