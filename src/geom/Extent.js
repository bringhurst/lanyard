/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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
