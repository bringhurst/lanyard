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

goog.provide('lanyard.SceneController');

goog.require('lanyard.FrameController');
goog.require('lanyard.Model');
goog.require('lanyard.View');



/**
 * An interface for scene controllers.
 *
 * @interface
 */
lanyard.SceneController = function() {};


/**
 * Accessor for the model.
 *
 * @return {lanyard.Model} the model.
 */
lanyard.SceneController.prototype.getModel = function() {};


/**
 * Mutator for the model.
 *
 * @param {lanyard.Model} model the model.
 */
lanyard.SceneController.prototype.setModel = function(model) {};


/**
 * Accessor for the view.
 *
 * @return {lanyard.View} the view.
 */
lanyard.SceneController.prototype.getView = function() {};


/**
 * Mutator for the view.
 *
 * @param {lanyard.View} view the view.
 */
lanyard.SceneController.prototype.setView = function(view) {};


/**
 * Accessor for the frame controller.
 *
 * @return {lanyard.FrameController} the frame controller.
 */
lanyard.SceneController.prototype.getFrameController = function() {};


/**
 * Mutator for the frame controller.
 *
 * @param {lanyard.FrameController} frameController the new frame controller.
 */
lanyard.SceneController.prototype.setFrameController = function(frameController) {};


/**
 * Repaint the scene.
 */
lanyard.SceneController.prototype.repaint = function() {};


/**
 * Set the vertical exaggeration.
 *
 * @param {number} verticalExaggeration the vertical exaggeration.
 */
lanyard.SceneController.prototype.setVerticalExaggeration = function(verticalExaggeration) {};


/**
 * Accessor to the vertical exaggeration.
 *
 * @return {number} the vertical exaggeration.
 */
lanyard.SceneController.prototype.getVerticalExaggeration = function() {};


/**
 * Get the current frames per second.
 *
 * @return {number} the current frames per second.
 */
lanyard.SceneController.prototype.getFramesPerSecond = function() {};

/* EOF */
