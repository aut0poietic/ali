/*
 * --------------------------------------------------------------------------
 * Ali: interaction.es6
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * aliInteraction
 * The parent class for all interactions.
 */
class aliInteraction {
	/**
	 *
	 * @param element
	 * @param type
	 */
	constructor( element, type = ali.TYPE.other, description = 'Ali Interaction' ) {
		this.$el = $( element );
		let d = new Date();
		this._data = {
			'id'                : this.$el.attr( 'id' ),
			'start'             : d.getTime(),
			'type'              : type,
			'correct_responses' : [],
			'learner_response'  : [],
			'result'            : ali.STATUS.incomplete,
			'latency'           : 0,
			'description'       : description
		};
	}

	/**
	 * Event data object for the interaction.
	 * @returns {{id: string, start: number, type: string, correct_responses: Array, learner_response: Array, result: string, latency: number, description: string}|*}
	 */
	get data() {
		return this._data;
	}

	/**
	 * Utility function that creates an ID using the the ID of the passed element or the text of the passed element.
	 * @param $el Element used to define the ID.
	 * @returns {string} Target ID for use with `aria-controls`
	 */
	makeTargetID( $el ) {
		let str = $el.attr( 'id' );
		if ( str === undefined ) {
			str = $el.text().replace( /[\W_]+/g, "" ).toLowerCase();
			if ( str.length > 10 ) {
				str = str.substring( 0, 10 );
			}
		} else {
			str += '-target';
		}
		return str;
	}

	/**
	 * Forces a method to be called later, just before the next UI update.
	 * @param callback
	 */
	defer( callback ) {
		var func = function () {
			callback.apply( this );
		};
		requestAnimationFrame( func.bind( this ) );
	};

	/**
	 * Allows interactions to set their learner responses for this interaction.
	 * @param responses : array An array of responses specific to the interaction
	 */
	set learnerResponses( responses ) {
		if ( $.getType( responses ) === 'array' ) {
			this.data.learner_response = responses;
		}
	}

	/**
	 * Allows interactions to set their correct responses for this interaction.
	 * @param responses : array An array of responses specific to the interaction
	 */
	set correctResponses( responses ) {
		if ( $.getType( responses ) === 'array' ) {
			this.data.correct_responses = responses;
		}
	}

	/**
	 * Complete event. Fired when all unique user actions have been performed for this interaction.
	 * This could be once all items have been viewed, or when the question or questions have been judged.
	 * @param status : string From the ali.STATUS constant; Should indicate the status of the interaction, including
	 * correct or incorrect, if appropriate.
	 */
	complete( status = 'complete' ) {
		let d = new Date();
		this.data.result = status;
		this.data.latency = d.getTime() - this.data.start;
		let e = new jQuery.Event( 'ali:complete' );
		this.$el.trigger( e, [ this.data ] );
	}
}

