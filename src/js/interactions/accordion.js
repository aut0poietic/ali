(function ( $ ) {
	"use strict";

	// Make the global object available and abort if this file is used without it.
	var ali = window.ali;
	if( $.type( ali ) !== 'object'){
		return ;
	}

	var DESCRIPTION = 'Accordion interaction.';
	var TYPE = ali.TYPE.other;

	/*
	 * Saved queries
	 */
	var TAB = '.accordion-tab';
	var OPEN_TAB = '.accordion-tab[aria-expanded="true"]';
	var PANEL = '.accordion-panel';

	/**
	 * Accordion Interaction
	 * @param element DOMElement
	 * @constructor
	 */
	ali.Accordion = function ( element ) {
		ali.Interaction.call( this, element, TYPE, DESCRIPTION );
		this.init();
	};

	// Inherits from ali.Interaction
	ali.Accordion.prototype = Object.create( ali.Interaction.prototype );
	ali.Accordion.prototype.constructor = ali.Accordion;

	/**
	 * Saved jQuery reference to the tabs in this interaction.
	 * @type {jQuery}
	 */
	ali.Accordion.prototype.$tabs = undefined;

	/**
	 * Initializes the Interaction. Called from constructor.
	 */
	ali.Accordion.prototype.init = function () {
		var $initOpen = $( OPEN_TAB );
		this.$tabs = $( TAB, this.$el );
		this.$tabs.each( this.initTab.bind( this ) );
		// If there was an expanded tab set by the user, expand that tab.
		// Otherwise, just make the first element in the list active
		if ( $initOpen.length > 0 ) {
			/// DIRTY HACK: deferring this "show" call so that event handlers have a chance to be attached
			/// before it fires.
			this.defer( (function () {
				this.show( $( $initOpen[ 0 ] ) );
			}).bind( this ) );
		} else {
			this.getFirstTab().aria( 'tabindex', 0 );
		}
		// set a debounced resize event handler.
		$( window ).on( 'resize', this._requestResize.bind( this ) );
	};

	/**
	 * jQuery each callback; Initializes the tab/panel pair
	 * @param i : {number} index of current element
	 * @param el {jQuery} tab to operate on.
	 */
	ali.Accordion.prototype.initTab = function ( i, el ) {
		var $tab, $panel, id;
		$tab = $( el );
		id = this.makeTargetID( $tab );
		$panel = $tab.next( PANEL );
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
	};

	/**
	 * Hides the panel corresponding to the provided tab and sets that tab to unexpanded.
	 * @param $tab
	 */
	ali.Accordion.prototype.hide = function ( $tab ) {
		this.getPanelFromTab( $tab ).aria(
			{
				'hidden'   : 'true',
				'tabindex' : "-1"
			}
		).removeAttr( 'style' );
		$tab.aria( 'expanded', 'false' );
	};

	/**
	 *  Hides all panels
	 */
	ali.Accordion.prototype.hideAll = function () {
		this.$tabs.each( (function ( i, el ) {
			this.hide( $( el ) );
		} ).bind( this ) );
	};

	/**
	 * Shows the panel corresponding to the provided $tab and fires an `ali:itemSelected`.
	 * If all tabs have been viewed, fires an `ali:complete` event.
	 * @param $tab
	 */
	ali.Accordion.prototype.show = function ( $tab ) {
		var $panel = this.getPanelFromTab( $tab );
		var panelHeight = parseInt( $panel.attr( 'data-height' ) );
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
				'tabindex' : '0'
			}
		).addClass( 'viewed' ).focus();

		this.itemSelected( $tab );

		if ( $( '.viewed', this.$el ).length === this.$tabs.length && this.data.result === ali.STATUS.incomplete ) {
			this.complete();
		}
	};

	/**
	 * Returns a panel controlled by the provided tab.
	 * @param $tab : jQuery
	 * @returns jQuery object for the panel.
	 */
	ali.Accordion.prototype.getPanelFromTab = function ( $tab ) {
		return $( '#' + $tab.aria( 'controls' ) );
	};

	/**
	 * Returns a tab that controls the provided panel.
	 * @param $panel : jQuery
	 * @returns jQuery object for the tab
	 */
	ali.Accordion.prototype.getTabFromPanel = function ( $panel ) {
		return $( TAB + '[aria-controls="' + $panel.attr( 'id' ) + '"]' );
	};


	/**
	 * Iterates through all siblings following the provided tab until another tab is found.
	 * If no tab is found, returns an empty jQuery object.
	 * @param $tab
	 * @returns {jQuery}
	 * @note Maximum iterations is 2 * {number of tabs}
	 * @private
	 */
	ali.Accordion.prototype._nextTab = function ( $tab ) {
		var $next = $tab.next();
		var count = this.$tabs.length * 2;
		while ( $next.length > 0 && ! $next.is( TAB ) && count -- !== 0 ) {
			$next = $next.next();
		}
		return $next;
	};

	/**
	 * Returns the next tab in the accordion or the first tab if no next tab can be found.
	 * @param $tab
	 * @returns {jQuery}
	 */
	ali.Accordion.prototype.getNextTab = function ( $tab ) {
		var $next = this._nextTab( $tab );
		if ( $next.length === 0 ) {
			return this.getFirstTab();
		} else {
			return $next;
		}
	};


	/**
	 * Iterates over all siblings preceding the provided tab until another tab is found.
	 * If no tab is found, returns an empty jQuery object.
	 * @param $tab
	 * @returns {jQuery}
	 * @note Maximum iterations is 2 * {number of tabs}
	 * @private
	 */
	ali.Accordion.prototype._previousTab = function ( $tab ) {
		var $prev = $tab.prev();
		var count = this.$tabs.length * 2;
		while ( $prev.length > 0 && ! $prev.is( TAB ) && count -- !== 0 ) {
			$prev = $prev.prev();
		}
		return $prev;
	};

	/**
	 * Returns the previous tab in the accordion or the last tab if no previous tab can be found.
	 * @param $tab
	 * @returns {jQuery}
	 */
	ali.Accordion.prototype.getPreviousTab = function ( $tab ) {
		var $prev = this._previousTab( $tab );
		if ( $prev.length === 0 ) {
			return this.getLastTab();
		} else {
			return $prev;
		}
	};


	/**
	 * Gets the first tab in the list.
	 * @returns {jQuery}
	 */
	ali.Accordion.prototype.getFirstTab = function () {
		return this.$tabs.first();
	};

	/**
	 * Gets the last tab in the list.
	 * @returns {jQuery}
	 */
	ali.Accordion.prototype.getLastTab = function () {
		return this.$tabs.last();
	};


	/**
	 * Keyboard event handler for when keyboard focus in on the tabs.
	 * @private
	 */
	ali.Accordion.prototype.tab_onKeyDown = function ( e ) {
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
	};

	/**
	 * Tab click event
	 * @private
	 */
	ali.Accordion.prototype.tab_onClick = function ( e ) {
		var $target = $( e.target );
		if ( $target.aria( 'expanded' ) !== 'true' ) {
			this.show( $target );
		} else {
			this.hide( $target );
		}
	};

	/**
	 * Keyboard event handler for when keyboard focus is in a panel.
	 * @private
	 */
	ali.Accordion.prototype.panel_onKeyDown = function ( e ) {
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
	};


	/**
	 * Window resize handler.
	 * @param e
	 */
	ali.Accordion.prototype.onResize = function ( e ) {
		this._requestResize();
	};

	/**
	 * Requests a resize event if the current control is not currently performing a resize event.
	 * Events are handled before the next paint and debounced using requestAnimationFrame
	 * @private
	 */
	ali.Accordion.prototype._requestResize = function () {
		if ( ! this._resizing ) {
			requestAnimationFrame( this._resizePanels.bind( this ) );
			this._resizing = true;
		}
	};

	/**
	 * Callback passed to requestAnimationFrame; sets the max-height for each panel, adjusting the height
	 * for any panel currently open.
	 * @private
	 */
	ali.Accordion.prototype._resizePanels = function () {
		this.$tabs.each( (function ( i, el ) {
			var $panel = $( el ).next( PANEL );
			$panel.attr( 'data-height', this._getMeasuredHeight( $panel ) );
			if ( $panel.aria( 'hidden' ) === 'false' ) {
				$panel.css( 'min-height', this._getMeasuredHeight( $panel ) + 'px' );
			}
		}).bind( this ) );
		this._resizing = false;
	};

	/**
	 * Creates an clone element on the DOM of the provided panel and measures it's height.
	 * @param $panel
	 * @returns {int} height of element
	 * @private
	 */
	ali.Accordion.prototype._getMeasuredHeight = function( $panel ) {
		var $div = $( '<div id="ali-temp" aria-hidden="true" style="overflow:hidden;height:1px;width:100%;visibility: hidden"></div>' ).appendTo( this.$el );
		var $tmp = $( '<dd class="accordion-panel"></dd>' ).html( $panel.html() ).appendTo( $div );
		var h = $tmp.height();
		$div.remove();
		return h;
	};

	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.Accordion( this );
		} );
	}

	var old = $.fn.accordion;
	$.fn.accordion = Plugin;
	$.fn.accordion.Constructor = ali.Accordion;

	$.fn.accordion.noConflict = function () {
		$.fn.accordion = old;
		return this;
	};

})( jQuery );