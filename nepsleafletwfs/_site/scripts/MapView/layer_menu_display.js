  // "Google Map - Streets": BaseMapGoogle,
     //   "Google Map - Hybrid": BaseMapGoogleHybrid,
var groupedOverlays = { 
    "<span class='controlHeading'>Base Map</span>": { 
        "Open Street": BaseMapOpenStreet,
        "Off": NoMap
    }
    ,
    "<span class='controlHeading'>Boundary</span>": {
        "&nbsp;Exchange Boundary": EXCBoundary
    },
    "<span class='controlHeading'>Networks</span>": {
        "&nbsp;Civil": Civil,
        "&nbsp;Fiber": Fiber,
        "&nbsp;Exchange": Exchange,
        //"&nbsp;FDCBoundary": FDCBoundary
    },
    "<span class='controlHeading'>NEPS Landbase</span>": {
        "&nbsp;Landbase": Feature_Landbase,
        "&nbsp;LandbaseAdmin": Feature_AdminLandbase,
    },
    "<span class='controlHeading'>GDS Landbase</span>": {       
        "&nbsp;JH": Landbase_JH,
        "&nbsp;KV": Landbase_KV,
        "&nbsp;MK": Landbase_MK,
        "&nbsp;AS": Landbase_AS,
        "&nbsp;KN": Landbase_KN,
        "&nbsp;JP": Landbase_JP,
        "&nbsp;TG": Landbase_TG,
        "&nbsp;PG": Landbase_PG,
        "&nbsp;KK": Landbase_KK,
        "&nbsp;KG": Landbase_KG
        //"&nbsp &nbsp;&nbsp;&nbsp;Properties": NewLayer
    }
    
    //,
    //"<span class='controlHeading'>SMARTMAP</span>": { 
    //    "Lots": SMARTMAP_LOT 
    //} 
};

var options = {
    exclusiveGroups: ["<span class='controlHeading'>Base Map</span>"]//,
    // Show a checkbox next to non-exclusive group labels for toggling all
   // groupCheckboxes: true
};

L.control.groupedLayers(null, groupedOverlays, options).addTo(map);

map.on("zoomend", function (e) {

    var zoom = map.getZoom();
    map.removeLayer(Civil);
    map.removeLayer(Feature_AdminLandbase);

    if (zoom < 23) {
        if (zoom > 17) {
            map.addLayer(Civil);
            map.addLayer(Feature_AdminLandbase);
        }
    }

    L.DomUtil.addClass(map.getContainer(), 'white-bg');

    //if (zoom > 19) {
    //    L.DomUtil.addClass(map.getContainer(), 'white-bg');
    //} else {
    //    L.DomUtil.removeClass(map.getContainer(), 'white-bg');
    //}
});


//var options = {
//    // Make the "Base Maps" group exclusive (use radio inputs)
//    exclusiveGroups: ["<span class='controlHeading'>Base Map</span>"],
//    // Show a checkbox next to non-exclusive group labels for toggling all
//    groupCheckboxes: true, 
//    collapsed: isCollapsed
//};
//var legend = L.geoJson(null); 
//var layerControl = L.control.groupedLayers(null, groupedOverlays, options); 
//L.easyButton({
//    position: 'topright',
//    states: [
//      {
//          stateName: 'unloaded', 
//          icon: '<img src="/TMFOMS/Images/pin2.png" width="17" >',
//          title: 'load image',
//          onClick: function (control) { 
//              control.state("loading");
//              layerControl.update(); 
//          }
//      }, {
//          stateName: 'loading',
//          icon: '<img src="/TMFOMS/Images/pin1.png" width="17" >',
//          onClick: function (control) { 
//              control.state("unloaded");
//              layerControl.update(); 
//          }
//      }, {
//          stateName: 'loaded',
//          icon: 'fa-thumbs-up'
//      }, {
//          stateName: 'error',
//          icon: 'fa-frown-o',
//          title: 'location not found'
//      }
//    ] 
//}).addTo(map);
//layerControl.addTo(map);



