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

goog.provide('lanyard.layers.tiled.LevelComparer');


/**
 * Compare two texture tiles.
 *
 * @param {lanyard.layers.tiled.TextureTile} ta a texture tile.
 * @param {lanyard.layers.tiled.TextureTile} tb a texture tile to compare to.
 * @return {number} 0 if equal, 1 if greater, -1 if less than.
 */
lanyard.layers.tiled.LevelComparer.prototype.compare = function(ta, tb) {
  /** @type {number} */
  var la;

  /** @type {number} */
  var lb;

  if (ta.holdsTexture()) {
    la = ta.getLevelNumber();
  } else {
    la = ta.getFallbackTile().getLevelNumber();
  }

  if (tb.holdsTexture()) {
    lb = tb.getLevelNumber();
  } else {
    lb = tb.getFallbackTile().getLevelNumber();
  }

  return la < lb ? -1 : la === lb ? 0 : 1;
};

/* EOF */
