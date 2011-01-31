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

goog.provide('lanyard.util.TextRenderer');

/**
 * Renders text into a WebGL canvas.
 *
 * @constructor
 * @param {string} fontStyle the css font style of the text to render.
 * @param {lanyard.DrawContext} dc the draw context to use.
 */
lanyard.util.TextRenderer = function(fontStyle, dc) {
    /** @type {lanyard.DrawContext} */
    this.dc = dc;

    /** @type {string} */
    this.fontStyle = fontStyle;
};

/**
 * Sets up the state matrices.
 */
lanyard.util.TextRenderer.prototype.beginRendering = function() {
};

/**
 * Draws the text to the current draw context at the specified position.
 * A new hidden canvas and a texture is created and cached for each text
 * string specified during the lifetime of this text renderer.
 *
 * @param {string} value the text to be rendered.
 * @param {number} xPosition the x position of the text to be rendered.
 * @param {number} yPosition the y position of the text to be rendered.
 */
lanyard.util.TextRenderer.prototype.draw =
        function(value, xPosition, yPosition) {
};

/**
 * Set the color of text to be rendered.
 *
 * @param {lanyard.util.Color} color the color of the text.
 */
lanyard.util.TextRenderer.prototype.setColor = function (color) {

};

/**
 * Restore the state matrices.
 */
lanyard.util.TextRenderer.prototype.endRendering = function() {
};

/**
 * Destroy all hidden canvas elements that are cached in this renderer.
 */
lanyard.util.TextRenderer.prototype.dispose = function() {
};

/* EOF */
