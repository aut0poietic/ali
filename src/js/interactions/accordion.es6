const aliAccordion = (( $ ) => {

	const DESCRIPTION = 'Accordion interaction.';

	const TAB = '.accordion-tab';
	const OPEN_TAB = '.accordion-tab[aria-expanded="true"]';
	const PANEL = '.accordion-panel';

	class Accordion extends aliMultipartInteraction {

		constructor( element ) {
			super( element, DESCRIPTION );
			this.$el.aria(
				{
					'role'            : "tablist",
					'multiselectable' : 'true'
				}
			);
			this.$tabs = $( TAB, this.$el );
			let $openTabs = $( OPEN_TAB );
			this.$tabs.each( ( i, el ) => {
				let $tab = $( el );
				let id = this.makeTargetID( $tab );
				let $panel = $tab.next( PANEL );
				$tab.aria(
					{
						'role'     : "tab",
						'tabindex' : "0",
						'expanded' : "false",
						'controls' : id
					} )
				    .off( 'click.ali' ).on( 'click.ali', this.tab_onClick.bind( this ) )
				    .off( 'keydown.ali' ).on( 'keydown.ali', this.tab_onKeyDown.bind( this ) );

				$panel.aria(
					{
						'role'     : "tabpanel",
						'tabindex' : "-1",
						'hidden'   : "true"
					}
				).attr(
					{
						'id'          : id,
						'data-height' : this.getMeasuredHeight( $panel )
					}
				).off( 'keydown.ali' ).on( 'keydown.ali', this.panel_onKeyDown.bind( this ) );
			} );


			if ( $openTabs.length > 0 ) {
				this.show( $( $openTabs[ 0 ] ) );
			} else {
				this.getFirstTab().aria( 'tabindex', 0 );
			}
			$( window ).on( 'resize', this.requestResize.bind( this ) );
		}


		hide( $tab ) {
			this.getPanelFromTab( $tab ).aria(
				{
					'hidden'   : 'true',
					'tabindex' : "-1"
				}
			).removeAttr( 'style' );
			$tab.aria( 'expanded', 'false' );
		}

		hideAll() {
			this.$tabs.each( ( function ( i, el ) {
				this.hide( $( el ) );
			}).bind( this ) );
			if ( this.firstRun ) {
				$( '#panel-0' ).aria( 'hidden', 'true' );
			}
		}

		show( $tab ) {
			let $panel = this.getPanelFromTab( $tab );
			let panelHeight = parseInt( $panel.attr( 'data-height' ) );
			this.hideAll();
			$panel.aria(
				{
					'hidden'   : 'false',
					'tabindex' : "0"
				}
			);
			if ( panelHeight > 0 ) {
				$panel.css( 'max-height', panelHeight + 'px' );
			}
			$tab.aria(
				{
					'expanded' : 'true',
					'selected' : 'true',
					'tabindex' : '0'
				}
			).addClass( 'viewed' ).focus();
			this.itemSelected( $tab );
			if ( $( '.viewed', this.$el ).length === this.$tabs.length ) {
				this.complete();
			}
		}

		getPanelFromTab( $tab ) {
			return $( '#' + $tab.aria( 'controls' ) );
		}

		getTabFromPanel( $panel ) {
			return $( TAB + '[aria-controls="' + $panel.attr( 'id' ) + '"]' );
		}

		_nextTab( $tab ) {
			var $next = $tab.next();
			var count = this.$tabs.length * 2;
			while ( $next.length > 0 && ! $next.is( TAB ) && count -- != 0 ) {
				$next = $next.next();
			}
			return $next;
		}

		getNextTab( $tab ) {
			let $next = this._nextTab( $tab );
			if ( $next.length === 0 ) {
				return this.getFirstTab();
			} else {
				return $next;
			}
		}

		_previousTab( $tab ) {
			var $prev = $tab.prev();
			var count = this.$tabs.length * 2;
			while ( $prev.length > 0 && ! $prev.is( TAB ) && count -- != 0 ) {
				$prev = $prev.prev();
			}
			return $prev;
		}

		getPreviousTab( $tab ) {
			var $prev = this._previousTab( $tab );
			if ( $prev.length === 0 ) {
				return this.getLastTab();
			} else {
				return $prev;
			}
		}

		getFirstTab() {
			return this.$tabs.first();
		}

		getLastTab() {
			return this.$tabs.last();
		}

		tab_onKeyDown( e ) {
			switch ( e.which ) {
				case 13: // ENTER
				case 32: // SPACE
					e.preventDefault();
					e.stopPropagation();
					this.tab_onClick( e );
					break;
				case 37: // LEFT
				case 38: // UP
					e.preventDefault();
					e.stopPropagation();
					this.show( this.getPreviousTab( $( e.currentTarget ) ) );
					break;
				case 39: // RIGHT
				case 40: // DOWN
					e.preventDefault();
					e.stopPropagation();
					this.show( this.getNextTab( $( e.currentTarget ) ) );
					break;
				case 35: // END
					e.preventDefault();
					e.stopPropagation();
					this.show( this.getLastTab() );
					break;
				case 36: // HOME
					e.preventDefault();
					e.stopPropagation();
					this.show( this.getFirstTab() );
					break;
			}
		}

		tab_onClick( e ) {
			let $target = $( e.target );
			if ( $target.aria( 'expanded' ) !== 'true' ) {
				this.hideAll();
				this.show( $target );
			} else {
				this.hide( $target );
			}
		}

		panel_onKeyDown( e ) {
			if ( (e.ctrlKey || e.metaKey) && e.currentTarget ) {
				var $tab, $newTab;
				var $panel = $( e.currentTarget );
				switch ( e.which ) {
					case 38: // UP
						e.preventDefault();
						e.stopPropagation();
						this.getTabFromPanel( $panel ).focus();
						break;
					case 33: // PAGE UP
						e.preventDefault();
						e.stopPropagation();
						$tab = this.getFirstTab();
						if ( $tab.aria( 'expanded' ) === 'false' ) {
							this.show( $tab );
						}
						$tab.focus();
						break;
					case 40: //  DOWN
						e.preventDefault();
						e.stopPropagation();
						$tab = this.getLastTab();
						if ( $tab.aria( 'expanded' ) === 'false' ) {
							this.show( $tab );
						}
						$tab.focus();
						break;
				}
			}
		}

		onResize( e ) {
			this._width = $( document ).width();
			this.requestResize();
		}

		requestResize() {
			if ( ! this._resizing ) {
				requestAnimationFrame( this.resizePanels.bind( this ) );
				this._resizing = true;
			}
		}

		resizePanels() {
			this.$tabs.each( ( i, el ) => {
				let $panel = $( el ).next( PANEL );
				$panel.attr( 'data-height', this.getMeasuredHeight( $panel ) );
				if ( $panel.aria( 'hidden' ) === 'false' ) {
					$panel.css( 'min-height', this.getMeasuredHeight( $panel ) + 'px' );
				}
			} );

			this._resizing = false;
		}


		getMeasuredHeight( $panel ) {
			var $div = $( '<div id="ali-temp" aria-hidden="true" style="overflow:hidden;height:1px;width:100%;visibility: hidden"></div>' ).appendTo( this.$el );
			var $tmp = $( '<dd class="accordion-panel"></dd>' ).html( $panel.html() ).appendTo( $div );
			let h = $tmp.height();
			$div.remove();
			return h;
		}

		static _jQuery() {
			return this.each( function () {
				new Accordion( this );
			} );
		}
	}

	$.fn.accordion = Accordion._jQuery;
	$.fn.accordion.Constructor = Accordion;
	$.fn.accordion.noConflict = function () {
		$.fn[ 'accordion' ] = $.fn[ 'accordion' ];
		return Accordion._jQuery;
	};

	return Accordion;

})( jQuery );


