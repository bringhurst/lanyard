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

goog.provide('lanyard.globes.RenderInfo');

/**
 * Render info for tessellation.
 *
 * @constructor
 * @this {lanyard.globes.RenderInfo}
 * @param {number} density
 * @param {Array.<number>} vertices
 * @param {Array.<number>} texCoords
 * @param {lanyard.geom.Point} refCenter
 * @param {number} resolution
 * @param {lanyard.globes.RectTile} tile the tile this info is for.
 */
lanyard.globes.RenderInfo = function(density, vertices, texCoords, refCenter, resolution, tile) {
    /** @public */ this.density = density;
    /** @public */ this.vertices = vertices;
    /** @public */ this.texCoords = texCoords;
    /** @public */ this.referenceCenter = refCenter;
    /** @public */ this.indices = tile.getIndices(this.density);
    /** @public */ this.resolution = resolution;
};
goog.exportSymbol('lanyard.globes.RenderInfo', lanyard.globes.RenderInfo);

/* EOF */
