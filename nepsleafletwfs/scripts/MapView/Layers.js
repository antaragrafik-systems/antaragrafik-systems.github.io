////var BaseMapGoogle = L.gridLayer.googleMutant({
////    type: 'roadmap'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
////});
////var BaseMapGoogleHybrid = L.gridLayer.googleMutant({
////    type: 'hybrid'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
////});

var chosenLayers = "";

for (let i = 0; i <= 72; i++) {
    chosenLayers += i;
    chosenLayers += (i < 72) ? "," : "";
}

var BaseMapOpenStreet = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 7,
    attribution: '© OpenStreetMap'
}); 

var NoMap = L.geoJson(null);

var Civil = new L.TileLayer.BetterWMS(Networks_Web_Service + 'NwWms1/wms', {
    zIndex: 100,
    maxZoom: 22,
    minZoom: 14,
    //layers: 'Manhole_Label,Manhole',
    layers: 'WMSCIVIL',
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Fiber = new L.TileLayer.BetterWMS(Networks_Web_Service + 'NwWms3/wms', {
    zIndex: 99,
    maxZoom: 22,
    minZoom: 16,
    layers: 'LEGEND_FOR_NEPSFIBERWMS33',
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Exchange = new L.TileLayer.BetterWMS(Networks_Web_Service + 'NwWms2/wms', {
    zIndex: 99,
    maxZoom: 22,
    minZoom: 14,
    layers: 'EXCHANGEBUILDING',
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var FDCBoundary = new L.TileLayer.BetterWMS(Networks_Web_Service + 'NwWms3/wms', {
    zIndex: 99,
    maxZoom: 22,
    minZoom: 14,
    layers: 'BNDFDC',
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Feature_Landbase = new L.TileLayer.BetterWMS(Networks_Web_Service + 'NwWms4/wms', {
    zIndex: 99,
    maxZoom: 22,
    minZoom: 14,
    layers: 'LANDBASELOT,LANDBASEROAD',
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Feature_AdminLandbase = new L.TileLayer.BetterWMS(Networks_Web_Service + 'NwWms5/wms', {
    zIndex: 99,
    maxZoom: 22,
    minZoom: 14,
    layers: 'ADMINSTREET,ADMINPROPERTY',
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_KK = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_KK/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_KG = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_KG/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_JH = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_JH/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_KV = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_KV/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_MK = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_MK/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_AS = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_AS/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_KN = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_KN/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_JP = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_JP/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_TG = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_TG/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 18,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

var Landbase_PG = new L.TileLayer.BetterWMS(GDS_Web_Service + 'CLB_PG/MapServer/WMSServer?', {
    zIndex: 98,
    maxZoom: 22,
    minZoom: 14,
    layers: chosenLayers,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    unloadInvisibleTiles: true,
    reuseTiles: true,
    updateWhenIdle: false,
    tileSize: 512,
    version: '1.3.0',
    attribution: "BaseMap"
});

//var NewLayer = new L.TileLayer.BetterWMS(FOMS_Web_Service, {
//    zIndex: 100,
//    maxZoom: 20,
//    minZoom: 18,
//    layers: 'NewLayer',
//    format: 'image/svg+xml',
//    transparent: true,
//    opacity: 1,
//    unloadInvisibleTiles: true,
//    reuseTiles: true,
//    updateWhenIdle: false,
//    tileSize: 512,
//    attribution: "BaseMap"
//});