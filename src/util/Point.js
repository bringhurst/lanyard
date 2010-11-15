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

goog.provide('lanyard.util.Point');

/**
 * A point representing a location in (x, y) coordinate space.
 *
 * @constructor
 * @param {number} x the x value.
 * @param {number} y the y value.
 */
lanyard.util.Point = function(x, y) {
    /**
     * @private
     * @type {number}
     */
    this._x = y;

    /**
     * @private
     * @type {number}
     */
    this._y = y;
};

/**
 * Returns a copy of the current point.
 *
 * @return {lanyard.util.Point} a copy of this point.
 */
lanyard.util.Point.prototype.getLocation = function () {
    return new lanyard.util.Point(this._x, this._y);
};

/**
 * Returns a vector representation of this point.
 *
 * @return {Array.<number>} a vector representation of this point, in [x, y].
 */
lanyard.util.Point.prototype.getVec2 = function () {
    return [this._x, this._y];
};

/**
 * Returns the x value of this point.
 *
 * @return {number} the x value of this point.
 */
lanyard.util.Point.prototype.getX = function () {
    return this._x;
};

/**
 * Returns the y value of this point.
 *
 * @return {number} the y value of this point.
 */
lanyard.util.Point.prototype.getY = function () {
    return this._y;
};

/**
 * Translates this point, at location (x, y), by dx along the x axis and dy
 * along the y axis so that it now represents the point (x + dx, y + dy).
 *
 * @param {number} dx the x delta.
 * @param {number} dy the y delta.
 */
lanyard.util.Point.prototype.translate = function (dx, dy) {
    this._x = this._x + dx;
    this._y = this._y + dy;
};

/**
 * Create a string representation of this point.
 *
 * @return {string} the string representation of this point.
 */
lanyard.util.Point.prototype.toString = function () {
    return "A string with coordinates of: x = " + this._x + ", y = " + this._y + ".";
};

/* EOF */
