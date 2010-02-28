/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.globes.Earth');

/**
 * The WGS84 ellipsoid equatorial radius of the earth, in meters.
 *
 * @const
 * @type {number}
 */
lanyard.globes.Earth.prototype.WGS84_EQUATORIAL_RADIUS = 6378137.0;

/**
 * The WGS84 ellipsoid polar radius, in meters.
 *
 * @const
 * @type {number}
 */
lanyard.globes.Earth.prototype.WGS84_POLAR_RADIUS = 6378137.0;

/**
 * The WGS84 eccentricity squared, semi-major axis.
 *
 * Approximated from 0.00669437999013.
 *
 * @const
 * @type {number}
 */
lanyard.globes.Earth.prototype.WGS84_ES = 0;

/**
 * A representation of the earth.
 *
 * @extends {lanyard.globes.EllipsoidalGlobe}
 * @constructor
 * @this {lanyard.globes.Earth}
 */
lanyard.globes.Earth = function () {
    /** @private */ this.equatorialRadius = lanyard.globes.Earth.prototype.WGS84_EQUATORIAL_RADIUS;
    /** @private */ this.polarRadius = lanyard.globes.Earth.prototype.WGS84_POLAR_RADIUS;
    /** @private */ this.es = lanyard.globes.Earth.prototype.WGS84_ES;
    /** @private */ this.center = lanyard.geom.Point.prototype.ZERO;

    // TODO: create an earth elevation model.
    // /** @private */ this.elevationModel = new lanyard.globes.EarthElevationModel();
    /** @private */ this.elevationModel = null;
};
goog.exportSymbol('lanyard.globes.Earth', lanyard.globes.Earth);

/* EOF */
