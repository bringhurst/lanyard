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

    // Setup a model (the earth)
    var model = new lanyard.BasicModel();

    // Setup a view
    var view = new lanyard.BasicOrbitView();
    view.setViewport(
        new lanyard.util.Rectangle(
            0, 0, this._webGLCanvas.width, this._webGLCanvas.height
        )
    );

    // Setup a draw context
    var dc = new lanyard.BasicDrawContext(this._webGLCanvas);
    dc.setModel(model);
    dc.setView(view);

    // Setup the shaders
    dc.loadShaders("shader-vs", "shader-fs");
    dc.setupShaders();

    // Get the top level tile geometry

    /** @type {lanyard.globes.EllipsoidRectangularTessellator} */
    var tess = model.getTessellator();

    /** @type {Array.<lanyard.globes.RectTile>} */
    var topLevels = tess.topLevels;
    this._logger.fine("Generated top level tiles (count: " + topLevels.length + ").");

    // Setup the canvas
    //this._logger.fine("Setting up the canvas.");
    dc.getGL().clearColor(0.0, 0.0, 0.0, 1.0);
    dc.getGL().clearDepth(1.0);
    dc.getGL().enable(dc.getGL().DEPTH_TEST);
    dc.getGL().depthFunc(dc.getGL().LEQUAL);

    dc.getGL().viewport(0, 0, 500, 500);
    dc.getGL().clear(dc.getGL().COLOR_BUFFER_BIT | dc.getGL().DEPTH_BUFFER_BIT);


    // apply the default matrix state
    view.doApply(dc);

    for(var i = 0; i < topLevels.length; i = i + 1) {
        this._logger.fine("Started tile.");

        var tile = topLevels[i];

        tile.makeVerts(dc);
        var refCenter = tile._ri.referenceCenter;

        this._logger.fine("For this tile, using reference center of: " + refCenter.toString());
        this._logger.fine("Vert count for this tile: " + tile._ri.vertices.length);

        // Setup position buffer
        var vertexPositionBuffer = dc.getGL().createBuffer();
        dc.getGL().bindBuffer(dc.getGL().ARRAY_BUFFER, vertexPositionBuffer);
        dc.getGL().bufferData(dc.getGL().ARRAY_BUFFER, new Float32Array(tile._ri.vertices),
            dc.getGL().STATIC_DRAW);

        // Setup color buffer
        var vertexColorBuffer = dc.getGL().createBuffer();
        dc.getGL().bindBuffer(dc.getGL().ARRAY_BUFFER, vertexColorBuffer);
        var colors = [];
        for (var j=0; j < tile._ri.vertices.length / 3; j++) {
            colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
        }
        dc.getGL().bufferData(dc.getGL().ARRAY_BUFFER, new Float32Array(colors), dc.getGL().STATIC_DRAW);

        // Send our position buffer to the shader
        //this._logger.fine("Sending the position buffer to the shader.");
        dc.getGL().bindBuffer(dc.getGL().ARRAY_BUFFER, vertexPositionBuffer);
        dc.getGL().enableVertexAttribArray(dc.getGLSL().getAttribLocation("aVertexPosition"));
        dc.getGL().vertexAttribPointer(dc.getGLSL().getAttribLocation("aVertexPosition"),
            3, dc.getGL().FLOAT, false, 0, 0);

        // Send our color buffer to the shader
        //self._logger.fine("Sending the color buffer to the shader.");
        dc.getGL().bindBuffer(dc.getGL().ARRAY_BUFFER, vertexColorBuffer);
        dc.getGL().enableVertexAttribArray(dc.getGLSL().getAttribLocation("aVertexColor"));
        dc.getGL().vertexAttribPointer(dc.getGLSL().getAttribLocation("aVertexColor"),
            4, dc.getGL().FLOAT, false, 0, 0);

        // Push reference center state for this tile
        var refCenter = tile._ri.referenceCenter;
        view.pushReferenceCenter(dc, refCenter)

        // Draw the scene
        this._logger.fine("Drawing the scene.");
        dc.getGL().drawArrays(dc.getGL().TRIANGLE_STRIP, 0, tile._ri.vertices.length / 3);

        // Pop off the reference center
        view.popReferenceCenter(dc);

        this._logger.fine("Finished tile.");
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
