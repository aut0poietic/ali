/*
 * --------------------------------------------------------------------------
 * Ali: card.js
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

	ali.Card = function ( element ) {
		this.$el = $( element );
		this.$el.aria( 'tabindex', - 1 );

		// initialize the turn-to-back functionality
		$( '.show-back' , this.$el ).off( 'click.ali' ).on( 'click.ali', this.showBack.bind( this ) );

		// initialize the turn-to-front functionality
		$( '.show-front' , this.$el  ).off( 'click.ali' ).on( 'click.ali', this.showFront.bind( this ) );
	};

	ali.Card.prototype.showBack = function( e ){
		$( '.card-back', this.$el ).aria( 'hidden', 'false' );
		$( '.card-front', this.$el ).aria( 'hidden', 'true' );
	};

	ali.Card.prototype.showFront = function( e ){
		$( '.card-back', this.$el ).aria( 'hidden', 'true' );
		$( '.card-front', this.$el ).aria( 'hidden', 'false' );
	};

	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.Card( this );
		} );
	}

	var old = $.fn.card;
	$.fn.card = Plugin;
	$.fn.card.Constructor = ali.Card;

	$.fn.card.noConflict = function () {
		$.fn.card = old;
		return this;
	};

})( jQuery );