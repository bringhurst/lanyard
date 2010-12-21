/*global goog, lanyard */
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

goog.provide('lanyard.layers.earth.BMNGOneImage');

goog.require('lanyard.layers.RenderableLayer');
goog.require('lanyard.render.SurfaceImage');

/**
 * An layer to provide a non-tiled blue marble image to display on the globe.
 *
 * @constructor
 * @extends {lanyard.layers.RenderableLayer}
 * @this {lanyard.layers.earth.BMNGOneImage}
 */
lanyard.layers.earth.BMNGOneImage = function() {
    lanyard.layers.RenderableLayer.call(this, null);

    /** @private */
    this._logger = goog.debug.Logger.getLogger('lanyard.layers.earth.BMNGOneImage');

    //this._logger.fine("Called BMNGOneImage constructor");

    // This name will appear to the user in the layer list.
    this.setName('The Blue Marble, single image');

    //this._logger.fine("Adding the surface image renderable.");
    this.addRenderable(
        new lanyard.render.SurfaceImage(
            'images/bmng.world.topo.512.256.gif',
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
 * @return {string} a description of this object.
 */
lanyard.layers.earth.BMNGOneImage.prototype.toString = function() {
    return 'A BMNGOneImage object.';
};

/* EOF */
