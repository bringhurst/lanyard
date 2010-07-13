/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.BasicSceneController');

goog.require('lanyard.BasicDrawContext');
goog.require('lanyard.BasicFrameController');

/**
 * An implementation of a basic scene controller.
 *
 * @constructor
 * @implements {lanyard.SceneController}
 * @param {Element} canvasElement the WebGL enabled canvas element.
 */
lanyard.BasicSceneController = function (canvasElement) {
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
    this._dc = new lanyard.BasicDrawContext(canvasElement);

    /**
     * @private
     */
    this._logger = goog.debug.Logger.getLogger('lanyard.BasicSceneController');
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
    this._logger.fine("Repainting the scene.");

    // TODO: calculate start of FPS here

    this._dc.initialize();
    this._dc.setModel(this._model);
    this._dc.setView(this._view);
    this._dc.setVerticalExaggeration(this._verticalExaggeration);
    this._dc.setupShaders();

    if (!this._dc.getWebGLCanvas()) {
        this._logger.fine("The scene controller has a null gl canvas context.");
    }

    /** @type {lanyard.FrameController} */
    var fc = this.getFrameController();

    if (!fc) {
        this._logger.fine("The frame controller did not exist when the scene controller tried to use it.");
    }
    
    fc.initializeFrame(this._dc);

    this._view.apply(this._dc);

    this.createTerrain();

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

/**
 * Create the basic terrain.
 */
lanyard.BasicSceneController.prototype.createTerrain = function () {
    this._logger.fine("Creating the terrain.");

    /** @type {lanyard.SectorGeometryList} */
    var sgl = this._model.getGlobe().tessellate(this._dc);

    this._dc.setSurfaceGeometry(sgl);
    //this._dc.setVisibleSector(sgl.getSector());
};

/* EOF */
