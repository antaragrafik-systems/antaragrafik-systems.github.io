L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

    onAdd: function (map) {
        // Triggered when the layer is added to a map.
        //   Register a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        map.on('click', this.getFeatureInfo, this);
    },

    onRemove: function (map) {
        // Triggered when the layer is removed from a map.
        //   Unregister a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onRemove.call(this, map);
        map.off('click', this.getFeatureInfo, this);
    },

    getFeatureInfo: function (evt) {

        // Make an AJAX request to the server and hope for the best
        var url = this.getFeatureInfoUrl(evt.latlng),
        showResults = L.Util.bind(this.showGetFeatureInfo, this);
        // //alert(url);

        $.ajax({
            url: url,
            success: function (data, status, xhr) {
                //   //alert("suc");
                var err = typeof data === 'string' ? null : data;
                showResults(err, evt.latlng, data);
            },
            error: function (xhr, status, error) {
                showResults(error);
            }
        });

    },

    getFeatureInfoUrl: function (latlng) {

        // Construct a GetFeatureInfo request URL given a point
        var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
        size = this._map.getSize(),

        params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            crs: 'EPSG:3857',
            styles: this.wmsParams.styles,
            transparent: this.wmsParams.transparent,
            version: this.wmsParams.version,
            format: this.wmsParams.format,
            bbox: this._map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: this.wmsParams.layers,
            query_layers: this.wmsParams.layers,
            info_format: 'text/html'
        };

        params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
        params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

        ////alert(this._url + L.Util.getParamString(params, this._url, true));
        return this._url + L.Util.getParamString(params, this._url, true);
    },

    //to display tooltips
    showGetFeatureInfo: function (err, latlng, content) {
        console.log(content);

        if (content == undefined) return;

        if (err) { console.log(err); return; } // do nothing if there's an error 
        if (content.trim().length < 10) { return; } 
        var values = content.split('<');
        if (values.length < 11) { return; } 
        var tooltip = "";
        var featureName = values[10].split('>')[1].trim(); 
        console.log("featureName " + featureName);
        //console.log("featureName" + values[29].split('>')[1]);
        //console.log("featureName" + values[37].split('>')[1]);
        //console.log("featureName" + values[45].split('>')[1]);
        //console.log("featureName" + values[53].split('>')[1]);

        switch (featureName) {
            //case "Manhole":
            //    tooltip = "<table><tr><td class='td1'>MANHOLE ID</td><td class='td2'> :&nbsp;</td><td class='td3'>" + values[45].split('>')[1].trim() + "</td></tr>" +
            //              "<tr><td class='td1'>FEATURE TYPE</td><td class='td2'> :&nbsp;</td><td class='td3'>" + values[29].split('>')[1].trim() + "</td></tr>" +
            //              "<tr><td class='td1'>MH MIX</td><td class='td2'> :&nbsp;</td><td class='td3'>" + values[37].split('>')[1].trim() + "</td></tr>" +
            //              "<tr><td class='td1'>LAT,LONG</td><td class='td2'> :&nbsp;</td><td class='td3'>" + values[53].split('>')[1].trim() + "</td></tr>" +
            //              "</table>";
            case "BNDFDC":
                tooltip = "<h5 class='pt-3 pb-2'>Extract this boundary?</h5>" +
                            "<div class='text-center'><button type='button' class='btn btn-secondary rounded-pill' data-bs-toggle='modal' data-bs-target='#modalSaveAs'>Open Extraction Details</button>" +
                            "</div>";
            break;
        }

        if (tooltip != "") {
            // alert("tooltip");
            var div_content = document.createElement("p");
            div_content.innerHTML = tooltip; 

            L.popup({ maxWidth: 800 })
     .setLatLng(latlng)
      .setContent(div_content)
       .openOn(this._map);
        }
    }
});

function openWin12() {
    var divText = document.getElementById("pass").outerHTML;
    //alert("openWin12")
    //alert(divText)
    //window.open("http://localhost/TMNet/default.aspx?DP=" + divText, "_blank", "toolbar=no, scrollbars=no, resizable=no, top=500, left=500, width=680, height=490");
    //alert("openWin32")
}

L.tileLayer.betterWms = function (url, options) {
    return new L.TileLayer.BetterWMS(url, options);
};