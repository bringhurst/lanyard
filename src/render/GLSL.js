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

goog.provide('lanyard.render.GLSL');

goog.require('goog.debug.Logger');

/**
 * A place to keep track of GLSL based shaders.
 *
 * @constructor
 * @param {*} gl the WebGL rendering context.
 */
lanyard.render.GLSL = function (gl) {
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.render.GLSL');

    if(!gl) {
        this._logger.severe("Attempted to create a program object without a valid GL context.");
    }

    this.gl = gl;

    /** @type {string|null} */
    this.vshaderSource = null;

    /** @type {string|null} */
    this.fshaderSource = null;

    this.programObject = gl.createProgram();
};

/**
 * Compile and attach a vertex shader.
 */
lanyard.render.GLSL.prototype.updateVertexShader = function () {
    var vs = this.gl.createShader(this.gl.VERTEX_SHADER);
 
    this.gl.shaderSource(vs, this.vshaderSource);
    this.gl.compileShader(vs);
 
    this.checkCompilerOutput(vs, false);
    this.gl.attachShader(this.programObject, vs);
};

/**
 * Compile and attach a fragment shader.
 */
lanyard.render.GLSL.prototype.updateFragmentShader = function () {
    var fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.gl.shaderSource(fs, this.fshaderSource);
    this.gl.compileShader(fs);

    this.checkCompilerOutput(fs, false);
    this.gl.attachShader(this.programObject, fs);
};

/**
 * Perform the initial load of a vertex shader.
 *
 * @param {string} id the dom id of the vertex shader.
 */
lanyard.render.GLSL.prototype.loadVertexShader = function (id) {
    /** @type {Element} */
    var shaderScript = goog.dom.getElement(id);

    if (!shaderScript) {
        return null;
    } else {
        this.vshaderSource = shaderScript.innerHTML;
    }

    if (shaderScript.type !== "x-shader/x-vertex") {
        this._logger.severe("Attempted to update a vertex shader with an incorrect mime type.");
        return;
    }

    this.updateVertexShader();
};

/**
 * Perform the initial load of a fragment shader.
 *
 * @param {string} id the dom id of the fragment shader.
 */
lanyard.render.GLSL.prototype.loadFragmentShader = function (id) {
    /** @type {Element} */
    var shaderScript = goog.dom.getElement(id);

    if (!shaderScript) {
        return null;
    } else {
        this.fshaderSource = shaderScript.innerHTML;
    }

    if (shaderScript.type !== "x-shader/x-fragment") {
        this._logger.severe("Attempted to update a fragment shader with an incorrect mime type.");
        return;
    }

    this.updateFragmentShader();
};

/**
 * Get the location of an attribute variable.
 *
 * @param {string} name the name of the variable.
 * @return {number} the location of the variable.
 */ 
lanyard.render.GLSL.prototype.getAttribLocation = function (name) {
    return this.gl.getAttribLocation(this.programObject, name);
};

/**
 * Get the location of a uniform variable.
 *
 * @param {string} name the name of the variable.
 * @return {WebGLUniformLocation} the location of the variable.
 */
lanyard.render.GLSL.prototype.getUniformLocation = function (name) {
    /** @type {WebGLUniformLocation} */
    var loc = this.gl.getUniformLocation(this.programObject, name);

    if(!loc) {
        this._logger.severe("The specified uniform was not found in the shader (" + name + ").");
    }

    return loc;
};

/**
 * Get a reference to the program object.
 *
 * @return {*} a reference to the program object.
 */
lanyard.render.GLSL.prototype.getProgramObject = function () {
    return this.programObject;
};

/**
 * Setup to use the shaders in this program.
 */
lanyard.render.GLSL.prototype.useShaders = function () {
    this.gl.linkProgram(this.programObject);
    this.gl.validateProgram(this.programObject);
    this.checkCompilerOutput(this.programObject, true);
};

/**
 * Start using the shader in this program.
 */
lanyard.render.GLSL.prototype.startShader = function () {
    this.gl.useProgram(this.programObject);  
};

/**
 * End using the shader in this program.
 */
lanyard.render.GLSL.prototype.endShader = function () {
    this.gl.useProgram(null);  
};

/**
 * Check the compilation status of a shader.
 */
lanyard.render.GLSL.prototype.checkCompilerOutput = function (shader, isProgram) {
    if(isProgram) {
      if (!this.gl.getProgramParameter(shader, this.gl.LINK_STATUS)) {
          this._logger.severe("Linking of a program failed. " +
                this.gl.getProgramInfoLog(shader));
      }
    } else {
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            this._logger.severe("Compilation of a shader failed. " +
                this.gl.getShaderInfoLog(shader));
        }
    }
};

/* EOF */
