/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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

goog.provide('lanyard.LevelSet');

goog.require('lanyard.Level');



/**
 * A representation of a level set. Created from params or another level set (copied).
 *
 * @constructor
 * @param {Array.<*>} params the array of params for this level set.
 * @param {lanyard.LevelSet} source another level set to copy.
 */
lanyard.LevelSet = function(params, source) {
  /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.LevelSet');

  if (!(params ? !source : source)) {
    this._logger.severe('A level set may be created or copied, but not both at the same time.');
  }

  /** @type {lanyard.geom.Sector?} */
  this.sector = null;

  /** @type {lanyard.geom.LatLon?} */
  this.levelZeroTileDelta = null;

  /** @type {number?} */
  this.numLevelZeroColumns = null;

  /** @type {Array.<lanyard.Level>} */
  this.levels = [];

  if (params) {
    this.levelZeroTileDelta = params.levelZeroTileDelta;
    this.sector = params.sector;

    for (var i = 0; i < params.numLevels; i = i + 1) {
      params.levelName = i < params.numEmptyLevels ? '' : parseInt(i - params.numEmptyLevels, 10);
      params.levelNumber = i;

      /** @type {lanyard.geom.Angle} */
      var latDelta = this.levelZeroTileDelta.getLatitude().divide(Math.pow(2, i));

      /** @type {lanyard.geom.Angle} */
      var lonDelta = this.levelZeroTileDelta.getLongitude().divide(Math.pow(2, i));

      params.tileDelta = new lanyard.geom.LatLon(latDelta, lonDelta);

      this.levels.push(new lanyard.Level(params));
    }

    this.numLevelZeroColumns =
        Math.round(this.sector.getDeltaLon().divide(this.levelZeroTileDelta.getLongitude()));

  } else if (source) {
    // Do a copy instead of creating from params.

    this.levelZeroTileDelta = source.levelZeroTileDelta;
    this.sector = source.sector;
    this.numLevelZeroColumns = source.numLevelZeroColumns;

    for (var j = 0; j < source.levels.length; j = j + 1) {
      // Levels are final, so it's safe to copy references.
      this.levels.push(source.levels[j]);
    }

  } else {
    this._logger.severe('Invalid params were specified for a new level set.');
  }
};


/**
 * Get the sector for this level set.
 *
 * @return {lanyard.geom.Sector} the sector for this level set.
 */
lanyard.LevelSet.prototype.getSector = function() {
  return this.sector;
};


/**
 * Get the level zero tile delta.
 *
 * @return {lanyard.geom.LatLon} the level zero tile delta.
 */
lanyard.LevelSet.prototype.getLevelZeroTileDelta = function() {
  return this.levelZeroTileDelta;
};


/**
 * Get the current levels.
 *
 * @return {Array.<lanyard.Level>} the current levels.
 */
lanyard.LevelSet.prototype.getLevels = function() {
  return this.levels;
};


/**
 * Get the level at the specified level number.
 *
 * @param {number} levelNumber the specified level number.
 * @return {lanyard.Level} the level at the specified level number.
 */
lanyard.LevelSet.prototype.getLevel = function(levelNumber) {
  return (levelNumber >= 0 && levelNumber < this.levels.length) ? this.levels[levelNumber] : null;
};


/**
 * Get the number of levels in this level set.
 *
 * @return {number} the number of levels in this level set.
 */
lanyard.LevelSet.prototype.getNumLevels = function() {
  return this.levels.length;
};


/**
 * Get the first level in the level set.
 *
 * @return {lanyard.Level} the first level in the level set.
 */
lanyard.LevelSet.prototype.getFirstLevel = function() {
  return this.getLevel(0);
};


/**
 * Get the last level in this level set.
 *
 * @return {lanyard.Level} the last level in this level set.
 */
lanyard.LevelSet.prototype.getLastLevel = function() {
  return this.getLevel(this.getNumLevels() - 1);
};


/**
 * Check to see if the specified level number is the last level.
 *
 * @param {number} levelNum the specified level.
 * @return {boolean} true if it's the last level, false otherwise.
 */
lanyard.LevelSet.prototype.isFinalLevel = function(levelNum) {
  return (levelNum === this.getNumLevels() - 1);
};


/**
 * Check if the specified level is empty.
 *
 * @param {number} levelNumber the level number to check.
 * @return {boolean} true if the level is empty, false otherwise.
 */
lanyard.LevelSet.prototype.isLevelEmpty = function(levelNumber) {
  return this.levels[levelNumber].isEmpty();
};


/**
 * Determine the number of columns in the specified level.
 *
 * @param {lanyard.Level} level the level to check.
 * @return {number} the number of columns in the specified level.
 */
lanyard.LevelSet.prototype.numColumnsInLevel = function(level) {
  /** @type {number} */
  var levelDelta = level.getLevelNumber() - this.getFirstLevel().getLevelNumber();

  /** @type {number} */
  var twoToTheN = Math.pow(2, levelDelta);

  return (twoToTheN * this.numLevelZeroColumns);
};


/**
 * Get the number of the specified tile.
 *
 * @param {lanyard.Tile} the tile to check.
 * @return {number} the number of the specified tile.
 */
lanyard.LevelSet.prototype.getTileNumber = function(tile) {
  return tile.getRow() * this.numColumnsInLevel(tile.getLevel()) + tile.getColumn();
};


/**
 * Instructs the level set that a tile is likely to be absent.
 *
 * @param {lanyard.LevelSet} tile The tile to mark as having an absent resource.
 */
lanyard.LevelSet.prototype.markResourceAbsent = function(tile) {
  if (!tile) {
    this._logger.severe('Attempted to mark an invalid tile as problematic.');
  }

  tile.getLevel().markResourceAbsent(this.getTileNumber(tile));
};


/**
 * Indicates whether a tile has been marked as absent.
 *
 * @param {lanyard.Tile} tile the tile in question.
 * @return {boolean} true if the tile is marked absent, otherwise false.
 */
lanyard.LevelSet.prototype.isResourceAbsent = function(tile) {
  if (!tile) {
    this._logger.severe('Attempted to check absense on an invalid tile.');
  }

  if (tile.getLevel().isEmpty()) {
    return true;
  }

  /** @type {number} */
  var tileNumber = tile.getRow() * this.numColumnsInLevel(tile.getLevel()) + tile.getColumn();

  return tile.getLevel().isResourceAbsent(tileNumber);
};


/**
 * Removes the absent-tile mark associated with a tile, if one is associatied.
 *
 * @param {lanyard.Tile} tile the tile to unmark.
 */
lanyard.LevelSet.prototype.unmarkResourceAbsent = function(tile) {
  if (!tile) {
    this._logger.severe('Attempted to unmark absence of an invalid tile.');
  }

  tile.getLevel().unmarkResourceAbsent(this.getTileNumber(tile));
};

/* EOF */
