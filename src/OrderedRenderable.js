/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.OrderedRenderable');

/**
 * An interface for an ordered renderable.
 *
 * @interface
 */
lanyard.OrderedRenderable = function () {};

/**
 * Causes this OrderedRenderable to render itself using the DrawContext provided. The
 * DrawContext provides the elevation model, openGl instance, globe and other
 * information required for drawing.
 *
 * @param {lanyard.DrawContext} dc the DrawContext to be used.
 */
lanyard.OrderedRenderable.prototype.render = function (dc) {};

/**
 * Get this distance from this renderable to the eye.
 *
 * @return {number} the distance from the eye.
 */
lanyard.OrderedRenderable.prototype.getDistanceFromEye = function () {};

/* EOF */
