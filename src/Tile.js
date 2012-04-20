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

goog.provide('lanyard.Tile');



/**
 * A way to hold tiles.
 *
 * @constructor
 * @param {lanyard.geom.Sector} sector the tile's sector.
 * @param {lanyard.Level} level the level of the tile.
 * @param {number} row the row of the tile.
 * @param {number} column the column of the tile.
 */
lanyard.Tile = function(sector, level, row, column) {
  /**
     * @private
     */
  this._logger = goog.debug.Logger.getLogger('lanyard.Tile');

  if (!sector) {
    this._logger.severe('Attempted to create a tile with an invalid sector.');
  }

  /** @type {lanyard.geom.Sector} */
  this.sector = sector;

  /** @type {number} */
  this.row = 0;

  if (!row) {
    if (level) {
      this.row = lanyard.Tile.prototype.computeRow(
          sector.getDeltaLat(), sector.getMinLatitude()
          );
    }
  }

  /** @type {number} */
  this.column = 0;

  if (!column) {
    if (level) {
      this.column = lanyard.Tile.prototype.computeColumn(
          sector.getDeltaLon(), sector.getMinLongitude()
          );
    }
  }

  if (row < 0) {
    this._logger.severe('Attempted to create a tile with an invalid row value.');
  }

  if (column < 0) {
    this._logger.severe('Attempted to create a tile with an invalid column value.');
  }

  this.level = level;
  this.tileKey = new lanyard.TileKey(this);
  this.path = null;
};


/**
 * Get the path of this tile.
 *
 * @return {string} the path of this tile.
 */
lanyard.Tile.prototype.getPath = function() {
  if (!this.path) {
    this.path = this.level.getPath() + '/' + this.row + '/' + this.row + '_' + this.column;

    if (!this.level.isEmpty()) {
      this.path += this.level.getFormatSuffix();
    }
  }

  return this.path;
};


/**
 * Get the sector for this tile.
 *
 * @return {lanyard.geom.Sector} the sector for this tile.
 */
lanyard.Tile.prototype.getSector = function() {
  return this.sector;
};


/**
 * Get the level for this tile.
 *
 * @return {lanyard.Level} the level for this tile.
 */
lanyard.Tile.prototype.getLevel = function() {
  return this.level;
};


/**
 * Get the level number of this tile.
 *
 * @return {number} the level number of this tile.
 */
lanyard.Tile.prototype.getLevelNumber = function() {
  return this.level ? this.level.getLevelNumber() : 0;
};


/**
 * Get the name of this level if available.
 *
 * @return {String} the name of this level.
 */
lanyard.Tile.prototype.getLevelName = function() {
  return this.level ? this.level.getLevelName() : '';
};


/**
 * Get the row number of this tile.
 *
 * @return {number} the row number of this tile.
 */
lanyard.Tile.prototype.getRow = function() {
  return this.row;
};


/**
 * Get the column number of this tile.
 *
 * @return {number} the column number of this tile.
 */
lanyard.Tile.prototype.getColumn = function() {
  return this.column;
};


/**
 * Get the format suffix of this tile's data.
 *
 * @return {string} the format suffix of this tile's data.
 */
lanyard.Tile.prototype.getFormatSuffix = function() {
  return this.level ? this.level.getFormatSuffix() : null;
};


/**
 * Get the tile key object for this tile.
 *
 * @return {lanyard.TileKey} the tile key for this object.
 */
lanyard.Tile.prototype.getTileKey = function() {
  return this.tileKey;
};


/**
 * Get the resource URL for this tile.
 *
 * @return {string} the url for this tile.
 */
lanyard.Tile.prototype.getResourceURL = function() {
  return this.level ? this.level.getTileResourceURL(this) : null;
};


/**
 * Get the label of this tile.
 *
 * @return {string} the label for this tile.
 */
lanyard.Tile.prototype.getLabel = function() {
  /** @type {string} */
  var label = parseInt(this.getLevelNumber(), 10);

  label.concat('(');
  label.concat(this.getLevelName());
  label.concat(')');
  label.concat(', ');
  label.concat(this.getRow());
  label.concat(', ');
  label.concat(this.getColumn());

  return label;
};


/**
 * Compare this tile to another.
 *
 * @param {lanyard.Tile} tile the tile to compare to.
 * @return {number} 0 if equal, -1 if less than, 1 if greater than.
 */
