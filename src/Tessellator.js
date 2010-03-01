/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.Tessellator');

/**
 * An interface for tessellators.
 *
 * @interface
 */
lanyard.Tessellator = function () {};

/**
 * Perform tessellation and return the sector geometries.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {lanyard.SectorGeometryList} the list of sector geometries.
 */
lanyard.Tessellator.prototype.tessellate = function (dc) {};

/* EOF */
