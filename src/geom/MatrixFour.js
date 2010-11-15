/*global goog, lanyard */
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

goog.provide('lanyard.geom.MatrixFour');

goog.require('lanyard.geom.Angle');
goog.require('lanyard.geom.Point');
goog.require('lanyard.geom.Matrix');

/**
 * Creates a new MatrixFour from an array of values.
 *
 * The caller must provide at least sixteen values. Values are assigned
 * in the following order:
 *
 * (1, 1), (2, 1), (3, 1), (4, 1), (1, 2), (2, 2), (3, 2), (4, 2),
 * (3, 3), (2, 3), (3, 3), (4, 3), (1, 4), (2, 4), (3, 4), (4, 4).
 *
 * @this {lanyard.geom.MatrixFour}
 * @constructor
 * @implements {lanyard.geom.Matrix}
 * @param {Array} entries points to insert into the new matrix.
 */
lanyard.geom.MatrixFour = function (entries) {
    // default to identity matrix
    /** @private */ this._m11 = 1.0;
    /** @private */ this._m22 = 1.0;
    /** @private */ this._m33 = 1.0;
    /** @private */ this._m44 = 1.0;

    /** @private */ this._m12 = 0.0;
    /** @private */ this._m13 = 0.0;
    /** @private */ this._m14 = 1.0;

    /** @private */ this._m21 = 0.0;
    /** @private */ this._m23 = 0.0;
    /** @private */ this._m24 = 1.0;

    /** @private */ this._m31 = 0.0;
    /** @private */ this._m32 = 0.0;
    /** @private */ this._m34 = 1.0;

    /** @private */ this._m41 = 0.0;
    /** @private */ this._m42 = 0.0;
    /** @private */ this._m43 = 0.0;

    /** @private */ this._isOrthonormal = true;

    if(entries) {
        this._m11 = entries[0];
        this._m21 = entries[1];
        this._m31 = entries[2];
        this._m41 = entries[3];

        this._m12 = entries[4];
        this._m22 = entries[5];
        this._m32 = entries[6];
        this._m42 = entries[7];

        this._m13 = entries[8];
        this._m23 = entries[9];
        this._m33 = entries[10];
        this._m43 = entries[11];

        this._m14 = entries[12];
        this._m24 = entries[13];
        this._m34 = entries[14];
        this._m44 = entries[15];

        this._isOrthonormal = false;
    }
};
goog.exportSymbol('lanyard.geom.MatrixFour', lanyard.geom.MatrixFour);

/**
 * Create a string representation of this._matrix.
 * @return {string} the string representing this._matrix.
 */
