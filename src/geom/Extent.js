/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/**
 * Lanyard is Copyright 2010 Jonathan Bringhurst.
 *
 * This file is part of Lanyard.
 *
 * Lanyard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Lanyard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Lanyard.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Portions of Lanyard which do not constitute a "Larger Work" may be licensed
 * under the NASA OPEN SOURCE AGREEMENT VERSION 1.3.
 *
 * See http://worldwind.arc.nasa.gov/ for further information about NASA World Wind.
 */

goog.provide('lanyard.geom.Extent');

goog.require('lanyard.geom.Point');
goog.require('lanyard.geom.Plane');
goog.require('lanyard.geom.Frustum');
goog.require('lanyard.geom.Line')
goog.require('lanyard.geom.Intersection');

/**
 * An extent interface.
 *
 * @interface
 */
lanyard.geom.Extent = function () {};

/**
 * Render this extent.
 *
 * @param {lanyard.DrawContext} dc the draw context to render to.
 */
lanyard.geom.Extent.prototype.render = function (dc) {};

/**
 * Accessor for the center point.
 *
 * @return {lanyard.geom.Point}
 */
lanyard.geom.Extent.prototype.getCenter = function () {};

/**
 * Accessor for the diameter.
 *
 * @return {number}
 */
lanyard.geom.Extent.prototype.getDiameter = function () {};

/**
 * Accessor for the radius.
 *
 * @return {number}
 */
lanyard.geom.Extent.prototype.getRadius = function () {};

/**
 * Tests whether or not this Extent intersects frustum. Returns true if any part of these
 * two objects intersect, including the case where either object wholly contains the
 * other, false otherwise.
 *
 * @param {lanyard.geom.Frustum} frustum the Frustum with which to test for intersection.
 * @return {boolean} true if there is an intersection, false otherwise.
 */
lanyard.geom.Extent.prototype.intersectsFrustum = function (frustum) {};

/**
 * Obtain the intersections of this extent with line. The returned array may be either
 * null or of zero length if no intersections are discovered. It does not contain null
 * elements. Tangential intersections are marked as such. line is considered to have
 * infinite length in both directions.
 *
 * @param {lanyard.geom.Line} line the Line with which to intersect this Extent.
 * @return {Array.<lanyard.geom.Intersection>} an array of intersections representing
 *     all the points where line enters or leave this extent.
 */
lanyard.geom.Extent.prototype.intersect = function (line) {};

/**
 * Calculate whether or not line intersects this Extent. This method may be faster than
 * checking the size of the arary returned by intersect(Line). Implementing methods must ensure that
 * this method returns true if and only if intersect(Line) returns a non-null array containing at least
 * one element.
 *
 * @param {lanyard.geom.Line} line the Line with which to test for intersection.
 * @return {boolean} true if an intersection is found, false otherwise.
 */
lanyard.geom.Extent.prototype.intersectsLine = function (line) {};

/**
 * Calculate whether or not this Extent is intersected by plane.
 *
 * @param {lanyard.geom.Plane} plane the Plane with which to test for intersection.
 * @return {boolean} true if plane is found to intersect this Extent.
 */
lanyard.geom.Extent.prototype.intersectsPlane = function (plane) {};

/* EOF */
