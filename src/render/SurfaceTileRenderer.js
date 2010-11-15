/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

/**
 * Lanyard is Copyright 2010 Jonathan Bringhurst.
 *
 * This file is part of Lanyard.
 *
 * Lanyard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Lanyard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Lanyard.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Portions of Lanyard which do not constitute a "Larger Work" may be licensed
 * under the NASA OPEN SOURCE AGREEMENT VERSION 1.3.
 *
 * See http://worldwind.arc.nasa.gov/ for further information about NASA World Wind.
 */

goog.provide('lanyard.render.SurfaceTileRenderer');

goog.require('goog.debug.Logger');

goog.require('lanyard.util.Texture');
goog.require('lanyard.render.SurfaceTile');

/**
 * A surface tile renderer.
 *
 * @constructor
 * @param {*} gl the current gl context.
 */
lanyard.render.SurfaceTileRenderer = function (gl) {
    /** @type {lanyard.util.Texture} */
    this.alphaTexture = null;
   
    /** @type {lanyard.util.Texture} */ 
    this.outlineTexture = null;

    /** @type {boolean} */
    this.showImageTileOutlines = true;

    /** @type {*} */
    this.gl = gl;

    /** @type {Object} */
    this.transform = {
        HScale: 0.0,
        VScale: 0.0,
        HShift: 0.0,
        VShift: 0.0
    };

    /** @type {number} */
    this.sgWidth = 0;

    /** @type {number} */
    this.sgHeight = 0;

    /** @type {number} */
    this.sgMinWE = 0;

    /** @type {number} */
    this.sgMinSN = 0;

    /** @private */
    this._logger = goog.debug.Logger.getLogger('lanyard.render.SurfaceTileRenderer');
};

/**
 * @const
 * @type {number}
 */
lanyard.render.SurfaceTileRenderer.prototype.DEFAULT_ALPHA_TEXTURE_SIZE = 2;

/**
 * Precompute the transform.
 *
 * @param {lanyard.DrawContext} dc the draw context to use.
 * @param {lanyard.SectorGeometry} sg the sector geometry to work with.
 */
lanyard.render.SurfaceTileRenderer.prototype.preComputeTransform = function (dc, sg) {
    /** @type {lanyard.geom.Sector} */
    var st = sg.getSector();

    this.sgWidth = st.getDeltaLonRadians();
    this.sgHeight = st.getDeltaLatRadians();
    this.sgMinWE = st.getMinLongitude().getRadians();
    this.sgMinSN = st.getMinLatitude().getRadians();
};

/**
 * Compute the transform.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.render.SurfaceTile} tile the tile to transform.
 * @param {Object} t the transformation object.
 */
lanyard.render.SurfaceTileRenderer.prototype.computeTransform = function (dc, tile, t) {
    /** @type {lanyard.geom.Sector} */
    var st = tile.getSector();

    /** @type {number} */
    var tileWidth = st.getDeltaLonRadians();

    /** @type {number} */
    var tileHeight = st.getDeltaLatRadians();

    /** @type {number} */
    var minLon = st.getMinLongitude().getRadians(); // + lonShift.radians;

    /** @type {number} */
    var minLat = st.getMinLatitude().getRadians(); // + latShift.radians;

    t.VScale = tileHeight > 0 ? this.sgHeight / tileHeight : 1;
    t.HScale = tileWidth > 0 ? this.sgWidth / tileWidth : 1;
    t.VShift = -(minLat - this.sgMinSN) / this.sgHeight;
    t.HShift = -(minLon - this.sgMinWE) / this.sgWidth;
};

/**
 * Determine if the image tile outline should display.
 *
 * @return {boolean} true if the outlines should display, false otherwise.
 */
lanyard.render.SurfaceTileRenderer.prototype.isShowImageTileOutlines = function() {
    return this.showImageTileOutlines;
};

/**
 * Set if the tile outlines should display or not.
 *
 * @param {boolean} showImageTileOutlines true if they should display, false otherwise.
 */
