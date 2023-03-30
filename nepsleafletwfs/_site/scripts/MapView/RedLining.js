function DrawRedLining(Error_Details, lCableCode) { 
    if (Error_Details != "")
        document.getElementById("ErrorMsg").innerHTML = Error_Details; 
    if (lCableCode.length == 0) 
        map.spin(false);
    for (var i = 0; i < lCableCode.length; i++) { 
    redlining.clearLayers();
    $.ajax(
{
    url: RootUrl + "Trace/Trace",
    type: "GET",
    dataType: "html",
    data:
    { 
        "sExc_Abb": lCableCode[i].sExc_Abb,
        "sRegion": lCableCode[i].sRegion, 
        "sCableCode": lCableCode[i].sCableCode,  
        "sCblFid": lCableCode[i].FID,
        "sCblFno": lCableCode[i].FNO,
        "cblId": i
    },
    beforeSend: function () {
        map.spin(true);
    },
    success: function (data) { 
        var res = jQuery.parseJSON(data); 
        if (res.Success) { 
            //====================
            //==cable==
            //===================
            var lat = 3;
            var long = 101; 
            if (res.trace_result.TrResult.latlongCblXY != null)
                if (res.trace_result.TrResult.latlongCblXY.length > 0) { 
                    lat = res.trace_result.TrResult.latlongCblXY[0].latlongs[0].Y;
                    long = res.trace_result.TrResult.latlongCblXY[0].latlongs[0].X;  
                    var equip_panel_context = 
                    '<div class="accordion-item"> <h2 class="accordion-header" id="heading' + res.CableId + '" name="' + lat + ',' + long + '">'+
                        '   <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse' + res.CableId + '" aria-expanded="true" aria-controls="collapse' + res.CableId + '">'+
                        res.CableCode + '    </button></h2><div id="collapse' + res.CableId + '" class="accordion-collapse collapse show" aria-labelledby="heading' + res.CableId + '" data-bs-parent="#accordionPanelsidebar_list">' +
                        '<div class="accordion-body" style="background-color: #212529;"><table class="table table-hover" ><tbody class="list">';
                   
 
                    var cbl_color = "#ff0054";
                    if (res.CableId == 1 || res.CableId == 3) cbl_color = "#800080";
                    else if (res.CableId == 2 || res.CableId == 4) cbl_color = "#800000";
                    for (var j = 0; j < res.trace_result.TrResult.latlongCblXY.length; j++) {
                        if (res.trace_result.TrResult.latlongCblXY[j].latlongs.length >=1) {     
                            var newArray = [];
                            if (res.trace_result.TrResult.latlongCblXY[j].latlongs.length > 0)
                                for (var i = 0; i < res.trace_result.TrResult.latlongCblXY[j].latlongs.length; i++) {
                                    var newCoordinate = [res.trace_result.TrResult.latlongCblXY[j].latlongs[i].X, res.trace_result.TrResult.latlongCblXY[j].latlongs[i].Y];
                                    newArray.push(newCoordinate);
                                }
                            var cbl_draw = [{
                                "type": "Feature",
                                "properties": {
                                    "LAT": 0,
                                    "LONG": 0,
                                    "TermPointType": res.trace_result.TrResult.latlongCblXY[j].latlongs[0].TermPointType,
                                    "TermPointCode": res.trace_result.TrResult.latlongCblXY[j].latlongs[0].Code,
                                    "Tooltip": res.trace_result.TrResult.latlongCblXY[j].latlongs[0].tooltip + '; Length (m) : ' + res.trace_result.TrResult.latlongCblXY[j].latlongs[0].Cable_Len
                                },
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": newArray 
                                }
                            }];
                            redlining.addLayer(L.geoJson(cbl_draw, {
                                style: {
                                    color: cbl_color,
                                    weight: 3,
                                    opacity: 1
                                },
                                onEachFeature: onEachFeature
                            })); 
                        }
                    }
                }
            //====================
            //==exchange==
            //===================
            if (res.trace_result.TrResult.latlongExcXY != null)
                if (res.trace_result.TrResult.latlongExcXY.length > 0) {
                    for (var j = 0; j < res.trace_result.TrResult.latlongExcXY.length; j++) {
                        if (res.trace_result.TrResult.latlongExcXY[j].latlongs.length >= 1) {
                            var exch_mar = L.polygon([L.latLng(res.trace_result.TrResult.latlongExcXY[j].latlongs[0].Y, res.trace_result.TrResult.latlongExcXY[j].latlongs[0].X),
                   L.latLng(res.trace_result.TrResult.latlongExcXY[j].latlongs[1].Y, res.trace_result.TrResult.latlongExcXY[j].latlongs[1].X)], {
                       color: "#0000FF",
                       weight: 1.5,
                       opacity: 1
                   });
                            var myIcon = L.divIcon({
                                className: 'div',
                                iconSize: [20, 20],
                                iconAnchor: [10, 10],
                                popupAnchor: [0, 0],
                                html: "<div style=color:#0000FF;font-weight:800;font-size:20px'> <b>" + res.trace_result.TrResult.latlongExcXY[j].latlongs[0].Code + "</b></div>"

                            }); 
                            var exch_text = new L.Marker(L.latLng(res.trace_result.TrResult.latlongExcXY[j].latlongs[0].Y, res.trace_result.TrResult.latlongExcXY[j].latlongs[0].X), { icon: myIcon } ) ;
                            redlining.addLayer(exch_text);
                            if (res.trace_result.TrResult.latlongExcXY[j].latlongs.length > 2)
                                for (var i = 2; i < res.trace_result.TrResult.latlongExcXY[j].latlongs.length; i++) {
                                    exch_mar.addLatLng(L.latLng(res.trace_result.TrResult.latlongExcXY[j].latlongs[i].Y, res.trace_result.TrResult.latlongExcXY[j].latlongs[i].X));
                                }
                            redlining.addLayer(exch_mar);
                        }
                    }
                }
            //==================
            //===term points====
            //==================
            if (res.trace_result.TrResult.latlongsTermPoint != null)
                if (res.trace_result.TrResult.latlongsTermPoint.length > 0) {
                    for (var i = 0; i < res.trace_result.TrResult.latlongsTermPoint.length; i++) {
                        var fdc_draw = [{
                            "type": "Feature",
                            "properties": {
                                "LAT": res.trace_result.TrResult.latlongsTermPoint[i].Y,
                                "LONG": res.trace_result.TrResult.latlongsTermPoint[i].X,
                                "TermPointType": res.trace_result.TrResult.latlongsTermPoint[i].TermPointType,
                                "TermPointCode": res.trace_result.TrResult.latlongsTermPoint[i].Code,
                                "Tooltip": res.trace_result.TrResult.latlongsTermPoint[i].tooltip
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [res.trace_result.TrResult.latlongsTermPoint[i].X, res.trace_result.TrResult.latlongsTermPoint[i].Y]
                            }
                        }]; 
                        var termTextIcon = L.divIcon({
                            className: 'leaflet-mouse-free_text',
                            iconSize: [180, 20],
                            iconAnchor: [20, 10],
                            popupAnchor: [0, -25],
                            html: "</br></br><b><font size='3' color='"+cbl_color+"'>" +
                                res.trace_result.TrResult.latlongsTermPoint[i].Code + "</b> "

                        })
                        redlining.addLayer(L.geoJson(fdc_draw, {
                            pointToLayer: function (feature, latlng) {
                                return L.marker(latlng, {
                                    icon: termTextIcon
                                });
                            }
                        }));                                
                        var term_color = "red";
                        if (res.CableId == 1 || res.CableId == 3) term_color = "purple";
                        else if (res.CableId == 2 || res.CableId == 4) term_color = "maroon";   
                        var termIcon = L.icon({
                            iconUrl: RootUrl + 'Images/legend/' + term_color + '/' + res.trace_result.TrResult.latlongsTermPoint[i].IconFile,
                            iconRetinaUrl: RootUrl + 'Images/legend/' + term_color + '/' + res.trace_result.TrResult.latlongsTermPoint[i].IconFile,
                            iconSize: [res.trace_result.TrResult.latlongsTermPoint[i].sym_width, res.trace_result.TrResult.latlongsTermPoint[i].sym_height],
                            iconAnchor: [res.trace_result.TrResult.latlongsTermPoint[i].sym_width / 2, res.trace_result.TrResult.latlongsTermPoint[i].sym_height / 2],
                            popupAnchor: [res.trace_result.TrResult.latlongsTermPoint[i].sym_width / 2, res.trace_result.TrResult.latlongsTermPoint[i].sym_height / 2],
                        });
                        var layer_term = L.geoJson(fdc_draw, {
                            pointToLayer: function (feature, latlng) {
                                return L.marker(latlng, {
                                    icon: termIcon
                                });
                            }
                           , onEachFeature: onEachFeature
                        }) ;
                        redlining.addLayer(layer_term);
                        var id_layer_term = L.Util.stamp(layer_term);
                        if (res.trace_result.TrResult.latlongsTermPoint[i].TermPointType != "Splice") {
                            equip_panel_context = equip_panel_context + '<tr class="feature-row"  onclick="clickTermPoint(' + id_layer_term + ')"  id="' + id_layer_term+
                                '"lat="' + (res.trace_result.TrResult.latlongsTermPoint[i].Y) +
                                '"lng="' + (res.trace_result.TrResult.latlongsTermPoint[i].X) +
                                '">' +
                                '<td style="vertical-align: middle;    width: 40px;"><img width="40"  src="' + RootUrlImage + '/Images/legend/' + term_color + '/' + res.trace_result.TrResult.latlongsTermPoint[i].IconFile + '"></td>' +
                                '<td style= "width: 180px;">' + res.trace_result.TrResult.latlongsTermPoint[i].TermPointType +
                                ' ' + res.trace_result.TrResult.latlongsTermPoint[i].Code +
                                '</td><td style="vertical-align: middle; width: 18px;"><i class="fa fa-chevron-right pull-right"></i></td><td></td></tr>';
                        }
                    }
                }
            
                   
                
                    equip_panel_context = equip_panel_context + '</tbody></table></div > </div > </div >';
            $("#accordionPanelsidebar_list").append(equip_panel_context);
            //====================equp_tbl
            redlining.addTo(map);  
            map.setView(L.latLng(lat, long), 15, { animation: true });
        }
        map.spin(false);
    }
});
} 
};

