/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: false, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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

goog.provide('lanyard.BasicFrameController');

goog.require('goog.debug.Logger');

goog.require('lanyard.util.Point');

/**
 * A frame controller implementation.
 *
 * @constructor
 * @implements {lanyard.FrameController}
 */
lanyard.BasicFrameController = function() {
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.BasicFrameController');
};

/**
 * Initialize the frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.initializeFrame = function(dc)  {
    //this._logger.fine("Initializing the frame.");

    // Setup the shaders
    dc.loadShaders('shader-vs', 'shader-fs');
    dc.setupShaders();

    // Setup the canvas
    dc.getGL().clearDepth(1.0);
    dc.getGL().enable(dc.getGL().DEPTH_TEST);
    dc.getGL().enable(dc.getGL().CULL_FACE);
    dc.getGL().depthFunc(dc.getGL().LEQUAL);

    // Setup state matrices for tessellation
    dc.loadIdentity('uMVMatrix');
    dc.loadIdentity('uPMatrix');
};

/**
 * Finalize the frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.finalizeFrame = function(dc) {
    //this._logger.fine("Finalizing the frame.");

    // Note that in WebGL, a flush is implied.

    //dc.getGLSL().endShader();
};

/**
 * Draw the actual frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.drawFrame = function(dc) {
    this.clearFrame(dc);

    //this._logger.fine("Drawing the frame.");

    // Perform some basic sanity checks.

    if (!dc.getView()) {
        this._logger.severe('The view was null when attempting to draw.');
        return;
    }

    if (!dc.getModel()) {
        this._logger.severe('The model was null when attempting to draw.');
        return;
    }

    if (!dc.getLayers()) {
        this._logger.severe('The layers were null when attempting to draw.');
        return;
    }

    dc.getView().apply(dc);

    if (dc.getModel().getTessellator()) {
        /** @type {lanyard.SectorGeometryList} */
        var sgl = dc.getModel().getTessellator().tessellate(dc);

        dc.setSurfaceGeometry(sgl);
    } else {
        this._logger.severe('No tessellator was available.');
    }

    /** @type {Array.<lanyard.Layer>} */
    var layers = dc.getLayers();

    //this._logger.fine("The frame controller is rendering " + layers.length + " layers.");

    for (var i = 0; i < layers.length; i = i + 1) {
        /** @type {lanyard.Layer} */
        var layer = layers[i];

        if (layer) {
            //this._logger.fine("Rendering layer: " + layer.toString());
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

        this._logger.fine('Creating diagnostic displays.');

        /** @type {lanyard.Model} */
        var model = dc.getModel();

        /** @type {Array.<number>} */
        var previousColor = [];

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
    }
};

/**
 * This is where picking should be initialized.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.initializePicking = function(dc) {
    this._logger.fine('Initializing picking.');

    // TODO: something
};

/**
 * Perform picking.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.util.Point} pickPoint the pick point.
 */
lanyard.BasicFrameController.prototype.pick = function(dc, pickPoint) {
    this._logger.fine('Performing a pick operation.');

    // TODO: something
};

/**
 * Finalize picking.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.finalizePicking = function(dc) {
    //this._logger.fine("Finalizing picking.");

    // FIXME: something
};

/**
 * Clear the frame.
 *
 * @private
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.clearFrame = function(dc) {
    //this._logger.fine("Clearing the frame.");

    /** @type {lanyard.util.Color} */
    //var cc = dc.getClearColor();
    var cc = lanyard.util.Color.prototype.CLEAR;

    var gl = dc.getGL();

    gl.clearColor(cc.getRed(), cc.getGreen(), cc.getBlue(), cc.getAlpha());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/* EOF */
