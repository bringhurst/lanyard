/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.Renderable');

/**
 * An interface for renderables.
 *
 * @interface
 */
lanyard.Renderable = function () {};

/**
 * Causes this Renderable to render itself using the DrawContext provided. The
 * DrawContext provides the elevation model, openGl instance, globe and other
 * information required for drawing.
 *
 * @param {lanyard.DrawContext} dc the DrawContext to be used.
 */
lanyard.Renderable.prototype.render = function (dc) {};

/* EOF */
