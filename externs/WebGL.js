/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/**
 * Lanyard is Copyright 2010 Jonathan Bringhurst.
 *
 * This file is part of Lanyard.
 *
 * Lanyard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Lanyard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Lanyard.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Portions of Lanyard which do not constitute a "Larger Work" may be licensed
 * under the NASA OPEN SOURCE AGREEMENT VERSION 1.3.
 *
 * See http://worldwind.arc.nasa.gov/ for further information about NASA World Wind.
 */

/**
 * @fileoverview Externs for WebGL.
 * @externs
 */

/**
 * @constructor
 */
function WebGLContextAttributes() {}

/**
 * @type {boolean}
 */
WebGLContextAttributes.alpha = {};

/**
 * @type {boolean}
 */
WebGLContextAttributes.depth = {};

/**
 * @type {boolean}
 */
WebGLContextAttributes.stencil = {};

/**
 * @type {boolean}
 */
WebGLContextAttributes.antialias = {};

/**
 * @type {boolean}
 */
WebGLContextAttributes.premultipliedAlpha = {};

/**
 * @constructor
 */
function WebGLObject() {}

/**
 * @constructor
 * @extends {WebGLObject}
 */
function WebGLBuffer() {}

/**
 * @constructor
 * @extends {WebGLObject}
 */
function WebGLFramebuffer() {}

/**
 * @constructor
 * @extends {WebGLObject}
 */
function WebGLProgram() {}

/**
 * @constructor
 * @extends {WebGLObject}
 */
function WebGLRenderbuffer() {}

/**
 * @constructor
 * @extends {WebGLObject}
 */
function WebGLShader() {}

/**
 * @constructor
 * @extends {WebGLObject}
 */
function WebGLTexture() {}

/**
 * @constructor
 */
function WebGLUniformLocation() {}

/**
 * @constructor
 */
function WebGLActiveInfo() {}

/**
 * @type {number}
 */
WebGLActiveInfo.size = {};

/**
 * @type {number}
 */
WebGLActiveInfo.type = {};

/**
 * @type {string}
 */
WebGLActiveInfo.name = {};

/**
 * @constructor
 */
