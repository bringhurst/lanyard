/*global goog, lanyard */
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
 *
 * This file also contains code that may be under the following license:
 *
 * SGI FREE SOFTWARE LICENSE B (Version 2.0, Sept. 18, 2008)
 * Copyright (C) 1991-2000 Silicon Graphics, Inc. All Rights Reserved.
 *
 * See http://oss.sgi.com/projects/FreeB/ for more information.
 */

goog.provide('lanyard.util.GLU');



/**
 * @constructor
 */
lanyard.util.GLU = function() {};


/**
 * Unproject a screen point.
 *
 * @param {number} winX the window point for the x value.
 * @param {number} winY the window point for the y value.
 * @param {number} winZ the window point for the z value.
 * @param {Array.<number>} model the model-view matrix.
 * @param {Array.<number>} proj the projection matrix.
 * @param {Array.<number>} view the viewport coordinate array.
 * @param {Array.<number>} objPos the model point result.
 * @return {boolean} true if the unproject operation was successful, false otherwise.
 */
lanyard.util.GLU.prototype.unProject =
    function(winX, winY, winZ, model, proj, view, objPos) {

  /** @type {Array.<number>} */
  var inp = [
    winX,
    winY,
    winZ,
    1.0
  ];

  /** @type {Array.<number>} */
  var finalMatrix = [];

  lanyard.util.GLU.prototype.multMatrices(model, proj, finalMatrix);
  if (!lanyard.util.GLU.prototype.invertMatrix(finalMatrix, finalMatrix)) {
    return (false);
  }

  /* Map x and y from window coordinates */
  inp[0] = (inp[0] - view[0]) / view[2];
  inp[1] = (inp[1] - view[1]) / view[3];

  /* Map to range -1 to 1 */
  inp[0] = inp[0] * 2 - 1;
  inp[1] = inp[1] * 2 - 1;
  inp[2] = inp[2] * 2 - 1;

  /** @type {Array.<number>} */
  var out = [];

  lanyard.util.GLU.prototype.multMatrixVec(finalMatrix, inp, out);

  if (out[3] === 0.0) {
    return false;
  }

  out[0] /= out[3];
  out[1] /= out[3];
  out[2] /= out[3];

  objPos[0] = out[0];
  objPos[1] = out[1];
  objPos[2] = out[2];

  return true;
};


/**
 * Multiply the matrix by the specified vector.
 *
 * @param {Array.<number>} matrix the matrix.
 * @param {Array.<number>} inp the vector.
 * @param {Array.<number>} out the output.
 */
lanyard.util.GLU.prototype.multMatrixVec = function(matrix, inp, out) {
  for (var i = 0; i < 4; i = i + 1) {
    out[i] =
        inp[0] * matrix[0 * 4 + i] +
            inp[1] * matrix[1 * 4 + i] +
            inp[2] * matrix[2 * 4 + i] +
            inp[3] * matrix[3 * 4 + i];
  }
};


/**
 * Multiply the specified matrices.
 *
 * @param {Array.<number>} a the first matrix.
 * @param {Array.<number>} b the second matrix.
 * @param {Array.<number>} r the result.
 */
lanyard.util.GLU.prototype.multMatrices = function(a, b, r) {
  for (var i = 0; i < 4; i = i + 1) {
    for (var j = 0; j < 4; j = j + 1) {
      r[i * 4 + j] =
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
    }
  }
};


/**
 * Invert a matrix.
 *
 * @param {Array.<number>} m the matrix.
 * @param {Array.<number>} invOut the inverted output.
 * @return {boolean} true if successful, false otherwise.
 */
lanyard.util.GLU.prototype.invertMatrix = function(m, invOut) {
  var inv = [];

  inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
  inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
  inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
  inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
  inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
  inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
  inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
  inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
  inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
  inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
  inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
  inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
  inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
  inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
  inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
  inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

  var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

  if (det === 0) {
    return false;
  }

  det = 1.0 / det;

  for (var i = 0; i < 16; i = i + 1) {
    invOut[i] = inv[i] * det;
  }

  return true;
};

/* EOF */
