/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.demo.SectorRender');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.events.Event');

goog.require('lanyard.LanyardCanvas');

/**
 * A basic test for rendering a single sector.
 *
 * @constructor
 * @this {lanyard.demo.SectorRender}
 * @param {Element} webGLCanvas The WebGL enabled canvas to draw the map to.
 * @param {Element} eventLogDiv The div where the event log is at.
 */
lanyard.demo.SectorRender = function (webGLCanvas, eventLogDiv) {

    /*
     * Keep in mind that stuff that goes on in this constructor will not
     * be logged using the standard logger. You'll need to use another method
     * or put your logic somewhere after the logger has been setup properly.
     */

    /** @private */ this._webGLCanvas = webGLCanvas;
    /** @private */ this._eventLogDiv = eventLogDiv;
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.demo.SectorRender');
};
goog.exportSymbol('lanyard.demo.SectorRender', lanyard.demo.SectorRender);

/**
 * Initializes and starts the test.
 *
 * @this {lanyard.demo.SectorRender}
 */
lanyard.demo.SectorRender.prototype.run = function () {
    this.setupEventLog();

    // TODO: render a single sector to this._webGLCanvas
};
goog.exportSymbol('lanyard.demo.SectorRender.prototype.run',
    lanyard.demo.SectorRender.prototype.run);

/**
 * Setup the event log.
 *
 * @this {lanyard.demo.SectorRender}
 */
lanyard.demo.SectorRender.prototype.setupEventLog = function () {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);

    /** @type {goog.debug.DivConsole} */
    var logconsole = new goog.debug.DivConsole(this._eventLogDiv);
    logconsole.setCapturing(true);
};
goog.exportSymbol('lanyard.demo.SectorRender.prototype.setupEventLog',
    lanyard.demo.SectorRender.prototype.setupEventLog);

/* EOF */
