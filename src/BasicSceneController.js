/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.BasicSceneController');

/**
 * An implementation of a basic scene controller.
 *
 * @constructor
 * @implements {lanyard.SceneController}
 * @param {canvas} canvasElement the WebGL enabled canvas element.
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
    this._dc = new lanyard.DrawContextImpl(canvasElement);

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
 * @param {lanyard.FraneController} frameController the frame controller.
 */
lanyard.BasicSceneController.prototype.setFrameController = function (frameController) {
    this._frameController = frameController;
};

/**
 * Model mutator.
 *
 * @param {lanyard.Model} the new model;
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

    this._dc.initialize(/* FIXME: pass in GLContext.getCurrent() */);
    this._dc.setModel(this._model);
    this._dc.setView(this._view);
    this._dc.setVerticalExaggeration(this._verticalExaggeration);

    if (!this._dc.getGLContext()) {
        this._logger.fine("BasicSceneController.GLContextNullStartRedisplay");
    }

    /** @type {lanyard.FrameController} */
    var fc = this.getFrameController();

    if (!fc) {
        this._logger.fine("BasicSceneController.NoFrameControllerStartRepaint");
    }

    try {
        fc.initializeFrame(this.dc);
        fc.drawFrame(this.dc);
    } catch (e) {
        this._logger.fine("BasicSceneController.ExceptionDuringRendering");
    } finally {
        fc.finalizeFrame(this.dc);
        this.frame = this.frame + 1;

        // TODO: calculate end of FPS here
    }
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
