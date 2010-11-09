/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.layers.earth.BMNGOneImage');

goog.require('lanyard.render.SurfaceImage');
goog.require('lanyard.layers.RenderableLayer');

/**
 * An layer to provide a non-tiled blue marble image to display on the globe.
 *
 * @constructor
 * @extends {lanyard.layers.RenderableLayer}
 * @this {lanyard.layers.earth.BMNGOneImage}
 */
lanyard.layers.earth.BMNGOneImage = function () {
    lanyard.layers.RenderableLayer.call(this, null);

    /** @private */
    this._logger = goog.debug.Logger.getLogger('lanyard.layers.earth.BMNGOneImage');

    //this._logger.fine("Called BMNGOneImage constructor");

    // This name will appear to the user in the layer list.
    this.setName("The Blue Marble, single image");

    //this._logger.fine("Adding the surface image renderable.");
    this.addRenderable(
        new lanyard.render.SurfaceImage(
            "images/BMNG_world.topo.bathy.200405.3.2048x1024.jpg",
            lanyard.geom.Sector.prototype.FULL_SPHERE,
            this)
    );

    // Disable picking for the layer because it covers the full sphere and will override a terrain pick.
    //this.setPickEnabled(false);
};
goog.inherits(lanyard.layers.earth.BMNGOneImage, lanyard.layers.RenderableLayer);

/**
 * A description of this object.
 *
 * @return {String} a description of this object.
 */
lanyard.layers.earth.BMNGOneImage.prototype.toString = function () {
    return "A BMNGOneImage object.";
};

/* EOF */
