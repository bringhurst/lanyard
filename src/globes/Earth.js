/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.globes.Earth');

goog.require('lanyard.globes.EllipsoidalGlobe');

/**
 * A representation of the earth.
 *
 * @extends lanyard.globes.EllipsoidalGlobe
 * @constructor
 * @this {lanyard.globes.Earth}
 */
lanyard.globes.Earth = function () {

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
     * Approximated from 0.00669437999013.
     *
     * @type {number}
     * @private
     */
    this.es = 0;

    /** @private */ this.center = lanyard.geom.Point.prototype.ZERO;

    // FIXME: create an earth elevation model.
    // /** @private */ this.elevationModel = new lanyard.globes.EarthElevationModel();

    /** @private */ this.elevationModel = null;

    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.globes.Earth');
};
goog.exportSymbol('lanyard.globes.Earth', lanyard.globes.Earth);
goog.inherits(lanyard.globes.Earth, lanyard.globes.EllipsoidalGlobe);

/**
 * Get the radius of the earth.
 *
 * @return {number} the radius of the earth.
 */
lanyard.globes.Earth.prototype.getRadius = function () {
    return this.equatorialRadius;
};

/* EOF */
