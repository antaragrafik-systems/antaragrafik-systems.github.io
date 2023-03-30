//coordinateControl: true
L.control.coordinates({
    position: "bottomleft",
    decimals: 5,
    decimalSeperator: ".",
    labelTemplateLat: "Latitude: {y}",
    labelTemplateLng: "Longitude: {x}"
}).addTo(map);

L.control.coordinates({
    position: "bottomleft",
    useDMS: true,
    labelTemplateLat: "N {y}",
    labelTemplateLng: "E {x}",
    useLatLngOrder: true
}).addTo(map);