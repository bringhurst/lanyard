/*global goog, lanyard, Float32Array */
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

goog.provide('lanyard.BasicDrawContext');

goog.require('lanyard.util.Color');
goog.require('goog.debug.Logger');
goog.require('lanyard.util.PriorityQueue');
goog.require('lanyard.OrderedRenderable');
goog.require('lanyard.util.TextureCoords');
goog.require('lanyard.render.SurfaceTileRenderer');
goog.require('lanyard.render.GLSL');

/**
 * A drawcontext implementation.
 *
 * @constructor
 * @implements {lanyard.DrawContext}
 * @param {lanyard.LanyardCanvas} lanyardCanvas the WebGL enabled canvas element.
 */
lanyard.BasicDrawContext = function (lanyardCanvas) {
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.BasicDrawContext');

    /**
     * @private
     * @type {lanyard.View}
     */
    this.view = null;

    /**
     * @private
     * @type {lanyard.Model}
     */
    this.model = null;

    /**
     * @private
     * @type {lanyard.Globe}
     */
    this.globe = null;

    /**
     * @private
     * @type {lanyard.LanyardCanvas}
     */
    this.lanyardCanvas = lanyardCanvas;

    if(!this.lanyardCanvas) {
        this._logger.severe("Attempted to create a draw context without a valid lanyard canvas.");
    }

    /**
     * @private
     * @type {number}
     */
    this.verticalExaggeration = 1.0;

    /**
     * @private
     * @type {lanyard.geom.Sector}
     */
    this.visibleSector = null;

    /**
     * @private
     * @type {lanyard.SectorGeometryList}
     */
    this.surfaceGeometry = null;

    /**
     * @private
     * @type {number}
     */
    this.uniquePickNumber = 0;

    /**
     * @private
     * @type {lanyard.util.Color}
     */
    this.clearColor = lanyard.util.Color.prototype.BLACK;

    /**
     * @private
     * @type {boolean}
     */
    this._isPickingMode = false;

    /**
     * @private
     * @type {number}
     */
    this.numTextureUnits = -1;

    /**
     * The ordered renderable queue.
     *
     * @private
     * @type {lanyard.util.PriorityQueue}
     */
    this.orderedRenderables = new lanyard.util.PriorityQueue(
      /**
       * A pqueue comparison function for renderables.
       *
       * @param {lanyard.OrderedRenderable} orA lvalue renderable.
       * @param {lanyard.OrderedRenderable} orB rvalue renderable.
       */    
      function (orA, orB) {
          /** @type {number} */
          var eA = orA.getDistanceFromEye();

          /** @type {number} */
          var eB = orB.getDistanceFromEye();

          return eA > eB ? -1 : eA === eB ? 0 : 1;
      }
    );

    /** @type {HTMLCanvasElement} */
    var domCanvas = lanyardCanvas.getWebGLCanvas();

    /**
     * @private
     * @type {WebGLRenderingContext}
     */
    this.gl = /** @type {WebGLRenderingContext} */ (domCanvas.getContext("experimental-webgl"));
    //this.gl = WebGLDebugUtils.makeDebugContext(this.lanyardCanvas.getWebGLCanvas().getContext("experimental-webgl"));

    if (!this.gl) {
        this._logger.severe("The canvas specified does not seem to support WebGL.");
    } else {
        //this._logger.fine("A WebGL context was successfully obtained from the canvas.");
    }

    /**
     * private
     * type {lanyard.SurfaceTileRenderer}
     */
    this.surfaceTileRenderer = new lanyard.render.SurfaceTileRenderer(this.gl);

    /** @type {lanyard.render.GLSL} */
    this.glsl = null;

    /** @type {string} */
    this.vshaderId = "shader-vs";

    /** @type {string} */
    this.fshaderId = "shader-fs";
};

/**
 * Setup the WebGL/draw context.
 */
lanyard.BasicDrawContext.prototype.initialize = function () {
    if(!this.lanyardCanvas) {
        this._logger.severe("Attempt to initialize a draw context without a valid lanyard canvas.");
    }

    this.gl.viewport(0, 0,
        this.lanyardCanvas.getWebGLCanvas().width,
        this.lanyardCanvas.getWebGLCanvas().height);

    this.visibleSector = null;

    if (this.surfaceGeometry) {
        this.surfaceGeometry.clear();
    }

    this.surfaceGeometry = null;
    this.orderedRenderables.clear();
    this.uniquePickNumber = 0;

    if (this.numTextureUnits < 1) {
        this.numTextureUnits = this.queryMaxTextureUnits(this.gl);

/*
        this._logger.fine(
            "Query for available texture units returned " + this.numTextureUnits);
*/
    }
};