function WebGLRenderingContext() {}

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_BUFFER_BIT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BUFFER_BIT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.COLOR_BUFFER_BIT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.POINTS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LINES = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LINE_LOOP = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LINE_STRIP = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TRIANGLES = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TRIANGLE_STRIP = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TRIANGLE_FAN = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ZERO = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ONE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SRC_COLOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ONE_MINUS_SRC_COLOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SRC_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ONE_MINUS_SRC_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DST_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ONE_MINUS_DST_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DST_COLOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ONE_MINUS_DST_COLOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SRC_ALPHA_SATURATE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FUNC_ADD = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND_EQUATION = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND_EQUATION_RGB = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND_EQUATION_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FUNC_SUBTRACT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FUNC_REVERSE_SUBTRACT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND_DST_RGB = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND_SRC_RGB = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND_DST_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND_SRC_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CONSTANT_COLOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ONE_MINUS_CONSTANT_COLOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CONSTANT_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ONE_MINUS_CONSTANT_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND_COLOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ARRAY_BUFFER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ELEMENT_ARRAY_BUFFER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ARRAY_BUFFER_BINDING = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ELEMENT_ARRAY_BUFFER_BINDING = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STREAM_DRAW = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STATIC_DRAW = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DYNAMIC_DRAW = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BUFFER_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BUFFER_USAGE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CURRENT_VERTEX_ATTRIB = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRONT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BACK = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRONT_AND_BACK = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_2D = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CULL_FACE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLEND = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DITHER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_TEST = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_TEST = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SCISSOR_TEST = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.POLYGON_OFFSET_FILL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SAMPLE_ALPHA_TO_COVERAGE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SAMPLE_COVERAGE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NO_ERROR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INVALID_ENUM = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INVALID_VALUE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INVALID_OPERATION = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.OUT_OF_MEMORY = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CW = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CCW = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LINE_WIDTH = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ALIASED_POINT_SIZE_RANGE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ALIASED_LINE_WIDTH_RANGE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CULL_FACE_MODE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRONT_FACE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_RANGE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_WRITEMASK = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_CLEAR_VALUE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_FUNC = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_CLEAR_VALUE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_FUNC = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_FAIL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_PASS_DEPTH_FAIL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_PASS_DEPTH_PASS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_REF = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_VALUE_MASK = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_WRITEMASK = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BACK_FUNC = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BACK_FAIL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BACK_PASS_DEPTH_FAIL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BACK_PASS_DEPTH_PASS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BACK_REF = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BACK_VALUE_MASK = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BACK_WRITEMASK = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VIEWPORT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SCISSOR_BOX = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.COLOR_CLEAR_VALUE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.COLOR_WRITEMASK = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNPACK_ALIGNMENT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.PACK_ALIGNMENT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_TEXTURE_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_VIEWPORT_DIMS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SUBPIXEL_BITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RED_BITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.GREEN_BITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BLUE_BITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ALPHA_BITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_BITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_BITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.POLYGON_OFFSET_UNITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.POLYGON_OFFSET_FACTOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_BINDING_2D = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SAMPLE_BUFFERS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SAMPLES = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SAMPLE_COVERAGE_VALUE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SAMPLE_COVERAGE_INVERT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NUM_COMPRESSED_TEXTURE_FORMATS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.COMPRESSED_TEXTURE_FORMATS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DONT_CARE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FASTEST = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NICEST = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.GENERATE_MIPMAP_HINT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BYTE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNSIGNED_BYTE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SHORT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNSIGNED_SHORT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNSIGNED_INT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FLOAT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_COMPONENT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RGB = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RGBA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LUMINANCE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LUMINANCE_ALPHA = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNSIGNED_SHORT_4_4_4_4 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNSIGNED_SHORT_5_5_5_1 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNSIGNED_SHORT_5_6_5 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAGMENT_SHADER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERTEX_SHADER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_VERTEX_ATTRIBS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_VERTEX_UNIFORM_VECTORS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_VARYING_VECTORS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_COMBINED_TEXTURE_IMAGE_UNITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_VERTEX_TEXTURE_IMAGE_UNITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_TEXTURE_IMAGE_UNITS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_FRAGMENT_UNIFORM_VECTORS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SHADER_TYPE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DELETE_STATUS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LINK_STATUS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VALIDATE_STATUS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ATTACHED_SHADERS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ACTIVE_UNIFORMS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ACTIVE_UNIFORM_MAX_LENGTH = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ACTIVE_ATTRIBUTES = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ACTIVE_ATTRIBUTE_MAX_LENGTH = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SHADING_LANGUAGE_VERSION = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CURRENT_PROGRAM = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NEVER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LESS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.EQUAL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LEQUAL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.GREATER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NOTEQUAL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.GEQUAL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ALWAYS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.KEEP = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.REPLACE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INCR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DECR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INVERT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INCR_WRAP = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DECR_WRAP = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VENDOR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERSION = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NEAREST = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LINEAR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NEAREST_MIPMAP_NEAREST = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LINEAR_MIPMAP_NEAREST = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NEAREST_MIPMAP_LINEAR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LINEAR_MIPMAP_LINEAR = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_MAG_FILTER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_MIN_FILTER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_WRAP_S = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_WRAP_T = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_BINDING_CUBE_MAP = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_X = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_X = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_Y = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_Y = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_POSITIVE_Z = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE_CUBE_MAP_NEGATIVE_Z = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_CUBE_MAP_TEXTURE_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE0 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE1 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE2 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE3 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE4 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE5 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE6 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE7 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE8 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE9 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE10 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE11 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE12 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE13 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE14 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE15 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE16 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE17 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE18 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE19 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE20 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE21 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE22 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE23 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE24 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE25 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE26 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE27 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE28 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE29 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE30 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.TEXTURE31 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.ACTIVE_TEXTURE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.REPEAT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CLAMP_TO_EDGE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MIRRORED_REPEAT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FLOAT_VEC2 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FLOAT_VEC3 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FLOAT_VEC4 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INT_VEC2 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INT_VEC3 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INT_VEC4 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BOOL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BOOL_VEC2 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BOOL_VEC3 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BOOL_VEC4 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FLOAT_MAT2 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FLOAT_MAT3 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FLOAT_MAT4 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SAMPLER_2D = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SAMPLER_CUBE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERTEX_ATTRIB_ARRAY_ENABLED = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERTEX_ATTRIB_ARRAY_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERTEX_ATTRIB_ARRAY_STRIDE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERTEX_ATTRIB_ARRAY_TYPE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERTEX_ATTRIB_ARRAY_NORMALIZED = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERTEX_ATTRIB_ARRAY_POINTER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.COMPILE_STATUS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INFO_LOG_LENGTH = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.SHADER_SOURCE_LENGTH = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LOW_FLOAT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MEDIUM_FLOAT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.HIGH_FLOAT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.LOW_INT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MEDIUM_INT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.HIGH_INT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RGBA4 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RGB5_A1 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RGB565 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_COMPONENT16 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_INDEX = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_INDEX8 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_STENCIL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_WIDTH = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_HEIGHT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_INTERNAL_FORMAT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_RED_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_GREEN_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_BLUE_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_ALPHA_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_DEPTH_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_STENCIL_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.COLOR_ATTACHMENT0 = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_ATTACHMENT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.STENCIL_ATTACHMENT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.DEPTH_STENCIL_ATTACHMENT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.NONE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_COMPLETE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_UNSUPPORTED = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.FRAMEBUFFER_BINDING = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.RENDERBUFFER_BINDING = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.MAX_RENDERBUFFER_SIZE = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.INVALID_FRAMEBUFFER_OPERATION = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNPACK_FLIP_Y_WEBGL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNPACK_PREMULTIPLY_ALPHA_WEBGL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.CONTEXT_LOST_WEBGL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.UNPACK_COLORSPACE_CONVERSION_WEBGL = {};

