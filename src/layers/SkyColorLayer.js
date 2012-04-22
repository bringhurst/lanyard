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

goog.provide('lanyard.layers.SkyColorLayer');

goog.require('lanyard.layers.RenderableLayer');

/**
 * Paints the sky color background depending on altitude.
 *
 * @constructor
 * @extends {lanyard.layers.RenderableLayer}
 * @this {lanyard.layers.SkyColorLayer}
 */
lanyard.layers.SkyColorLayer = function () {
    /** @type {lanyard.util.Color} */
    this.color = new lanyard.util.Color(73, 131, 204); // Sky blue

    /** @type {number} */
    this.fadeBottomAltitude = 50e3;

    /** @type {number} */
    this.fadeTopAltitude = 140e3;

    this.setName("Sky Color");
};

/**
 * Get the sky Color.
 *
 * @return {lanyard.util.Color} the sky color.
 */
lanyard.layers.SkyColorLayer.prototype.getSkyColor = function () {
    return this.color;
};

/**
 * Set the sky Color.
 *
 * @param {lanyard.util.Color} color the sky color.
 */
lanyard.layers.SkyColorLayer.prototype.setSkyColor = function (color) {
    if (!color) {
        this._logger.severe("Attempted to set the sky color to a null value.");
    }

    this.color = color;
};

/**
 * Get the bottom altitude for the fade effect (meters).
 *
 * @return {number} the bottom altitude in meters.
 */
lanyard.layers.SkyColorLayer.prototype.getFadeBottomAltitude = function () {
    return this.fadeBottomAltitude;
};

/**
 * Set the bottom altitude for the fade effect (meters).
 *
 * @param {number} alt the bottom altitude in meters.
 */
lanyard.layers.SkyColorLayer.prototype.setFadeBottomAltitude = function (alt) {
    this.fadeBottomAltitude = alt;
};

/**
 * Get the top altitude for the fade effect (meters).
 *
 * @return {number} the top altitude in meters.
 */
lanyard.layers.SkyColorLayer.prototype.getFadeTopAltitude = function () {
    return this.fadeTopAltitude;
};

/**
 * Set the top altitude for the fade effect (meters).
 *
 * @param {number} alt the top altitude in meters.
 */
lanyard.layers.SkyColorLayer.prototype.setFadeTopAltitude = function (alt) {
    this.fadeTopAltitude = alt;
};

/**
 * Render the sky color into the specified draw context.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.layers.SkyColorLayer.prototype.doRender = function (dc) {
    /** @type {lanyard.geom.Position} */
    var eyePos = dc.getView().getEyePosition();

    if (!eyePos) {
        return;
    }

    /** @type {number} */
    var alt = eyePos.getElevation();

    if(alt > this.fadeTopAltitude) {
        return;
    }

    /**
     * Compute the fade factor.
     *
     * @type {number}
     */
    var fadeFactor = (alt < this.fadeBottomAltitude) ? 1.0 :
        ((this.fadeTopAltitude - alt) / (this.fadeTopAltitude - this.fadeBottomAltitude));

    /** @type {WebGLRenderingContext} */
    var gl = dc.getGL();

    /** @type {boolean} */
    var attribsPushed = false;

    /** @type {boolean} */
    var modelviewPushed = false;

    /** @type {boolean} */
    var projectionPushed = false;

    // GL setup
    gl.glPushAttrib(GL.GL_DEPTH_BUFFER_BIT
        | GL.GL_COLOR_BUFFER_BIT
        | GL.GL_ENABLE_BIT
        | GL.GL_TEXTURE_BIT
        | GL.GL_TRANSFORM_BIT
        | GL.GL_VIEWPORT_BIT
        | GL.GL_CURRENT_BIT);
    attribsPushed = true;

    gl.glEnable(GL.GL_BLEND);
    gl.glBlendFunc(GL.GL_SRC_ALPHA, GL.GL_ONE_MINUS_SRC_ALPHA);
    gl.glDisable(GL.GL_DEPTH_TEST);

    // Load a parallel projection with xy dimensions (viewportWidth, viewportHeight)
    // into the GL projection matrix.
    Rectangle viewport = dc.getView().getViewport();
    gl.glMatrixMode(GL.GL_PROJECTION);
    gl.glPushMatrix();
    projectionPushed = true;
    gl.glLoadIdentity();
    gl.glOrtho(0d, viewport.width, 0d, viewport.height, -1, 1);

    gl.glMatrixMode(GL.GL_MODELVIEW);
    gl.glPushMatrix();
    modelviewPushed = true;
    gl.glLoadIdentity();
    gl.glScaled(viewport.width, viewport.height, 1d);

    // Set the color.
    gl.glColor4d(this.color.getRed() / 255.0 * fadeFactor,
        this.color.getGreen() / 255.0 * fadeFactor,
        this.color.getBlue() / 255.0 * fadeFactor,
        this.color.getAlpha() / 255.0 * fadeFactor);

    // Draw
    gl.glDisable(GL.GL_TEXTURE_2D);		// no textures
    dc.drawUnitQuad();

    if (projectionPushed) {
        gl.glMatrixMode(GL.GL_PROJECTION);
        gl.glPopMatrix();
    }

    if (modelviewPushed) {
        gl.glMatrixMode(GL.GL_MODELVIEW);
        gl.glPopMatrix();
    }

    if (attribsPushed) {
        gl.glPopAttrib();
    }
};

/**
 * Get the string representation of this layer.
 *
 * @return {string} the string representation of this layer.
 */
lanyard.layers.SkyColorLayer.prototype.toString = function () {
    return this.getName();
};

/* EOF */
