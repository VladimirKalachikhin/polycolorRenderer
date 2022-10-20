# polycolorRenderer [![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

This is L.Renderer from [leaflet-polycolor](https://github.com/Oliv/leaflet-polycolor) project.  

Suitable for color-coding a Leaflet polyline based on additional values, e.g. altitude, speed, depth, etc.. Main goal is a gradient color of segments to represent continuous values.

It can be used both for coloring both L.Polyline and L.GeoJSON LineString features.

## Usage
<script src="polycolorRenderer.js"></script>

### Polyline
```
let polyline = L.polyline(latLngs, {
	renderer: new polycolorRenderer(),
	colors: [......], // array of rgb() colors
	useGradient: false
}).addTo(map);
```

### GeoJSON
It makes no sense to use the renderer for coloring GeoJSON LineString to solid colors. This is done naturally through `style` option. But it is impossible to make a gradient color in this way. Therefore, a renderer is needed:
```
var polyline = L.geoJSON(geoJSONdata,{
	style: function(feature){
		return {
			renderer: new polycolorRenderer(),
			colors: [......] // array of rgb() colors
		}
	}
}).addTo(map);
```

### Options
- colors `<Array>` : An array of rgb colors strings `rgb(x,y,z)`
- useGradient `<Boolean>` : Use or not gradient to smooth colors. Defaults to `true`

If `colors` are `undefined`, the default `color` parameter is used.
To leave default color, use `null` in colors. `['rgb(0, 0, 0)', null, 'rgb(0, 45, 120)']`

## Demo
The _examples_ directory has a complete example of using the polycolorRenderer with GeoJSON data.