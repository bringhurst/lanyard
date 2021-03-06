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

goog.provide('lanyard.BasicModel');

goog.require('lanyard.globes.Earth');
goog.require('lanyard.globes.EllipsoidRectangularTessellator');



/**
 * A model implementation.
 *
 * @constructor
 * @implements {lanyard.Model}
 */
lanyard.BasicModel = function() {
  /**
     * @private
     * @type {lanyard.Globe}
     */
  this.globe = new lanyard.globes.Earth();

  /**
     * @private
     * @type {lanyard.Tessellator}
     */
  this.tessellator = null;

  /**
     * @private
     * @type {Array.<lanyard.Layer>}
     */
  this.layers = [];

  /**
     * @private
     * @type {boolean}
     */
  this.showWireframeInterior = false;

  /**
     * @private
     * @type {boolean}
     */
  this.showWireframeExterior = false;

  /**
     * @private
     * @type {boolean}
     */
  this.showTessellationBoundingVolumes = false;

  /* Create the default layers, probably just a BMNGSurfaceLayer for now. */
  this.createLayers();
};


/**
 * Create the most basic layers so we have something to show by default.
 *
 * @private
 */
lanyard.BasicModel.prototype.createLayers = function() {
  /** @type {Array.<lanyard.Layer>} */
  var layers = [
    /* A plain blue marble layer. */
    //new lanyard.layers.earth.BMNGSurfaceLayer()
  ];

  this.setLayers(layers);
};


/**
 * Set the current globe for this model.
 *
 * @param {lanyard.Globe} globe the new globe for this model.
 */
lanyard.BasicModel.prototype.setGlobe = function(globe) {
  this.globe = globe;
};


/**
 * Replace the current layer list with new layers.
 *
 * @param {Array.<lanyard.Layer>} layers the new layer list to replace the current one.
 */
lanyard.BasicModel.prototype.setLayers = function(layers) {
  this.layers = layers;
};


/**
 * Get a reference to the globe currently used in this model.
 *
 * @return {lanyard.Globe} the globe used in this model.
 */
lanyard.BasicModel.prototype.getGlobe = function() {
  return this.globe;
};


/**
 * Get a reference to the current layer list.
 *
 * @return {Array.<lanyard.Layer>} the current layer list used for this model.
 */
lanyard.BasicModel.prototype.getLayers = function() {
  return this.layers;
};


/**
 * Return a reference to the tessellator used for this model. This will default to creating
 * a new rectangular ellipsoidal tessellator if a globe exists without a current tessellator.
 *
 * @return {lanyard.Tessellator} the tessellator currently used for this model.
 */
lanyard.BasicModel.prototype.getTessellator = function() {
  if (!this.tessellator && this.globe) {
    this.tessellator = new lanyard.globes.EllipsoidRectangularTessellator(this.globe);
  }

  return this.tessellator;
};


/**
 * Set a new tessellator for this model to use.
 *
 * @param {lanyard.Tessellator} tessellator the new tessellator for this model to use.
 */
lanyard.BasicModel.prototype.setTessellator = function(tessellator) {
  this.tessellator = tessellator;
};


/**
 * Set if the wireframe interior should be rendered on the next pass.
 *
 * @param {boolean} show true if the wireframe interior should be drawn, false otherwise.
 */
lanyard.BasicModel.prototype.setShowWireframeInterior = function(show) {
  this.showWireframeInterior = show;
};


/**
 * Set if the wireframe exterior should be rendered on the next pass.
 *
 * @param {boolean} show true if the wireframe exterior should be drawn, false otherwise.
 */
lanyard.BasicModel.prototype.setShowWireframeExterior = function(show) {
  this.showWireframeExterior = show;
};


/**
 * Find out if the wireframe interior is set to be shown.
 *
 * @return {boolean} true if the wireframe interior is to be drawn, false otherwise.
 */
lanyard.BasicModel.prototype.isShowWireframeInterior = function() {
  return this.showWireframeInterior;
};


/**
 * Find out if the wireframe exterior is set to be shown.
 *
 * @return {boolean} true if the wireframe exterior is to be drawn, false otherwise.
 */
lanyard.BasicModel.prototype.isShowWireframeExterior = function() {
  return this.showWireframeExterior;
};


/**
 * Find out if the bounding volume of the tessellation should be drawn.
 *
 * @return {boolean} true if the tessellation bounding volume should be drawn, false otherwise.
 */
lanyard.BasicModel.prototype.isShowTessellationBoundingVolumes = function() {
  return this.showTessellationBoundingVolumes;
};


/**
 * Set if the tessellation bounding volume should be displayed.
 *
 * @param {boolean} showTessellationBoundingVolumes true if it should be drawn, false otherwise.
 */
lanyard.BasicModel.prototype.setShowTessellationBoundingVolumes = function(showTessellationBoundingVolumes) {
  this.showTessellationBoundingVolumes = showTessellationBoundingVolumes;
};


/**
 * Get the extent of everything in the model.
 *
 * @return {lanyard.geom.Extent} the extent of the model contents.
 */
lanyard.BasicModel.prototype.getExtent = function() {
  // See if the layers have it.
  /** @type {Array.<lanyard.Layer>} */
  var layers = this.getLayers();

  if (layers) {
    /** @type {number} */
    var i;
    for (i = 0; i < layers.length; i = i + 1) {
      /** @type {lanyard.Layer} */
      var l = layers[i];

      if (typeof l.getExtent === 'function') {
        /** @type {?lanyard.geom.Extent} */
        var e = l.getExtent();

        if (e) {
          return e;
        }
      }
    }
  }

  // See if the Globe has it.
  /** @type {lanyard.Globe} */
  var globe = this.getGlobe();
  if (globe) {
    /** @type {?lanyard.geom.Extent} */
    var ge = globe.getExtent();
    if (ge) {
      return ge;
    }
  }

  return null;
};

/* EOF */
