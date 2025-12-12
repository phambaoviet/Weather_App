const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.TileJSON({
        url: 'https://api.maptiler.com/maps/base-v4/tiles.json?key=KhXpThc4UurM9zaDlaSp',
        tileSize: 512,
      }),
    }),
  ],
  target: 'map',
  view: new ol.View({
    center: ol.proj.fromLonLat([106.7009, 10.7769]),
    zoom: 13,
  }),
});

const marker = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [
      new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([106.7009, 10.7769])),
      }),
    ],
  }),
  style: new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],

      src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      scale: 0.8,
    }),
  }),
});

map.addLayer(marker);
