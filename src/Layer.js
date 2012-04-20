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

goog.provide('lanyard.Layer');

goog.require('lanyard.DrawContext');
goog.require('lanyard.geom.Extent');



/**
 * An interface for layers.
 *
 * @interface
 */
lanyard.Layer = function() {};


/**
 * Accessor to check if this layer is enabled.
 *
 * @return {boolean} if this layer is enabled or not.
 */
lanyard.Layer.prototype.isEnabled = function() {};


/**
 * Mutator to set if this layer is enabled or not.
 *
 * @param {boolean} enabled if this layer should be enabled or not.
 */
lanyard.Layer.prototype.setEnabled = function(enabled) {};


/**
 * Accessor for this layer's name.
 *
 * @return {string} this layer's name.
 */
lanyard.Layer.prototype.getName = function() {};


/**
 * Mutator for this layer's name.
 *
 * @param {string} name this layer's name.
 */
lanyard.Layer.prototype.setName = function(name) {};


/**
 * Accessor for this layer's opacity.
 *
 * @return {number} this layer's opacity.
 */
lanyard.Layer.prototype.getOpacity = function() {};


/**
 * Mutator for this layer's opacity.
 *
 * @param {number} opacity the opacity to set this layer's opacity to.
 */
lanyard.Layer.prototype.setOpacity = function(opacity) {};


/**
 * A way to render this layer to the draw context.
 *
 * @param {lanyard.DrawContext} dc the draw context to render to.
 */
lanyard.Layer.prototype.render = function(dc) {};

/* EOF */
