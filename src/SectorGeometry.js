/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.SectorGeometry');

/**
 * An interface for a sector geometry.
 *
 * @interface
 * @extends {lanyard.Renderable}
 */
lanyard.SectorGeometry = function () {};

/**
 * Extent accessor.
 *
 * @return {lanyard.geom.Extent} the extent geometry.
 */
lanyard.SectorGeometry.prototype.getExtent = function () {};

/**
 * Sector accessor.
 *
 * @return {lanyard.geom.Sector} the sector geometry.
 */
lanyard.SectorGeometry.prototype.getSector = function () {};

/**
 * Obtain the surface point at the specified location.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the position.
 * @param {lanyard.geom.Angle} longitude the longitude of the position.
 * @param {number} metersOffset the meters offset.
 * @return {lanyard.geom.Point} the surface point.
 */
lanyard.SectorGeometry.prototype.getSurfacePoint = function (latitude, longitude, metersOffset) {};

/**
 * Perform a picking operation on this sector geometry.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.util.Point} pickPoint the picking point.
 */
lanyard.SectorGeometry.prototype.pick = function (dc, pickPoint) {};

/**
 * Render multi-texture.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {number} numTextureUnits the number of texture units.
 */
lanyard.SectorGeometry.prototype.renderMultiTexture = function (dc, numTextureUnits) {};

/**
 * Render the wireframe.
 *
 * @param {lanyard.DrawContext} dc the draw context to render to.
 * @param {boolean} interior render the interior wireframe.
 * @param {boolean} exterior render the exterior wireframe.
 */
lanyard.SectorGeometry.prototype.renderWireframe = function (dc, interior, exterior) {};

/**
 * Render the bounding volume.
 *
 * @param {lanyard.DrawContext} the draw context.
 */
lanyard.SectorGeometry.prototype.renderBoundingVolume = function (dc) {};

/* EOF */
