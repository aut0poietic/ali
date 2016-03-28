/*
 * --------------------------------------------------------------------------
 * Ali: multipartinteraction.es6
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Parent class for any interaction that contains multiple pieces that can be completed independently.
 * Note that not all interactions use both the "itemSelected" and "itemComplete" events.
 */
class aliMultipartInteraction extends aliInteraction {

	constructor( element, type = ali.TYPE.other, description = 'Ali Interaction' ) {
		super( element, type, description );

		this.lastPartEnd = this.data.start;
	}

	/**
	 * Event trigger method to indicate that an item has been selected.
	 * @param $item : jQuery object for the element selected.
	 */
	itemSelected( $item ) {
		let e = new jQuery.Event( 'ali:itemSelected' );
		this.$el.trigger( e, [ this.data, $item ] );
	}

	/**
	 * Event trigger method to indicate that an item has been completed.
	 * @param status : string From the ali.STATUS constant; Should indicate the status of the interaction, including
	 * correct or incorrect, if appropriate.
	 * @param $item : jQuery object for the element selected.
	 */
	itemComplete( status = ali.STATUS.complete, $item = this.$el ) {
		let clonedData = Object.assign( {}, this.data );
		let d = new Date();
		clonedData.result = status;
		clonedData.latency = d.getTime() - this.lastPartEnd;
		let e = new jQuery.Event( 'ali:itemComplete' );
		this.$el.trigger( e, [ clonedData, $item ] );
		this.lastPartEnd = d.getTime();
	}
}