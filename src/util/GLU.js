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

goog.provide('lanyard.util.GLU');

/**
 * @constructor
 */
lanyard.util.GLU = function() {};

/**
 * Maps the specified window coordinates into object coordinates using model, proj, and view.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {lanyard.geom.Matrix} model
 * @param {lanyard.geom.Matrix} proj
 * @param {Array.<number>} view the viewport rectangle.
 * @return {lanyard.geom.Point}
 */
lanyard.util.GLU.prototype.unProject = function (x, y, z, model, proj, view) {
    var inverseProjection = (model.multiply(proj)).getInverse();
    var cords = new lanyard.geom.Point(
        2 * (x - view[0]) / view[2] - 1,
        2 * (y - view[1]) / view[3] - 1,
        2 * (z) - 1,
        1
    );

    return cords.translate(inverseProjection);
};

/* EOF */