/**
 * @const
 * @type {number}
 */
WebGLRenderingContext.prototype.BROWSER_DEFAULT_WEBGL = {};

/**
 * @type {canvas}
 */
WebGLRenderingContext.prototype.canvas = {};

/**
 * @return {WebGLContextAttributes}
 */
WebGLRenderingContext.prototype.getContextAttributed = function () {};

/**
 * @return {boolean}
 */
WebGLRenderingContext.prototype.isContextLost = function () {};

/**
 * @return {string}
 */
WebGLRenderingContext.prototype.getSupportedExtensions = function () {};

/**
 * @param {string} name
 * @return {object}
 */
WebGLRenderingContext.prototype.getExtension = function (name) {};

/**
 * @param {number} texture
 */
WebGLRenderingContext.prototype.activeTexture = function (texture) {};

/**
 * @param {WebGLProgram} program
 * @param {WebGLShader} shader
 */
WebGLRenderingContext.prototype.attachShader = function (program, shader) {};

/**
 * @param {WebGLProgram} program
 * @param {number} index
 * @param {string} name
 */
WebGLRenderingContext.prototype.bindAttribLocation = function (program, index, name) {};

/**
 * @param {number} target
 * @param {WebGLBuffer} buffer
 */
WebGLRenderingContext.prototype.bindBuffer = function (target, buffer) {};

/**
 * @param {number} target
 * @param {WebGLFramebuffer} framebuffer
 */
WebGLRenderingContext.prototype.bindFramebuffer = function (target, framebuffer) {};

/**
 * @param {number} target
 * @param {WebGLRenderbuffer} renderbuffer
 */
WebGLRenderingContext.prototype.bindRenderbuffer = function (target, renderbuffer) {};

/**
 * @param {number} target
 * @param {WebGLTexture} texture
 */
WebGLRenderingContext.prototype.bindTexture = function (target, texture) {};

/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} alpha
 */
WebGLRenderingContext.prototype.blendColor = function (red, green, blue, alpha) {};

/**
 * @param {number} mode
 */
WebGLRenderingContext.prototype.blendEquation = function (mode) {};

/**
 * @param {number} modeRGB
 * @param {number} modeAlpha
 */
WebGLRenderingContext.prototype.blendEquationSeparate = function (modeRGB, modeAlpha) {};

/**
 * @param {number} sfactor
 * @param {number} dfactor
 */
WebGLRenderingContext.prototype.blendFunc = function (sfactor, dfactor) {};

/**
 * @param {number} srcRGB
 * @param {number} dstRGB
 * @param {number} srcAlpha
 * @param {number} dstAlpha
 */
WebGLRenderingContext.prototype.blendFuncSeparate = function (srcRGB, dstRGB, srcAlpha, dstAlpha) {};

/**
 * @param {number} target
 * @param {number} size
 * @param {number} usage
 */
WebGLRenderingContext.prototype.bufferData = function (target, size, usage) {};

/**
 * @param {number} target
 * @param {ArrayBufferView} data
 * @param {number} usage
 */
WebGLRenderingContext.prototype.bufferData = function (target, data, usage) {};

/**
 * @param {number} target
 * @param {ArrayBuffer} data
 * @param {number} usage
 */
WebGLRenderingContext.prototype.bufferData = function (target, data, usage) {};

