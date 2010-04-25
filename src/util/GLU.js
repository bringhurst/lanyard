/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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
 * @param {lanyard.geom.Matrix} view
 * @return {lanyard.geom.Point}
 */
lanyard.util.GLU.prototype.unProject = function (x, y, z, model, proj, view) {
    var inverseProjection = (model.multiply(proj)).getInverse();
    var cords = new lanyard.geom.Point(
        2 * (x - view._m11) / view._m13 - 1,
        2 * (y - view._m12) / view._m14 - 1,
        2 * (z) - 1,
        1
    );

    // FIXME: does translate work here?
    return inverseProjection.translate(cords);
};

/* EOF */
