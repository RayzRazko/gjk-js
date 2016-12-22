'use strict';
var Vector2 = require('vector2-node');
var mathUtils = require('./math-utils');

var isZero = mathUtils.isZero;
var clamp = mathUtils.clamp;


// The value of 1/3
var inv3 = 1.0 / 3.0;
var origin = new Vector2(0, 0);
// tolerance for number comparison
var tolerance = .0001;

//the iterations count after which the result will be 0;
var defaultLoopIterations = 30;

function isArray(array) {
    return Object.prototype.toString.call(array) === '[object Array]';
}


function vectorLikeToVectorPolygon(polygon) {
    if (!isArray(polygon)) {
        throw 'Polygon must be an array of points';
    }

    switch (typeof polygon[0]) {
        case 'number':
            if (polygon.length % 2 !== 0) {
                throw 'Polygon that contains array of numbers must has even length ([x0, y0, x1, y1, ...., xn, yn])';
            }

            var result = [];

            for (var i = 0; i < polygon.length; i = i + 2) {
                result.push(new Vector2(polygon[i], polygon[i + 1]));
            }
            return result;
        case 'object':
            return polygon.map(
                isArray(polygon[0]) ?
                    point => new Vector2(point[0], point[1]) :
                    point => new Vector2(point.x, point.y)
            );
        default:
            throw 'Passed polygon is not an array of 2D coordinates';
    }
}

function getAreaWeightedCenter(polygon) {
    if (polygon.length === 1) {
        return new Vector2(polygon[0]);
    }

    var ac = new Vector2(.0, .0);

    polygon.forEach(vector => ac.add(vector));
    ac.scale(1 / polygon.length);

    var center = new Vector2();
    var area = .0;

    polygon.forEach((vector, index) => {

        var p1 = new Vector2(vector);
        var p2 = new Vector2(index + 1 === polygon.length ? polygon[0] : polygon[index + 1]);



        p1.add(-ac.x, -ac.y);
        p2.add(-ac.x, -ac.y);

        var triangleArea = .5 * p1.cross(p2);
        area += triangleArea;

        center.add(p1.add(p2).scale(inv3).scale(triangleArea));
    });

    if (isZero(area, tolerance)) {
        // zero area can only happen if all the points are the same point
        // in which case just return a copy of the first
        return center.set(polygon[0])
    }

    // return the center
    return center.scale(1 / area).add(ac);
}

function getFarthestPointInDirection(polygon, direction) {

    var farthestPoint = polygon[0];
    var farthestDistance = direction.dot(polygon[0]);
    var tempDist = 0;

    for (var i = 1; i < polygon.length; i++) {
        tempDist = direction.dot(polygon[i]);
        if (tempDist > farthestDistance) {
            farthestDistance = tempDist;
            farthestPoint = polygon[i];
        }
    }
    return new Vector2(farthestPoint);
}

function support(polygon1, polygon2, direction) {
    var point1 = getFarthestPointInDirection(polygon1, direction);
    var point2 = getFarthestPointInDirection(polygon2, direction.negate());
    return new Vector2(point1.sub(point2));
}



function closestPointOnSegmentToOrigin(vector1, vector2) {
    var closest = new Vector2(.0, .0);
    //vector from point to the origin
    var vector1ToOrigin = new Vector2(vector1).negate();
    //vector representing the line
    var lineVector1Vector2 = new Vector2(vector2).sub(vector1);

    // get the length squared of the line
    var lineV1V2Dot = lineVector1Vector2.dot(lineVector1Vector2);
    //if a == b
    if (isZero(lineV1V2Dot, tolerance)) {
        return closest.set(vector1);
    }

    //projection of aToOrigin on lineAB
    var v1ToOrigin_V1V2 = vector1ToOrigin.dot(lineVector1Vector2);
    // get the position from the first line point to the projection
    var t = v1ToOrigin_V1V2 / lineV1V2Dot;
    // make sure t is in between 0.0 and 1.0
    t = clamp(t, .0, 1.0);
    return closest.set(lineVector1Vector2.scale(t).add(vector1));
}


function distance(polygon1, polygon2){
    polygon1 = vectorLikeToVectorPolygon(polygon1);
    polygon2 = vectorLikeToVectorPolygon(polygon2);

    var centerP1 = getAreaWeightedCenter(polygon1);
    var centerP2 = getAreaWeightedCenter(polygon2);


    var direction = centerP2.add(centerP1.negate());

    var a, b, c;

    a = support(polygon1, polygon2, direction);
    b = support(polygon1, polygon2, direction.negate());

    for (var i = 0; i < defaultLoopIterations; i++) {
        var p = closestPointOnSegmentToOrigin(a, b);

        if (isZero(p.length(), tolerance)) {
            // the origin is on the Minkowski Difference
            // I consider this touching/collision
            return .0;
        }

        // p.to(origin) is the new direction
        // we normalize here because we need to check the
        // projections along this vector later
        direction.set(p.negate().normalize());
        c = support(polygon1, polygon2, direction);
        // is the point we obtained making progress
        // towards the goal (to get the closest points
        // to the origin)
        var dc = c.dot(direction);
        // you can use a or b here it doesn't matter
        var da = a.dot(direction);

        if (isZero(dc - da, tolerance)) {
            return dc;
        }

        // if we are still getting closer then only keep
        // the points in the simplex that are closest to
        // the origin (we already know that c is closer
        // than both a and b)
        if (a.distanceSq(origin) < b.distanceSq(origin)) {
            b = c;
        } else {
            a = c;
        }
    }
    return .0;
}

module.exports = {

    /**
     * Checks if two convex polygons intersects.
     * Polygons must be an arrays with elements of one of next formats:
     * 1. [x1, y2, x2, y2, ..., xn, yn]
     * 2. [{x, y}, {x, y}, ..., {x, y}]
     * 3. [[x, y], [x, y], ..., [x, y]]
     * @param {Array.<Object|Number|Array.<Number>>}polygon1
     * @param {Array.<Object|Number|Array.<Number>>}polygon2
     * @returns {boolean}
     */
    intersect: function(polygon1, polygon2){
        return isZero(distance(polygon1, polygon2), tolerance);
    },

    /**
     * Calculates distance between 2 convex polygons.
     * Polygons must be an arrays with elements of one of next formats:
     * 1. [x1, y2, x2, y2, ..., xn, yn]
     * 2. [{x, y}, {x, y}, ..., {x, y}]
     * 3. [[x, y], [x, y], ..., [x, y]]
     * @param {Array.<Object|Number|Array.<Number>>}polygon1
     * @param {Array.<Object|Number|Array.<Number>>}polygon2
     * @returns {number}
     */
    distance: distance
};