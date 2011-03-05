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

goog.provide('lanyard.globes.Earth');

goog.require('lanyard.globes.EllipsoidalGlobe');

/**
 * A representation of the earth.
 *
 * @extends lanyard.globes.EllipsoidalGlobe
 * @constructor
 * @this {lanyard.globes.Earth}
 */
lanyard.globes.Earth = function() {

    /**
     * The WGS84 ellipsoid equatorial radius of the earth, in meters.
     *
     * @type {number}
     * @private
     */
    this.equatorialRadius = 6378137.0;

    /**
     * The WGS84 ellipsoid polar radius, in meters.
     *
     * @type {number}
     * @private
     */
    this.polarRadius = 6378137.0;

    /**
     * The WGS84 eccentricity squared, semi-major axis.
     *
     * @type {number}
     * @private
     */
    this.es = 0; //0.00669437999013

    /** @private */ this.center = lanyard.geom.Point.prototype.ZERO;

    // FIXME: create an earth elevation model.
    // /** @private */ this.elevationModel = new lanyard.globes.EarthElevationModel();

    /** @private */ this.elevationModel = null;

    // call super
    lanyard.globes.EllipsoidalGlobe.call(
        this, this.equatorialRadius, this.polarRadius, this.es, this.elevationModel);

    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.globes.Earth');
};
goog.exportSymbol('lanyard.globes.Earth', lanyard.globes.Earth);
goog.inherits(lanyard.globes.Earth, lanyard.globes.EllipsoidalGlobe);

/**
 * Get the radius of the earth.
 *
 * @return {number} the radius of the earth.
 */
lanyard.globes.Earth.prototype.getRadius = function() {
    return this.equatorialRadius;
};

/* EOF */
