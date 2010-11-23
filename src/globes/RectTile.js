/*global goog, lanyard, WebGLFloatArray */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

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

goog.provide('lanyard.globes.RectTile');

goog.require('lanyard.geom.Point');
goog.require('lanyard.geom.Angle');
goog.require('lanyard.globes.RenderInfo');
goog.require('lanyard.ElevationModel');
goog.require('lanyard.geom.Position');
goog.require('lanyard.SectorGeometry');

/**
 * A representation of a rectangular tile.
 *
 * @param {lanyard.Globe} globe
 * @param {number} level
 * @param {number} density
 * @param {lanyard.geom.Sector} sector
 * @implements {lanyard.SectorGeometry}
 * @constructor
 */
lanyard.globes.RectTile = function (globe, level, density, sector) {
    /**
     * @private
     */
    this._logger = goog.debug.Logger.getLogger('lanyard.globes.RectTile');

    /**
     * @type {*}
     * @private
     */
    this.posBuffer = null;

    /**
     * @type {*}
     * @private
     */
    this.texBuffer = null;

    /**
     * @type {*}
     * @private
     */
    this.idxBuffer = null;

    /**
     * @type {number}
     * @private
     */
    this._minColorCode = 0;
    
    /**
     * @type {number}
     * @private
     */
    this._maxColorCode = 0;

    /** @private */ this._globe = globe;
    /** @private */ this._level = level;
    /** @private */ this._density = density;
    /** @private */ this._sector = sector;

    /**
     * Extent of triangle in object coordinates.
     *
     * @private
     */
    this._extent =
        lanyard.geom.Sector.prototype.computeBoundingCylinder(globe, 1.0, this._sector);

    /** @type {number} */
    var cellSize = (sector.getDeltaLatRadians() * globe.getRadius()) / density;

    /**
     * @type {number}
     * @private
     */
    this._log10CellSize = Math.log(cellSize) / Math.LN10;;

    /**
     * @type {lanyard.globes.RenderInfo|null}
     * @private
     */
    this._ri = null;

    /**
     * @type {Object.<number, Array.<number>>}
     * @private
     */
    this._parameterizations = {};

    /**
     * @type {Object}
     * @private
     */
    this._indexLists = {};

    //this._logger.fine("Creating a new renderable tile for sector: " + this._sector.toString());
};

/**
 * Return the log10 cell size.
 *
 * @return {number} the log10 cell size.
 */
lanyard.globes.RectTile.prototype.getLog10CellSize = function () {
    return this._log10CellSize;
};

/**
 * Returns the current sector.
 *
 * @return {lanyard.geom.Sector} the current sector.
 */
lanyard.globes.RectTile.prototype.getSector = function () {
    return this._sector;
};

/**
 * Returns the current extent.
 *
 * @return {lanyard.geom.Extent} the current extent.
 */
lanyard.globes.RectTile.prototype.getExtent = function () {
    return this._extent;
};

/**
 * Split the tile.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.globes.RectTile} tile the tile to split.
 * @return {Array.<lanyard.globes.RectTile>} the split tiles.
 */
lanyard.globes.RectTile.prototype.split = function (dc, tile) {
    /** @type {Array.<lanyard.geom.Sector>} */
    var sectors = this._sector.subdivide();

    /** @type {Array.<lanyard.globes.RectTile>} */
    var subTiles = [];
    subTiles[0] = new lanyard.globes.RectTile(this._globe, tile._level + 1, this._density, sectors[0]);
    subTiles[1] = new lanyard.globes.RectTile(this._globe, tile._level + 1, this._density, sectors[1]);
    subTiles[2] = new lanyard.globes.RectTile(this._globe, tile._level + 1, this._density, sectors[2]);
    subTiles[3] = new lanyard.globes.RectTile(this._globe, tile._level + 1, this._density, sectors[3]);

    return subTiles;
};

/**
 * Build vertices.
 *
 * @param {lanyard.DrawContext} dc the drawcontext.
 */
lanyard.globes.RectTile.prototype.makeVerts = function (dc) {
    //this._logger.fine("Make verts called.");

    // FIXME
    // /** @type {number} */
    // var resolution = dc.getGlobe().getElevationModel().getTargetResolution(dc, this._sector, this._density);

    var resolution = 0;

    if (this._ri && this._ri.resolution >= resolution) {
        return;
    }

    this._ri = this.buildVerts(dc, this._density, resolution, true);
};

