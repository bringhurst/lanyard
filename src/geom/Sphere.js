/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/** Represents a sphere in three dimensional space. */
goog.provide('lanyard.geom.Sphere');

goog.require('lanyard.Renderable');
goog.require('lanyard.DrawContext');

goog.require('lanyard.geom.Extent');
goog.require('lanyard.geom.Point');
goog.require('lanyard.geom.Intersection');
goog.require('lanyard.geom.Line');
goog.require('lanyard.geom.Plane');

/**
 * Creates a new Sphere from a given center and radius.
 * Radius must be positive (that is, greater than zero),
 * and center may not be null.
 *
 * @constructor
 * @implements {lanyard.geom.Extent}
 * @implements {lanyard.Renderable}
 * @this {lanyard.geom.Sphere}
 * @param {lanyard.geom.Point} center the center of the new sphere.
 * @param {Number} radius the radius of the new sphere.
 */
lanyard.geom.Sphere = function (center, radius) {
    /** @private */ this._center = center;
    /** @private */ this._radius = radius;
};
goog.exportSymbol('lanyard.geom.Sphere', lanyard.geom.Sphere);

/**
 * Define a unit sphere.
 *
 * @const
 * @type {lanyard.geom.Sphere}
 */
lanyard.geom.Sphere.prototype.UNIT_SPHERE = function () {
    return new lanyard.geom.Sphere(lanyard.geom.Point.prototype.ZERO, 1);
};
goog.exportSymbol('lanyard.geom.Sphere.prototype.UNIT_SPHERE',
    lanyard.geom.Sphere.prototype.UNIT_SPHERE);

/**
 * Creates a sphere that completely contains a set of points.
 *
 * @param {Array.<lanyard.geom.Point>} points the Points to be enclosed by the new Sphere.
 * @return {lanyard.geom.Sphere} a Sphere encompassing the given array of Points.
 */
lanyard.geom.Sphere.prototype.createBoundingSphere = function (points) {
    // Creates the sphere around the axis aligned bounding box of the input points.
    var extrema = lanyard.geom.Point.prototype.composeExtrema(points);
    var center = lanyard.geom.Point.prototype.midPoint(extrema[0], extrema[1]);
    var radius = 0.5 * extrema[0].distanceTo(extrema[1]);

    return new lanyard.geom.Sphere(center, radius);
};

/**
 * Obtains the radius of this Sphere. The radus is the distance from the center to the surface. If an
 * object's distance to this sphere's center is less than or equal to the radius, then that object is at least
 * partially within this Sphere.
 *
 * @return {Number} the radius of this sphere
 */
lanyard.geom.Sphere.prototype.getRadius = function () {
    return this._radius;
};

/**
 * Obtains the diameter of this Sphere. The diameter is twice the radius.
 *
 * @return {Number} the diameter of this Sphere.
 */
lanyard.geom.Sphere.prototype.getDiameter = function () {
    return 2 * this._radius;
};

/**
 * Obtains the center of this Sphere.
 *
 * @return {lanyard.geom.Point} the Point situated at the center of this Sphere.
 */
lanyard.geom.Sphere.prototype.getCenter = function () {
    return this._center;
};

/**
 * Obtains the intersections of this sphere with a line. The returned array may be
 * either null or of zero length if no intersections are discovered. It does not contain
 * null elements and will have a size of 2 at most. Tangential intersections are marked
 * as such. line is considered to have infinite length in both directions.
 *
 * @param {lanyard.geom.Line} line the Line with which to intersect this Sphere.
 * @return {Array.<lanyard.geom.Intersection>} an array containing all the intersections of this Sphere and line.
 */
