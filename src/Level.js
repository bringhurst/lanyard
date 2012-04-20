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

goog.provide('lanyard.Level');

goog.require('lanyard.AbsentResourceList');



/**
 * A representation of a level.
 *
 * @constructor
 * @param {Array.<*>} params the array of params for this level.
 */
lanyard.Level = function(params) {
  /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.Level');

  if (!params) {
    this._logger.severe('Attempted to create a level with invalid params.');
  }

  /** @type {Array.<*>} */
  this.params = params;

  /**
     * Null or empty leve name signifies no data resources associated with this level.
     *
     * @private
     * @type {string}
     */
  this.levelName = this.params.levelName ? this.params.levelName : '';

  /** @type {number} */
  this.levelNumber = this.params.levelNumber;

  /** @type {lanyard.geom.LatLon} */
  this.tileDelta = this.params.tileDelta;

  /** @type {number} */
  this.tileWidth = this.params.tileWidth;

  /** @type {number} */
  this.tileHeight = this.params.tileHeight;

  /** @type {string} */
  this.service = this.params.service;

  /** @type {string} */
  this.dataset = this.params.datasetName;

  /** @type {string} */
  this.formatSuffix = this.params.formatSuffix;

  /** @type {Function} */
  this.urlbuilder = this.params.tileUrlBuilder;

  /** @type {number} */
  var averageTileSize = 0.5 * (this.tileWidth + this.tileHeight);

  /** @type {number} */
  var averageTileDelta =
      0.5 * (this.tileDelta.getLatitude().getRadians() + this.tileDelta.getLongitude().getRadians());

  /** @type {number} */
  this.averageTexelSize = averageTileDelta / averageTileSize;

  /** @type {number} */
  var maxAbsentTileAttempts =
      this.params.maxAbsentTileAttempts ? this.params.maxAbsentTileAttempts : null;

  /** @type {number} */
  var minAbsentTileCheckInterval =
      this.params.minAbsentTileCheckInterval ? this.params.minAbsentTileCheckInterval : null;

  /**
     * A tile is deemed absent if a specified maximum number of attempts have been made to retreive it.
     * Retreival attempts are  igoverned by a minimum time interval between successive attempts.
     * If an attempt is made within this interval, the tile is still deemed to be absent until the interval
     * expires.
     *
     * @type {lanyard.AbsentResourceList}
     */
  this.absentTiles = new lanyard.AbsentResourceList(maxAbsentTileAttempts, minAbsentTileCheckInterval);
};


/**
 * @const
 * @type {number}
 */
lanyard.Level.prototype.DEFAULT_MAX_ABSENT_TILE_ATTEMPTS = 2;


/**
 * @const
 * @type {number}
 */
lanyard.Level.prototype.DEFAULT_MIN_ABSENT_TILE_CHECK_INTERVAL = 10000; // milliseconds


/**
 * Accessor for the tile params.
 *
 * @return {Object} the tile params.
 */
lanyard.Level.prototype.getParams = function() {
  return this.params;
};


/**
 * Accessor for the tile path.
 *
 * @return {string} the tile path.
 */
lanyard.Level.prototype.getPath = function() {
  return this.path;
};


/**
 * Get the level number for this tile.
 *
 * @return {number} the current level number for this tile.
 */
lanyard.Level.prototype.getLevelNumber = function() {
  return this.levelNumber;
};


/**
 * Get the level name for this tile.
 *
 * @return {string} this tile's level name.
 */
lanyard.Level.prototype.getLevelName = function() {
  return this.levelName;
};


/**
 * Get the tile delta.
 *
 * @return {lanyard.geom.LatLon} the tile delta.
 */
lanyard.Level.prototype.getTileDelta = function() {
  return this.tileDelta;
};


/**
 * Get the tile width.
 *
 * @return {number} the tile width.
 */
lanyard.Level.prototype.getTileWidth = function() {
  return this.tileWidth;
};


/**
 * Get the tile's height.
 *
 * @return {number} the tile's height.
 */
lanyard.Level.prototype.getTileHeight = function() {
  return this.tileHeight;
};


/**
 * Get the format suffix for this tile.
 *
 * @return {string} the format suffix for this tile.
 */
lanyard.Level.prototype.getFormatSuffix = function() {
  return this.formatSuffix;
};


/**
 * Get the service name.
 *
 * @return {String} the service name.
 */
lanyard.Level.prototype.getService = function() {
  return this.service;
};


/**
 * Get the dataset for this tile.
 *
 * @return {string} the dataset for this tile.
 */
lanyard.Level.prototype.getDataset = function() {
  return this.dataset;
};


/**
 * Get the textel size of this tile.
 *
 * @param {number} radius the radius to use.
 * @return {number} the textel size for this tile.
 */
lanyard.Level.prototype.getTexelSize = function(radius) {
  return radius * this.averageTexelSize;
};


/**
 * Determine if this tile is empty.
 *
 * @return {boolean} true if the tile is empty, false otherwise.
 */
lanyard.Level.prototype.isEmpty = function() {
  return !this.levelName;
};


/**
 * Mark this tile resource as absent.
 *
 * @param {number} the tile's resource id.
 */
lanyard.Level.prototype.markResourceAbsent = function(tileNumber) {
  this.absentTiles.markResourceAbsent(tileNumber);
};


/**
 * Check to see if this tile resource is absent.
 *
 * @param {number} the tile's resource id.
 * @return {boolean} true if this tile is absent, false otherwise.
 */
lanyard.Level.prototype.isResourceAbsent = function(tileNumber) {
  return this.absentTiles.isResourceAbsent(tileNumber);
};


/**
 * Unmark this tile resource as absent.
 *
 * @param {number} the tile's resource id.
 */
lanyard.Level.prototype.unmarkResourceAbsent = function(tileNumber) {
  this.absentTiles.unmarkResourceAbsent(tileNumber);
};


/**
 * Returns the URL necessary to retrieve the specified tile.
 *
 * @param {lanyard.Tile} tile the tile who's resources will be retrieved.
 * @return {string} the url of the tile's resource.
 */
lanyard.Level.prototype.getTileResourceURL = function(tile) {
  if (!tile) {
    this._logger.severe('Attempted to get a resource URL for an invalid tile.');
  }

  if (!this.urlBuilder) {
    this._logger.severe('Attempted to create a resource URL without a valid URL builder.');
  }

  return this.urlBuilder(tile);
};


/**
 * Compare this level to another.
 *
 * @param {lanyard.Level} that the level to compare to.
 * @return {number} 0 if equal, 1 if greater than, -1 if less than.
 */
lanyard.Level.prototype.compareTo = function(that) {
  if (!that) {
    this._logger.severe('Attempted to compare a tile to an invalid object.');
  }

  return this.levelNumber < that.levelNumber ? -1 : this.levelNumber === that.levelNumber ? 0 : 1;
};


/**
 * Get a string representation of this tile.
 *
 * @return {string} a string representation of this tile.
 */
lanyard.Level.prototype.toString = function() {
  return this.path;
};

/* EOF */
