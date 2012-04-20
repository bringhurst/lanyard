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

goog.provide('lanyard.geom.Position');

goog.require('lanyard.geom.Angle');



/**
 * A basic position on the globe.
 *
 * @constructor
 * @param {lanyard.geom.Angle} latitude the position latitude.
 * @param {lanyard.geom.Angle} longitude the postion longitude.
 * @param {number} elevation the position elevation.
 */
lanyard.geom.Position = function(latitude, longitude, elevation) {
  /** @private */ this._latitude = latitude;
  /** @private */ this._longitude = longitude;
  /** @private */ this._elevation = elevation;
};


/**
 * A zero position.
 *
 * @const
 * @type {lanyard.geom.Position}
 */
lanyard.geom.Position.prototype.ZERO = new lanyard.geom.Position(
    lanyard.geom.Angle.prototype.ZERO,
    lanyard.geom.Angle.prototype.ZERO,
    0
    );


/**
 * Create a position from radians.
 *
 * @param {number} latitude the latitude in radians.
 * @param {number} longitude the longitude in radians.
 * @param {number} elevation the elevation.
 * @return {lanyard.geom.Position} the new position.
 */
lanyard.geom.Position.prototype.fromRadians = function(latitude, longitude, elevation) {
  return new lanyard.geom.Position(
      lanyard.geom.Angle.prototype.fromRadians(latitude),
      lanyard.geom.Angle.prototype.fromRadians(longitude),
      elevation
  );
};


/**
 * Create a position from degrees.
 *
 * @param {number} latitude the latitude in degrees.
 * @param {number} longitude the longitude in degrees.
 * @param {number} elevation the elevation.
 * @return {lanyard.geom.Position} the new position.
 */
lanyard.geom.Position.prototype.fromDegrees = function(latitude, longitude, elevation) {
  return new lanyard.geom.Position(
      lanyard.geom.Angle.prototype.fromDegrees(latitude),
      lanyard.geom.Angle.prototype.fromDegrees(longitude),
      elevation
  );
};


/**
 * Create a position from a latlon.
 *
 * @param {lanyard.geom.LatLon} latLon the latlon object to use.
 * @param {number} elevation the elevation to use.
 */
lanyard.geom.Position.prototype.fromLatLon = function(latLon, elevation) {
  return new lanyard.geom.Position(
      latLon.getLatitude(),
      latLon.getLongitude(),
      elevation
  );
};


/**
 * Obtains the latitude of this position.
 *
 * @return {lanyard.geom.Angle} this position's latitude.
 */
lanyard.geom.Position.prototype.getLatitude = function() {
  return this._latitude;
};


/**
 * Obtains the longitude of this position.
 *
 * @return {lanyard.geom.Angle} this position's longitude.
 */
lanyard.geom.Position.prototype.getLongitude = function() {
  return this._longitude;
};


/**
 * Obtains the elevation of this position.
 *
 * @return {number} this position's elevation.
 */
lanyard.geom.Position.prototype.getElevation = function() {
  return this._elevation;
};


/**
 * Add this position to another.
 *
 * @param {lanyard.geom.Position} that the position to add.
 * @return {lanyard.geom.Position} the added positions.
 */
lanyard.geom.Position.prototype.add = function(that) {
  /** @type {lanyard.geom.Angle} */
  var lat = lanyard.geom.Angle.prototype.fromDegrees(
      lanyard.geom.Angle.prototype.normalizedDegreesLatitude(
      this.getLatitude().add(
      that.getLatitude()
      ).getDegrees()
      )
      );

  /** @type {lanyard.geom.Angle} */
  var lon = lanyard.geom.Angle.prototype.fromDegrees(
      lanyard.geom.Angle.prototype.normalizedDegreesLongitude(
      this.getLongitude().add(
      that.getLongitude()
      ).getDegrees()
      )
      );

  return new lanyard.geom.Position(lat, lon, this.getElevation() + that.getElevation());
};


/**
 * Subtract this position from another.
 *
 * @param {lanyard.geom.Position} that the position to subtract.
 * @return {lanyard.geom.Position} the result of the subtraction.
 */
lanyard.geom.Position.prototype.subtract = function(that) {
  /** @type {lanyard.geom.Angle} */
  var lat = lanyard.geom.Angle.prototype.fromDegrees(
      lanyard.geom.Angle.prototype.normalizedDegreesLatitude(
      this.getLatitude().subtract(
      that.getLatitude()
      ).getDegrees()
      )
      );

  /** @type {lanyard.geom.Angle} */
  var lon = lanyard.geom.Angle.prototype.fromDegrees(
      lanyard.geom.Angle.prototype.normalizedDegreesLongitude(
      this.getLongitude().subtract(
      that.getLongitude()
      ).getDegrees()
      )
      );

  return new lanyard.geom.Position(lat, lon, this.getElevation() - that.getElevation());
};


/**
 * Override the toString method.
 *
 * @return {string} this position as a string.
 */
lanyard.geom.Position.prototype.toString = function() {
  /** @type {string} */
  var ret = 'A position with a longitude of ' + this._longitude +
      ', a latitude of ' + this._latitude + ' and an elevation of ' +
      this._elevation;

  return ret;
};

/* EOF */
