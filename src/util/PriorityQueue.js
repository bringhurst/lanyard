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

goog.provide('lanyard.util.PriorityQueue');



/**
 * A generic priority queue with variable comparison.
 *
 * @constructor
 * @param {Function} compare the function used to compare elements.
 */
lanyard.util.PriorityQueue = function(compare) {
  /**
     * The function used for comparing elements.
     *
     * @private
     * @type {Function}
     */
  this._compare = compare;

  /**
     * Actual elements in the queue.
     *
     * @private
     * @type {Array.<Object>}
     */
  this._elements = [];
};


/**
 * Find the number of elements in this queue.
 *
 * @return {number} the number of elements in this queue.
 */
lanyard.util.PriorityQueue.prototype.size = function() {
  return this._elements.length;
};


/**
 * Place a new element into this queue.
 *
 * @param {Object} element a new element to insert (must be compatible with the compare function).
 */
lanyard.util.PriorityQueue.prototype.offer = function(element) {
  this._elements.push(element);

  if (this._elements.length <= 1) {
    // no need to sort
    return;
  }

  this._elements.sort(this._compare);
};


/**
 * Remove and return the first element in the queue.
 *
 * @return {Object} the first element in the queue.
 */
lanyard.util.PriorityQueue.prototype.poll = function() {
  return this._elements.splice(0, 1);
};


/**
 * Return a reference to the first element in the queue without removing it.
 *
 * @return {Object} the first element in the queue.
 */
lanyard.util.PriorityQueue.prototype.peek = function() {
  return this._elements[0];
};


/**
 * Return a COPY of this queue as an array. References may point to the original objects.
 *
 * @return {Array.<Object>} the queue as an array.
 */
lanyard.util.PriorityQueue.prototype.toArray = function() {
  return this._elements.slice();
};


/**
 * Clear out the current elements in the queue.
 */
lanyard.util.PriorityQueue.prototype.clear = function() {
  this._elements = [];
};

/* EOF */