/**
 * @param {number} target
 * @param {number} offset
 * @param {ArrayBufferView} data
 */
WebGLRenderingContext.prototype.bufferSubData = function (target, offset, data) {};

/**
 * @param {number} target
 * @param {number} offset
 * @param {ArrayBuffer} data
 */
WebGLRenderingContext.prototype.bufferSubData = function (target, offset, data) {};

/**
 * @param {number} target
 * @return {number}
 */
WebGLRenderingContext.prototype.checkFramebufferStatus = function (target) {};

/**
 * @param {number} mask
 */
WebGLRenderingContext.prototype.clear = function (mask) {};

/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} alpha
 */
WebGLRenderingContext.prototype.clearColor = function (red, green, blue, alpha) {};

/**
 * @param {number} depth
 */
WebGLRenderingContext.prototype.clearDepth = function (depth) {};

/**
 * @param {number} s
 */
WebGLRenderingContext.prototype.clearStencil = function (s) {};

/**
 * @param {boolean} red
 * @param {boolean} green
 * @param {boolean} blue
 * @param {boolean} alpha
 */
WebGLRenderingContext.prototype.colorMask = function (red, green, blue, alpha) {};

/**
 * @param {WebGLShader} shader
 */
WebGLRenderingContext.prototype.compileShader = function (shader) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} internalformat
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} border
 */
WebGLRenderingContext.prototype.copyTexImage2D =
    function (target, level, internalformat, x, y, width, height, border) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} xoffset
 * @param {number} yoffset
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
WebGLRenderingContext.prototype.copyTexSubImage2D =
    function (target, level, xoffset, yoffset, x, y, width, height) {};

/**
 * @return {WebGLBuffer}
 */
WebGLRenderingContext.prototype.createBuffer = function () {};

/**
 * @return {WebGLFramebuffer}
 */
WebGLRenderingContext.prototype.createFramebuffer = function () {};

/**
 * @return {WebGLProgram}
 */
WebGLRenderingContext.prototype.createProgram = function () {};

/**
 * @return {WebGLRenderbuffer}
 */
WebGLRenderingContext.prototype.createRenderbuffer = function () {};

/**
 * @param {number} type
 * @return {WebGLShader}
 */
WebGLRenderingContext.prototype.createShader = function (type) {};

/**
 * @return {WebGLTexture}
 */
WebGLRenderingContext.prototype.createTexture = function () {};

/**
 * @param {number} mode
 */
WebGLRenderingContext.prototype.cullFace = function (mode) {};

/**
 * @param {WebGLBuffer} buffer
 */
WebGLRenderingContext.prototype.deleteBuffer = function (buffer) {};

/**
 * @param {WebGLFramebuffer} framebuffer
 */
WebGLRenderingContext.prototype.deleteFramebuffer = function (framebuffer) {};

/**
 * @param {WebGLProgram} program
 */
WebGLRenderingContext.prototype.deleteProgram = function (program) {};

/**
 * @param {WebGLRenderbuffer} renderbuffer
 */
WebGLRenderingContext.prototype.deleteRenderbuffer = function (renderbuffer) {};

/**
 * @param {WebGLShader} shader
 */
WebGLRenderingContext.prototype.deleteShader = function (shader) {};

/**
 * @param {WebGLTexture} texture
 */
WebGLRenderingContext.prototype.deleteTexture = function (texture) {};

/**
 * @param {number} func
 */
WebGLRenderingContext.prototype.depthFunc = function (func) {};

/**
 * @param {boolean} flag
 */
WebGLRenderingContext.prototype.depthMask = function (flag) {};

/**
 * @param {number} zNear
 * @param {number} zFar
 */
WebGLRenderingContext.prototype.depthRange = function (zNear, zFar) {};

/**
 * @param {WebGLProgram} program
 * @param {WebGLShader} shader
 */
WebGLRenderingContext.prototype.detachShader = function (program, shader) {};

/**
 * @param {number}
 */
WebGLRenderingContext.prototype.disable = function (cap) {};

/**
 * @param {number} index
 */
WebGLRenderingContext.prototype.disableVertexAttribArray = function (index) {};

/**
 * @param {number} mode
 * @param {number} first
 * @param {number} count
 */
WebGLRenderingContext.prototype.drawArrays = function (mode, first, count) {};

/**
 * @param {number} mode
 * @param {number} count
 * @param {number} type
 * @param {number} offset
 */
WebGLRenderingContext.prototype.drawElements = function (mode, count, type, offset) {};

/**
 * @param {number} cap
 */
