/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.Point');

/**
 * A basic point geometry.
 *
 * @constructor
 * @this {lanyard.geom.Point}
 * @param {number} x the x value of the point.
 * @param {number} y the y value of the point.
 * @param {number} z the z value of the point.
 * @param {number} w the w value of thie point.
 */
lanyard.geom.Point = function (x, y, z, w) {
    /** @private */ this._x = x;
    /** @private */ this._y = y;
    /** @private */ this._z = z;

    if(w) {
        /** @private */ this._w = w;
    } else {
        /** @private */ this._w = 1;
    }
};
goog.exportSymbol('lanyard.geom.Point', lanyard.geom.Point);

/**
 * A point at 0.
 * @const
 * @type {lanyard.geom.Point}
 */
lanyard.geom.Point.prototype.ZERO = new lanyard.geom.Point(0, 0, 0, 1);
goog.exportSymbol('lanyard.geom.Point.prototype.ZERO', lanyard.geom.Point.prototype.ZERO);

/**
 * A unit x point.
 * @const
 * @type {lanyard.geom.Point}
 */
lanyard.geom.Point.prototype.UNIT_X = new lanyard.geom.Point(1, 0, 0, 1);
goog.exportSymbol('lanyard.geom.Point.prototype.UNIT_X', lanyard.geom.Point.prototype.UNIT_X);

/**
 * A unit y point.
 * @const
 * @type {lanyard.geom.Point}
 */
lanyard.geom.Point.prototype.UNIT_Y = new lanyard.geom.Point(0, 1, 0, 1);
goog.exportSymbol('lanyard.geom.Point.prototype.UNIT_Y', lanyard.geom.Point.prototype.UNIT_Y);

/**
 * A unit z point.
 * @const
 * @type {lanyard.geom.Point}
 */
lanyard.geom.Point.prototype.UNIT_Z = new lanyard.geom.Point(0, 0, 1, 1);
goog.exportSymbol('lanyard.geom.Point.prototype.UNIT_Z', lanyard.geom.Point.prototype.UNIT_Z);

/**
 * Find the w value of this point.
 * @this {lanyard.geom.Point}
 * @return {number} the w value.
 */
lanyard.geom.Point.prototype.getW = function () {
    return this._w;
};
goog.exportSymbol('lanyard.geom.Point.prototype.getW', lanyard.geom.Point.prototype.getW);

/**
 * Find the x value of this point.
 * @this {lanyard.geom.Point}
 * @return {number} the x value.
 */
lanyard.geom.Point.prototype.getX = function () {
    return this._x;
};
goog.exportSymbol('lanyard.geom.Point.prototype.getX', lanyard.geom.Point.prototype.getX);

/**
 * Find the y value of this point.
 * @this {lanyard.geom.Point}
 * @return {number} the y value.
 */
lanyard.geom.Point.prototype.getY = function () {
    return this._y;
};
goog.exportSymbol('lanyard.geom.Point.prototype.getY', lanyard.geom.Point.prototype.getY);

/**
 * Find the z value of this point.
 * @this {lanyard.geom.Point}
 * @return {number} the z value.
 */
lanyard.geom.Point.prototype.getZ = function () {
    return this._z;
};
goog.exportSymbol('lanyard.geom.Point.prototype.getZ', lanyard.geom.Point.prototype.getZ);

/**
 * Transform this point by a matrix.
 *
 * @param {lanyard.geom.Matrix} m the matrix.
 * @return {lanyard.geom.Point} the result of the transform.
 */
lanyard.geom.Point.prototype.translate = function (m) {
    /** @type {lanyard.geom.Point} */
    var p = new lanyard.geom.Point(
        m.get11() * this._x + m.get21() * this._y + m.get31() * this._z + m.get41(),
        m.get12() * this._x + m.get22() * this._y + m.get32() * this._z + m.get42(),
        m.get13() * this._x + m.get23() * this._y + m.get33() * this._z + m.get43(),
        1
    );

    return p;
};

/**
 * Add this point to another point.
 * @this {lanyard.geom.Point}
 * @param {lanyard.geom.Point} p another point.
 * @return {lanyard.geom.Point} the points added together.
 */
lanyard.geom.Point.prototype.add = function (p) {
    return new lanyard.geom.Point(
        this._x + p.getX(),
        this._y + p.getY(),
        this._z + p.getZ(),
        1
    );
};
goog.exportSymbol('lanyard.geom.Point.prototype.add', lanyard.geom.Point.prototype.add);

