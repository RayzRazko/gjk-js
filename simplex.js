const Vector2 = require('vector2-node');

class Simplex {

    constructor() {
        this._points = [];
    }

    add(point) {
        if (!point) {
            throw 'Point argument is required';
        }

        if (!point instanceof Vector2) {
            throw 'Point must be an instance of Vector2';
        }

        this._points.push(point);
    }

    getLast() {
        if (!this._points.length) {
            throw 'There are no points in Simplex.';
        }
    }
}

module.exports = Simplex;