WebGLRenderingContext.prototype.enable = function (cap) {};

/**
 * @param {number} index
 */
WebGLRenderingContext.prototype.enableVertexAttribArray = function (index) {};

/**
 */
WebGLRenderingContext.prototype.finish = function () {};

/**
 */
WebGLRenderingContext.prototype.flush = function () {};

/**
 * @param {number} target
 * @param {number} attachment
 * @param {number} renderbuffertarget
 * @param {WebGLRenderbuffer} renderbuffer
 */
WebGLRenderingContext.prototype.framebufferRenderbuffer =
    function (target, attachment, renderbuffertarget, renderbuffer) {};

/**
 * @param {number} target
 * @param {number} attachment
 * @param {number} textarget
 * @param {WebGLTexture} texture
 * @param {number} level
 */
WebGLRenderingContext.prototype.framebufferTexture2D =
    function (target, attachment, textarget, texture, level) {};

/**
 * @param {number} mode
 */
WebGLRenderingContext.prototype.frontFace = function (mode) {};

/**
 * @param {number} target
 */
WebGLRenderingContext.prototype.generateMipmap = function (target) {};

/**
 * @param {WebGLProgram} program
 * @param {number} index
 * @return {WebGLActiveInfo}
 */
WebGLRenderingContext.prototype.getActiveAttrib = function (program, index) {};

/**
 * @param {WebGLProgram} program
 * @param {number} index
 * @return {WebGLActiveInfo}
 */
WebGLRenderingContext.prototype.getActiveUniform = function (program, index) {};

/**
 * @param {WebGLProgram} program
 * @return {Array.<WebGLShader>}
 */
WebGLRenderingContext.prototype.getAttachedShaders = function (program) {};

/**
 * @param {WebGLProgram} program
 * @param {string} name
 * @return {number}
 */
WebGLRenderingContext.prototype.getAttribLocation = function (program, name) {};

/**
 * @param {number} pname
 * @return {*}
 */
WebGLRenderingContext.prototype.getParameter = function (pname) {};

/**
 * @param {number} target
 * @param {number} pname
 * @return {*}
 */
WebGLRenderingContext.prototype.getBufferParameter = function (target, pname) {};

/**
 * @return {number}
 */
WebGLRenderingContext.prototype.getError = function () {};

/**
 * @param {number} target
 * @param {number} attachment
 * @param {number} pname
 * @return {*}
 */
WebGLRenderingContext.prototype.getFramebufferAttachmentParameter =
    function (target, attachment, pname) {};

/**
 * @param {WebGLProgram} program
 * @param {number} pname
 * @return {*}
 */
WebGLRenderingContext.prototype.getProgramParameter = function (program, pname) {};

/**
 * @param {WebGLProgram} program
 * @return {string}
 */
WebGLRenderingContext.prototype.getProgramInfoLog = function (program) {};

/**
 * @param {number} target
 * @param {number} pname
 * @return {*}
 */
WebGLRenderingContext.prototype.getRenderbufferParameter = function (target, pname) {};

/**
 * @param {WebGLShader} shader
 * @param {number} pname
 * @return {*}
 */
WebGLRenderingContext.prototype.getShaderParameter = function (shader, pname) {};

/**
 * @param {WebGLShader} shader
 * @return {string}
 */
WebGLRenderingContext.prototype.getShaderInfoLog = function (shader) {};

/**
 * @param {WebGLShader} shader
 * @return {string}
 */
WebGLRenderingContext.prototype.getShaderSource = function (shader) {};

/**
 * @param {number} target
 * @param {number} pname
 * @return {*}
 */
WebGLRenderingContext.prototype.getTexParameter = function (target, pname) {};

/**
 * @param {WebGLProgram} program
 * @param {WebGLUniformLocation} loc
 * @return {*}
 */
WebGLRenderingContext.prototype.getUniform = function (program, loc) {};

/**
 * @param {WebGLProgram} program
 * @param {string} name
 * @return {WebGLUniformLocation}
 */
WebGLRenderingContext.prototype.getUniformLocation = function (program, name) {};

/**
 * @param {number} index
 * @param {number} pname
 * @return {*}
 */
WebGLRenderingContext.prototype.getVertexAttrib = function (index, pname) {};

/**
 * @param {number} index
 * @param {number} pname
 * @return {number}
 */
WebGLRenderingContext.prototype.getVertexAttribOffset = function (index, pname) {};

/**
 * @param {number} target
 * @param {number} mode
 */