lanyard.render.SurfaceTileRenderer.prototype.setShowImageTileOutlines = function (showImageTileOutlines) {
    this.showImageTileOutlines = showImageTileOutlines;
};

/**
 * Render a tile to the current draw context.
 *
 * @param {lanyard.DrawContext} dc the draw context to render to.
 * @param {lanyard.render.SurfaceTile} tile the tile to render.
 */
lanyard.render.SurfaceTileRenderer.prototype.renderTile = function (dc, tile) {
    this._logger.fine("renderTile was called.");

    if(!tile) {
        this._logger.fine("Attempted to render a null tile.");
        return;
    }

    this.renderTiles(dc, [tile]);
};

/**
 * Do a render of the tiles.
 *
 * @param {lanyard.DrawContext} dc the draw context to render to.
 * @param {Array.<lanyard.render.SurfaceTile>} tiles the tiles to render.
 */
lanyard.render.SurfaceTileRenderer.prototype.renderTiles = function (dc, tiles) {
    this._logger.fine("renderTiles was called.");

    /** @type {*} */
    var gl = dc.getGL();

    if (!this.alphaTexture) {
        this.initAlphaTexture(
            lanyard.render.SurfaceTileRenderer.prototype.DEFAULT_ALPHA_TEXTURE_SIZE
        );
    }

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.activeTexture(gl.TEXTURE0);
    gl.enable(gl.TEXTURE_2D);

    /** @type {lanyard.SectorGeometryList} */
    var sectorGeoms = dc.getSurfaceGeometry();

    /** @type {number} */
    var i;

    for(i = 0; i < sectorGeoms.geometryList.length; i = i + 1) {
        /** @type {Array.<lanyard.render.SurfaceTile>} */
        var tilesToRender = this.getIntersectingTiles(sectorGeoms.geometryList[i], tiles);

        if (!tilesToRender) {
            continue;
        }

        // Pre-load info to compute the texture transform below
        this.preComputeTransform(dc, sectorGeoms.geometryList[i]);

        // For each interesecting tile, establish the texture transform necessary to map the image tile
        // into the geometry tile's texture space. Use an alpha texture as a mask to prevent changing the
        // frame buffer where the image tile does not overlap the geometry tile. Render both the image and
        // alpha textures via multi-texture rendering.

        // TODO: Figure out how to apply multi-texture to more than one tile at a time, most likely via a
        // fragment shader.

        /** @type {number} */
        var j;

        for (j = 0; j < tilesToRender.length; j = j + 1) {
            gl.activeTexture(gl.TEXTURE0);

            if (tilesToRender[j].bind(dc)) {
                // Pass some uniform values to fragment shader.
                gl.uniform1i(dc.getGLSL().getUniformLocation("tile_image"), 0); // Use texture unit 0.
                gl.uniform1i(dc.getGLSL().getUniformLocation("alpha_mask"), 1); // Use texture unit 1.

                /** @type {number} */
                var so = 0;

                if(this.showImageTileOutlines) {
                    so = 1;
                }

                // Flag for fragment shader.
                gl.uniform1i(dc.getGLSL().getUniformLocation("showoutlines"), so);

                tilesToRender[j].applyInternalTransform(dc);

                // Determine and apply texture transform to map image tile into geometry tile's texture space
                this.computeTransform(dc, tilesToRender[j], this.transform);
                gl.glScaled(this.transform.HScale, this.transform.VScale, 1.0);
                gl.glTranslated(this.transform.HShift, this.transform.VShift, 0.0);

                gl.glUniform1f(
                    dc.getGLSL().getUniformLocation("latitude"),
                    tilesToRender[j].getSector().getCentroid().getLatitude().getDegrees()
                );

                gl.glUniform1f(
                    dc.getGLSL().getUniformLocation("longitude"),
                    tilesToRender[j].getSector().getCentroid().getLongitude().getDegrees()
                );

                //we will apply the transform to alpha mask in the vertex shader using texture 0 matrix 
                gl.activeTexture(gl.TEXTURE1);
                this.alphaTexture.bind();

                var numTexUnitsUsed = 2;

                // Render the geometry tile
                sectorGeoms.geometryList[i].render(dc);
            }
        }
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.disable(gl.TEXTURE_2D);
};

/**
 * Find intersecting tiles.
 *
 * @param {lanyard.SectorGeometry} sg the sector geometry.
 * @param {Array.<lanyard.render.SurfaceTile>} tiles the tiles.
 * @return {Array.<lanyard.render.SurfaceTile>} the intersecting tiles.
 */
lanyard.render.SurfaceTileRenderer.prototype.getIntersectingTiles = function (sg, tiles) {
    /** @type {Array.<lanyard.render.SurfaceTile>} */
    var intersectingTiles = [];

    /** @type {number} */
    var i;
    for (i = 0; i < tiles.length; i = i + 1) {
        if (tiles[i].getSector().intersects(sg.getSector())) {
            intersectingTiles.push(tiles[i]);
        }
    }

    return intersectingTiles;
};

/**
 * Generate an alpha texture of the specified size.
 *
 * @param {number} size the size fo the specified tile.
 */
lanyard.render.SurfaceTileRenderer.prototype.initAlphaTexture = function (size) {
    /** @type {Element} */
    var textureCanvas = goog.dom.createElement("canvas");
    textureCanvas.width = textureCanvas.height = size;

    var textureContext = textureCanvas.getContext("2d");
    var textureImage = textureContext.createImageData(size, size);

    for (var i = 0; i < size; i += 1) {
        for (var j = 0; j < size; j += 1) {
            var index = (j * size + i) * 4;
            textureImage.data[index + 0] = 255;
            textureImage.data[index + 1] = 255;
            textureImage.data[index + 2] = 255;
            textureImage.data[index + 3] = 255;
        }
    }

    textureContext.putImageData(textureImage, 0, 0);

    this.alphaTexture = new lanyard.util.Texture(this.gl);
    this.alphaTexture.updateCanvas(textureCanvas);

    this.alphaTexture.bind();

    this.alphaTexture.setTexParameteri(this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.alphaTexture.setTexParameteri(this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.alphaTexture.setTexParameteri(this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.alphaTexture.setTexParameteri(this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
};

/**
 * Generate an outline texture of the specified size.
 *
 * @param {number} size the size of the texture to create.
 */
lanyard.render.SurfaceTileRenderer.prototype.initOutlineTexture = function (size) {
    /** @type {Element} */
    var textureCanvas = goog.dom.createElement("canvas");
    textureCanvas.width = textureCanvas.height = size;

    var textureContext = textureCanvas.getContext("2d");
    var textureImage = textureContext.createImageData(size, size);

    for (var i = 0; i < size; i += 1) {
        for (var j = 0; j < size; j += 1) {
            var index = (j * size + i) * 4;
            if (i === 0 || j === 0 || i === size - 1 || j === size - 1) {
                textureImage.data[index + 0] = 255;
                textureImage.data[index + 1] = 255;
                textureImage.data[index + 2] = 255;
                textureImage.data[index + 3] = 255;
            } else {
                textureImage.data[index + 0] = 0;
                textureImage.data[index + 1] = 0;
                textureImage.data[index + 2] = 0;
                textureImage.data[index + 3] = 0;
            }
        }
    }

    textureContext.putImageData(textureImage, 0, 0);

    this.outlineTexture = new lanyard.util.Texture(this.gl);
    this.outlineTexture.updateCanvas(textureCanvas);

    this.outlineTexture.bind();

    this.outlineTexture.setTexParameteri(this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.outlineTexture.setTexParameteri(this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.outlineTexture.setTexParameteri(this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.outlineTexture.setTexParameteri(this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
};

/* EOF */
