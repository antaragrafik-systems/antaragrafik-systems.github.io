
var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
//var locateControl = L.control.locate({
//    position: "bottomright",
//    drawCircle: true,
//    follow: true,
//    setView: true,
//    keepCurrentZoomLevel: true,
//    markerStyle: {
//        weight: 1,
//        opacity: 0.8,
//        fillOpacity: 0.8
//    },
//    circleStyle: {
//        weight: 1,
//        clickable: false
//    },
//    icon: "fa fa-location-arrow",
//    metric: false,
//    strings: {
//        title: "My location",
//        popup: "You are within {distance} {unit} from this point",
//        outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
//    },
//    locateOptions: {
//        maxZoom: 5000,
//        watch: true,
//        enableHighAccuracy: true,
//        maximumAge: 10000,
//        timeout: 10000
//    }
//}).addTo(map);