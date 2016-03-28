/*
 * --------------------------------------------------------------------------
 * Ali: multipartinteraction.es6
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */


class aliMultipartInteraction extends aliInteraction {

	constructor( element, type = ali.TYPE.other, description = 'Ali Interaction' ) {
		super( element, type, description );

		this.lastPartEnd = this.data.start;
	}

	itemSelected( $item ) {
		let e = new jQuery.Event( 'ali:itemSelected' );
		this.$el.trigger( e, [ this.data, $item ] );
	}

	itemComplete( status, $item = this.$el ) {
		let clonedData = Object.assign( {}, this.data );
		let d = new Date();
		clonedData.result = status;
		clonedData.latency = d.getTime() - this.lastPartEnd;
		let e = new jQuery.Event( 'ali:itemComplete' );
		this.$el.trigger( e, [ clonedData, $item ] );
		this.lastPartEnd = d.getTime();
	}
}