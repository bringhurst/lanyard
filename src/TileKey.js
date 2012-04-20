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

goog.provide('lanyard.TileKey');



/**
 * A unique identifier for tiles.
 *
 * @constructor
 * @param {number} level the level of this tile.
 * @param {number} row the row fo this tile.
 * @param {string} cacheName the cache name.
 * @implements {lanyard.TileKey}
 */
lanyard.TileKey = function(level, row, col, cacheName) {
  /**
     * @private
     */
  this._logger = goog.debug.Logger.getLogger('lanyard.TileKey');

  if (level < 0) {
    this._logger.severe('Tile key level is less than 0.');
  }

  if (row < 0) {
    this._logger.severe('The row index is out of range.');
  }

  if (col < 0) {
    this._logger.severe('The column index is out of range.');
  }

  if (!cacheName || cacheName.length < 1) {
    this._logger.severe('Attempted to use an invalid cache name.');
  }

  /** @type {number} */
  this.level = level;

  /** @type {number} */
  this.row = row;

  /** @type {number} */
  this.col = col;

  /** @type {string} */
  this.cacheName = cacheName;
};


/**
 * Create a tile key from angles.
 *
 * @param {lanyard.geom.Angle} latitude the angle of latutide.
 * @param {lanyard.geom.Angle} longitude the angle of longitude.
 * @param {lanyard.Level} level the level of the tile.
 * @return {lanyard.TileKey} the generated tile key.
 */
lanyard.TileKey.prototype.fromAngles = function(latitude, longitude, level) {
  /** @type {lanyard.TileKey} */
  var tk = new lanyard.TileKey(
      level.getLevelNumber(),
      lanyard.Tile.prototype.computeRow(level.getTileDelta().getLatitude(), latitude),
      lanyard.Tile.prototype.computeColumn(level.getTileDelta().getLongitude(), longitude),
      level.getCacheName()
      );

  return tk;
};


/**
 * Create a tile key from a tile.
 *
 * @param {lanyard.Tile} tile the tile to create a tile key from.
 * @return {lanyard.TileKey} the generated tile key.
 */
lanyard.TileKey.prototype.fromTile = function(tile) {
  /** @type {lanyard.TileKey} */
  var tk = new lanyard.TileKey(
      tile.getLevelNumber(),
      tile.getRow(),
      tile.getColumn(),
      tile.getCacheName()
      );

  return tk;
};


/**
 * Get the level number of this tile key.
 *
 * @return {number} the level number of this tile key.
 */
lanyard.TileKey.prototype.getLevelNumber = function() {
  return this.level;
};


/**
 * Get the row of this tile key.
 *
 * @return {number} get the row of this tile key.
 */
lanyard.TileKey.prototype.getRow = function() {
  return this.row;
};


/**
 * Get the column of this tile key.
 *
 * @return {number} the column of this tile key.
 */
lanyard.TileKey.prototype.getColumn = function() {
  return this.col;
};


/**
 * Get the cache name.
 *
 * @return {string} the cache name.
 */
lanyard.TileKey.prototype.getCacheName = function() {
  return this.cacheName;
};


/**
 * Compare this tile key to another.
 *
 * @param {lanyard.TileKey} key the tile key to compare to.
 * @return {number} 0 if equal, -1 if less, 1 if more.
 */
lanyard.TileKey.prototype.compareTo = function(key) {
  if (!key) {
    this._logger.severe('Attempted to compare to an invalid tile key.');
  }

  // No need to compare Sectors because they are redundant with row and column
  if (key.level === this.level && key.row === this.row && key.col === this.col) {
    return 0;
  }

  // Lower-res levels compare lower than higher-res
  if (this.level < key.level) {
    return -1;
  }

  if (this.level > key.level) {
    return 1;
  }

  if (this.row < key.row) {
    return -1;
  }

  if (this.row > key.row) {
    return 1;
  }

  if (this.col < key.col) {
    return -1;
  }

  // tile.col must be > this.col because equality was tested above
  return 1;
};


/**
 * Get a string representation of this tile key.
 *
 * @return {string} a string representation of this tile key.
 */
lanyard.TileKey.prototype.toString = function() {
  return this.cacheName + '/' + this.level + '/' + this.row + '/' + this.col;
};

/* EOF */