/**
 * Subtract another point from this point.
 * @this {lanyard.geom.Point}
 * @param {lanyard.geom.Point} p another point.
 * @return {lanyard.geom.Point} the point resulting from the subtraction.
 */
lanyard.geom.Point.prototype.subtract = function (p) {
    return new lanyard.geom.Point(
        this._x - p.getX(),
        this._y - p.getY(),
        this._z - p.getZ(),
        1
    );
};
goog.exportSymbol('lanyard.geom.Point.prototype.subtract', lanyard.geom.Point.prototype.subtract);

/**
 * Multiply this point by a scalar.
 * @this {lanyard.geom.Point}
 * @param {number} s a scalar.
 * @return {lanyard.geom.Point} the result of the multiplication.
 */
lanyard.geom.Point.prototype.multiply = function (s) {
    return new lanyard.geom.Point(
        this._x * s,
        this._y * s,
        this._z * s,
        1
    );
};
goog.exportSymbol('lanyard.geom.Point.prototype.multiply', lanyard.geom.Point.prototype.multiply);

/**
 * Scale based on the this point.
 * @this {lanyard.geom.Point}
 * @param {number} sx factor for the x axis.
 * @param {number} sy factor for the y axis.
 * @param {number} sz factor for the z axis.
 * @return {lanyard.geom.Point} the scaled point.
 */
lanyard.geom.Point.prototype.scale = function (sx, sy, sz) {
    if (!this._w) {
        return new lanyard.geom.Point(
            this._x * sx,
            this._y * sy,
            this._z * sz,
            1
        );
    } else {
        return new lanyard.geom.Point(
            this._x * sx,
            this._y * sy,
            this._z * sz,
            this._w
        );
    }
};
goog.exportSymbol('lanyard.geom.Point.prototype.scale', lanyard.geom.Point.prototype.scale);

/**
 * Calculate the length of this point.
 * @this {lanyard.geom.Point}
 * @return {number} the length.
 */
lanyard.geom.Point.prototype.length = function () {
    return Math.sqrt(this.selfDot());
};
goog.exportSymbol('lanyard.geom.Point.prototype.length', lanyard.geom.Point.prototype.length);

/**
 * Find a normalized point based on this one.
 * @this {lanyard.geom.Point}
 * @return {lanyard.geom.Point} the normalized point.
 */
lanyard.geom.Point.prototype.normalize = function () {
    var s = 1.0 / this.length();
    return this.scale(s, s, s);
};
goog.exportSymbol('lanyard.geom.Point.prototype.normalize', lanyard.geom.Point.prototype.normalize);

/**
 * Find the dot product with another point.
 * @this {lanyard.geom.Point}
 * @param {lanyard.geom.Point} p the other point.
 * @return {number} the result of the dot product.
 */
lanyard.geom.Point.prototype.dot = function (p) {
    return this._x * p.getX() + this._y * p.getY() + this._z * p.getZ();
};
goog.exportSymbol('lanyard.geom.Point.prototype.dot', lanyard.geom.Point.prototype.dot);

/**
 * Find the dot of the current point with the current point.
 * @this {lanyard.geom.Point}
 * @return {number} the result of the dot product.
 */
lanyard.geom.Point.prototype.selfDot = function () {
    return this._x * this._x + this._y * this._y + this._z * this._z;
};
goog.exportSymbol('lanyard.geom.Point.prototype.selfDot', lanyard.geom.Point.prototype.selfDot);

/**
 * Find the dot product with another point (include w).
 * @this {lanyard.geom.Point}
 * @param {lanyard.geom.Point} p the other point.
 * @return {number} the result of the dot product.
 */
lanyard.geom.Point.prototype.dot4 = function (p) {
    return this._x * p.getX() + this._y * p.getY() + this._z * p.getZ() + this._w * this.getW();
};
goog.exportSymbol('lanyard.geom.Point.prototype.dot4', lanyard.geom.Point.prototype.dot4);

/**
 * Find the distance to another point.
 * @this {lanyard.geom.Point}
 * @param {lanyard.geom.Point} p the other point.
 * @return {number} the distance between the points.
 */
