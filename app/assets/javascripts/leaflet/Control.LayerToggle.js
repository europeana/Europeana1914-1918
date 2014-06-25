/*global L */
/*jslint browser: true, white: true */
/**
 * a leaflet control built for europeana 1914-1918
 * @version 2014-06-25 gmt +2
 */
(function( L ) {

	'use strict';

	L.Control.LayerToggle = L.Control.extend({

		container: undefined,
		buttons: [],
		button_id_prefix: 'layer-toggle-button-',
		layers: [],
		layerGroup: undefined,
		map: undefined,
		map_button: undefined,
		satellite_button: undefined,


		createButton: function( html, className, title, container, fn, context ) {
			var
				link = L.DomUtil.create( 'a', className, container ),
				stop = L.DomEvent.stopPropagation;

			link.innerHTML = html;
			link.href = '#' + title;
			link.title = title;

			L.DomEvent
				.on( link, 'click', stop )
				.on( link, 'mousedown', stop )
				.on( link, 'dblclick', stop )
				.on( link, 'click', L.DomEvent.preventDefault )
				.on( link, 'click', fn, context );

			return link;
		},

		createLayerGroup: function() {
			this.layerGroup = L.layerGroup( this.layers );
			this.layerGroup.addTo( this.map );
		},

		initialize: function( options ) {
			L.Util.setOptions( this, options );
		},

		options: {
			containerClassName: 'leaflet-control-toggle-layer'
		},

		onAdd: function( map ) {
			this.map = map;
			this.container = L.DomUtil.create( 'div', this.options.containerClassName );
			this.createLayerGroup();
			this.processButtons();
			return this.container;
		},

		processButtons: function() {
			var
				i,
				active;

			for ( i = 0; i < this.options.buttons.length; i += 1 ) {
				active = '';

				if ( this.options.buttons[i].active ) {
					active = ' class="active"';
				}

				// add buttons
				this.buttons.push(
					this.createButton(
						'<span id="' +
							this.button_id_prefix + i + '"' +
							active + '>' +
							this.options.buttons[i].title +
						'</span>',
						'',
						this.options.buttons[i].title,
						this.container,
						this.toggleLayer,
						this
					)
				);

				// add layers
				this.layers.push( this.options.buttons[i].layer );
			}

			this.createLayerGroup();
		},

		setLayer: function( index ) {
			this.layerGroup.clearLayers();
			this.layerGroup.addLayer( this.layers[index] );
		},

		getTarget: function( evt ) {
			var target;

			if ( !evt ) {
				evt = window.event;
			}

			if ( evt.target ) {
				target = evt.target;
			} else if ( evt.srcElement ) {
				target = evt.srcElement;
			}

			// defeat Safari bug
			if ( target.nodeType === 3 ) {
				target = target.parentNode;
			}

			return target;
		},

		toggleLayer: function( evt ) {
			var
				i,
				button_clicked = this.getTarget( evt ),
				button_in_collection;

			for ( i = 0; i < this.buttons.length; i += 1 ) {
				button_in_collection = this.buttons[i].getElementsByTagName( 'span' )[0];

				if ( button_clicked.id === button_in_collection.id ) {
					if ( button_in_collection.className !== 'active' ) {
						button_in_collection.className = 'active';
						this.setLayer( i );
					}
				} else {
					button_in_collection.className = '';
				}
			}
		}

	});

}( L ));
