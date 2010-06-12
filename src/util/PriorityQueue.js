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

lanyard.util.PriorityQueue.prototype.size = function () {
    return this._elements.size;
};

lanyard.util.PriorityQueue.prototype.offer = function (element) {
    this._elements.push(element);

    if(this._size < 1) {
        // no need to sort
        return;
    }

    this._elements.sort(this._compare);
};

lanyard.util.PriorityQueue.prototype.poll = function () {
    return this._elements.splice(0, 1);
};

lanyard.util.PriorityQueue.prototype.peek = function () {
    return this._elements[0];
};

/* EOF */
