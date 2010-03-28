/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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
lanyard.util.Rectangle.prototype.getX = function () {
    return this._x;
};

/**
 * Returns the y value of the top-left of this rectangle.
 *
 * @return {number} the y value of the top-left point.
 */
lanyard.util.Rectangle.prototype.getY = function () {
    return this._y;
};

/**
 * Returns the width of this rectangle.
 *
 * @return {number} the width of this rectangle.
 */
lanyard.util.Rectangle.prototype.getWidth = function () {
    return this._width;
};

/**
 * Returns the height value of this rectangle
 *
 * @return {number} the height of this rectangle
 */
lanyard.util.Rectangle.prototype.getHeight = function () {
    return this._height;
};

/* EOF */
