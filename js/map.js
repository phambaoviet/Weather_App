// const map = new ol.Map({
//   layers: [
//     new ol.layer.Tile({
//       source: new ol.source.TileJSON({
//         url: 'https://api.maptiler.com/maps/base-v4/tiles.json?key=KhXpThc4UurM9zaDlaSp',
//         tileSize: 512,
//       }),
//     }),
//   ],
//   target: 'map',
//   view: new ol.View({
//     center: ol.proj.fromLonLat([-43, -22]),
//     zoom: 13,
//   }),
// });

// const marker = new ol.layer.Vector({
//   source: new ol.source.Vector({
//     features: [
//       new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat([-43, -22])),
//       }),
//     ],
//   }),
//   style: new ol.style.Style({
//     image: new ol.style.Icon({
//       src: 'https://docs.maptiler.com/openlayers/default-marker/marker-icon.png',
//       anchor: [0.5, 1],
//     }),
//   }),
// });
// map.addLayer(marker);

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
      // Tôi đổi sang link icon chuẩn của OpenLayers để đảm bảo load được
      src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      scale: 0.8, // Thu nhỏ lại một chút nếu icon quá to
    }),
  }),
});

map.addLayer(marker);
