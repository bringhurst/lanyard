/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.layers.earth.BMNGOneImage');

/**
 * An layer to provide a non-tiled blue marble image to display on the globe.
 *
 * @constructor
 * @extends {lanyard.layers.RenderableLayer}
 * @this {lanyard.layers.earth.BMNGOneImage}
 */
lanyard.layers.earth.BMNGOneImage = function () {
    /** @type {String} */
    this.path = "./blueMarbleOne.png";

    this.setName("BlueMarbleOneLayer");

    this.addRenderable(new lanyard.render.SurfaceImage(
        this.path,
        lanyard.geom.Sector.prototype.FULL_SPHERE)
    );

    // Disable picking for the layer because it covers the full sphere and will override a terrain pick.
    this.setPickEnabled(false);
};
goog.object.extend(lanyard.layers.earth.BMNGOneImage, lanyard.layers.RenderableLayer);

/**
 * A description of this object.
 *
 * @return {String} a description of this object.
 */
lanyard.layers.earth.BMNGOneImage.prototype.toString = function () {
    return "A BMNGOneImage object.";
};

/* EOF */
