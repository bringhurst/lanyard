/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.globes.RenderInfo');

goog.require('lanyard.globes.RectTile');

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
 */
lanyard.globes.RenderInfo = function (density, vertices, texCoords, refCenter, resolution) {
    /** @public */ this.density = density;
    /** @public */ this.vertices = vertices;
    /** @public */ this.texCoords = texCoords;
    /** @public */ this.referenceCenter = refCenter;
    /** @public */ this.indices = lanyard.globes.RectTile.prototype.getIndices(this.density);
    /** @public */ this.resolution = resolution;
};
goog.exportSymbol('lanyard.globes.RenderInfo', lanyard.globes.RenderInfo);

/* EOF */
