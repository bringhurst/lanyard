/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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

goog.provide('lanyard.render.SurfaceTile');

/**
 * An interface for a surface tile.
 *
 * @interface
 */
lanyard.render.SurfaceTile = function() {};

/**
 * Bind the tile to a draw context.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {boolean} true if the bind was successful, false otherwise.
 */
lanyard.render.SurfaceTile.prototype.bind = function(dc) {};

/**
 * Apply the internal transform.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.render.SurfaceTile.prototype.applyInternalTransform = function(dc) {};

/**
 * Get the sector of this surface tile.
 *
 * @return {lanyard.geom.Sector} the sector of the surface tile.
 */
lanyard.render.SurfaceTile.prototype.getSector = function() {};

/**
 * Get the extent of this surface tile.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {lanyard.geom.Extent} the extent of this surface tile.
 */
lanyard.render.SurfaceTile.prototype.getExtent = function(dc) {};

/* EOF */
