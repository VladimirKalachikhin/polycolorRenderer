/* Vladimir Kalachikhin v.kalachikhin@gmail.com CC BY-SA
The Renderer upon the idea https://github.com/Oliv/leaflet-polycolor 
to colorisation of L.Polyline segments
Only the following options are supported:
color, opacity, weight, lineCap, lineJoin, dashArray, dashOffset
Additional options:
colors - the array of html color strings, one per each L.Polyline point. Or array of arrays if L.Polyline is a MultiPolyline
useGradient - bool
Usage:
var polyline = L.polyline(latLngs, {
	renderer: new polycolorRenderer(),
	colors: colors,	// array of html color strings such as 'rgba(255, 255, 255, 0.75)' or '#3388ff'
	useGradient: true,
});
*/

const polycolorRenderer = L.Canvas.extend({
_updatePoly: function(layer) {

	if (!this._drawing) return;

	let i, j, len2, Point, prevPoint;
	// Polyline может быть MultiPolyline -- состоять из массива массивов координат
	// Например, когда она создаётся из GeoJSON MultiLineString.
	// Если Polyline сделана из одного массива координат, то в _parts -- один массив.
	if (!layer._parts.length) return;
	//console.log('polycolorRenderer.js [polycolorRenderer] layer:',layer);

	this._layers[layer._leaflet_id] = layer;	// ?
	const ctx = this._ctx;
	
	// Нормализуем базовый цвет и массив цветов
	let optColors;
	if((typeof layer.options.colors !== 'undefined') || Array.isArray(layer.options.colors)) {
		if(!Array.isArray(layer.options.colors[0])) optColors = [layer.options.colors];	// сделаем из options.colors массив массивов, такой же по структуре, как _parts
		else optColors = layer.options.colors;	// считаем, что options.colors уже такой же по структуре, как _parts
	}
	// Покрасим линии
	if (layer.options.stroke && layer.options.weight !== 0) {	// заданы обводка линии и её толщина
		if (ctx.setLineDash) {
			ctx.setLineDash(layer.options && layer.options._dashArray || []);
		}
		ctx.globalAlpha = layer.options.opacity;
		ctx.lineWidth = layer.options.weight;
		ctx.lineCap = layer.options.lineCap;
		ctx.lineJoin = layer.options.lineJoin;

		for (i = 0; i < layer._parts.length; i++) {	// для каждого куска MultiPolyline 
			for (j = 0, len2 = layer._parts[i].length - 1; j < len2; j++) {
				Point = layer._parts[i][j + 1];
				prevPoint = layer._parts[i][j];

				ctx.beginPath();
				ctx.moveTo(prevPoint.x, prevPoint.y);
				ctx.lineTo(Point.x, Point.y);

				if(optColors){
					if(optColors[i].length == 0) ctx.strokeStyle = layer.options.color;	// пустой массив, линию окрашиваем в указанный, или умолчальный цвет (layer.options.color всегда есть?)
					else if(optColors[i].length < (j+1)) ctx.strokeStyle = optColors[i][0] || layer.options.color;	// одно значение на все сегменты или неверное число значений, +1 потому что градиент
					else {	// массив значений цветов
						if(layer.options.useGradient) {
							ctx.strokeStyle = this._getStrokeGradient(ctx, prevPoint, Point, optColors[i][j] || layer.options.color, optColors[i][j+1] || layer.options.color);	// требуется градиент
						}
						else ctx.strokeStyle = optColors[i][j] || layer.options.color;
					}
				}
				else ctx.strokeStyle = layer.options.color;

				ctx.stroke();
				ctx.closePath();
			}
		}
	}
},

_getStrokeGradient: function(ctx, prevPoint, Point, gradientStartRGB, gradientEndRGB) {
	// Create a gradient for each segment, pick start and end colors from colors options
	const gradient = ctx.createLinearGradient(prevPoint.x, prevPoint.y, Point.x, Point.y);

	gradient.addColorStop(0, gradientStartRGB);
	gradient.addColorStop(1, gradientEndRGB);

	return gradient;
}
});

