/*global L,
  API_URL,
  ATTRIBUTIONS,
  CENTER,
  overlayMaps,
  baseMaps,
  SHORT_CITY_NAMES,
  REVERSE_URL,
  layerOSMfr
   */
/**
 * Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
 * Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr
 */

var searchPointsFeature = function() {
  "use strict";
}; // JSLint hack. redefined after map()

var searchPoints = L.geoJson(null, {
  onEachFeature: searchPointsFeature()
});

var showSearchPoints = function(geojson) {
  "use strict";
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
};

var formatResult = function(feature, el) {
  "use strict";
  var title = L.DomUtil.create("strong", "", el),
    detailsContainer = L.DomUtil.create("small", "", el),
    details = [];
  var types = {
    housenumber: "numéro",
    street: "rue",
    locality: "lieu-dit",
    hamlet: "hamlet",
    village: "village",
    city: "ville",
    commune: "commune"
  };
  title.innerHTML = feature.properties.name;
  if (types[feature.properties.type]) {
    L.DomUtil.create("span", "type", title).innerHTML = types[feature.properties.type];
  }
  if (feature.properties.city && feature.properties.city !== feature.properties.name) {
    details.push(feature.properties.city);
  }
  if (feature.properties.context) {
    details.push(feature.properties.context);
  }
  detailsContainer.innerHTML = details.join(", ");
};

var photonControlOptions = {
  resultsHandler: showSearchPoints,
  placeholder: "Ex. 6 quai de la tourelle cergy…",
  position: "topright",
  url: API_URL,
  formatResult: formatResult,
  noResultLabel: "Aucun résultat",
  feedbackLabel: "Signaler",
  feedbackEmail: "adresses@data.gouv.fr",
  minChar: function(val) {
    "use strict";
    return SHORT_CITY_NAMES.indexOf(val) !== -1 || val.length >= 3;
  },
  submitDelay: 200
};

var photonReverseControlOptions = {
  resultsHandler: showSearchPoints,
  position: "topleft",
  url: REVERSE_URL,
  formatResult: formatResult,
  noResultLabel: "Aucun résultat",
  tooltipLabel: "Cliquer sur la carte pour obtenir l\'adresse"
};

searchPointsFeature = function(feature, layer) {
  "use strict";
  layer.on("click", function() {
    map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 16);
  });
  layer.bindPopup(feature.properties.name + "<a class=\"geo\" href=\"geo:" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "\"><i class=\"zmdi-navigation zmdi-2x\"></i></a>");
};