lanyard.Tile.prototype.compareTo = function(tile) {
  if (!tile) {
    this._logger.severe('Attempted to compare a tile to an invalid object.');
  }

  // No need to compare Sectors or path because they are redundant with row and column
  if (tile.getLevelNumber() === this.getLevelNumber() &&
      tile.row === this.row && tile.column === this.column) {
    return 0;
  }

  // Lower-res levels compare lower than higher-res
  if (this.getLevelNumber() < tile.getLevelNumber()) {
    return -1;
  }

  if (this.getLevelNumber() > tile.getLevelNumber()) {
    return 1;
  }

  if (this.row < tile.row) {
    return -1;
  }

  if (this.row > tile.row) {
    return 1;
  }

  if (this.column < tile.column) {
    return -1;
  }

  return 1; // tile.column must be > this.column because equality was tested above
};


/**
 * Computes the row index of a latitude in the global tile grid corresponding to a specified grid interval.
 *
 * @param {lanyard.geom.Angle} delta the grid interval.
 * @param {lanyard.geom.Angle} latitude the latitude for which to compute the row index.
 * @return {number} the row index of the row containing the specified latitude.
 */
lanyard.Tile.prototype.computeRow = function(delta, latitude) {
  if (!delta || !latitude) {
    this._logger.severe('Attempted to compute a row number with invalid values.');
  }

  if (delta.getDegrees() <= 0.0) {
    this._logger.severe('Attempted to compute a row number with an out of range delta value.');
  }

  if (latitude.getDegrees() < -90.0 || latitude.getDegrees() > 90.0) {
    this._logger.severe('Attempted to compute a row number with an out of range latitude value.');
  }

  if (latitude.getDegrees() === 90.0) {
    return (180.0 / delta.getDegrees()) - 1;
  } else {
    return ((latitude.getDegrees() + 90.0) / delta.getDegrees());
  }
};


/**
 * Computes the column index of a longitude in the global tile grid corresponding to a specified grid interval.
 *
 * @param {lanyard.geom.Angle} delta the grid interval.
 * @param {lanyard.geom.Angle} longitude the longitude for which to compute the column index.
 * @return {number} the column index of the column containing the specified latitude.
 */
lanyard.Tile.prototype.computeColumn = function(delta, longitude) {
  if (!delta || !longitude) {
    this._logger.severe('Attempted to compute a column value with invalid data.');
  }

  if (delta.getDegrees() <= 0.0) {
    this._logger.severe('Attempted to compute the column with an out of range delta.');
  }

  if (longitude.getDegrees() < -180.0 || longitude.getDegrees() > 180.0) {
    this._logger.severe('Attempted to compute the column number with an invalid longitude.');
  }

  if (longitude.getDegrees() === 180.0) {
    return (360.0 / delta.getDegrees()) - 1;
  } else {
    return ((longitude.getDegrees() + 180.0) / delta.getDegrees());
  }
};


/**
 * Determines the minimum latitude of a row in the global tile grid corresponding to a specified grid interval.
 *
 * @param {number} row the row index of the row in question.
 * @param {lanyard.geom.Angle} delta the grid interval.
 * @return {lanyard.geom.Angle} the minimum latitude of the tile corresponding to the specified row.
 */
lanyard.Tile.prototype.computeRowLatitude = function(row, delta) {
  if (!row || !delta || row < 0) {
    this._logger.severe('Attempted to compute the row latitude with invalid data.');
  }

  if (delta.getDegrees() <= 0.0) {
    this._logger.severe('Attempted to compute the row latitude with na invalid delta.');
  }

  return lanyard.geom.Angle.prototype.fromDegrees(90.0 + delta.getDegrees() * row);
};


/**
 * Determines the minimum longitude of a column in the global tile grid cooresponding to
 * a specified grid interval.
 *
 * @param {number} column the row index of the row in question.
 * @param {lanyard.geom.Angle} delta the grid interval.
 * @return {lanyard.geom.Angle} the minimum longitude of the tile corresponding to the specified column.
 */
lanyard.Tile.prototype.computeColumnLongitude = function(column, delta) {
  if (!delta || !column) {
    this._logger.severe('Attempted to compute the column longitude with invalid data.');
  }

  if (column < 0) {
    this._logger.severe('Attempted to compute the column longitude with an invalid column value.');
  }

  if (delta.getDegrees() <= 0.0) {
    this._logger.severe('Attempted to compute the column longitude with an invalid delta.');
  }

  return lanyard.Angle.prototype.fromDegrees(-180.0 + delta.getDegrees() * column);
};


/**
 * Get the priority of this tile.
 *
 * @return {number} the priority of this tile.
 */
lanyard.Tile.prototype.getPriority = function() {
  return this.priority;
};


/**
 * Set the priority of this tile.
 *
 * @param {number} priority the priority of this tile.
 */
lanyard.Tile.prototype.setPriority = function(priority) {
  this.priority = priority;
};


/**
 * Create a string representation of this tile.
 *
 * @return {string} a string representation of this tile.
 */
lanyard.Tile.prototype.toString = function() {
  return this.getPath();
};

/* EOF */
