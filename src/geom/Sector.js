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

/**
 * Sector represents a rectangular reqion of latitude and longitude. The region is defined by four
 * angles: its minimum and maximum latitude, its minimum and maximum longitude.  The angles are
 * assumed to be normalized to +/- 90 degrees latitude and +/- 180 degrees longitude. the minimums
 * and maximums are relative to these ranges, e.g. -80 is less than 20. Behavior of the class is
 * undefined for angles outside these ranges. Normalization is not performed on the angles by this
 * class, nor is it verifed by the class' methods. See {lanyard.geom.Angle} for a description of
 * specifying angles.
 */
goog.provide('lanyard.geom.Sector');

goog.require('lanyard.Globe');
goog.require('lanyard.geom.Angle');
goog.require('lanyard.geom.Cylinder');
goog.require('lanyard.geom.LatLon');
goog.require('lanyard.geom.Sphere');

/**
 * Creates a new Sector and initializes it to the specified angles. The angles are assumed to be
 * normalized to +/- 90 degrees latitude and +/- 180 degrees longitude, but this method does not
 * verify that.
 *
 * @constructor
 * @this {lanyard.geom.Sector}
 * @param {lanyard.geom.Angle} minLatitude the sector's minimum latitude.
 * @param {lanyard.geom.Angle} maxLatitude the sector's maximum latitude.
 * @param {lanyard.geom.Angle} minLongitude the sector's minimum longitude.
 * @param {lanyard.geom.Angle} maxLongitude the sector's maximum longitude.
 */
lanyard.geom.Sector = function(minLatitude, maxLatitude, minLongitude, maxLongitude) {
    /** @private */ this._minLatitude = minLatitude;
    /** @private */ this._maxLatitude = maxLatitude;
    /** @private */ this._minLongitude = minLongitude;
    /** @private */ this._maxLongitude = maxLongitude;
    /** @private */ this._deltaLat =
        lanyard.geom.Angle.prototype.fromDegrees(
            this._maxLatitude.getDegrees() - this._minLatitude.getDegrees());
    /** @private */ this._deltaLon =
        lanyard.geom.Angle.prototype.fromDegrees(
            this._maxLongitude.getDegrees() - this._minLongitude.getDegrees());
};
goog.exportSymbol('lanyard.geom.Sector', lanyard.geom.Sector);


/**
 * A Sector of latitude [-90 degrees, + 90 degrees] and longitude [-180 degrees, + 180 degrees].
 *
 * @const
 * @type {lanyard.geom.Sector}
 */
lanyard.geom.Sector.prototype.FULL_SPHERE =
    new lanyard.geom.Sector(
        lanyard.geom.Angle.prototype.NEG90, lanyard.geom.Angle.prototype.POS90,
        lanyard.geom.Angle.prototype.NEG180, lanyard.geom.Angle.prototype.POS180
    );

/**
 * An empty sector.
 *
 * @const
 * @type {lanyard.geom.Sector}
 */
lanyard.geom.Sector.prototype.EMPTY_SECTOR =
    new lanyard.geom.Sector(
        lanyard.geom.Angle.prototype.ZERO, lanyard.geom.Angle.prototype.ZERO,
        lanyard.geom.Angle.prototype.ZERO, lanyard.geom.Angle.prototype.ZERO
    );

/**
 * Creates a new Sector and initializes it to the specified angles. The angles are assumed to be
 * normalized to +/- 90 degrees latitude and +/- 180 degrees longitude, but this method does not
 * verify that.
 *
 * @param {number} minLatitude the sector's minimum latitude in degrees.
 * @param {number} maxLatitude the sector's maximum latitude in degrees.
 * @param {number} minLongitude the sector's minimum longitude in degrees.
 * @param {number} maxLongitude the sector's maximum longitude in degrees.
 * @return {lanyard.geom.Sector} the new Sector.
 */
lanyard.geom.Sector.prototype.fromDegrees =
        function(minLatitude, maxLatitude, minLongitude, maxLongitude) {

    var ret = new lanyard.geom.Sector(
        lanyard.geom.Angle.prototype.fromDegrees(minLatitude),
        lanyard.geom.Angle.prototype.fromDegrees(maxLatitude),
        lanyard.geom.Angle.prototype.fromDegrees(minLongitude),
        lanyard.geom.Angle.prototype.fromDegrees(maxLongitude)
    );

    return ret;
};

