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

goog.provide('lanyard.SectorGeometryList');

goog.require('lanyard.SectorGeometry');

/**
 * A list of sector geometries.
 *
 * @constructor
 */
lanyard.SectorGeometryList = function() {
    /**
     * @type {Array.<lanyard.SectorGeometry>}
     */
    this.geometryList = [];
};

/**
 * Add a geometry.
 *
 * @param {lanyard.SectorGeometry} sg the sector geometry to add.
 */
lanyard.SectorGeometryList.prototype.add = function(sg) {
    this.geometryList.push(sg);
};

/**
 * Pass up the length.
 *
 * @return {number} the length of the geometry list.
 */
lanyard.SectorGeometryList.prototype.length = function() {
    if (!this.geometryList) {
        return 0;
    } else {
        return this.geometryList.length;
    }
};

/**
 * Get a sector geometry at the specified position in the list.
 *
 * @param {number} position the position of the wanted sector geometry.
 * @return {lanyard.SectorGeometry} the sector geometry.
 */
lanyard.SectorGeometryList.prototype.at = function(position) {
    return this.geometryList[position];
};

/**
 * Clear the elements in this list
 */
lanyard.SectorGeometryList.prototype.clear = function() {
    this.geometryList = [];
};

/**
 * Get a list of the intersecting sectors.
 *
 * @param {lanyard.geom.Sector} sector the sector to check for intersection with.
 * @return {Array.<lanyard.SectorGeometry>} the array of sector geometries.
 */
lanyard.SectorGeometryList.prototype.getIntersectingSectors = function(sector) {

    /** @type {Array.<lanyard.SectorGeometry>} */
    var list = [];

    /** @type {number} */
    var i;
    for (i = 0; i < this.geometryList.length; i = i + 1) {
        if (this.geometryList[i].getSector().intersects(sector)) {
            list.push(this.geometryList[i]);
        } else {
            // this._logger.fine("no intersection");
        }
    }

    return list;
};

/**
 * Get a surface point at a position.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the position.
 * @param {lanyard.geom.Angle} longitude the longitude of the position.
 * @param {number} metersOffset the meters offset.
 * @return {lanyard.geom.Point} the surface point.
 */
lanyard.SectorGeometryList.prototype.getSurfacePoint = function(latitude, longitude, metersOffset) {

    /** @type {number} */
    var i;
    for (i = 0; i < this.geometryList.length; i = i + 1) {
        if (this.geometryList[i].getSector().contains(latitude, longitude)) {
            /** @type {lanyard.geom.Point} */
            var point = this.geometryList[i].getSurfacePoint(latitude, longitude, metersOffset);
            if (point) {
                return point;
            }
       }
    }

    return null;
};

/* EOF */