/**
 * Setup the shaders for rendering the tiles.
 */
lanyard.BasicDrawContext.prototype.setupShaders = function () {
    if(!this.glsl && this.vshaderId && this.fshaderId)  {
        this.glsl = new lanyard.render.GLSL(this.gl);

        this.glsl.loadVertexShader(this.vshaderId);
        this.glsl.loadFragmentShader(this.fshaderId);

        this.glsl.useShaders();
        this.glsl.startShader();
    } else {
        //this._logger.fine("Attempted to reload shaders when shaders were already loaded.");
    }
};

/**
 * Set the location of the vertex and fragment shaders and reset the shaders.
 *
 * @param {string} vshaderId the dom id of the vertex shader.
 * @param {string} fshaderId the dom id of the fragment shader.
 */
lanyard.BasicDrawContext.prototype.loadShaders = function (vshaderId, fshaderId) {
    this.vshaderId = vshaderId;
    this.fshaderId = fshaderId;
    this.glsl = null; // Force a reload.
};

/**
 * Return the current WebGL rendering context.
 *
 * @return {WebGLRenderingContext} the current rendering context.
 */
lanyard.BasicDrawContext.prototype.getGL = function () {
    return this.gl;
};

/**
 * Return the current shader context.
 *
 * @return {lanyard.render.GLSL} the current shader context.
 */
lanyard.BasicDrawContext.prototype.getGLSL = function () {
    return this.glsl;
};

/**
 * Accessor for getting the canvas object.
 *
 * @return {lanyard.LanyardCanvas} the lanyard canvas.
 */
lanyard.BasicDrawContext.prototype.getCanvas = function () {
    return this.lanyardCanvas;
};

/**
 * Mutator for setting the canvas object.
 *
 * @param {lanyard.LanyardCanvas} lanyardCanvas the new canvas object.
 */
lanyard.BasicDrawContext.prototype.setCanvas = function (lanyardCanvas) {
    this.lanyardCanvas = lanyardCanvas;
};

/**
 * Return the drawable height of the canvas.
 *
 * @return {number} the drawable height of the canvas.
 */
lanyard.BasicDrawContext.prototype.getDrawableHeight = function () {
    return this.lanyardCanvas.getWebGLCanvas().height;
};

/**
 * Return the drawable width of the canvas.
 *
 * @return {number} the drawable width of the canvas.
 */
lanyard.BasicDrawContext.prototype.getDrawableWidth = function () {
    return this.lanyardCanvas.getWebGLCanvas().width;
};

/**
 * Return the number of available texture units.
 *
 * @private
 * @param {WebGLRenderingContext} gl the rendering context.
 * @return {number} the number of available texture units.
 */
