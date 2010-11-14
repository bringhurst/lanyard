/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.demo.HandleInput');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.events.Event');

goog.require('lanyard.dom.InputHandler');

/**
 * A basic test for handling user input.
 *
 * @constructor
 * @this {lanyard.demo.HandleInput}
 * @param {Element} webGLCanvas The WebGL enabled canvas to draw the map to.
 * @param {Element} eventLogDiv The div where the event log is at.
 */
lanyard.demo.HandleInput = function (webGLCanvas, eventLogDiv) {

    /*
     * Keep in mind that stuff that goes on in this constructor will not
     * be logged using the standard logger. You'll need to use another method
     * or put your logic somewhere after the logger has been setup properly.
     */

    /** @private */ this._webGLCanvas = webGLCanvas;
    /** @private */ this._eventLogDiv = eventLogDiv;
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.demo.HandleInput');
};
goog.exportSymbol('lanyard.demo.HandleInput', lanyard.demo.HandleInput);

/**
 * Initializes and starts the test.
 *
 * @this {lanyard.demo.HandleInput}
 */
lanyard.demo.HandleInput.prototype.run = function () {
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
    lc.setView(view);
    lc.createDefaultInputHandler();

    // Setup the shaders
    dc.loadShaders("shader-vs", "shader-fs");
    dc.setupShaders();

    // Setup the canvas
    dc.getGL().clearColor(0.0, 0.0, 0.0, 1.0);
    dc.getGL().clearDepth(1.0);
    dc.getGL().enable(dc.getGL().DEPTH_TEST);
    dc.getGL().depthFunc(dc.getGL().LEQUAL);

    // Make sure we have valid state matrices
    view.doApply(dc);

    /** @type {lanyard.SectorGeometryList} */
    var sgl = dc.getModel().getTessellator().tessellate(dc);
    this._logger.fine("Generated top level sectors (count: " + sgl.length() + ").");

    var vertexPositionBuffer = dc.getGL().createBuffer();
    dc.getGL().bindBuffer(dc.getGL().ARRAY_BUFFER, vertexPositionBuffer);

    var vertices = [];

    for(var i = 0; i < sgl.length(); i = i + 1) {
        var sector = sgl.at(i).getSector();
        var corners = sector.computeCornerPoints(model.getGlobe());

        // Init the position buffer
        //this._logger.fine("Setting up the position buffer.");
        vertices = vertices.concat([
            corners[0].getX(), corners[0].getY(), corners[0].getZ(),
            corners[1].getX(), corners[1].getY(), corners[1].getZ(),
            corners[2].getX(), corners[2].getY(), corners[2].getZ(),
            corners[3].getX(), corners[3].getY(), corners[3].getZ()
        ]);
    }
    dc.getGL().bufferData(dc.getGL().ARRAY_BUFFER, new Float32Array(vertices), dc.getGL().STATIC_DRAW);

    this._logger.fine("Size of vertices is: " + vertices.length);


    // Init the color buffer
    //this._logger.fine("Setting up the color buffer.");
    var vertexColorBuffer = dc.getGL().createBuffer();
    dc.getGL().bindBuffer(dc.getGL().ARRAY_BUFFER, vertexColorBuffer);

    var colors = [];
    for (var i=0; i < vertices.length / 3; i++) {
        colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }
    dc.getGL().bufferData(dc.getGL().ARRAY_BUFFER, new Float32Array(colors), dc.getGL().STATIC_DRAW);

    var self = this;
    setInterval(function() {
        // Begin drawing the scene
        dc.getGL().viewport(0, 0, 500, 500);
        dc.getGL().clear(dc.getGL().COLOR_BUFFER_BIT | dc.getGL().DEPTH_BUFFER_BIT);

        // Send our position buffer to the shader
        //self._logger.fine("Sending the position buffer to the shader.");
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

        // Apply the current view
        view.doApply(dc);

        // Draw the scene
        //self._logger.fine("Drawing the scene.");
        dc.getGL().drawArrays(dc.getGL().TRIANGLE_STRIP, 0, 4 * sgl.length());
    }, 500); // end setInterval
};
goog.exportSymbol('lanyard.demo.HandleInput.prototype.run',
    lanyard.demo.HandleInput.prototype.run);

/**
 * Setup the event log.
 *
 * @this {lanyard.demo.HandleInput}
 */
lanyard.demo.HandleInput.prototype.setupEventLog = function () {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);

    /** @type {goog.debug.DivConsole} */
    var logconsole = new goog.debug.DivConsole(this._eventLogDiv);
    logconsole.setCapturing(true);
};
goog.exportSymbol('lanyard.demo.HandleInput.prototype.setupEventLog',
    lanyard.demo.HandleInput.prototype.setupEventLog);

/* EOF */
