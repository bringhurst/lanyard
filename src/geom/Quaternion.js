/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.Quaternion');

goog.require('lanyard.geom.Point');
goog.require('lanyard.geom.Angle');

/**
 * Creates a new quaternion from an initial rotation state.
 *
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 */
lanyard.geom.Quaternion = function (x, y, z, w) {
    /** @public */ this._x = x;
    /** @public */ this._y = y;
    /** @public */ this._z = z;
    /** @public */ this._w = w;

    /** @private */ this._epsilon = 0.0001;
};

/**
 * Find a string representation of this Quaternion.
 *
 * @this {lanyard.geom.Quaternion}
 * @return {string} a string representation of this Quaternion.
 */
lanyard.geom.Quaternion.prototype.toString = function () {
    return "(" + this._x + ", " + this._y + ", " + this._z + ", " + this._w + ")";
};

/**
 * Create a Quaternion from an Euler representation.
 *
 * @param {number} yaw the raw of the euler representation.
 * @param {number} pitch the pitch of the euler representation.
 * @param {number} roll the roll of the euler representation.
 * @return {lanyard.geom.Quaternion} the new Quaternion.
 */
lanyard.geom.Quaternion.prototype.fromEuler = function (yaw, pitch, roll) {
    var cy = Math.cos(yaw * 0.5);
    var cp = Math.cos(pitch * 0.5);
    var cr = Math.cos(roll * 0.5);
    var sy = Math.sin(yaw * 0.5);
    var sp = Math.sin(pitch * 0.5);
    var sr = Math.sin(roll * 0.5);

    var qw = cy * cp * cr + sy * sp * sr;
    var qx = sy * cp * cr - cy * sp * sr;
    var qy = cy * sp * cr + sy * cp * sr;
    var qz = cy * cp * sr - sy * sp * cr;

    return new lanyard.geom.Quaternion(qx, qy, qz, qw);
};

/**
 * Transforms a rotation in quaternion form to a set of Euler angles
 *
 * @param {lanyard.geom.Quaternion} q the original quaternion.
 * @return {lanyard.geom.Point} the rotation transformed to euler angles, x=yaw, y=pitch, z=roll (radians).
 */
lanyard.geom.Quaternion.prototype.toEuler = function (q) {
    var q0 = q._w;
    var q1 = q._x;
    var q2 = q._y;
    var q3 = q._z;

    var x = Math.atan2(2 * (q2 * q3 + q0 * q1), (q0 * q0 - q1 * q1 - q2 * q2 + q3 * q3));
    var y = Math.asin(-2 * (q1 * q3 - q0 * q2));
    var z = Math.atan2(2 * (q1 * q2 + q0 * q3), (q0 * q0 + q1 * q1 - q2 * q2 - q3 * q3));

    return new lanyard.geom.Point(x, y, z, 1);
};

/**
 * Create a Quaternion from axis angle.
 *
 * @param {lanyard.geom.Angle} angle
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @return {lanyard.geom.Quaternion} the new Quaternion.
 */
lanyard.geom.Quaternion.prototype.fromAxisAngle = function (angle, x, y, z) {
    var length = Math.sqrt(x * x + y * y + z * z);

    if (length > 0 && length !== 1) {
        x = x / length;
        y = y / length;
        z = z / length;
    }

    var sinAngle = angle.sinHalfAngle();
    var cosAngle = angle.cosHalfAngle();

    return new lanyard.geom.Quaternion(x * sinAngle, y * sinAngle, z * sinAngle, cosAngle);        
};

/**
 * Convert a Quaternion to an axis angle.
 * 
 * @param {lanyard.geom.Quaternion} q the quaternion.
 * @return {lanyard.geom.Point} the new point.
 */
lanyard.geom.Quaternion.prototype.toAxisAngle = function (q) {
    var x, y, z;
    q = q.normalize();

    var s = Math.sqrt(q._x * q._x + q._y * q._y + q._x * q._z);

    if (s > 0) {
        x = q._x / s;
        y = q._y / s;
        z = q._z / s;
    } else {
        x = q._x;
        y = q._y;
        z = q._z;
    }

    var angle = 2 * Math.acos(q._w);
    return new lanyard.geom.Point(x, y, z, angle);
};

