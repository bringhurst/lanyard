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

goog.provide('lanyard.demo.BasicDemo2');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.events.Event');

goog.require('lanyard.dom.InputHandler');

/**
 * A basic test for handling user input.
 *
 * @constructor
 * @this {lanyard.demo.BasicDemo2}
 * @param {Element} webGLCanvas The WebGL enabled canvas to draw the map to.
 * @param {Element} eventLogDiv The div where the event log is at.
 */
lanyard.demo.BasicDemo2 = function (webGLCanvas, eventLogDiv) {

    /*
     * Keep in mind that stuff that goes on in this constructor will not
     * be logged using the standard logger. You'll need to use another method
     * or put your logic somewhere after the logger has been setup properly.
     */

    /** @private */ this._webGLCanvas = webGLCanvas;
    /** @private */ this._eventLogDiv = eventLogDiv;
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.demo.BasicDemo2');
};
goog.exportSymbol('lanyard.demo.BasicDemo2', lanyard.demo.BasicDemo2);

/**
 * Initializes and starts the test.
 *
 * @this {lanyard.demo.BasicDemo2}
 */
lanyard.demo.BasicDemo2.prototype.run = function () {
    this.setupEventLog();

    // Setup a model (the earth)
    var model = new lanyard.BasicModel();

    // Setup a view
    var view = new lanyard.BasicOrbitView();
    view.setViewportFromCanvas(this._webGLCanvas);

    // Setup a draw context
    var dc = new lanyard.BasicDrawContext(this._webGLCanvas);
    dc.setModel(model);
    dc.setView(view);

    // Setup the input handlers
    var lc = new lanyard.LanyardCanvas(this._webGLCanvas);
    lc.setModel(model);
    lc.setView(view);
    lc.createDefaultInputHandler();

    // Setup the shaders
    dc.loadShaders("shader-vs", "shader-fs");
    dc.setupShaders();

    // Setup the canvas
    dc.getGL().clearColor(0.0, 0.0, 0.0, 1.0);
    dc.getGL().clearDepth(1.0);
    dc.getGL().enable(dc.getGL().DEPTH_TEST);
    dc.getGL().enable(dc.getGL().CULL_FACE);
    dc.getGL().depthFunc(dc.getGL().LEQUAL);

    // Make sure we have valid state matrices for the initial tessellation
    view.doApply(dc);

    /** @type {lanyard.SectorGeometryList} */
    var sgl = dc.getModel().getTessellator().tessellate(dc);

    var self = this;
    setInterval(function() {
        // Begin drawing the scene
        dc.getGL().viewport(0, 0, 500, 500);
        dc.getGL().clear(dc.getGL().COLOR_BUFFER_BIT | dc.getGL().DEPTH_BUFFER_BIT);

        // Apply the current view
        view.doApply(dc);

        for(var i = 0; i < sgl.length(); i = i + 1) {
            // Render each tile
            sgl.at(i).renderWireframe(dc, true /* showTriangles */, false /* showTileBoundary */);
        }
    }, 15); // end setInterval
};
goog.exportSymbol('lanyard.demo.BasicDemo2.prototype.run',
    lanyard.demo.BasicDemo2.prototype.run);

/**
 * Setup the event log.
 *
 * @this {lanyard.demo.BasicDemo2}
 */
lanyard.demo.BasicDemo2.prototype.setupEventLog = function () {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);

    /** @type {goog.debug.DivConsole} */
    var logconsole = new goog.debug.DivConsole(this._eventLogDiv);
    logconsole.setCapturing(true);
};
goog.exportSymbol('lanyard.demo.BasicDemo2.prototype.setupEventLog',
    lanyard.demo.BasicDemo2.prototype.setupEventLog);

/* EOF */
