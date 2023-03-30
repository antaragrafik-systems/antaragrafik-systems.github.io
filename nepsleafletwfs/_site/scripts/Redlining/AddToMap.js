  
//var TaskButton = L.easyButton({
//    position: 'topleft',
//    states: [
//        {
//            stateName: 'unloaded',

//            icon: '<img src="' + RootUrl + 'Images/file.png" width="17" >',
//            title: 'Task Panel',
//            onClick: function (btn, map) {
                
//                sidebar_tooltip.hide();
                
//            }
//        }
//    ]

//});

//-----------------------------------------
// Initialise the FeatureGroup to store editable layers
//  drawnItems = new L.FeatureGroup();
//map.addLayer(drawnItems);
drawnItems = L.featureGroup().addTo(map);

var drawControl = new L.Control.Draw({
    draw: {
        circle: false,
          marker: false,
        circlemarker: false ,
         polyline:false
    },
    edit: { featureGroup: drawnItems }

});

map.addControl(drawControl);
//TaskButton.addTo(map);

var bnd_cnt = 0;

map.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType
    var layer = e.layer;

    // Do whatever else you need to. (save to db, add to map etc)

    bnd_cnt = bnd_cnt + 1;

    if (bnd_cnt == 1) {
        drawnItems.addLayer(layer);

        GetDrawnDistance(layer);

        $("#modalSaveAs").modal("show");
        //$("#modalSaveAs").on('shown.bs.modal', function () {
        //    $("#txtFileName").focus();
        //});
    } else {
        alert("You can only draw one boundary at a time");
    }
});

map.on("draw:edited", function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
        GetDrawnDistance(layer);
    });
});

map.on(L.Draw.Event.DELETED, function (e) {
    //var deletedLayers = e.layers._layers;

    //for (var layer in deletedLayers) {
    //    console.log(deletedLayers[layer]);
    //}
    $("#slcGRNFDC").prop("selectedIndex", 0);
    $("#slcGRNFDP").prop("selectedIndex", 0);
    $("#slcGRNFDB").prop("selectedIndex", 0);
    $("#slcPJTNAME").prop("selectedIndex", 0);
    $("#slcTCHDSGN").prop("selectedIndex", 0);

    bnd_cnt = 0;
});

/*
 * Custom functions
 */

function ExtractPolygon() {    
    var user = document.getElementById("valUserName").value;
    var job = document.getElementById("valJobName").value;
    var cable = document.getElementById("txtCable").value;
    var grnFDC = document.getElementById("slcGRNFDC").value;
    var grnFDP = document.getElementById("slcGRNFDP").value;
    var grnFDB = document.getElementById("slcGRNFDB").value;
    var projName = document.getElementById("slcPJTNAME").value;
    var techDesign = document.getElementById("slcTCHDSGN").value;

    cable = cable == "" ? "" : cable.split(',')[1].trim();

    var coords = [];

    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            layer.getLatLngs().forEach(function (element) {
                element.forEach(function (latlng) {
                    coords.push(latlng.lng);
                    coords.push(latlng.lat);
                });
                coords.push(element[0].lng);
                coords.push(element[0].lat);
            });
        }
    });

    $(".progress-bar").show();

    $.ajax({
        type: "POST",
        url: RootUrl + "RedLining/PostTask",
        data: {
            USER_NAME: user,
            JOB_NAME: job,
            COORDINATES: coords,
            CABLE_FID: cable,
            GRN_FDC: grnFDC,
            GRN_FDP: grnFDP,
            GRN_FDB: grnFDB,
            PROJECT_NAME: projName,
            TECH_DESIGN: techDesign,
        },
        success: function (response) {
            if (response == "ok") {
                alert("Extraction Started.");
                window.location.reload();
            } else {
                alert(response);
            }
        },
        complete: function () {
            $(".progress-bar").hide();
        }
    });
}

