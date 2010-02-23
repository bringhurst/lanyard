/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.Line');

goog.require('lanyard.geom.Point');

/**
 * A basic line geometry.
 *
 * @constructor
 * @this {lanyard.geom.Line}
 * @param {lanyard.geom.Point} origin the origin of the line.
 * @param {lanyard.geom.Point} direction the direction of the line.
 */
lanyard.geom.Line = function (origin, direction) {
    /** @private */ this._origin = origin;
    /** @private */ this._direction = direction;
};
goog.exportSymbol('lanyard.geom.Line', lanyard.geom.Line);

/**
 * Obtain the direction of this line.
 *
 * @return {lanyard.geom.Point} the direction of this line.
 */
lanyard.geom.Line.prototype.getDirection = function () {
    return this._direction;
};

/**
 * Obtain the origin of this line.
 *
 * @return {lanyard.geom.Point} the origin of this line.
 */
lanyard.geom.Line.prototype.getOrigin = function () {
    return this._origin;
};

/**
 *
 *
 * @param {Number} t
 * @return {lanyard.geom.Point}
 */
lanyard.geom.Line.prototype.getPointAt = function (t) {
    return lanyard.geom.Point.prototype.fromOriginAndDirection(t, this._direction, this._origin);
};

/**
 *
 *
 * @return {Number}
 */
lanyard.geom.Line.prototype.selfDot = function () {
    return this._origin.dot(this._direction);
};

/**
 * Calculate the shortests distance between this line and a specified Point. This method returns a
 * positive distance.
 *
 * @param {lanyard.geom.Point} p the Point whose distance from this Line will be calculated.
 * @return {Number} the distance between this Line and the specified Point.
 */
lanyard.geom.Line.prototype.distanceTo = function (p) {
    var origin = this.getOrigin();
    var sideB = origin.subtract(p); // really a vector

    var distanceToOrigin = sideB.dot(this.getDirection());
    var divisor = distanceToOrigin / this.getDirection().selfDot();

    var sideA = this.getDirection().multiply(divisor);

    var aSquared = sideA.selfDot();
    var bSquared = sideB.selfDot();

    return Math.sqrt(bSquared - aSquared);
};

/**
 * Obtain a string representation of this line.
 *
 * @return {String} a string representation of this line.
 */
lanyard.geom.Line.prototype.toString = function () {
    return "Origin: " + this._origin.toString() +
        ", Direction: " + this._direction.toString();
};

/* EOF */