WebGLRenderingContext.prototype.hint = function (target, mode) {};

/**
 * @param {WebGLBuffer} buffer
 * @return {boolean}
 */
WebGLRenderingContext.prototype.isBuffer = function (buffer) {};

/**
 * @param {number} cap
 * @return {boolean}
 */
WebGLRenderingContext.prototype.isEnabled = function (cap) {};

/**
 * @param {WebGLFramebuffer} framebuffer
 * @return {boolean}
 */
WebGLRenderingContext.prototype.isFramebuffer = function (framebuffer) {};

/**
 * @param {WebGLProgram} program
 * @return {boolean}
 */
WebGLRenderingContext.prototype.isProgram = function (program) {};

/**
 * @param {WebGLRenderbuffer} renderbuffer
 * @return {boolean}
 */
WebGLRenderingContext.prototype.isRenderbuffer = function (renderbuffer) {};

/**
 * @param {WebGLShader} shader
 * @return {boolean}
 */
WebGLRenderingContext.prototype.isShader = function (shader) {};

/**
 * @param {WebGLTexture} texture
 * @return {boolean}
 */
WebGLRenderingContext.prototype.isTexture = function (texture) {};

/**
 * @param {number} width
 */
WebGLRenderingContext.prototype.lineWidth = function (width) {};

/**
 * @param {WebGLProgram} program
 */
WebGLRenderingContext.prototype.linkProgram = function (program) {};

/**
 * @param {number} pname
 * @param {number} param
 */
WebGLRenderingContext.prototype.pixelStorei = function (pname, param) {};

/**
 * @param {number} factor
 * @param {number} units
 */
WebGLRenderingContext.prototype.polygonOffset = function (factor, units) {};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} format
 * @param {number} type
 * @param {ArrayBufferView} pixels
 */
WebGLRenderingContext.prototype.readPixels =
    function (x, y, width, height, format, type, pixels) {};

/**
 * @param {number} target
 * @param {number} internalformat
 * @param {number} width
 * @param {number} height
 */
WebGLRenderingContext.prototype.renderbufferStorage =
    function (target, internalformat, width, height) {};

/**
 * @param {number} value
 * @param {boolean} invert
 */
WebGLRenderingContext.prototype.sampleCoverage = function (value, invert) {};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
WebGLRenderingContext.prototype.scissor = function (x, y, width, height) {};

/**
 * @param {WebGLShader} shader
 * @param {string} source
 */
WebGLRenderingContext.prototype.shaderSource = function (shader, source) {};

/**
 * @param {number} func
 * @param {number} ref
 * @param {number} mask
 */
WebGLRenderingContext.prototype.stencilFunc = function (func, ref, mask) {};

/**
 * @param {number} face
 * @param {number} func
 * @param {number} ref
 * @param {number} mask
 */
WebGLRenderingContext.prototype.stencilFuncSeparate = function (face, func, ref, mask) {};

/**
 * @param {number} mask
 */
WebGLRenderingContext.prototype.stencilMask = function (mask) {};

/**
 * @param {number} face
 * @param {number} mask
 */
WebGLRenderingContext.prototype.stencilMaskSeparate = function (face, mask) {};

/**
 * @param {number} fail
 * @param {number} zfail
 * @param {number} zpass
 */
WebGLRenderingContext.prototype.stencilOp = function (fail, zfail, zpass) {};

/**
 * @param {number} face
 * @param {number} fail
 * @param {number} zfail
 * @param {number} zpass
 */
WebGLRenderingContext.prototype.stencilOpSeparate = function (face, fail, zfail, zpass) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} internalformat
 * @param {number} width
 * @param {number} height
 * @param {number} border
 * @param {number} format
 * @param {number} type
 * @param {ArrayBufferView} pixels
 */
WebGLRenderingContext.prototype.texImage2D =
    function (target, level, internalformat, width, height, border, format, type, pixels) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} internalformat
 * @param {number} format
 * @param {number} type
 * @param {ImageData} pixels
 */
WebGLRenderingContext.prototype.texImage2D =
    function (target, level, internalformat, format, type, pixels) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} internalformat
 * @param {number} format
 * @param {number} type
 * @param {Image} image
 */
WebGLRenderingContext.prototype.texImage2D =
    function (target, level, internalformat, format, type, image) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} internalformat
 * @param {number} format
 * @param {number} type
 * @param {canvas} canvas
 */
WebGLRenderingContext.prototype.texImage2D =
    function (target, level, internalformat, format, type, canvas) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} internalformat
 * @param {number} format
 * @param {number} type
 * @param {video} video
 */