/**
 * Build the vertices.
 *
 * @private
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {number} density the density of the vertices.
 * @param {number} resolution the resolution of the vertices.
 * @param {boolean} makeSkirts should we make skirts to hide tile edges.
 * @return {lanyard.globes.RenderInfo} the render info.
 */
lanyard.globes.RectTile.prototype.buildVerts = function (dc, density, resolution, makeSkirts) {
    /** @type {number} */
    var numVertices = (density + 3) * (density + 3);

    /** @type {Array.<number>} */
    var verts = [];

    /** @type {lanyard.Globe} */
    var globe = dc.getGlobe();

    // FIXME:
    // /** @type {lanyard.Elevations} */
    // var elevations = globe.getElevationModel().getElevations(this._sector, resolution);

    /** @type {number} */
    var latMin = this._sector.getMinLatitude().getRadians();

    /** @type {number} */
    var latMax = this._sector.getMaxLatitude().getRadians();

    /** @type {number} */
    var dLat = (latMax - latMin) / density;

    /** @type {number} */
    var lonMin = this._sector.getMinLongitude().getRadians();

    /** @type {number} */
    var lonMax = this._sector.getMaxLongitude().getRadians();

    /** @type {number} */
    var dLon = (lonMax - lonMin) / density;

    //this._logger.fine("Tile contains degrees lat of " + dLat + "; lon of " + dLon);

    /** @type {number} */
    var iv = 0;

    /** @type {number} */
    var lat = latMin;

    /** @type {number} */
    var verticalExaggeration = dc.getVerticalExaggeration();

    /** @type {number} */
    var exaggeratedMinElevation = makeSkirts ? globe.getMinElevation() * verticalExaggeration : 0;

    /** @type {number} */
    var equatorialRadius = globe.getEquatorialRadius();

    /** @type {number} */
    var eccentricity = globe.getEccentricitySquared();

    /** @type {lanyard.geom.LatLon} */
    var centroid = this._sector.getCentroid();

    /** @type {lanyard.geom.Point} */
    var refCenter = globe.computePointFromPosition(
        new lanyard.geom.Position(
            centroid.getLatitude(),
            centroid.getLongitude(),
            0)
        );

    /** @type {number} */
    var j;
    for (j = 0; j <= density + 2; j = j + 1) {
        /** @type {number} */ 
        var cosLat = Math.cos(lat);

        /** @type {number} */
        var sinLat = Math.sin(lat);

        /** @type {number} */
        var rpm = equatorialRadius / Math.sqrt(1.0 - eccentricity * sinLat * sinLat);

        /** @type {number} */
        var lon = lonMin;

        /** @type {number} */
        var i;
        for (i = 0; i <= density + 2; i = i + 1) {
            // FIXME:

            /** @type {number} */
            //var elevation = verticalExaggeration * elevations.getElevation(lat, lon);

            var elevation = 0;

            if (j === 0 || j >= density + 2 || i === 0 || i >= density + 2) {
                // use abs to account for negative elevation.
                elevation -= exaggeratedMinElevation >= 0 ? exaggeratedMinElevation : -exaggeratedMinElevation;
            }

            /** @type {number} */
            var x = ((rpm + elevation) * cosLat * Math.sin(lon)) - refCenter.getX();

            /** @type {number} */
            var y = ((rpm * (1.0 - eccentricity) + elevation) * sinLat) - refCenter.getY();

            /** @type {number} */
            var z = ((rpm + elevation) * cosLat * Math.cos(lon)) - refCenter.getZ();

            verts = verts.concat([x, y, z]);

            if (i > density) {
                lon = lonMax;
            } else if (i !== 0) {
                lon += dLon;
            }
        }

        if (j > density) {
            lat = latMax;
        } else if (j !== 0) {
            lat += dLat;
        }
    }

    //this._logger.fine("Created vert of: " + verts);

    /** @type {lanyard.globes.RenderInfo} */
    var retVal =
        new lanyard.globes.RenderInfo(
            density,
            verts,
            this.getParameterization(density),
            refCenter,
            //elevations.getResolution() FIXME
            0,
            this
        );

    return retVal;
};

/**
 * Render the tile, specify how many texture units are on the context.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {number} numTextureUnits the number of texture units available.
 * @return {number} the number of triangles rendered.
 */
