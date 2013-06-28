/**
 *	@author dan entous <contact@gmtplusone.com>
 */
(function() {

	'use strict';

	var pdf = {

		url : RunCoCo.pdf_url,
		pdfDoc : null,
		checkForPdfDoc : 0,
		pageNum : 1,
		scale : 0.8,
		canvas : document.getElementsByTagName('canvas')[0],
		ctx : null,


		/*
		 * Get page info from document, resize canvas accordingly, and render page
		 */
		renderPage : function( num ) {

			if ( null === pdf.pdfDoc ) {
				return;
			}

			// Using promise to fetch the page
			pdf.pdfDoc.getPage( num ).then( function( page ) {
				var viewport = page.getViewport( pdf.scale ),
					renderContext = {};
				pdf.canvas.height = viewport.height;
				pdf.canvas.width = viewport.width;

				// Render PDF page into canvas context
				renderContext.canvasContext = pdf.ctx;
				renderContext.viewport = viewport;

				page.render( renderContext );
			});

			// Update page counters
			//document.getElementById('page_num').textContent = pdf.pageNum;
			//document.getElementById('page_count').textContent = pdf.pdfDoc.numPages;

		},


		goPrevious : function() {

			if ( pdf.pageNum <= 1 ) {
				return;
			}

			pdf.pageNum -= 1;
			pdf.renderPage( pdf.pageNum );

		},


		goNext : function() {
			if ( pdf.pageNum >= pdf.numPages ) {
				return;
			}

			pdf.pageNum += 1;
			pdf.renderPage( pdf.pageNum );
		},


		fetchPdf : function() {

			PDFJS.getDocument( pdf.url ).then(
				function getPdfHelloWorld( _pdfDoc ) {
					pdf.pdfDoc = _pdfDoc;
					pdf.renderPage( pdf.pageNum );
				}
			);

		},


		placeControls : function() {
//<span><%= t('formtastic.labels.attachment.metadata.page_number') %> :
// <span id="page_num"></span> / <span id="page_count"></span></span>
			var page_num = document.createElement('span'),
				page_count = document.createElement('span'),
				prev = document.createElement('button'),
				next = document.createElement('button');

			page_num.id = 'page_num';
			page_count.id = 'page_count';

			prev.id = 'prev';
			prev.textContent = I18n.t('javascripts.previous');

			next.id = 'next';
			next.textContent = I18n.t('javascripts.next');

			lib.addEvent( prev, 'click', pdf.goPrevious );
			lib.addEvent( next, 'click', pdf.goNext );

			pdf.canvas.parentNode
			//pdf.canvas.insertBefore( page_num, pdf.canvas.parentNode );
			//pdf.canvas.insertBefore( page_count, pdf.canvas.parentNode );
			//document.getElementById('controls').appendChild( next );
			//document.getElementById('controls').appendChild( prev );

		},


		pdfSetup : function() {

			if ( null === pdf.pdfDoc ) {
				pdf.checkForPdfDoc += 1;

				if ( pdf.checkForPdfDoc < 20 ) {
					setTimeout( function() { pdf.pdfSetup(); }, 200 );
				} else {
					console.log( 'pdfDoc was not available before throttle limit' );
				}

				return;
			}

			document.body.style.width = pdf.canvas.width + 'px';

		},


		init : function() {

			pdf.ctx = pdf.canvas.getContext('2d');
			pdf.fetchPdf();
			pdf.placeControls();
			pdf.pdfSetup();

		}

	};

	setTimeout( function() { pdf.init(); }, 1000 );

}());
