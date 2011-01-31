/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/**
 * Lanyard is Copyright 2010 Jonathan Bringhurst.
 *
 * This file is part of Lanyard.
 *
 * Lanyard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Lanyard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Lanyard.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Portions of Lanyard which do not constitute a "Larger Work" may be licensed
 * under the NASA OPEN SOURCE AGREEMENT VERSION 1.3.
 *
 * See http://worldwind.arc.nasa.gov/ for further information about NASA World Wind.
 */

/**
 * @fileoverview Externs for typed arrays.
 * @externs
 */

/**
 * @constructor
 * @param {number} length
 */
function ArrayBuffer(length) {}

/**
 * @constructor
 * @param {*} args
 */
function ArrayBufferView(args) {}

/**
 * @return {ArrayBuffer}
 */
ArrayBufferView.prototype.buffer = function() {};

/**
 * @return {number}
 */
ArrayBufferView.prototype.byteOffset = function() {};

/**
 * @return {number}
 */
ArrayBufferView.prototype.byteLength = function() {};

/**
 * @constructor
 * @extends {ArrayBufferView}
 * @param {*} args
 */
function Int8Array(args) {}

/**
 * @const
 * @type {number}
 */
Int8Array.prototype.BYTES_PER_ELEMENT;

/**
 * @type {number}
 */
Int8Array.prototype.length;

/**
 * @param {number} index
 * @return {number}
 */
Int8Array.prototype.get = function(index) {};

/**
 * @param {number|Array.<*>} x
 * @param {number} value
 * @return {undefined}
 */
Int8Array.prototype.set = function(x, value) {};

/**
 * @param {number} start
 * @param {number} end
 * @return {Array.<*>}
 */
Int8Array.prototype.slice = function(start, end) {};

/**
 * @constructor
 * @extends {ArrayBufferView}
 * @param {*} args
 */
function Int16Array(args) {}

/**
 * @const
 * @type {number}
 */
Int16Array.prototype.BYTES_PER_ELEMENT;

/**
 * @type {number}
 */
Int16Array.prototype.length;

/**
 * @param {number} index
 * @return {number}
 */
Int16Array.prototype.get = function(index) {};

/**
 * @param {number|Array.<*>} x
 * @param {number} value
 * @return {undefined}
 */
Int16Array.prototype.set = function(x, value) {};

/**
 * @param {number} start
 * @param {number} end
 */
Int16Array.prototype.slice = function(start, end) {};

/**
 * @constructor
 * @extends {ArrayBufferView}
 * @param {*} args
 */
function Uint16Array(args) {}

/**
 * @const
 * @type {number}
 */
Uint16Array.prototype.BYTES_PER_ELEMENT;

/**
 * @type {number}
 */
Uint16Array.prototype.length;

/**
 * @param {number} index
 */
Uint16Array.prototype.get = function(index) {};

/**
 * @param {number|Array.<*>} x
 * @param {number} value
 * @return {undefined}
 */
Uint16Array.prototype.set = function(x, value) {};

/**
 * @param {number} start
 * @param {number} end
 * @return {Array.<*>}
 */
Uint16Array.prototype.slice = function(start, end) {};

/**
 * @constructor
 * @extends {ArrayBufferView}
 * @param {*} args
 */
function Int32Array(args) {}

/**
 * @const
 * @type {number}
 */
Int32Array.prototype.BYTES_PER_ELEMENT;

/**
 * @type {number}
 */
Int32Array.prototype.length;

/**
 * @param {number} index
 * @return {number}
 */
Int32Array.prototype.get = function(index) {};

/**
 * @param {number|Array.<*>} x
 * @param {number} value
 * @return {undefined}
 */
Int32Array.prototype.set = function(x, value) {};

/**
 * @param {number} start
 * @param {number} end
 * @return {Array.<*>}
 */
Int32Array.prototype.slice = function(start, end) {};

/**
 * @constructor
 * @extends {ArrayBufferView}
 * @param {*} args
 */
function Uint32Array(args) {}

/**
 * @const
 * @type {number}
 */
Uint32Array.prototype.BYTES_PER_ELEMENT;

/**
 * @type {number}
 */
