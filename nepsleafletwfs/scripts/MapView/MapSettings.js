var map;
var statusExist = false;
var maxBoundarySize = 2589988.10; //500000;   //1000000 meter square ~ 1 kilometer square; 2589988.10 meter square ~ 1 mile square
var passMaxBoundary = false;

$(window).resize(function () {
    sizeLayerControl();
});

var redlining = L.geoJson(null);
var highlight = L.geoJson(null);
var EXCBoundary = L.geoJson(null);

map = L.map("map", {
    zoom: 7, 
    center: [3, 103],
    layers: [BaseMapOpenStreet, highlight],  
     zoomControl: false,
     attributionControl: false,
     measureControl: true

}); 

function sizeLayerControl() {
    $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
} 

map.doubleClickZoom.disable();

map.on("dblclick", function (e) {
   highlight.clearLayers();
});

var southWest = L.latLng(0.5, 130),
    northEast = L.latLng(8, 89),
    bounds = L.latLngBounds(southWest, northEast); 
map.setMaxBounds(bounds);

$(document).ready(function () {
    var Boundaries = new L.GeoJSON.AJAX(RootUrl + Boundaries_URL_JSON,
    {
        onEachFeature: function (feature, layer) {
            var linestyle_exc = {
                color: "#DC143C",
                weight: "3"
            };

            var bTooltip = "<table>";
            bTooltip += "<tr><td style='font-weight: bold'>EXCHANGE ABB</td><td class='td2'> :&nbsp;";
            bTooltip += "</td><td>" + feature.properties.EXC_ABB + "</td></tr>";
            bTooltip += "<tr><td style='font-weight: bold'>SEGMENT</td><td class='td2'> :&nbsp;";
            bTooltip += "</td><td>" + feature.properties.SEGMENT + "</td></tr>";
            bTooltip += "</table>";

            var line_layer = L.polygon(feature.geometry.coordinates, linestyle_exc);
            line_layer.bindPopup(bTooltip);

            EXCBoundary.addLayer(line_layer);
        }
    });
});

function GetDrawnDistance(layer) {
    //var layer = e.target;
    //var id = L.Util.stamp(layer);
    var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
    var tooltip = (area).toFixed(2) + ' m';
    var area_ft = (area * 10.764).toFixed(2);

    var tooltip_fr = area_ft + ' ft';

    if (area > 1000000) {
        tooltip = (area / 1000000).toFixed(2) + ' km';
        tooltip_fr = (area / 1000000 * 0.38610).toFixed(2) + ' mi';
    }

    if (area > maxBoundarySize) {
        $("#icoAreaPass").hide();
        $("#icoAreaFail").show();        

        passMaxBoundary = false;
    } else {
        $("#icoAreaPass").show();
        $("#icoAreaFail").hide();

        passMaxBoundary = true;
    }

    $("#txtAreaMax").html("Max area: " + (maxBoundarySize / 1000000 * 0.38610).toFixed(2) + " mi &sup2;");

    EnableExtractButton();

    $("#txtArea").val(tooltip + " / " + tooltip_fr);
}

function EnableExtractButton() {
    var slcPass = true;

    $(".optRequired").each(function () {
        if ($(this).val() == "") slcPass = false;
    });

    var requiredOne = 0;

    $(".optRequiredOne").each(function () {
        if ($(this).val() != "") requiredOne++;
    });

    if (requiredOne == 0) slcPass = false;

    if (slcPass && passMaxBoundary) $("#btnExtract").removeAttr("disabled");
    else $("#btnExtract").prop("disabled", true);
}

$(document).one("ajaxStop", function () { 
    sizeLayerControl();
}); 