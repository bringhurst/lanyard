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

goog.provide('lanyard.Globe');

goog.require('lanyard.ElevationModel');
goog.require('lanyard.geom.Angle');
goog.require('lanyard.geom.Extent');
goog.require('lanyard.geom.Line');
goog.require('lanyard.geom.Point');
goog.require('lanyard.geom.Position');



/**
 * Provides an interface for creating a globe.
 *
 * @interface
 * @extends {lanyard.geom.Extent}
 */
lanyard.Globe = function() {};


/**
 * Compute a simple point from a position on the globe.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the position.
 * @param {lanyard.geom.Angle} longitude the longitude of hte position.
 * @param {number} metersElevation the elevation of the point in meters.
 * @return {lanyard.geom.Point} the point.
 */
lanyard.Globe.prototype.computePointFromPositionAngles = function(latitude, longitude, metersElevation) {};


/**
 * Compute a point from the specified position.
 *
 * @param {lanyard.geom.Position} position the position.
 * @return {lanyard.geom.Point} the point.
 */
lanyard.Globe.prototype.computePointFromPosition = function(position) {};


/**
 * Compute the surface normal at a specified point on the globe.
 *
 * @param {lanyard.geom.Point} p the point on the globe to compute the surface normal for.
 * @return {lanyard.geom.Point} the surface normal.
 */
lanyard.Globe.prototype.computeSurfaceNormalAtPoint = function(p) {};


/**
 * Accessor for this globe's elevation model.
 *
 * @return {lanyard.ElevationModel} this globe's elevation model.
 */
lanyard.Globe.prototype.getElevationModel = function() {};


/**
 * Get the extent of this globe.
 *
 * @return {lanyard.geom.Extent} the extent of this globe.
 */
lanyard.Globe.prototype.getExtent = function() {};


/**
 * Find the equatorial radius of this globe.
 *
 * @return {number} the equatorial radius of this globe.
 */
lanyard.Globe.prototype.getEquatorialRadius = function() {};


/**
 * Find the polar radius of this globe.
 *
 * @return {number} the polar radius of this globe.
 */
lanyard.Globe.prototype.getPolarRadius = function() {};


/**
 * Find the maximum radius of this globe.
 *
 * @return {number} the maximum radius.
 */
lanyard.Globe.prototype.getMaximumRadius = function() {};


/**
 * Find the radius at a specified coordinate.
 *
 * @param {lanyard.geom.Angle} latitude the latitude coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude coordinate.
 * @return {number} the radius at the specified coordinate.
 */
lanyard.Globe.prototype.getRadiusAt = function(latitude, longitude) {};


/**
 * Get the elevation for a specified coordinate.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude of the coordinate.
 * @return {number} the elevation of the specified coordinate.
 */
lanyard.Globe.prototype.getElevation = function(latitude, longitude) {};


/**
 * Find the maximum elevation of this globe.
 *
 * @return {number} the maximum elevation of this globe.
 */
lanyard.Globe.prototype.getMaxElevation = function() {};


/**
 * Find the minimum elevation of this globe.
 *
 * @return {number} the minimum elevation of this globe.
 */
lanyard.Globe.prototype.getMinElevation = function() {};


/**
 * Find the intersection position of a line to this globe.
 *
 * @param {lanyard.geom.Line} line the line to test.
 * @return {lanyard.geom.Position} the position of the intersection.
 */
lanyard.Globe.prototype.getIntersectionPosition = function(line) {};


/**
 * Find the eccentricity squared of this globe.
 *
 * @return {number} the eccentricity squared.
 */
lanyard.Globe.prototype.getEccentricitySquared = function() {};


/**
 * Find a position on the globe from a specified point.
 *
 * @param {lanyard.geom.Point} point the point.
 * @return {lanyard.geom.Position} the position.
 */
lanyard.Globe.prototype.computePositionFromPoint = function(point) {};


/**
 * Get the radius of this globe.
 *
 * @return {number} the radius of this globe.
 */
lanyard.Globe.prototype.getRadius = function() {};


/**
 * Create a tessellation of this globe.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {lanyard.SectorGeometryList} the tessellated globe.
 */
lanyard.Globe.prototype.tessellate = function(dc) {};

/* EOF */