lanyard.globes.RectTile.prototype.render = function (dc, numTextureUnits) {
    //this._logger.fine("Render was called.");

    /** @type {Array.<number>} */
    var indices = this.getIndices(this._ri.density);

    var gl = dc.getGL();

    dc.getView().pushModelViewReferenceCenter(dc, this._ri.referenceCenter);

    if(!this.posBuffer) {
        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._ri.vertices), gl.STATIC_DRAW);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    }

    gl.enableVertexAttribArray(dc.getGLSL().getAttribLocation("aVertexPosition"));
    gl.vertexAttribPointer(dc.getGLSL().getAttribLocation("aVertexPosition"),
        3, gl.FLOAT, false, 0, 0);

    //FIXME: support more than one texture unit

    if(!this.texBuffer) {
        this.texBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._ri.texCoords), gl.STATIC_DRAW);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    }

    gl.enableVertexAttribArray(dc.getGLSL().getAttribLocation("aTextureCoord0"));
    gl.vertexAttribPointer(dc.getGLSL().getAttribLocation("aTextureCoord0"),
        2, gl.FLOAT, false, 0, 0)

    if(!this.idxBuffer) {
        this.idxBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuffer);
    }

    gl.drawElements(gl.TRIANGLE_STRIP, this._ri.indices.length, gl.UNSIGNED_SHORT, 0);

    dc.getView().popModelViewMatrix(dc);
    return this._ri.indices.length - 2; // return number of triangles rendered
};

/**
 * Render the tile as a wireframe.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {boolean} showTriangles show the individual triangles.
 * @param {boolean} showTileBoundary show the boundaries of the tiles.
 */
lanyard.globes.RectTile.prototype.renderWireframe = function (dc, showTriangles, showTileBoundary) {
    /** @type {Array.<number>} */
    var indices = this.getIndices(this._ri.density);

    dc.getView().pushModelViewReferenceCenter(dc, this._ri.referenceCenter);

    var gl = dc.getGL();

    if (showTriangles) {
        var posBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._ri.vertices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(dc.getGLSL().getAttribLocation("aVertexPosition"));
        gl.vertexAttribPointer(dc.getGLSL().getAttribLocation("aVertexPosition"),
            3, gl.FLOAT, false, 0, 0);

        var idxBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW);

        gl.drawElements(gl.TRIANGLE_STRIP, this._ri.vertices.length / 3, gl.UNSIGNED_SHORT, 0);
    }

    dc.getView().popModelViewMatrix(dc);

    if (showTileBoundary) {
        this.renderPatchBoundary(dc, gl);
    }
};

/**
 * Render the patch boundary. This currently only works if called
 * from renderWireframe() because no state is set here.
 *
 * TODO: Draw the boundary using the vertices along the boundary
 * rather than just at the corners.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {*} gl the webgl context.
 */
lanyard.globes.RectTile.prototype.renderPatchBoundary = function (dc, gl) {
/**************
    // TODO: Currently only works if called from renderWireframe because no state is set here.
    // TODO: Draw the boundary using the vertices along the boundary rather than just at the corners.
    gl.glColor4d(1d, 0, 0, 1d);
    Point[] corners = this.sector.computeCornerPoints(dc.getGlobe());

    gl.glBegin(javax.media.opengl.GL.GL_QUADS);
    gl.glVertex3d(corners[0].x(), corners[0].y(), corners[0].z());
    gl.glVertex3d(corners[1].x(), corners[1].y(), corners[1].z());
    gl.glVertex3d(corners[2].x(), corners[2].y(), corners[2].z());
    gl.glVertex3d(corners[3].x(), corners[3].y(), corners[3].z());
    gl.glEnd();
***************/
};

/**
 * Render the bounding volume.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.globes.RectTile.prototype.renderBoundingVolume = function (dc) {
    this.getExtent().render(dc);
};

/**
 * Render triangles with unique colors.
 *
 * @private
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.globes.RenderInfo} ri the renderinfo.
 */