lanyard.BasicDrawContext.prototype.queryMaxTextureUnits = function (gl) {
    return /** @type {number} */ (this.gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
};

/**
 * Set the current model.
 *
 * @param {lanyard.Model} model the new model to use in this context.
 */
lanyard.BasicDrawContext.prototype.setModel = function (model) {
    if (!model) {
        return;
    }

    this.model = model;

    /** @type {lanyard.Globe} */
    var g = this.model.getGlobe();

    if (g) {
        this.globe = g;
    }
};

/**
 * Return a reference to the current model.
 *
 * @return {lanyard.Model} the current model.
 */
lanyard.BasicDrawContext.prototype.getModel = function () {
    return this.model;
};

/**
 * Get the current layers.
 *
 * @return {Array.<lanyard.Layer>} the current layer list.
 */
lanyard.BasicDrawContext.prototype.getLayers = function () {
    return this.model.getLayers();
};

/**
 * Get the current visible sector.
 *
 * @return {lanyard.geom.Sector} the currently visible sector.
 */
lanyard.BasicDrawContext.prototype.getVisibleSector = function () {
    return this.visibleSector;
};

/**
 * Set the currently visible sector.
 *
 * @param {lanyard.geom.Sector} s the new currently visible sector.
 */
lanyard.BasicDrawContext.prototype.setVisibleSector = function (s) {
    this.visibleSector = s;
};

/**
 * Set the current surface geometry.
 *
 * @param {lanyard.SectorGeometryList} surfaceGeometry the current surface geometry.
 */
lanyard.BasicDrawContext.prototype.setSurfaceGeometry = function (surfaceGeometry) {
    this.surfaceGeometry = surfaceGeometry;
};

/**
 * Get the current surface geometry.
 *
 * @return {lanyard.SectorGeometryList} the current surface geometry.
 */
lanyard.BasicDrawContext.prototype.getSurfaceGeometry = function () {
    return this.surfaceGeometry;
};

/**
 * Return the current globe.
 *
 * @return {lanyard.Globe} the current globe.
 */
lanyard.BasicDrawContext.prototype.getGlobe = function () {
    return this.globe !== null ? this.globe : this.model.getGlobe();
};

/**
 * Set the current view.
 *
 * @param {lanyard.View} view the new view to use.
 */
lanyard.BasicDrawContext.prototype.setView = function (view) {
    this.view = view;
};

/**
 * Get the current view.
 *
 * @return {lanyard.View} the current view.
 */
lanyard.BasicDrawContext.prototype.getView = function () {
    return this.view;
};

/**
 * Get the current vertical exaggeration.
 *
 * @return {number} the current vertical exaggeration.
 */
lanyard.BasicDrawContext.prototype.getVerticalExaggeration = function () {
    return this.verticalExaggeration;
};

/**
 * Set the vertical exaggeration to use.
 *
 * @param {number} verticalExaggeration the new vertical exaggeration to use.
 */
lanyard.BasicDrawContext.prototype.setVerticalExaggeration = function (verticalExaggeration) {
    this.verticalExaggeration = verticalExaggeration;
};

/**
 * Generate a unique pick color.
 *
 * @return {lanyard.util.Color} the new unique pick color.
 */
lanyard.BasicDrawContext.prototype.getUniquePickColor = function () {
    return lanyard.util.Color.prototype.GREEN;

  /*** TODO: pick an actual random color...
    this.uniquePickNumber = this.uniquePickNumber + 1;
    var clearColorCode = this.getClearColor().getRGB();

    if(clearColorCode === this.uniquePickNumber) {
        this.uniquePickNumber = this.uniquePickNumber + 1;
    }

    if(this.uniquePickNumber >= 0x00FFFFFF) {
        this.uniquePickNumber = 1;  // no black, no white
        if(clearColorCode === this.uniquePickNumber) {
            this.uniquePickNumber = this.uniquePickNumber + 1;
        }
    }

    // has alpha
    return new lanyard.util.Color.prototype.fromRGBA(this.uniquePickNumber, true);
  */
};

/**
 * Get the current clear color.
 *
 * @return {lanyard.util.Color} the current clear color.
 */
lanyard.BasicDrawContext.prototype.getClearColor = function () {
    return this.clearColor;
};

/**
 * Get the current picking mode.
 *
 * @return {boolean} true if the Picking mode is active, otherwise return false
 */
lanyard.BasicDrawContext.prototype.isPickingMode = function () {
    return this._isPickingMode;
};

/**
 * Enables color picking mode.
 */
lanyard.BasicDrawContext.prototype.enablePickingMode = function () {
    this._isPickingMode = true;
};

/**
 * Disables color picking mode.
 */
lanyard.BasicDrawContext.prototype.disablePickingMode = function () {
    this._isPickingMode = false;
};

/**
 * Add an ordered renderable.
 *
 * @param {lanyard.OrderedRenderable} orderedRenderable an ordered renderable.
 */
lanyard.BasicDrawContext.prototype.addOrderedRenderable = function (orderedRenderable) {
    this.orderedRenderables.offer(orderedRenderable);
};

/**
 * Get the current ordered renderables.
 *
 * @return {lanyard.util.PriorityQueue} the current ordered renderables.
 */
lanyard.BasicDrawContext.prototype.getOrderedRenderables = function () {
    return this.orderedRenderables;
};

/**
 * Draw a unit quad to the current context.
 */
lanyard.BasicDrawContext.prototype.drawUnitQuad = function () {
    this._logger.fine("Drawing a unit quad.");

    /** @type {WebGLRenderingContext} */
    var gl = this.getGL();

    /** @type {WebGLBuffer} */
    var quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);

    /** @type {Array.<number>} */
    var vertices = [
         0.0, 0.0, 0.0,
         1.0, 0.0, 0.0,
         1.0, 1.0, 0.0,
         0.0, 1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.glsl.getAttribLocation("aVertexPosition"), 3, gl.FLOAT, false, 0, 0);

    this._logger.fine("Calling draw arrays.");
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

/*
    var gl = this.getGL();

    gl.glBegin(gl.GL_QUADS); // TODO: use a vertex array or vertex buffer
    gl.glVertex2d(0.0, 0.0);
    gl.glVertex2d(1, 0.0);
    gl.glVertex2d(1, 1);
    gl.glVertex2d(0.0, 1);
    gl.glEnd();
*/
};

