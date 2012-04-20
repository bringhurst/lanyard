/*global goog, lanyard */

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

goog.provide('lanyard.globes.Mars');

goog.require('lanyard.globes.EllipsoidalGlobe');



/**
 * A representation of mars.
 *
 * @extends {lanyard.globes.EllipsoidalGlobe}
 * @constructor
 * @this {lanyard.globes.Mars}
 */
lanyard.globes.Mars = function() {

  /**
     * The ellipsoid equatorial radius of Mars, in meters.
     *
     * @type {number}
     * @private
     */
  this.equatorialRadius = 3396200.0;

  /**
     * The ellipsoid polar radius, in meters.
     *
     * @type {number}
     * @private
     */
  this.polarRadius = 3376200.0;

  /**
     * The eccentricity squared, semi-major axis.
     *
     * @type {number}
     * @private
     */
  this.es = 0.00589;

  /** @private */ this.center = lanyard.geom.Point.prototype.ZERO;

  /** @private */ this.elevationModel = null;

  // call super
  lanyard.globes.EllipsoidalGlobe.call(
      this, this.equatorialRadius, this.polarRadius, this.es, this.elevationModel);

  /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.globes.Mars');
};
goog.exportSymbol('lanyard.globes.Mars', lanyard.globes.Mars);
goog.inherits(lanyard.globes.Mars, lanyard.globes.EllipsoidalGlobe);


/**
 * Get the radius of Mars
 *
 * @return {number} the radius of Mars.
 */
lanyard.globes.Mars.prototype.getRadius = function() {
  return this.equatorialRadius;
};

/* EOF */
