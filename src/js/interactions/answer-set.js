/*
 * --------------------------------------------------------------------------
 * Ali: answer-set.js
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

	var DESCRIPTION = 'Answer Set multi-part interaction.';
	var TYPE = ali.TYPE.choice;

	var QUESTION = 'form';
	var SELECT = 'select';
	var SUBMIT = 'button';
	var CORRECT_ATTR = 'data-ali-correct';
	var CORRECT_RESPONSE = 'data-ali-correct-message';
	var INCORRECT_RESPONSE = 'data-ali-incorrect-message';

	/**
	 * Answer Set Interaction
	 * @param element DOMElement
	 * @constructor
	 */
	ali.AnswerSet = function ( element ) {
		ali.Interaction.call( this, element, TYPE, DESCRIPTION );
		this.init();
	};

	// Inherits from ali.Interaction
	ali.AnswerSet.prototype = Object.create( ali.Interaction.prototype );
	ali.AnswerSet.prototype.constructor = ali.Accordion;

	/**
	 * Initialization.
	 */
	ali.AnswerSet.prototype.init = function () {

		ali.Feedback.initInteraction( this.$el );

		$( QUESTION, this.$el ).each( (function ( i, el ) {
			$( el ).aria( {
				              'live'   : "assertive",
				              'atomic' : "true"
			              } )
			       .attr( 'id', this.$el.attr( 'id' ) + '-' + i )
			       .off( 'submit.ali' )
			       .on( 'submit.ali', this.question_onSubmit.bind( this ) );
		}).bind( this ) );

		$( QUESTION + ' ' + SELECT, this.$el )
			.off( 'change.ali' )
			.on( 'change.ali', (function ( e ) {
				var $form = $( $( e.target ).parents( QUESTION )[ 0 ] );
				this.itemSelected( $form );
			}).bind( this ) );
	};

	/**
	 * Event handler for form submit for each question.
	 * @param e
	 */
	ali.AnswerSet.prototype.question_onSubmit = function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		var $target = $( e.target );
		var is_correct = parseInt( $( SELECT, $target ).prop( 'selectedIndex' ) ) === parseInt( $target.attr( CORRECT_ATTR ), 10 );

		this.showFlag( $target, is_correct );
		this.disableQuestion( $target );
		this.itemComplete( is_correct ? ali.STATUS.correct : ali.STATUS.incorrect, $target );

		this.allQuestionsComplete();
	};

	/**
	 *
	 */
	ali.AnswerSet.prototype.allQuestionsComplete = function () {
		var num_questions = $( QUESTION ).length;
		var dialogQuery = '';
		var result;

		if ( num_questions === $( QUESTION + '[aria-disabled="true"]' ).length ) {
			if ( num_questions === $( QUESTION + ' .correct' ).length ) {
				result = ali.STATUS.correct;
				dialogQuery = '.feedback-content.correct';
			} else {
				result = ali.STATUS.incorrect;
				dialogQuery = '.feedback-content.incorrect';
			}
			var $dialogContent = $( dialogQuery, this.$el );
			if ( $dialogContent.length === 1 ) {
				ali.Feedback.show( $dialogContent, this.$el );
			}
			this.complete( result );
		}
	};

	/**
	 *
	 * @param $target
	 */
	ali.AnswerSet.prototype.disableQuestion = function ( $target ) {
		$target.aria( 'disabled', 'true' );
		$( SELECT + ',' + SUBMIT, $target ).aria( 'disabled', 'true' );
	};

	/**
	 *
	 * @param $target
	 * @param is_correct
	 */
	ali.AnswerSet.prototype.showFlag = function ( $target, is_correct ) {
		var $flag = this.makeFlag(
			is_correct ? $target.attr( CORRECT_RESPONSE ) : $target.attr( INCORRECT_RESPONSE ),
			is_correct ? 'correct' : 'incorrect' );

		$flag.aria( 'hidden', 'true' )
		     .appendTo( $target );

		setTimeout( (function () {
			$flag.aria( 'hidden', 'false' );
		}).bind( this ), 1 );
	};

	/**
	 *
	 * @param msg
	 * @param cls
	 */
	ali.AnswerSet.prototype.makeFlag = function ( msg, cls ) {
		return $( '<div class="flag ' + cls + '"><span>' + msg + '</span></div>' );
	};

	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.AnswerSet( this );
		} );
	}

	var old = $.fn.answerset;
	$.fn.answerset = Plugin;
	$.fn.answerset.Constructor = ali.AnswerSet;

	$.fn.answerset.noConflict = function () {
		$.fn.answerset = old;
		return this;
	};


})( jQuery );