/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.util.TextureCoords');

/**
 * Constructs a new TextureCoords to handle flipped texture coordinates.
 *
 * @constructor
 * @param {number} left
 * @param {number} bottom
 * @param {number} right
 * @param {number} t
 */
lanyard.util.TextureCoords = function(left, bottom, right, t) {
    /**
     * @private
     * @type {number}
     */
    this._left = left;

    /**
     * @private
     * @type {number}
     */
    this._bottom = bottom;

    /**
     * @private
     * @type {number}
     */
    this._right = right;

    /**
     * @private
     * @type {number}
     */
    this._t = t;
};

/**
 * Returns the left coordinate.
 *
 * @return {number} the left coordinate.
 */
lanyard.util.TextureCoords.prototype.left = function () {
    return this._left;
};

/**
 * Returns the bottom coordinate.
 *
 * @return {number} the bottom coordinate.
 */
lanyard.util.TextureCoords.prototype.bottom = function () {
    return this._bottom;
};

/**
 * Returns the right coordinate.
 *
 * @return {number} the right coordinate.
 */
lanyard.util.TextureCoords.prototype.right = function () {
    return this._right;
};

/**
 * Returns the top coordinate.
 *
 * @return {number} the top coordinate.
 */
lanyard.util.TextureCoords.prototype.t = function () {
    return this._t;
};

/* EOF */
