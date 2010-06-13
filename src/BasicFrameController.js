/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.BasicFrameController');

/**
 * A frame controller implementation.
 *
 * @constructor
 * @implements {lanyard.FrameController}
 */
lanyard.BasicFrameController = function () {};

/**
 * Initialize the frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.initializeFrame = function (dc)  {
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
/*
    GL gl = dc.getGL();

    gl.glMatrixMode(GL.GL_MODELVIEW);
    gl.glPopMatrix();

    gl.glMatrixMode(GL.GL_PROJECTION);
    gl.glPopMatrix();

    gl.glPopAttrib();

    gl.glFlush();

    checkGLErrors(dc);
*/
};

/**
 * Called to check for openGL errors. This method includes a "round-trip" between the application and renderer,
 * which is slow. Therefore, this method is excluded from the "normal" render pass. It is here as a matter of
 * convenience to developers, and is not part of the API.
 *
 * @param {lanyard.DrawContext} dc the relevant DrawContext.
 */
lanyard.BasicFrameController.prototype.checkGLErrors = function (dc) {
/*
    GL gl = dc.getGL();
    int err = gl.glGetError();
    if (err != GL.GL_NO_ERROR) {
        String msg = dc.getGLU().gluErrorString(err);
        msg += err;
        log(Level.FINE, msg);
    }
*/
};

/**
 * Draw the actual frame.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.drawFrame = function (dc) {
/*
    this.clearFrame(dc);

    if (dc.getView() == null || dc.getModel() == null || dc.getLayers() == null) {
        return;
    }

    dc.getView().apply(dc);

    if (dc.getModel().getTessellator() != null) {
        SectorGeometryList sgl = dc.getModel().getTessellator().tessellate(dc);
        dc.setSurfaceGeometry(sgl);
    }

    gov.nasa.worldwind.LayerList layers = dc.getLayers();
    Iterator<Layer> iter = layers.iterator();

    while (iter.hasNext()) {
        Layer layer = null;
        layer = iter.next();

        if (layer != null) {
            layer.render(dc);
        }
    }

    while (dc.getOrderedRenderables().peek() != null) {
        dc.getOrderedRenderables().poll().render(dc);
    }

    // Diagnostic displays.
    if (dc.getSurfaceGeometry() != null
        && dc.getModel().isShowWireframeExterior()
        || dc.getModel().isShowWireframeInterior()
        || dc.getModel().isShowTessellationBoundingVolumes()) {

        Model model = dc.getModel();

        float[] previousColor = new float[4];
        dc.getGL().glGetFloatv(GL.GL_CURRENT_COLOR, previousColor, 0);

        for (SectorGeometry sg : dc.getSurfaceGeometry()) {
            if (model.isShowWireframeInterior() || model.isShowWireframeExterior()) {
                sg.renderWireframe(dc, model.isShowWireframeInterior(), model.isShowWireframeExterior());
            }

            if (model.isShowTessellationBoundingVolumes()) {
                dc.getGL().glColor3d(1, 0, 0);
                sg.renderBoundingVolume(dc);
            }
        }
            
        dc.getGL().glColor4fv(previousColor, 0);
    }
*/
};

/**
 * This is where picking should be initialized.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.initializePicking = function (dc) {
    // TODO: something
};

/**
 * Perform picking.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.util.Point} pickPoint the pick point.
 */
lanyard.BasicFrameController.prototype.pick = function (dc, pickPoint) {
    // TODO: something
};

/**
 * Finalize picking.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.finalizePicking = function (dc) {
    // TODO: something
};

/**
 * Clear the frame.
 *
 * @private
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.BasicFrameController.prototype.clearFrame = function (dc) {
/*
    var cc = dc.getClearColor();
    dc.getGL().glClearColor(cc.getRed(), cc.getGreen(), cc.getBlue(), cc.getAlpha());
    dc.getGL().glClear(GL.GL_COLOR_BUFFER_BIT | GL.GL_DEPTH_BUFFER_BIT);
*/
};

/* EOF */
