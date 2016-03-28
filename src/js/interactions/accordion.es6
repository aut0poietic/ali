const aliAccordion = (( $ ) => {

	const DESCRIPTION = 'Accordion interaction.';
	const TYPE = ali.TYPE.other;

	/**
	 * Saved jQuery paths.
	 */
	const TAB = '.accordion-tab';
	const OPEN_TAB = '.accordion-tab[aria-expanded="true"]';
	const PANEL = '.accordion-panel';

	class Accordion extends aliMultipartInteraction {

		constructor( element ) {
			super( element, TYPE, DESCRIPTION );
			this.$el.aria(
				{
					'role'            : "tablist",
					'multiselectable' : 'true'
				}
			);
			this.$tabs = $( TAB, this.$el );
			// before we begin manipulation, fetch a reference to any
			// tabs that were set to expanded so we can restore them
			// after initialization
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
						'data-height' : this._getMeasuredHeight( $panel )
					}
				).off( 'keydown.ali' ).on( 'keydown.ali', this.panel_onKeyDown.bind( this ) );
			} );

			// If there was an expanded tab set by the user, expand that tab.
			// Otherwise, just make the first element in the list active
			if ( $openTabs.length > 0 ) {
				/// DIRTY HACK: deferring this "show" call so that event handlers have a chance to be attached
				/// before it fires.
				this.defer( () => {
					this.show( $( $openTabs[ 0 ] ) );
				} );
			} else {
				this.getFirstTab().aria( 'tabindex', 0 );
			}
			$( window ).on( 'resize', this._requestResize.bind( this ) );
		}

		/**
		 * Hides the panel corresponding to the provided tab and sets that tab to unexpanded.
		 * @param $tab
		 */
		hide( $tab ) {
			this.getPanelFromTab( $tab ).aria(
				{
					'hidden'   : 'true',
					'tabindex' : "-1"
				}
			).removeAttr( 'style' );
			$tab.aria( 'expanded', 'false' );
		}

		/**
		 *  Hides all panels
		 */
		hideAll() {
			this.$tabs.each( ( i, el ) => {
				this.hide( $( el ) );
			} );
		}

		/**
		 * Shows the panel corresponding to the provided $tab and fires an `ali:itemSelected`.
		 * If all tabs have been viewed, fires an `ali:complete` event.
		 * @param $tab
		 */
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

			if ( $( '.viewed', this.$el ).length === this.$tabs.length && this.data.result === ali.STATUS.incomplete ) {
				this.complete();
			}
		}

		/**
		 * Returns a panel controlled by the provided tab.
		 * @param $tab : jQuery
		 * @returns jQuery object for the panel.
		 */
		getPanelFromTab( $tab ) {
			return $( '#' + $tab.aria( 'controls' ) );
		}

		/**
		 * Returns a tab that controls the provided panel.
		 * @param $panel : jQuery
		 * @returns jQuery object for the tab
		 */
		getTabFromPanel( $panel ) {
			return $( TAB + '[aria-controls="' + $panel.attr( 'id' ) + '"]' );
		}

		/**
		 * Iterates through all siblings following the provided tab until another tab is found.
		 * If no tab is found, returns an empty jQuery object.
		 * @param $tab
		 * @returns {jQuery}
		 * @note Maximum iterations is 2 * {number of tabs}
		 * @private
		 */
		_nextTab( $tab ) {
			var $next = $tab.next();
			var count = this.$tabs.length * 2;
			while ( $next.length > 0 && ! $next.is( TAB ) && count -- != 0 ) {
				$next = $next.next();
			}
			return $next;
		}

		/**
		 * Returns the next tab in the accordion or the first tab if no next tab can be found.
		 * @param $tab
		 * @returns {jQuery}
		 */
		getNextTab( $tab ) {
			let $next = this._nextTab( $tab );
			if ( $next.length === 0 ) {
				return this.getFirstTab();
			} else {
				return $next;
			}
		}

		/**
		 * Iterates over all siblings preceding the provided tab until another tab is found.
		 * If no tab is found, returns an empty jQuery object.
		 * @param $tab
		 * @returns {jQuery}
		 * @note Maximum iterations is 2 * {number of tabs}
		 * @private
		 */
		_previousTab( $tab ) {
			var $prev = $tab.prev();
			var count = this.$tabs.length * 2;
			while ( $prev.length > 0 && ! $prev.is( TAB ) && count -- != 0 ) {
				$prev = $prev.prev();
			}
			return $prev;
		}

		/**
		 * Returns the previous tab in the accordion or the last tab if no previous tab can be found.
		 * @param $tab
		 * @returns {jQuery}
		 */
		getPreviousTab( $tab ) {
			var $prev = this._previousTab( $tab );
			if ( $prev.length === 0 ) {
				return this.getLastTab();
			} else {
				return $prev;
			}
		}

		/**
		 * Gets the first tab in the list.
		 * @returns {jQuery}
		 */
		getFirstTab() {
			return this.$tabs.first();
		}

		/**
		 * Gets the last tab in the list.
		 * @returns {jQuery}
		 */
		getLastTab() {
			return this.$tabs.last();
		}


		/**
		 * Keyboard event handler for when keyboard focus in on the tabs.
		 * @private
		 */
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

		/**
		 * Tab click event
		 * @private
		 */
		tab_onClick( e ) {
			let $target = $( e.target );
			if ( $target.aria( 'expanded' ) !== 'true' ) {
				this.hideAll();
				this.show( $target );
			} else {
				this.hide( $target );
			}
		}

		/**
		 * Keyboard event handler for when keyboard focus is in a panel.
		 * @private
		 */
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

		/**
		 * Window resize handler.
		 * @param e
		 */
		onResize( e ) {
			this._width = $( document ).width();
			this._requestResize();
		}

		/**
		 * Requests a resize event if the current control is not currently performing a resize event.
		 * Events are handled before the next paint and debounced using requestAnimationFrame
		 * @private
		 */
		_requestResize() {
			if ( ! this._resizing ) {
				requestAnimationFrame( this._resizePanels.bind( this ) );
				this._resizing = true;
			}
		}

		/**
		 * Callback passed to requestAnimationFrame; sets the max-height for each panel, adjusting the height
		 * for any panel currently open.
		 * @private
		 */
		_resizePanels() {
			this.$tabs.each( ( i, el ) => {
				let $panel = $( el ).next( PANEL );
				$panel.attr( 'data-height', this._getMeasuredHeight( $panel ) );
				if ( $panel.aria( 'hidden' ) === 'false' ) {
					$panel.css( 'min-height', this._getMeasuredHeight( $panel ) + 'px' );
				}
			} );
			this._resizing = false;
		}

		/**
		 * Creates an clone element on the DOM of the provided panel and measures it's height.
		 * @param $panel
		 * @returns {int} height of element
		 * @private
		 */
		_getMeasuredHeight( $panel ) {
			var $div = $( '<div id="ali-temp" aria-hidden="true" style="overflow:hidden;height:1px;width:100%;visibility: hidden"></div>' ).appendTo( this.$el );
			var $tmp = $( '<dd class="accordion-panel"></dd>' ).html( $panel.html() ).appendTo( $div );
			let h = $tmp.height();
			$div.remove();
			return h;
		}


		/**
		 * jQuery Plugin interface method -- simply creates a new Accordion instance
		 * for each element in the current query.
		 */
		static _jQuery() {
			return this.each( function () {
				new Accordion( this );
			} );
		}
	}

	/**
	 * JQUERY PLUGIN
	 */

	$.fn.accordion = Accordion._jQuery;
	$.fn.accordion.Constructor = Accordion;
	$.fn.accordion.noConflict = function () {
		$.fn[ 'accordion' ] = $.fn[ 'accordion' ];
		return Accordion._jQuery;
	};

	return Accordion;

})( jQuery );


