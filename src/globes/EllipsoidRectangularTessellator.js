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

goog.provide('lanyard.globes.EllipsoidRectangularTessellator');

goog.require('lanyard.SectorGeometryList');
goog.require('lanyard.Tessellator');
goog.require('lanyard.View');
goog.require('lanyard.geom.Sector');
goog.require('lanyard.globes.RectTile');

/**
 * A rectangular tessellator for ellipsoids.
 *
 * @constructor
 * @implements {lanyard.Tessellator}
 * @this {lanyard.globes.EllipsoidRectangularTessellator}
 * @param {lanyard.Globe} globe the globe to tessellate.
 */
lanyard.globes.EllipsoidRectangularTessellator = function(globe) {
    /**
     * @private
     */
    this._logger = goog.debug.Logger.getLogger('lanyard.globes.EllipsoidRectangularTessellator');

    /**
     * @private
     * @type {Array.<lanyard.globes.RectTile>}
     */
    this.topLevels =
        lanyard.globes.EllipsoidRectangularTessellator.prototype.createTopLevelTiles(globe, 5, 10);

    /**
     * @private
     * @type {number}
     */
    this.maxLevel = 12;

    /**
     * @private
     * @type {lanyard.SectorGeometryList}
     */
    this.currentTiles = new lanyard.SectorGeometryList();

    /**
     * @private
     * @type {lanyard.geom.Frustum}
     */
    this.currentFrustum = null;

    /**
     * @private
     * @type {number}
     */
    this.currentLevel = 0;

    /**
     * Union of all tiles selected during call to render().
     *
     * @private
     * @type {lanyard.geom.Sector}
     */
    this.sector = null;

    /**
     * @private
     * @type {number}
     */
    this.density = 24;
};

/**
 * @const
 * @type {number}
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_DENSITY = 24;

/**
 * @const
 * @type {number}
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_LOG10_RESOLUTION_TARGET = 1.3;

/**
 * @const
 * @type {number}
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_MAX_LEVEL = 12;

/**
 * @const
 * @type {number}
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_NUM_LAT_SUBDIVISIONS = 5;

/**
 * @const
 * @type {number}
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_NUM_LON_SUBDIVISIONS = 10;

/**
 * Get the sector associated with this tessellator.
 *
 * @return {lanyard.geom.Sector} the sector.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.getSector = function() {
    return this.sector;
};

/**
 * Create the top level tiles.
 *
 * @param {lanyard.Globe} globe the globe.
 * @param {number} nRows the number of rows.
 * @param {number} nCols the number of columns.
 * @return {Array.<lanyard.globes.RectTile>} the top level tiles.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.createTopLevelTiles =
        function(globe, nRows, nCols) {

    /** @type {Array.<lanyard.globes.RectTile>} */
    var tops = [];

    /** @type {number} */
    var deltaLat = 180 / nRows;

    /** @type {number} */
    var deltaLon = 360 / nCols;

    /** @type {lanyard.geom.Angle} */
    var lastLat = lanyard.geom.Angle.prototype.NEG90;

    for (var r = 0; r < nRows; r = r + 1) {
        /** @type {lanyard.geom.Angle} */
        var lat = lastLat.addDegrees(deltaLat);

        if (lat.getDegrees() + 1 > 90) {
            lat = lanyard.geom.Angle.prototype.POS90;
        }

        /** @type {lanyard.geom.Angle} */
        var lastLon = lanyard.geom.Angle.prototype.NEG180;

        for (var c = 0; c < nCols; c = c + 1) {
            /** @type {lanyard.geom.Angle} */
            var lon = lastLon.addDegrees(deltaLon);

            if (lon.getDegrees() + 1 > 180) {
                lon = lanyard.geom.Angle.prototype.POS180;
            }

            /** @type {lanyard.globes.RectTile} */
            var newTile = new lanyard.globes.RectTile(
                globe, 0,
                lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_DENSITY,
                new lanyard.geom.Sector(lastLat, lat, lastLon, lon)
            );

            tops.push(newTile);
            lastLon = lon;
        }
        lastLat = lat;
    }

    return tops;
};

