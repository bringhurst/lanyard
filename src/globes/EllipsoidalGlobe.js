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

goog.provide('lanyard.globes.EllipsoidalGlobe');

goog.require('lanyard.ElevationModel');
goog.require('lanyard.Globe');

/**
 * An ellipsoidal globe
 *
 * @constructor
 * @implements {lanyard.Globe}
 * @this {lanyard.globes.EllipsoidalGlobe}
 * @param {number} equatorialRadius the equatorial radius of this globe.
 * @param {number} polarRadius the polar radius of this globe.
 * @param {number} es the eccentricity squared of this globe.
 * @param {lanyard.ElevationModel} em the elevation model for this globe.
 */
lanyard.globes.EllipsoidalGlobe = function(equatorialRadius, polarRadius, es, em) {
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.globes.EllipsoidalGlobe');

    /** @private */ this.equatorialRadius = equatorialRadius;
    /** @private */ this.polarRadius = polarRadius;
    /** @private */ this.es = es; // assume it's consistent with the two radii
    /** @private */ this.center = lanyard.geom.Point.prototype.ZERO;

    /** @public */ this.elevationModel = em;
};
goog.exportSymbol('lanyard.globes.EllipsoidalGlobe', lanyard.globes.EllipsoidalGlobe);

/**
 * Accessor for the radius of this globe.
 *
 * @return {number} the radius of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getRadius = function() {
    return this.equatorialRadius;
};

/**
 * Accessor for the equatorial radius of this globe.
 *
 * @return {number} the equatorial radius of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getEquatorialRadius = function() {
    return this.equatorialRadius;
};

/**
 * Accessor for the polar radius of this globe.
 *
 * @return {number} the polar radius of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getPolarRadius = function() {
    return this.polarRadius;
};

/**
 * Accessor for the maximum radius of this globe.
 *
 * @return {number} the maximum radius of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getMaximumRadius = function() {
    return this.equatorialRadius;
};

/**
 * Calculate the radius at a specific coordinate on this globe.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude of the coordinate.
 * @return {number} the radius at the specified coordinate.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getRadiusAt = function(latitude, longitude) {
    /** @type {lanyard.geom.Point} */
    var p = this.computePointFromPositionAngles(latitude, longitude, 0);

    /** @type {number} */
    var rad = p.length();

    return rad;
};

/**
 * Accessor for the eccentricity squared of this globe.
 *
 * @return {number} the eccentricity squared of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getEccentricitySquared = function() {
    return this.es;
};

/**
 * Calculate the diameter of this globe from the equatorial radius.
 *
 * @return {number} the diameter of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getDiameter = function() {
    return this.equatorialRadius * 2;
};

/**
 * Calculate the center point of this globe.
 *
 * @return {lanyard.geom.Point} the center point of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getCenter = function() {
    return this.center;
};

/**
 * Get the maximum elevation of this globe.
 *
 * @return {number} the maximum elevation of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getMaxElevation = function() {
    if (this.elevationModel) {
        return this.elevationModel.getMaximumElevation();
    } else {
        return 0;
    }
};

/**
 * Get the minimum elevation of this globe.
 *
 * @return {number} the minimum elevation of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getMinElevation = function() {
    if (this.elevationModel) {
        return this.elevationModel.getMinimumElevation();
    } else {
        return 0;
    }
};

/**
 * Find the extent of this globe.
 *
 * @return {lanyard.geom.Extent} the extent of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getExtent = function() {
    return this;
};

/**
 * Determine if this globe intersects with the given frustum.
 *
 * @param {lanyard.geom.Frustum} frustum the frustum to test intersection with.
 * @return {boolean} if this globe interesects with the given frustum.
 */
lanyard.globes.EllipsoidalGlobe.prototype.intersectsFrustum = function(frustum) {
    return frustum.intersects(this);
};

/**
 * Find the intersections with this globe and a given line.
 *
 * Taken from Lengyel, 2Ed., Section 5.2.3, page 148.
 *
 * @param {lanyard.geom.Line} line the line to find intersections for.
 * @return {Array.<lanyard.geom.Intersection>} the intersections of this globe with the given line.
 */
