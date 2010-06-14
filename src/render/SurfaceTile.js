/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.render.SurfaceTile');

/**
 * Provides an interface for surface tiles.
 *
 * @interface
 */
lanyard.render.SurfaceTile = function () {};

/**
 * Bind the tile.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {boolean} true if the bind was successful, false otherwise.
 */
lanyard.render.SurfaceTile.prototype.bind = function (dc) {};

/**
 * Apply the internal transform.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.render.SurfaceTile.prototype.applyInternalTransform = function (dc) {};

/**
 * Get this tile's sector.
 *
 * @return {lanyard.geom.Sector} this tile's sector.
 */
lanyard.render.SurfaceTile.prototype.getSector = function () {};

/**
 * Get the extent of this tile.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {lanyard.geom.Extent} the extent of the tile.
 */
lanyard.render.SurfaceTile.prototype.getExtent = function (dc) {};

/* EOF */