lanyard.geom.MatrixFour.prototype.toString = function () {
    var ents = this.getEntries();
    var msg = "MatrixFour : \n[ ";

    var i;
    for(i = 0; i < ents.length; i++) {
        msg += ents[i] + ", ";
        if(i == 3 || i == 7 || i == 11 || i == 14) {
            msg += "\n";
        }
    }

    msg += " ]";
    return msg;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.toString', lanyard.geom.MatrixFour.prototype.toString);

/**
 * Retrieves the entries comprising this MatrixFour.
 *
 * The returned array is always 16 entries long. Values are in the following order:
 * (1, 1), (2, 1), (3, 1), (4, 1), (1, 2), (2, 2), (3, 2), (4, 2),
 * (3, 3), (2, 3), (3, 3), (4, 3), (1, 4), (2, 4), (3, 4), (4, 4).
 *
 * @return {Array} an array of all the elements in this._matrix.
 */
lanyard.geom.MatrixFour.prototype.getEntries = function () {
    var e = [];

    e[0] = this._m11;
    e[1] = this._m21;
    e[2] = this._m31;
    e[3] = this._m41;

    e[4] = this._m12;
    e[5] = this._m22;
    e[6] = this._m32;
    e[7] = this._m42;

    e[8] = this._m13;
    e[9] = this._m23;
    e[10] = this._m33;
    e[11] = this._m43;

    e[12] = this._m14;
    e[13] = this._m24;
    e[14] = this._m34;
    e[15] = this._m44;

    return e;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.getEntries', lanyard.geom.MatrixFour.prototype.getEntries);

/**
 * Sets this MatrixFour to the identity matrix.
 */
lanyard.geom.MatrixFour.prototype.setToIdentity = function () {
    this._m11 = 1;
    this._m12 = 0;
    this._m13 = 0;
    this._m14 = 0;
    this._m21 = 0;
    this._m22 = 1;
    this._m23 = 0;
    this._m24 = 0;
    this._m31 = 0;
    this._m32 = 0;
    this._m33 = 1;
    this._m34 = 0;
    this._m41 = 0;
    this._m42 = 0;
    this._m43 = 0;
    this._m44 = 1;

    this._isOrthonormal = true;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.setToIdentity', lanyard.geom.MatrixFour.prototype.setToIdentity);

/**
 * Obtains whether or not this MatrixFour is orthonormal.
 * @return {boolean} if this._matrix is orthonormal.
 */
lanyard.geom.MatrixFour.prototype.isOrthonormal = function () {
    return this._isOrthonormal;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.isOrthonormal',
    lanyard.geom.MatrixFour.prototype.isOrthonormal);

/**
 * Indicate if this MatrixFour is orthonormal.
 * @param {boolean} value if this._matrix is orthonormal.
 */
lanyard.geom.MatrixFour.prototype.setOrthonormal = function (value) {
    this._isOrthonormal = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.setOrthonormal',
    lanyard.geom.MatrixFour.prototype.setOrthonormal);

/**
 * Rotate this._matrix by some angle around an arbitrary axis. A positive <code>Angle</code> indicates an
 * anti-clockwise direction. This method affects the internal state of this._matrix.
 *
 * @param {lanyard.geom.Angle} rotation the distance to rotate this._matrix
 * @param {number} axisX the x component of the axis of rotation
 * @param {number} axisY the y component of the axis of rotation
 * @param {number} axisZ the z component of the axis of rotation
 * @return {lanyard.geom.MatrixFour} with the rotation applied
 */
lanyard.geom.MatrixFour.prototype.rotate = function (rotation, axisX, axisY, axisZ) {
    var ll = axisX * axisX + axisY * axisY + axisZ * axisZ;

    if (rotation.getDegrees() === 0 || ll === 0) {
        return this;
    }

    // if axis not unit length, normalize it    
    if (ll !== 1) {
        var l = Math.sqrt(ll);
        axisX /= l;
        axisY /= l;
        axisZ /= l;
    }

    var c = rotation.cos();
    var s = rotation.sin();
    var c1 = 1 - c;
    var o = new lanyard.geom.MatrixFour(null);

    o._m11 = c + axisX * axisX * c1;
    o._m12 = axisX * axisY * c1 - axisZ * s;
    o._m13 = axisX * axisZ * c1 + axisY * s;
    o._m14 = 0;
    o._m21 = axisX * axisY * c1 + axisZ * s;
    o._m22 = c + axisY * axisY * c1;
    o._m23 = axisY * axisZ * c1 - axisX * s;
    o._m24 = 0;
    o._m31 = axisX * axisZ * c1 - axisY * s;
    o._m32 = axisY * axisZ * c1 + axisX * s;
    o._m33 = c + axisZ * axisZ * c1;
    o._m34 = 0;
    o._m41 = 0;
    o._m42 = 0;
    o._m43 = 0;
    o._m44 = 1;

    return this.multiply(o);
};

/**
 * Rotate this MatrixFour around the x-axis.
 * A positive Angle indicates an anti-clockwise direction.
 *
 * @param {lanyard.geom.Angle} rotation the distance to rotate.
 * @return {lanyard.geom.MatrixFour} this MatrixFour, rotated around the x-axis by rotation distance.
 */
lanyard.geom.MatrixFour.prototype.rotateX = function (rotation) {
    var c = rotation.cos();
    var s = rotation.sin();

    var n12 = this._m12 * c + this._m13 * s;
    var n13 = this._m12 * -s + this._m13 * c;

    var n22 = this._m22 * c + this._m23 * s;
    var n23 = this._m22 * -s + this._m23 * c;

    var n32 = this._m32 * c + this._m33 * s;
    var n33 = this._m32 * -s + this._m33 * c;

    var n42 = this._m42 * c + this._m43 * s;
    var n43 = this._m42 * -s + this._m43 * c;

    this._m12 = n12;
    this._m13 = n13;
    this._m22 = n22;
    this._m23 = n23;
    this._m32 = n32;
    this._m33 = n33;
    this._m42 = n42;
    this._m43 = n43;

    return this;
};

/**
 * Rotate this MatrixFour around the y-axis.
 * A positive Angle indicates an anti-clockwise direction.
 * @param {lanyard.geom.Angle} rotation the distance to rotate.
 * @return {lanyard.geom.MatrixFour} this MatrixFour, rotated around the y-axis by rotation distance.
 */
lanyard.geom.MatrixFour.prototype.rotateY = function (rotation) {
    var c = rotation.cos();
    var s = rotation.sin();

    var n11 = this._m11 * c + this._m13 * -s;
    var n13 = this._m11 * s + this._m13 * c;

    var n21 = this._m21 * c + this._m23 * -s;
    var n23 = this._m21 * s + this._m23 * c;

    var n31 = this._m31 * c + this._m33 * -s;
    var n33 = this._m31 * s + this._m33 * c;

    var n41 = this._m41 * c + this._m43 * -s;
    var n43 = this._m41 * s + this._m43 * c;

    this._m11 = n11;
    this._m13 = n13;
    this._m21 = n21;
    this._m23 = n23;
    this._m31 = n31;
    this._m33 = n33;
    this._m41 = n41;
    this._m43 = n43;

    return this;
};

/**
 * Rotate this MatrixFour around the z-axis.
 * A positive Angle indicates an anti-clockwise direction.
 * @param {lanyard.geom.Angle} rotation the distance to rotate.
 * @return {lanyard.geom.MatrixFour} this MatrixFour, rotated around the z-axis by rotation distance.
 */
lanyard.geom.MatrixFour.prototype.rotateZ = function (rotation) {
    var c = rotation.cos();
    var s = rotation.sin();

    var n11 = this._m11 * c + this._m12 * s;
    var n12 = this._m11 * -s + this._m12 * c;

    var n21 = this._m21 * c + this._m22 * s;
    var n22 = this._m21 * -s + this._m22 * c;

    var n31 = this._m31 * c + this._m32 * s;
    var n32 = this._m31 * -s + this._m32 * c;

    var n41 = this._m41 * c + this._m42 * s;
    var n42 = this._m41 * -s + this._m42 * c;

    this._m11 = n11;
    this._m12 = n12;
    this._m21 = n21;
    this._m22 = n22;
    this._m31 = n31;
    this._m32 = n32;
    this._m41 = n41;
    this._m42 = n42;

    return this;
};

/**
 * Translates this MatrixFour in three dimensional space.
 * @param {number} x the distance to translate along the x-axis
 * @param {number} y the distance to translate along the y-axis
 * @param {number} z the distance to translate along the z-axis
 * @return {lanyard.geom.MatrixFour} this matrix, translated by (x, y, z)
 */
lanyard.geom.MatrixFour.prototype.translate = function (x, y, z) {
    /***
    this._m14 = this._m11 * x + this._m12 * y + this._m13 * z + this._m14;
    this._m24 = this._m21 * x + this._m22 * y + this._m23 * z + this._m24;
    this._m34 = this._m31 * x + this._m32 * y + this._m33 * z + this._m34;
    this._m44 = this._m41 * x + this._m42 * y + this._m43 * z + this._m44;
    **/

    this._m14 *= x;
    this._m24 *= y;
    this._m34 *= z;

    return this;
};

/**
 * Translates this MatrixFour in three dimansional space.
 * The x, y and z co-ordinates are used to translate along the x, y and z axes respectively.
 * @param {lanyard.geom.Point} p the x, y and z distances to translate as a Point.
 * @return {lanyard.geom.MatrixFour} this MatrixFour, translated by the distances defined in p.
 */
lanyard.geom.MatrixFour.prototype.translatePoint = function (p) {
    return this.translate(p.getX(), p.getY(), p.getZ());
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.translatePoint',
    lanyard.geom.MatrixFour.prototype.translatePoint);

/**
 * Adds this another MatrixFour to this one.
 *
 * @param {lanyard.geom.MatrixFour} m the MatrixFour to add to this one.
 * @return {lanyard.geom.MatrixFour} this MatrixFour, with m added to it.
 */
lanyard.geom.MatrixFour.prototype.add = function (m) {
    var o = m;

    this._m11 += o._m11;
    this._m12 += o._m12;
    this._m13 += o._m13;
    this._m14 += o._m14;
    this._m21 += o._m21;
    this._m22 += o._m22;
    this._m23 += o._m23;
    this._m24 += o._m24;
    this._m31 += o._m31;
    this._m32 += o._m32;
    this._m33 += o._m33;
    this._m34 += o._m34;
    this._m41 += o._m41;
    this._m42 += o._m42;
    this._m43 += o._m43;
    this._m44 += o._m44;

    this._isOrthonormal = this._isOrthonormal || o.isOrthonormal();

    return this;
};

/**
 * Performs a cross multiplication with another MatrixFour.
 *
 * @param {lanyard.geom.MatrixFour} m another MatrixFour.
 * @return {lanyard.geom.MatrixFour} this, postmultiplied by m.
 */
lanyard.geom.MatrixFour.prototype.multiply = function (m) {
    var o = m;

    var n11 = this._m11 * o._m11 + this._m12 * o._m21 + this._m13 * o._m31 + this._m14 * o._m41;
    var n12 = this._m11 * o._m12 + this._m12 * o._m22 + this._m13 * o._m32 + this._m14 * o._m42;
    var n13 = this._m11 * o._m13 + this._m12 * o._m23 + this._m13 * o._m33 + this._m14 * o._m43;
    var n14 = this._m11 * o._m14 + this._m12 * o._m24 + this._m13 * o._m34 + this._m14 * o._m44;

    var n21 = this._m21 * o._m11 + this._m22 * o._m21 + this._m23 * o._m31 + this._m24 * o._m41;
    var n22 = this._m21 * o._m12 + this._m22 * o._m22 + this._m23 * o._m32 + this._m24 * o._m42;
    var n23 = this._m21 * o._m13 + this._m22 * o._m23 + this._m23 * o._m33 + this._m24 * o._m43;
    var n24 = this._m21 * o._m14 + this._m22 * o._m24 + this._m23 * o._m34 + this._m24 * o._m44;

    var n31 = this._m31 * o._m11 + this._m32 * o._m21 + this._m33 * o._m31 + this._m34 * o._m41;
    var n32 = this._m31 * o._m12 + this._m32 * o._m22 + this._m33 * o._m32 + this._m34 * o._m42;
    var n33 = this._m31 * o._m13 + this._m32 * o._m23 + this._m33 * o._m33 + this._m34 * o._m43;
    var n34 = this._m31 * o._m14 + this._m32 * o._m24 + this._m33 * o._m34 + this._m34 * o._m44;

    var n41 = this._m41 * o._m11 + this._m42 * o._m21 + this._m43 * o._m31 + this._m44 * o._m41;
    var n42 = this._m41 * o._m12 + this._m42 * o._m22 + this._m43 * o._m32 + this._m44 * o._m42;
    var n43 = this._m41 * o._m13 + this._m42 * o._m23 + this._m43 * o._m33 + this._m44 * o._m43;
    var n44 = this._m41 * o._m14 + this._m42 * o._m24 + this._m43 * o._m34 + this._m44 * o._m44;

    this._m11 = n11;
    this._m12 = n12;
    this._m13 = n13;
    this._m14 = n14;
    this._m21 = n21;
    this._m22 = n22;
    this._m23 = n23;
    this._m24 = n24;
    this._m31 = n31;
    this._m32 = n32;
    this._m33 = n33;
    this._m34 = n34;
    this._m41 = n41;
    this._m42 = n42;
    this._m43 = n43;
    this._m44 = n44;

    this.isOrtho = this.isOrtho || o.isOrthonormal();

    return this;
};

/**
 * Obtains the transpose of this MatrixFour.
 * @return {lanyard.geom.MatrixFour} the transpoase of this MatrixFour.
 */
lanyard.geom.MatrixFour.prototype.getTranspose = function () {
    var transpose = new lanyard.geom.MatrixFour(null);

    transpose._m11 = this._m11;
    transpose._m12 = this._m21;
    transpose._m13 = this._m31;
    transpose._m14 = this._m41;
    transpose._m21 = this._m12;
    transpose._m22 = this._m22;
    transpose._m23 = this._m32;
    transpose._m24 = this._m42;
    transpose._m31 = this._m13;
    transpose._m32 = this._m23;
    transpose._m33 = this._m33;
    transpose._m34 = this._m43;
    transpose._m41 = this._m14;
    transpose._m42 = this._m24;
    transpose._m43 = this._m34;
    transpose._m44 = this._m44;

    transpose.setOrthonormal(this._isOrthonormal);

    return transpose;
};

/**
 * Obtain the inverse of this MatrixFour.
 * @return {lanyard.geom.MatrixFour} the inverse of this MatrixFour.
 */
lanyard.geom.MatrixFour.prototype.getInverse = function () {
    var inverse;

    if (this._isOrthonormal) {
        inverse = this.orthonormalInverse();
    } else {
        inverse = this.generalInverse();
    }

    inverse.setOrthonormal(this._isOrthonormal);

    return inverse;
};

/**
 * Find the orthonormal inverse of the current matrix.
 * @return {lanyard.geom.MatrixFour} the orthonormal inverse of the current matrix.
 */
lanyard.geom.MatrixFour.prototype.orthonormalInverse = function () {
    var inverse = new lanyard.geom.MatrixFour(null);

    // Transpose of upper 3x3.
    inverse._m11 = this._m11;
    inverse._m12 = this._m21;
    inverse._m13 = this._m31;

    inverse._m21 = this._m12;
    inverse._m22 = this._m22;
    inverse._m23 = this._m32;

    inverse._m31 = this._m13;
    inverse._m32 = this._m23;
    inverse._m33 = this._m33;

    // Upper 3x3 inverse times current translation (4th column).
    inverse._m14 = -(inverse._m11 * this._m14 + inverse._m12 * this._m24 + inverse._m13 * this._m34);
    inverse._m24 = -(inverse._m21 * this._m14 + inverse._m22 * this._m24 + inverse._m23 * this._m34);
    inverse._m34 = -(inverse._m31 * this._m14 + inverse._m32 * this._m24 + inverse._m33 * this._m34);

    return inverse;
};


/**
 * Find the general inverse of this matrix.
 *
 * TODO: fix generalInverse. It's not producing correct inverses.
 *
 * @return {lanyard.geom.MatrixFour} the inverse of this matrix.
 */
lanyard.geom.MatrixFour.prototype.generalInverse = function () {
    var d = this.determinant();

    if (d === 0) {
        return null;
    }

    var id = 1 / d;
    var inverse = new lanyard.geom.MatrixFour(null);

    // Form the adjoint matrix.
    var a1 = this._m33 * this._m44 - this._m34 * this._m43;
    var a2 = this._m34 * this._m42 - this._m32 * this._m44;
    var a3 = this._m32 * this._m43 - this._m33 * this._m42;
    var a4 = this._m23 * this._m44 - this._m24 * this._m43;
    var a5 = this._m24 * this._m42 - this._m22 * this._m44;
    var a6 = this._m23 * this._m34 - this._m24 * this._m33;
    var a7 = this._m22 * this._m33 - this._m23 * this._m32;
    var a8 = this._m34 * this._m41 - this._m31 * this._m44;
    var a9 = this._m31 * this._m43 - this._m33 * this._m41;
    var a21 = this._m24 * this._m41 - this._m21 * this._m44;
    var a22 = this._m24 * this._m31 - this._m21 * this._m34;
    var a23 = this._m32 * this._m44 - this._m34 * this._m42;
    var a24 = this._m31 * this._m42 - this._m32 * this._m41;
    var a14 = this._m21 * this._m42 - this._m22 * this._m41;
    var a15 = this._m21 * this._m32 - this._m22 * this._m31;
    var a16 = this._m33 * this._m41 - this._m31 * this._m43;

    inverse._m11 = id *
        this._m22 * a1 +
        this._m23 * a2 +
        this._m24 * a3;
    inverse._m12 = -id *
        this._m12 * a1 +
        this._m13 * a2 +
        this._m14 * a3;
    inverse._m13 = id *
        this._m12 * a4 +
        this._m13 * (this._m24 * this._m42 - this._m22 * this._m44) +
        this._m14 * a5;
    inverse._m14 = -id *
        this._m12 * a6 +
        this._m13 * (this._m24 * this._m32 - this._m22 * this._m34) +
        this._m14 * a7;
    inverse._m21 = -id *
        this._m21 * a1 +
        this._m23 * a8 +
        this._m24 * a9;
    inverse._m22 = id *
        this._m11 * a1 +
        this._m13 * a8 +
        this._m14 * a9;
    inverse._m23 = -id *
        this._m11 * a4 +
        this._m13 * a21 +
        this._m14 * (this._m21 * this._m43 - this._m23 * this._m41);
    inverse._m24 = -id *
        this._m11 * a6 +
        this._m13 * a22 +
        this._m14 * (this._m21 * this._m33 - this._m23 * this._m31);
    inverse._m31 = id *
        this._m21 * a23 +
        this._m22 * a8 +
        this._m24 * a24;
    inverse._m32 = -id *
        this._m11 * a23 +
        this._m12 * a8 +
        this._m14 * a24;
    inverse._m33 = -id *
        this._m11 * (this._m22 * this._m44 - this._m24 * this._m42) +
        this._m12 * a21 +
        this._m14 * a14;
    inverse._m34 = id *
        this._m11 * (this._m22 * this._m34 - this._m24 * this._m32) +
        this._m12 * a22 +
        this._m14 * a15;
    inverse._m41 = -id *
        this._m21 * a3 +
        this._m22 * a16 +
        this._m23 * a24;
    inverse._m42 = -id *
        this._m11 * a3 +
        this._m12 * a16 +
        this._m13 * a24;
    inverse._m43 = id *
        this._m11 * a5 +
        this._m12 * (this._m23 * this._m41 - this._m21 * this._m43) +
        this._m13 * a14;
    inverse._m44 = -id *
        this._m11 * a7 +
        this._m12 * (this._m23 * this._m31 - this._m21 * this._m33) +
        this._m13 * a15;

    return inverse;
};

/**
 * Obtains the determinant of this MatrixFour.
 * @return {number} the determinant
 */
lanyard.geom.MatrixFour.prototype.determinant = function () {
    var det = this._m11 * (
        (this._m22 * this._m33 * this._m44 + this._m23 * this._m34 * this._m42 + this._m24 * this._m32 * this._m43) -
            this._m24 * this._m33 * this._m42 -
            this._m22 * this._m34 * this._m43 -
            this._m23 * this._m32 * this._m44) -
        this._m12 * (
        (this._m21 * this._m33 * this._m44 + this._m23 * this._m34 * this._m41 + this._m24 * this._m31 * this._m43) -
            this._m24 * this._m33 * this._m41 -
            this._m21 * this._m34 * this._m43 -
            this._m23 * this._m31 * this._m44) +
        this._m13 * (
        (this._m21 * this._m32 * this._m44 + this._m22 * this._m34 * this._m41 + this._m24 * this._m31 * this._m42) -
            this._m24 * this._m32 * this._m41 -
            this._m21 * this._m34 * this._m42 -
            this._m22 * this._m31 * this._m44) -
        this._m14 * (
        (this._m21 * this._m32 * this._m43 + this._m22 * this._m33 * this._m41 + this._m23 * this._m31 * this._m42) -
            this._m23 * this._m32 * this._m41 -
            this._m21 * this._m33 * this._m42 -
            this._m22 * this._m31 * this._m43);
    return det;
};

/**
 * Applies this MatrixFour to a Point.
 * @param {lanyard.geom.Point} p the Point to transform.
 * @return {lanyard.geom.Point} the point, transformed by the current state of this MatrixFour.
 */
lanyard.geom.MatrixFour.prototype.transform = function (p) {
    var x = this._m11 * p.getX() + this._m12 * p.getY() + this._m13 * p.getZ() + this._m14 * p.getW();
    var y = this._m21 * p.getX() + this._m22 * p.getY() + this._m23 * p.getZ() + this._m24 * p.getW();
    var z = this._m31 * p.getX() + this._m32 * p.getY() + this._m33 * p.getZ() + this._m34 * p.getW();
    var w = this._m41 * p.getX() + this._m42 * p.getY() + this._m43 * p.getZ() + this._m44 * p.getW();

    return new lanyard.geom.Point(x, y, z, w);
};

/**
 * Accessor for value in position 11.
 *
 * @public
 * @return {number} the value in position 11.
 */
lanyard.geom.MatrixFour.prototype.get11 = function () {
    return this._m11;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get11',
    lanyard.geom.MatrixFour.prototype.get11);

/**
 * Mutator for value in position 11.
 *
 * @public
 * @param {number} value the new value for position 11.
 */
lanyard.geom.MatrixFour.prototype.set11 = function (value) {
    this._m11 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set11',
    lanyard.geom.MatrixFour.prototype.set11);

/**
 * Accessor for value in position 22.
 *
 * @public
 * @return {number} the value in position 22.
 */
lanyard.geom.MatrixFour.prototype.get22 = function () {
    return this._m22;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get22',
    lanyard.geom.MatrixFour.prototype.get22);

/**
 * Mutator for value in position 22.
 *
 * @public
 * @param {number} value the new value for position 22.
 */
lanyard.geom.MatrixFour.prototype.set22 = function (value) {
    this._m22 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set22',
    lanyard.geom.MatrixFour.prototype.set22);

/**
 * Accessor for value in position 33.
 *
 * @public
 * @return {number} the value in position 33.
 */
lanyard.geom.MatrixFour.prototype.get33 = function () {
    return this._m33;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get33',
    lanyard.geom.MatrixFour.prototype.get33);

/**
 * Mutator for value in position 33.
 *
 * @public
 * @param {number} value the new value for position 33.
 */
lanyard.geom.MatrixFour.prototype.set33 = function (value) {
    this._m33 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set33',
    lanyard.geom.MatrixFour.prototype.set33);

/**
 * Accessor for value in position 44.
 *
 * @public
 * @return {number} the value in position 44.
 */
lanyard.geom.MatrixFour.prototype.get44 = function () {
    return this._m44;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get44',
    lanyard.geom.MatrixFour.prototype.get44);

/**
 * Mutator for value in position 44.
 *
 * @public
 * @param {number} value the new value for position 44.
 */
lanyard.geom.MatrixFour.prototype.set44 = function (value) {
    this._m44 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set44',
    lanyard.geom.MatrixFour.prototype.set44);

/**
 * Accessor for value in position 12.
 *
 * @public
 * @return {number} the value in position 12.
 */
lanyard.geom.MatrixFour.prototype.get12 = function () {
    return this._m12;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get12',
    lanyard.geom.MatrixFour.prototype.get12);

/**
 * Mutator for value in position 12.
 *
 * @public
 * @param {number} value the new value for position 12.
 */
lanyard.geom.MatrixFour.prototype.set12 = function (value) {
    this._m12 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set12',
    lanyard.geom.MatrixFour.prototype.set12);

/**
 * Accessor for value in position 13.
 *
 * @public
 * @return {number} the value in position 13.
 */
lanyard.geom.MatrixFour.prototype.get13 = function () {
    return this._m13;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get13',
    lanyard.geom.MatrixFour.prototype.get13);

/**
 * Mutator for value in position 13.
 *
 * @public
 * @param {number} value the new value for position 13.
 */
lanyard.geom.MatrixFour.prototype.set13 = function (value) {
    this._m13 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set13',
    lanyard.geom.MatrixFour.prototype.set13);

/**
 * Accessor for value in position 14.
 *
 * @public
 * @return {number} the value in position 14.
 */
lanyard.geom.MatrixFour.prototype.get14 = function () {
    return this._m14;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get14',
    lanyard.geom.MatrixFour.prototype.get14);

/**
 * Mutator for value in position 14.
 *
 * @public
 * @param {number} value the new value for position 14.
 */
lanyard.geom.MatrixFour.prototype.set14 = function (value) {
    this._m14 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set14',
    lanyard.geom.MatrixFour.prototype.set14);

/**
 * Accessor for value in position 21.
 *
 * @public
 * @return {number} the value in position 21.
 */
lanyard.geom.MatrixFour.prototype.get21 = function () {
    return this._m21;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get21',
    lanyard.geom.MatrixFour.prototype.get21);

/**
 * Mutator for value in position 21.
 *
 * @public
 * @param {number} value the new value for position 21.
 */
lanyard.geom.MatrixFour.prototype.set21 = function (value) {
    this._m21 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set21',
    lanyard.geom.MatrixFour.prototype.set21);

/**
 * Accessor for value in position 23.
 *
 * @public
 * @return {number} the value in position 23.
 */
lanyard.geom.MatrixFour.prototype.get23 = function () {
    return this._m23;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get23',
    lanyard.geom.MatrixFour.prototype.get23);

/**
 * Mutator for value in position 23.
 *
 * @public
 * @param {number} value the new value for position 23.
 */
lanyard.geom.MatrixFour.prototype.set23 = function (value) {
    this._m23 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set23',
    lanyard.geom.MatrixFour.prototype.set23);

/**
 * Accessor for value in position 24.
 *
 * @public
 * @return {number} the value in position 24.
 */
lanyard.geom.MatrixFour.prototype.get24 = function () {
    return this._m24;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get24',
    lanyard.geom.MatrixFour.prototype.get24);

/**
 * Mutator for value in position 24.
 *
 * @public
 * @param {number} value the new value for position 24.
 */
lanyard.geom.MatrixFour.prototype.set24 = function (value) {
    this._m24 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set24',
    lanyard.geom.MatrixFour.prototype.set24);

/**
 * Accessor for value in position 31.
 *
 * @public
 * @return {number} the value in position 31.
 */
lanyard.geom.MatrixFour.prototype.get31 = function () {
    return this._m31;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get31',
    lanyard.geom.MatrixFour.prototype.get31);

/**
 * Mutator for value in position 31.
 *
 * @public
 * @param {number} value the new value for position 31.
 */
lanyard.geom.MatrixFour.prototype.set31 = function (value) {
    this._m31 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set31',
    lanyard.geom.MatrixFour.prototype.set31);

/**
 * Accessor for value in position 32.
 *
 * @public
 * @return {number} the value in position 32.
 */
lanyard.geom.MatrixFour.prototype.get32 = function () {
    return this._m32;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get32',
    lanyard.geom.MatrixFour.prototype.get32);

/**
 * Mutator for value in position 32.
 *
 * @public
 * @param {number} value the new value for position 32.
 */
lanyard.geom.MatrixFour.prototype.set32 = function (value) {
    this._m32 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set32',
    lanyard.geom.MatrixFour.prototype.set32);

/**
 * Accessor for value in position 34.
 *
 * @public
 * @return {number} the value in position 34.
 */
lanyard.geom.MatrixFour.prototype.get34 = function () {
    return this._m34;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get34',
    lanyard.geom.MatrixFour.prototype.get34);

/**
 * Mutator for value in position 34.
 *
 * @public
 * @param {number} value the new value for position 34.
 */
lanyard.geom.MatrixFour.prototype.set34 = function (value) {
    this._m34 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set34',
    lanyard.geom.MatrixFour.prototype.set34);

/**
 * Accessor for value in position 41.
 *
 * @public
 * @return {number} the value in position 41.
 */
lanyard.geom.MatrixFour.prototype.get41 = function () {
    return this._m41;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get41',
    lanyard.geom.MatrixFour.prototype.get41);

/**
 * Mutator for value in position 41.
 *
 * @public
 * @param {number} value the new value for position 41.
 */
lanyard.geom.MatrixFour.prototype.set41 = function (value) {
    this._m41 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set41',
    lanyard.geom.MatrixFour.prototype.set41);

/**
 * Accessor for value in position 42.
 *
 * @public
 * @return {number} the value in position 42.
 */
lanyard.geom.MatrixFour.prototype.get42 = function () {
    return this._m42;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get42',
    lanyard.geom.MatrixFour.prototype.get42);

/**
 * Mutator for value in position 42.
 *
 * @public
 * @param {number} value the new value for position 42.
 */
lanyard.geom.MatrixFour.prototype.set42 = function (value) {
    this._m42 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set42',
    lanyard.geom.MatrixFour.prototype.set42);

/**
 * Accessor for value in position 43.
 *
 * @public
 * @return {number} the value in position 43.
 */
lanyard.geom.MatrixFour.prototype.get43 = function () {
    return this._m43;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.get43',
    lanyard.geom.MatrixFour.prototype.get43);

/**
 * Mutator for value in position 43.
 *
 * @public
 * @param {number} value the new value for position 43.
 */
lanyard.geom.MatrixFour.prototype.set43 = function (value) {
    this._m43 = value;
};
goog.exportSymbol('lanyard.geom.MatrixFour.prototype.set43',
    lanyard.geom.MatrixFour.prototype.set43);

/* EOF */
