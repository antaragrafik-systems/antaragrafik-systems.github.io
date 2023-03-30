
var attributionControl = L.control({
    position: "bottomright"
});
attributionControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "leaflet-control-attribution");
    div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://www.antaragrafik.net/' target='blank' </a>Antaragrafik Systems Sdn Bhd</span>";
    return div;
};
map.addControl(attributionControl);