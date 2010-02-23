/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.Intersection');

goog.require('lanyard.geom.Point');

/**
 * A way to represent an intersection.
 *
 * @constructor
 * @this {lanyard.geom.Intersection}
 * @param {lanyard.geom.Point} intersectionPoint the point of intersection.
 * @param {boolean} isTangent if the intersection is a tangent.
 */
lanyard.geom.Intersection = function (intersectionPoint, isTangent) {
    /** @private */ this._intersectionPoint = intersectionPoint;
    /** @private */ this._isTangent = isTangent;
};
goog.exportSymbol('lanyard.geom.Intersection', lanyard.geom.Intersection);

/**
 * Get the point of intersection.
 *
 * @return {lanyard.geom.Point} the point of intersection.
 */
lanyard.geom.Intersection.prototype.getIntersectionPoint = function () {
    return this._intersectionPoint;
};

/**
 * Return if this intersection is a tangent.
 *
 * @return {boolean} if this intersection is a tangent.
 */
lanyard.geom.Intersection.prototype.isTangent = function () {
    return this._isTangent;
};

/**
 * Returns a string representation of this Intersection.
 *
 * @return {String} a string representation of this Intersection.
 */
lanyard.geom.Intersection.prototype.toString = function () {
    var pt = "Intersection Point: " + this._intersectionPoint.toString();
    var tang = this._isTangent ? " is a tangent." : " not a tangent";

    return pt + tang;
};

/* EOF */
