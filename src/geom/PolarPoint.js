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

/** Represents a point in space defined by a latitude, longitude and distance from the origin. */
goog.provide('lanyard.geom.PolarPoint');

goog.require('lanyard.geom.Angle');
goog.require('lanyard.geom.Point');



/**
 * Obtains a PolarPoint from two angles and a radius.
 *
 * @constructor
 * @this {lanyard.geom.PolarPoint}
 * @param {lanyard.geom.Angle} latitude the latitude.
 * @param {lanyard.geom.Angle} longitude the longitude.
 * @param {number} radius the distance from the center.
 */
lanyard.geom.PolarPoint = function(latitude, longitude, radius) {
  /** @private */ this._latitude = latitude;
  /** @private */ this._longitude = longitude;
  /** @private */ this._radius = radius;
};
goog.exportSymbol('lanyard.geom.PolarPoint', lanyard.geom.PolarPoint);


/**
 * A PolarPoint of value zero.
 *
 * @const
 * @type {lanyard.geom.PolarPoint}
 */
lanyard.geom.PolarPoint.prototype.ZERO =
    new lanyard.geom.PolarPoint(lanyard.geom.Angle.prototype.ZERO, lanyard.geom.Angle.prototype.ZERO, 0);
goog.exportSymbol('lanyard.geom.PolarPoint.prototype.ZERO',
    lanyard.geom.PolarPoint.prototype.ZERO);


/**
 * Obtains a PolarPoint from radians and a radius.
 *
 * @param {number} latitude the latitude in radians.
 * @param {number} longitude the longitude in radians.
 * @param {number} radius the distance form the center.
 * @return {lanyard.geom.PolarPoint} a new PolarPoint.
 */
lanyard.geom.PolarPoint.prototype.fromRadians = function(latitude, longitude, radius) {
  return new lanyard.geom.PolarPoint(
      lanyard.geom.Angle.prototype.fromRadians(latitude),
      lanyard.geom.Angle.prototype.fromRadians(longitude),
      radius);
};


/**
 * Obtains a PolarPoint from degrees and a radius.
 *
 * @param {number} latitude the latitude in degrees.
 * @param {number} longitude the longitude in degrees.
 * @param {number} radius the distance form the center.
 * @return {lanyard.geom.PolarPoint} a new PolarPoint.
 */
lanyard.geom.PolarPoint.prototype.fromDegrees = function(latitude, longitude, radius) {
  return new lanyard.geom.PolarPoint(
      lanyard.geom.Angle.prototype.fromDegrees(latitude),
      lanyard.geom.Angle.prototype.fromDegrees(longitude),
      radius);
};


/**
 * Obtains a PolarPoint from a cartesian point.
 *
 * @param {lanyard.geom.Point} cartesianPoint the point to convert.
 * @return {lanyard.geom.PolarPoint} the cartesian point expressed as a polar point.
 */
lanyard.geom.PolarPoint.prototype.fromCartesianPoint = function(cartesianPoint) {
  return lanyard.geom.PolarPoint.prototype.fromCartesian(
      cartesianPoint.getX(), cartesianPoint.getY(), cartesianPoint.getZ());
};


/**
 * Obtains a PolarPoint from cartesian coordinates.
 *
 * @param {number} x the x coordinate of the cartesian point.
 * @param {number} y the y coordinate of the cartesian point.
 * @param {number} z the z coordinate of the cartesian point.
 * @return {lanyard.geom.PolarPoint} a polar point located at (x,y,z) in cartesian space.
 */
lanyard.geom.PolarPoint.prototype.fromCartesian = function(x, y, z) {
  var radius = Math.sqrt(x * x + y * y + z * z);
  var latRads = Math.atan2(y, Math.sqrt(x * x + z * z));
  var lonRads = Math.atan2(x, z);

  return lanyard.geom.PolarPoint.prototype.fromRadians(latRads, lonRads, radius);
};


/**
 * Obtains the latitude of this polar point.
 *
 * @return {lanyard.geom.Angle} this polar point's latitude.
 */
lanyard.geom.PolarPoint.prototype.getLatitude = function() {
  return this._latitude;
};


/**
 * Obtains the longitude of this polar point.
 *
 * @return {lanyard.geom.Angle} this polar point's longitude.
 */
lanyard.geom.PolarPoint.prototype.getLongitude = function() {
  return this._longitude;
};


/**
 * Obtains the radius of this polar point.
 *
 * @return {number} the distance from this polar point to its origin.
 */
lanyard.geom.PolarPoint.prototype.getRadius = function() {
  return this._radius;
};


/**
 * Obtains a cartesian point from a given latitude, longitude and distance from center.
 * This method is equivalent to, but may perform faster than:
 * Point p = new PolarPoint(latitude, longitude, radius).toCartesian()
 *
 * @param {lanyard.geom.Angle} latitude the latitude.
 * @param {lanyard.geom.Angle} longitude the longitude.
 * @param {number} radius the distance from the origin.
 * @return {lanyard.geom.Point} a cartesian point from two angles and a radius.
 */
lanyard.geom.PolarPoint.prototype.toCartesian = function(latitude, longitude, radius) {
  var x = radius * longitude.sin() * latitude.cos();
  var y = radius * latitude.sin();
  var z = radius * longitude.cos() * latitude.cos();

  return new lanyard.geom.Point(x, y, z, 1);
};


/**
 * Obtains a string representation of this polar point.
 *
 * @return {string} a string representation of this polar point.
 */
lanyard.geom.PolarPoint.prototype.toString = function() {
  return '(lat: ' + this._latitude.toString() +
      ', lon: ' + this._longitude.toString() +
      ', r: ' + this._radius + ')';
};

/* EOF */
