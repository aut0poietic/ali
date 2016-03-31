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

	ali.AnswerSet.prototype.init = function () {
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
	 *
	 * @param e
	 */
	ali.AnswerSet.prototype.question_onSubmit = function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		var $target = $( e.target );
		var correctIndex = parseInt( $target.attr( CORRECT_ATTR ), 10 );
		var selectedIndex = parseInt( $( SELECT, $target ).prop( 'selectedIndex' ) );
		var $flag, result;

		if ( selectedIndex === correctIndex ) {
			$flag = this.makeFlag( $target.attr( CORRECT_RESPONSE ), 'correct' );
			result = ali.STATUS.correct;
		} else {
			$flag = this.makeFlag( $target.attr( INCORRECT_RESPONSE ), 'incorrect' );
			result = ali.STATUS.incorrect;
		}

		$flag.aria( 'hidden', 'true' ).appendTo( $target );
		$target.aria( 'disabled', 'true' );

		$( SELECT + ',' + SUBMIT, $target ).aria( 'disabled', 'true' );

		this.itemComplete( result, $target );

		setTimeout( (function () {
			$flag.aria( 'hidden', 'false' );
		}).bind( this ), 1 );

		var num_questions = $( QUESTION ).length;
		var dialogQuery = '';
		if ( num_questions === $( QUESTION + '[aria-disabled="true"]' ).length ) {
			if ( num_questions === $( QUESTION + ' .correct' ).length ) {
				result = ali.STATUS.correct;
				dialogQuery = '.dialog-content.correct';
			} else {
				result = ali.STATUS.incorrect;
				dialogQuery = '.dialog-content.incorrect';
			}
			var $dialogContent = $( dialogQuery, this.$el );
			if ( $dialogContent.length === 1 ) {
				ali.Dialog.show( $dialogContent );
			}
			this.complete( result );
		}
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