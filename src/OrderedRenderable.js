/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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

goog.provide('lanyard.OrderedRenderable');



/**
 * An interface for an ordered renderable.
 *
 * @interface
 */
lanyard.OrderedRenderable = function() {};


/**
 * Causes this OrderedRenderable to render itself using the DrawContext provided. The
 * DrawContext provides the elevation model, openGl instance, globe and other
 * information required for drawing.
 *
 * @param {lanyard.DrawContext} dc the DrawContext to be used.
 */
lanyard.OrderedRenderable.prototype.render = function(dc) {};


/**
 * Get this distance from this renderable to the eye.
 *
 * @return {number} the distance from the eye.
 */
lanyard.OrderedRenderable.prototype.getDistanceFromEye = function() {};

/* EOF */