lanyard.globes.RectTile.prototype.renderTrianglesWithUniqueColors = function (dc, ri) {
/****************
    var gl = dc.getGL();

    if (null != ri.referenceCenter) {
        dc.getView().pushModelViewReferenceCenter(dc, ri.referenceCenter);
    }

    minColorCode = dc.getUniquePickColor().getRGB();
    int trianglesNum = ri.indices.capacity() - 2;

    gl.glBegin(GL.GL_TRIANGLES);
    for (int i = 0; i < trianglesNum; i++) {
       java.awt.Color color = dc.getUniquePickColor();
       gl.glColor3ub((byte) (color.getRed() & 0xFF),
           (byte) (color.getGreen() & 0xFF),
           (byte) (color.getBlue() & 0xFF));

       int vIndex = 3 * ri.indices.get(i);
       gl.glVertex3d(ri.vertices.get(vIndex), ri.vertices.get(vIndex + 1), ri.vertices.get(
           vIndex + 2));

       vIndex = 3 * ri.indices.get(i + 1);
       gl.glVertex3d(ri.vertices.get(vIndex), ri.vertices.get(vIndex + 1), ri.vertices.get(
           vIndex + 2));

       vIndex = 3 * ri.indices.get(i + 2);
       gl.glVertex3d(ri.vertices.get(vIndex), ri.vertices.get(vIndex + 1), ri.vertices.get(
           vIndex + 2));
    }
    gl.glEnd();
    maxColorCode = dc.getUniquePickColor().getRGB();

    if (null != ri.referenceCenter) {
        dc.getView().popModelViewMatrix(dc);
    }
*************/
};

/**
 * Find a surface point at the specified location.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the location.
 * @param {lanyard.geom.Angle} longitude the longitude of the location.
 * @param {number} metersOffset the meters offset.
 * @return {lanyard.geom.Point} the surface point.
 */
lanyard.globes.RectTile.prototype.getSurfacePoint = function (latitude, longitude, metersOffset) {

    if (!this._sector.contains(latitude, longitude)) {
        // not on this geometry
        return null;
    }

    if (!this._ri) {
        return null;
    }

    /** @type {number} */
    var lat = latitude.getDegrees();

    /** @type {number} */
    var lon = longitude.getDegrees();

    /** @type {number} */
    var bottom = this._sector.getMinLatitude().getDegrees();

    /** @type {number} */
    var top = this._sector.getMaxLatitude().getDegrees();

    /** @type {number} */
    var left = this._sector.getMinLongitude().getDegrees();

    /** @type {number} */
    var right = this._sector.getMaxLongitude().getDegrees();

    /** @type {number} */
    var leftDecimal = (lon - left) / (right - left);

    /** @type {number} */
    var bottomDecimal = (lat - bottom) / (top - bottom);

    /** @type {number} */
    var row = bottomDecimal * this._density;

    /** @type {number} */
    var column = leftDecimal * this._density;

    /** @type {number} */
    var l = lanyard.globes.RectTile.prototype.createPosition(column, leftDecimal, this._ri.density);

    /** @type {number} */
    var h = lanyard.globes.RectTile.prototype.createPosition(row, bottomDecimal, this._ri.density);

    /** @type {lanyard.geom.Point} */
    var result = lanyard.globes.RectTile.prototype.interpolate(row, column, l, h, this._ri);
    result = result.add(this._ri.referenceCenter);

    if (metersOffset !== 0) {
        result = lanyard.globes.RectTile.prototype.applyOffset(this._globe, result, metersOffset);
    }

    return result;
};

/**
 * Offsets point by metersOffset meters.
 *
 * @param {lanyard.Globe} globe the Globe from which to offset.
 * @param {lanyard.geom.Point} point the Point to offset.
 * @param {number} metersOffset the magnitude of the offset.
 * @return {lanyard.geom.Point} point offset along its surface normal as if it were on globe.
 */
lanyard.globes.RectTile.prototype.applyOffset = function (globe, point, metersOffset) {
    /** @type {lanyard.geom.Point} */
    var normal = globe.computeSurfaceNormalAtPoint(point);
    point = lanyard.geom.Point.prototype.fromOriginAndDirection(metersOffset, normal, point);
    return point;
};

/**
 * Computes from a column (or row) number, and a given offset ranged [0,1] corresponding to the distance along
 * the edge of this sector, where between this column and the next column the corresponding position will fall,
 * in the range [0,1].
 *
 * @param {number} start the number of the column or row to the left, below or on this position.
 * @param {number} decimal the distance from the left or bottom of the current sector that this position falls.
 * @param {number} density the number of intervals along the sector's side.
 * @return {number} a decimal ranged [0,1] representing the position between two columns or rows,
 *     rather than between two edges of the sector.
 */