function LoadPolygon(user, job) {
    $.ajax({
        type: "GET",
        url: RootUrl + "RedLining/LoadTask",
        data: {
            USER_NAME: user,
            JOB_NAME: job
        },
        success: function (response) {
            console.log(response);
            if (response.Success) {
                var data = response.data;

                //#region Create polygon from fetched coordinates

                //Area
                var poly = new L.Polygon(L.latLng(data.COORDINATES[1], data.COORDINATES[0]),
                    L.latLng(data.COORDINATES[3], data.COORDINATES[2]));

                for (i = 0; i < data.COORDINATES.length - 3; i += 2) {
                    poly.addLatLng(L.latLng(data.COORDINATES[i + 1], data.COORDINATES[i]));
                }

                poly.setStyle({
                    stroke: true,
                    color: '#3388ff',
                    weight: 4,
                    opacity: 0.5,
                    fill: true,
                    fillColor: null, //same as color by default
                    fillOpacity: 0.2,
                    clickable: true
                });

                //#endregion

                //#region For Printing (needs polyline)

                //var bnd_print = L.geoJson(null);

                //Line
                //bnd_print = new L.Polyline([L.latLng(data.COORDINATES[1], data.COORDINATES[0]),
                //L.latLng(data.COORDINATES[3], data.COORDINATES[2])]);

                //for (i = 4; i < data.COORDINATES.length - 3; i += 2) {
                //    bnd_print.addLatLng(L.latLng(data.COORDINATES[i + 1], data.COORDINATES[i]));
                //}

                //var lastX = data.COORDINATES.length - 1;
                //var lastY = data.COORDINATES.length - 2;

                //bnd_print.addLatLng(L.latLng(data.COORDINATES[lastX], data.COORDINATES[lastY]));

                //bnd_print.setStyle({
                //    stroke: true,
                //    color: '#3388ff',
                //    weight: 4,
                //    opacity: 0.5,
                //    fill: true,
                //    fillColor: null, //same as color by default
                //    fillOpacity: 0.2,
                //    clickable: true
                //});

                //#endregion

                //#region Add popup to view attributes details

                var id = L.Util.stamp(poly);
                var div_content = document.createElement("div");

                div_content.id = id;

                var jobStatus = "<span class='font-weight-bold'>STATUS : </span>";
                jobStatus += "<span class='text-primary' id='job-status'>" + data.STATUS + "</span>"
                //jobStatus += (data.STATUS == "no") ? "<span class='text-primary' id='job-status'>NOT YET PROCESSED</span>"
                //    : (data.STATUS == "process") ? "<span class='text-primary' id='job-status'>PROCESSING</span>"
                //    : (data.STATUS == "fail") ? "<span class='text-danger' id='job-status'>PROCESS FAILED</span>" : "<span class='text-success' id='job-status'>PROCESS SUCCESS</span>";

                var innerHTMLtext = "<h5 class='pt-3 pb-2'>Job Details</h5>" + jobStatus +
                    "<div class='text-center pt-3'>" +
                    "<button type='button' class='btn btn-secondary rounded-pill px-3' data-bs-toggle='modal' data-bs-target='#modalSaveAs'>Open Extraction Details</button>" +
                    "</div>" +
                    "<div class='text-center pt-3'>" +
                    "<button type='button' class='btn btn-outline-primary rounded-pill px-3' id='btnPortal' onClick='OpenSPTPortal()'>Open Job in SPT Portal</button>"
                    "</div>";
                div_content.innerHTML = innerHTMLtext;

                var div_pointer = document.createElement("div");

                div_pointer.appendChild(div_content);
                poly.bindPopup(div_content);

                //#endregion

                GetDrawnDistance(poly);

                drawnItems.addLayer(poly);
                map.addLayer(drawnItems);                

                map.fitBounds(drawnItems.getBounds());
                //map.flyTo(bnd_print.getBounds().getCenter());

                //#region Prepare attributes value inside popup

                GetCableDesc(data.CABLE_FID);
                document.getElementById("slcGRNFDC").value = data.GRN_FDC;
                document.getElementById("slcGRNFDP").value = data.GRN_FDP;
                document.getElementById("slcGRNFDB").value = data.GRN_FDB;
                document.getElementById("slcPJTNAME").value = data.PROJECT_NAME;
                document.getElementById("slcTCHDSGN").value = data.TECH_DESIGN;

                $("#btnExtract").text("Not Allowed to Modify");

                $(".disableOnLoad").prop("disabled", true); //temporarily?                

                $(".req, .reqOne").removeClass("req reqOne");

                //#endregion

                $(".leaflet-draw-section a").addClass("leafletBtnDisabled").click(function (e) {
                    e.preventDefault();
                });
                //$("#btnPortal").show();

                bnd_cnt = 1;
                statusExist = true;
            } else {
                if (response.Message != "") alert(response.Message);
                else $(".hideOnLoad").removeClass("hideOnLoad");  //temporarily?
            }
        }
    })
}

