/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/**
 * Lanyard is Copyright 2010 Jonathan Bringhurst.
 *
 * This file is part of Lanyard.
 *
 * Lanyard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Lanyard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Lanyard.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Portions of Lanyard which do not constitute a "Larger Work" may be licensed
 * under the NASA OPEN SOURCE AGREEMENT VERSION 1.3.
 *
 * See http://worldwind.arc.nasa.gov/ for further information about NASA World Wind.
 */

goog.provide('lanyard.SectorGeometry');

/**
 * An interface for a sector geometry.
 *
 * @interface
 * @implements {lanyard.Renderable}
 */
lanyard.SectorGeometry = function() {};

/**
 * Extent accessor.
 *
 * @return {lanyard.geom.Extent} the extent geometry.
 */
lanyard.SectorGeometry.prototype.getExtent = function() {};

/**
 * Sector accessor.
 *
 * @return {lanyard.geom.Sector} the sector geometry.
 */
lanyard.SectorGeometry.prototype.getSector = function() {};

/**
 * Obtain the surface point at the specified location.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the position.
 * @param {lanyard.geom.Angle} longitude the longitude of the position.
 * @param {number} metersOffset the meters offset.
 * @return {lanyard.geom.Point} the surface point.
 */
lanyard.SectorGeometry.prototype.getSurfacePoint = function(latitude, longitude, metersOffset) {};

/**
 * Render the wireframe.
 *
 * @param {lanyard.DrawContext} dc the draw context to render to.
 * @param {boolean} interior render the interior wireframe.
 * @param {boolean} exterior render the exterior wireframe.
 */
lanyard.SectorGeometry.prototype.renderWireframe = function(dc, interior, exterior) {};

/**
 * Render the bounding volume.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.SectorGeometry.prototype.renderBoundingVolume = function(dc) {};

/**
 * Render this sector geometry using multiple texture units.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.SectorGeometry.prototype.render = function(dc) {};

/* EOF */
