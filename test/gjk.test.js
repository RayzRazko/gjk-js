'use strict';
var expect = require('chai').expect;
var gjk = require('./../lib/gjk');

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

var intersectedPolygon = [
    {x: 1.5, y: 1},
    {x: 4, y: 1},
    {x: 4, y: 2},
    {x: 1.5, y: 2}
];

var numbersPolygon = [
    1, 1,
    2, 1,
    2, 2,
    1, 2
];

var arraysPolygon = [
    [3, 1],
    [4, 1],
    [4, 2],
    [3, 2]
];

var distance =  notIntersectedPolygon[0].x - polygon[1].x;

describe('gjk', function(){

    describe('distance', function(){
        it('should return distance between two convex polygons', function(){
            expect(gjk.distance(polygon, notIntersectedPolygon)).to.equal(distance);
        });

        it('should return 0 for polygons which intersect', function(){
            expect(gjk.distance(polygon, intersectedPolygon)).to.equal(.0);
        });

        it('should return distance between two convex polygons that are array of numbers and array of array of numbers', function(){
            expect(gjk.distance(numbersPolygon, arraysPolygon)).to.equal(distance);
        })
    });

    describe('intersects', function(){
        it('should return false for two convex polygons that are not intersect', function(){
            expect(gjk.intersect(polygon, notIntersectedPolygon)).to.equal(false);
        });

        it('should return true for two convex polygons that intersect', function(){
            expect(gjk.intersect(polygon, intersectedPolygon)).to.equal(true);
        });

        it('should return false for two not intersected convex polygons that are array of numbers and array of array of numbers', function(){
            expect(gjk.intersect(numbersPolygon, arraysPolygon)).to.equal(false);
        })
    });


});