function LoadExistingFDCBND() {
    var fid = "100981351";

    $.ajax({
        type: "GET",
        url: RootUrl + "RedLining/LoadExistingBoundary",
        data: {
            FID: fid
        },
        success: function (response) {
            if (response.Success) {
                var data = response.data;

                //#region Create polygon from fetched coordinates

                //Area
                var poly = new L.Polygon(L.latLng(data.COORDINATES[1], data.COORDINATES[0]),
                    L.latLng(data.COORDINATES[3], data.COORDINATES[2]));

                for (i = 0; i < data.COORDINATES.length - 3; i += 2) {
                    poly.addLatLng(L.latLng(data.COORDINATES[i + 1], data.COORDINATES[i]));
                }

                poly.setStyle({
                    stroke: true,
                    color: '#3388ff',
                    weight: 4,
                    opacity: 0.5,
                    fill: true,
                    fillColor: null, //same as color by default
                    fillOpacity: 0.2,
                    clickable: true
                });

                //#endregion

                //#region Add popup to view attributes details

                var id = L.Util.stamp(poly);
                var div_content = document.createElement("p");

                div_content.id = id;

                var innerHTMLtext = "<h5 class='pt-3 pb-2'>Extract this boundary?</h5>" +
                                    "<div class='text-center'><button type='button' class='btn btn-secondary rounded-pill' data-bs-toggle='modal' data-bs-target='#modalSaveAs'>Open Extraction Details</button>" +
                                    "</div>";
                div_content.innerHTML = innerHTMLtext;

                var div_pointer = document.createElement("div");

                div_pointer.appendChild(div_content);
                poly.bindPopup(div_content);

                //#endregion

                drawnItems.addLayer(poly);
                map.addLayer(drawnItems);
            }
        }
    })
}

function OpenSPTPortal() {
    var job = $("#valJobName").val();
    var user = $("#valUserName").val();

    var url = Portal_URL + "?jobName=" + job + "&userName=" + user;
    window.open(url, "_blank");
}

function AddCable(cable_desc, cable_id) {
    $("#txtCable").val(cable_desc + ", " + cable_id);

    if (bnd_cnt > 0) {
        map.fitBounds(drawnItems.getBounds());

        $("#modalSaveAs").modal("show");
    } else {
        alert("Cable Added. Please proceed to draw boundary.");
    }
}

function GetCableDesc(cable_id) {
    var job_name = document.getElementById("valJobName").value;
    var current_exc = job_name.split("-")[0];

    if (cable_id != 0) {
        $.ajax({
            type: "GET",
            url: RootUrl + "Search/CABLE",
            dataType: "html",
            data: {
                "prefixText": cable_id,
                "currentEXC": current_exc
            },
            cache: false,
            success: function (data) {
                var res = jQuery.parseJSON(data);

                res = res.result[0];

                document.getElementById("txtCable").value = res.ATTR1 + "," + res.ATTR2;
            }
        });
    }
}