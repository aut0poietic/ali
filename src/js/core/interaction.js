'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * --------------------------------------------------------------------------
 * Ali: interaction.es6
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 * aliInteraction
 * The parent class for all interactions.
 */

var aliInteraction = function () {
    function aliInteraction(element, type) {
        _classCallCheck(this, aliInteraction);

        this.$el = $(element);
        var d = new Date();
        this._data = {
            'id': this.$el.attr('id'),
            'start': d.getTime(),
            'type': type,
            'correct_responses': [],
            'learner_response': [],
            'result': null,
            'latency': 0,
            'description': 'Ali Interaction'
        };
    }

    _createClass(aliInteraction, [{
        key: 'setDescription',
        value: function setDescription(description) {
            this._data.description = description;
        }

        ///TODO: We'll have to do this once all the interactions are built.
        ///TODO: I don't have a clear idea of what all this will need to encompass.

    }, {
        key: 'setResponses',
        value: function setResponses(responses) {}

        ///TODO: We'll have to do this once all the interactions are built.
        ///TODO: I don't have a clear idea of what all this will need to encompass.

    }, {
        key: 'setCorrectResponses',
        value: function setCorrectResponses(responses) {}
    }, {
        key: 'ready',
        value: function ready() {}
    }, {
        key: 'selectionChanged',
        value: function selectionChanged($item) {}
    }, {
        key: 'itemComplete',
        value: function itemComplete($item) {
            var status = arguments.length <= 1 || arguments[1] === undefined ? 'complete' : arguments[1];
        }
    }, {
        key: 'complete',
        value: function complete() {
            var status = arguments.length <= 0 || arguments[0] === undefined ? 'complete' : arguments[0];
        }
    }]);

    return aliInteraction;
}();
