/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.Matrix');

goog.require('lanyard.geom.Angle');
goog.require('lanyard.geom.Point');

/**
 * The interface Lanyard uses to interact with matrices. This interface can be implemented by an application's
 * own matrix classes. World Wind will then use instances of those classes for matrix manipulation.
 *
 * @interface
 */
lanyard.geom.Matrix = function () {};

/**
 * Set the matrix to the identity matrix.
 *
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.setToIdentity = function () {};

/**
 * Rotate this matrix.
 *
 * @param {lanyard.geom.Angle} rotation
 * @param {number} axisX
 * @param {number} axisY
 * @param {number} axisZ
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.rotate = function (rotation, axisX, axisY, axisZ) {};

/**
 * Rotate the matrix on the x axis.
 *
 * @param {lanyard.geom.Angle} rotation
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.rotateX = function (rotation) {};

/**
 * Rotate the matrix on the y axis.
 *
 * @param {lanyard.geom.Angle} rotation
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.rotateY = function (rotation) {};

/**
 * Rotate the matrix on the z axis.
 *
 * @param {lanyard.geom.Angle} rotation
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.rotateZ = function (rotation) {};

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.translate = function (x, y, z) {};

/**
 *
 * @param {lanyard.geom.Point} p
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.translatePoint = function (p) {};

/**
 *
 * @param {lanyard.geom.Matrix} m
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.multiply = function (m) {};

/**
 * Add this matrix to another matrix.
 *
 * @param {lanyard.geom.Matrix} m the matrix to add to.
 * @return {lanyard.geom.Matrix} the result of the addition.
 */
lanyard.geom.Matrix.prototype.add = function (m) {};

/**
 * Find the inverse of this matrix.
 *
 * @return {lanyard.geom.Matrix} the inverse of this matrix.
 */
lanyard.geom.Matrix.prototype.getInverse = function () {};

/**
 * Find the transpose of this matrix.
 *
 * @return {lanyard.geom.Matrix}
 */
lanyard.geom.Matrix.prototype.getTranspose = function () {};

/**
 * Find the determiniant of this matrix.
 *
 * @return {number} the determinant.
 */
lanyard.geom.Matrix.prototype.determinant = function () {};

/**
 * Obtain the entries of this matrix.
 *
 * @return {array.<number>} the entries in this matrix.
 */
lanyard.geom.Matrix.prototype.getEntries = function () {};

/**
 * Check if this matrix is orthonormal.
 *
 * @return {boolean} true if this matrix is orthonormal, false otherwise.
 */
lanyard.geom.Matrix.prototype.isOrthonormal = function () {};

/**
 * Transform a point based on this matrix.
 *
 * @param {lanyard.geom.Point} p the point to be transformed.
 * @return {lanyard.geom.Point} the transformed point.
 */
lanyard.geom.Matrix.prototype.transform = function (p) {};

/* EOF */
