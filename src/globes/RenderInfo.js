/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.globes.RenderInfo');

/**
 * Render info for tessellation.
 *
 * @constructor
 * @this {lanyard.globes.RenderInfo}
 * @param {number} density
 * @param {Array.<number>} vertices
 * @param {Array.<number>} texCoords
 * @param {lanyard.geom.Point} refCenter
 * @param {number} resolution
 * @param {lanyard.globes.RectTile} tile the tile this info is for.
 */
lanyard.globes.RenderInfo = function (density, vertices, texCoords, refCenter, resolution, tile) {
    /** @public */ this.density = density;
    /** @public */ this.vertices = vertices;
    /** @public */ this.texCoords = texCoords;
    /** @public */ this.referenceCenter = refCenter;
    /** @public */ this.indices = tile.getIndices(this.density);
    /** @public */ this.resolution = resolution;
};
goog.exportSymbol('lanyard.globes.RenderInfo', lanyard.globes.RenderInfo);

/* EOF */
