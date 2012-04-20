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

goog.provide('lanyard.geom.Angle');



/**
 * A basic angle geometry.
 *
 * @constructor
 * @this {lanyard.geom.Angle}
 * @param {number} degrees The degree value to set this angle to.
 * @param {number} radians The radian value to set this angle to.
 */
lanyard.geom.Angle = function(degrees, radians) {
  /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.geom.Angle');

  if (isNaN(degrees)) {
    this._logger.severe('Attempted to create an angle with invalid degrees.');
  }

  if (isNaN(radians)) {
    this._logger.severe('Attempted to create an angle with invalid radians.');
  }

  /** @private */ this._degrees = degrees;
  /** @private */ this._radians = radians;
};
goog.exportSymbol('lanyard.geom.Angle', lanyard.geom.Angle);


/**
 * A value to use for converting from degrees to radians.
 *
 * @const
 * @type {number}
 */
lanyard.geom.Angle.prototype.DEGREES_TO_RADIANS = Math.PI / 180.0;
goog.exportSymbol('lanyard.geom.Angle.prototype.DEGREES_TO_RADIANS',
    lanyard.geom.Angle.prototype.DEGREES_TO_RADIANS);


/**
 * A value to use for converting from radians to degrees.
 *
 * @const
 * @type {number}
 */
lanyard.geom.Angle.prototype.RADIANS_TO_DEGREES = 180.0 / Math.PI;
goog.exportSymbol('lanyard.geom.Angle.prototype.RADIANS_TO_DEGREES',
    lanyard.geom.Angle.prototype.RADIANS_TO_DEGREES);


/**
 * Pi divided by 2.
 *
 * @const
 * @type {number}
 */
lanyard.geom.Angle.prototype.PIOver2 = Math.PI / 2;
goog.exportSymbol('lanyard.geom.Angle.prototype.PIOver2',
    lanyard.geom.Angle.prototype.PIOver2);


/**
 * Creates an Angle from degrees.
 *
 * @param {number} d degrees for the new angle.
 * @return {lanyard.geom.Angle} the new angle.
 */
