/**
 * Create a new color object.
 *
 * @constructor
 * @param {number} red a red value, normalized to [0.0, 1.0].
 * @param {number} green a green value, normalized to [0.0, 1.0].
 * @param {number} blue a blue value, normalized to [0.0, 1.0].
 * @param {number} alpha an alpha value, normalized to [0.0, 1.0].
 */
Color = function(red, green, blue, alpha, hex, name) {
    this._red = red;
    this._green = green;
    this._blue = blue;
    this._alpha = alpha;
    this._hex = hex;
    this._name = name;
};

/**
 * @const
 */
Color.prototype.ENGLISH_STRINGS = {
    "black" : {
        "hex" : "000000",
        "red": 0.0,
        "green" : 0.0,
        "blue" : 0.0,
        "alpha" : 1.0
    },

    "navy" : {
        "hex" : "000080",
        "alpha" : 1.0
    },

    "blue" : {
        "hex" : "0000FF",
        "alpha" : 1.0
    },

    "green" : {
        "hex" : "008000",
        "alpha" : 1.0
    },

    "teal" : {
        "hex" : "008080",
        "alpha" : 1.0
    },

    "lime" : {
        "hex" : "00FF00",
        "alpha" : 1.0
    },

    "aqua" : {
        "hex" : "00FFFF",
        "alpha" : 1.0
    },

    "maroon" : {
        "hex" : "800000",
        "alpha" : 1.0
    },

    "purple" : {
        "hex" : "800080",
        "alpha" : 1.0
    },

    "olive" : {
        "hex" : "808000",
        "alpha" : 1.0
    },

    "gray" : {
        "hex" : "808080",
        "alpha" : 1.0
    },

    "silver" : {
        "hex" : "C0C0C0",
        "alpha" : 1.0
    },

    "red" : {
        "hex" : "FF0000",
        "alpha" : 1.0
    },

    "fuchsia" : {
        "hex" : "FF00FF",
        "alpha" : 1.0
    },

    "yellow" : {
        "hex" : "FFFF00",
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

Color.prototype.fromEnglishString = function (name) {
    if (Color.prototype.ENGLISH_STRINGS[name]) {
        this._red = Color.prototype.ENGLISH_STRINGS[name].red;
        this._green = Color.prototype.ENGLISH_STRINGS[name].green;
        this._blue = Color.prototype.ENGLISH_STRINGS[name].blue;
        this._alpha = Color.prototype.ENGLISH_STRINGS[name].alpha;
        this._hex = Color.prototype.ENGLISH_STRINGS[name].hex;
        this._name = name;
    } else {
        console.log("English color name is unknown.");
    }
};

Color.prototype.fromHexString = function (hexString) {
    if (!hexString) {
        return null;
    }

    // Remove the "#" if it exists.
    if ("#" === hexString.charAt(0)) {
        hexString = hexString(1);
    }

    // The return value.
    var c = null;

    if (hexString.length === 6) {
        // handle an html color
        c = new Color(
            parseInt(hexString.substring(0, 1), 16) / 255,
            parseInt(hexString.substring(2, 3), 16) / 255,
            parseInt(hexString.substring(4, 5), 16) / 255,
            1.0,
            hexString,
            null
        );
    } else if (hexString.length === 8) {
        // handle a KML color (includes alpha)
        c = new Color(
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

Color.prototype.toVec4 = function () {
    return [this._red, this._green, this._blue, this._alpha];
};

Color.prototype.toVec3 = function () {
    return [this._red, this._green, this._blue];
};

Color.prototype.toHex = function () {
    return this._hex;
};

/* EOF */
