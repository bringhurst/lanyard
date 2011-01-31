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

goog.provide('lanyard.layers.tiled.TextureTile');

/**
 * Creates a texture tile.
 *
 * @constructor
 * @extends {lanyard.Tile}
 * @param {lanyard.geom.Sector} sector the sector to use for this tile.
 * @param {lanyard.Level} level the level to display this tile at.
 * @param {number} row the row for this tile.
 * @param {number} col the column for this tile.
 */
lanyard.layers.tiled.TextureTile = function(sector, level, row, col) {
    // FIXME: call super
    lanyard.Tile.call(this, sector, level, row, col);

    this._logger = goog.debug.Logger.getLogger('lanyard.layers.TextureTile');

    /** @type {Image?} */
    this.textureData = null;

    /** @type {lanyard.util.Texture?} */
    this.texture = null;

    /** @type {lanyard.layers.tiled.TextureTile?} */
    this.fallbackTile = null; // holds texture to use if own texture not available

    /** @type {lanyard.geom.Point?} */
    this.centroid = null; // Cartesian coordinate of lat/lon center

    /** @type {Array.<lanyard.geom.Point>?} */
    this.corners = null; // Cartesian coordinate of lat/lon corners

    /** @type {lanyard.geom.Extent?} */
    this.extent = null; // bounding volume

    /** @type {number} */
    this.extentVerticalExaggertion = Number.MIN_VALUE; // VE used to calculate the extent

    /** @type {number} */
    this.minDistanceToEye = Number.MAX_VALUE;
};

/**
 * Get the fallback tile if this tile isn't working out.
 *
 * @return {lanyard.layers.tiled.TextureTile} the fallback texture tile.
 */
lanyard.layers.tiled.TextureTile.prototype.getFallbackTile = function() {
    if (!this.fallbackTile) {
        return null;
    }

    return this.fallbackTile;
};

/**
 * Set the fallback tile.
 *
 * @param {lanyard.layers.tiled.TextureTile} fallbackTile the new fallback tile.
 */
lanyard.layers.tiled.TextureTile.prototype.setFallbackTile = function(fallbackTile) {
    this.fallbackTile = fallbackTile;
};

/**
 * Get the texture data for this texture tile.
 *
 * @return {Image} the texture data.
 */
lanyard.layers.tiled.TextureTile.prototype.getTextureData = function() {
    return this.textureData;
};

/**
 * Set the texture data for this texture tile.
 *
 * @param {Image} textureData the texture data for this texture tile.
 */
lanyard.layers.tiled.TextureTile.prototype.setTextureData = function(textureData) {
    this.textureData = textureData;
};

/**
 * Get the gl representation of the texture.
 *
 * @return {lanyard.util.Texture} the gl representation of the texture.
 */
lanyard.layers.tiled.TextureTile.prototype.getTexture = function() {
    return this.texture;
};

/**
 * Determine if this texture tile holds any texture data.
 *
 * @return {boolean} true if this texture tile holds data, false otherwise.
 */
lanyard.layers.tiled.TextureTile.prototype.holdsTexture = function() {
    if (this.getTexture() || this.getTextureData()) {
        return true;
    } else {
        return false;
    }
};

/**
 * Set the gl texture object for this texture tile.
 *
 * @param {lanyard.util.Texture} texture the gl texture representation.
 */
lanyard.layers.tiled.TextureTile.prototype.setTexture = function(texture) {

    if (!texture) {
        this._logger.severe(
            'Attempted to set an invalid texture object to a texture tile.');
    }

    this.texture = texture;
    this.textureData = null;
};

/**
 * Get the centroid point of this texture tile.
 *
 * @param {lanyard.Globe} globe the globe to use.
 * @return {lanyard.geom.Point} the centroid point.
 */
lanyard.layers.tiled.TextureTile.prototype.getCentroidPoint = function(globe) {
    if (!globe) {
        this._logger.severe('Attempted to find the centroid of a texture tile without a valid globe.');
    }

    if (!this.centroid) {
        /** @type {lanyard.geom.LatLon} */
        var c = this.getSector().getCentroid();
        this.centroid = globe.computePointFromPosition(c.getLatitude(), c.getLongitude(), 0);
    }

    return this.centroid;
};

/**
 * Get the corner points of this texture tile.
 *
 * @param {lanyard.Globe} globe the globe to use.
 * @return {Array.<lanyard.geom.Point>} the corner points of the texture tile.
 */