lanyard.geom.Point.prototype.distanceTo = function (p) {
    var dx = this._x - p.getX();
    var dy = this._y - p.getY();
    var dz = this._z - p.getZ();

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
goog.exportSymbol('lanyard.geom.Point.prototype.distanceTo', lanyard.geom.Point.prototype.distanceTo);

/**
 * Find the squared distance between points.
 * @this {lanyard.geom.Point}
 * @param {lanyard.geom.Point} p the other point.
 * @return {number} the squared distance.
 */
lanyard.geom.Point.prototype.distanceToSquared = function (p) {
    var dx = this._x - p.getX();
    var dy = this._y - p.getY();
    var dz = this._z - p.getZ();
 
    return (dx * dx + dy * dy + dz * dz);
};
goog.exportSymbol('lanyard.geom.Point.prototype.distanceToSquared',
    lanyard.geom.Point.prototype.distanceToSquared);

/**
 * Find the mid point between two points.
 * @param {lanyard.geom.Point} p1 the first point.
 * @param {lanyard.geom.Point} p2 the second point.
 * @return {lanyard.geom.Point} a point midway between the two points.
 */
lanyard.geom.Point.prototype.midPoint = function (p1, p2) {
    return new lanyard.geom.Point(
        0.5 * (p1.getX() + p2.getX()),
        0.5 * (p1.getY() + p2.getY()),
        0.5 * (p1.getZ() + p2.getZ()),
        1
    );
};
goog.exportSymbol('lanyard.geom.Point.prototype.midPoint', lanyard.geom.Point.prototype.midPoint);

/**
 * Find a point in the direction and location relative to two other points.
 * @param {number} scale the scale of the vector between the two points.
 * @param {lanyard.geom.Point} direction the vector heading from the origin point.
 * @param {lanyard.geom.Point} origin the origin of the vector heading toward the direction.
 * @return {lanyard.geom.Point} the new point in the specified location.
 */
lanyard.geom.Point.prototype.fromOriginAndDirection = function (scale, direction, origin) {
    return new lanyard.geom.Point(
        scale * direction.getX() + origin.getX(),
        scale * direction.getY() + origin.getY(),
        scale * direction.getZ() + origin.getZ(),
        1
    );
};
goog.exportSymbol('lanyard.geom.Point.prototype.fromOriginAndDirection',
    lanyard.geom.Point.prototype.fromOriginAndDirection);

/**
 * Find the extrema of an array of points.
 * @param {Array.<lanyard.geom.Point>} points the array of Points.
 * @return {Array.<lanyard.geom.Point>} a bounding box of the points extrema.
 */
lanyard.geom.Point.prototype.composeExtrema = function (points) {
    if (points.length === 0) {
        return [
            lanyard.geom.Point.prototype.ZERO,
            lanyard.geom.Point.prototype.ZERO
        ];
    }

    var xmin = points[0].getX();
    var ymin = points[0].getY();
    var zmin = points[0].getZ();
    var xmax = xmin;
    var ymax = ymin;
    var zmax = zmin;
 
    for (var i = 0; i < points.length; i = i + 1) {
        var x = points[i].getX();

        if (x > xmax) {
            xmax = x;
        } else if (x < xmin) {
            xmin = x;
        }

        var y = points[i].getY();

        if (y > ymax) {
            ymax = y;
        } else if (y < ymin) {
            ymin = y;
        }

        var z = points[i].getZ();

        if (z > zmax) {
            zmax = z;
        } else if (z < zmin) {
            zmin = z;
        }
    }

    return [
        new lanyard.geom.Point(
            xmin,
            ymin,
            zmin,
            1
        ),
        new lanyard.geom.Point(
            xmax,
            ymax,
            zmax,
            1
        )
    ];
};
goog.exportSymbol('lanyard.geom.Point.prototype.composeExtrema', lanyard.geom.Point.prototype.composeExtrema);

/**
 * Find the cross product with another point.
 * @this {lanyard.geom.Point}
 * @param {lanyard.geom.Point} that the other point.
 * @return {lanyard.geom.Point} the result of the cross product.
 */
lanyard.geom.Point.prototype.cross = function (that) {
    return new lanyard.geom.Point(
        this._y * that.getZ() - this._z * that.getY(),
        this._z * that.getX() - this._x * that.getZ(),
        this._x * that.getY() - this._y * that.getX(),
        1
    );
};
goog.exportSymbol('lanyard.geom.Point.prototype.cross', lanyard.geom.Point.prototype.cross);

/**
 * Find a string representation of this point.
 * @this {lanyard.geom.Point}
 * @return {string} the point represented as a string.
 */
lanyard.geom.Point.prototype.toString = function () {
    return "A point with values of x=" + this._x +
        "; y=" + this._y +
        "; z=" + this._z +
        "; w=" + this._w + ".";
};
goog.exportSymbol('lanyard.geom.Point.prototype.toString', lanyard.geom.Point.prototype.toString);

/* EOF */