/**
 * Create a new Quaternion from the addition of two Quaternions.
 *
 * @param {lanyard.geom.Quaternion} a the first Quaternion to add.
 * @param {lanyard.geom.Quaternion} b the second Quaternion to add.
 * @return {lanyard.geom.Quaterntion} the result of the addition.
 */
lanyard.geom.Quaternion.prototype.add = function (a, b) {
    return new lanyard.geom.Quaternion(a._x + b._x, a._y + b._y, a._z + b._z, a._w + b._w);
};

/**
 * Find the result of two subtracted quaternions.
 *
 * @param {lanyard.geom.Quaternion} a quaternion to subtract from.
 * @param {lanyard.geom.Quaternion} b quaternion to subtract from a.
 * @return {lanyard.geom.Quaternion} the result of the subtraction.
 */
lanyard.geom.Quaternion.prototype.subtract = function (a, b) {
    return new lanyard.geom.Quaternion(a._x - b._x, a._y - b._y, a._z - b._z, a._w - b._w);
};

/**
 * Multiply two quaternions together.
 *
 * @param {lanyard.geom.Quaternion} a the first quaternion to multiply.
 * @param {lanyard.geom.Quaternion} b the second quaternion to multiply.
 * @return {lanyard.geom.Quaternion} the result of the multiplication.
 */
lanyard.geom.Quaternion.prototype.multiply = function (a, b) {
    var result = new lanyard.geom.Quaternion(
        a._w * b._x + a._x * b._w + a._y * b._z - a._z * b._y,
        a._w * b._y + a._y * b._w + a._z * b._x - a._x * b._z,
        a._w * b._z + a._z * b._w + a._x * b._y - a._y * b._x,
        a._w * b._w - a._x * b._x - a._y * b._y - a._z * b._z);

    return result;
};

/**
 * Multiply a scalar by a quaternion.
 *
 * @param {number} s the scalar.
 * @param {lanyard.geom.Quaternion} q the quaternion.
 * @return {lanyard.geom.Quaternion} the result of the multiplication.
 */
lanyard.geom.Quaternion.prototype.multiply = function (s, q) {
    return new lanyard.geom.Quaternion(s * q._x, s * q._y, s * q._z, s * q._w);
};

/**
 * Multiply a quaternion by a scalar.
 *
 * @param {lanyard.geom.Quaternion} q the quaternion.
 * @param {number} s the scalar.
 * @return {lanyard.geom.Quaternion} the result of the multiplication.
 */
lanyard.geom.Quaternion.prototype.multiply = function (q, s) {
    return new lanyard.geom.Quaternion(s * q._x, s * q._y, s * q._z, s * q._w);
};

/**
 * Equivalent to multiplying by the quaternion (0, vector).
 *
 * @param {lanyard.geom.Point} v the vector.
 * @param {lanyard.geom.Quaternion} q the quaternion.
 * @return {lanyard.geom.Quaternion} the result of the operation.
 */
lanyard.geom.Quaternion.prototype.multiply = function (v, q) {
    var result = new lanyard.geom.Quaternion(
        v.getX() * q._w + v.getY() * q._z - v.getZ() * q._y,
        v.getY() * q._w + v.getZ() * q._x - v.getX() * q._z,
        v.getZ() * q._w + v.getX() * q._y - v.getY() * q._x,
        -v.getX() * q._x - v.getY() * q._y - v.getZ() * q._z);

    return result;
};

/**
 *
 *
 * @param {lanyard.geom.Quaternion} q
 * @param {number} s
 * @return {lanyard.geom.Quaternion}
 */
lanyard.geom.Quaternion.prototype.divide = function (q, s) {
    return lanyard.geom.Quaternion.prototype.multiply(q, (1 / s));
};

/**
 * Find the conjugate of this quaternion.
 *
 * @this {lanyard.geom.Quaternion}
 * @return {lanyard.geom.Quaternion} the conjugate of this quaternion.
 */
lanyard.geom.Quaternion.prototype.conjugate = function () {
    return new lanyard.geom.Quaternion(-this._x, -this._y, -this._z, this._w);
};

/**
 *
 *
 * @param {lanyard.geom.Quaternion} q
 * @return {number}
 */
lanyard.geom.Quaternion.prototype.norm2 = function (q) {
    return q._x * q._x + q._y * q._y + q._z * q._z + q._w * q._w;
};