lanyard.globes.RectTile.prototype.createPosition = function (start, decimal, density) {
    /** @type {number} */
    var l = start / density;

    /** @type {number} */
    var r = (start + 1) / density;

    return (decimal - l) / (r - l);
};

/**
 * Calculates a Point that sits at xDec offset from column to
 * column + 1 and at yDec offset from row to row + 1.
 * Accounts for the diagonals.
 *
 * @param {number} row represents the row which corresponds to a yDec value of 0.
 * @param {number} column represents the column which corresponds to an xDec value of 0.
 * @param {number} xDec constrained to [0,1].
 * @param {number} yDec constrained to [0,1].
 * @param {lanyard.globes.RenderInfo} ri the render info holding the vertices, etc.
 * @return {lanyard.geom.Point} a Point geometrically within or on the boundary of the
 *     quadrilateral whose bottom left corner is indexed by (row, column).
 */
lanyard.globes.RectTile.prototype.interpolate = function (row, column, xDec, yDec, ri) {
    row++;
    column++;

    /** @type {number} */
    var numVerticesPerEdge = ri.density + 3;

    /** @type {number} */
    var bottomLeft = row * numVerticesPerEdge + column;

    bottomLeft *= 3;

    /** @type {number} */
    var numVertsTimesThree = numVerticesPerEdge * 3;

    /** @type {lanyard.geom.Point} */
    var bL = new lanyard.geom.Point(ri.vertices[bottomLeft], ri.vertices[bottomLeft + 1],
        ri.vertices[bottomLeft + 2], 1);

    /** @type {lanyard.geom.Point} */
    var bR = new lanyard.geom.Point(ri.vertices[bottomLeft + 3], ri.vertices[bottomLeft + 4],
        ri.vertices[bottomLeft + 5], 1);

    bottomLeft += numVertsTimesThree;

    /** @type {lanyard.geom.Point} */
    var tL = new lanyard.geom.Point(ri.vertices[bottomLeft], ri.vertices[bottomLeft + 1],
        ri.vertices[bottomLeft + 2], 1);

    /** @type {lanyard.geom.Point} */
    var tR = new lanyard.geom.Point(this._ri.vertices[bottomLeft + 3], this._ri.vertices[bottomLeft + 4],
        this._ri.vertices[bottomLeft + 5], 1);

    return lanyard.globes.RectTile.prototype.interpolateTriangles(bL, bR, tR, tL, xDec, yDec);
};

/**
 * Calculates the point at (xDec, yDec) in the two triangles defined by {bL, bR, tL} and {bR, tR, tL}. If
 * thought of as a quadrilateral, the diagonal runs from tL to bR. Of course, this isn't a quad, it's two
 * triangles.
 *
 * @param {lanyard.geom.Point} bL the bottom left corner.
 * @param {lanyard.geom.Point} bR the bottom right corner.
 * @param {lanyard.geom.Point} tR the top right corner.
 * @param {lanyard.geom.Point} tL the top left corner.
 * @param {number} xDec how far along, [0,1] 0 = left edge, 1 = right edge.
 * @param {number} yDec how far along, [0,1] 0 = bottom edge, 1 = top edge.
 * @return {lanyard.geom.Point} the point xDec, yDec in the co-ordinate system defined by bL, bR, tR, tL.
 */
lanyard.globes.RectTile.prototype.interpolateTriangles = function (bL, bR, tR, tL, xDec, yDec) {
    /** @type {number} */
    var pos = xDec + yDec;

    /** @type {lanyard.geom.Point} */
    var horizontalVector;

    /** @type {lanyard.geom.Point} */
    var verticalVector;

    if (pos === 1) {
        // on the diagonal - what's more, we don't need to do any "oneMinusT" calculation
        return new lanyard.geom.Point(tL.getX() * yDec + bR.getX() * xDec, tL.getY() * yDec + bR.getY() * xDec,
            tL.getZ() * yDec + bR.getZ() * xDec, 1);
    } else if (pos > 1) {
        // in the "top right" half

        // vectors pointing from top right towards the point we want (can be thought of as "negative" vectors)
        horizontalVector = (tL.subtract(tR)).multiply(1 - xDec);
        verticalVector = (bR.subtract(tR)).multiply(1 - yDec);

        return tR.add(horizontalVector).add(verticalVector);
    } else {
        // pos < 1 - in the "bottom left" half

        // vectors pointing from the bottom left towards the point we want
        horizontalVector = (bR.subtract(bL)).multiply(xDec);
        verticalVector = (tL.subtract(bL)).multiply(yDec);

        return bL.add(horizontalVector).add(verticalVector);
    }
};

