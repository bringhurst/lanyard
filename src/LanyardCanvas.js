/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.LanyardCanvas');

goog.require('goog.debug.Logger');
goog.require('lanyard.BasicSceneController');
goog.require('lanyard.SceneController');

/**
 * Provides a wrapper for the WebGL canvas.
 *
 * @constructor
 * @param {Element} canvasElement the WebGL enabled canvas to draw to.
 */
lanyard.LanyardCanvas = function (canvasElement) {
    /**
     * @private
     * @type {lanyard.SceneController}
     */
    this._sceneController = new lanyard.BasicSceneController(canvasElement);

    /**
     * @private
     * @type {Element}
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
lanyard.LanyardCanvas.prototype.setModel = function (model) {
    if (this._sceneController) {
        this._sceneController.setModel(model);
    } else {
        this._logger.severe("Attempted to set a model without a valid scene controller.");
    }
};

/**
 * Model accessor.
 *
 * @return {lanyard.Model} the model used.
 */
lanyard.LanyardCanvas.prototype.getModel = function () {
    /** @type {lanyard.Model|null} */
    var ret = this._sceneController ? this._sceneController.getModel() : null;

    return ret;
};

/**
 * View mutator.
 *
 * @param {lanyard.View} view the new view.
 */
lanyard.LanyardCanvas.prototype.setView = function (view) {
    // view can be null, that's ok - it indicates no view.
    if (this._sceneController) {
        this._sceneController.setView(view);
    } else {
      this._logger.severe("Tried to set a view without a scene controller existing.");
    }
};

/**
 * View accessor.
 *
 * @return {lanyard.View} the view object used.
 */
lanyard.LanyardCanvas.prototype.getView = function () {
    /** @type {lanyard.View|null} */
    var ret = this._sceneController ? this._sceneController.getView() : null;

    return ret;
};

/**
 * Model and view mutator.
 *
 * @param {lanyard.Model} model the new model to use.
 * @param {lanyard.View} view the new view to use.
 */
lanyard.LanyardCanvas.prototype.setModelAndView = function (model, view) {
    this.setModel(model);
    this.setView(view);
};

/**
 * Scene controller accessor.
 *
 * @return {lanyard.SceneController} the scene controller used.
 */
lanyard.LanyardCanvas.prototype.getSceneController = function () {
    return this._sceneController;
};

/**
 * Canvas element accessor.
 *
 * @return {Element} the canvas element.
 */
lanyard.LanyardCanvas.prototype.getCanvas = function () {
    return this._canvasElement;
};

/**
 * Display or update the map.
 */
lanyard.LanyardCanvas.prototype.display = function () {

    /** @type {lanyard.SceneController} */
    var sc = this.getSceneController();

    if (!sc) {
        this._logger.fine("The scene controller was null when a repaint was attempted.");
    }

    sc.repaint();
};

/**
 * Create a default input handler.
 *
 * @private
 */
lanyard.LanyardCanvas.prototype.createDefaultInputHandler = function () {
    this.inputHandler = new lanyard.dom.InputHandler();
    this.inputHandler.setEventSource(this);
};

/**
 * Get the input handler used by this canvas.
 *
 * @return {lanyard.dom.InputHandler}
 */
lanyard.LanyardCanvas.prototype.getInputHandler = function () {
    return this.inputHandler;
};

/**
 * Set the input handler on this canvas.
 *
 * @param {lanayrd.dom.InputHandler} eventSource the new input handler to use for this canvas.
 */
lanyard.LanyardCanvas.prototype.setInputHandler = function (eventSource) {
    if (this.inputHandler !== null) {
        this.inputHandler.setEventSource(null); // remove this canvas as a source of events
    }

    this.inputHandler = eventSource;

    if (this.inputHandler !== null) {
        this.inputHandler.setEventSource(this);
    }
};

/* EOF */