/**
 * Creates a new Sector and initializes it to the specified angles. The angles are assumed to be
 * normalized.
 *
 * @param {number} minLatitude the sector's minimum latitude in radians.
 * @param {number} maxLatitude the sector's maximum latitude in radians.
 * @param {number} minLongitude the sector's minimum longitude in radians.
 * @param {number} maxLongitude the sector's maximum longitude in radians.
 * @return {lanyard.geom.Sector} the new Sector.
 */
lanyard.geom.Sector.prototype.fromRadians =
        function(minLatitude, maxLatitude, minLongitude, maxLongitude) {

    /** @type {lanyard.geom.Sector} */
    var ret = new lanyard.geom.Sector(
        lanyard.geom.Angle.prototype.fromRadians(minLatitude),
        lanyard.geom.Angle.prototype.fromRadians(maxLatitude),
        lanyard.geom.Angle.prototype.fromRadians(minLongitude),
        lanyard.geom.Angle.prototype.fromRadians(maxLongitude));

    return ret;
};

/**
 * Find a bounding sector based on an array of {lanyard.geom.LatLon}.
 *
 * @param {Array.<lanyard.geom.LatLon>} positions the array of positions.
 * @return {lanyard.geom.Sector} the new bounding sector.
 */
lanyard.geom.Sector.prototype.boundingSector = function(positions) {

    /** @type {number} */
    var minLat = lanyard.geom.Angle.prototype.POS90.getDegrees();

    /** @type {number} */
    var minLon = lanyard.geom.Angle.prototype.POS180.getDegrees();

    /** @type {number} */
    var maxLat = lanyard.geom.Angle.prototype.NEG180.getDegrees();

    /** @type {number} */
    var maxLon = lanyard.geom.Angle.prototype.NEG180.getDegrees();

    /** @type {number} */
    var i;
    for (i = 0; i < positions.length; i = i + 1) {

        /** @type {number} */
        var lat = positions[i].getLatitude().getDegrees();

        if (lat < minLat) {
            minLat = lat;
        }

        if (lat > maxLat) {
            maxLat = lat;
        }

        /** @type {number} */
        var lon = positions[i].getLongitude().getDegrees();

        if (lon < minLon) {
            minLon = lon;
        }

        if (lon > maxLon) {
            maxLon = lon;
        }
    }

    if ((minLat === maxLat) && (minLon === maxLon)) {
        return lanyard.geom.Sector.prototype.EMPTY_SECTOR;
    }

    return lanyard.geom.Sector.prototype.fromDegrees(minLat, maxLat, minLon, maxLon);
};

/**
 * Returns the sector's minimum latitude.
 *
 * @return {lanyard.geom.Angle} the sector's minimum latitude.
 */
lanyard.geom.Sector.prototype.getMinLatitude = function() {
    return this._minLatitude;
};

/**
 * Returns the sector's minimum longitude.
 *
 * @return {lanyard.geom.Angle} the sector's minimum longitude.
 */
lanyard.geom.Sector.prototype.getMinLongitude = function() {
    return this._minLongitude;
};

/**
 * Returns the sector's maximum latitude.
 *
 * @return {lanyard.geom.Angle} the sector's maximum latitude.
 */
lanyard.geom.Sector.prototype.getMaxLatitude = function() {
    return this._maxLatitude;
};

/**
 * Returns the sector's maximum longitude.
 *
 * @return {lanyard.geom.Angle} the sector's maximum longitude.
 */
lanyard.geom.Sector.prototype.getMaxLongitude = function() {
    return this._maxLongitude;
};

/**
 * Returns the angular difference between the sector's minimum and maximum latitudes: max - min.
 *
 * @return {lanyard.geom.Angle} the angular difference between the sector's minimum and maximum latitudes.
 */
lanyard.geom.Sector.prototype.getDeltaLat = function() {
    //Angle.fromDegrees(this.maxLatitude.degrees - this.minLatitude.degrees);
    return this._deltaLat;
};

/**
 * Find the degree difference between the sector's minimum and maximum latitudes: max - min.
 *
 * @return {number} the degree difference between the sector's minimum and maximum latitudes.
 */
lanyard.geom.Sector.prototype.getDeltaLatDegrees = function() {
    //this.maxLatitude.degrees - this.minLatitude.degrees;
    return this._deltaLat.getDegrees();
};

