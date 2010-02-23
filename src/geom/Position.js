/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.Position');

goog.require('lanyard.geom.Angle');

/**
 * A basic position on the globe.
 * @constructor
 * @param {lanyard.geom.Angle} latitude the position latitude.
 * @param {lanyard.geom.Angle} longitude the postion longitude.
 * @param {Number} the position elevation.
 */
lanyard.geom.Position = function (latitude, longitude, elevation) {
    /** @private */ this._latitude = latitude;
    /** @private */ this._longitude = longitude;
    /** @private */ this._elevation = elevation;
};

/**
 * A zero position.
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
 * @param {Number} latitude the latitude in radians.
 * @param {Number} longitude the longitude in radians.
 * @param {Number} elevation the elevation.
 * @return {lanyard.geom.Position} the new position.
 */ 
lanyard.geom.Position.prototype.fromRadians = function (latitude, longitude, elevation) {
    return new lanyard.geom.Position(
        lanyard.geom.Angle.prototype.fromRadians(latitude),
        lanyard.geom.Angle.prototype.fromRadians(longitude),
        elevation
    );
};

/**
 * Create a position from degrees.
 * @param {Number} latitude the latitude in degrees.
 * @param {Number} longitude the longitude in degrees.
 * @param {Number} elevation the elevation.
 * @return {lanyard.geom.Position} the new position.
 */
lanyard.geom.Position.prototype.fromDegrees = function (latitude, longitude, elevation) {
    return new lanyard.geom.Position(
        lanyard.geom.Angle.prototype.fromDegrees(latitude),
        lanyard.geom.Angle.prototype.fromDegrees(longitude),
        elevation
    );
};

/**
 * Obtains the latitude of this position.
 * @return {lanyard.geom.Angle} this position's latitude.
 */
lanyard.geom.Position.prototype.getLatitude = function () {
    return this._latitude;
};

/**
 * Obtains the longitude of this position.
 * @return {lanyard.geom.Angle} this position's longitude.
 */
lanyard.geom.Position.prototype.getLongitude = function () {
    return this._longitude;
};

/**
 * Obtains the elevation of this position.
 * @return {Number} this position's elevation.
 */
lanyard.geom.Position.prototype.getElevation = function () {
    return this._elevation;
};

/* EOF */
