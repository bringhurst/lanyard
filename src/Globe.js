/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.Globe');

goog.require('lanyard.geom.Angle');
goog.require('lanyard.geom.Point');
goog.require('lanyard.geom.Sector');
goog.require('lanyard.geom.Extent');
goog.require('lanyard.geom.Line');
goog.require('lanyard.geom.Position');

/**
 * Provides an interface for creating a globe.
 *
 * @interface
 * @implements {lanyard.geom.Extent}
 */
lanyard.Globe = function () {};

/**
 * Compute a simple point from a position on the globe.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the position.
 * @param {lanyard.geom.Angle} longitude the longitude of hte position.
 * @param {number} metersElevation the elevation of the point in meters.
 * @return {lanyard.geom.Point} the point.
 */
lanyard.Globe.prototype.computePointFromPosition = function (latitude, longitude, metersElevation) {};

/**
 * Compute the surface normal at a specified point on the globe.
 *
 * @param {lanyard.geom.Point} p the point on the globe to compute the surface normal for.
 * @return {lanyard.geom.Point} the surface normal.
 */
lanyard.Globe.prototype.computeSurfaceNormalAtPoint = function (p) {};

/**
 * Accessor for this globe's elevation model.
 *
 * @return {lanyard.ElevationModel} this globe's elevation model.
 */
lanyard.Globe.prototype.getElevationModel = function () {};

/**
 * Get the extent of this globe.
 *
 * @return {lanyard.geom.Extent} the extent of this globe.
 */
lanyard.Globe.prototype.getExtent = function () {};

/**
 * Find the equatorial radius of this globe.
 *
 * @return {number} the equatorial radius of this globe.
 */
lanyard.Globe.prototype.getEquatorialRadius = function () {};

/**
 * Find the polar radius of this globe.
 *
 * @return {number} the polar radius of this globe.
 */
lanyard.Globe.prototype.getPolarRadius = function () {};

/**
 * Find the maximum radius of this globe.
 *
 * @return {number} the maximum radius.
 */
lanyard.Globe.prototype.getMaximumRadius = function () {};

/**
 * Find the radius at a specified coordinate.
 *
 * @param {lanyard.geom.Angle} latitude the latitude coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude coordinate.
 * @return {number} the radius at the specified coordinate.
 */
lanyard.Globe.prototype.getRadiusAt = function (latitude, longitude) {};

/**
 * Get the elevation for a specified coordinate.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude of the coordinate.
 * @return {number} the elevation of the specified coordinate.
 */
lanyard.Globe.prototype.getElevation = function (latitude, longitude) {};

/**
 * Find the maximum elevation of this globe.
 *
 * @return {number} the maximum elevation of this globe.
 */
lanyard.Globe.prototype.getMaxElevation = function () {};

/**
 * Find the minimum elevation of this globe.
 *
 * @return {number} the minimum elevation of this globe.
 */
lanyard.Globe.prototype.getMinElevation = function () {};

/**
 * Find the intersection position of a line to this globe.
 *
 * @param {lanyard.geom.Line} line the line to test.
 * @return {lanyard.geom.Position} the position of the intersection.
 */
lanyard.Globe.prototype.getIntersectionPosition = function (line) {};

/**
 * Find the eccentricity squared of this globe.
 *
 * @return {number} the eccentricity squared.
 */
lanyard.Globe.prototype.getEccentricitySquared = function () {};

/**
 * Find a position on the globe from a specified point.
 *
 * @param {lanyard.geom.Point} point the point.
 * @return {lanyard.geom.Position} the position.
 */
lanyard.Globe.prototype.computePositionFromPoint = function (point) {};

/**
 * Compute a point from the specified position.
 *
 * @param {lanyard.geom.Position} position the position.
 * @return {lanyard.geom.Point} the point.
 */
lanyard.Globe.prototype.computePointFromPosition = function (position) {};

/* EOF */
