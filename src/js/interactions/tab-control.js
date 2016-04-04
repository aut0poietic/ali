/*
 * --------------------------------------------------------------------------
 * Ali: tab-control.js
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

	var DESCRIPTION = 'Tab Control interaction.';
	var TYPE = ali.TYPE.other;
	/*
	 * Saved queries
	 */
	var TABLIST = '.tab-control-tablist';
	var TABS = TABLIST + ' li';
	var SELECTED_TAB = TABS + '[aria-selected="true"]';
	var PANELS = '.tab-control-panel';

	/**
	 * Tab Control Interaction
	 * @param element DOMElement
	 * @constructor
	 */
	ali.TabControl = function ( element ) {
		ali.Interaction.call( this, element, TYPE, DESCRIPTION );
		this.init();
	};

	// Inherits from ali.Interaction
	ali.TabControl.prototype = Object.create( ali.Interaction.prototype );
	ali.TabControl.prototype.constructor = ali.Accordion;

	/**
	 * Saved jQuery reference to the tabs in this interaction.
	 * @type {jQuery}
	 */
	ali.Accordion.prototype.$tabs = undefined;

	/**
	 * Saved jQuery reference to the visual indicator for this interaction.
	 * @type {jQuery}
	 */
	ali.Accordion.prototype.$vi = undefined;
	ali.Accordion.prototype.__activeTab = undefined;

	/**
	 * Initializes the Interaction. Called from constructor.
	 */
	ali.TabControl.prototype.init = function () {
		var $tablist = $( TABLIST, this.$el );
		this.$tabs = $( TABS, this.$el );
		var $selected = $( SELECTED_TAB, this.$el );
		var $panels = $( PANELS, this.$el );
		var id = this.$el.attr( 'id' );
		$panels.each( (function ( i, el ) {
			var $panel = $( el );
			$panel.attr( 'id', id + '-panel-' + i )
			      .aria( {
				             'role'      : 'tabpanel',
				             'hidden'    : 'true',
				             'tabindex'  : '-1',
				             'labeledby' : id + '-tab-' + i
			             } )
			      .off( 'keydown.ali' )
			      .on( 'keydown.ali', this.panel_onKeyDown.bind( this ) );
		}).bind( this ) );

		$tablist.aria( {
			               'role'   : 'tablist',
			               'hidden' : 'true'
		               } );

		this.$tabs.each( (function ( i, el ) {
			var $tab = $( el );
			$tab.attr( 'id', id + '-tab-' + i )
			    .aria( {
				           'role'     : 'tab',
				           'controls' : id + '-panel-' + i,
				           'tabindex' : '-1',
				           'selected' : 'false'
			           } )
			    .off( 'click.ali' ).on( 'click.ali', this.tab_onClick.bind( this ) )
			    .off( 'keydown.ali' ).on( 'keydown.ali', this.tab_onKeyDown.bind( this ) );
		} ).bind( this ) );

		this.$vi = $( '<span class="vi" role="presentation"></span>' );
		$tablist.append( this.$vi );

		if ( $selected.length > 0 ) {
			$selected = $( $selected[ 0 ] );
		} else {
			$selected = $( this.$tabs[ 0 ] );
		}

		$( window ).on( 'resize', this._requestResize.bind( this ) );

		this.defer( (function () {
			$tablist.aria( 'hidden', 'false' );
			this.show( $selected );
		}).bind( this ) );
	};


	/**
	 * Hides the panel corresponding to the provided tab and sets that tab to unexpanded.
	 * @param $tab
	 */
	ali.TabControl.prototype.hide = function ( $tab ) {
		this.getPanelFromTab( $tab ).aria(
			{
				'hidden'   : 'true',
				'tabindex' : "-1"
			}
		);
		$tab.aria( {
			           'selected' : 'false',
			           'tabindex' : "-1"
		           } );
	};

	/**
	 *  Hides all panels
	 */
	ali.TabControl.prototype.hideAll = function () {
		this.$tabs.each( (function ( i, el ) {
			this.hide( $( el ) );
		} ).bind( this ) );
	};

	/**
	 * Shows the panel corresponding to the provided $tab and fires an `ali:itemSelected`.
	 * If all tabs have been viewed, fires an `ali:complete` event.
	 * @param $tab
	 */
	ali.TabControl.prototype.show = function ( $tab ) {
		var $panel = this.getPanelFromTab( $tab );
		this.hideAll();
		$panel.aria(
			{
				'hidden'   : 'false',
				'tabindex' : "0"
			}
		);

		$tab.aria(
			{
				'selected' : 'true',
				'tabindex' : '0'
			}
		).addClass( 'viewed' ).focus();

		this.itemSelected( $tab );
		this.updateVI( $tab );

		if ( $( '.viewed', this.$el ).length === this.$tabs.length && this.data.result === ali.STATUS.incomplete ) {
			this.complete();
		}
	};


	/**
	 * Returns a panel controlled by the provided tab.
	 * @param $tab : jQuery
	 * @returns jQuery object for the panel.
	 */
	ali.TabControl.prototype.getPanelFromTab = function ( $tab ) {
		return $( '#' + $tab.aria( 'controls' ) );
	};

	/**
	 * Returns a tab that controls the provided panel.
	 * @param $panel : jQuery
	 * @returns jQuery object for the tab
	 */
	ali.TabControl.prototype.getTabFromPanel = function ( $panel ) {
		return $( TABS + '[aria-controls="' + $panel.attr( 'id' ) + '"]' );
	};


	/**
	 * Iterates through all siblings following the provided tab until another tab is found.
	 * If no tab is found, returns an empty jQuery object.
	 * @param $tab
	 * @returns {jQuery}
	 * @note Maximum iterations is 2 * {number of tabs}
	 * @private
	 */
	ali.TabControl.prototype._nextTab = function ( $tab ) {
		var $next = $tab.next();
		var count = this.$tabs.length * 2;
		while ( $next.length > 0 && ! $next.is( TABS ) && count -- !== 0 ) {
			$next = $next.next();
		}
		return $next;
	};

	/**
	 * Returns the next tab in the accordion or the first tab if no next tab can be found.
	 * @param $tab
	 * @returns {jQuery}
	 */
	ali.TabControl.prototype.getNextTab = function ( $tab ) {
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
	ali.TabControl.prototype._previousTab = function ( $tab ) {
		var $prev = $tab.prev();
		var count = this.$tabs.length * 2;
		while ( $prev.length > 0 && ! $prev.is( TABS ) && count -- !== 0 ) {
			$prev = $prev.prev();
		}
		return $prev;
	};

	/**
	 * Returns the previous tab in the accordion or the last tab if no previous tab can be found.
	 * @param $tab
	 * @returns {jQuery}
	 */
	ali.TabControl.prototype.getPreviousTab = function ( $tab ) {
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
	ali.TabControl.prototype.getFirstTab = function () {
		return this.$tabs.first();
	};

	/**
	 * Gets the last tab in the list.
	 * @returns {jQuery}
	 */
	ali.TabControl.prototype.getLastTab = function () {
		return this.$tabs.last();
	};

	/**
	 * Keyboard event handler for when keyboard focus is in a panel.
	 * @private
	 */
	ali.TabControl.prototype.panel_onKeyDown = function ( e ) {
		if ( (e.ctrlKey || e.metaKey) && e.currentTarget ) {
			var $tab;
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
	 * Tab click event
	 * @private
	 */
	ali.TabControl.prototype.tab_onClick = function ( e ) {
		var $target = $( e.target );
		if ( $target.aria( 'selected' ) !== 'true' ) {
			this.hideAll();
			this.show( $target );
		}
	};

	/**
	 * Keyboard event handler for when keyboard focus in on the tabs.
	 * @private
	 */
	ali.TabControl.prototype.tab_onKeyDown = function ( e ) {
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
	 * Window resize handler.
	 * @param e
	 */
	ali.TabControl.prototype.onResize = function ( e ) {
		this._requestResize();
	};

	/**
	 * Requests a resize event if the current control is not currently performing a resize event.
	 * Events are handled before the next paint and debounced using requestAnimationFrame
	 * @private
	 */
	ali.TabControl.prototype._requestResize = function () {
		if ( ! this._resizing ) {
			this._resizing = true;
			this.__activeTab = $( SELECTED_TAB, this.$el );
			requestAnimationFrame( this.updateVI.bind( this ) );
		}
	};

	/**
	 * Resizes the visual indicator (vi) for the active tab.
	 * @param $tab {number|jQuery}
	 */
	ali.TabControl.prototype.updateVI = function ( $tab ) {
		// if the passed parameter is a number, this method is being called by
		// a rAF, so set the $tab variable and reset the resizing flag.
		if ( $.type( $tab ) === 'number' ) {
			this._resizing = false;
			$tab = this.__activeTab;
		}
		var pos = $tab.position();
		var w = $tab.outerWidth();
		this.$vi.css( { width : w + 'px', left : pos.left + 'px' } );
	};

	/*
	 * jQuery Plugin
	 */
	function Plugin() {
		return this.each( function () {
			new ali.TabControl( this );
		} );
	}

	var old = $.fn.tabcontrol;
	$.fn.tabcontrol = Plugin;
	$.fn.tabcontrol.Constructor = ali.TabControl;

	$.fn.tabcontrol.noConflict = function () {
		$.fn.tabcontrol = old;
		return this;
	};

})( jQuery );