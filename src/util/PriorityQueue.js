/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.util.PriorityQueue');

/**
 * A generic priority queue with variable comparison.
 *
 * @constructor
 * @param {function} compare the function used to compare elements.
 */
lanyard.util.PriorityQueue = function (compare) {
    /**
     * The function used for comparing elements.
     *
     * @private
     * @type {function}
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
lanyard.util.PriorityQueue.prototype.size = function () {
    return this._elements.size;
};

/**
 * Place a new element into this queue.
 *
 * @param {Object} element a new element to insert (must be compatible with the compare function).
 */
lanyard.util.PriorityQueue.prototype.offer = function (element) {
    this._elements.push(element);

    if(this._size <= 1) {
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
lanyard.util.PriorityQueue.prototype.poll = function () {
    return this._elements.splice(0, 1);
};

/**
 * Return a reference to the first element in the queue without removing it.
 *
 * @return {Object} the first element in the queue.
 */
lanyard.util.PriorityQueue.prototype.peek = function () {
    return this._elements[0];
};

/**
 * Return a COPY of this queue as an array. References may point to the original objects.
 *
 * @return {Array.<Object>} the queue as an array.
 */
lanyard.util.PriorityQueue.prototype.toArray = function () {
    return this._elements.slice();
};

/* EOF */
