/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.layers.AbstractLayer');

/**
 * An abstract layer to provide common functionality for layers.
 *
 * @constructor
 * @implements {lanyard.Layer}
 * @this {lanyard.layers.AbstractLayer}
 */
lanyard.layers.AbstractLayer = function () {
    /**
     * @private
     * @type {boolean}
     */
    this.enabled = true;

    /**
     * @private
     * @type {boolean}
     */
    this.pickable = true;

    /**
     * @private
     * @type {number}
     */
    this.opacity = 1.0;

    /**
     * @private
     * @type {number}
     */
    this.minActiveAltitude = Number.MIN_VALUE;

    /**
     * @private
     * @type {number}
     */
    this.maxActiveAltitude = Number.MAX_VALUE;

    /**
     * @private
     * @type {string}
     */
    this.displayName = "Untitled Layer";
};
goog.exportSymbol('lanyard.layers.AbstractLayer', lanyard.layers.AbstractLayer);

/**
 * Determine if the layer is enabled or not.
 *
 * @this {lanyard.layers.AbstractLayer}
 * @return {boolean} if this layer is enabled or not.
 */
lanyard.layers.AbstractLayer.prototype.isEnabled = function () {
    return this.enabled;
};

/**
 * Determine if picking is enabled on this layer.
 *
 * @this {lanyard.layers.AbstractLayer}
 * @return {boolean} if the layer is pick enabled or not.
 */
lanyard.layers.AbstractLayer.prototype.isPickEnabled = function () {
    return this.pickable;
};

/**
 * Set picking to enabled for this layer.
 *
 * @this {lanyard.layers.AbstractLayer}
 * @param {boolean} pickable if this layer should be pickable or not.
 */
lanyard.layers.AbstractLayer.prototype.setPickEnabled = function (pickable) {
    this.pickable = pickable;
};

/**
 * Set this layer to an enabled state.
 *
 * @this {lanyard.layers.AbstractLayer}
 * @param {boolean} enabled if this layer should be enabled or not.
 */
lanyard.layers.AbstractLayer.prototype.setEnabled = function (enabled) {
    this.enabled = enabled;
};

/**
 * Get the name of this layer.
 *
 * @return {string} the name of this layer.
 */
lanyard.layers.AbstractLayer.prototype.getName = function () {
    return this.myName();
};

/**
 * Mutator for the name of this layer.
 *
 * @this {lanyard.layers.AbstractLayer}
 * @param {string} name the new name of this layer.
 */
lanyard.layers.AbstractLayer.prototype.setName = function (name) {
    this.displayName = name;
};

/**
 * Find an return a string representation of this layer.
 *
 * @return {string} a string representation of this layer.
 */
lanyard.layers.AbstractLayer.prototype.toString = function () {
    return this.myName();
};

/**
 * Get the name of this layer.
 *
 * @return {string} the display name of this layer.
 */
lanyard.layers.AbstractLayer.prototype.myName = function () {
    return this.displayName;
};

/**
 * Accessor for the opacity of this layer.
 *
 * @return {number} the opacity of this layer.
 */
lanyard.layers.AbstractLayer.prototype.getOpacity = function () {
    return this.opacity;
};

/**
 * Set the opacity of this layer.
 *
 * @param {number} opacity the new opacity of this layer.
 */
lanyard.layers.AbstractLayer.prototype.setOpacity = function (opacity) {
    this.opacity = opacity;
};

/**
 * Determine the minimum active altitude of this layer.
 *
 * @return {number} the minimum active altitude of this layer.
 */
lanyard.layers.AbstractLayer.prototype.getMinActiveAltitude = function () {
    return this.minActiveAltitude;
};

/**
 * Set the minimum active altitude of this layer.
 *
 * @param {number} minActiveAltitude the minimum active altitude of this layer.
 */
lanyard.layers.AbstractLayer.prototype.setMinActiveAltitude = function (minActiveAltitude) {
    this.minActiveAltitude = minActiveAltitude;
};

/**
 * Accessor for the maximum active altitude for this layer.
 *
 * @return {number} the maximum active altitude for this layer.
 */
lanyard.layers.AbstractLayer.prototype.getMaxActiveAltitude = function () {
    return this.maxActiveAltitude;
};

/**
 * Set the maximum active altitude for this layer.
 *
 * @param {number} maxActiveAltitude the maximum active altitude for this layer.
 */
lanyard.layers.AbstractLayer.prototype.setMaxActiveAltitude = function (maxActiveAltitude) {
    this.maxActiveAltitude = maxActiveAltitude;
};

/**
 * Indicates whether the layer is in the view. The method implemented here is
 * a default indicating the layer is in view. Subclasses able to determine
 * their presence in the view should override this implementation.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {boolean} true if the layer is in the view, false otherwise.
 */
lanyard.layers.AbstractLayer.prototype.isLayerInView = function (dc) {
    return true;
};

/**
 * Indicates whether the layer is active based on arbitrary criteria. The method
 * implemented here is a default indicating the layer is active if the current
 * altitude is within the layer's min and max active altitudes. Subclasses able
 * to consider more criteria should override this implementation.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {boolean} true if the layer is active, false otherwise.
 */
lanyard.layers.AbstractLayer.prototype.isLayerActive = function (dc) {
    /** @type {number} */
    var altitude = dc.getView().getAltitude();

    /** @type {boolean} */
    var isActive = altitude >= this.minActiveAltitude && altitude <= this.maxActiveAltitude;

    return isActive;
};

/**
 * Render this layer.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.layers.AbstractLayer.prototype.render = function (dc) {
    if (!this.enabled) {
        return;
    }

    if (!this.isLayerActive(dc)) {
        return;
    }

    if (!this.isLayerInView(dc)) {
        return;
    }

    this.doRender(dc);
};

/**
 * Do picking on this layer based on the specified point.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {number} mouseX the X position of the mouse.
 * @param {number} mouseY the Y position of the mouse.
 */
lanyard.layers.AbstractLayer.prototype.pick = function (dc, mouseX, mouseY) {
    if (!this.enabled) {
        return;
    }

    if (!this.isLayerActive(dc)) {
        return;
    }

    if (!this.isLayerInView(dc)) {
        return;
    }

    this.doPick(dc, mouseX, mouseY);
};

/**
 * Do picking on this layer based on the specified point.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {number} mouseX the X position of the mouse.
 * @param {number} mouseY the Y position of the mouse.
 */
lanyard.layers.AbstractLayer.prototype.doPick = function (dc, mouseX, mouseY) {
    // any state that could change the color needs to be disabled, such as GL_TEXTURE, GL_LIGHTING or GL_FOG.
    // re-draw with unique colors
    // store the object info in the selectable objects table
    // read the color under the coursor
    // use the color code as a key to retrieve a selected object from the selectable objects table
    // create an instance of the PickedObject and add to the dc via the dc.addPickedObject() method
};

/* EOF */
