annotorious.plugin.Flag = function() {
	return true;
};

annotorious.plugin.Flag.prototype.onInitAnnotator = function( annotator ) {

	annotator.popup.addField( function( annotation ) {
		if ( annotation.flaggable ) {
			return jQuery('<a>')
				.attr('class','annotorious-popup-button annotorious-popup-button-flag')
				.attr('title','Flag')
				.attr('href','javascript:void(0);')
				.text('FLAG')
				.on('click', function() { console.log( annotation ); })[0];
		}

		return false;
  });
};
