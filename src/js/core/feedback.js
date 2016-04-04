/*
 * --------------------------------------------------------------------------
 * Ali: feedback.js
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function ( $ ) {
	"use strict";

	/**
	 * Template local
	 */
	var _t = window.htmlTemplates;


	Mustache.parse( _t.feedback );
	Mustache.parse( _t.feedbackContainer );

	/**
	 * Reusable Dialog object
	 * @type {{_instance: jQuery, show: ali.Dialog.show, hide: ali.Dialog.hide}}
	 */
	window.ali.Feedback = {
		_count : 0,

		initInteraction : function ( $control ) {
			if ( $control.length > 0 ) {
				$control.append( _t.feedbackContainer );
			}
		},

		show : function ( $content, $el ) {
			var $instance = $( Mustache.render( _t.feedback, { count : ++ this._count, content : $content.html() } ) );
			var cl = $content[ 0 ].classList;
			for ( var i = 0; i < cl.length; i ++ ) {
				if ( cl.item( i ).indexOf( 'feedback' ) < 0 ) {
					$instance.addClass( cl.item( i ) );
				}
			}
			$( '[role="status"]', $el ).append( $instance );
			this.scrollToAndFocus( $instance );
		},

		scrollToAndFocus : function ( $el ) {
			$( 'html,body' ).animate(
				{
					scrollTop : $el.offset().top
				},
				{
					duration : 1000,
					easing   : '',
					complete : function () {
						$el.trigger( 'focus' );
					}
				}
			);
		}
	};

})( jQuery );