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

goog.provide('lanyard.LanyardCanvas');

goog.require('goog.debug.Logger');
goog.require('lanyard.BasicSceneController');
goog.require('lanyard.SceneController');



/**
 * Provides a wrapper for the WebGL canvas.
 *
 * @constructor
 * @param {HTMLCanvasElement} canvasElement the WebGL enabled canvas to draw to.
 */
lanyard.LanyardCanvas = function(canvasElement) {
  /**
     * @private
     * @type {lanyard.SceneController}
     */
  this._sceneController = null;

  /**
     * @private
     * @type {HTMLCanvasElement}
     */
  this._canvasElement = canvasElement;

  /**
     * @private
     * @type {lanyard.dom.InputHandler}
     */
  this._inputHandler = null;

  /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.LanyardCanvas');
};


/**
 * Model mutator.
 *
 * @param {lanyard.Model} model the new model.
 */
lanyard.LanyardCanvas.prototype.setModel = function(model) {
  if (!this._sceneController) {
    this._sceneController = new lanyard.BasicSceneController(this);
  }

  if (this._sceneController) {
    this._sceneController.setModel(model);
  } else {
    this._logger.severe('Attempted to set a model without a valid scene controller.');
  }
};


/**
 * Model accessor.
 *
 * @return {lanyard.Model} the model used.
 */
lanyard.LanyardCanvas.prototype.getModel = function() {
  /** @type {?lanyard.Model} */
  var ret = this._sceneController ? this._sceneController.getModel() : null;

  return ret;
};


/**
 * View mutator.
 *
 * @param {lanyard.View} view the new view.
 */
lanyard.LanyardCanvas.prototype.setView = function(view) {
  if (!this._canvasElement) {
    this._logger.severe('Attempted to set the view without a valid canvas element.');
  }

  if (!view) {
    this._logger.severe('Attempted to set an invalid view.');
  }

  if (!this._sceneController) {
    this._sceneController = new lanyard.BasicSceneController(this);
  }

  view.setViewportFromCanvas(this._canvasElement);

  // view can be null, that's ok - it indicates no view.
  if (this._sceneController) {
    this._sceneController.setView(view);
  } else {
    this._logger.severe('Tried to set a view without a scene controller existing.');
  }
};


/**
 * View accessor.
 *
 * @return {lanyard.View} the view object used.
 */
lanyard.LanyardCanvas.prototype.getView = function() {
  if (!this._sceneController) {
    this._sceneController = new lanyard.BasicSceneController(this);
  }

  if (!this._sceneController) {
    this._logger.severe('Attempted to get the view from an invalid scene controller.');
  }

  return this._sceneController.getView();
};


/**
 * Model and view mutator.
 *
 * @param {lanyard.Model} model the new model to use.
 * @param {lanyard.View} view the new view to use.
 */
lanyard.LanyardCanvas.prototype.setModelAndView = function(model, view) {
  if (!this._sceneController) {
    this._sceneController = new lanyard.BasicSceneController(this);
  }

  this.setModel(model);
  this.setView(view);
};


/**
 * Scene controller accessor.
 *
 * @return {lanyard.SceneController} the scene controller used.
 */
lanyard.LanyardCanvas.prototype.getSceneController = function() {
  return this._sceneController;
};


/**
 * Canvas element accessor.
 *
 * @return {HTMLCanvasElement} the canvas element.
 */
lanyard.LanyardCanvas.prototype.getWebGLCanvas = function() {
  return this._canvasElement;
};


/**
 * Display or update the map.
 */
lanyard.LanyardCanvas.prototype.display = function() {

  //this._logger.fine("display was called.");

  /** @type {lanyard.SceneController} */
  var sc = this.getSceneController();

  if (!sc) {
    this._logger.fine('The scene controller was null when a repaint was attempted.');
  }

  sc.repaint();
};


/**
 * Create a default input handler.
 */
lanyard.LanyardCanvas.prototype.createDefaultInputHandler = function() {
  this.inputHandler = new lanyard.dom.InputHandler();
  this.inputHandler.setEventSource(this);
};


/**
 * Get the input handler used by this canvas.
 *
 * @return {lanyard.dom.InputHandler}
 */
lanyard.LanyardCanvas.prototype.getInputHandler = function() {
  return this.inputHandler;
};


/**
 * Set the input handler on this canvas.
 *
 * @param {lanyard.dom.InputHandler} eventSource the new input handler to use for this canvas.
 */
lanyard.LanyardCanvas.prototype.setInputHandler = function(eventSource) {
  if (this.inputHandler !== null) {
    this.inputHandler.setEventSource(null); // remove this canvas as a source of events
  }

  this.inputHandler = eventSource;

  if (this.inputHandler !== null) {
    this.inputHandler.setEventSource(this);
  }
};

/* EOF */
