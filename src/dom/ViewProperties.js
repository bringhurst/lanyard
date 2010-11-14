/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.dom.ViewProperties');

goog.require('goog.debug.Logger');

/**
 * Storage of view properties for user input.
 *
 * @constructor
 */
lanyard.dom.ViewProperties = function () {
    /** @type {lanyard.geom.LatLon} */
    this.latLon = null;

    /** @type {lanyard.geom.Angle} */
    this.heading = null;

    /** @type {lanyard.geom.Angle} */
    this.pitch = null;

    /** @type {number} */
    this.zoom = null;
};

/* EOF */
