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

goog.provide('lanyard.FrameController');

/**
 * An interface for a frame controller
 *
 * @interface
 */
lanyard.FrameController = function () {};

/**
 * Initialize the frame.
 *
 * @param {lanyard.DrawContext} dc the context where the frame is located.
 */
lanyard.FrameController.prototype.initializeFrame = function (dc) {};

/**
 * Draw the frame.
 *
 * @param {lanyard.DrawContext} dc the context where the frame is located.
 */
lanyard.FrameController.prototype.drawFrame = function (dc) {};

/**
 * Finalize the frame.
 *
 * @param {lanyard.DrawContext} dc the context where the frame is located.
 */
lanyard.FrameController.prototype.finalizeFrame = function (dc) {};

/* EOF */