lanyard.layers.tiled.TextureTile.prototype.getCornerPoints = function(globe) {
    if (!globe) {
        this._logger.severe('Attempted to calculate corner points without a globe.');
    }

    if (!this.corners) {
        /** @type {lanyard.geom.Sector} */
        var s = this.getSector();

        /** @type {Array.<lanyard.geom.Point>} */
        this.corners = [];
        this.corners[0] = globe.computePointFromPosition(s.getMinLatitude(), s.getMinLongitude(), 0); // sw
        this.corners[1] = globe.computePointFromPosition(s.getMinLatitude(), s.getMaxLongitude(), 0); // se
        this.corners[2] = globe.computePointFromPosition(s.getMaxLatitude(), s.getMaxLongitude(), 0); // nw
        this.corners[3] = globe.computePointFromPosition(s.getMaxLatitude(), s.getMinLongitude(), 0); // ne
    }

    return this.corners;
};

/**
 * Get the minimum distance from this tile to the eye point.
 *
 * @return {number} the minimum distance to the eye point.
 */
lanyard.layers.tiled.TextureTile.prototype.getMinDistanceToEye = function() {
    return this.minDistanceToEye;
};

/**
 * Set the minimum distance to the eye point.
 *
 * @param {number} minDistanceToEye the minimum distance to the eye point.
 */
lanyard.layers.tiled.TextureTile.prototype.setMinDistanceToEye = function(minDistanceToEye) {
    if (minDistanceToEye < 0) {
        this._logger.severe('Attempted to set a negative distance from a tile to the eye point.');
    }
    this.minDistanceToEye = minDistanceToEye;
};

/**
 * Get the extent of this texture tile.
 *
 * @param {lanyard.DrawContext} dc the draw context used.
 * @return {lanyard.geom.Extent} the extent of this texture tile.
 */
lanyard.layers.tiled.TextureTile.prototype.getExtent = function(dc) {
    if (!dc) {
        this._logger.severe('Attempted to get the extent without a valid draw context.');
    }

    if (!this.extent || this.extentVerticalExaggertion !== dc.getVerticalExaggeration()) {
        this.extent = lanyard.geom.Sector.prototype.computeBoundingCylinder(
            dc.getGlobe(), dc.getVerticalExaggeration(), this.getSector()
        );
        this.extentVerticalExaggertion = dc.getVerticalExaggeration();
    }

    return this.extent;
};

/**
 * Create sub tiles for this texture tile.
 *
 * @param {lanyard.Level} nextLevel the level used for the subtiles.
 * @return {Array.<lanyard.layers.tiled.TextureTile>} the new subtiles.
 */
lanyard.layers.tiled.TextureTile.prototype.createSubTiles = function(nextLevel) {
    if (!nextLevel) {
        this._logger.severe('Attempted to create subtiles without a valid level.');
    }

    /** @type {lanyard.geom.Angle} */
    var p0 = this.getSector().getMinLatitude();

    /** @type {lanyard.geom.Angle} */
    var p2 = this.getSector().getMaxLatitude();

    /** @type {lanyard.geom.Angle} */
    var p1 = lanyard.geom.Angle.prototype.midAngle(p0, p2);

    /** @type {lanyard.geom.Angle} */
    var t0 = this.getSector().getMinLongitude();

    /** @type {lanyard.geom.Angle} */
    var t2 = this.getSector().getMaxLongitude();

    /** @type {lanyard.geom.Angle} */
    var t1 = lanyard.geom.Angle.prototype.midAngle(t0, t2);

    /** @type {number} */
    var nextLevelNum = nextLevel.getLevelNumber();

    /** @type {number} */
    var row = this.getRow();

    /** @type {number} */
    var col = this.getColumn();

    /** @type {Array.<lanyard.layers.tiled.TextureTile>} */
    var subTiles = [];

    // FIXME: subtile geom needs caching

    subTiles[0] = new lanyard.layers.tiled.TextureTile(
        new lanyard.geom.Sector(p0, p1, t0, t1), nextLevel, 2 * row, 2 * col
    );
    subTiles[1] = new lanyard.layers.tiled.TextureTile(
        new lanyard.geom.Sector(p0, p1, t1, t2), nextLevel, 2 * row, 2 * col + 1
    );
    subTiles[2] = new lanyard.layers.tiled.TextureTile(
        new lanyard.geom.Sector(p1, p2, t0, t1), nextLevel, 2 * row + 1, 2 * col
    );
    subTiles[3] = new lanyard.layers.tiled.TextureTile(
        new lanyard.geom.Sector(p1, p2, t1, t2), nextLevel, 2 * row + 1, 2 * col + 1
    );

    return subTiles;
};

