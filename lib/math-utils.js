'use strict';

function isEqual(number1, number2, tolerance){
    tolerance = tolerance || 0;
    return Math.abs(number1 - number2) < Math.abs(tolerance);
}

module.exports = {

    isEqual: isEqual,

    isZero: function(number, tolerance) {
        return isEqual(number, 0, tolerance);
    },

    /**
     * Clamps the passed value to the passed bounds (i.e. if value is smaller than min bound it's set to min bound, if bigger than max bound it's set to max bound).
     * @param value
     * @param min
     * @param max
     * @returns {*}
     */
    clamp: function(value, min, max) {
        if (value > min) {
            return value < max ? value : max;
        } else {
            return min;
        }
    }
};