lanyard.globes.EllipsoidalGlobe.prototype.intersect = function(line) {
    /** @type {number} */
    var m = this.equatorialRadius / this.polarRadius;

    /** @type {number} */
    var n = 1; //this.equatorialRadius / this.equatorialRadius;

    /** @type {number} */
    var m2 = m * m;

    /** @type {number} */
    var n2 = n * n;

    /** @type {number} */
    var vx = line.getDirection().getX();

    /** @type {number} */
    var vy = line.getDirection().getY();

    /** @type {number} */
    var vz = line.getDirection().getZ();

    /** @type {number} */
    var sx = line.getOrigin().getX();

    /** @type {number} */
    var sy = line.getOrigin().getY();

    /** @type {number} */
    var sz = line.getOrigin().getZ();

    /** @type {number} */
    var a = vx * vx + m2 * vy * vy + n2 * vz * vz;

    /** @type {number} */
    var b = 2 * (sx * vx + m2 * sy * vy + n2 * sz * vz);

    /** @type {number} */
    var c = sx * sx + m2 * sy * sy + n2 * sz * sz - this.equatorialRadius * this.equatorialRadius;

    /** @type {number} */
    var discriminant = this.discriminant(a, b, c);

    if (discriminant < 0) {
        return null;
    }

    /** @type {number} */
    var discriminantRoot = Math.sqrt(discriminant);

    if (discriminant === 0) {

        /** @type {lanyard.geom.Point} */
        var p = line.getPointAt((-b - discriminantRoot) / (2 * a));

        return [new lanyard.geom.Intersection(p, true)];

    } else { // (discriminant > 0)

        /** @type {lanyard.geom.Point} */
        var near = line.getPointAt((-b - discriminantRoot) / (2 * a));

        /** @type {lanyard.geom.Point} */
        var far = line.getPointAt((-b + discriminantRoot) / (2 * a));

        /** @type {Array.<lanyard.geom.Intersection>} */
        var dZeroRet = [
            new lanyard.geom.Intersection(near, false),
            new lanyard.geom.Intersection(far, false)
        ];

        return dZeroRet;
    }
};

/**
 * Calculate the discriminant of this globe.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number} the discriminant of this globe.
 */
lanyard.globes.EllipsoidalGlobe.prototype.discriminant = function(a, b, c) {
    return b * b - 4 * a * c;
};

/**
 * Determine if this globe intersects with the given line.
 *
 * @param {lanyard.geom.Line} line the line.
 * @return {boolean} if this globe intersects with the given line.
 */
lanyard.globes.EllipsoidalGlobe.prototype.intersectsLine = function(line) {
    return line.distanceTo(this.center) <= this.equatorialRadius;
};

/**
 * Determine if this globe intersects with the given plane.
 *
 * @param {lanyard.geom.Plane} plane the plane.
 * @return {boolean} if this globe intersects with the given plane.
 */
lanyard.globes.EllipsoidalGlobe.prototype.intersectsPlane = function(plane) {
    /** @type {number} */
    var dq1 = plane.dot(this.center);

    return dq1 <= this.equatorialRadius;
};

/**
 * Calculate the surface normal for a given point on the globe.
 *
 * @param {lanyard.geom.Point} p the point to calculate.
 * @return {lanyard.geom.Point} the surface normal.
 */
lanyard.globes.EllipsoidalGlobe.prototype.computeSurfaceNormalAtPoint = function(p) {
    p = p.subtract(this.center);

    /** @type {lanyard.geom.Point} */
    var norm = new lanyard.geom.Point(p.getX() / (this.equatorialRadius * this.equatorialRadius),
            p.getY() / (this.polarRadius * this.polarRadius),
            p.getZ() / (this.equatorialRadius * this.equatorialRadius),
            1);

    /** @type {lanyard.geom.Point} */
    var ret = norm.normalize();

    return ret;
};

/**
 * Accessor for this globe's elevation model.
 *
 * @return {lanyard.ElevationModel} this globe's elevation model.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getElevationModel = function() {
    return this.elevationModel;
};

/**
 * Calculate the elevation for the given coordinate.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the given coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude of the given coordinate.
 * @return {number} the elevation at the given coordinate.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getElevation = function(latitude, longitude) {
    if (this.elevationModel) {
        return this.elevationModel.getElevation(latitude, longitude);
    } else {
        return 0;
    }
};

/**
 * Calculate a point from a position.
 *
 * @param {lanyard.geom.Position} position the position.
 * @return {lanyard.geom.Point} the point.
 */
lanyard.globes.EllipsoidalGlobe.prototype.computePointFromPosition = function(position) {
    return this.geodeticToCartesian(position.getLatitude(), position.getLongitude(), position.getElevation());
};

/**
 * Calculate a point from a position.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the position.
 * @param {lanyard.geom.Angle} longitude the longitude of the position.
 * @param {number} metersElevation the elevation of the position, in meters.
 * @return {lanyard.geom.Point} the point.
 */
lanyard.globes.EllipsoidalGlobe.prototype.computePointFromPositionAngles =
        function(latitude, longitude, metersElevation) {

    return this.geodeticToCartesian(latitude, longitude, metersElevation);
};

/**
 * Compute the position from a point.
 *
 * @param {lanyard.geom.Point} point the point to compute a position from.
 * @return {lanyard.geom.Position} the position.
 */
lanyard.globes.EllipsoidalGlobe.prototype.computePositionFromPoint = function(point) {
    return this.cartesianToGeodetic(point);
};

/**
 * Calculate the intersection of a position with a specified line.
 *
 * @param {lanyard.geom.Line} line the line.
 * @return {lanyard.geom.Position} the position calculated.
 */
