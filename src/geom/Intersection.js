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

goog.provide('lanyard.geom.Intersection');

goog.require('lanyard.geom.Point');



/**
 * A way to represent an intersection.
 *
 * @constructor
 * @this {lanyard.geom.Intersection}
 * @param {lanyard.geom.Point} intersectionPoint the point of intersection.
 * @param {boolean} isTangent if the intersection is a tangent.
 */
lanyard.geom.Intersection = function(intersectionPoint, isTangent) {
  /** @private */ this._intersectionPoint = intersectionPoint;
  /** @private */ this._isTangent = isTangent;
};
goog.exportSymbol('lanyard.geom.Intersection', lanyard.geom.Intersection);


/**
 * Get the point of intersection.
 *
 * @return {lanyard.geom.Point} the point of intersection.
 */
lanyard.geom.Intersection.prototype.getIntersectionPoint = function() {
  return this._intersectionPoint;
};


/**
 * Return if this intersection is a tangent.
 *
 * @return {boolean} if this intersection is a tangent.
 */
lanyard.geom.Intersection.prototype.isTangent = function() {
  return this._isTangent;
};


/**
 * Returns a string representation of this Intersection.
 *
 * @return {string} a string representation of this Intersection.
 */
lanyard.geom.Intersection.prototype.toString = function() {
  var pt = 'Intersection Point: ' + this._intersectionPoint.toString();
  var tang = this._isTangent ? ' is a tangent.' : ' not a tangent';

  return pt + tang;
};

/* EOF */
