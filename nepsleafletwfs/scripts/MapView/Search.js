function typeSearch() {
    var search_type = document.getElementById("search_param").value;
    var job_name = document.getElementById("valJobName").value;
    var current_exc = job_name.split("-")[0];

    $("#txtSearch").autocomplete({
        source: function (request, response) {
            {
                if (search_type == "" || search_type == "LatLng")
                    response(null);
                else {
                    $.ajax({
                        type: "GET",
                        url: RootUrl + "Search/" + search_type,
                        dataType: "html",
                        data: {
                            "prefixText": request.term,
                            "currentEXC": current_exc
                        },
                        beforeSend: function () {
                            //document.getElementById("btnSearchLocate").innerHTML = "<i class='fa fa-circle-notch fa-spin'></i>";
                        },
                        cache: false,
                        success: function (data) {
                            var res = jQuery.parseJSON(data);
                            //document.getElementById("btnSearchLocate").innerHTML = "<i class='fa fa-crosshairs'></i>";
                            response($.map(res.result, function (item) {
                                return {
                                    ATTR1: item.ATTR1,
                                    ATTR2: item.ATTR2,
                                    ATTR3: item.ATTR3,
                                    LAT: item.LAT,
                                    LNG: item.LNG
                                }
                            }));
                        }
                    });
                }
            }
        },
        minLength: 1,
        select: function (event, ui) {
            document.getElementById("txtSearch").value = ui.item.ATTR1 + ", " + ui.item.ATTR2 + ", " + ui.item.ATTR3;
            document.getElementById("txtSearchCoord").value = ui.item.LAT + "," + ui.item.LNG;
            //document.getElementById("txtSearchSWID").value = ui.item.SW_ID;

            var search_type = document.getElementById("search_param").value;
            // sidebar_list.hide();

            if (search_type != "LatLng")  
              viewFeatureDetails(search_type, ui.item.ATTR1 + ", " + ui.item.ATTR2 + ", " + ui.item.ATTR3, ui.item.LAT, ui.item.LNG);
            else {
                document.getElementById("txtSearchSWID").value = ui.item.ATTR1;
                NavigateToJob(ui.item.ATTR1);
            }

            return false;
        }
    }).autocomplete("instance")._renderItem = function (ul, item) {
        var search_type = document.getElementById("search_param").value;

        if (item.ATTR1 == null) item.ATTR1 = " ";
        if (item.ATTR2 == null) item.ATTR2 = " ";
        if (item.ATTR3 == null) item.ATTR3 = " ";

        var res_content = "<div class='row divSearchList'>" +
                "<table><tr><td class='col-3 trsearch'>" + item.ATTR1 + "</td>" +
                "<td class='col-8 trsearch'>" + item.ATTR2 + "</td>" +
                "<td class='col-1 trsearch'>" + item.ATTR3 + "</td></tr></table>" +
            "</div>";

        if (search_type == "FDC") {
            var res_content = "<div class='row divSearchList' style='background-color: ghostwhite'>" +
                "<table><tr><td class='col-8 trsearch'>" + item.ATTR1 + "</td>" +
                "<td class='col-3 trsearch'>" + item.ATTR2 + "</td>" +
                "<td class='col-1 trsearch'>" + item.ATTR3 + "</td></tr></table>" +
                "</div>";
        } else if (search_type == "CABLE") {
            var res_content = "<div class='row divSearchList' style='background-color: ghostwhite'>" +
                "<table><tr><td class='col-8 trsearch'>" + item.ATTR1 + "</td>" +
                "<td class='col-3 trsearch'>" + item.ATTR2 + "</td>" +
                "<td class='col-1 trsearch'>" + item.ATTR3 + "</td></tr></table>" +
                "</div>";
        }

        return $("<li id='liSearch'>")
            .append(res_content)
            .appendTo(ul);
    };

    if (search_type == "LatLng") {
        if (event.which == 13 || event.keyCode == 13) {
            startSearch();
            return;
        }
    }
};