/**
 * Find the radian difference between the sector's minimum and maximum latitudes: max - min.
 *
 * @return {number} the radian difference between the sector's minimim and maximum latitudes.
 */
lanyard.geom.Sector.prototype.getDeltaLatRadians = function() {
    //this.maxLatitude.radians - this.minLatitude.radians;
    return this._deltaLat.getRadians();
};

/**
 * Returns the angular difference between the sector's minimum and maximum longitudes: max - min.
 *
 * @return {lanyard.geom.Angle} the angular difference between the sector's minimum and maximum longitudes.
 */
lanyard.geom.Sector.prototype.getDeltaLon = function() {
    //Angle.fromDegrees(this.maxLongitude.degrees - this.minLongitude.degrees);
    return this._deltaLon;
};

/**
 * Returns the degree difference between the sector's minimum and maximum longitudes: max - min.
 *
 * @return {number} the degree difference between the sector's minimum and maximum longitudes.
 */
lanyard.geom.Sector.prototype.getDeltaLonDegrees = function() {
    //this.maxLongitude.degrees - this.minLongitude.degrees;
    return this._deltaLon.getDegrees();
};

/**
 * Returns the radian difference between the sector's minimum and maximum longitudes: max - min.
 *
 * @return {number} the radian difference between the sector's minimum and maximum longitudes.
 */
lanyard.geom.Sector.prototype.getDeltaLonRadians = function() {
    //this.maxLongitude.radians - this.minLongitude.radians;
    return this._deltaLon.getRadians();
};

/**
 * Returns the latitude and longitude of the sector's angular center: (minimum latitude + maximum latitude) / 2,
 * (minimum longitude + maximum longitude) / 2.
 *
 * @return {lanyard.geom.LatLon} the latitude and longitude of the sector's angular center.
 */
lanyard.geom.Sector.prototype.getCentroid = function() {
    /** @type {lanyard.geom.Angle} */
    var la = lanyard.geom.Angle.prototype.fromDegrees(
        0.5 * (this.getMaxLatitude().getDegrees() + this.getMinLatitude().getDegrees())
    );

    /** @type {lanyard.geom.Angle} */
    var lo = lanyard.geom.Angle.prototype.fromDegrees(
        0.5 * (this.getMaxLongitude().getDegrees() + this.getMinLongitude().getDegrees())
    );

    return new lanyard.geom.LatLon(la, lo);
};

/**
 * Compute the center point of a globe.
 *
 * @param {lanyard.Globe} globe the globe.
 * @return {lanyard.geom.Point} the center point.
 */
lanyard.geom.Sector.prototype.computeCenterPoint = function(globe) {

    /** @type {number} */
    var lat = 0.5 * (this._minLatitude.getDegrees() + this._maxLatitude.getDegrees());

    /** @type {number} */
    var lon = 0.5 * (this._minLongitude.getDegrees() + this._maxLongitude.getDegrees());

    /** @type {lanyard.geom.Angle} */
    var cLat = lanyard.geom.Angle.prototype.fromDegrees(lat);

    /** @type {lanyard.geom.Angle} */
    var cLon = lanyard.geom.Angle.prototype.fromDegrees(lon);

    return globe.computePointFromPositionAngles(cLat, cLon, globe.getElevation(cLat, cLon));
};

/**
 * Compute the corner points based on the globe.
 *
 * @param {lanyard.Globe} globe the globe.
 * @return {Array.<lanyard.geom.Point>} the corner points.
 */
lanyard.geom.Sector.prototype.computeCornerPoints = function(globe) {

    /** @type {Array.<lanyard.geom.Point>} */
    var corners = [];

    /** @type {lanyard.geom.Angle} */
    var minLat = this._minLatitude;

    /** @type {lanyard.geom.Angle} */
    var maxLat = this._maxLatitude;

    /** @type {lanyard.geom.Angle} */
    var minLon = this._minLongitude;

    /** @type {lanyard.geom.Angle} */
    var maxLon = this._maxLongitude;

    corners[0] = globe.computePointFromPositionAngles(minLat, minLon, globe.getElevation(minLat, minLon));
    corners[1] = globe.computePointFromPositionAngles(minLat, maxLon, globe.getElevation(minLat, maxLon));
    corners[2] = globe.computePointFromPositionAngles(maxLat, maxLon, globe.getElevation(maxLat, maxLon));
    corners[3] = globe.computePointFromPositionAngles(maxLat, minLon, globe.getElevation(maxLat, minLon));

    return corners;
};

