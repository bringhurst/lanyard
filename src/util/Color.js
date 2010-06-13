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
 */
lanyard.util.Color = function(red, green, blue, alpha, hex, name) {
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

    /**
     * @private
     * @type {string}
     */
    this._name = name;

    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.util.Color');
};

/**
 * @const
 */
lanyard.util.Color.prototype.ENGLISH_STRINGS = {
    "black" : {
        "hex" : "000000",
        "red": 0.0,
        "green" : 0.0,
        "blue" : 0.0,
        "alpha" : 1.0
    },

    "navy" : {
        "hex" : "000080",
        "red" : 0.0,
        "green" : 0.0,
        "blue" : 0.5,
        "alpha" : 1.0
    },

    "blue" : {
        "hex" : "0000FF",
        "red" : 0.0,
        "green" : 0.0,
        "blue" : 1.0,
        "alpha" : 1.0
    },

    "green" : {
        "hex" : "008000",
        "red" : 0.0,
        "green" : 0.5,
        "blue" : 0.0,
        "alpha" : 1.0
    },

    "teal" : {
        "hex" : "008080",
        "red" : 0.0,
        "green" : 0.5,
        "blue" : 0.5,
        "alpha" : 1.0
    },

    "lime" : {
        "hex" : "00FF00",
        "red" : 0.0,
        "green" : 1.0,
        "blue" : 0.0,
        "alpha" : 1.0
    },

    "aqua" : {
        "hex" : "00FFFF",
        "red" : 0.0,
        "green" : 1.0,
        "blue" : 1.0,
        "alpha" : 1.0
    },

    "maroon" : {
        "hex" : "800000",
        "red" : 0.5,
        "green" : 0.0,
        "blue" : 0.0,
        "alpha" : 1.0
    },

    "purple" : {
        "hex" : "800080",
        "red" : 0.5,
        "green" : 0.0,
        "blue" : 0.5,
        "alpha" : 1.0
    },

    "olive" : {
        "hex" : "808000",
        "red" : 0.5,
        "green" : 0.5,
        "blue" : 0.0,
        "alpha" : 1.0
    },

    "gray" : {
        "hex" : "808080",
        "red" : 0.5,
        "green" : 0.5,
        "blue" : 0.5,
        "alpha" : 1.0
    },

    "silver" : {
        "hex" : "C0C0C0",
        "red" : 0.75,
        "green" : 0.75,
        "blue" : 0.75,
        "alpha" : 1.0
    },

    "red" : {
        "hex" : "FF0000",
        "red" : 1.0,
        "green" : 0.0,
        "blue" : 0.0,
        "alpha" : 1.0
    },

    "fuchsia" : {
        "hex" : "FF00FF",
        "red" : 1.0,
        "green" : 0.0,
        "blue" : 1.0,
        "alpha" : 1.0
    },

    "yellow" : {
        "hex" : "FFFF00",
        "red" : 1.0,
        "green" : 1.0,
        "blue" : 0.0,
        "alpha" : 1.0
    },

    "white" : {
        "hex" : "FFFFFF",
        "red": 0.0,
        "green" : 0.0,
        "blue" : 0.0,
        "alpha" : 1.0
    }
};

/**
 * Convert an english color name into a {lanyard.util.Color} object.
 *
 * @param {string} name the english name of the color.
 * @return {lanyard.util.Color} the color from the name, or null if the name was not recognized.
 */
lanyard.util.Color.prototype.fromEnglishString = function (name) {
    if (lanyard.util.Color.prototype.ENGLISH_STRINGS[name]) {
        this._red = lanyard.util.Color.prototype.ENGLISH_STRINGS[name].red;
        this._green = lanyard.util.Color.prototype.ENGLISH_STRINGS[name].green;
        this._blue = lanyard.util.Color.prototype.ENGLISH_STRINGS[name].blue;
        this._alpha = lanyard.util.Color.prototype.ENGLISH_STRINGS[name].alpha;
        this._hex = lanyard.util.Color.prototype.ENGLISH_STRINGS[name].hex;
        this._name = name;
    } else {
        this._logger.severe("English color name is unknown.");
    }
};

/**
 * Create a {lanyard.util.Color} object from a kml or html color hex string.
 *
 * @param {string} hexString the hex string of the color in RRGGBB or RRGGBBAA format.
 * @return {lanyard.util.Color} the new color object.
 */
lanyard.util.Color.prototype.fromHexString = function (hexString) {
    if (!hexString) {
        return null;
    }

    // Remove the "#" if it exists.
    if ("#" === hexString.charAt(0)) {
        hexString = hexString.substr(1);
    }

    /**
     * The return value.
     * @type {lanyard.util.Color}
     */
    var c = null;

    if (hexString.length === 6) {
        // handle an html color
        c = new lanyard.util.Color(
            parseInt(hexString.substring(0, 1), 16) / 255,
            parseInt(hexString.substring(2, 3), 16) / 255,
            parseInt(hexString.substring(4, 5), 16) / 255,
            1.0,
            hexString,
            null
        );
    } else if (hexString.length === 8) {
        // handle a KML color (includes alpha)
        c = new lanyard.util.Color(
            parseInt(hexString.substring(0, 1), 16) / 255,
            parseInt(hexString.substring(2, 3), 16) / 255,
            parseInt(hexString.substring(4, 5), 16) / 255,
            parseInt(hexString.substring(6, 7), 16) / 255,
            hexString,
            null
        );
    }
 
    return c;
};

/**
 * Creates an sRGB color with the specified combined RGBA value consisting
 * of the alpha component in bits 24-31, the red component in bits 16-23,
 * the green component in bits 8-15, and the blue component in bits 0-7.
 *
 * @param {number} rgba the color data.
 * @param {boolean} hasAlpha specify if the color has an alpha value.
 */
lanyard.util.Color.prototype.fromRGBA = function (rgba, hasAlpha) {
    /** @type {lanyard.util.Color} */
    var c = new lanyard.util.Color(
        ((rgba ^ 0x0000FF00) >>> 8) / 255, // red
        ((rgba ^ 0x00FF0000) >>> 16) / 255, // green
        (rgba >>> 24) / 255, // blue
        (hasAlpha ? rgba ^ 0x000000FF : 0) / 255, // alpha
        null,
        null
    );
    return c;
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

/**
 * Return the sRGB value of this color. Bits 24-31 are alpha, 16-23 are red,
 * 8-15 are green, 0-7 are blue. Since javascript operands are converted from
 * floating point to integers and back when bitwise operations are used, the
 * results from this function may not be consistant.
 *
 * @return {number} the sRGB value of this color.
 */
lanyard.util.Color.prototype.getRGB = function () {
    return 0 ^ 0 | this._alpha | (this._red << 8) | (this._green << 16) | (this._blue << 24);
};

/* EOF */
