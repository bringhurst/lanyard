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

goog.provide('lanyard.geom.Frustum');

goog.require('lanyard.geom.Matrix');



/**
 * Create a frustum from six Planes, which define its boundaries.
 *
 * @constructor
 * @this {lanyard.geom.Frustum}
 * @param {lanyard.geom.Plane} near the near plane.
 * @param {lanyard.geom.Plane} far the far plane.
 * @param {lanyard.geom.Plane} left the left side of the view frustum.
 * @param {lanyard.geom.Plane} right the right side of the view frustm.
 * @param {lanyard.geom.Plane} topp the top of the view frustum.
 * @param {lanyard.geom.Plane} bottom the bottom of the view frustum.
 */
lanyard.geom.Frustum = function(near, far, left, right, bottom, topp) {
  /** @private */ this._near = near;
  /** @private */ this._far = far;
  /** @private */ this._left = left;
  /** @private */ this._right = right;
  /** @private */ this._bottom = bottom;
  /** @private */ this._topp = topp;
};
goog.exportSymbol('lanyard.geom.Frustum', lanyard.geom.Frustum);


/**
 * Create a default frustum with six Planes. This defines a box of
 * dimension (2, 2, 2) centered at the origin.
 *
 * @return {lanyard.geom.Frustum} the new default Frustum.
 */
lanyard.geom.Frustum.prototype.createDefault = function() {
  var near = new lanyard.geom.Plane(0, 0, 1, 1);
  var far = new lanyard.geom.Plane(0, 0, 0 - 1, 1);
  var left = new lanyard.geom.Plane(1, 0, 0, 1);
  var right = new lanyard.geom.Plane(0 - 1, 0, 0, 1);
  var bottom = new lanyard.geom.Plane(0, 1, 0, 1);
  var topp = new lanyard.geom.Plane(0, 0 - 1, 0, 1);

  return new lanyard.geom.Frustum(near, far, left, right, bottom, topp);
};


/**
 * Obtain the near Plane.
 *
 * @return {lanyard.geom.Plane} the near Plane.
 */
lanyard.geom.Frustum.prototype.getNear = function() {
  return this._near;
};


/**
 * Obtain the far Plane.
 *
 * @return {lanyard.geom.Plane} the far Plane.
 */
lanyard.geom.Frustum.prototype.getFar = function() {
  return this._far;
};


/**
 * Obtain the left Plane.
 *
 * @return {lanyard.geom.Plane} the left Plane.
 */
lanyard.geom.Frustum.prototype.getLeft = function() {
  return this._left;
};


/**
 * Obtain the right Plane.
 *
 * @return {lanyard.geom.Plane} the right Plane.
 */
lanyard.geom.Frustum.prototype.getRight = function() {
  return this._right;
};


/**
 * Obtain the bottom Plane.
 *
 * @return {lanyard.geom.Plane} the bottom Plane.
 */
lanyard.geom.Frustum.prototype.getBottom = function() {
  return this._bottom;
};


/**
 * Obtain the top Plane.
 *
 * @return {lanyard.geom.Plane} the top Plane.
 */
lanyard.geom.Frustum.prototype.getTop = function() {
  return this._topp;
};


/**
 *
 *
 * @param {lanyard.geom.Matrix} m
 * @return {lanyard.geom.Frustum}
 */
lanyard.geom.Frustum.prototype.getInverseTransformed = function(m) {
  // Assumes orthogonal matrices with translation.
  var it = m.getTranspose();

  var n = lanyard.geom.Plane.prototype.fromPoint(it.transform(this._near.getVector()));
  var f = lanyard.geom.Plane.prototype.fromPoint(it.transform(this._far.getVector()));
  var l = lanyard.geom.Plane.prototype.fromPoint(it.transform(this._left.getVector()));
  var r = lanyard.geom.Plane.prototype.fromPoint(it.transform(this._right.getVector()));
  var b = lanyard.geom.Plane.prototype.fromPoint(it.transform(this._bottom.getVector()));
  var t = lanyard.geom.Plane.prototype.fromPoint(it.transform(this._topp.getVector()));

  return new lanyard.geom.Frustum(n, f, l, r, b, t);
};


/**
 *
 *
 * @param {lanyard.geom.Extent} extent
 * @return {boolean} if this frustum intersects.
 */
lanyard.geom.Frustum.prototype.intersects = function(extent) {
  // See if the extent's bounding sphere is within or intersects the frustum.
  var c = extent.getCenter();
  var nr = -extent.getRadius();

  if (this._far.dot(c) <= nr) {
    return false;
  }

  if (this._left.dot(c) <= nr) {
    return false;
  }

  if (this._right.dot(c) <= nr) {
    return false;
  }

  if (this._topp.dot(c) <= nr) {
    return false;
  }

  if (this._bottom.dot(c) <= nr) {
    return false;
  }

  if (this._near.dot(c) <= nr) {
    return false;
  }

  return true;
};


/**
 *
 *
 * @param {lanyard.geom.Point} point
 * @return {boolean}
 */
lanyard.geom.Frustum.prototype.contains = function(point) {
  if (this._far.dot(point) < 0) {
    return false;
  }

  if (this._left.dot(point) < 0) {
    return false;
  }

  if (this._right.dot(point) < 0) {
    return false;
  }

  if (this._topp.dot(point) < 0) {
    return false;
  }

  if (this._bottom.dot(point) < 0) {
    return false;
  }

  if (this._near.dot(point) < 0) {
    return false;
  }

  return true;
};


/**
 * Obtain a string representation of this Frustum.
 *
 * @return {string} a string representation of this frustum.
 */
lanyard.geom.Frustum.prototype.toString = function() {
  return 'near: ' + this._near.toString() + '... far: ' + this._far.toString() +
      '... left: ' + this._left.toString() + '... right: ' + this._right.toString() +
      '... bottom: ' + this._bottom.toString() + '... top: ' + this._topp.toString();
};

/* EOF */
