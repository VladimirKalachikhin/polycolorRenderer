# polycolorRenderer [![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
## v. 0.2
The Leaflet L.Renderer upon the idea [leaflet-polycolor](https://github.com/Oliv/leaflet-polycolor) project.  
Suitable for color-coding a Leaflet polyline based on additional values, e.g. altitude, speed, depth, etc... Main goal the renderer is a gradient color of segments to represent continuous values.  
 The color code maybe created by [value2color](https://github.com/VladimirKalachikhin/value2color) function.  
Additionally, it is possible to set the `weight` option of each L.Polyline segment.

It can be used both for L.Polyline and L.GeoJSON LineString features.

## Usage
`<script src="polycolorRenderer.js"></script>`  

As the renderer has a narrow purpose, only the following options of L.Polyline are supported:  
- color
- opacity
- weight
- lineCap
- lineJoin
- dashArray
- dashOffset

### Polyline
```
let polyline = L.polyline(latLngs, {
	noClip: true,
	smoothFactor: 0,
	renderer: new polycolorRenderer(),
	colors: [......], // array of html colors
	useGradient: false,
	weights: [......] // array of segment's width
}).addTo(map);
```

### GeoJSON
It makes no sense to use the renderer for coloring GeoJSON LineString to solid colors. This is done naturally through `style` option. But it is impossible to make a gradient color in this way. Therefore, a renderer is needed:
```
var polyline = L.geoJSON(geoJSONdata,{
	style: function(feature){
		return {
			noClip: true,
			smoothFactor: 0,
			renderer: new polycolorRenderer(),
			colors: [......], // array of html colors
			weights: [......] // array of segment's width
		}
	}
}).addTo(map);
```

#### GeoJSON MultiLineString
The function L.geoJSON create "MultiPolyline" L.Polyline object. In this case, the `colors` array must contain arrays of colors similar in structure to GeoJSON MultiLineString "coordinates" object.  
However, any of these color arrays can be empty. Then all segments of the corresponding section will be colored in the color specified by the parameter `color`. Therefore, if you have a line of thousands of segments, and there are only a few additional values, for example, depths, there is no need to create a color array of thousands of *null* values. It is enough to make an GeoJSON MultiLineString object and a color array of three arrays:
```
const colors = [
	[],
	[few of color values...],
	[]
];
```
The same for `weights` array.

### Suppression of Leaflet's line optimization
The next two L.Polyline options suppress simplification and smoothing of the line created by Leaflet:
```
noClip: true,
smoothFactor: 0,
```
As a result, all segments defined when creating a polyline will be present in the resulting line, and they can be colored correctly. BUT! The empty GeoJSON MultiLineString segments, such as:  

```
geometry: { type: "MultiLineString",
	coordinates: Array [ 
		[],
		[…]
	]
}
```

will be ignored by the Leaflet regardless of any options. The procedure for creating of `colors` array should take this into account.

### Options

- `colors` \<Array>: An array of html colors strings `rgb(x,y,z), rgba(x,y,z,t)`or #3388ff, or array of arrays of colors. Any of these arrays can be empty.
- `useGradient` \<Boolean>: Use or not gradient to smooth colors. Defaults to `true. `
- `weights` \<Array>: An array of segments stroke width in pixels. The number of values of this array is equal to the number of segments, that is a number of colors - 1.

If `colors` or weight are `undefined`, the default `color`or weight parameter is used.
To leave default value, use `null` in array:  
`['rgb(0, 0, 0)', null, 'rgb(0, 45, 120)']`  
An empty array has the same as `null`: applying the default value.  
No gradient is made between the default and the specified values.

## Efficiency
Using the renderer requires resources and will work slower. In addition, the Leaflet calls the renderer every time the map is moved. For dynamic applications, this can result in a heavy load.

## Demo
The _examples_ directory has a complete example of using the polycolorRenderer with GeoJSON data.