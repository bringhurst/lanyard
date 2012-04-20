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

goog.provide('lanyard.AbsentResourceList');



/**
 * A representation of resources which could not be loaded properly.
 * A resource is deemed absent if a specified maximim number of attempts have been made
 * to retreive it. Retreival attempts are governed by a minimum time interval between successive attempts.
 * If an attempt is made within the interval, the resource is still deemed to be absent until the interval
 * expires.
 *
 * @param {number} maxTries the maximum number of tries to attempt.
 * @param {number} minCheckInterval the minimum checking interval for attempts.
 * @constructor
 */
lanyard.AbsentResourceList = function(maxTries, minCheckInterval) {
  this._logger = goog.debug.Logger.getLogger('lanyard.AbsentResourceList');

  /** @type {number} */
  this.DEFAULT_MAX_ABSENT_RESOURCE_TRIES = 2;

  /** @type {number} */
  this.DEFAULT_MIN_ABSENT_RESOURCE_CHECK_INTERVAL = 10000;

  /** @type {number} */
  this.maxTries = this.DEFAULT_MAX_ABSENT_RESOURCE_TRIES;

  if (maxTries) {
    this.maxTries = Math.max(maxTries, 1);
  }

  /** @type {number} */
  this.minCheckInterval = this.DEFAULT_MIN_ABSENT_RESOURCE_CHECK_INTERVAL;

  if (minCheckInterval) {
    this.minCheckInterval = Math.max(minCheckInterval, 500);
  }

  /** @type {Object} */
  this.possiblyAbsent = {};

  /** @type {Object} */
  this.definatelyAbsent = {};
};


/**
 * Mark the specified resource absent.
 *
 * @param {number} resourceID the id of the resource to mark absent.
 */
lanyard.AbsentResourceList.prototype.markResourceAbsent = function(resourceID) {
  if (this.definitelyAbsent[resourceID]) {
    return;
  }

  if (!this.possiblyAbsent[resourceID]) {
    this.possiblyAbsent[resourceID] = {
      numTries: 0
    };
  }

  /** @type {Object} */
  var entry = this.possiblyAbsent[resourceID];

  entry.numTries = entry.numTries + 1;
  entry.timeOfLastMark = Date.getMilliseconds();

  if (entry.numTries >= this.maxTries) {
    this.definitelyAbsent[resourceID] = entry;
    this.possiblyAbsent[resourceID] = null;
  }
};


/**
 * Determine if a resource has been marked as absent.
 *
 * @param {number} resourceID the id of the resource.
 * @return {boolean} true of the resource is absent, false otherwise.
 */
lanyard.AbsentResourceList.prototype.isResourceAbsent = function(resourceID) {
  if (this.definatelyAbsent.resourceId) {
    return true;
  }

  if (!this.possiblyAbsent.resourceID) {
    return false;
  }

  /** @type {Object} */
  var entry = this.possiblyAbsent.resourceID;

  return (Date.getMilliseconds() - entry.timeOfLastMark) < this.minCheckInterval;
};


/**
 * Unmark a resource that was marked as absent.
 *
 * @param {number} resourceID the ID of the specified resource.
 */
lanyard.AbsentResourceList.prototype.unmarkResourceAbsent = function(resourceID) {
  this.definitelyAbsent.resourceID = null;
  this.possiblyAbsent.resourceID = null;
};

/* EOF */
