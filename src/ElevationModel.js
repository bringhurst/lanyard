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

goog.provide('lanyard.ElevationModel');

goog.require('lanyard.Elevations');
goog.require('lanyard.geom.Angle');



/**
 * Provides the elevations of all points on a Globe . Every Globe has an elevation model
 * implementing this interface.
 *
 * Elevations are organized by Sector. Elevation models return an Elevations object for
 * requested sectors. This object is then used to query elevations at latitude/longitude
 * positions within that sector.
 *
 * An ElevationModel typically approximates elevations at multiple levels of spatial
 * resolution. For any given viewing position the model determines an appropriate target
 * resolution. That target resolution may not be immediately achievable, however, because
 * the corresponding elevation data might not be locally available and must be retrieved
 * from a remote location. When this is the case, the Elevations object returned for a
 * sector holds the resolution achievable with the data currently available. That
 * resolution may not be the same as the target resolution. The target resolution and the
 * actual resolution are made available in the interface so that users of this class may
 * use the resolution values to compare previously computed elevation sectors with newly
 * computed ones, and thereby enable effective caching of elevations computed for the
 * sector.
 *
 * @interface
 */
lanyard.ElevationModel = function() {};


/**
 * Determine if this elevation model is enabled or not.
 *
 * @return {boolean} if this elevation model is enabled or not.
 */
lanyard.ElevationModel.prototype.isEnabled = function() {};


/**
 * Set the enabled state of this elevation model.
 *
 * @param {boolean} enable if this elevation model is enabled or not.
 */
lanyard.ElevationModel.prototype.setEnabled = function(enable) {};


/**
 * Returns the maximum elevation contained in the elevation model.
 * This value is the height of the highest point on the globe.
 *
 * @return {number} the maximum elevation of the model.
 */
lanyard.ElevationModel.prototype.getMaximumElevation = function() {};


/**
 * Returns the minimum elevation contained in the elevation model.
 * This value is the height of the lowest point on the globe. It may
 * be negative, indicating a value below mean surface level. (Sea
 * level in the case of Earth.)
 *
 * @return {number} the minimum elevation of the model.
 */
lanyard.ElevationModel.prototype.getMinimumElevation = function() {};


/**
 * Computes and returns an Elevations object for the specified Sector
 * and target resolution. If the target resolution can not currently be
 * achieved, the best available elevations are returned.
 *
 * Implementing classes of ElevationModel interpret resolution in a
 * class-specific way. See the descriptions of those classes to learn
 * their use of this value. The elevations returned are in the form of
 * an Elevations object. Specific elevations are returned by that object.
 *
 * The resolution value returned will be either the specified resolution
 * or the best available alternative.
 *
 * @param {lanyard.geom.Sector} sector the sector to return elevations for.
 * @param {number} resolution a value interpreted in a class-specific way by implementing classes.
 * @return {lanyard.Elevations} an object representing the elevations for the specified sector.
 */
lanyard.ElevationModel.prototype.getElevations = function(sector, resolution) {};


/**
 * Returns the resolution appropriate to the given Sector and view parameters.
 * The view parameters are read from the specified DrawContext. Implementing
 * classes of ElevationModel interpret resolution in class-specific ways. See
 * the descriptions of subclasses to learn their use of this value. This method
 * is used to determine the resolution the model will use if all resources are
 * available to compute that resolution. It is subsequently passed to
 * getElevations(Sector, int) when a sector's resolutions are queried.
 *
 * @param {lanyard.DrawContext} dc the draw context to read the view and rendering parameters from.
 * @param {lanyard.geom.Sector} sector the Sector to compute the target resolution for.
 * @return {number} he appropriate resolution for the sector and draw context values.
 */
lanyard.ElevationModel.prototype.getTargetResolution = function(dc, sector, density) {};


/**
 * Find the elevation of the specified coordinate.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude of the coordinate.
 * @return {number} the elevation at the specified coordinate.
 */
lanyard.ElevationModel.prototype.getElevation = function(latitude, longitude) {};

/* EOF */