/**
 *
 *
 * @param {lanyard.geom.Quaternion} q
 * @return {number}
 */
lanyard.geom.Quaternion.prototype.abs = function (q) {
    return Math.sqrt(lanyard.geom.Quaternion.prototype.norm2(q));
};

/**
 *
 *
 * @param {lanyard.geom.Quaternion} a
 * @param {lanyard.geom.Quaternion} b
 * @return {lanyard.geom.Quaternion}
 */
lanyard.geom.Quaternion.prototype.divide = function (a, b) {
    var result = lanyard.geom.Quaternion.prototype.multiply(
        a,
        lanyard.geom.Quaternion.prototype.divide(
            b.conjugate(),
            lanyard.geom.Quaternion.prototype.abs(b)
        )
    );

    return result;
};

/**
 *
 *
 * @param {lanyard.geom.Quaternion} a
 * @param {lanyard.geom.Quaternion} b
 * @return {number}
 */
lanyard.geom.Quaternion.prototype.dot = function (a, b) {
    return a._x * b._x + a._y * b._y + a._z * b._z + a._w * b._w;
};

/**
 * Create a normalized quaternion from this.
 *
 * @this {lanyard.geom.Quaternion}
 * @return {lanyard.geom.Quaternion} the normalized quaternion.
 */
lanyard.geom.Quaternion.prototype.normalize = function () {
    var len = this.length();

    return new lanyard.geom.Quaternion(
        this._x / len,
        this._y / len,
        this._z / len,
        this._w / len);
};

/**
 * Find the length of this quaternion.
 *
 * @this {lanyard.geom.Quaternion}
 * @return {number} the length of this quaternion.
 */
lanyard.geom.Quaternion.prototype.length = function () {
    return Math.sqrt(
        this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
};

/**
 *
 *
 * @param {lanyard.geom.Quaternion} q0
 * @param {lanyard.geom.Quaternion} q1
 * @param {number} t
 * @return {lanyard.geom.Quaternion}
 */
lanyard.geom.Quaternion.prototype.slerp = function (q0, q1, t) {
    var cosom = q0._x * q1._x + q0._y * q1._y + q0._z * q1._z + q0._w * q1._w;
    var tmp0, tmp1, tmp2, tmp3;

    if (cosom < 0.0) {
        cosom = -cosom;
        tmp0 = -q1._x;
        tmp1 = -q1._y;
        tmp2 = -q1._z;
        tmp3 = -q1._w;
    } else {
        tmp0 = q1._x;
        tmp1 = q1._y;
        tmp2 = q1._z;
        tmp3 = q1._w;
    }

    /* calc coeffs */
    var scale0, scale1;

    if ((1.0 - cosom) > this._epsilon) {
        // standard case (slerp)
        var omega = Math.acos(cosom);
        var sinom = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {
        /* just lerp */
        scale0 = 1.0 - t;
        scale1 = t;
    }

    return new lanyard.geom.Quaternion(
        scale0 * q0._x + scale1 * tmp0,
        scale0 * q0._y + scale1 * tmp1,
        scale0 * q0._z + scale1 * tmp2,
        scale0 * q0._w + scale1 * tmp3);
};

/**
 *
 *
 * @param {lanyard.geom.Quaternion} q
 * @return {lanyard.geom.Quaternion}
 */
lanyard.geom.Quaternion.prototype.ln = function (q) {
    var t;

    var s = Math.sqrt(q._x * q._x + q._y * q._y + q._z * q._z);
    var om = Math.atan2(s, q._w);

    if (Math.abs(s) < this._epsilon) {
        t = 0.0;
    } else {
        t = om / s;
    }

    return new lanyard.geom.Quaternion(q._x * t, q._y * t, q._z * t, 0.0);
};

/**
 *
 *
 * @param {lanyard.geom.Quaternion} q
 * @return {lanyard.geom.Quaternion}
 */
lanyard.geom.Quaternion.prototype.exp = function (q) {
    var sinom;
    var om = Math.sqrt(q._x * q._x + q._y * q._y + q._z * q._z);

    if (Math.abs(om) < this._epsilon) {
        sinom = 1.0;
    } else {
        sinom = Math.sin(om) / om;
    }

    return new lanyard.geom.Quaternion(q._x * sinom, q._y * sinom, q._z * sinom, Math.cos(om));
};

/* EOF */