/**
 * Tessellate based on the draw context provided.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {lanyard.SectorGeometryList} the sector geometries.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.tessellate = function(dc) {
    //this._logger.fine("Tessellating the draw context geometries.");

    if (!dc) {
        this._logger.severe('Attempted to tessellate without a valid draw context.');
    }

    this.currentTiles.clear();
    this.currentLevel = 0;
    this.sector = null;
    this.currentFrustum = dc.getView().getFrustumInModelCoordinates();

    //this._logger.fine("Current frustum is: " + this.currentFrustum);

    //this._logger.fine("Number of top level tiles: " + this.topLevels.length);

    for (var i = 0; i < this.topLevels.length; i = i + 1) {
        this.selectVisibleTiles(dc, this.topLevels[i]);
    }

    dc.setVisibleSector(this.getSector());

    //this._logger.fine("Number of current tiles: " + this.currentTiles.length());

    for (var j = 0; j < this.currentTiles.length(); j = j + 1) {
        /** @type {lanyard.SectorGeometry} */
        var t = this.currentTiles.at(j);

        //this._logger.fine("Creating vertices for tile: " + t);

        t.makeVerts(dc);
    }

    return this.currentTiles;
};

/**
 * Select the visible tiles.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.globes.RectTile} tile the tile.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.selectVisibleTiles = function(dc, tile) {

    /** @type {boolean} */
    var doesIntersectFrustum = tile.getExtent().intersectsFrustum(this.currentFrustum);

    if (!doesIntersectFrustum) {
        return;
    } else {
        //this._logger.fine("Tile does intersect the frustum.");
    }

    if (this.currentLevel < this.maxLevel && this.needToSplit(dc, tile)) {
        ++this.currentLevel;

        var subtiles = tile.split(dc, tile);

        for (var i = 1; i < subtiles.length; i = i + 1) {
            this.selectVisibleTiles(dc, subtiles[i]);
        }

        --this.currentLevel;

        return;
    }

    this.sector = tile.getSector().unionWithSector(this.sector);
    this.currentTiles.add(tile);
};

/**
 * Determine if splitting should occur.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.globes.RectTile} tile the tile.
 * @return {boolean} if we should split or not.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.needToSplit = function(dc, tile) {

    if (!tile || !(tile.getSector())) {
        this._logger.error('Attempted to perform a split check on an invalid tile.');
    } else {
    //    this._logger.fine("Split check with sector: " + tile.getSector().toString());
    }

    /** @type {Array.<lanyard.geom.Point>} */
    var corners = tile.getSector().computeCornerPoints(dc.getGlobe());

    // this._logger.fine("Corner points of the sector are: " +
    //    corners[0] + "; " + corners[1] + "; " +
    //    corners[2] + "; " + corners[3] + "; ");

    /** @type {lanyard.geom.Point} */
    var centerPoint = tile.getSector().computeCenterPoint(dc.getGlobe());

    /** @type {lanyard.View} */
    var view = dc.getView();

    //this._logger.fine("Using an eyepoint of: " + view.getEyePoint().toString());

    /** @type {number} */
    var d1 = view.getEyePoint().distanceTo(corners[0]);

    /** @type {number} */
    var d2 = view.getEyePoint().distanceTo(corners[1]);

    /** @type {number} */
    var d3 = view.getEyePoint().distanceTo(corners[2]);

    /** @type {number} */
    var d4 = view.getEyePoint().distanceTo(corners[3]);

    /** @type {number} */
    var d5 = view.getEyePoint().distanceTo(centerPoint);

    //this._logger.fine("d1/min = " + d1 + "; d2 = " + d2 + "; d3 = " + d3 +
    //  "; d4 = " + d4 + "; d5 = " + d5);

    /** @type {number} */
    var minDistance = d1;

    if (d2 < minDistance) {
        minDistance = d2;
    }

    if (d3 < minDistance) {
        minDistance = d3;
    }

    if (d4 < minDistance) {
        minDistance = d4;
    }

    if (d5 < minDistance) {
        minDistance = d5;
    }

    /** @type {number} */
    var logDist = Math.log(minDistance) / Math.log(10); // base e to base 10

    /** @type {boolean} */
    var useTile =
        tile.getLog10CellSize() <= (
            logDist -
            lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_LOG10_RESOLUTION_TARGET
        );

    //this._logger.fine("need to split = " + !useTile);

    return !useTile;
};

/**
 * Create a string psuedo-representation of this tessellator.
 *
 * @return {string} this tessellator as a string.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.toString = function() {
    /** @type {number} */
    var density = 5;

    /** @type {Array.<number>} */
    var tcs = lanyard.globes.RectTile.prototype.getParameterization(density);

    /** @type {Array.<number>} */
    var indices = lanyard.globes.RectTile.prototype.getIndices(density);

    /** @type {string} */
    var ret = '';

    /** @type {number} */
    var i;
    for (i = 0; i < indices.length; i = i + 1) {
        /** @type {number} */
        var index = indices[i];

        ret += index + ': ' + tcs[2 * index] + ', ' + tcs[2 * index + 1];
    }

    return ret;
};

/* EOF */
