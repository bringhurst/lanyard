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

/* EOF */
