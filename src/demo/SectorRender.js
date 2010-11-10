/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.demo.SectorRender');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.debug.Logger');
goog.require('goog.events.Event');

goog.require('lanyard.geom.Sector');

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
    var minLatitude = 70.0;
    var maxLatitude = 12.0;
    var minLongitude = -150.0;
    var maxLongitude = -10.0;
    var sector = lanyard.geom.Sector.prototype.fromDegrees(
        minLatitude, maxLatitude, minLongitude, maxLongitude);

    // Get the corner points of the sector in xyz space
    var corners = sector.computeCornerPoints(new lanyard.globes.Earth());

    this._logger.fine("Generated corners of: " + corners[0] + ", " + corners[1] + ", " +
        corners[2] + ", " + corners[3] + ".");
/**
    // Get the gl context
    var gl = WebGLDebugUtils.makeDebugContext(this._webGLCanvas.getContext("experimental-webgl"));

    // Setup the shaders
    var glsl = new lanyard.render.GLSL(this.gl);
    glsl.loadVertexShader("shader-vs");
    glsl.loadFragmentShader("shader-fs");
    glsl.useShaders();

    // Init the buffers
    var vertexPositionBuffer = gl.createBuffer();
    var vertexTextureCoordBuffer = gl.createBuffer();
    var vertexIndexBuffer = gl.createBuffer();

    // Init the texture
    function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    var texture;
    texture = gl.createTexture();
    texture.image = new Image();

    texture.image.onload = function() {
        handleLoadedTexture(texture)
    }

    texture.image.src = "sector_test.gif";

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Draw the scene
    gl.viewport(0, 0, 500, 500);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    perspective(45, 500 / 500, 0.1, 100.0);
    loadIdentity();

    mvTranslate([0.0, 0.0, -5.0])

    mvRotate(xRot, [1, 0, 0]);
    mvRotate(yRot, [0, 1, 0]);
    mvRotate(zRot, [0, 0, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

**/
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