lanyard.globes.EllipsoidalGlobe.prototype.getIntersectionPosition = function(line) {
    /** @type {Array.<lanyard.geom.Intersection>} */
    var intersections = this.intersect(line);

    if (intersections === null) {
        return null;
    }

    this._logger.fine("Intersection point: " + intersections[0].getIntersectionPoint().toString());

    return this.computePositionFromPoint(intersections[0].getIntersectionPoint());
};

/**
 * The code below maps latitude / longitude position to globe-centered Cartesian coordinates.
 * The Y axis points to the north pole. The Z axis points to the intersection of the prime
 * meridian and the equator, in the equatorial plane. The X axis completes a right-handed
 * coordinate system, and is 90 degrees east of the Z axis and also in the equatorial plane.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude of the coordinate.
 * @param {number} metersElevation the elevation of the coordinate, in meters.
 * @return {lanyard.geom.Point} the cartesian point.
 */
lanyard.globes.EllipsoidalGlobe.prototype.geodeticToCartesian =
        function(latitude, longitude, metersElevation) {

    //this._logger.fine("Converting from geodetic to Cartesian with: " +
    //    latitude + "; " + longitude + "; " + metersElevation);

    /** @type {number} */
    var cosLat = latitude.cos();

    /** @type {number} */
    var sinLat = latitude.sin();

    //this._logger.fine("Computing RPM with es = " + this.es +
    //    "; sinLat = " + sinLat + "; equatorialRadius = " + this.equatorialRadius);

    /** @type {number} */
    var rpm = // getRadius (in meters) of vertical in prime meridian
        this.equatorialRadius / Math.sqrt(1.0 - this.es * sinLat * sinLat);

    //this._logger.fine("Radius of vertical in prime meridian: " + rpm);

    /** @type {number} */
    var sinLng = longitude.sin();

    /** @type {number} */
    var cosLon = longitude.cos();

    /** @type {number} */
    var x = (rpm + metersElevation) * cosLat * sinLng;

    /** @type {number} */
    var y = (rpm * (1.0 - this.es) + metersElevation) * cosLon;

    /** @type {number} */
    var z = (rpm + metersElevation) * cosLat * longitude.cos();

    return new lanyard.geom.Point(x, y, z, 1);
};

/**
 * Convert a cartesian point to a geodetic position.
 *
 * This is according to: H. Vermeille,
 * Direct transformation from geocentric to geodetic ccordinates,
 * Journal of Geodesy (2002) 76:451-454
 *
 * @param {lanyard.geom.Point} cart the cartesian point.
 * @return {lanyard.geom.Position} the geodetic position.
 */
lanyard.globes.EllipsoidalGlobe.prototype.cartesianToGeodetic = function(cart) {

    /** @type {number} */
    var ra2 = 1 / (this.equatorialRadius * this.equatorialRadius);

    /** @type {number} */
    var X = cart.getZ();

    /** @type {number} */
    var Y = cart.getX();

    /** @type {number} */
    var Z = cart.getY();

    /** @type {number} */
    var e2 = this.es;

    /** @type {number} */
    var e4 = e2 * e2;

    /** @type {number} */
    var XXpYY = X * X + Y * Y;

    /** @type {number} */
    var sqrtXXpYY = Math.sqrt(XXpYY);

    /** @type {number} */
    var p = XXpYY * ra2;

    /** @type {number} */
    var q = Z * Z * (1 - e2) * ra2;

    /** @type {number} */
    var r = 1 / 6.0 * (p + q - e4);

    /** @type {number} */
    var s = e4 * p * q / (4 * r * r * r);

    /** @type {number} */
    var t = Math.pow(1 + s + Math.sqrt(s * (2 + s)), 1 / 3.0);

    /** @type {number} */
    var u = r * (1 + t + 1 / t);

    /** @type {number} */
    var v = Math.sqrt(u * u + e4 * q);

    /** @type {number} */
    var w = e2 * (u + v - q) / (2 * v);

    /** @type {number} */
    var k = Math.sqrt(u + v + w * w) - w;

    /** @type {number} */
    var D = k * sqrtXXpYY / (k + e2);

    /** @type {number} */
    var lon = 2 * Math.atan2(Y, X + sqrtXXpYY);

    /** @type {number} */
    var sqrtDDpZZ = Math.sqrt(D * D + Z * Z);

    /** @type {number} */
    var lat = 2 * Math.atan2(Z, D + sqrtDDpZZ);

    /** @type {number} */
    var elevation = (k + e2 - 1) * sqrtDDpZZ / k;

    return lanyard.geom.Position.prototype.fromRadians(lat, lon, elevation);
};

/**
 * Perform top level tessellation of the globe.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {lanyard.SectorGeometryList} the geometry list.
 */
lanyard.globes.EllipsoidalGlobe.prototype.tessellate = function(dc) {
    return dc.getModel().getTessellator().tessellate(dc);
};

/* EOF */