function startSearch() {
    highlight.clearLayers();
    var search_type = document.getElementById("search_param").value;
    var search_tooltip = "";
    var x = document.getElementById("txtSearch").value;
    // sidebar_list.hide();

    if (search_type == "LatLng") {
        var pos = x.trim();
        var zoom = 19;
        if (pos && zoom) {
            if (pos.includes(',')) {
                var locat = pos.split(',');
            }
            else {
                var locat = pos.split(' ');
            }
            if (locat.length == 2) {
                search_tooltip = "<table><tr><td class='td1'>Lat/Long</td><td class='td2'> :&nbsp;</td><td class='td3'>" + pos + "</td></tr></table>";
                var myIcon = L.icon({
                    iconUrl: RootUrl + 'Images/marker-icon.png',
                    iconRetinaUrl: RootUrl + 'Images/marker-icon-2x.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [0, -41],

                });

                var div_content = document.createElement("p");
                div_content.innerHTML = search_tooltip;
                var div_pointer = document.createElement("div");
                div_pointer.id = "Search_Location";
                div_pointer.appendChild(div_content);
                var mar = L.marker(locat, { icon: myIcon }, { opacity: 1 });
                highlight.addLayer(mar);
                map.fitBounds(highlight.getBounds());
                if (map.getZoom() > zoom)
                    map.setZoom(zoom);
                mar.bindPopup(div_content).openPopup();
            }
        }
    }
};

function changeSearchRadio() {
    document.getElementById("txtSearch").value = "";
    document.getElementById("txtSearchCoord").value = "";
    // document.getElementById("SearchTooltip").innerHTML = "";

    txtSearch.type = "search";

    if (document.getElementById('EXC').checked) {
        document.getElementById("txtSearch").placeholder = "EXC ABB / EXC NAME";
        document.getElementById("search_param").value = "EXC";
    } else if (document.getElementById('FDC').checked) {
        document.getElementById("txtSearch").placeholder = "FDC Code";
        document.getElementById("search_param").value = "FDC";
    } else if (document.getElementById('LatLng').checked) {
        document.getElementById("txtSearch").placeholder = "Latitude, Longitude";
        document.getElementById("search_param").value = "LatLng";
    } else if (document.getElementById('CABLE').checked) {
        document.getElementById("txtSearch").placeholder = "Cable Description";
        document.getElementById("search_param").value = "CABLE";
    }
};

function clearSearch() {
    document.getElementById("txtSearch").value = "";
    document.getElementById("txtSearchCoord").value = "";
    document.getElementById("txtSearchSWID").value = "";
    document.getElementById("SearchTooltip").innerHTML = "";
}
 
function viewFeatureDetails(search_type, tooltip, lat, lng) {
    var search_tooltip = "<table><tr><td class='td1'>" + search_type + "</td><td class='td2'> :&nbsp;</td><td class='td3'>" + tooltip + "</td></tr></table>";

    if (search_type == "CABLE") {
        var cable_desc = tooltip.split(',')[0].trim();
        var cable_id = tooltip.split(',')[1].trim();
        var hideCableButtonClass = "";

        if (statusExist) hideCableButtonClass = "hideOnLoad";
        else hideCableButtonClass = "";

        var saveButton = "<button class='btn rounded-pill btn-primary mt-3 text-center px-5 " + hideCableButtonClass +
            "' onclick='AddCable(\"" + cable_desc + "\"," + cable_id + ")'>Add Cable to Job</button>";
        search_tooltip += saveButton;
    }

    var myIcon = L.icon({
        iconUrl: RootUrl + 'Images/marker-icon.png',
        iconRetinaUrl: RootUrl + 'Images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],

    });

    var div_content = document.createElement("p");
    div_content.innerHTML = search_tooltip;
    var div_pointer = document.createElement("div");
    div_pointer.id = "Search_Location";
    div_pointer.appendChild(div_content); 
    var mar = L.marker([lat, lng], { icon: myIcon }, { opacity: 1 });
    highlight.clearLayers();
    highlight.addLayer(mar);
    map.fitBounds(highlight.getBounds());
    if (map.getZoom() > 19)
        map.setZoom(19);
    mar.bindPopup(div_content).openPopup();
};