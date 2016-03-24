const Accordion = (( $ ) => {

	const tabQuery = '.accordion-tab';
	const panelQuery = '.accordion-panel';

	class Accordion {

		constructor( element ) {
			this.$el = $( element );
			this.$tabs = $( tabQuery, this.$el );

			this.$tabs.each( ( i, el ) => {
				let $tab = $( el );
				let id = this._makeID( $tab );
				let $panel = $tab.next( panelQuery );
				$tab.aria(
					{
						'role'     : "tab",
						'tabindex' : i === 0 ? "0" : "-1",
						'expanded' : i === 0 ? "true" : "false",
						'controls' : id
					} )
				    .off( 'click.ali' ).on( 'click.ali', this.onTabClick.bind( this ) )
				    .off( 'keydown.ali' ).on( 'keydown.ali', this.onTabKeyDown.bind( this ) );

				$panel.aria(
					{
						'role'     : "tabpanel",
						'tabindex' : "0",
						'hidden'   : i === 0 ? "false" : "true"
					}
				).attr( 'id', id );
			} );
		}

		getPanelFromTab( $tab ) {
			return $( '#' + $tab.attr( 'aria-controls' ).replace( /tab/, 'panel' ) );
		};

		getTabFromPanel( $panel ) {
			return $( '#' + $panel.attr( 'id' ).replace( /panel/, 'tab' ) );
		};

		hide( $tab ) {

			this.getPanelFromTab( $tab ).attr( 'aria-hidden', 'true' );
			$tab.attr( {
				           'aria-expanded' : 'false',
				           'aria-selected' : 'false',
				           'tabindex'      : '-1'
			           } );
		};

		hideAll() {
			console.log( this );
			this.$tabs.each( ( function ( i, el ) {
				this.hide( $( el ) );
			}).bind( this ) );

			if ( this.firstRun ) {
				$( '#panel-0' ).attr( 'aria-hidden', 'true' );
			}
		};

		show( $tab ) {
			this.hideAll();
			this.getPanelFromTab( $tab ).attr( 'aria-hidden', 'false' );
			$tab.attr( {
				           'aria-expanded' : 'true',
				           'aria-selected' : 'true',
				           'tabindex'      : '0'
			           } )
			    .focus();


			this.showPresentation( $tab.attr( 'data-figure' ) );
		};


		getNextTab( $tab ) {

			var $next = $tab.next();
			if ( $next.length === 0 ) {
				return this.getFirstTab();
			} else {
				return $next;
			}
		};

		getPreviousTab( $tab ) {
			var $prev = $tab.prev();
			if ( $prev.length === 0 ) {
				return this.getLastTab();
			} else {
				return $prev;
			}
		};

		getFirstTab() {
			return this.$tabs.first();
		};

		getLastTab() {
			return this.$tabs.last();
		};


		onTabKeyDown( e ) {
			console.log( 'keydown.ali' );
		}

		onTabClick( e ) {
			let $target = $( e.target );
			if ( $target.attr( 'aria-expanded' ) !== 'true' ) {
				this.hideAll();
				this.show( $target );
			}
		}

		_makeID( $el ) {
			let str = $el.text().replace( /[\W_]+/g, "" ).toLowerCase();
			if ( str.length > 10 ) {
				str = str.substring( 0, 10 );
			}
			return str;
		}


		static _jQuery() {
			return this.each( function () {
				new Accordion( this );
			} )
		}
	}

	$.fn.accordion = Accordion._jQuery;
	$.fn.accordion.Constructor = Accordion;
	$.fn.accordion.noConflict = function () {
		$.fn[ 'accordion' ] = $.fn[ 'accordion' ];
		return Accordion._jQueryInterface;
	};

	return Accordion;

})( jQuery );


