(function ( $ ) {
	"use strict";

	// Make the global object available and abort if this file is used without it.
	var ali = window.ali;
	if( $.type( ali ) !== 'object'){
		return ;
	}

	/**
	 *  The parent class for all interactions.
	 * @param element : DOMElement
	 * @param type : string
	 * @param description : string
	 * @constructor
	 */
	ali.Interaction = function ( element, type, description ) {
		this.$el = $( element );
		if ( 'string' === $.type( type ) ) {
			this.data.type = type;
		}
		if ( 'string' === $.type( description ) ) {
			this.data.description = description;
		}
	};

	/**
	 * Event data sent with each event.
	 * @type {{id: string, start: number, type: string, correct_responses: Array, learner_response: Array, result: string, latency: number, description: string}}
	 */
	ali.Interaction.prototype.data = {
		'id'                : '',
		'start'             : 0,
		'type'              : ali.TYPE.other,
		'correct_responses' : [],
		'learner_response'  : [],
		'result'            : ali.STATUS.incomplete,
		'latency'           : 0,
		'description'       : 'Ali Interaction'
	};

	/**
	 *
	 * @type {number}
	 * @private
	 */
	ali.Interaction.prototype.__last = 0;

	/**
	 * Utility function that creates an ID using the the ID of the passed element or the text of the passed element.
	 * @param $el Element used to define the ID.
	 * @returns {string} Target ID for use with `aria-controls`
	 */
	ali.Interaction.prototype.makeTargetID = function ( $el ) {
		var str = $el.attr( 'id' );
		if ( str === undefined ) {
			str = $el.text().replace( /[\W_]+/g, "" ).toLowerCase();
			if ( str.length > 10 ) {
				str = str.substring( 0, 10 );
			}
		} else {
			str += '-target';
		}
		return str;
	};

	/**
	 * Allows a method to be called later, just before the next UI paint.
	 * @param callback
	 */
	ali.Interaction.prototype.defer = function ( callback ) {
		var func = function () {
			callback.apply( this );
		};
		requestAnimationFrame( func.bind( this ) );
	};

	/**
	 * Allows interactions to set their learner responses for this interaction.
	 * @param responses : array An array of responses specific to the interaction
	 */
	ali.Interaction.prototype.setLearnerResponses = function ( responses ) {
		if ( 'array' === $.type( responses ) ) {
			this.data.learner_response = responses;
		}
	};

	/**
	 * Allows interactions to set their correct responses for this interaction.
	 * @param responses : array An array of responses specific to the interaction
	 */
	ali.Interaction.prototype.setCorrectResponses = function ( responses ) {
		if ( 'array' === $.type( responses ) ) {
			this.data.correct_responses = responses;
		}
	};

	/**
	 * Complete event. Fired when all unique user actions have been performed for this interaction.
	 * This could be once all items have been viewed, or when the question or questions have been judged.
	 * @param status : string From the ali.STATUS constant; Should indicate the status of the interaction, including
	 * correct or incorrect, if appropriate.
	 */
	ali.Interaction.prototype.complete = function ( status ) {
		var e, d = new Date();
		if ( 'undefined' === $.type( status ) || '' === status.trim() ) {
			status = 'complete';
		}
		this.data.result = status;
		this.data.latency = d.getTime() - this.data.start;
		e = new jQuery.Event( 'ali:complete' );
		this.$el.trigger( e, [ this.data ] );
	};

	/**
	 * Event trigger method to indicate that an item has been selected.
	 * @param $item : jQuery object for the element selected.
	 */
	ali.Interaction.prototype.itemSelected = function ( $item ) {
		var e = new jQuery.Event( 'ali:itemSelected' );
		this.$el.trigger( e, [ this.data, $item ] );
	};

	/**
	 * Event trigger method to indicate that an item has been completed.
	 * @param status : string From the ali.STATUS constant; Should indicate the status of the interaction, including
	 * correct or incorrect, if appropriate.
	 * @param $item : jQuery object for the element selected.
	 */
	ali.Interaction.prototype.itemComplete = function ( status, $item ) {
		if ( 'undefined' === $.type( status ) || '' === status.trim() ) {
			status = ali.STATUS.complete;
		}
		if ( 'undefined' === $.type( $item ) || 0 === $item.length ) {
			$item = this.$el;
		}
		var clonedData = Object.assign( {}, this.data );
		var d = new Date();
		var e = new jQuery.Event( 'ali:itemComplete' );
		clonedData.result = status;
		clonedData.latency = d.getTime() - this.__last;
		this.__last = d.getTime();
		this.$el.trigger( e, [ clonedData, $item ] );
	};

})( jQuery );