/**
 * Returns a sphere that minimally surrounds the sector at a specified vertical exaggeration.
 *
 * @param globe {lanyard.Globe} the globe the sector is associated with.
 * @param verticalExaggeration {number} to apply to the globe's elevations when computing the sphere.
 * @param sector {lanyard.geom.Sector} the sector to return the bounding sphere for.
 * @return {lanyard.geom.Extent} the minimal bounding sphere in Cartesian coordinates.
 */
lanyard.geom.Sector.prototype.computeBoundingSphere = function(globe, verticalExaggeration, sector) {

    /** @type {lanyard.geom.LatLon} */
    var center = sector.getCentroid();

    /** @type {number} */
    var maxHeight = globe.getMaxElevation() * verticalExaggeration;

    /** @type {number} */
    var minHeight = 0; //globe.getMinElevation() * verticalExaggeration;

    /** @type {Array.<lanyard.geom.Point>} */
    var points = [];

    points[0] =
        globe.computePointFromPositionAngles(center.getLatitude(), center.getLongitude(), maxHeight);
    points[1] =
        globe.computePointFromPositionAngles(sector.getMaxLatitude(), sector.getMinLongitude(), maxHeight);
    points[2] =
        globe.computePointFromPositionAngles(sector.getMinLatitude(), sector.getMaxLongitude(), maxHeight);
    points[3] =
        globe.computePointFromPositionAngles(sector.getMinLatitude(), sector.getMinLongitude(), maxHeight);
    points[4] =
        globe.computePointFromPositionAngles(sector.getMaxLatitude(), sector.getMaxLongitude(), maxHeight);
    points[5] =
        globe.computePointFromPositionAngles(sector.getMaxLatitude(), sector.getMinLongitude(), minHeight);
    points[6] =
        globe.computePointFromPositionAngles(sector.getMinLatitude(), sector.getMaxLongitude(), minHeight);
    points[7] =
        globe.computePointFromPositionAngles(sector.getMinLatitude(), sector.getMinLongitude(), minHeight);
    points[8] =
        globe.computePointFromPositionAngles(sector.getMaxLatitude(), sector.getMaxLongitude(), minHeight);

    return lanyard.geom.Sphere.prototype.createBoundingSphere(points);
};

/**
 * Returns a cylinder that minimally surrounds the sector at a specified vertical exaggeration.
 *
 * @param globe {lanyard.Globe} the globe the sector is associated with.
 * @param verticalExaggeration {number} to apply to the globe's elevations when computing the cylinder.
 * @param sector {lanyard.geom.Sector} the sector to return the bounding cylinder for.
 * @return {lanyard.geom.Cylinder} the minimal bounding cylinder in Cartesian coordinates.
 */
lanyard.geom.Sector.prototype.computeBoundingCylinder = function(globe, verticalExaggeration, sector) {

    // Compute the center points of the bounding cylinder's top and bottom planes.

    /** @type {lanyard.geom.LatLon} */
    var center = sector.getCentroid();

    /** @type {number} */
    var maxHeight = globe.getMaxElevation() * verticalExaggeration;

    /** @type {number} */
    var minHeight = 0; //globe.getMinElevation() * verticalExaggeration;

    /** @type {lanyard.geom.Point} */
    var centroidTop =
        globe.computePointFromPositionAngles(center.getLatitude(), center.getLongitude(), maxHeight);

    /** @type {lanyard.geom.Point} */
    var lowPoint =
        globe.computePointFromPositionAngles(sector.getMinLatitude(), sector.getMinLongitude(), minHeight);

    /** @type {lanyard.geom.Point} */
    var axis = centroidTop.normalize();

    /** @type {number} */
    var lowDistance = axis.dot(lowPoint);

    /** @type {lanyard.geom.Point} */
    var centroidBot = axis.scale(lowDistance, lowDistance, lowDistance);

    // Compute radius of circumscribing circle around general quadrilateral.

    /** @type {lanyard.geom.Point} */
    var northwest =
        globe.computePointFromPositionAngles(sector.getMaxLatitude(), sector.getMinLongitude(), maxHeight);

    /** @type {lanyard.geom.Point} */
    var southeast =
        globe.computePointFromPositionAngles(sector.getMinLatitude(), sector.getMaxLongitude(), maxHeight);

    /** @type {lanyard.geom.Point} */
    var southwest =
        globe.computePointFromPositionAngles(sector.getMinLatitude(), sector.getMinLongitude(), maxHeight);

    /** @type {lanyard.geom.Point} */
    var northeast =
        globe.computePointFromPositionAngles(sector.getMaxLatitude(), sector.getMaxLongitude(), maxHeight);

    /** @type {number} */
    var a = southwest.distanceTo(southeast);

    /** @type {number} */
    var b = southeast.distanceTo(northeast);

    /** @type {number} */
    var c = northeast.distanceTo(northwest);

    /** @type {number} */
    var d = northwest.distanceTo(southwest);

    /** @type {number} */
    var s = 0.5 * (a + b + c + d);

    /** @type {number} */
    var area = Math.sqrt((s - a) * (s - b) * (s - c) * (s - d));

    /** @type {number} */
    var radius = Math.sqrt((a * b + c * d) * (a * d + b * c) * (a * c + b * d)) / (4 * area);

    return new lanyard.geom.Cylinder(centroidBot, centroidTop, radius);
};