/**
 * The usual toString.
 *
 * @return {string} this RectTile, as a string.
 */
lanyard.globes.RectTile.prototype.toString = function () {
    return "level " + this._level + ", density " + this._density + ", sector " + this._sector;
};

/**
 * Get parameterization.
 *
 * @param {number} density
 * @return {Array.<number>}
 */
lanyard.globes.RectTile.prototype.getParameterization = function (density) {
    if (density < 1) {
        density = 1;
    }

    // Approximate 1 to avoid shearing off of right and top skirts in SurfaceTileRenderer.
    // TODO: dig into this more: why are the skirts being sheared off?
    /** @type {number} */
    var one = 0.999999;


    if(this && this._parameterizations && this._parameterizations.density) {
        return this._parameterizations.density;
    }

    /** @type {number} */
    var coordCount = (density + 3) * (density + 3);

    /** @type {Array.<number>} */
    var p = [];

    /** @type {number} */
    var delta = 1.0 / density;

    /** @type {number} */
    var k = 2 * (density + 3);

    /** @type {number} */
    var j;
    for (j = 0; j < density; j = j + 1) {
        /** @type {number} */
        var v = j * delta;

        // skirt column; duplicate first column
        p[k++] = 0;
        p[k++] = v;

        // interior columns
        /** @type {number} */
        var i;
        for (i = 0; i < density; i = i + 1) {
            p[k++] = i * delta; // u
            p[k++] = v;
        }

        // last interior column; force u to 1.
        p[k++] = one;
        p[k++] = v;

        // skirt column; duplicate previous column
        p[k++] = one;
        p[k++] = v;
    }

    // Last interior row
    /** @type {number} */
    var v1 = one;
    p[k++] = 0; // skirt column
    p[k++] = v1;

    /** @type {number} */
    var j1;
    for (j1 = 0; j1 < density; j1 = j1 + 1) {
        p[k++] = j1 * delta; // u
        p[k++] = v1;
    }

    p[k++] = one; // last interior column
    p[k++] = v1;

    p[k++] = one; // skirt column
    p[k++] = v1;

    // last skirt row
    /** @type {number} */
    var kk = k - 2 * (density + 3);

    /** @type {number} */
    var m;
    for (m = 0; m < density + 3; m = m + 1) {
        p[k++] = p[kk++];
        p[k++] = p[kk++];
    }

    // first skirt row
    k = 0;
    kk = 2 * (density + 3);

    var n;
    for (n = 0; n < density + 3; n = n + 1) {
        p[k++] = p[kk++];
        p[k++] = p[kk++];
    }

    if(this._parameterizations) {
        this._parameterizations.density = p;
    }

    return p;
};

/**
 * Get the indices.
 *
 * @param {number} density the density.
 * @return {Array.<number>} the indices.
 */
lanyard.globes.RectTile.prototype.getIndices = function (density) {
    if (density < 1) {
        density = 1;
    }

    // return a pre-computed buffer if possible.
    if(this._indexLists && this._indexLists.density) {
        return this._indexLists.density;
    }

    /** @type {number} */
    var sideSize = density + 2;

    /** @type {number} */
    var indexCount = 2 * sideSize * sideSize + 4 * sideSize - 2;

    /** @type {Array.<number>} */
    var buffer = [];

    /** @type {number} */
    var k = 0;

    /** @type {number} */
    var i;
    for (i = 0; i < sideSize; i = i + 1) {
        buffer.push(k);

        if (i > 0) {
            buffer.push(++k);
            buffer.push(k);
        }

        if (i % 2 === 0) { // even
            buffer.push(++k);

            /** @type {number} */
            var j;
            for (j = 0; j < sideSize; j = j + 1) {
                k += sideSize;
                buffer.push(k);
                buffer.push(++k);
            }
        } else { // odd
            buffer.push(--k);

            /** @type {number} */
            var m;
            for (m = 0; m < sideSize; m++) {
                k -= sideSize;
                buffer.push(k);
                buffer.push(--k);
            }
        }
    }

    if(this._indexLists) {
        this._indexLists.density = buffer;
    }

    return buffer;
};

/* EOF */
