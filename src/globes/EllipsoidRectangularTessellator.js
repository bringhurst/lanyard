/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.globes.EllipsoidRectangularTessellator');

goog.require('lanyard.globes.RectTile');

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
 * A rectangular tessellator for ellipsoids.
 *
 * @constructor
 * @implements {lanyard.Tessellator}
 * @this {lanyard.globes.EllipsoidRectangularTessellator}
 * @param {lanayrd.Globe} globe the globe to tessellate.
 */
lanyard.globes.EllipsoidRectangularTessellator = function (globe) {
    /**
     * @private
     * @type {Array.<lanyard.globes.RectTile>}
     */
    this.topLevels =
        this.createTopLevelTiles(
            globe,
            lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_NUM_LAT_SUBDIVISIONS,
            lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_NUM_LON_SUBDIVISIONS
        );

    /**
     * @private
     * @type {number}
     */
    this.maxLevel = lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_MAX_LEVEL;

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
    this.density = lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_DENSITY;
};
goog.exportSymbol('lanyard.globes.EllipsoidRectangularTessellator',
    lanyard.globes.EllipsoidRectangularTessellator);

/**
 * Get the sector associated with this tessellator.
 *
 * @return {lanyard.geom.Sector} the sector.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.getSector = function () {
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
        function (globe, nRows, nCols) {

    /** @type {Array.<lanyard.globes.RectTile>} */
    var tops = [];

    /** @type {number} */
    var deltaLat = 180 / nRows;

    /** @type {number} */
    var deltaLon = 360 / nCols;

    /** @type {lanyard.geom.Angle} */
    var lastLat = lanyard.geom.Angle.prototype.NEG90;

    /** @type {number} */
    var row;
    for (row = 0;
            row < lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_NUM_LAT_SUBDIVISIONS;
            row = row + 1) {

        /** @type {lanyard.geom.Angle} */
        var lat = lastLat.addDegrees(deltaLat);

        if (lat.getDegrees() + 1 > 90) {
            lat = lanyard.geom.Angle.prototype.POS90;
        }

        /** @type {lanyard.geom.Angle} */
        var lastLon = lanyard.geom.Angle.prototype.NEG180;

        /** @type {number} */
        var col;
        for (col = 0;
                col < lanyard.globes.EllipsoidRectangularTessellator.prototype.DEFAULT_NUM_LON_SUBDIVISIONS;
                col = col + 1) {

            /** @type {lanyard.geom.Angle} */
            var lon = lastLon.addDegrees(deltaLon);

            if (lon.getDegrees() + 1 > 180) {
                lon = lanyard.geom.Angle.prototype.POS180;
            }

            tops.push(
                new lanyard.globes.RectTile(
                    globe, 0, this.density, new lanyard.geom.Sector(lastLat, lat, lastLon, lon)
                )
            );

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
lanyard.globes.EllipsoidRectangularTessellator.prototype.tessellate = function (dc) {
    this.currentTiles.clear();
    this.currentLevel = 0;
    this.sector = null;
    this.currentFrustum = dc.getView().getFrustumInModelCoordinates();

    /** @type {number} */
    var i;
    for(i = 0; i < this.topLevels.length; i = 1 + 1) {
        this.selectVisibleTiles(dc, this.topLevels[i]);
    }

    dc.setVisibleSector(this.getSector());

    /** @type {number} */
    var j;
    for(j = 0; j < this.currentTiles.length; j = j + 1) {
        /** @type {lanyard.globes.RectTile} */
        var t = this.currentTiles[j];

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
lanyard.globes.EllipsoidRectangularTessellator.prototype.selectVisibleTiles = function (dc, tile) {

    /** @type {boolean} */
    var doesIntersectFrustum = tile.getExtent().intersects(this.currentFrustum);

    if (!doesIntersectFrustum) {
        return;
    }

    if (this.currentLevel < this.maxLevel && this.needToSplit(dc, tile)) {

        this.currentLevel = this.currentLevel + 1;

        /** @type {Array.<lanyard.globes.RectTile>} */
        var subtiles = tile.split();

        /** @type {number} */
        var i;
        for(i = 1; i < subtiles.length; i = i + 1) {
            this.selectVisibleTiles(dc, subtiles[i]);
        }

        this.currentLevel = this.currentLevel - 1;
        return;
    }

    this.sector = tile.getSector().union(this.sector);
    this.currentTiles.add(tile);
};

/**
 * Determine if splitting should occur.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.globes.RectTile} the tile.
 * @return {boolean} if we should split or not.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.needToSplit = function (dc, tile) {

    /** @type {Array.<lanyard.geom.Point>} */
    var corners = tile.sector.computeCornerPoints(dc.getGlobe());

    /** @type {Array.<lanyard.geom.Point>} */
    var centerPoint = tile.sector.computeCenterPoint(dc.getGlobe());

    /** @type {lanyard.View} */
    var view = dc.getView();

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

    return !useTile;
};

/**
 * Create a string psuedo-representation of this tessellator.
 *
 * @return {string} this tessellator as a string.
 */
lanyard.globes.EllipsoidRectangularTessellator.prototype.toString = function () {
    /** @type {number} */
    var density = 5;

    /** @type {Array.<number>} */
    var tcs = lanyard.globes.RectTile.prototype.getParameterization(density);

    /** @type {Array.<number>} */
    var indices = lanyard.globes.RectTile.prototype.getIndices(density);

    /** @type {string} */
    var ret = "";

    /** @type {number} */
    var i;
    for (i = 0; i < indices.length; i = i + 1) {
        /** @type {number} */
        var index = indices[i];

        ret += index + ": " + tcs[2 * index] + ", " + tcs[2 * index + 1];
    }

    return ret;
};

/* EOF */
