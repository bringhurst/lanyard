/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.Layer');

/**
 * An interface for layers.
 *
 * @interface
 */
lanyard.Layer = function () {};

/**
 * Accessor to check if this layer is enabled.
 *
 * @return {boolean} if this layer is enabled or not.
 */
lanyard.Layer.prototype.isEnabled = function () {};

/**
 * Mutator to set if this layer is enabled or not.
 *
 * @param {boolean} enabled if this layer should be enabled or not.
 */
lanyard.Layer.prototype.setEnabled = function (enabled) {};

/**
 * Accessor for this layer's name.
 *
 * @return {string} this layer's name.
 */
lanyard.Layer.prototype.getName = function () {};

/**
 * Mutator for this layer's name.
 *
 * @param {string} name this layer's name.
 */
lanyard.Layer.prototype.setName = function (name) {};

/**
 * Accessor for this layer's opacity.
 *
 * @return {number} this layer's opacity.
 */
lanyard.Layer.prototype.getOpacity = function () {};

/**
 * Mutator for this layer's opacity.
 *
 * @param {number} opacity the opacity to set this layer's opacity to.
 */
lanyard.Layer.prototype.setOpacity = function (opacity) {};

/**
 * Accessor to see if this layer has picking turned on.
 *
 * @return {boolean} if picking on this layer is enabled.
 */
lanyard.Layer.prototype.isPickEnabled = function () {};

/**
 * Mutator to set if picking should be enabled for this layer.
 *
 * @param {boolean} isPickable if this layer is pickable or not.
 */
lanyard.Layer.prototype.setPickEnabled = function (isPickable) {};

/**
 * A way to render this layer to the draw context.
 *
 * @param {lanyard.DrawContext} dc the draw context to render to.
 */
lanyard.Layer.prototype.render = function (dc) {};

/**
 * A way to handle pick events.
 *
 * @param {lanyard.DrawContext} dc the draw context where the pick event takes place.
 * @param {number} mouseX the x value of the pick event.
 * @param {number} mouseY the y value of the pick event.
 */
lanyard.Layer.prototype.pick = function (dc, mouseX, mouseY) {};

/* EOF */
