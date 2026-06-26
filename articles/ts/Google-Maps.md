# Google Maps

## AdvanceMarkers
AdvanceMarker is set to replace Markers.

> As of February 21st, 2024 (v3.56), google.maps.Marker is deprecated. 
We encourage you to transition to the new google.maps.marker.AdvancedMarkerElement class. 
Advanced markers provide substantial improvements over the legacy google.maps.Marker class.

* To use AdvanceMarkers, you MUST use 'mapId'.
  - The map is initialized without a valid Map ID, which will prevent use of Advanced Markers.
  - Can use 'DEMO_MAP_ID' for testing purposes.
* Unable to use CSS styling option when 'mapId' is set.
  - Google Maps JavaScript API: A Map's styles property cannot be set when a mapId is present. 
    When a mapId is present, Map styles are controlled via the cloud console. 
    Please see documentation at https://developers.google.com/maps/documentation/javascript/styling#cloud_tooling
* google.maps.Marker => google.maps.marker.AdvancedMarkerElement


## Versions
https://developers.google.com/maps/documentation/javascript/versions
- Version 3.59 (Mid-November)
- Version 3.58
- Version 3.57
- Version 3.56
- Version 3.55
  - After mid-November, this version will be deleted, and can no longer be used. Any attempt to load this version will be ignored, and you will receive your default channel instead


## Vue-Google-Maps

* "@fawmi/vue-google-maps": "0.9.67"
  - This version has a dependency of `"@googlemaps/markerclustererplus": "^1.2.10"`, which uses the older Marker and Cluster libraries.

* "@fawmi/vue-google-maps": "0.9.79"
 - This version has a dependency of `"@googlemaps/markerclusterer": "^2.0.3"`, which is the newer Cluster library.


## Cluster SVGs

```html
<div class="cluster cluster-0" title=""
  style="z-index: 1000001; top: -31px; left: -31px; width: 53px; height: 52px; cursor: pointer; position: absolute; user-select: none;">
  <img alt="1" aria-hidden="true" src="/src/assets/svg/icons/alarmMarker.svg"
    style="position:absolute;clip:rect(0px, 53px, 52px, 0px)">
  <div aria-label="" style="position:absolute;top:20px;color:white;text-align:center;width:53px" tabindex="0">
    <span aria-hidden="true">1</span>
  </div>
</div>
```

```html
<svg xmlns="http://www.w3.org/2000/svg" fill="#0000ff" viewBox="0 0 240 240" width="50" height="50"
  transform="translate(0 25)">
  <circle cx="120" cy="120" opacity=".6" r="70"></circle>
  <circle cx="120" cy="120" opacity=".3" r="90"></circle>
  <circle cx="120" cy="120" opacity=".2" r="110"></circle>
  <text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle"
    font-family="roboto,arial,sans-serif">3</text>
</svg>
```