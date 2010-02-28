/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.SceneController');

goog.require('lanyard.Model');
goog.require('lanyard.View');
goog.require('lanyard.FrameController');
goog.require('lanyard.pick.PickedObjectList');

/**
 * An interface for scene controllers.
 *
 * @interface
 */
lanyard.SceneController = function () {};

/**
 * Accessor for the model.
 *
 * @return {lanyard.Model} the model.
 */
lanyard.SceneController.prototype.getModel = function () {};

/**
 * Mutator for the model.
 *
 * @param {lanyard.Model} model the model.
 */
lanyard.SceneController.prototype.setModel = function (model) {};

/**
 * Accessor for the view.
 *
 * @return {lanyard.View} the view.
 */
lanyard.SceneController.prototype.getView = function () {};

/**
 * Mutator for the view.
 *
 * @param {lanyard.View} view the view.
 */
lanyard.SceneController.prototype.setView = function (view) {};

/**
 * Accessor for the frame controller.
 *
 * @return {lanyard.FrameController} the frame controller.
 */
lanyard.SceneController.prototype.getFrameController = function () {};

/**
 * Mutator for the frame controller.
 *
 * @param {lanyard.FrameController} frameController the new frame controller.
 */
lanyard.SceneController.prototype.setFrameController = function (frameController) {};

/**
 * Repaint the scene.
 */
lanyard.SceneController.prototype.repaint = function ();

/**
 * Set the vertical exaggeration.
 *
 * @param {Number} verticalExaggeration the vertical exaggeration.
 */
lanyard.SceneController.prototype.setVerticalExaggeration = function (verticalExaggeration) {};

/**
 * Accessor to the vertical exaggeration.
 *
 * @return {Number} the vertical exaggeration.
 */
lanyard.SceneController.prototype.getVerticalExaggeration = function () {};

/**
 * Access to the pick list.
 *
 * @return {lanyard.pick.PickedObjectList} the pick list.
 */
lanyard.SceneController.prototype.getPickedObjectList = function () {};

/**
 * Do picking based on the point.
 *
 * @param {lanyard.geom.ScreenPoint} pickPoint the point on the canvas.
 * @return {lanyard.pick.PickedObjectList} the list of picked objects
 */
lanyard.SceneController.prototype.pick = function (pickPoint) {};

/**
 * Get the current frames per second.
 *
 * @return {Number} the current frames per second.
 */
lanyard.SceneController.prototype.getFramesPerSecond = function () {};

/**
 * Get the current frame time.
 *
 * @return {Number} the current frame time.
 */
lanyard.SceneController.prototype.getFrameTime = function () {};

/* EOF */
