'use strict';
var expect = require('chai').expect;
var mathUtils = require('./../lib/math-utils');

describe('math-utils', function(){

    describe('isEqual', function(){
        it('should return true if two numbers different with value less then tolerance', function(){
            var num1 = 1.10001;
            var num2 = 1.10002;
            var tolerance = .001;
            expect(mathUtils.isEqual(num1, num2, tolerance)).to.equal(true);
        });

        it('should return false if two numbers different with value greater then tolerance', function(){
            var num1 = 1.10001;
            var num2 = 1.10002;
            var tolerance = .000001;
            expect(mathUtils.isEqual(num1, num2, tolerance)).to.equal(false);
        });
    });

    describe('isZero', function(){
        it('should return true if value is less then tolerance', function(){
            expect(mathUtils.isZero(.00001, .0001)).to.equal(true);
        });

        it('should return true if value is greater then tolerance', function(){
            expect(mathUtils.isZero(.0001, .00001)).to.equal(false);
        });
    });

    describe('clamp', function(){

        var min = 0;
        var max = 1;

        it('should return minimum bound if value is less', function(){
            expect(mathUtils.clamp(min - 1, min, max)).to.equal(min);
        });

        it('should return maximum bound if value is greater', function(){
            expect(mathUtils.clamp(max + 1, min, max)).to.equal(max);
        });

        it('should return value if value is within min and max bounds', function(){
            var value = min + (max - min) / 2;
            expect(mathUtils.clamp(value, min, max)).to.equal(value);
        });
    })


});
