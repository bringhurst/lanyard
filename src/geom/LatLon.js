/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/**
 * Represents a point on the two-dimensional surface of a globe. Latitude is the degrees
 * North and ranges between [-90, 90], while longitude refers to degrees East, and
 * ranges between (-180, 180].
 */
goog.provide('lanyard.geom.LatLon');

goog.require('lanyard.geom.Angle');
goog.require('lanyard.geom.Quaternion');

/**
 * Contructs a new LatLon from two angles.
 *
 * @constructor
 * @this {lanyard.geom.LatLon}
 * @param {lanyard.geom.Angle} latitude the angle of latitude.
 * @param {lanyard.geom.Angle} longitude the angle of longitude.
 */
lanyard.geom.LatLon = function (latitude, longitude) {
    /** @private */ this._latitude = latitude;
    /** @private */ this._longitude = longitude;
};
goog.exportSymbol('lanyard.geom.LatLon', lanyard.geom.LatLon);

/**
 * Factor method for obtaining a new LatLon from two angles expressed in radians.
 *
 * @param {number} latitude in radians.
 * @param {number} longitude in radians.
 * @return {lanyard.geom.LatLon} a new LatLon from the given angles, which are expressed as radians.
 */
lanyard.geom.LatLon.prototype.fromRadians = function (latitude, longitude) {
    return new lanyard.geom.LatLon(
        lanyard.geom.Angle.prototype.fromRadians(latitude),
        lanyard.geom.Angle.prototype.fromRadians(longitude));
};

/**
 * Factory method for obtaining a new LatLon from two angles expressed in degrees.
 *
 * @param {number} latitude in degrees.
 * @param {number} longitude in degrees.
 * @return {lanyard.geom.LatLon} a new LatLon from the given angles, which are expressed as degrees.
 */
lanyard.geom.LatLon.prototype.fromDegrees = function (latitude, longitude) {
    return new lanyard.geom.LatLon(
        lanyard.geom.Angle.prototype.fromDegrees(latitude),
        lanyard.geom.Angle.prototype.fromDegrees(longitude));
};

/**
 * Obtains the latitude of this LatLon.
 *
 * @return {lanyard.geom.Angle} this LatLon's latitude.
 */
lanyard.geom.LatLon.prototype.getLatitude = function () {
    return this._latitude;
};

/**
 * Obtains the longitude of this LatLon.
 *
 * @return {lanyard.geom.Angle} this LatLon's longitude.
 */
lanyard.geom.LatLon.prototype.getLongitude = function () {
    return this._longitude;
};

/**
 * Interpolate between two LatLons.
 *
 * @param {number} t
 * @param {lanyard.geom.LatLon} begin
 * @param {lanyard.geom.LatLon} end
 * @return {lanyard.geom.LatLon}
 */
lanyard.geom.LatLon.prototype.interpolate = function (t, begin, end) {
    if (t < 0) {
        return begin;
    } else if (t > 1) {
        return end;
    }

    var beginQuat = lanyard.geom.Quaternion.prototype.fromEuler(
        begin.getLongitude().getRadians(),
        begin.getLatitude().getRadians(), 0);

    var endQuat = lanyard.geom.Quaternion.prototype.fromEuler(
        end.getLongitude().getRadians(),
        end.getLatitude().getRadians(), 0);

    var q = lanyard.geom.Quaternion.prototype.slerp(beginQuat, endQuat, t);

    var v = lanyard.geom.Quaternion.prototype.toEuler(q);

    if (isNaN(v.getX()) || isNaN(v.getY())) {
        return null;
    }

    return lanyard.geom.LatLon.prototype.fromRadians(v.getY(), v.getX());
};

/**
 * Obtain a string representation of this LatLon.
 *
 * @return {string} a string representation of this LatLon.
 */
lanyard.geom.LatLon.prototype.toString = function () {
    return "(" + this._latitude.toString() + ", " + this._longitude.toString() + ")";
};

/* EOF */
