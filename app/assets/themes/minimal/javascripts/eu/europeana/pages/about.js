(function() {
	'use strict';

	var addrs = document.getElementsByClassName('addr'),
			addrs_length = addrs.length,
			addr,
			title,
			i;

	for ( i = 0; i < addrs_length; i += 1 ) {
		addr = addrs[i].innerHTML.replace(/\s\[@\]\s/,'@').replace(/\s\[\.\]\s/g, '.');
		title = addrs[i].getAttribute('title');

		if ( !title ) {
			title = addr;
		}

		addrs[i].innerHTML = '<a href="mailto:' + addr + '">' + title + '</a>';
	}
}());
