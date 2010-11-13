/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.demo.TopLevelTilesRender');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.events.Event');

/**
 * A basic test for rendering the top level tiles.
 *
 * @constructor
 * @this {lanyard.demo.TopLevelTilesRender}
 * @param {Element} webGLCanvas The WebGL enabled canvas to draw the map to.
 * @param {Element} eventLogDiv The div where the event log is at.
 */
lanyard.demo.TopLevelTilesRender = function (webGLCanvas, eventLogDiv) {

    /*
     * Keep in mind that stuff that goes on in this constructor will not
     * be logged using the standard logger. You'll need to use another method
     * or put your logic somewhere after the logger has been setup properly.
     */

    /** @private */ this._webGLCanvas = webGLCanvas;
    /** @private */ this._eventLogDiv = eventLogDiv;
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.demo.TopLevelTilesRender');
};
goog.exportSymbol('lanyard.demo.TopLevelTilesRender', lanyard.demo.TopLevelTilesRender);

/**
 * Initializes and starts the test.
 *
 * @this {lanyard.demo.TopLevelTilesRender}
 */
lanyard.demo.TopLevelTilesRender.prototype.run = function () {
    this.setupEventLog();

    // Get the gl context
    var gl = WebGLDebugUtils.makeDebugContext(this._webGLCanvas.getContext("experimental-webgl"));
    //var gl = this._webGLCanvas.getContext("experimental-webgl");

    // Setup the shaders
    this._logger.fine("Setting up the shaders.");
    var glsl = new lanyard.render.GLSL(gl);
    glsl.loadVertexShader("shader-vs");
    glsl.loadFragmentShader("shader-fs");
    glsl.useShaders();
    glsl.startShader();

    // Setup the canvas
    this._logger.fine("Setting up the canvas.");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    /** @type {lanyard.BasicDrawContext} */
    var dc = new lanyard.BasicDrawContext(this._webGLCanvas);
    dc.setModel(new lanyard.BasicModel());

    /** @type {lanyard.globes.EllipsoidRectangularTessellator} */
    var tess = new lanyard.globes.EllipsoidRectangularTessellator(new lanyard.globes.Earth());

    /** @type {Array.<lanyard.globes.RectTile>} */
    var topLevels = tess.topLevels;
    this._logger.fine("Generated top level tiles (count: " + topLevels.length + ").");

    // Init the position buffer
    this._logger.fine("Setting up the position buffer.");
    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);

    for(var i = 0; i < topLevels.length; i = i + 1) {
        var tile = topLevels[i];
        tile.makeVerts(dc);

        var refCenter = tile._ri.referenceCenter;
        this._logger.fine("For this tile, using reference center of: " + refCenter.toString());

        this._logger.fine("Vert count for this tile: " + tile._ri.vertices.length);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tile._ri.vertices), gl.STATIC_DRAW);


        // TODO:
            // Save mvMatrix
            // translate mvMatrix to refCenter
            // render tile
            // restore mvMatrix
    }
};
goog.exportSymbol('lanyard.demo.TopLevelTilesRender.prototype.run',
    lanyard.demo.TopLevelTilesRender.prototype.run);

/**
 * Setup the event log.
 *
 * @this {lanyard.demo.TopLevelTilesRender}
 */
lanyard.demo.TopLevelTilesRender.prototype.setupEventLog = function () {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);

    /** @type {goog.debug.DivConsole} */
    var logconsole = new goog.debug.DivConsole(this._eventLogDiv);
    logconsole.setCapturing(true);
};
goog.exportSymbol('lanyard.demo.TopLevelTilesRender.prototype.setupEventLog',
    lanyard.demo.TopLevelTilesRender.prototype.setupEventLog);

/* EOF */
