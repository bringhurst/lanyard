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

goog.provide('lanyard.Model');

goog.require('lanyard.Tessellator');



/**
 * An interface for a model.
 *
 * @interface
 */
lanyard.Model = function() {};


/**
 * Extent accessor.
 *
 * @return {lanyard.geom.Extent}
 */
lanyard.Model.prototype.getExtent = function() {};


/**
 * Globe accessor.
 *
 * @return {lanyard.Globe} the globe.
 */
lanyard.Model.prototype.getGlobe = function() {};


/**
 * Get the layers.
 *
 * @return {Array.<lanyard.Layer>} the layer list.
 */
lanyard.Model.prototype.getLayers = function() {};


/**
 * The globe mutator.
 *
 * @param {lanyard.Globe} globe the new globe.
 */
lanyard.Model.prototype.setGlobe = function(globe) {};


/**
 * Layers mutator.
 *
 * @param {Array.<lanyard.Layer>} layers the new layer list.
 */
lanyard.Model.prototype.setLayers = function(layers) {};


/**
 * Tessellator accessor.
 *
 * @return {lanyard.Tessellator} the tessellator.
 */
lanyard.Model.prototype.getTessellator = function() {};


/**
 * The tessellator mutator.
 *
 * @param {lanyard.Tessellator} tessellator the new tessellator.
 */
lanyard.Model.prototype.setTessellator = function(tessellator) {};


/**
 * Set the show wireframe interior flag.
 *
 * @param {boolean} show if we should show the wireframe interior or not.
 */
lanyard.Model.prototype.setShowWireframeInterior = function(show) {};


/**
 * Set the show wireframe exterior flag.
 *
 * @param {boolean} show if we should show the wireframe exterior or not.
 */
lanyard.Model.prototype.setShowWireframeExterior = function(show) {};


/**
 * Accessor for the wireframe interior flag.
 *
 * @return {boolean} true if the wireframe interior flag is set, false otherwise.
 */
lanyard.Model.prototype.isShowWireframeInterior = function() {};


/**
 * Accessor for the show wireframe exterior flag.
 *
 * @return {boolean} true if the wireframe exterior flag is set, false otherwise.
 */
lanyard.Model.prototype.isShowWireframeExterior = function() {};


/**
 * Accessor for the flag to show the tessellation bounding volumes.
 *
 * @return {boolean} true if the tessellation bounding volumes are showing, false otherwise.
 */
lanyard.Model.prototype.isShowTessellationBoundingVolumes = function() {};


/**
 * Mutator for the flag to show the tessellation bounding volumes.
 *
 * @param {boolean} showTileBoundingVolumes set if the tessellation bounding volumes should show.
 */
lanyard.Model.prototype.setShowTessellationBoundingVolumes = function(showTileBoundingVolumes) {};

/* EOF */
