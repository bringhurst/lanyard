/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.DrawContextImpl');

/**
 * A drawcontext implementation.
 *
 * @constructor
 * @implements {lanyard.DrawContext}
 * @param {canvas} the WebGL enabled canvas element.
 */
lanyard.DrawContextImpl = function (canvasElement) {
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
     * @type {canvas}
     */
    this.canvasElement = canvasElement;

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
    this.clearColor = lanyard.util.Color.prototype.fromHexString("00000000");

    /**
     * @private
     * @type {boolean}
     */
    this.isPickingMode = false;

    /**
     * @private
     * @type {number}
     */
    this.numTextureUnits = -1;

    /**
     * @private
     * @type {lanyard.SurfaceTileRenderer}
     */
    //this.surfaceTileRenderer = new lanyard.SurfaceTileRenderer();

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
};

/**
 * Setup the WebGL/draw context.
 */
lanyard.DrawContextImpl.prototype.initialize = function () {
    this.gl = this.canvasElement.getContext("experimental-webgl");
    this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height);

    if (!this.gl) {
        this._logger.severe("The canvas specified does not seem to support WebGL.");
    } else {
        this._logger.fine("A WebGL context was successfully obtained from the canvas.");
    }

    this.visibleSector = null;

    if (this.surfaceGeometry) {
        this.surfaceGeometry.clear();
    }

    this.surfaceGeometry = null;
    this.orderedRenderables.clear();
    this.uniquePickNumber = 0;

    if (this.numTextureUnits < 1) {
        this.numTextureUnits = lanyard.DrawContextImpl.prototype.queryMaxTextureUnits(this.gl);
    }
};

/**
 * Return the current WebGL rendering context.
 *
 * @return {WebGLRenderingContext} the current rendering context.
 */
lanyard.DrawContextImpl.prototype.getGL = function () {
    return this.gl;
};

/**
 * Accessor for getting the WebGL context.
 *
 * @return {WebGLRenderingContext} the WebGL context.
 */
lanyard.DrawContextImpl.prototype.getWebGLCanvas = function () {
    return this.canvasElement;
};

/**
 * Return the drawable height of the canvas.
 *
 * @return {number} the drawable height of the canvas.
 */
lanyard.DrawContextImpl.prototype.getDrawableHeight = function () {
    return this.canvasElement.height;
};

/**
 * Return the drawable width of the canvas.
 *
 * @return {number} the drawable width of the canvas.
 */
lanyard.DrawContextImpl.prototype.getDrawableWidth = function () {
    return this.canvasElement.width;
};

/**
 * Return the number of available texture units.
 *
 * @private
 * @param {WebGLRenderingContext} gl the rendering context.
 * @return {number} the number of available texture units.
 */
lanyard.DrawContextImpl.prototype.queryMaxTextureUnits = function (gl) {
    return this.gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
};

/**
 * Set the current model.
 *
 * @param {lanyard.Model} the new model to use in this context.
 */