function onEachFeature(feature, layer) { 
    if (feature.properties) {
        layer.on({
            click: function (e) { 
                var term_tooltip = TermTooltipDisplay(layer.feature.properties.TermPointType,
                                layer.feature.properties.TermPointCode, layer.feature.properties.Tooltip
                                , layer.feature.properties.LAT, layer.feature.properties.LONG); 
                L.popup({ maxWidth: 800 })
                           .setLatLng(e.latlng)
                           .setContent(term_tooltip)
                           .openOn(map); 
                if (layer.feature.properties.LAT == 0) { 
                    highlight.addLayer(L.polyline(layer.getLatLngs(), {
                        color: "#10BF04",
                        weight: 3,
                        opacity: 1
                    }).bindPopup(term_tooltip)); 
                }
            } 
        });
    } 
};

function TermTooltipDisplay(TermPointType,TermPointCode,Tooltip, LAT, LONG) { 
    highlight.clearLayers(); 
    var tooltip_div = "";
    //  var GoogleLink = "https://www.google.com/maps?q=" + layer.feature.properties.LAT + " " + layer.feature.properties.LONG 
    var LATpoint = LAT;
    LATpoint = LATpoint.toFixed(6);
    var Longpoint = LONG;
    Longpoint = Longpoint.toFixed(6); 
    tooltip_div =
    "<table style='background-color:#FFF;color:#000'>" +
  "<tr><td class='td1'>" +  TermPointType + "</td><td class='td2'> :&nbsp;</td><td class='td3'><b>" +  TermPointCode + "</b></td></tr>"; 
    if ( Tooltip.length > 0) {
        var t_content =  Tooltip.split(";");
        for (var i = 0; i < t_content.length; i++) {
            tooltip_div = tooltip_div + "<tr><td class='td1'>" + t_content[i].split(":")[0] + "</td><td class='td2'> :&nbsp;</td><td class='td3'>" + t_content[i].split(":")[1] + "</td></tr>";
        }
    }
    if (LAT != 0)
        tooltip_div = tooltip_div + "<tr><td class='td1'>Lat/Long</td><td class='td2'> :&nbsp;</td><td class='td3'>" + LATpoint + ", " + Longpoint + "</td></tr>";
   tooltip_div = tooltip_div + "</table>";
   var div_content = document.createElement("p");
    div_content.innerHTML = tooltip_div;
    return div_content;
}; 
function clickTermPoint(id) { 
    var collection = redlining.getLayer(id).toGeoJSON(); 
    map.setView([collection.features[0].properties.LAT, collection.features[0].properties.LONG], 19);
    var term_tooltip = TermTooltipDisplay(collection.features[0].properties.TermPointType,
        collection.features[0].properties.TermPointCode, collection.features[0].properties.Tooltip
        , collection.features[0].properties.LAT, collection.features[0].properties.LONG);
    L.popup({ maxWidth: 800 })
        .setLatLng([collection.features[0].properties.LAT, collection.features[0].properties.LONG])
        .setContent(term_tooltip)
        .openOn(map);
};