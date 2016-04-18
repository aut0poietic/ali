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



	ali.CardCarousel = function ( element ) {
		this.$el = $( element );
		this.init();
	};

	ali.CardCarousel.prototype.activeElement = 0;

	ali.CardCarousel.prototype.init = function () {
		//$('.card', this.$el).wrap('<div class="card-wrapper"></div>');
		var maxHeight = Math.max.apply(
			null,
			$( '.card', this.$el ).map( function () {
				return $( this ).outerHeight( true );
			} ).get()
		);
		this.$el.height( maxHeight );
		this.updateClasses();

		$( '.show-next', this.$el ).off( 'click.ali' ).on( 'click.ali', this.onShowNext.bind( this ) );
		$( '.show-first', this.$el ).off( 'click.ali' ).on( 'click.ali', this.onShowFirst.bind( this ) );
	};

	ali.CardCarousel.prototype.onShowNext = function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		this.activeElement ++;
		this.updateClasses();
	};

	ali.CardCarousel.prototype.onShowFirst = function ( e ) {
		e.preventDefault();
		e.stopPropagation();
		this.activeElement = 0;
		this.updateClasses();
	};

	ali.CardCarousel.prototype.updateClasses = function () {
		var classString;
		$( '.card-wrapper', this.$el ).each( (function ( i, el ) {
			classString = 'card-wrapper ';
			if ( i !== this.activeElement ) {
				if ( i < this.activeElement ) {
					classString += "before ";
					if ( i === this.activeElement - 1 ) {
						classString += "hinted ";
					}
				} else {
					classString += "after ";
					if ( i === this.activeElement + 1 ) {
						classString += "hinted ";
					}
				}
			}
			$( el ).attr( 'class', classString )
			       .aria( 'hidden', i === this.activeElement ? 'false' : 'true' );
		}).bind( this ) );
	};


	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.CardCarousel( this );
		} );
	}

	var old = $.fn.cardcarousel;
	$.fn.cardcarousel = Plugin;
	$.fn.cardcarousel.Constructor = ali.CardCarousel;

	$.fn.cardcarousel.noConflict = function () {
		$.fn.cardcarousel = old;
		return this;
	};

})( jQuery );