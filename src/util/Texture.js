/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: false, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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

goog.provide('lanyard.util.Texture');



/**
 * Represent an OpenGL texture object.
 *
 * @constructor
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.util.Texture = function(dc) {
  /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.util.Texture');

  if (!dc) {
    this._logger.severe('Creation of a texture was attempted without a valid draw context.');
  }

  /** @type {lanyard.DrawContext} */
  this.dc = dc;

  this.gl = dc.getGL();

  if (!this.gl) {
    this._logger.severe('Creation of a texture was attempted without a valid gl context.');
  }

  this.tex = this.gl.createTexture();
};


/**
 * Binds this texture to the current GL context.
 */
lanyard.util.Texture.prototype.bind = function() {
  //this._logger.fine("Binding a texture.");
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
};


/**
 * Updates the entire content area of this texture using the data in the given canvas.
 *
 * @param {Element} textureCanvas the canvas that holds the texture.
 */
lanyard.util.Texture.prototype.updateCanvas = function(textureCanvas) {
  //this._logger.fine("Updating the canvas.");

  var ctx = textureCanvas.getContext('2d');
  var img = new Image();

  var self = this;
  img.onload = function() {
    ctx.drawImage(img, 0, 0);

    var gl = self.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    self.createMipmap();

    // Fire off a rendering event.
    self._logger.fine('Render event is being fired off.');
    self.dc.getCanvas().display();
  };
};


/**
 * Sets this texture to the image.
 *
 * @param {Image} image the image to use for this texture.
 */
lanyard.util.Texture.prototype.setImage = function(image) {
  //this._logger.fine("Setting an image.");
  this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
};


/**
 * Generate a mipmap for this texture.
 */
lanyard.util.Texture.prototype.createMipmap = function() {
  this.gl.generateMipmap(this.gl.TEXTURE_2D);
};


/**
 * Sets the OpenGL integer texture parameter for the texture's target.
 *
 * @param {number} parameterName the parameter name.
 * @param {number} value the value to set the parameter to.
 */
lanyard.util.Texture.prototype.setTexParameteri = function(parameterName, value) {
  this.gl.texParameteri(this.gl.TEXTURE_2D, parameterName, value);
};

/* EOF */
