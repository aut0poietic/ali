/*
 * --------------------------------------------------------------------------
 * Ali: thinking-question.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
(function ( $ ) {
	"use strict";

	// Make the global object available and abort if this file is used without it.
	var ali = window.ali;
	if ( $.type( ali ) !== 'object' ) {
		return;
	}

	var DESCRIPTION = 'Long-form text answer';
	var TYPE = ali.TYPE.longAnswer;

	/**
	 * Answer Set Interaction
	 * @param element DOMElement
	 * @constructor
	 */
	ali.ThinkingQuestion = function ( element ) {
		ali.Interaction.call( this, element, TYPE, DESCRIPTION );
		this.init();
	};

	// Inherits from ali.Interaction
	ali.ThinkingQuestion.prototype = Object.create( ali.Interaction.prototype );
	ali.ThinkingQuestion.prototype.constructor = ali.ThinkingQuestion;

	/**
	 * Initializes the control
	 */
	ali.ThinkingQuestion.prototype.init = function () {
		// add the submit event listener
		this.$el.off( 'submit.ali' ).on( 'submit.ali', this.form_onSubmit.bind( this ) );

		// fetch any previously entered text, using an empty string if fetching that information fails.
		var previous = '';
		try {
			previous = localStorage.getItem( this.$el.attr( 'id' ) );
		} catch ( error ) {
			previous = '';
		}
		// ensure that the textarea has a label element -- the question stem element works best.
		var ta_id = this.$el.attr( 'id' ) + '-textarea';
		$( 'textarea', this.$el ).val( previous ).aria( 'labeledby', ta_id );
		$( 'question', this.$el ).attr( 'id', ta_id );
	};

	/**
	 *
	 * @param e
	 * @returns {boolean}
	 */
	ali.ThinkingQuestion.prototype.form_onSubmit = function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		var response = $( 'textarea', this.$el ).val();
		if ( response.length > 0 ) {
			$( 'button, textarea', this.$el ).aria( 'disabled', 'true' );
			this.setLearnerResponses( [ response ] );
			this.complete( ali.STATUS.complete );
			try {
				window.localStorage.setItem( this.$el.attr( 'id' ), response );
			}
			catch ( error ) {
				return false;
			}
		}

	};


	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.ThinkingQuestion( this );
		} );
	}

	var old = $.fn.answerset;
	$.fn.thinkingquestion = Plugin;
	$.fn.thinkingquestion.Constructor = ali.ThinkingQuestion;

	$.fn.thinkingquestion.noConflict = function () {
		$.fn.thinkingquestion = old;
		return this;
	};

})( jQuery );