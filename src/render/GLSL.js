/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.render.GLSL');

goog.require('goog.debug.Logger');

/**
 * A place to keep track of GLSL based shaders.
 *
 * @constructor
 * @param {WebGLRenderingContext} gl the WebGL rendering context.
 */
lanyard.render.GLSL = function (gl) {
    /** @type {WebGLRenderingContext} */
    this.gl = gl;

    /** @type {string} */
    this.vshaderSource = null;

    /** @type {string} */
    this.fshaderSource = null;

    /** @type {WebGLProgram} */
    this.programObject = gl.createProgram();

    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.render.GLSL');
};

/**
 * Compile and attach a vertex shader.
 *
 * @param {string} vshaderSource the contents of the vertex shader.
 */
lanyard.render.GLSL.prototype.updateVertexShader = function () {
    /** @type {WebGLShader} */
    var vs = this.gl.createShader(this.gl.VERTEX_SHADER);
 
    this.gl.shaderSource(vs, this.vshaderSource);
    this.gl.compileShader(vs);
 
    this.checkCompilerOutput(vs, false);
    this.gl.attachShader(this.programObject, vs);
};

/**
 * Compile and attach a fragment shader.
 *
 * @param {string} fshaderSource the contents of the fragment shader.
 */
lanyard.render.GLSL.prototype.updateFragmentShader = function () {
    /** @type {WebGLShader} */
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
 * @return {number} the location of the variable.
 */
lanyard.render.GLSL.prototype.getUniformLocation = function (name) {
    /** @type {WebGLUniformLocation} */
    var loc = this.gl.getUniformLocation(this.programObject, name);

    if(!loc) {
        this._logger.severe("The specified uniform was not found in the shader.");
    }

    return loc;
};

/**
 * Get a reference to the program object.
 *
 * @return {WebGLProgram} a reference to the program object.
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
    this.gl.useProgram(0);  
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