WebGLRenderingContext.prototype.texImage2D =
    function (target, level, internalformat, format, type, video) {};

/**
 * @param {number} target
 * @param {number} pname
 * @param {number} param
 */
WebGLRenderingContext.prototype.texParameterf = function (target, pname, param) {};

/**
 * @param {number} target
 * @param {number} pname
 * @param {number} param
 */
WebGLRenderingContext.prototype.texParameteri = function (target, pname, param) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} xoffset
 * @param {number} yoffset
 * @param {number} width
 * @param {number} height
 * @param {number} format
 * @param {number} type
 * @param {ArrayBufferView} pixels
 */
WebGLRenderingContext.prototype.texSubImage2D =
    function (target, level, xoffset, yoffset, width, height, format, type, pixels) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} xoffset
 * @param {number} yoffset
 * @param {number} format
 * @param {number} type
 * @param {image} pixels
 */
WebGLRenderingContext.prototype.texSubImage2D =
    function (target, level, xoffset, yoffset, format, type, pixels) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} xoffset
 * @param {number} yoffset
 * @param {number} format
 * @param {number} type
 * @param {image} image
 */
WebGLRenderingContext.prototype.texSubImage2D =
    function (target, level, xoffset, yoffset, format, type, image) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} xoffset
 * @param {number} yoffset
 * @param {number} format
 * @param {number} type
 * @param {canvas} canvas
 */
WebGLRenderingContext.prototype.texSubImage2D =
    function (target, level, xoffset, yoffset, format, type, canvas) {};

/**
 * @param {number} target
 * @param {number} level
 * @param {number} xoffset
 * @param {number} yoffset
 * @param {number} format
 * @param {number} type
 * @param {video} video
 */
WebGLRenderingContext.prototype.texSubImage2D =
    function (target, level, xoffset, yoffset, format, type, video) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {number} x
 */
WebGLRenderingContext.prototype.uniform1f = function (loc, x) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {FloatArray} v
 */
WebGLRenderingContext.prototype.uniform1fv = function (loc, v) {};

//WebGLRenderingContext.prototype.uniform1fv(WebGLUniformLocation location, sequence<float> v);

/**
 * @param {WebGLUniformLocation} loc
 * @param {number} x
 */
WebGLRenderingContext.prototype.uniform1i = function (loc, x) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {Int32Array} v
 */
WebGLRenderingContext.prototype.uniform1iv = function (loc, v) {};

//WebGLRenderingContext.prototype.uniform1iv(WebGLUniformLocation location, sequence<long> v);

/**
 * @param {WebGLUniformLocation} loc
 * @param {number} x
 * @param {number} y
 */
WebGLRenderingContext.prototype.uniform2f = function (loc, x, y) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {FloatArray} v
 */
WebGLRenderingContext.prototype.uniform2fv = function (loc, v) {};

//WebGLRenderingContext.prototype.uniform2fv(WebGLUniformLocation location, sequence<float> v);

/**
 * @param {WebGLUniformLocation} loc
 * @param {number} x
 * @param {number} y
 */
WebGLRenderingContext.prototype.uniform2i = function (loc, x, y) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {Int32Array} v
 */
WebGLRenderingContext.prototype.uniform2iv = function (loc, v) {};

//WebGLRenderingContext.prototype.uniform2iv(WebGLUniformLocation location, sequence<long> v);

/**
 * @param {WebGLUniformLocation} loc
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
WebGLRenderingContext.prototype.uniform3f = function (loc, x, y, z) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {FloatArray} v
 */
WebGLRenderingContext.prototype.uniform3fv = function (loc, v) {};

//WebGLRenderingContext.prototype.uniform3fv(WebGLUniformLocation location, sequence<float> v);

/**
 * @param {WebGLUniformLocation} loc
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
WebGLRenderingContext.prototype.uniform3i = function (loc, x, y, z) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {Int32Array} v
 */
WebGLRenderingContext.prototype.uniform3iv = function (loc, v) {};

//WebGLRenderingContext.prototype.uniform3iv(WebGLUniformLocation location, sequence<long> v);

/**
 * @param {WebGLUniformLocation} loc
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 */
WebGLRenderingContext.prototype.uniform4f = function (loc, x, y, z, w) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {FloatArray} v
 */
WebGLRenderingContext.prototype.uniform4fv = function (loc, v) {};

//WebGLRenderingContext.prototype.uniform4fv(WebGLUniformLocation location, sequence<float> v);

