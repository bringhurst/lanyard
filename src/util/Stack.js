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

goog.provide('lanyard.util.Stack');



/**
 * A generic stack.
 *
 * @constructor
 */
lanyard.util.Stack = function() {
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
lanyard.util.Stack.prototype.empty = function() {
  if (!this.contents) {
    return true;
  }
  return (this.contents.length === 0) ? true : false;
};


/**
 * Look at the object on the top without removal.
 *
 * @return {Object} the object on the top of the stack.
 */
lanyard.util.Stack.prototype.peek = function() {
  if (!this.contents || this.contents.length < 1) {
    return null;
  }
  return this.contents[this.contents.length - 1];
};


/**
 * Remove the object from the top of the stack and return it.
 *
 * @return {Object} the object that was on the top of the stack.
 */
lanyard.util.Stack.prototype.pop = function() {
  return this.contents ? this.contents.pop() : null;
};


/**
 * Push the specified item to the top of the stack.
 *
 * @param {Object} item the item to be placed on the top of the stack.
 */
lanyard.util.Stack.prototype.push = function(item) {
  if (!this.contents) {
    this.contents = [item];
  } else {
    this.contents.push(item);
  }
};

/* EOF */
