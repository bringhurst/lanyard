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

goog.provide('lanyard.demo.BasicDemo');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.ErrorHandler');

goog.require('lanyard.BasicModel');
goog.require('lanyard.BasicOrbitView');
goog.require('lanyard.Layer');
goog.require('lanyard.demo.StatusBar');
goog.require('lanyard.dom.InputHandler');
goog.require('lanyard.layers.earth.BMNGOneImage');

/**
 * A basic demo of Lanyard.
 *
 * @constructor
 * @this {lanyard.demo.BasicDemo}
 * @param {HTMLCanvasElement} webGLCanvas The WebGL enabled canvas to draw the map to.
 * @param {HTMLDivElement} layerListDiv The div where the layerList should be contained.
 * @param {HTMLDivElement} eventLogDiv The div where the event log is at.
 */
lanyard.demo.BasicDemo = function(webGLCanvas, layerListDiv, eventLogDiv) {

    /*
     * Keep in mind that stuff that goes on in this constructor will not
     * be logged using the standard logger. You'll need to use another method
     * or put your logic somewhere after the logger has been setup properly.
     */

    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this._webGLCanvas = webGLCanvas;

    /** @private */ this._layerListDiv = layerListDiv;
    /** @private */ this._eventLogDiv = eventLogDiv;
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.demo.BasicDemo');

    /** @private */ this.lanyardCanvas = null;

    /**
     * @private
     * @type {Array.<lanyard.Layer>}
     */
    this._layerList = [];
};
goog.exportSymbol('lanyard.demo.BasicDemo', lanyard.demo.BasicDemo);

/**
 * Initializes and starts the test.
 *
 * @this {lanyard.demo.BasicDemo}
 */
lanyard.demo.BasicDemo.prototype.run = function() {
    // Setup the logging and layer divs for this demo.
    this.setupEventLog();
    this.setupLayerList();

    if (!this._webGLCanvas) {
        this._logger.severe('A valid canvas element was not found.');
    }

    // Setup the model with the layers used in the demo.
    var model = new lanyard.BasicModel();
    model.setLayers(this._layerList);

    // Setup the canvas.
    this.lanyardCanvas = new lanyard.LanyardCanvas(this._webGLCanvas);
    this.lanyardCanvas.setModel(model);
    this.lanyardCanvas.setView(new lanyard.BasicOrbitView());
    this.lanyardCanvas.createDefaultInputHandler();

    /** @type {lanyard.demo.BasicDemo} */
    var self = this;

    // Start it up.
    (function loop(){
        setTimeout(function(){
            self.lanyardCanvas.display();
            loop();
        }, 15);
    })();

    //this.lanyardCanvas.display();
};
goog.exportSymbol('lanyard.demo.BasicDemo.prototype.run',
    lanyard.demo.BasicDemo.prototype.run);

/**
 * Setup the event log.
 *
 * @this {lanyard.demo.BasicDemo}
 */
lanyard.demo.BasicDemo.prototype.setupEventLog = function() {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);

    /** @type {goog.debug.DivConsole} */
    var logconsole = new goog.debug.DivConsole(this._eventLogDiv);
    logconsole.setCapturing(true);
};
goog.exportSymbol('lanyard.demo.BasicDemo.prototype.setupEventLog',
    lanyard.demo.BasicDemo.prototype.setupEventLog);

/**
 * Add a status bar.
 *
 * @param {lanyard.demo.StatusBar} statusBar the bar to add.
 * @this {lanyard.demo.BasicDemo}
 */
lanyard.demo.BasicDemo.prototype.addStatusBar = function(statusBar) {
    if (!this.lanyardCanvas) {
        this._logger.severe('A LanyardCanvas must exist before a status bar is added.');
    }

    if (!statusBar) {
        this._logger.severe('Attempted to attach an invalid status bar.');
    }

    // A reference to statusBar is kept in InputHandler's eventListeners.
    statusBar.setEventSource(this.lanyardCanvas);
};
goog.exportSymbol('lanyard.demo.BasicDemo.prototype.addStatusBar',
    lanyard.demo.BasicDemo.prototype.addStatusBar);

/**
 * Setup the layer list.
 *
 * @this {lanyard.demo.BasicDemo}
 */
lanyard.demo.BasicDemo.prototype.setupLayerList = function() {
    // Add a basic blue marble layer
    this._layerList.push(new lanyard.layers.earth.BMNGOneImage());

    var i;
    for (i = 0; i < this._layerList.length; i = i + 1) {
        this._logger.fine('Adding layer with name = ' + this._layerList[i].toString());

        var layerLabel = goog.dom.createDom('p', {'style': 'background-color:#EEE'},
            this._layerList[i].getName());
        goog.dom.appendChild(this._layerListDiv, layerLabel);

        //var layerCheckbox = new goog.ui.Checkbox();
        //layerCheckbox.setLabel(layerLabel);

        // TODO: add layer checkbox and setup listener
    }
};
goog.exportSymbol('lanyard.demo.BasicDemo.prototype.setupLayerList',
    lanyard.demo.BasicDemo.prototype.setupLayerList);

/* EOF */
