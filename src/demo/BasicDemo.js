/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.demo.BasicDemo');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Checkbox.State');

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
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.demo.BasicDemo');

    /**
     * @private
     * @type {Array.<lanyard.Layer>}
     */
    this._layerList = [];
};
goog.exportSymbol('lanyard.demo.BasicDemo', lanyard.demo.BasicDemo);

/**
 * Initializes and starts the demo.
 *
 * @this {lanyard.demo.BasicDemo}
 */
lanyard.demo.BasicDemo.prototype.run = function () {
    this.setupEventLog();
    this.setupLayerList();

    /** @type {lanyard.LanyardCanvas} */
    var lc = new lanyard.LanyardCanvas(this._webGLCanvas);

    /** @type {lanyard.Model} */
    var m = new lanyard.BasicModel();
    m.setLayers(this._layerList);
    m.setShowWireframeExterior(true);
    m.setShowWireframeInterior(false);
    m.setShowTessellationBoundingVolumes(false);
    lc.setModel(m);
};
goog.exportSymbol('lanyard.demo.BasicDemo.prototype.run',
    lanyard.demo.BasicDemo.prototype.run);

/**
 * Setup the event log.
 *
 * @this {lanyard.demo.BasicDemo}
 */
lanyard.demo.BasicDemo.prototype.setupEventLog = function () {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);

    /** @type {goog.debug.DivConsole} */
    var logconsole = new goog.debug.DivConsole(this._eventLogDiv);
    logconsole.setCapturing(true);
};
goog.exportSymbol('lanyard.demo.BasicDemo.prototype.setupEventLog',
    lanyard.demo.BasicDemo.prototype.setupEventLog);

/**
 * Setup the layer list.
 *
 * @this {lanyard.demo.BasicDemo}
 */
lanyard.demo.BasicDemo.prototype.setupLayerList = function () {
    var i;
    for(i = 0; i < this._layerList.length; i = i + 1) {
        this._logger.fine("Adding layer with name = " + this._layerList[i].toString());
        // TODO: add layer checkbox and setup listener
    }
};
goog.exportSymbol('lanyard.demo.BasicDemo.prototype.setupLayerList',
    lanyard.demo.BasicDemo.prototype.setupLayerList);

/* EOF */
