/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.util.Stack');

/**
 * A generic stack.
 *
 * @constructor
 */
lanyard.util.Stack = function () {
    /**
     * @private
     * @type {Array.<Object>}
     */
    this.contents = [];
};

/**
 * Test if this stack is empty.
 *
 * @return {boolean} true if the stack is empty, false otherwise.
 */
lanyard.util.Stack.prototype.empty = function () {
    if(!this.contents) {
        return true;
    }
    return (this.contents.length === 0) ? true : false;
};

/**
 * Look at the object on the top without removal.
 *
 * @return {Object} the object on the top of the stack.
 */
lanyard.util.Stack.prototype.peek = function () {
    if(!this.contents || this.contents.length < 1) {
        return null;
    }
    return this.contents[this.contents.length - 1];
};

/**
 * Remove the object from the top of the stack and return it.
 *
 * @return {Object} the object that was on the top of the stack.
 */
lanyard.util.Stack.prototype.pop = function () {
    return this.contents ? this.contents.pop() : null;
};

/**
 * Push the specified item to the top of the stack.
 *
 * @param {Object} item the item to be placed on the top of the stack.
 */
lanyard.util.Stack.prototype.push = function (item) {
    if(!this.contents) {
        this.contents = [item];
    } else {
        this.contents.push(item);
    }
};

/* EOF */
