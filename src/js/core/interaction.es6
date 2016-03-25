/*
 * --------------------------------------------------------------------------
 * Ali: interaction.es6
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 * aliInteraction
 * The parent class for all interactions.
 */

class aliInteraction {

    constructor(element, type) {
        this.$el = $(element);
        let d = new Date();
        this._data = {
            'id' : this.$el.attr('id'),
            'start' : d.getTime(),
            'type' : type,
            'correct_responses' : [],
            'learner_response' : [],
            'result' : null,
            'latency' : 0,
            'description' : 'Ali Interaction'
        };
    }

    setDescription(description) {
        this._data.description = description;
    }

    ///TODO: We'll have to do this once all the interactions are built.
    ///TODO: I don't have a clear idea of what all this will need to encompass.
    setResponses(responses) {

    }

    ///TODO: We'll have to do this once all the interactions are built.
    ///TODO: I don't have a clear idea of what all this will need to encompass.
    setCorrectResponses(responses) {

    }

    ready() {

    }

    selectionChanged($item) {

    }

    itemComplete($item, status = 'complete') {

    }

    complete(status = 'complete') {

    }
}

