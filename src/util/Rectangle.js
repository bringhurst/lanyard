/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/**
 * Lanyard is Copyright 2010 Jonathan Bringhurst.
 *
 * This file is part of Lanyard.
 *
 * Lanyard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Lanyard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Lanyard.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Portions of Lanyard which do not constitute a "Larger Work" may be licensed
 * under the NASA OPEN SOURCE AGREEMENT VERSION 1.3.
 *
 * See http://worldwind.arc.nasa.gov/ for further information about NASA World Wind.
 */

goog.provide('lanyard.util.Rectangle');

/**
 * Constructs a new Rectangle whose top-left corner is specified as (x, y) and whose width and
 * height are specified by the arguments of the same name.
 *
 * @constructor
 * @param {number} x the x value of the top-left corner.
 * @param {number} y the y value of the top-left corner.
 * @param {number} width the width of the rectangle.
 * @param {number} height the height of the rectangle.
 */
lanyard.util.Rectangle = function(x, y, width, height) {
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

    /**
     * @private
     * @type {number}
     */
    this._width = width;

    /**
     * @private
     * @type {number}
     */
    this._height = height;
};

/**
 * Returns the x value of the top-left of this rectangle.
 *
 * @return {number} the x value of the top-left point.
 */
lanyard.util.Rectangle.prototype.getX = function() {
    return this._x;
};

/**
 * Returns the y value of the top-left of this rectangle.
 *
 * @return {number} the y value of the top-left point.
 */
lanyard.util.Rectangle.prototype.getY = function() {
    return this._y;
};

/**
 * Returns the width of this rectangle.
 *
 * @return {number} the width of this rectangle.
 */
lanyard.util.Rectangle.prototype.getWidth = function() {
    return this._width;
};

/**
 * Returns the height value of this rectangle
 *
 * @return {number} the height of this rectangle.
 */
lanyard.util.Rectangle.prototype.getHeight = function() {
    return this._height;
};

/* EOF */
