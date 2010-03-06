/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.demo.BasicDemo');

/**
 * A basic demo of Lanyard.
 *
 * @constructor
 * @this {lanyard.demo.BasicDemo}
 * @param {canvas} webGLCanvas The WebGL enabled canvas to draw the map to.
 * @param {div} layerListDiv The div where the layerList should be contained.
 * @param {div} eventLogDiv The div where the event log is at.
 */
lanyard.demo.BasicDemo = function (webGLCanvas, layerListDiv, eventLogDiv) {
    /** @private */ this._webGLCanvas = webGLCanvas;
    /** @private */ this._layerListDiv = layerListDiv;
    /** @private */ this._eventLogDiv = eventLogDiv;
};
goog.exportSymbol('lanyard.demo.BasicDemo', lanyard.demo.BasicDemo);

/* EOF */