/**
 * Check if the sector contains the specified coordinates.
 *
 * @param {lanyard.geom.Angle} latitude the coordinate latitude.
 * @param {lanyard.geom.Angle} longitude the coordinate longitude.
 * @return {boolean} if the coodinate is contained in this sector.
 */
lanyard.geom.Sector.prototype.contains = function(latitude, longitude) {
    /** @type {boolean} */
    var ret = (latitude.getDegrees() >= this._minLatitude.getDegrees()) &&
        (latitude.getDegrees() <= this._maxLatitude.getDegrees()) &&
        (longitude.getDegrees() >= this._minLongitude.getDegrees()) &&
        (longitude.getDegrees() <= this._maxLongitude.getDegrees());

    return ret;
};

/**
 * Determines whether a latitude/longitude position is within the sector. The sector's
 * angles are assumed to be normalized to +/- 90 degrees latitude and +/- 180 degrees
 * longitude.
 *
 * @param {lanyard.geom.LatLon} latLon the position to test, with angles normalized.
 * @return {boolean} true if the position is within the sector, false otherwise.
 */
lanyard.geom.Sector.prototype.containsLatLon = function(latLon) {
    return this.contains(latLon.getLatitude(), latLon.getLongitude());
};

/**
 * Determines whether a latitude/longitude postion expressed in radians is within the
 * sector. The sector's angles are assumed to be normalized to +/- 90 degrees latitude
 * latitude and +/- 180 degrees longitude. The result of the operation is undefined if
 * they are not.
 *
 * @param {number} radiansLatitude the latitude in radians of the position to test, normalized.
 * @param {number} radiansLongitude the longitude in radians of the position to test, normalized.
 * @return {boolean} true if the position is within the sector, false otherwise.
 */
lanyard.geom.Sector.prototype.containsRadians = function(radiansLatitude, radiansLongitude) {
    /** @type {boolean} */
    var ret = (radiansLatitude >= this._minLatitude.getRadians()) &&
        (radiansLatitude <= this._maxLatitude.getRadians()) &&
        (radiansLongitude >= this._minLongitude.getRadians()) &&
        (radiansLongitude <= this._maxLongitude.getRadians());

    return ret;
};

/**
 * Check to see if this sector contains the coordinates specified in degrees.
 *
 * @param {number} degreesLatitude the degrees latitude.
 * @param {number} degreesLongitude the degrees longitude.
 * @return {boolean} true if this sector contains the coordinates, false otherwise.
 */
lanyard.geom.Sector.prototype.containsDegrees = function(degreesLatitude, degreesLongitude) {
    /** @type {boolean} */
    var ret = (degreesLatitude >= this._minLatitude.getDegrees()) &&
        (degreesLatitude <= this._maxLatitude.getDegrees()) &&
        (degreesLongitude >= this._minLongitude.getDegrees()) &&
        (degreesLongitude <= this._maxLongitude.getDegrees());

    return ret;
};

/**
 * Determines whether this sector intersects another sector's range of latitude and longitude.
 * The sector's angles are assumed to be normalized to +/- 90 degrees latitude and +/- 180
 * degrees longitude. The result of the operation is undefined if they are not.
 *
 * @param {lanyard.geom.Sector} that the sector to test for intersection.
 * @return {boolean} true if the sectors intersect, otherwise false.
 */
