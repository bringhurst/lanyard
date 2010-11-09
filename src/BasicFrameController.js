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
    //this._logger.fine("Initializing the frame.");

    dc.getGLSL().startShader();

    dc.loadIdentity("uMVMatrix");
    dc.loadIdentity("uPMatrix");

    dc.getGL().enable(dc.getGL().DEPTH_TEST);
};

/**
 * Finalize the frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.finalizeFrame = function (dc) {
    //this._logger.fine("Finalizing the frame.");

    dc.getGL().flush();
    dc.getGLSL().endShader();
};

/**
 * Draw the actual frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.drawFrame = function (dc) {
    this.clearFrame(dc);

    //this._logger.fine("Drawing the frame.");

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
    } else {
        this._logger.severe("No tessellator was available.");
    }

    /** @type {Array.<lanyard.Layer>} */
    var layers = dc.getLayers();

    //this._logger.fine("The frame controller is rendering " + layers.length + " layers.");

    for(var i = 0; i < layers.length; i = i + 1) {
        /** @type {lanyard.Layer} */
        var layer = layers[i];

        if(layer) {
            this._logger.fine("Rendering layer: " + layer.toString());
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

        //this._logger.fine("Creating diagnostic displays.");

        /** @type {lanyard.Model} */
        var model = dc.getModel();

        /** @type {Array.<number>} */
        var previousColor = [];

        // FIXME: save the current color.
        //dc.getGL().getFloatv(this.dc.getGL().CURRENT_COLOR, previousColor, 0);

        /** @type {lanyard.SectorGeometryList} */
        var sgs = dc.getSurfaceGeometry();

        for (var j = 0; j < sgs.geometryList.length; j = j + 1) {
            if (model.isShowWireframeInterior() || model.isShowWireframeExterior()) {
                //this._logger.fine("Rendering wireframe for surface geometry.");

                sgs.geometryList[j].renderWireframe(
                    dc, model.isShowWireframeInterior(), model.isShowWireframeExterior()
                );
            }

            if (model.isShowTessellationBoundingVolumes()) {
                //this._logger.fine("Displaying tessellation bounding volumes.");

                // FIXME: set the color for the bounding volume
                //dc.getGL().color(1, 0, 0);

                sgs.geometryList[j].renderBoundingVolume(dc);
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
    //this._logger.fine("Finalizing picking.");

    // FIXME: something
};

/**
 * Clear the frame.
 *
 * @private
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.clearFrame = function (dc) {
    //this._logger.fine("Clearing the frame.");

    /** @type {lanyard.util.Color} */
    //var cc = dc.getClearColor();
    var cc = lanyard.util.Color.prototype.BLUE;

    var gl = dc.getGL();
    
    gl.clearColor(cc.getRed(), cc.getGreen(), cc.getBlue(), cc.getAlpha());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/* EOF */