lanyard.DrawContextImpl.prototype.setModel = function (model) {
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
lanyard.DrawContextImpl.prototype.getModel = function () {
    return this.model;
};

/**
 * Get the current layers.
 *
 * @return {Array.<lanyard.Layer>} the current layer list.
 */
lanyard.DrawContextImpl.prototype.getLayers = function () {
    return this.model.getLayers();
};

/**
 * Get the current visible sector.
 *
 * @return {lanyard.geom.Sector} the currently visible sector.
 */
lanyard.DrawContextImpl.prototype.getVisibleSector = function () {
    return this.visibleSector;
};

/**
 * Set the currently visible sector.
 *
 * @param {lanyard.geom.Sector} s the new currently visible sector.
 */
lanyard.DrawContextImpl.prototype.setVisibleSector = function (s) {
    this.visibleSector = s;
};

/**
 * Set the current surface geometry.
 *
 * @param {lanyard.SectorGeometryList} surfaceGeometry the current surface geometry.
 */
lanyard.DrawContextImpl.prototype.setSurfaceGeometry = function (surfaceGeometry) {
    this.surfaceGeometry = surfaceGeometry;
};

/**
 * Get the current surface geometry.
 *
 * @return {lanyard.SectorGeometryList} the current surface geometry.
 */
lanyard.DrawContextImpl.prototype.getSurfaceGeometry = function () {
    return this.surfaceGeometry;
};

/**
 * Return the current globe.
 *
 * @return {lanyard.Globe} the current globe.
 */
lanyard.DrawContextImpl.prototype.getGlobe = function () {
    return this.globe !== null ? this.globe : this.model.getGlobe();
};

/**
 * Set the current view.
 *
 * @param {lanyard.View} view the new view to use.
 */
lanyard.DrawContextImpl.prototype.setView = function (view) {
    this.view = view;
};

/**
 * Get the current view.
 *
 * @return {lanyard.View} the current view.
 */
lanyard.DrawContextImpl.prototype.getView = function () {
    return this.view;
};

/**
 * Get the current vertical exaggeration.
 *
 * @return {number} the current vertical exaggeration.
 */
lanyard.DrawContextImpl.prototype.getVerticalExaggeration = function () {
    return this.verticalExaggeration;
};

/**
 * Set the vertical exaggeration to use.
 *
 * @param {number} verticalExaggeration the new vertical exaggeration to use.
 */
lanyard.DrawContextImpl.prototype.setVerticalExaggeration = function (verticalExaggeration) {
    this.verticalExaggeration = verticalExaggeration;
};

/**
 * Generate a unique pick color.
 *
 * @return {lanyard.util.Color} the new unique pick color.
 */
lanyard.DrawContextImpl.prototype.getUniquePickColor = function () {
    this.uniquePickNumber = this.uniquePickNumber + 1;

    /** @type {number} */
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
};

/**
 * Get the current clear color.
 *
 * @return {lanyard.util.Color} the current clear color.
 */
lanyard.DrawContextImpl.prototype.getClearColor = function () {
    return this.clearColor;
};

/**
 * Get the current picking mode.
 *
 * @return {boolean} true if the Picking mode is active, otherwise return false
 */
lanyard.DrawContextImpl.prototype.isPickingMode = function () {
    return this.isPickingMode;    
};

/**
 * Enables color picking mode.
 */
lanyard.DrawContextImpl.prototype.enablePickingMode = function () {
    this.isPickingMode = true;
};

/**
 * Disables color picking mode.
 */
lanyard.DrawContextImpl.prototype.disablePickingMode = function () {
    this.isPickingMode = false;
};

/**
 * Add an ordered renderable.
 *
 * @param {lanyard.OrderedRenderable} orderedRenderable an ordered renderable.
 */
lanyard.DrawContextImpl.prototype.addOrderedRenderable = function (orderedRenderable) {
    this.orderedRenderables.offer(orderedRenderable);
};

/**
 * Get the current ordered renderables.
 *
 * @return {lanyard.util.PriorityQueue} the current ordered renderables.
 */
lanyard.DrawContextImpl.prototype.getOrderedRenderables = function () {
    return this.orderedRenderables;
};

/**
 * Draw a unit quad to the current context.
 */
lanyard.DrawContextImpl.prototype.drawUnitQuad = function () {
    var gl = this.getGL();

    gl.glBegin(gl.GL_QUADS); // TODO: use a vertex array or vertex buffer
    gl.glVertex2d(0.0, 0.0);
    gl.glVertex2d(1, 0.0);
    gl.glVertex2d(1, 1);
    gl.glVertex2d(0.0, 1);
    gl.glEnd();
};

/**
 * Draw a unit quad with the specified texture coordinates.
 *
 * @param {lanyard.util.TextureCoords} texCoords the texture coordinates.
 */
lanyard.DrawContextImpl.prototype.drawUnitQuad = function (texCoords) {
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
};

/**
 * Get the number of available texture units.
 *
 * @return {number} the number of texture units.
 */
lanyard.DrawContextImpl.prototype.getNumTextureUnits = function () {
    return this.numTextureUnits;
};

/**
 * Set the number of available texture units.
 *
 * @param {number} numTextureUnits the number of texture units.
 */
lanyard.DrawContextImpl.prototype.setNumTextureUnits = function (numTextureUnits) {
    this.numTextureUnits = numTextureUnits;
};

/**
 * Get a point on the current globe.
 *
 * @param {lanyard.geom.Angle} latitude the latitude.
 * @param {lanyard.geom.Angle} longitude the longitude.
 * @return {lanyard.geom.Point} the point.
 */
lanyard.DrawContextImpl.prototype.getPointOnGlobe = function (latitude, longitude) {
    if (!this.getVisibleSector().contains(latitude, longitude)) {
        return null;
    }

    /** @type {lanyard.SectorGeometryList} */
    var sectorGeometry = this.getSurfaceGeometry();

    if (sectorGeometry) {
        /** @type {lanyard.geom.Point} */
        var p = sectorGeometry.getSurfacePoint(latitude, longitude);
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
 * @return {lanyard.SurfaceTileRenderer} the surface tile renderer.
 */
lanyard.DrawContextImpl.prototype.getSurfaceTileRenderer = function () {
    return this.surfaceTileRenderer;
};

/* EOF */
