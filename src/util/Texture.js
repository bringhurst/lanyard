/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: false, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.util.Texture');

/**
 * Represent an OpenGL texture object.
 *
 * @constructor
 * @param {*} gl the current webgl context.
 */
lanyard.util.Texture = function (gl) {
    /** @type {*} */
    this.gl = gl;

    /** @type {*} */
    this.tex = gl.createTexture(); 
};

/**
 * Binds this texture to the current GL context.
 */
lanyard.util.Texture.prototype.bind = function () {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
};

/**
 * Sets the OpenGL integer texture parameter for the texture's target.
 *
 * @param {number} parameterName the parameter name.
 * @param {number} value the value to set the parameter to.
 */
lanyard.util.Texture.prototype.setTexParameteri = function (parameterName, value) {
    this.gl.texParameteri(this.gl.TEXTURE_2D, parameterName, value); 
};

/* EOF */
