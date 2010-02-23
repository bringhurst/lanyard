/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.Plane');

goog.require('lanyard.geom.Point');

/**
 * A basic plane geometry to represent a mathematical plane in an arbitrary
 * cartesian coordinate system. A Plane is defined by a normal vector and a
 * distance along that vector from the origin, where the distance represents
 * the distance from the origin to the Plane rather than from the Plane to
 * the origin.
 * @this {lanyard.geom.Plane}
 * @constructor
 */
lanyard.geom.Plane = function (a, b, c, d) {
    /** Represents all the information about this Plane.
     * The first three values (x, y, z) represent a normal Vector to the
     * Plane, while the fourth (w) represents the signed distance this
     * Plane has been shifting along that normal.
     * @private
     * @type {lanyard.geom.Point}
     */
     this._n = new lanyard.geom.Point(a, b, c, d);
};

/**
 * Creates a Plane from the specified Point.
 * @param {lanyard.geom.Point} the point with a normal and distance to create the Plane from.
 * @return {lanyard.geom.Plane} the plane created from the point.
 */
lanyard.geom.Plane.prototype.fromPoint = function (vec) {
    if (vec.selfDot() === 0) {
        throw("geom.Plane.VectorIsZero");
    }

    return new lanyard.geom.Plane(vec.getX(), vec.getY(), vec.getZ(), vec.getW());
};

/**
 * Retrieves a Point representing the normal to this Plane.
 * @this {lanyard.geom.Plane}
 * @return {lanyard.geom.Point} a Point representing the normal to this Plane.
 */
lanyard.geom.Plane.prototype.getNormal = function () {
    return new lanyard.geom.Point(this._n.getX(), this._n.getY(), this._n.getZ(), 1);
};

/**
 * Retrieves the distance from the origin to this Plane. Two options exist for defining distance - the
 * first represents the distance from the origin to the Plane, the second represents the distance from
 * the Plane to the origin. This function uses the first method. The outcome of this is that depending
 * on the caller's view of this method, the sign of distances may appear to be reversed.
 *
 * @this {lanyard.geom.Plane}
 * @return {number} the distance between this Plane and the origin.
 */
lanyard.geom.Plane.prototype.getDistance = function () {
    return this._n.getW();
};

/**
 * Retrieves a vector representing the normal and distance to this <code>Plane</code>. The
 * vector has the structure (x, y, z, distance), where (x, y, z) represents the normal, and distance
 * represents the distance from the origin.
 *
 * @this {lanyard.geom.Plane}
 * @return {lanyard.geom.Point} a Vector representation of this Plane.
 */
lanyard.geom.Plane.prototype.getVector = function () {
    return this._n;
};

/**
 * Calculates the dot product of this Plane with Point p.
 *
 * @this {lanyard.geom.Plane}
 * @param {lanyard.geom.Point} p the Point to dot with this Plane.
 * @return {number} the dot product of p and this Plane.
 */
lanyard.geom.Plane.prototype.dot = function (p) {
    return this._n.getX() * p.getX() + this._n.getY() * p.getY() +
        this._n.getZ() * p.getZ() + this._n.getW() * p.getW();
};

/**
 * Find a string representation of this Plane.
 * @this {lanyard.geom.Plane}
 * @return {string} a string representation of this Plane.
 */
lanyard.geom.Plane.prototype.toString = function () {
    return this._n.toString();
};

/* EOF */
