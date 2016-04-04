/*
 * --------------------------------------------------------------------------
 * Ali: dialog.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function ( $ ) {
	"use strict";

	/**
	 * Template local
	 */
	var _t = window.htmlTemplates;

	/**
	 * Reusable Dialog object
	 * @type {{_instance: jQuery, show: ali.Dialog.show, hide: ali.Dialog.hide}}
	 */
	window.ali.Dialog = {

		_instance : undefined,

		/**
		 * Displays a dialog window, moving the content contained in `$el` into the primary content of the dialog.
		 * This method will also copy any classes on `$el` over to the dialog itself.
		 * @param $el content for the dialog.
		 * @param title Accessible title of this dialog.
		 */
		show : function ( $el, title ) {
			if ( 'undefined' === $.type( _t.dialog ) ) {
				Mustache.parse( _t.dialog );
			}
			this._instance = $( Mustache.render( _t.dialog, { label : title, content : $el.html() } ) );
			var cl = $el[ 0 ].classList;
			for ( var i = 0; i < cl.length; i ++ ) {
				if ( cl.item( i ).indexOf( 'dialog' ) < 0 ) {
					console.log( cl.item( i ) );
					this._instance.addClass( cl.item( i ) );
				}
			}
			$( 'body' ).append( this._instance ).addClass( 'dialog-open' );
			$( document ).off( 'focusin.ali' ).on( 'focusin.ali', this._handleFocus.bind( this ) );
			$( '.dialog-window-actions-close', this._instance ).off( 'click.ali' ).on( 'click.ali', this.hide.bind( this ) );
			this._instance.trigger( 'focus' );
		},

		/**
		 * Hides the current dialog. Primarily intended as a callback method for the close button.
		 * @param e {Event}
		 */
		hide : function ( e ) {
			if ( 'object' === $.type( e ) ) {
				e.preventDefault();
				e.stopPropagation();
			}

			if ( $.type( this._instance ) !== 'undefined' ) {
				$( '.dialog-window-actions-close', this._instance ).off( 'click.ali' );
				this._instance.remove();
				this._instance = undefined;
			}
			$( document ).off( 'focusin.ali' );
			$( 'body' ).removeClass( 'dialog-open' );
		},
		/**
		 * Callback method used to keep focus on the dialog while it's open.
		 * @param e
		 * @private
		 */
		_handleFocus : function ( e ) {
			if ( document !== e.target && this._instance[ 0 ] !== e.target && ! this._instance.has( e.target ).length ) {
				this._instance.trigger( 'focus' );
			}
		}

	};

})( jQuery );