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

goog.provide('lanyard.Elevations');



/**
 * The Elevations interface provides elevations at specified latitude and longitude
 * positions. Objects implementing this interface are created by {lanyard.ElevationModel}.
 *
 * @interface
 */
lanyard.Elevations = function() {};


/**
 * Indicates whether the object contains useful elevations. An Elevations instance may exist
 * without holding any elevations. This can occur when the resources needed to determine
 * elevations are not yet local. This method enables the detection of that case. Callers typically
 * use it to avoid time-consuming computations that require valid elevations.
 *
 * @return {boolean} true if a call to getElevation(double, double) will return valid elevations,
 *         otherwise false indicating that the value 0 will always be returned from that method.
 */
lanyard.Elevations.prototype.hasElevations = function() {};


/**
 * Returns the elevation at a specific latitude and longitude, each specified in radians.
 *
 * @param {number} latRadians the position's latitude in radians, in the range [-pi/2, +pi/2].
 * @param {number} lonRadians the position's longitude in radians, in the range [-pi, +pi].
 * @return {number} The elevation at the given position, or 0 if elevations are not available.
 */
lanyard.Elevations.prototype.getElevation = function(latRadians, lonRadians) {};


/**
 * Returns the resolution value of the elevations. The meaning and use of this value is defined
 * by subclasses of ElevationModel.
 *
 * @return {number} the resolution associated with this.
 */
lanyard.Elevations.prototype.getResolution = function() {};


/**
 * Returns the {lanyard.geom.Sector} the elevations pertain to.
 *
 * @return {lanyard.geom.Sector} the sector the elevations pertain to.
 */
lanyard.Elevations.prototype.getSector = function() {};

/* EOF */
