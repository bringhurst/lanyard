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
lanyard.util.TextureCoords.prototype.left = function() {
  return this._left;
};


/**
 * Returns the bottom coordinate.
 *
 * @return {number} the bottom coordinate.
 */
lanyard.util.TextureCoords.prototype.bottom = function() {
  return this._bottom;
};


/**
 * Returns the right coordinate.
 *
 * @return {number} the right coordinate.
 */
lanyard.util.TextureCoords.prototype.right = function() {
  return this._right;
};


/**
 * Returns the top coordinate.
 *
 * @return {number} the top coordinate.
 */
lanyard.util.TextureCoords.prototype.t = function() {
  return this._t;
};

/* EOF */
