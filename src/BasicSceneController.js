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

goog.provide('lanyard.BasicSceneController');

goog.require('lanyard.BasicDrawContext');
goog.require('lanyard.BasicFrameController');

/**
 * An implementation of a basic scene controller.
 *
 * @constructor
 * @implements {lanyard.SceneController}
 * @param {lanyard.LanyardCanvas} lanyardCanvas the lanyard canvas.
 */
lanyard.BasicSceneController = function (lanyardCanvas) {
    /**
     * @private
     */
    this._logger = goog.debug.Logger.getLogger('lanyard.BasicSceneController');

    if(!lanyardCanvas) {
        this._logger.severe("Attempted to create a scene controller without a valid lanyard canvas.");
    }
    
    /**
     * @private
     * @type {lanyard.Model}
     */
    this._model = null;

    /**
     * @private
     * @type {lanyard.View}
     */
    this._view = null;

    /**
     * @private
     * @type {lanyard.FrameController}
     */
    this._frameController = new lanyard.BasicFrameController();

    /**
     * @private
     * @type {number}
     */
    this._verticalExaggeration = 1.0;

    /**
     * @private
     * @type {lanyard.DrawContext}
     */
    this._dc = new lanyard.BasicDrawContext(lanyardCanvas);
};

/**
 * Frame controller accessor.
 *
 * @return {lanyard.FrameController} the frame controller.
 */
lanyard.BasicSceneController.prototype.getFrameController = function () {
    return this._frameController;
};

/**
 * Model accessor.
 *
 * @return {lanyard.Model} the model.
 */
lanyard.BasicSceneController.prototype.getModel = function () {
    return this._model;
};

/**
 * View accessor.
 *
 * @return {lanyard.View} the view.
 */
lanyard.BasicSceneController.prototype.getView = function () {
    return this._view;
};

/**
 * Mutator for the frame controller.
 *
 * @param {lanyard.FrameController} frameController the frame controller.
 */
lanyard.BasicSceneController.prototype.setFrameController = function (frameController) {
    this._frameController = frameController;
};

/**
 * Model mutator.
 *
 * @param {lanyard.Model} model the new model;
 */
lanyard.BasicSceneController.prototype.setModel = function (model) {
    this._model = model;
};

/**
 * View mutator.
 *
 * @param {lanyard.View} view the new view.
 */
lanyard.BasicSceneController.prototype.setView = function (view) {
    this._view = view;
};

/**
 * Mutator for setting the vertical exaggeration.
 *
 * @param {number} verticalExaggeration the new vertical exaggeration.
 */
lanyard.BasicSceneController.prototype.setVerticalExaggeration = function (verticalExaggeration) {
    this._verticalExaggeration = verticalExaggeration;
};

/**
 * Accessor for the vertical exaggeration.
 *
 * @return {number} the vertical exaggeration.
 */
lanyard.BasicSceneController.prototype.getVerticalExaggeration = function () {
    return this._verticalExaggeration;
};

/**
 * Repaint the entire scene.
 */
lanyard.BasicSceneController.prototype.repaint = function () {
    // TODO: calculate start of FPS here

    this._dc.initialize();
    this._dc.setModel(this._model);
    this._dc.setView(this._view);
    this._dc.setVerticalExaggeration(this._verticalExaggeration);
    this._dc.setupShaders();

    /** @type {lanyard.LanyardCanvas} */
    var lanyardCanvas = this._dc.getCanvas();

    if (!lanyardCanvas) {
        this._logger.fine("The scene controller has a null lanyard canvas.");
    }

    /** @type {lanyard.FrameController} */
    var fc = this.getFrameController();

    if (!fc) {
        this._logger.fine("The frame controller did not exist when the scene controller tried to use it.");
    }
    
    fc.initializeFrame(this._dc);

    this._view.apply(this._dc);

    fc.drawFrame(this._dc);
    fc.finalizeFrame(this._dc);
    this.frame = this.frame + 1;
    
    // TODO: calculate end of FPS here
};

/**
 * Frames per second accessor.
 *
 * @return {number} the frames per second.
 */
lanyard.BasicSceneController.prototype.getFramesPerSecond = function () {
    return 0;
};

/* EOF */
