/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.Elevations');

goog.require('lanyard.geom.Sector');

/**
 * The Elevations interface provides elevations at specified latitude and longitude
 * positions. Objects implementing this interface are created by {lanyard.ElevationModel}.
 *
 * @interface
 */
lanyard.Elevations = function () {};

/**
 * Indicates whether the object contains useful elevations. An Elevations instance may exist
 * without holding any elevations. This can occur when the resources needed to determine
 * elevations are not yet local. This method enables the detection of that case. Callers typically
 * use it to avoid time-consuming computations that require valid elevations.
 *
 * @return {boolean} true if a call to getElevation(double, double) will return valid elevations,
 *         otherwise false indicating that the value 0 will always be returned from that method.
 */
lanyard.Elevations.prototype.hasElevations = function () {};

/**
 * Returns the elevation at a specific latitude and longitude, each specified in radians.
 *
 * @param {number} latRadians the position's latitude in radians, in the range [-pi/2, +pi/2].
 * @param {number} lonRadians the position's longitude in radians, in the range [-pi, +pi].
 * @return {number} The elevation at the given position, or 0 if elevations are not available.
 */
lanyard.Elevations.prototype.getElevation = function (latRadians, lonRadians) {};

/**
 * Returns the resolution value of the elevations. The meaning and use of this value is defined
 * by subclasses of ElevationModel.
 *
 * @return {number} the resolution associated with this.
 */
lanyard.Elevations.prototype.getResolution = function () {};

/**
 * Returns the {lanyard.geom.Sector} the elevations pertain to.
 *
 * @return {lanyard.geom.Sector} the sector the elevations pertain to.
 */
lanyard.Elevations.prototype.getSector = function () {};

/* EOF */
