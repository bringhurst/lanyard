/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.demo.SectorRender2');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.events.Event');

goog.require('lanyard.geom.Sector');
goog.require('lanyard.globes.Earth');
goog.require('lanyard.geom.MatrixFour');

/**
 * A basic test for rendering a single sector.
 *
 * @constructor
 * @this {lanyard.demo.SectorRender2}
 * @param {Element} webGLCanvas The WebGL enabled canvas to draw the map to.
 * @param {Element} eventLogDiv The div where the event log is at.
 */
lanyard.demo.SectorRender2 = function (webGLCanvas, eventLogDiv) {

    /*
     * Keep in mind that stuff that goes on in this constructor will not
     * be logged using the standard logger. You'll need to use another method
     * or put your logic somewhere after the logger has been setup properly.
     */

    /** @private */ this._webGLCanvas = webGLCanvas;
    /** @private */ this._eventLogDiv = eventLogDiv;
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.demo.SectorRender2');
};
goog.exportSymbol('lanyard.demo.SectorRender2', lanyard.demo.SectorRender2);

/**
 * Initializes and starts the test.
 *
 * @this {lanyard.demo.SectorRender2}
 */
lanyard.demo.SectorRender2.prototype.run = function () {
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

    // Create a sector to render
    var minLatitude = 20.0;
    var minLongitude = 40.0;

    var maxLatitude = 60.0;
    var maxLongitude = 80.0;

    var sector = lanyard.geom.Sector.prototype.fromDegrees(
        minLatitude, maxLatitude, minLongitude, maxLongitude);

    // Get the corner points of the sector in xyz space
    var corners = sector.computeCornerPoints(model.getGlobe());
    //this._logger.fine("Generated a sector with corners of: " +
    //    corners[0] + ", " + corners[1] + ", " +
    //    corners[2] + ", " + corners[3] + ".");

    // Init the position buffer
    //this._logger.fine("Setting up the position buffer.");
    var vertexPositionBuffer = dc.getGL().createBuffer();
    dc.getGL().bindBuffer(dc.getGL().ARRAY_BUFFER, vertexPositionBuffer);
    var vertices = [
        corners[0].getX(), corners[0].getY(), corners[0].getZ(),
        corners[1].getX(), corners[1].getY(), corners[1].getZ(),
        corners[2].getX(), corners[2].getY(), corners[2].getZ(),
        corners[3].getX(), corners[3].getY(), corners[3].getZ(),
        corners[0].getX(), corners[0].getY(), corners[0].getZ()
    ];
    dc.getGL().bufferData(dc.getGL().ARRAY_BUFFER, new Float32Array(vertices), dc.getGL().STATIC_DRAW);

    // Init the color buffer
    //this._logger.fine("Setting up the color buffer.");
    var vertexColorBuffer = dc.getGL().createBuffer();
    dc.getGL().bindBuffer(dc.getGL().ARRAY_BUFFER, vertexColorBuffer);

    var colors = [];
    for (var i=0; i < 5; i++) {
      colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }

    dc.getGL().bufferData(dc.getGL().ARRAY_BUFFER, new Float32Array(colors), dc.getGL().STATIC_DRAW);

    // Setup the canvas
    //this._logger.fine("Setting up the canvas.");
    dc.getGL().clearColor(0.0, 0.0, 0.0, 1.0);
    dc.getGL().clearDepth(1.0);
    dc.getGL().enable(dc.getGL().DEPTH_TEST);
    dc.getGL().depthFunc(dc.getGL().LEQUAL);

    var self = this;
    setInterval(function () {
        //self._logger.fine("Beginning draw loop.");

        dc.getGL().viewport(0, 0, 500, 500);
        dc.getGL().clear(dc.getGL().COLOR_BUFFER_BIT | dc.getGL().DEPTH_BUFFER_BIT);

        // Apply default view state
        view.doApply(dc);

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

        // Draw the scene
        //self._logger.fine("Drawing the scene.");
        dc.getGL().drawArrays(dc.getGL().TRIANGLE_STRIP, 0, 5);

        //self._logger.fine("Finishing draw loop.");
    }, 500); // end setInterval
};
goog.exportSymbol('lanyard.demo.SectorRender2.prototype.run',
    lanyard.demo.SectorRender2.prototype.run);

/**
 * Setup the event log.
 *
 * @this {lanyard.demo.SectorRender2}
 */
lanyard.demo.SectorRender2.prototype.setupEventLog = function () {
    goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.ALL);

    /** @type {goog.debug.DivConsole} */
    var logconsole = new goog.debug.DivConsole(this._eventLogDiv);
    logconsole.setCapturing(true);
};
goog.exportSymbol('lanyard.demo.SectorRender2.prototype.setupEventLog',
    lanyard.demo.SectorRender2.prototype.setupEventLog);

/* EOF */
