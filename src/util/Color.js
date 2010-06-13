/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: false, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.util.Color');

/**
 * An object for holding and manipulating color values.
 *
 * @constructor
 * @param {number} red a red value, normalized to [0.0, 1.0].
 * @param {number} green a green value, normalized to [0.0, 1.0].
 * @param {number} blue a blue value, normalized to [0.0, 1.0].
 * @param {number} alpha an alpha value, normalized to [0.0, 1.0].
 * @param {string} hex the html hex value of the color.
 */
lanyard.util.Color = function(red, green, blue, alpha, hex) {
    /**
     * @private
     * @type {number}
     */
    this._red = red;

    /**
     * @private
     * @type {number}
     */
    this._green = green;

    /**
     * @private
     * @type {number}
     */
    this._blue = blue;

    /**
     * @private
     * @type {number}
     */
    this._alpha = alpha;

    /**
     * @private
     * @type {string}
     */
    this._hex = hex;

    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.util.Color');
};

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.BLACK =
    new lanyard.util.Color(0.0, 0.0, 0.0, 1.0, "000000FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.NAVY =
    new lanyard.util.Color(0.0, 0.0, 0.5, 1.0, "000080FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.BLUE =
    new lanyard.util.Color(0.0, 0.0, 1.0, 1.0, "0000FFFF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.GREEN =
    new lanyard.util.Color(0.0, 0.5, 0.0, 1.0, "008000FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.TEAL =
    new lanyard.util.Color(0.0, 0.5, 0.5, 1.0, "008080FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.LIME =
    new lanyard.util.Color(0.0, 1.0, 0.0, 1.0, "00FF00FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.AQUA =
    new lanyard.util.Color(0.0, 1.0, 1.0, 1.0, "00FFFFFF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.MAROON =
    new lanyard.util.Color(0.5, 0.0, 0.0, 1.0, "800000FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.PURPLE =
    new lanyard.util.Color(0.5, 0.0, 0.5, 1.0, "800080FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.OLIVE =
    new lanyard.util.Color(0.5, 0.5, 0.0, 1.0, "808000FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.GRAY =
    new lanyard.util.Color(0.5, 0.5, 0.5, 1.0, "808080FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.SILVER =
    new lanyard.util.Color(0.75, 0.75, 0.75, 1.0, "C0C0C0FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.RED =
    new lanyard.util.Color(1.0, 0.0, 0.0, 1.0, "FF0000FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.FUCHSIA =
    new lanyard.util.Color(1.0, 0.0, 1.0, 1.0, "FF00FFFF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.YELLOW =
    new lanyard.util.Color(1.0, 1.0, 0.0, 1.0, "FFFF00FF");

/**
 * @const
 * @type {lanyard.util.Color}
 */
lanyard.util.Color.prototype.WHITE =
    new lanyard.util.Color(0.0, 0.0, 0.0, 1.0, "FFFFFFFF");

/**
 * Create a {lanyard.util.Color} object from a kml or html color hex string.
 *
 * @param {string} hexString the hex string of the color in RRGGBB or RRGGBBAA format.
 * @return {lanyard.util.Color} the new color object.
 */
lanyard.util.Color.prototype.fromHexString = function (hexString) {
    if (!hexString) {
        this._logger.fine("Attempted to parse a null color hex string.");
        return null;
    }

    // Strip a leading "#" if it exists.
    hexString = hexString.charAt(0) === "#" ? hexString.substring(1) : hexString;

    if(hexString.length !== 6 || hexString !== 8) {
        this._logger.fine(
            "Attempted to parse a color hex string of an incorrect length. " +
            hexString);
        return null;
    }

    var r = parseInt(hexString.substring(0, 2), 16) / 255;
    var g = parseInt(hexString.substring(2, 4), 16) / 255;
    var b = parseInt(hexString.substring(4, 6), 16) / 255;

    // Default to full alpha.
    var a = 1.0;

    if(hexString.length === 8) {
        a = parseInt(hexString.substring(6, 8), 16) / 255;
    }

    return new lanyard.util.Color(r, g, b, a, hexString);
};

/**
 * Convert this color into a four part RGBA vector.
 *
 * @return {Array.<number>} the color as a four part RGBA vector.
 */
lanyard.util.Color.prototype.toVec4 = function () {
    return [this._red, this._green, this._blue, this._alpha];
};

/**
 * Convert this color into a three part RGB vector.
 *
 * @return {Array.<number>} the color as a three part RGB vector.
 */
lanyard.util.Color.prototype.toVec3 = function () {
    return [this._red, this._green, this._blue];
};

/**
 * Find the hex value of this color.
 *
 * @return {string} the string value of this color.
 */
lanyard.util.Color.prototype.toHex = function () {
    return this._hex;
};

/**
 * Return the red value of this color.
 *
 * @return {number} the red value of this color.
 */
lanyard.util.Color.prototype.getRed = function () {
    return this._red;
};

/**
 * Return the green value of this color.
 *
 * @return {number} the green value of this color.
 */
lanyard.util.Color.prototype.getGreen = function () {
    return this._green;
};

/**
 * Return the blue value of this color.
 *
 * @return {number} the blue value of this color.
 */
lanyard.util.Color.prototype.getBlue = function () {
    return this._blue;
};

/**
 * Return the alpha value of this color.
 *
 * @return {number} the alpha value of this color.
 */
lanyard.util.Color.prototype.getAlpha = function () {
    return this._alpha;
};

/* EOF */