lanyard.geom.Sector.prototype.intersects = function(that) {
    if (!that) {
        return false;
    }

    // TODO: have Angle normalize values when set

    // Assumes normalized angles -- [-180, 180], [-90, 90]
    if (that._maxLongitude.getDegrees() < this._minLongitude.getDegrees()) {
        return false;
    }

    if (that._minLongitude.getDegrees() > this._maxLongitude.getDegrees()) {
        return false;
    }

    if (that._maxLatitude.getDegrees() < this._minLatitude.getDegrees()) {
        return false;
    }

    if (that._minLatitude.getDegrees() > this._maxLatitude.getDegrees()) {
        return false;
    }

    return true;
};

/**
 * Returns a new sector whose angles are the extremes of the this sector and another.
 * The new sector's minimum latitude and longitude will be the minimum of the two sectors.
 * The new sector's maximum latitude and longitude will be the maximum of the two sectors.
 * The sectors are assumed to be normalized to +/- 90 degrees latitude and +/- 180 degrees
 * longitude. The result of the operation is undefined if they are not.
 *
 * @param {lanyard.geom.Sector} that the sector to join with this.
 * @return {lanyard.geom.Sector} a new sector formed from the extremes of the two sectors.
 */
lanyard.geom.Sector.prototype.unionWithSector = function(that) {
    if (!that) {
        return this;
    }

    /** @type {lanyard.geom.Angle} */
    var minLat = this._minLatitude;

    /** @type {lanyard.geom.Angle} */
    var maxLat = this._maxLatitude;

    /** @type {lanyard.geom.Angle} */
    var minLon = this._minLongitude;

    /** @type {lanyard.geom.Angle} */
    var maxLon = this._maxLongitude;

    if (that.getMinLatitude().getDegrees() < this._minLatitude.getDegrees()) {
        minLat = that.getMinLatitude();
    }

    if (that.getMaxLatitude().getDegrees() > this._maxLatitude.getDegrees()) {
        maxLat = that.getMaxLatitude();
    }

    if (that.getMinLongitude().getDegrees() < this._minLongitude.getDegrees()) {
        minLon = that.getMinLongitude();
    }

    if (that.getMaxLongitude().getDegrees() > this._maxLongitude.getDegrees()) {
        maxLon = that.getMaxLongitude();
    }

    return new lanyard.geom.Sector(minLat, maxLat, minLon, maxLon);
};

/**
 * Find a sector that is a union of the specified coordinate and this.
 *
 * @param {lanyard.geom.Angle} latitude the latitude coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude coordinate.
 * @return {lanyard.geom.Sector} the result of the union.
 */
lanyard.geom.Sector.prototype.unionWithCoordinate = function(latitude, longitude) {
    if (!latitude || !longitude) {
        return this;
    }

    /** @type {lanyard.geom.Angle} */
    var minLat = this._minLatitude;

    /** @type {lanyard.geom.Angle} */
    var maxLat = this._maxLatitude;

    /** @type {lanyard.geom.Angle} */
    var minLon = this._minLongitude;

    /** @type {lanyard.geom.Angle} */
    var maxLon = this._maxLongitude;

    if (latitude.getDegrees() < this._minLatitude.getDegrees()) {
        minLat = latitude;
    }

    if (latitude.getDegrees() > this._maxLatitude.getDegrees()) {
        maxLat = latitude;
    }

    if (longitude.getDegrees() < this._minLongitude.getDegrees()) {
        minLon = longitude;
    }

    if (longitude.getDegrees() > this._maxLongitude.getDegrees()) {
        maxLon = longitude;
    }

    return new lanyard.geom.Sector(minLat, maxLat, minLon, maxLon);
};

/**
 * Find the intersection of this sector with another.
 *
 * @param {lanyard.geom.Sector} that the sector to check for intersection.
 * @return {lanyard.geom.Sector} a sector of the intersection.
 */
