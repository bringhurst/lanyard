/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.DrawContextImpl');

/**
 * A drawcontext implementation.
 *
 * @constructor
 * @implements {lanyard.DrawContext}
 * @param {canvas} the WebGL enabled canvas element.
 */
lanyard.DrawContextImpl = function (canvasElement) {

    /**
     * @private
     * @type {WebGLRenderingContext}
     */
    this._glContext = lanyard.DrawContextImpl.prototype.setupWebGLCanvas(canvasElement);
};

/**
 * Accessor for getting the WebGL context.
 *
 * @return {WebGLRenderingContext} the WebGL context.
 */
lanyard.DrawContextImpl.prototype.getGL = function () {
    return this._glContext;
};

/**
 * Setup the WebGL context.
 *
 * @param {canvas} canvasElement the WebGL enabled canvas element.
 * @return {WebGLRenderingContext} the WebGL rendering context.
 */
lanyard.DrawContextImpl.prototype.setupWebGLCanvas = function (canvasElement) {
    var glContext = canvasElement.getContext("experimental-webgl");
    glContext.viewport(0, 0, canvasElement.width, canvasElement.height);

    if (!glContext) {
        this._logger.severe("The canvas specified does not seem to support WebGL.");
    } else {
        this._logger.fine("A WebGL context was successfully obtained from the canvas.");
    }

    return glContext;
};

/* EOF */
