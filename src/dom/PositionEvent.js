/*global goog, lanyard */

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

goog.provide('lanyard.dom.PositionEvent');



/**
 * A position event.
 *
 * @constructor
 * @param {lanyard.LanyardCanvas} source the canvas to use as an event source.
 * @param {Event} mouseEvent the original mouse event.
 * @param {lanyard.geom.Position} previousPosition the previous position.
 * @param {lanyard.geom.Position} position the current position.
 */
lanyard.dom.PositionEvent = function(source, mouseEvent, previousPosition, position) {
  /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.dom.PositionEvent');

  /** @type {lanyard.LanyardCanvas} */
  this.source = source;

  /** @type {Event} */
  this.mouseEvent = mouseEvent;

  /** @type {lanyard.geom.Position} */
  this.previousPosition = previousPosition;

  /** @type {lanyard.geom.Position} */
  this.position = position;
};


/**
 * Accessor for the position.
 *
 * @return {lanyard.geom.Position} the position.
 */
lanyard.dom.PositionEvent.prototype.getPosition = function() {
  return this.position;
};


/**
 * Accessor for the previous position.
 *
 * @return {lanyard.geom.Position} the previous position.
 */
lanyard.dom.PositionEvent.prototype.getPreviousPosition = function() {
  return this.previousPosition;
};


/**
 * Accessor for the mouse event.
 *
 * @return {Event} the mouse event.
 */
lanyard.dom.PositionEvent.prototype.getMouseEvent = function() {
  return this.mouseEvent;
};


/**
 * Create a string representation of this position event.
 *
 * @return {string} a string representation of this position event.
 */
lanyard.dom.PositionEvent.prototype.toString = function() {
  /** @type {string} */
  var val = 'A position event: ' +
      this.previousPosition ? this.previousPosition.toString() : 'null' +
      ' --> ' +
      this.position ? this.position.toString() : 'null';

  return val;
};

/* EOF */
