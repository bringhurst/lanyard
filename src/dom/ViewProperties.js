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

goog.provide('lanyard.dom.ViewProperties');

goog.require('goog.debug.Logger');



/**
 * Storage of view properties for user input.
 *
 * @constructor
 */
lanyard.dom.ViewProperties = function() {
  /** @type {lanyard.geom.LatLon} */
  this.latLon = null;

  /** @type {lanyard.geom.Angle} */
  this.heading = null;

  /** @type {lanyard.geom.Angle} */
  this.pitch = null;

  /** @type {?number} */
  this.zoom = null;
};

/* EOF */
