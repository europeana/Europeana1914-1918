/**
 *	@author dan entous <contact@gmtplusone.com>
 */
(function() {

	'use strict';

	var pdf = {

		url : RunCoCo.pdf_url,
		pdfDoc : null,
		pageNum : 1,
		scale : 0.8,
		canvas : document.getElementById('the-canvas'),
		ctx : null,

		//
		// Get page info from document, resize canvas accordingly, and render page
		//
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
			document.getElementById('page_num').textContent = pdf.pageNum;
			document.getElementById('page_count').textContent = pdf.pdfDoc.numPages;

		},

		//
		// Go to previous page
		//
		goPrevious : function() {
			if ( pdf.pageNum <= 1 ) {
				return;
			}

			pdf.pageNum -= 1;
			pdf.renderPage( pdf.pageNum );
		},

		//
		// Go to next page
		//
		goNext : function() {
			if ( pdf.pageNum >= pdf.numPages ) {
				return;
			}

			pdf.pageNum += 1;
			pdf.renderPage( pdf.pageNum );
		},

		fetchPdf : function() {
			//
			// Asynchronously download PDF as an ArrayBuffer
			//
			PDFJS.getDocument( pdf.url ).then(
				function getPdfHelloWorld( _pdfDoc ) {
					pdf.pdfDoc = _pdfDoc;
					pdf.renderPage( pdf.pageNum );
				}
			);
		},

		init : function() {
			pdf.ctx = pdf.canvas.getContext('2d');
			lib.addEvent( document.getElementById('prev'), 'click', pdf.goPrevious );
			lib.addEvent( document.getElementById('next'), 'click', pdf.goNext );
			pdf.fetchPdf();
		}

	};

	pdf.init();

}());