lanyard.geom.Sphere.prototype.intersect = function (line) {
    var a = line.getDirection().selfDot();
    var b = 2 * line.selfDot();
    var c = line.getOrigin().selfDot() - this._radius * this._radius;

    var discriminant = lanyard.geom.Sphere.prototype.discriminant(a, b, c);
    if (discriminant < 0) {
        return null;
    }

    var discriminantRoot = Math.sqrt(discriminant);
    if (discriminant === 0) {
        var p = line.getPointAt((-b - discriminantRoot) / (2 * a));
        return [new lanyard.geom.Intersection(p, true)];
    } else { // (discriminant > 0)
        var near = line.getPointAt((-b - discriminantRoot) / (2 * a));
        var far = line.getPointAt((-b + discriminantRoot) / (2 * a));
        return [new lanyard.geom.Intersection(near, false), new lanyard.geom.Intersection(far, false)];
    }
};

/**
 * Calculates a discriminant. A discriminant is useful to determine the number of
 * roots to a quadratic equation. If the discriminant is less than zero, there are
 * no roots. If it equals zero, there is one root. If it is greater than zero, there
 * are two roots.
 *
 * @param {Number} a the coefficient of the second order pronumeral.
 * @param {Number} b the coefficient of the first order pronumeral.
 * @param {Number} c the constant parameter in the quadratic equation.
 * @return {Number} the discriminant "b squared minus 4ac".
 */
lanyard.geom.Sphere.prototype.discriminant = function (a, b, c) {
    return b * b - 4 * a * c;
};

/**
 * Tests for intersection with a Frustum. This operation is commutative, so
 * someSphere.intersects(frustum) and frustum.intersects(someSphere) are equivalent.
 *
 * @param {lanyard.geom.Frustum} frustum the Frustum with which to test for intersection
 * @return {Boolean} true if either frustum or this Sphere wholly or partially contain the other.
 */
lanyard.geom.Sphere.prototype.intersectsFrustum = function (frustum) {
    return frustum.intersects(this);
};

/**
 * Tests for intersection with a Line.
 *
 * @param {lanyard.geom.Line} line the Line with which to test for intersection.
 * @return {Boolean} true if line intersects or makes a tangent with the surface of this Sphere.
 */
lanyard.geom.Sphere.prototype.intersectsLine = function (line) {
    return line.distanceTo(this._center) <= this._radius;
};

/**
 * Tests for intersection with a Plane.
 *
 * @param {lanyard.geom.Plane} plane the Plane with which to test for intersection.
 * @return {Boolean} true if plane intersects or makes a tangent with the surface of this Sphere.
 */
lanyard.geom.Sphere.prototype.intersectsPlane = function (plane) {
    var dq1 = plane.dot(this._center);
    return new Boolean(dq1 <= this._radius);
};

/**
 * Causes this Sphere to render itself using the DrawContext provided.
 *
 * @param {lanyard.DrawContext} dc the DrawContext to be used.
 */
lanyard.geom.Sphere.prototype.render = function (dc) {
    var gl = dc.getGL();
/***
    gl.glPushAttrib(gl.GL_TEXTURE_BIT && gl.GL_ENABLE_BIT && gl.GL_CURRENT_BIT);
    gl.glDisable(gl.GL_TEXTURE_2D);
    gl.glColor3d(1, 1, 0);

    gl.glMatrixMode(gl.GL_MODELVIEW);
    gl.glPushMatrix();
    gl.glTranslated(this._center.getX(), this._center.getY(), this._center.getZ());

    // glu.GLUquadric
    var quadric = dc.getGLU().gluNewQuadric();

    dc.getGLU().gluQuadricDrawStyle(quadric, gl.glu.GLU.GLU_LINE);
    dc.getGLU().gluSphere(quadric, this._radius, 10, 10);
    gl.glPopMatrix();
    dc.getGLU().gluDeleteQuadric(quadric);

    gl.glPopAttrib();
****/
};

/**
 * Obtain a string representation of this sphere.
 * 
 * @return {String} a string representation of this sphere.
 */
lanyard.geom.Sphere.prototype.toString = function () {
    return new String("Sphere: center = " + this._center.toString() + " radius = " + this._radius);
};

/* EOF */
