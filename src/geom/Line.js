/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/**
 * Lanyard is Copyright 2010 Jonathan Bringhurst.
 *
 * This file is part of Lanyard.
 *
 * Lanyard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Lanyard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Lanyard.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Portions of Lanyard which do not constitute a "Larger Work" may be licensed
 * under the NASA OPEN SOURCE AGREEMENT VERSION 1.3.
 *
 * See http://worldwind.arc.nasa.gov/ for further information about NASA World Wind.
 */

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
lanyard.geom.Line = function(origin, direction) {
    /** @private */ this._origin = origin;
    /** @private */ this._direction = direction;
};
goog.exportSymbol('lanyard.geom.Line', lanyard.geom.Line);

/**
 * Obtain the direction of this line.
 *
 * @return {lanyard.geom.Point} the direction of this line.
 */
lanyard.geom.Line.prototype.getDirection = function() {
    return this._direction;
};

/**
 * Obtain the origin of this line.
 *
 * @return {lanyard.geom.Point} the origin of this line.
 */
lanyard.geom.Line.prototype.getOrigin = function() {
    return this._origin;
};

/**
 *
 *
 * @param {number} t
 * @return {lanyard.geom.Point}
 */
lanyard.geom.Line.prototype.getPointAt = function(t) {
    return lanyard.geom.Point.prototype.fromOriginAndDirection(t, this._direction, this._origin);
};

/**
 *
 *
 * @return {number}
 */
lanyard.geom.Line.prototype.selfDot = function() {
    return this._origin.dot(this._direction);
};

/**
 * Calculate the shortests distance between this line and a specified Point. This method returns a
 * positive distance.
 *
 * @param {lanyard.geom.Point} p the Point whose distance from this Line will be calculated.
 * @return {number} the distance between this Line and the specified Point.
 */
lanyard.geom.Line.prototype.distanceTo = function(p) {
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
 * @return {string} a string representation of this line.
 */
lanyard.geom.Line.prototype.toString = function() {
    return 'Origin: ' + this._origin.toString() +
        ', Direction: ' + this._direction.toString();
};

/* EOF */