/**
 * Draw a unit quad with the specified texture coordinates.
 *
 * @param {lanyard.util.TextureCoords} texCoords the texture coordinates.
 */
lanyard.BasicDrawContext.prototype.drawUnitQuadWithTexCoords = function (texCoords) {
/*
    var gl = this.getGL();

    gl.glBegin(gl.GL_QUADS); // TODO: use a vertex array or vertex buffer
    gl.glTexCoord2d(texCoords.left(), texCoords.bottom());
    gl.glVertex2d(0.0, 0.0);
    gl.glTexCoord2d(texCoords.right(), texCoords.bottom());
    gl.glVertex2d(1, 0.0);
    gl.glTexCoord2d(texCoords.right(), texCoords.top());
    gl.glVertex2d(1, 1);
    gl.glTexCoord2d(texCoords.left(), texCoords.top());
    gl.glVertex2d(0.0, 1);
    gl.glEnd();
*/
};

/**
 * Get the number of available texture units.
 *
 * @return {number} the number of texture units.
 */
lanyard.BasicDrawContext.prototype.getNumTextureUnits = function () {
    return this.numTextureUnits;
};

/**
 * Set the number of available texture units.
 *
 * @param {number} numTextureUnits the number of texture units.
 */
lanyard.BasicDrawContext.prototype.setNumTextureUnits = function (numTextureUnits) {
    this.numTextureUnits = numTextureUnits;
};

/**
 * Get a point on the current globe.
 *
 * @param {lanyard.geom.Angle} latitude the latitude.
 * @param {lanyard.geom.Angle} longitude the longitude.
 * @return {lanyard.geom.Point} the point.
 */
lanyard.BasicDrawContext.prototype.getPointOnGlobe = function (latitude, longitude) {
    if (!this.getVisibleSector().contains(latitude, longitude)) {
        return null;
    }

    /** @type {lanyard.SectorGeometryList} */
    var sectorGeometry = this.getSurfaceGeometry();

    if (sectorGeometry) {
        /** @type {lanyard.geom.Point} */
        var p = sectorGeometry.getSurfacePoint(latitude, longitude, 0);
        if (p) {
            return p;
        }
    }

    return null;

//    var globe = this.getGlobe();
//    if (!globe) {
//        return null;
//    }
//    var elevation = this.getVerticalExaggeration() * globe.getElevation(latitude, longitude);
//    return this.getGlobe().computeSurfacePoint(latitude, longitude, elevation);
};

/**
 * Get the current surface tile renderer.
 *
 * @return {lanyard.render.SurfaceTileRenderer} the surface tile renderer.
 */
lanyard.BasicDrawContext.prototype.getSurfaceTileRenderer = function () {
    return this.surfaceTileRenderer;
};

/**
 * Load the specified matrix into the specified uniform.
 *
 * @param {string} name the shader name of the matrix.
 * @param {lanyard.geom.MatrixFour} matrix the matrix to load.
 */
lanyard.BasicDrawContext.prototype.loadMatrix = function (name, matrix) {
    this.gl.uniformMatrix4fv(
        this.glsl.getUniformLocation(name),
        false,
        new Float32Array(matrix.getEntries())
    );
};

/**
 * Load the identity matrix into the specified uniform.
 *  
 * @param {string} name the shader name of the matrix.
 */     
lanyard.BasicDrawContext.prototype.loadIdentity = function (name) {
    // Matrix constructor defaults to identity.
    this.loadMatrix(name, new lanyard.geom.MatrixFour(null));
};

/* EOF */
