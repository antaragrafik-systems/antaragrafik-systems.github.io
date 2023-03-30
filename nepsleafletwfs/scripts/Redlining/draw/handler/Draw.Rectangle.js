/**
 * @class L.Draw.Rectangle
 * @aka Draw.Rectangle
 * @inherits L.Draw.SimpleShape
 */
L.Draw.Rectangle = L.Draw.SimpleShape.extend({
	statics: {
		TYPE: 'rectangle'
	},

	options: {
		shapeOptions: {
			stroke: true,
			color: '#3388ff',
			weight: 4,
			opacity: 0.5,
			fill: true,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
			showArea: true,
			clickable: true
		},
		metric: true // Whether to use the metric measurement system or imperial
	},

	// @method initialize(): void
	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Rectangle.TYPE;

		this._initialLabelText = L.drawLocal.draw.handlers.rectangle.tooltip.start;

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
	},

	// @method disable(): void
	disable: function () {
		if (!this._enabled) {
			return;
		}

		this._isCurrentlyTwoClickDrawing = false;
		L.Draw.SimpleShape.prototype.disable.call(this);
	},

	_onMouseUp: function (e) {
		if (!this._shape && !this._isCurrentlyTwoClickDrawing) {
			this._isCurrentlyTwoClickDrawing = true;
			return;
		}

		// Make sure closing click is on map
		if (this._isCurrentlyTwoClickDrawing && !_hasAncestor(e.target, 'leaflet-pane')) {
			return;
		}

		L.Draw.SimpleShape.prototype._onMouseUp.call(this);
	},

	_drawShape: function (latlng) {
		if (!this._shape) {
			this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
		}
	},

	_fireCreatedEvent: function () {
		var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);
		L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, rectangle);

		var id = L.Util.stamp(rectangle);
		var div_content = document.createElement("p");
		div_content.id = id;

		var innerHTMLtext = "<h5 class='pt-3 pb-2'>Extract this boundary?</h5>" +
			"<div class='text-center'><button type='button' class='btn btn-secondary rounded-pill' data-bs-toggle='modal' data-bs-target='#modalSaveAs'>Open Extraction Details</button>" +
			"</div>";	//onclick='ExtractPolygon()'
		div_content.innerHTML = innerHTMLtext;
		var div_pointer = document.createElement("div");
		div_pointer.appendChild(div_content);
		rectangle.bindPopup(div_content);
	},

	_getTooltipText: function () {
		var tooltipText = L.Draw.SimpleShape.prototype._getTooltipText.call(this),
			shape = this._shape,
			showArea = this.options.showArea,
			latLngs, area, subtext;

		if (shape) {
			latLngs = this._shape._defaultShape ? this._shape._defaultShape() : this._shape.getLatLngs();
			area = L.GeometryUtil.geodesicArea(latLngs);
			subtext = showArea ? L.GeometryUtil.readableArea(area, this.options.metric) : '';
		}

		return {
			text: tooltipText.text,
			subtext: subtext
		};
	}
});

function _hasAncestor(el, cls) {
	while ((el = el.parentElement) && !el.classList.contains(cls)) {
		;
	}
	return el;
}