/**
 * Initialize this texture tile.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.layers.tiled.TextureTile.prototype.initializeTexture = function(dc) {
    if (!this.getTexture()) {
        /** @type {WebGLDrawContext} */
        var gl = dc.getGL();

        this.setTexture(this.getTextureData());

        /** @type {lanyard.util.Texture} */
        var tex = this.getTexture();

        tex.bind();

        tex.setTexParameteri(gl.TEXTURE_MIN_FILTER, gl.LINEAR); //_MIPMAP_LINEAR);
        tex.setTexParameteri(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        tex.setTexParameteri(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        tex.setTexParameteri(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
};

/**
 * Bind this texture tile's data to the gl context.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {boolean} true if successful, false otherwise.
 */
lanyard.layers.tiled.TextureTile.prototype.bindTexture = function(dc) {
    if (this.holdsTexture()) { // use the tile's texture
        if (!this.getTexture()) {
            this.initializeTexture(dc);
        }

        if (!this.getTexture()) {
            return false; // bad texture or something, skip it
        }

        this.getTexture().bind();

    } else if (this.getFallbackTile()) { // use texture of resource tile

        /** @type {lanyard.layers.tiled.TextureTile} */
        var resourceTile = this.getFallbackTile();

        if (!resourceTile.getTexture()) {
            resourceTile.initializeTexture(dc);
        }

        if (!resourceTile.getTexture()) {
            return false; // bad texture or something, skip it
        }

        resourceTile.getTexture().bind();
    }

    return true;
};

/**
 * Apply the transform on this texture tile.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.layers.tiled.TextureTile.prototype.applyTextureTransform = function(dc) {
    /** {WebGLRenderingContext} */
    var gl = dc.getGL();

    dc.loadIdentity('uTextureMatrix');

    if (this.holdsTexture()) { // use the tile's texture
        if (!this.getTexture()) {
            this.initializeTexture(dc);
        }

        if (!this.getTexture()) {
            return; // bad texture or something, skip it
        }

        //if (this.getTexture().getMustFlipVertically()) {
            //gl.glScaled(1, -1, 1);
            //gl.glTranslated(0, -1, 0);
        //}

//        this.getTexture().bind();

    } else if (this.getFallbackTile()) { // use texture of resource tile

        /** @type {lanyard.layers.tiled.TextureTile} */
        var resourceTile = this.getFallbackTile();

        if (!resourceTile.getTexture()) {
            resourceTile.initializeTexture(dc);
        }

        if (!resourceTile.getTexture()) {
            return; // bad texture or something, skip it
        }

        //if (resourceTile.getTexture().getMustFlipVertically()) {
            //gl.glScaled(1, -1, 1);
            //gl.glTranslated(0, -1, 0);
        //}

        this.applyResourceTextureTransform(dc);
//         resourceTile.getTexture().bind();
    }
};

/**
 * Apply the texture transformation to the resource.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.layers.tiled.TextureTile.prototype.applyResourceTextureTransform = function(dc) {
    if (!this.getLevel()) {
        return;
    }

    /** @type {number} */
    var levelDelta = this.getLevelNumber() - this.getFallbackTile().getLevelNumber();

    if (levelDelta <= 0) {
        return;
    }

    /** @type {number} */
    var twoToTheN = Math.pow(2, levelDelta);

    /** @type {number} */
    var oneOverTwoToTheN = 1 / twoToTheN;

    /** @type {number} */
    var sShift = oneOverTwoToTheN * (this.getColumn() % twoToTheN);

    /** @type {number} */
    var tShift = oneOverTwoToTheN * (this.getRow() % twoToTheN);

    // Scale it first
    var textureMatrix = new lanyard.geom.MatrixFour([
        oneOverTwoToTheN, 0.0, 0.0, 0.0,
        0.0, oneOverTwoToTheN, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0]);

    // Now translate it
    textureMatrix.translate(sShift, tShift, 0.0);

    dc.loadMatrix('uTextureMatrix', textureMatrix);
};

/**
 * Find a string representation of this texture tile.
 *
 * @return {string} a string representation of this texture tile.
 */
lanyard.layers.tiled.TextureTile.prototype.toString = function() {
    return 'A texture tile which covers sector: ' + this.getSector().toString();
};

/* EOF */
