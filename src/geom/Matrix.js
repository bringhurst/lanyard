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
 */

goog.provide('lanyard.geom.Matrix');

goog.require('lanyard.geom.Angle');
goog.require('lanyard.geom.Point');



/**
 * The interface Lanyard uses to interact with matrices. This interface can be implemented by an application's
 * own matrix classes. Lanyard will then use instances of those classes for matrix manipulation.
 *
 * @interface
 */
lanyard.geom.Matrix = function() {};


/**
 * Set the matrix to the identity matrix.
 *
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.setToIdentity = function() {};


/**
 * Rotate this matrix.
 *
 * @param {lanyard.geom.Angle} rotation
 * @param {number} axisX
 * @param {number} axisY
 * @param {number} axisZ
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.rotate = function(rotation, axisX, axisY, axisZ) {};


/**
 * Rotate the matrix on the x axis.
 *
 * @param {lanyard.geom.Angle} rotation
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.rotateX = function(rotation) {};


/**
 * Rotate the matrix on the y axis.
 *
 * @param {lanyard.geom.Angle} rotation
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.rotateY = function(rotation) {};


/**
 * Rotate the matrix on the z axis.
 *
 * @param {lanyard.geom.Angle} rotation
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.rotateZ = function(rotation) {};


/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.translate = function(x, y, z) {};


/**
 *
 * @param {lanyard.geom.Point} p
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.translatePoint = function(p) {};


/**
 *
 * @param {lanyard.geom.Matrix} m
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.multiply = function(m) {};


/**
 * Add this matrix to another matrix.
 *
 * @param {lanyard.geom.Matrix} m the matrix to add to.
 * @return {lanyard.geom.Matrix} the result of the addition.
 */
lanyard.geom.Matrix.prototype.add = function(m) {};


/**
 * Find the inverse of this matrix.
 *
 * @return {lanyard.geom.Matrix} the inverse of this matrix.
 */
lanyard.geom.Matrix.prototype.getInverse = function() {};


/**
 * Find the transpose of this matrix.
 *
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.getTranspose = function() {};


/**
 * Find the determiniant of this matrix.
 *
 * @return {number} the determinant.
 */
lanyard.geom.Matrix.prototype.determinant = function() {};


/**
 * Obtain the entries of this matrix.
 *
 * @return {Array.<number>} the entries in this matrix.
 */
lanyard.geom.Matrix.prototype.getEntries = function() {};


/**
 * Check if this matrix is orthonormal.
 *
 * @return {boolean} true if this matrix is orthonormal, false otherwise.
 */
lanyard.geom.Matrix.prototype.isOrthonormal = function() {};


/**
 * Transform a point based on this matrix.
 *
 * @param {lanyard.geom.Point} p the point to be transformed.
 * @return {lanyard.geom.Point} the transformed point.
 */
lanyard.geom.Matrix.prototype.transform = function(p) {};

/* EOF */