/**
 * @param {WebGLUniformLocation} loc
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 */
WebGLRenderingContext.prototype.uniform4i = function (loc, x, y, z, w) {};

/**
 * @param {WebGLUniformLocation} loc
 * @param {Int32Array} v
 */
WebGLRenderingContext.prototype.uniform4iv = function (loc, v) {};

//WebGLRenderingContext.prototype.uniform4iv(WebGLUniformLocation location, sequence<long> v);

/**
 * @param {WebGLUniformLocation} loc
 * @param {boolean} transpose
 * @param {FloatArray} value
 */
WebGLRenderingContext.prototype.uniformMatrix2fv = function (loc, transpose, value) {};

//WebGLRenderingContext.prototype.uniformMatrix2fv(WebGLUniformLocation location, GLboolean transpose, 
//                          sequence<float> value);

/**
 * @param {WebGLUniformLocation} loc
 * @param {boolean} transpose
 * @param {FloatArray} value
 */
WebGLRenderingContext.prototype.uniformMatrix3fv = function (loc, transpose, value) {};

//WebGLRenderingContext.prototype.uniformMatrix3fv(WebGLUniformLocation location, GLboolean transpose, 
//                          sequence<float> value);

/**
 * @param {WebGLUniformLocation} loc
 * @param {boolean} transpose
 * @param {FloatArray} value
 */
WebGLRenderingContext.prototype.uniformMatrix4fv = function (loc, transpose, value) {};

//WebGLRenderingContext.prototype.uniformMatrix4fv(WebGLUniformLocation location, GLboolean transpose, 
//                          sequence<float> value);

/**
 * @param {WebGLProgram} program
 */
WebGLRenderingContext.prototype.useProgram = function (program) {};

/**
 * @param {WebGLProgram} program
 */
WebGLRenderingContext.prototype.validateProgram = function (program) {};

/**
 * @param {number} indx
 * @param {number} x
 */
WebGLRenderingContext.prototype.vertexAttrib1f = function (indx, x) {};

/**
 * @param {number} indx
 * @param {FloatArray} values
 */
WebGLRenderingContext.prototype.vertexAttrib1fv = function (indx, values) {};

//WebGLRenderingContext.prototype.vertexAttrib1fv(GLuint indx, sequence<float> values);

/**
 * @param {number} indx
 * @param {number} x
 * @param {number} y
 */
WebGLRenderingContext.prototype.vertexAttrib2f = function (indx, x, y) {};

/**
 * @param {number} indx
 * @param {FloatArray} values
 */
WebGLRenderingContext.prototype.vertexAttrib2fv = function (indx, values) {};

//WebGLRenderingContext.prototype.vertexAttrib2fv(GLuint indx, sequence<float> values);

/**
 * @param {number} indx
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
WebGLRenderingContext.prototype.vertexAttrib3f = function (indx, x, y, z) {};

/**
 * @param {number} indx
 * @param {FloatArray} values
 */
WebGLRenderingContext.prototype.vertexAttrib3fv = function (indx, values) {};

//WebGLRenderingContext.prototype.vertexAttrib3fv(GLuint indx, sequence<float> values);

/**
 * @param {number} indx
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 */
WebGLRenderingContext.prototype.vertexAttrib4f = function (indx, x, y, z, w) {};

/**
 * @param {number} indx
 * @param {FloatArray} values
 */
WebGLRenderingContext.prototype.vertexAttrib4fv = function (indx, values) {};

//WebGLRenderingContext.prototype.vertexAttrib4fv(GLuint indx, sequence<float> values);

/**
 * @param {number} indx
 * @param {number} size
 * @param {number} type
 * @param {boolean} normalized
 * @param {number} stride
 * @param {number} offset
 */
WebGLRenderingContext.prototype.vertexAttribPointer =
    function (indx, size, type, normalized, stride, offset) {};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
WebGLRenderingContext.prototype.viewport = function (x, y, width, height) {};

/**
 * @constructor
 * @extends {Event}
 */
function WebGLContextEvent() {}

/**
 * @type {string}
 */
WebGLContextEvent.prototype.statusMessage = {};

/**
 * @param {string} typeArg
 * @param {boolean} canBubbleArg
 * @param {boolean} cancelableArg
 * @param {string} statusMessageArg
 */
WebGLContextEvent.prototype.initWebGLContextEvent =
    function (typeArg, canBubbleArg, cancelableArg, statusMessageArg) {};

/* EOF */