lanyard.geom.Angle.prototype.fromDegrees = function(d) {
  return new lanyard.geom.Angle(d, lanyard.geom.Angle.prototype.DEGREES_TO_RADIANS * d);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.fromDegrees', lanyard.geom.Angle.prototype.fromDegrees);


/**
 * Creates an Angle from radians.
 *
 * @param {number} r radians for the new angle.
 * @return {lanyard.geom.Angle} the new angle.
 */
lanyard.geom.Angle.prototype.fromRadians = function(r) {
  return new lanyard.geom.Angle(lanyard.geom.Angle.prototype.RADIANS_TO_DEGREES * r, r);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.fromRadians', lanyard.geom.Angle.prototype.fromRadians);


/**
 * Gets the degree value for this angle.
 *
 * @this {lanyard.geom.Angle}
 * @return {number} the degree value of this angle.
 */
lanyard.geom.Angle.prototype.getDegrees = function() {
  return this._degrees;
};
goog.exportSymbol('lanyard.geom.Angle.prototype.getDegrees', lanyard.geom.Angle.prototype.getDegrees);


/**
 * Gets the radians value for this angle.
 *
 * @this {lanyard.geom.Angle}
 * @return {number} the radian value of this angle.
 */
lanyard.geom.Angle.prototype.getRadians = function() {
  return this._radians;
};
goog.exportSymbol('lanyard.geom.Angle.prototype.getRadians', lanyard.geom.Angle.prototype.getRadians);


/**
 * Represents an angle of zero degrees.
 *
 * @const
 * @type {lanyard.geom.Angle}
 */
lanyard.geom.Angle.prototype.ZERO = lanyard.geom.Angle.prototype.fromDegrees(0);
goog.exportSymbol('lanyard.geom.Angle.prototype.ZERO', lanyard.geom.Angle.prototype.ZERO);


/**
 * Represents a right angle of positive 90 degrees.
 *
 * @const
 * @type {lanyard.geom.Angle}
 */
lanyard.geom.Angle.prototype.POS90 = lanyard.geom.Angle.prototype.fromDegrees(90);
goog.exportSymbol('lanyard.geom.Angle.prototype.POS90', lanyard.geom.Angle.prototype.POS90);


/**
 * Represents a right angle of negative 90 degrees.
 *
 * @const
 * @type {lanyard.geom.Angle}
 */
lanyard.geom.Angle.prototype.NEG90 = lanyard.geom.Angle.prototype.fromDegrees(-90);
goog.exportSymbol('lanyard.geom.Angle.prototype.NEG90', lanyard.geom.Angle.prototype.NEG90);


/**
 * Represents an angle of positive 180 degrees.
 *
 * @const
 * @type {lanyard.geom.Angle}
 */
lanyard.geom.Angle.prototype.POS180 = lanyard.geom.Angle.prototype.fromDegrees(180);
goog.exportSymbol('lanyard.geom.Angle.prototype.POS180', lanyard.geom.Angle.prototype.POS180);


/**
 * Represents an angle of negative 180 degrees.
 *
 * @const
 * @type {lanyard.geom.Angle}
 */
lanyard.geom.Angle.prototype.NEG180 = lanyard.geom.Angle.prototype.fromDegrees(-180);
goog.exportSymbol('lanyard.geom.Angle.prototype.NEG180', lanyard.geom.Angle.prototype.NEG180);


/**
 * Represents an angle of positive 360 degrees.
 *
 * @const
 * @type {lanyard.geom.Angle}
 */
lanyard.geom.Angle.prototype.POS360 = lanyard.geom.Angle.prototype.fromDegrees(360);
goog.exportSymbol('lanyard.geom.Angle.prototype.POS360', lanyard.geom.Angle.prototype.POS360);


/**
 * Create an angle from degrees latitude.
 *
 * @param {number} d degrees latitude.
 * @return {lanyard.geom.Angle} the new angle.
 */
lanyard.geom.Angle.prototype.fromDegreesLatitude = function(d) {
  d = d < -90 ? -90 : d > 90 ? 90 : d;
  var r = lanyard.geom.Angle.prototype.DEGREES_TO_RADIANS * d;

  return new lanyard.geom.Angle(d, r);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.fromDegreesLatitude',
    lanyard.geom.Angle.prototype.fromDegreesLatitude);


/**
 * Create an angle from radians latitude.
 *
 * @param {number} r radians latitude.
 * @return {lanyard.geom.Angle} the new angle.
 */
lanyard.geom.Angle.prototype.fromRadiansLatitude = function(r) {
  r = r < lanyard.geom.Angle.prototype.PIOver2 ? -lanyard.geom.Angle.prototype.PIOver2 :
      r > lanyard.geom.Angle.prototype.PIOver2 ? lanyard.geom.Angle.prototype.PIOver2 : r;
  var d = lanyard.geom.Angle.prototype.RADIANS_TO_DEGREES * r;
  d = d < -90 ? -90 : d > 90 ? 90 : d;

  return new lanyard.geom.Angle(d, r);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.fromRadiansLatitude',
    lanyard.geom.Angle.prototype.fromRadiansLatitude);


/**
 * Create an angle from degrees longitude.
 *
 * @param {number} degrees the degrees longitude.
 * @return {lanyard.geom.Angle} the new angle.
 */
lanyard.geom.Angle.prototype.fromDegreesLongitude = function(degrees) {
  degrees = degrees < -180 ? -180 : degrees > 180 ? 180 : degrees;
  var radians = lanyard.geom.Angle.prototype.DEGREES_TO_RADIANS * degrees;
  radians = radians < -Math.PI ? -Math.PI : radians > Math.PI ? Math.PI : radians;

  return new lanyard.geom.Angle(degrees, radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.fromDegreesLongitude',
    lanyard.geom.Angle.prototype.fromDegreesLongitude);


/**
 * Create an angle from radians longitude.
 *
 * @param {number} radians the radians longitude.
 * @return {lanyard.geom.Angle} the new angle.
 */
lanyard.geom.Angle.prototype.fromRadiansLongitude = function(radians) {
  radians = radians < -Math.PI ? -Math.PI : radians > Math.PI ? Math.PI : radians;
  var degrees = lanyard.geom.Angle.prototype.RADIANS_TO_DEGREES * radians;
  degrees = degrees < -180 ? -180 : degrees > 180 ? 180 : degrees;

  return new lanyard.geom.Angle(degrees, radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.fromRadiansLongitude',
    lanyard.geom.Angle.prototype.fromRadiansLongitude);


/**
 * Obtains an Angle from rectangular coordinates.
 *
 * @param {number} x the abscissa coordinate.
 * @param {number} y the ordinate coordinate.
 * @return {lanyard.geom.Angle} a new angle, whose size is determined from x and y.
 */
lanyard.geom.Angle.prototype.fromXY = function(x, y) {
  var radians = Math.atan2(y, x);
  return new lanyard.geom.Angle(lanyard.geom.Angle.prototype.RADIANS_TO_DEGREES * radians, radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.fromXY',
    lanyard.geom.Angle.prototype.fromXY);


/**
 * Obtains the sum of these two Angles. Does not accept a null argument.
 * This method is commutative, so a.add(b) and b.add(a) are equivalent.
 * Neither this Angle nor angle is changed, instead the result is
 * returned as a new Angle.
 *
 * @this {lanyard.geom.Angle}
 * @param {lanyard.geom.Angle} angle the Angle to add to this one.
 * @return {lanyard.geom.Angle} an Angle whose size is the total of this Angles and angles size.
 */
lanyard.geom.Angle.prototype.add = function(angle) {
  return lanyard.geom.Angle.prototype.fromDegrees(this._degrees + angle.getDegrees());
};
goog.exportSymbol('lanyard.geom.Angle.prototype.add',
    lanyard.geom.Angle.prototype.add);


/**
 * Obtains the difference of these two Angles. Does not accept a null argument. This method is not
 * commutative. Neither this Angle nor angle is changed, instead the result is returned as
 * a new Angle.
 *
 * @this {lanyard.geom.Angle}
 * @param {lanyard.geom.Angle} angle the Angle to subtract from this Angle.
 * @return {lanyard.geom.Angle} a new Angle correpsonding to this Angle's size minus angle's size.
 */
lanyard.geom.Angle.prototype.subtract = function(angle) {
  return lanyard.geom.Angle.prototype.fromDegrees(this._degrees - angle.getDegrees());
};
goog.exportSymbol('lanyard.geom.Angle.prototype.subtract', lanyard.geom.Angle.prototype.subtract);


/**
 * Multiplies this Angle by multiplier. This Angle remains unchanged. The
 * result is returned as a new Angle.
 *
 * @this {lanyard.geom.Angle}
 * @param {number} multiplier a scalar by which this Angle is multiplied.
 * @return {lanyard.geom.Angle} a new Angle whose size equals this Angle's size multiplied by multiplier.
 */
lanyard.geom.Angle.prototype.multiply = function(multiplier) {
  return lanyard.geom.Angle.prototype.fromDegrees(this._degrees * multiplier);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.multiply', lanyard.geom.Angle.prototype.multiply);


/**
 * Divides this Angle by another angle. This Angle remains unchanged, instead the
 * resulting value in degrees is returned.
 *
 * @this {lanyard.geom.Angle}
 * @param {lanyard.geom.Angle} angle the Angle by which to divide.
 * @return {number} this Angle's degrees divided by angle's degrees.
 */
lanyard.geom.Angle.prototype.divideByAngle = function(angle) {
  return this._degrees / angle.getDegrees();
};
goog.exportSymbol('lanyard.geom.Angle.prototype.divideByAngle', lanyard.geom.Angle.prototype.divideByAngle);


/**
 * Divides this Angle by divisor. This Angle remains unchanged. The result is
 * returned as a new Angle. Behaviour is undefined if divisor equals zero.
 *
 * @this {lanyard.geom.Angle}
 * @param {number} divisor the number to be divided by.
 * @return {lanyard.geom.Angle} a new Angle equivalent to this Angle divided by divisor.
 */
lanyard.geom.Angle.prototype.divideByDegrees = function(divisor) {
  return lanyard.geom.Angle.prototype.fromDegrees(this._degrees / divisor);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.divideByDegrees', lanyard.geom.Angle.prototype.divideByDegrees);


/**
 * Adds this angle to radians. This Angle remains unchanged. The result is
 * returned as a new Angle.
 *
 * @this {lanyard.geom.Angle}
 * @param {number} radians the number to be added.
 * @return {lanyard.geom.Angle} a new angle equivalent to this Angle added to radians.
 */
lanyard.geom.Angle.prototype.addRadians = function(radians) {
  return lanyard.geom.Angle.prototype.fromRadians(this._radians + radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.addRadians', lanyard.geom.Angle.prototype.addRadians);


/**
 * Adds this angle to degreess. This Angle remains unchanged. The result is
 * returned as a new Angle.
 *
 * @this {lanyard.geom.Angle}
 * @param {number} degrees the number to be added.
 * @return {lanyard.geom.Angle} a new angle equivalent to this Angle added to degrees.
 */
lanyard.geom.Angle.prototype.addDegrees = function(degrees) {
  return lanyard.geom.Angle.prototype.fromDegrees(this._degrees + degrees);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.addDegrees', lanyard.geom.Angle.prototype.addDegrees);


/**
 * Subtracts this angle from radians. This Angle remains unchanged. The result is
 * returned as a new Angle.
 *
 * @this {lanyard.geom.Angle}
 * @param {number} radians the number to be subtracted.
 * @return {lanyard.geom.Angle} a new angle equivalent to this Angle subtracted by radians.
 */
lanyard.geom.Angle.prototype.subtractRadians = function(radians) {
  return lanyard.geom.Angle.prototype.fromRadians(this._radians - radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.subtractRadians', lanyard.geom.Angle.prototype.subtractRadians);


/**
 * Find the sine of this angle.
 *
 * @this {lanyard.geom.Angle}
 * @return {number} the sine value of this angle.
 */
lanyard.geom.Angle.prototype.sin = function() {
  return Math.sin(this._radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.sin', lanyard.geom.Angle.prototype.sin);


/**
 * Find the sine half angle of this angle.
 *
 * @this {lanyard.geom.Angle}
 * @return {number} the sine half angle value of this angle.
 */
lanyard.geom.Angle.prototype.sinHalfAngle = function() {
  return Math.sin(0.5 * this._radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.sinHalfAngle', lanyard.geom.Angle.prototype.sinHalfAngle);


/**
 * Find the arcsine Angle of this value.
 *
 * @return {lanyard.geom.Angle} the new angle from the arcsine of sine.
 */
lanyard.geom.Angle.prototype.asin = function(sine) {
  return lanyard.geom.Angle.prototype.fromRadians(Math.asin(sine));
};
goog.exportSymbol('lanyard.geom.Angle.prototype.asin', lanyard.geom.Angle.prototype.asin);


/**
 * Find the cosine of this angle.
 *
 * @this {lanyard.geom.Angle}
 * @return {number} the cosine value of this angle.
 */
lanyard.geom.Angle.prototype.cos = function() {
  return Math.cos(this._radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.cos', lanyard.geom.Angle.prototype.cos);


/**
 * Find the cosine value of half of this angle.
 *
 * @this {lanyard.geom.Angle}
 * @return {number} the cosine value of half of this angle.
 */
lanyard.geom.Angle.prototype.cosHalfAngle = function() {
  return Math.cos(0.5 * this._radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.cosHalfAngle', lanyard.geom.Angle.prototype.cosHalfAngle);


/**
 * Find the Angle of the arccosine.
 *
 * @return {lanyard.geom.Angle} the angle created by the cosine.
 */
lanyard.geom.Angle.prototype.acos = function(cosine) {
  return lanyard.geom.Angle.prototype.fromRadians(Math.acos(cosine));
};
goog.exportSymbol('lanyard.geom.Angle.prototype.acos', lanyard.geom.Angle.prototype.acos);


/**
 * Obtains the tangent of half of this Angle.
 *
 * @this {lanyard.geom.Angle}
 * @return {number} the trigonometric tangent of half of this Angle.
 */
lanyard.geom.Angle.prototype.tanHalfAngle = function() {
  return Math.tan(0.5 * this._radians);
};
goog.exportSymbol('lanyard.geom.Angle.prototype.tanHalfAngle', lanyard.geom.Angle.prototype.tanHalfAngle);


/**
 * Obtains an angle based on the tangent of a value.
 *
 * @return {lanyard.geom.Angle} a new angle based on tan.
 */
lanyard.geom.Angle.prototype.atan = function(tan) {
  return lanyard.geom.Angle.prototype.fromRadians(Math.atan(tan));
};
goog.exportSymbol('lanyard.geom.Angle.prototype.atan', lanyard.geom.Angle.prototype.atan);


/**
 * Obtains the average of two Angles. This method is commutative, so midAngle(m, n) and
 * midAngle(n, m) are equivalent.
 *
 * @param {lanyard.geom.Angle} a1 the first Angle.
 * @param {lanyard.geom.Angle} a2 the second Angle.
 * @return {lanyard.geom.Angle} the average of a1 and a2.
 */
lanyard.geom.Angle.prototype.midAngle = function(a1, a2) {
  return lanyard.geom.Angle.prototype.fromDegrees(0.5 * (a1.getDegrees() + a2.getDegrees()));
};
goog.exportSymbol('lanyard.geom.Angle.prototype.midAngle', lanyard.geom.Angle.prototype.midAngle);


/**
 * Obtains the average of two or three Angles. The order of parameters does not matter.
 *
 * @param {lanyard.geom.Angle} a the first Angle.
 * @param {lanyard.geom.Angle} b the second Angle.
 * @param {lanyard.geom.Angle} c the third optional Angle.
 * @return {lanyard.geom.Angle} the average of a1, a2 and a3 if it exists.
 */
lanyard.geom.Angle.prototype.average = function(a, b, c) {
  if (c) {
    return lanyard.geom.Angle.prototype.fromDegrees((a._degrees + b._degrees + c._degrees) / 3);
  } else {
    return lanyard.geom.Angle.prototype.fromDegrees(0.5 * (a._degrees + b._degrees));
  }
};
goog.exportSymbol('lanyard.geom.Angle.prototype.average', lanyard.geom.Angle.prototype.average);


/**
 * Compares this Angle with angle for order. Returns a negative integer if this is the
 * smaller Angle, a positive integer if this is the larger, and zero if both Angles are
 * equal.
 *
 * @param {lanyard.geom.Angle} angle the Angle to compare against.
 * @return {number} -1 if this Angle is smaller, 0 if both are equal and +1 if this Angle is larger.
 */
lanyard.geom.Angle.prototype.compareTo = function(angle) {
  if (this._degrees < angle.getDegrees()) {
    return -1;
  }

  if (this._degrees > angle.getDegrees()) {
    return 1;
  }

  return 0;
};
goog.exportSymbol('lanyard.geom.Angle.prototype.compareTo', lanyard.geom.Angle.prototype.compareTo);


/**
 * Get the normalized degrees latitude.
 *
 * @param {number} degrees the degrees latitude.
 * @return {number} the normalized degrees.
 */
lanyard.geom.Angle.prototype.normalizedDegreesLatitude = function(degrees) {
  /** @type {number} */
  var lat = degrees % 180;

  return lat > 90 ? 180 - lat : lat < -90 ? -180 - lat : lat;
};


/**
 * Get the normalized degrees longitude.
 *
 * @param {number} degrees the degrees longitude.
 * @return {number} the normalized degrees.
 */
lanyard.geom.Angle.prototype.normalizedDegreesLongitude = function(degrees) {
  /** @type {number} */
  var lon = degrees % 360;

  return lon > 180 ? lon - 360 : lon < -180 ? 360 + lon : lon;
};


/**
 * This angle as a string.
 *
 * @this {lanyard.geom.Angle}
 * @return {string} the string representation of this angle.
 */
lanyard.geom.Angle.prototype.toString = function() {
  return 'This Angle equals ' + this._degrees + ' (' + this._radians + ' radians).';
};
goog.exportSymbol('lanyard.geom.Angle.prototype.toString', lanyard.geom.Angle.prototype.toString);

/* EOF */
