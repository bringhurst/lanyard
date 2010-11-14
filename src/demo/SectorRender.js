/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.demo.SectorRender');

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

    // Create a sector to render
    var minLatitude = 20.0;
    var minLongitude = 40.0;

    var maxLatitude = 60.0;
    var maxLongitude = 80.0;

    var sector = lanyard.geom.Sector.prototype.fromDegrees(
        minLatitude, maxLatitude, minLongitude, maxLongitude);

    // Get the corner points of the sector in xyz space
    var corners = sector.computeCornerPoints(new lanyard.globes.Earth());
    this._logger.fine("Generated a sector with corners of: " +
        corners[0] + ", " + corners[1] + ", " +
        corners[2] + ", " + corners[3] + ".");

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

    // Init the position buffer
    this._logger.fine("Setting up the position buffer.");
    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var vertices = [
        corners[0].getX(), corners[0].getY(), corners[0].getZ(),
        corners[1].getX(), corners[1].getY(), corners[1].getZ(),
        corners[2].getX(), corners[2].getY(), corners[2].getZ(),
        corners[3].getX(), corners[3].getY(), corners[3].getZ(),
        corners[0].getX(), corners[0].getY(), corners[0].getZ()
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Init the color buffer
    this._logger.fine("Setting up the color buffer.");
    var vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

    var colors = [];
    for (var i=0; i < 5; i++) {
      colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Setup the canvas
    this._logger.fine("Setting up the canvas.");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    var self = this;
    //setInterval(function () {
        //self._logger.fine("Beginning draw loop.");

        gl.viewport(0, 0, 500, 500);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Setup the perspective matrix
        //self._logger.fine("Setting up the perspective matrix.");

        /** @type {lanyard.geom.Angle} */
        var fieldOfView = lanyard.geom.Angle.prototype.fromDegrees(45);

        /** @type {lanyard.geom.ViewFrustum} */
        var viewFrustum =
            lanyard.geom.ViewFrustum.prototype.fromHorizontalFieldOfView(
                fieldOfView, 500, 500, 0.1, 6400000 * 10
            );

        /** @type {lanyard.geom.MatrixFour} */
        var pMatrix = viewFrustum.getProjectionMatrix();

        // Setup the model-view matrix
        //self._logger.fine("Setting up the model-view matrix.");
        var mvMatrix = new lanyard.geom.MatrixFour(null); // identity
        mvMatrix.translate(0.0, 0.0, -6400000.0 * 4);

        // Send our position buffer to the shader
        //self._logger.fine("Sending the position buffer to the shader.");
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        gl.enableVertexAttribArray(glsl.getAttribLocation("aVertexPosition"));
        gl.vertexAttribPointer(glsl.getAttribLocation("aVertexPosition"),
            3, gl.FLOAT, false, 0, 0);

        // Send our color buffer to the shader
        //self._logger.fine("Sending the color buffer to the shader.");
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        gl.enableVertexAttribArray(glsl.getAttribLocation("aVertexColor"));
        gl.vertexAttribPointer(glsl.getAttribLocation("aVertexColor"),
            4, gl.FLOAT, false, 0, 0);

        // Send the perspective matrix to the shader
        //self._logger.fine("Sending the perspective matrix to the shader (" +
        //    glsl.getUniformLocation("uPMatrix") + ").");
        self._logger.fine("Perspective matrix has contents of: " + pMatrix.toString());
        //self._logger.fine("Perspective matrix has length of: " + pMatrix.getEntries().length);
        gl.uniformMatrix4fv(glsl.getUniformLocation("uPMatrix"), false, new Float32Array(pMatrix.getEntries()));

        // Send the model-view matrix to the shader
        //self._logger.fine("Sending the model-view matrix to the shader (" +
        //    glsl.getUniformLocation("uMVMatrix") + ").");
        self._logger.fine("Model-view matrix has contents of: " + mvMatrix.toString());
        //self._logger.fine("Model-view matrix has length of: " + mvMatrix.getEntries().length);
        gl.uniformMatrix4fv(glsl.getUniformLocation("uMVMatrix"), false, new Float32Array(mvMatrix.getEntries()));

        // Draw the scene
        //self._logger.fine("Drawing the scene.");
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);

        //self._logger.fine("Finishing draw loop.");
    //}, 500); // end setInterval
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
