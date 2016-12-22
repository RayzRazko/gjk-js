# gjk
Implementation of GJK (Gilbert-Johnson-Keerthi) algorithm for calculation distance between convex polygons and intersection detection.

## Basic usage
```javascript
var gjk = require('gjk');

var polygon = [
    {x: 1, y: 1},
    {x: 2, y: 1},
    {x: 2, y: 2},
    {x: 1, y: 2}
];

var notIntersectedPolygon = [
    {x: 3, y: 1},
    {x: 4, y: 1},
    {x: 4, y: 2},
    {x: 3, y: 2}
];

var distance = gjk.distance(polygon, notIntersectedPolygon); //1
var intersected = gjk.intersect(polygon, notIntersectedPolygon); //false
```
## Polygons
Polygons might be one of the next formats
### Array of objects
```javascript
var polygon = [
    {x: 1, y: 1},
    {x: 2, y: 1},
    {x: 2, y: 2},
    {x: 1, y: 2}
];
```
### Array of numbers
```javascript
var polygon = [
    1, 1,
    2, 1,
    2, 2,
    1, 2
];
```
### Array of arrays of numbers
```javascript
var polygon = [
    [1, 1],
    [2, 1],
    [2, 2],
    [1, 2]
];
```
