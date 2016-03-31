(function ( $ ) {
	"use strict";

	window.ali.Dialog = {

		_instance : undefined,
		_template : window.htmlTemplates.dialog,

		show : function ( $el, title ) {
			if ( 'undefined' === $.type( this._template ) ) {
				Mustache.parse( this._template );
			}
			this._instance = $( Mustache.render( this._template, { label : title, content : $el.html() } ) );
			var cl = $el[ 0 ].classList;
			for ( var i = 0; i < cl.length; i ++ ) {
				if ( cl.item( i ).indexOf( 'dialog' ) < 0 ) {
					console.log( cl.item( i ) );
					this._instance.addClass( cl.item( i ) );
				}
			}
			$( 'body' ).append( this._instance ).addClass( 'dialog-open' );
			$( document ).off( 'focusin.ali' ).on( 'focusin.ali', this.handleFocus.bind( this ) );
			$( '.dialog-window-actions-close', this._instance ).off( 'click.ali' ).on( 'click.ali', this.hide.bind( this ) );
		},

		hide : function ( e ) {
			if ( 'object' === $.type( e ) ) {
				e.preventDefault();
				e.stopPropagation();
			}

			$( '.dialog-window-actions-close', this._instance ).off( 'click.ali' );
			if ( $.type( this._instance ) !== 'undefined' ) {
				this._instance.remove();
			}
			$( document ).off( 'focusin.ali' );
			$( 'body' ).removeClass( 'dialog-open' );
		},

		handleFocus : function ( e ) {
			if ( ! this._instance.has( e.target ).length ) {
				$( '.dialog-window', this.$dialog ).trigger( 'focus' );
			}
		}

	};

})( jQuery );