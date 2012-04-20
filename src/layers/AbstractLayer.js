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

goog.provide('lanyard.layers.AbstractLayer');



/**
 * An abstract layer to provide common functionality for layers.
 *
 * @constructor
 * @implements {lanyard.Layer}
 * @this {lanyard.layers.AbstractLayer}
 */
lanyard.layers.AbstractLayer = function() {
  this._logger = goog.debug.Logger.getLogger('lanyard.layers.AbstractLayer');

  //this._logger.fine("AbstractLayer constructor was called.");

  /**
   * @type {boolean}
   */
  this.enabled = true;

  /**
   * @type {number}
   */
  this.opacity = 1.0;

  /**
     * @private
     * @type {number}
     */
  this.minActiveAltitude = Number.MIN_VALUE;

  /**
     * @private
     * @type {number}
     */
  this.maxActiveAltitude = Number.MAX_VALUE;

  /**
     * @private
     * @type {string}
     */
  this.displayName = 'Untitled Layer';
};
goog.exportSymbol('lanyard.layers.AbstractLayer', lanyard.layers.AbstractLayer);


/**
 * Determine if the layer is enabled or not.
 *
 * @this {lanyard.layers.AbstractLayer}
 * @return {boolean} if this layer is enabled or not.
 */
lanyard.layers.AbstractLayer.prototype.isEnabled = function() {
  return this.enabled;
};


/**
 * Set this layer to an enabled state.
 *
 * @this {lanyard.layers.AbstractLayer}
 * @param {boolean} enabled if this layer should be enabled or not.
 */
lanyard.layers.AbstractLayer.prototype.setEnabled = function(enabled) {
  this.enabled = enabled;
};


/**
 * Get the name of this layer.
 *
 * @return {string} the name of this layer.
 */
lanyard.layers.AbstractLayer.prototype.getName = function() {
  return this.myName();
};


/**
 * Mutator for the name of this layer.
 *
 * @this {lanyard.layers.AbstractLayer}
 * @param {string} name the new name of this layer.
 */
lanyard.layers.AbstractLayer.prototype.setName = function(name) {
  this.displayName = name;
};


/**
 * Find an return a string representation of this layer.
 *
 * @return {string} a string representation of this layer.
 */
lanyard.layers.AbstractLayer.prototype.toString = function() {
  return this.myName();
};


/**
 * Get the name of this layer.
 *
 * @return {string} the display name of this layer.
 */
lanyard.layers.AbstractLayer.prototype.myName = function() {
  return this.displayName;
};


/**
 * Accessor for the opacity of this layer.
 *
 * @return {number} the opacity of this layer.
 */
lanyard.layers.AbstractLayer.prototype.getOpacity = function() {
  return this.opacity;
};


/**
 * Set the opacity of this layer.
 *
 * @param {number} opacity the new opacity of this layer.
 */
lanyard.layers.AbstractLayer.prototype.setOpacity = function(opacity) {
  this.opacity = opacity;
};


/**
 * Determine the minimum active altitude of this layer.
 *
 * @return {number} the minimum active altitude of this layer.
 */
lanyard.layers.AbstractLayer.prototype.getMinActiveAltitude = function() {
  return this.minActiveAltitude;
};


/**
 * Set the minimum active altitude of this layer.
 *
 * @param {number} minActiveAltitude the minimum active altitude of this layer.
 */
lanyard.layers.AbstractLayer.prototype.setMinActiveAltitude = function(minActiveAltitude) {
  this.minActiveAltitude = minActiveAltitude;
};


/**
 * Accessor for the maximum active altitude for this layer.
 *
 * @return {number} the maximum active altitude for this layer.
 */
lanyard.layers.AbstractLayer.prototype.getMaxActiveAltitude = function() {
  return this.maxActiveAltitude;
};


/**
 * Set the maximum active altitude for this layer.
 *
 * @param {number} maxActiveAltitude the maximum active altitude for this layer.
 */
lanyard.layers.AbstractLayer.prototype.setMaxActiveAltitude = function(maxActiveAltitude) {
  this.maxActiveAltitude = maxActiveAltitude;
};


/**
 * Indicates whether the layer is in the view. The method implemented here is
 * a default indicating the layer is in view. Subclasses able to determine
 * their presence in the view should override this implementation.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {boolean} true if the layer is in the view, false otherwise.
 */
lanyard.layers.AbstractLayer.prototype.isLayerInView = function(dc) {
  return true;
};


/**
 * Indicates whether the layer is active based on arbitrary criteria. The method
 * implemented here is a default indicating the layer is active if the current
 * altitude is within the layer's min and max active altitudes. Subclasses able
 * to consider more criteria should override this implementation.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {boolean} true if the layer is active, false otherwise.
 */
lanyard.layers.AbstractLayer.prototype.isLayerActive = function(dc) {
  /** @type {number} */
  var altitude = dc.getView().getAltitude();

  /** @type {boolean} */
  var isActive = altitude >= this.minActiveAltitude && altitude <= this.maxActiveAltitude;

  return isActive;
};


/**
 * Render this layer.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.layers.AbstractLayer.prototype.render = function(dc) {
  //this._logger.fine("Abstract layer render was called.");

  if (!this.enabled) {
    return;
  }

  if (!this.isLayerActive(dc)) {
    return;
  }

  if (!this.isLayerInView(dc)) {
    return;
  }

  this.doRender(dc);
};

/* EOF */