lanyard.geom.Sector.prototype.intersectionWithSector = function(that) {
    if (!that) {
        return this;
    }

    /** @type {lanyard.geom.Angle} */
    var minLat;

    /** @type {lanyard.geom.Angle} */
    var maxLat;

    minLat = (this._minLatitude.getDegrees() > that.getMinLatitude().getDegrees()) ?
        this._minLatitude : that.getMinLatitude();

    maxLat = (this._maxLatitude.getDegrees() < that.getMaxLatitude().getDegrees()) ?
        this._maxLatitude : that.getMaxLatitude();

    if (minLat.getDegrees() > maxLat.getDegrees()) {
        return null;
    }

    /** @type {lanyard.geom.Angle} */
    var minLon;

    /** @type {lanyard.geom.Angle} */
    var maxLon;

    minLon = (this._minLongitude.getDegrees() > that.getMinLongitude().getDegrees()) ?
        this._minLongitude : that.getMinLongitude();

    maxLon = (this._maxLongitude.getDegrees() < that.getMaxLongitude().getDegrees()) ?
        this._maxLongitude : that.getMaxLongitude();

    if (minLon.getDegrees() > maxLon.getDegrees()) {
        return null;
    }

    return new lanyard.geom.Sector(minLat, maxLat, minLon, maxLon);
};

/**
 * Find an intersection with the specified coordinate.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the coordinate.
 * @param {lanyard.geom.Angle} longitude the longitude of the coordinate.
 * @return {lanyard.geom.Sector} the sector of the intersection.
 */
lanyard.geom.Sector.prototype.intersectionWithCoordinate = function(latitude, longitude) {
    if (!latitude || !longitude) {
        return this;
    }

    if (!this.contains(latitude, longitude)) {
        return null;
    }

    return new lanyard.geom.Sector(latitude, latitude, longitude, longitude);
};

/**
 * Divide this sector into four sectors of equal size.
 *
 * @return {Array.<lanyard.geom.Sector>} the array of four sectors.
 */
lanyard.geom.Sector.prototype.subdivide = function() {

    /** @type {lanyard.geom.Angle} */
    var midLat = lanyard.geom.Angle.prototype.average(this._minLatitude, this._maxLatitude, null);

    /** @type {lanyard.geom.Angle} */
    var midLon = lanyard.geom.Angle.prototype.average(this._minLongitude, this._maxLongitude, null);

    /** @type {Array.<lanyard.geom.Sector>} */
    var sectors = [];

    sectors[0] = new lanyard.geom.Sector(this._minLatitude, midLat, this._minLongitude, midLon);
    sectors[1] = new lanyard.geom.Sector(this._minLatitude, midLat, midLon, this._maxLongitude);
    sectors[2] = new lanyard.geom.Sector(midLat, this._maxLatitude, this._minLongitude, midLon);
    sectors[3] = new lanyard.geom.Sector(midLat, this._maxLatitude, midLon, this._maxLongitude);

    return sectors;
};

/**
 * Returns a string indicating the sector's angles.
 *
 * @return {string} a string indicating the sector's angles.
 */
lanyard.geom.Sector.prototype.toString = function() {
    /** @type {string} */
    var ret = 'A Sector with angles: (' + this._minLatitude.toString() + ', ' + this._minLongitude.toString() + ')' +
        ', (' + this._maxLatitude.toString() + ', ' + this._maxLongitude.toString() + ')';

    return ret;
};

/**
 * Compares this sector to a specified sector according to their minimum latitude, minimum longitude, maximum
 * latitude, and maximum longitude, respectively.
 *
 * @param {lanyard.geom.Sector} that the Sector to compareTo with this.
 * @return {number} -1 if this sector is less than that specified, 0 if it's equal, and 1 if it's greater.
 */
lanyard.geom.Sector.prototype.compareTo = function(that) {
    if (this.getMinLatitude().compareTo(that.getMinLatitude()) < 0) {
        return -1;
    }

    if (this.getMinLatitude().compareTo(that.getMinLatitude()) > 0) {
        return 1;
    }

    if (this.getMinLongitude().compareTo(that.getMinLongitude()) < 0) {
        return -1;
    }

    if (this.getMinLongitude().compareTo(that.getMinLongitude()) > 0) {
        return 1;
    }

    if (this.getMaxLatitude().compareTo(that.getMaxLatitude()) < 0) {
        return -1;
    }

    if (this.getMaxLatitude().compareTo(that.getMaxLatitude()) > 0) {
        return 1;
    }

    if (this.getMaxLongitude().compareTo(that.getMaxLongitude()) < 0) {
        return -1;
    }

    if (this.getMaxLongitude().compareTo(that.getMaxLongitude()) > 0) {
        return 1;
    }

    return 0;
};

/* EOF */