Uint32Array.prototype.length;

/**
 * @param {number} index
 * @return {number}
 */
Uint32Array.prototype.get = function(index) {};

/**
 * @param {number|Array.<*>} x
 * @param {number} value
 * @return {undefined}
 */
Uint32Array.prototype.set = function(x, value) {};

/**
 * @param {number} start
 * @param {number} end
 * @return {Array.<*>}
 */
Uint32Array.prototype.slice = function(start, end) {};

/**
 * @constructor
 * @extends {ArrayBufferView}
 * @param {*} args
 */
function Float32Array(args) {}

/**
 * @const
 * @type {number}
 */
Float32Array.prototype.BYTES_PER_ELEMENT;

/**
 * @type {number}
 */
Float32Array.prototype.length;

/**
 * @param {number} index
 * @return {number}
 */
Float32Array.prototype.get = function(index) {};

/**
 * @param {number|Array.<*>} x
 * @param {number} value
 * @return {undefined}
 */
Float32Array.prototype.set = function(x, value) {};

/**
 * @param {number} start
 * @param {number} end
 * @return {Array.<*>}
 */
Float32Array.prototype.slice = function(start, end) {};

/**
 * @constructor
 * @extends {ArrayBufferView}
 * @param {*} args
 */
function Float64Array(args) {}

/**
 * @const
 * @type {number}
 */
Float64Array.prototype.BYTES_PER_ELEMENT;

/**
 * @type {number}
 */
Float64Array.prototype.length;

/**
 * @param {number} index
 * @return {number}
 */
Float64Array.prototype.get = function(index) {};

/**
 * @param {number|Array.<*>} x
 * @param {number} value
 * @return {Array.<*>}
 */
Float64Array.prototype.set = function(x, value) {};

/**
 * @param {number} start
 * @param {number} end
 * @return {Array.<*>}
 */
Float64Array.prototype.slice = function(start, end) {};

/**
 * @constructor
 * @extends {ArrayBufferView}
 * @param {ArrayBuffer|number} value
 */
function DataView(value) {}

/**
 * @param {number} byteOffset
 * @return {number}
 */
DataView.prototype.getInt8 = function(byteOffset) {};

/**
 * @param {number} byteOffset
 * @return {number}
 */
DataView.prototype.getUint8 = function(byteOffset) {};

/**
 * @param {number} byteOffset
 * @param {boolean} littleEndian
 * @return {number}
 */
DataView.prototype.getInt16 = function(byteOffset, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {boolean} littleEndian
 * @return {number}
 */
DataView.prototype.getUint16 = function(byteOffset, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {boolean} littleEndian
 * @return {number}
 */
DataView.prototype.getInt32 = function(byteOffset, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {boolean} littleEndian
 * @return {number}
 */
DataView.prototype.getUint32 = function(byteOffset, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {boolean} littleEndian
 * @return {number}
 */
DataView.prototype.getFloat32 = function(byteOffset, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {boolean} littleEndian
 */
DataView.prototype.getFloat64 = function(byteOffset, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {number} value
 */
DataView.prototype.setInt8 = function(byteOffset, value) {};

/**
 * @param {number} byteOffset
 * @param {number} value
 */
DataView.prototype.setUint8 = function(byteOffset, value) {};

/**
 * @param {number} byteOffset
 * @param {number} value
 * @param {boolean} littleEndian
 */
DataView.prototype.setInt16 = function(byteOffset, value, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {number} value
 * @param {boolean} littleEndian
 */
DataView.prototype.setUint16 = function(byteOffset, value, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {number} value
 * @param {boolean} littleEndian
 */
DataView.prototype.setInt32 = function(byteOffset, value, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {number} value
 * @param {boolean} littleEndian
 */
DataView.prototype.setUint32 = function(byteOffset, value, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {number} value
 * @param {boolean} littleEndian
 */
DataView.prototype.setFloat32 = function(byteOffset, value, littleEndian) {};

/**
 * @param {number} byteOffset
 * @param {number} value
 * @param {boolean} littleEndian
 */
DataView.prototype.setFloat64 = function(byteOffset, value, littleEndian) {};

/* EOF */
