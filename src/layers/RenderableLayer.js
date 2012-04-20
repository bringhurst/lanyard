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

goog.provide('lanyard.layers.RenderableLayer');

goog.require('lanyard.layers.AbstractLayer');



/**
 * Creates a new RenderableLayer with the specified delegateOwner.
 *
 * @constructor
 * @extends {lanyard.layers.AbstractLayer}
 * @param {?lanyard.Layer} delegateOwner a layer that is this layer's delegate owner.
 */
lanyard.layers.RenderableLayer = function(delegateOwner) {
  lanyard.layers.AbstractLayer.call(this);

  this._logger = goog.debug.Logger.getLogger('lanyard.layers.RenderableLayer');

  //this._logger.fine("RenderableLayer constructor was called.");

  /**
   * @type {Array.<lanyard.Renderable>}
   */
  this.renderables = [];

  /**
   * @type {Array.<lanyard.Renderable>}
   */
  this.renderablesOverride = null;

  // TODO
  // this.pickSupport = new PickSupport();

  /**
   * @type {lanyard.Layer}
   */
  this.delegateOwner = delegateOwner;
};
goog.inherits(lanyard.layers.RenderableLayer, lanyard.layers.AbstractLayer);


/**
 * Adds the specified renderable to this layer's internal collection.
 *
 * @param {lanyard.Renderable} renderable the renderable to add.
 */
lanyard.layers.RenderableLayer.prototype.addRenderable = function(renderable) {
  //this._logger.fine("A renderable was added: " + renderable.toString());

  if (!renderable) {
    this._logger.severe('Renderable is null.');
  }

  if (this.renderablesOverride) {
    this._logger.severe('Layer is already using a custom iterable.');
  }

  this.renderables.push(renderable);
};


/**
 * Adds the contents of the specified renderables to this layer's internal collection.
 *
 * @param {Array.<lanyard.Renderable>} rables Renderables to add.
 */
lanyard.layers.RenderableLayer.prototype.addRenderables = function(rables) {
  //this._logger.fine("Several renderables were added.");

  if (!rables) {
    this._logger.severe('The new interable is null.');
  }

  if (this.renderablesOverride) {
    this._logger.severe('This layer is already using a custom iterable.');
  }

  for (var r in rables) {
    if (rables.hasOwnProperty(r)) {
      this.renderables.push(rables[r]);
    }
  }
};


/**
 * Clears the contents of this layer's internal Renderable collection.
 */
lanyard.layers.RenderableLayer.prototype.removeAllRenderables = function() {
  if (this.renderablesOverride) {
    this._logger.severe('This layer is using a custom iterable.');
  }

  this.renderables = [];
};


/**
 * Returns the Iterable of Renderables currently in use by this layer.
 *
 * @return {Array.<lanyard.Renderable>} currently active Renderables.
 */
lanyard.layers.RenderableLayer.prototype.getRenderables = function() {
  //this._logger.fine("getRenderables was called");

  return this.getActiveRenderables();
};


/**
 * Returns the Iterable of currently active Renderables.
 *
 * @return {Array.<lanyard.Renderable>} the currently active Renderables.
 */
lanyard.layers.RenderableLayer.prototype.getActiveRenderables = function() {
  //this._logger.fine("getActiveRenderables was called");

  if (this.renderablesOverride) {
    return this.renderablesOverride;
  } else {
    return this.renderables;
  }
};


/**
 * Overrides the collection of currently active Renderables with the specified renderableIterable.
 *
 * If the specified renderableIterable is null, this layer will revert to maintaining its internal
 * collection.
 *
 * @param {Array.<lanyard.Renderable>} renderableIterable to use instead of this layer's internal collection.
 */
lanyard.layers.RenderableLayer.prototype.setRenderables = function(renderableIterable) {
  this.renderablesOverride = renderableIterable;

  // Clear the internal collection of Renderables.
  this.renderables = [];
};


/**
 * Do the actual render of this layer.
 *
 * @param {lanyard.DrawContext} dc the currently active draw context.
 */
lanyard.layers.RenderableLayer.prototype.doRender = function(dc) {
  //this._logger.fine("Renderable layer render was called.");

  /** @type {Array.<lanyard.Renderable>} */
  var activeRenderables = this.getActiveRenderables();

  if (!activeRenderables) {
    this._logger.fine('Active renderable array is not correct.');
  }

  for (var r in activeRenderables) {
    if (activeRenderables.hasOwnProperty(r)) {
      //this._logger.fine("Calling render on a renderable: " +
      //    activeRenderables[r].toString());
      activeRenderables[r].render(dc);
    }
  }
};


/**
 * Returns this layer's delegate owner, or null if none has been specified.
 *
 * @return {lanyard.Layer} the layer that is this layer's delegate owner.
 */
lanyard.layers.RenderableLayer.prototype.getDelegateOwner = function() {
  return this.delegateOwner;
};


/**
 * Returns a short description of this layer.
 *
 * @return {string} a description of this layer.
 */
lanyard.layers.RenderableLayer.prototype.toString = function() {
  return 'A generic renderable layer.';
};

/* EOF */
