/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: false, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.BasicFrameController');

goog.require('goog.debug.Logger');

goog.require('lanyard.util.Point');

/**
 * A frame controller implementation.
 *
 * @constructor
 * @implements {lanyard.FrameController}
 */
lanyard.BasicFrameController = function () {
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.BasicFrameController');
};

/**
 * Initialize the frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.initializeFrame = function (dc)  {
    this._logger.fine("Initializing a frame.");

    dc.setupShaders();

/*
    GL gl = dc.getGL();

    gl.glPushAttrib(GL.GL_VIEWPORT_BIT | GL.GL_ENABLE_BIT
        | GL.GL_TRANSFORM_BIT);

    gl.glMatrixMode(GL.GL_MODELVIEW);
    gl.glPushMatrix();
    gl.glLoadIdentity();

    gl.glMatrixMode(GL.GL_PROJECTION);
    gl.glPushMatrix();
    gl.glLoadIdentity();

    gl.glEnable(GL.GL_DEPTH_TEST);
*/
};

/**
 * Finalize the frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.finalizeFrame = function (dc) {
    this._logger.fine("Finalizing a frame.");
/*
    GL gl = dc.getGL();

    gl.glMatrixMode(GL.GL_MODELVIEW);
    gl.glPopMatrix();

    gl.glMatrixMode(GL.GL_PROJECTION);
    gl.glPopMatrix();

    gl.glPopAttrib();

    gl.glFlush();

/*/
    this.checkGLErrors(dc);
};

/**
 * Called to check for openGL errors. This method includes a "round-trip" between the application and renderer,
 * which is slow. Therefore, this method is excluded from the "normal" render pass. It is here as a matter of
 * convenience to developers, and is not part of the API.
 *
 * @param {lanyard.DrawContext} dc the relevant DrawContext.
 */
lanyard.BasicFrameController.prototype.checkGLErrors = function (dc) {
    this._logger.fine("Checking for webgl errors.");
    /** @type {*} */
    var gl = dc.getGL();

    /** @type {number} */
    var err = gl.getError();

    if (err !== gl.NO_ERROR) {
        /** @type {string} */
        var msg = "A GL error code of type " + err + " happened.";
        this._logger.severe(msg);
    }
};

/**
 * Draw the actual frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.drawFrame = function (dc) {
    this.clearFrame(dc);

    this._logger.fine("Drawing the frame.");

    // Perform some basic sanity checks.

    if (!dc.getView()) {
        this._logger.severe("The view was null when attempting to draw.");
        return;
    }

    if (!dc.getModel()) {
        this._logger.severe("The model was null when attempting to draw.");
        return;
    }

    if (!dc.getLayers()) {
        this._logger.severe("The layers were null when attempting to draw.");
        return;
    }
  
    dc.getView().apply(dc);

    if (dc.getModel().getTessellator()) {
        /** @type {lanyard.SectorGeometryList} */
        var sgl = dc.getModel().getTessellator().tessellate(dc);
        dc.setSurfaceGeometry(sgl);
    }

    /** @type {Array.<lanyard.Layer>} */
    var layers = dc.getLayers();

    for(var i = 0; i < layers.length; i = i + 1) {
        /** @type {lanyard.Layer} */
        var layer = layers[i];

        if(layer) {
            layer.render(dc);
        }
    }

    while (dc.getOrderedRenderables().peek()) {
        dc.getOrderedRenderables().poll().render(dc);
    }

    // Diagnostic displays.
    if (dc.getSurfaceGeometry() && dc.getModel().isShowWireframeExterior() ||
        dc.getModel().isShowWireframeInterior() ||
        dc.getModel().isShowTessellationBoundingVolumes()) {

        /** @type {lanyard.Model} */
        var model = dc.getModel();

        /** @type {Array.<number>} */
        var previousColor = [];

        // FIXME: save the current color.
        //dc.getGL().getFloatv(this.dc.getGL().CURRENT_COLOR, previousColor, 0);

        /** @type {Array.<lanyard.SectorGeometry>} */
        var sgs = dc.getSurfaceGeometry();

        for (var j = 0; j < sgs.length; j = j + 1) {
            if (model.isShowWireframeInterior() || model.isShowWireframeExterior()) {
                sgs[j].renderWireframe(dc, model.isShowWireframeInterior(), model.isShowWireframeExterior());
            }

            if (model.isShowTessellationBoundingVolumes()) {
                // FIXME: set the color for the bounding volume
                //dc.getGL().color(1, 0, 0);

                sgs[j].renderBoundingVolume(dc);
            }
        }

        // FIXME: restore the current color.
        //dc.getGL().color4fv(previousColor, 0);
    }
};

/**
 * This is where picking should be initialized.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.initializePicking = function (dc) {
    this._logger.fine("Initializing picking.");

    // TODO: something
};

/**
 * Perform picking.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.util.Point} pickPoint the pick point.
 */
lanyard.BasicFrameController.prototype.pick = function (dc, pickPoint) {
    this._logger.fine("Performing a pick operation.");

    // TODO: something
};

/**
 * Finalize picking.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.finalizePicking = function (dc) {
    this._logger.fine("Finalizing picking.");

    // TODO: something
};

/**
 * Clear the frame.
 *
 * @private
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.clearFrame = function (dc) {
    this._logger.fine("Clearing the frame.");

    /** @type {lanyard.util.Color} */
    var cc = dc.getClearColor();

    /** @type {*} */
    var gl = dc.getGL();
    
    gl.clearColor(cc.getRed(), cc.getGreen(), cc.getBlue(), cc.getAlpha());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/* EOF */
