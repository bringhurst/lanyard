/*global goog, lanyard, Image */
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

goog.provide('lanyard.render.SurfaceImage');

/**
 * Renders a single image tile from a local or remote source.
 *
 * @constructor
 * @implements {lanyard.Renderable}
 * @implements {lanyard.render.SurfaceTile}
 * @param {string} imageSource can be a local image path or a url pointing to another server.
 * @param {lanyard.geom.Sector} sector the sector covered by the image.
 * @param {?lanyard.Layer} layer a reference to the layer handling this image.
 */
lanyard.render.SurfaceImage = function(imageSource, sector, layer) {
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.render.SurfaceImage');

    /**
     * @private
     * @type {lanyard.geom.Extent}
     */
    this.extent = null;

    /**
     * @private
     * @type {number}
     */
    this.extentVerticalExaggertion = Number.MIN_VALUE; // VE used to calculate the extent

    /**
     * @private
     * @type {number}
     */
    this.opacity = 1.0;

    /**
     * @private
     * @type {?lanyard.util.Texture}
     */
    this.textureData = null;

    /**
     * @private
     * @type {boolean}
     */
    this.isLoaded = false; // True when image is loading or downloading

    /**
     * @type {boolean}
     */
    this.hasProblem = false; // True when download failed

    /**
     * @private
     * @type {string}
     */
    this.imageSource = imageSource;

    /**
     * @private
     * @type {lanyard.geom.Sector}
     */
    this.sector = sector;

    /**
     * @private
     * @type {lanyard.geom.Position}
     */
    this.referencePosition = new lanyard.geom.Position.prototype.fromLatLon(sector.getCentroid(), 0);

    /**
     * @private
     * @type {lanyard.Layer}
     */
    this.layer = layer;

    if (!this.imageSource) {
        this._logger.severe('The image source is null.');
    }

    if (!this.sector) {
        this._logger.severe('The sector is null.');
    }
};

/**
 * Sets the sector for the image allowing to change its size or position.
 *
 * @param {lanyard.geom.Sector} sector the new sector.
 */
lanyard.render.SurfaceImage.prototype.setSector = function(sector) {
    if (!sector) {
        this._logger.severe('The sector was null.');
    }

    this.sector = sector;
    this.extent = null;
};

/**
 * Accessor for the sector.
 *
 * @return {lanyard.geom.Sector} the sector for the surface image.
 */
lanyard.render.SurfaceImage.prototype.getSector = function() {
    return this.sector;
};

/**
 * Get the extent of the image.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {lanyard.geom.Extent} the extent of the image.
 */
lanyard.render.SurfaceImage.prototype.getExtent = function(dc) {
    if (!dc) {
        this._logger.severe('The draw context is null.');
    }

    if (!this.extent || this.extentVerticalExaggertion !== dc.getVerticalExaggeration()) {
        this.extent = lanyard.geom.Sector.prototype.computeBoundingCylinder(
            dc.getGlobe(), dc.getVerticalExaggeration(), this.sector
        );
        this.extentVerticalExaggertion = dc.getVerticalExaggeration();
    }

    return this.extent;
};

/**
 * Initialize the texture for the image.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {lanyard.util.Texture} the texture.
 */
lanyard.render.SurfaceImage.prototype.initializeTexture = function(dc) {
    //this._logger.fine("Initializing a texture.");

    if (!dc) {
        this._logger.severe('The draw context was null.');
    }

    /** @type {WebGLRenderingContext} */
    var gl = dc.getGL();

    /** @type {lanyard.render.SurfaceImage} */
    var self = this;

    /** @type {lanyard.util.Texture} */
    var surfaceTexture = new lanyard.util.Texture(dc);

    /** @type {Image} */
    var surfaceImage = new Image();

    surfaceImage.onload = function() {
        //self._logger.fine("Loaded image at: " + self.imageSource + "<img src=" + self.imageSource + ">");

        surfaceTexture.bind();
        surfaceTexture.setImage(surfaceImage);

        surfaceTexture.setTexParameteri(gl.TEXTURE_MIN_FILTER, gl.LINEAR); //_MIPMAP_LINEAR);
        surfaceTexture.setTexParameteri(gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        surfaceTexture.setTexParameteri(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        surfaceTexture.setTexParameteri(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        surfaceTexture.createMipmap();

        self.isLoaded = true;
        self.textureData = surfaceTexture;

        // Fire off a repaint
        dc.getCanvas().display();
    };

    surfaceImage.onerror = function() {
        self._logger.warning('An image failed to load from: ' + self.imageSource);
        self.hasProblem = true;
    };

    surfaceImage.onabort = function() {
        self._logger.warning('An image load was aborted: ' + self.imageSource);
        self.hasProblem = true;
    };

    // Fire it off
    surfaceImage.src = this.imageSource;

    return surfaceTexture;
};

/**
 * Bind the surface image to the current context.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {boolean} if the bind was a success.
 */
lanyard.render.SurfaceImage.prototype.bind = function(dc) {
    //this._logger.fine("Surface image bind was called.");

    if (!dc) {
        this._logger.severe('The draw context is null.');
    }

    /** @type {lanyard.util.Texture} */
    var t = this.textureData;

    if (!t) {
        t = this.initializeTexture(dc);

        if (t) {
            return true; // texture was bound during initialization.
        }
    }

    if (t) {
        //this._logger.fine("Binding a surface image texture.");
        t.bind();
        return true;
    }

    // t was null or not bound
    return false;
};

/**
 * Apply an internal transform.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.render.SurfaceImage.prototype.applyInternalTransform = function(dc) {
    if (!dc) {
        this._logger.severe('The draw context was null.');
    }

    /** @type {lanyard.util.Texture} */
    var t = this.textureData;

    if (!t) {
        t = this.initializeTexture(dc);
    }
};

/**
 * Render the surface image tile.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.render.SurfaceImage.prototype.render = function(dc) {
    //this._logger.fine("The surface image render was called.");

    if (!dc) {
        this._logger.severe('The draw context is null.');
    }

    if (!this.sector.intersects(dc.getVisibleSector())) {
        this._logger.fine('The surface image does not intersect with a visible sector.');
        return;
    }

    /** @type {WebGLRenderingContext} */
    var gl = dc.getGL();

    // FIXME: for picking
    //if (!dc.isPickingMode()) {
        /** @type {number} */
     //   var opacity = this.layer ? this.opacity * this.layer.opacity : this.opacity;

     //   if (opacity < 1) {
            //gl.pushAttrib(gl.COLOR_BUFFER_BIT | gl.GL_POLYGON_BIT | gl.GL_CURRENT_BIT);
            //gl.color4d(1.0, 1.0, 1.0, opacity);
     //   } else {
            //gl.pushAttrib(gl.COLOR_BUFFER_BIT | gl.GL_POLYGON_BIT);
    //    }

        //gl.enable(gl.BLEND);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //} else {
        //gl.pushAttrib(gl.POLYGON_BIT);
    //}

    //gl.polygonMode(gl.FRONT, gl.FILL);
    gl.enable(gl.CULL_FACE);

    //this._logger.fine("Passing things along to the surface tile renderer.");
    dc.getSurfaceTileRenderer().renderTile(dc, this);

    //gl.popAttrib();
};

/**
 * Move the image to a new location.
 *
 * @param {lanyard.geom.Position} position the new position to move to.
 */
lanyard.render.SurfaceImage.prototype.move = function(position) {
    if (!position) {
        this._logger.severe('The position was null.');
    }

    // Increase the current sector position.

    /** @type {number} */
    var minlat = this.sector.getMinLatitude().getDegrees();

    /** @type {number} */
    var minlon = this.sector.getMinLongitude().getDegrees();

    /** @type {number} */
    var maxlat = this.sector.getMaxLatitude().getDegrees();

    /** @type {number} */
    var maxlon = this.sector.getMaxLongitude().getDegrees();

    /** @type {number} */
    var poslat = position.getLatitude().getDegrees();

    /** @type {number} */
    var poslon = position.getLongitude().getDegrees();

    minlat += poslat;
    maxlat += poslat;
    minlon += poslon;
    maxlon += poslon;

    // Check new values don't exceed the limits.
    if (maxlat > 90 || maxlat < -90 || minlat > 90 || minlat < -90 ||
            maxlon > 180 || maxlon < -180 || minlon > 180 || minlon < -180) {
        return;
    }

    this.referencePosition.add(position);
    this.setSector(lanyard.geom.Sector.prototype.fromDegrees(minlat, maxlat, minlon, maxlon));
};

/**
 * Move the image to a new position.
 *
 * @param {lanyard.geom.Position} position the new position to move to.
 */
lanyard.render.SurfaceImage.prototype.moveTo = function(position) {
    if (!position) {
        this._logger.severe('The new position was null.');
    }

    // Calculate new position

    /** @type {number} */
    var poslat = position.getLatitude().getDegrees();

    /** @type {number} */
    var poslon = position.getLongitude().getDegrees();

    /** @type {number} */
    var halfDeltaLat = this.sector.getDeltaLatDegrees() / 2;

    /** @type {number} */
    var halfDeltaLon = this.sector.getDeltaLonDegrees() / 2;

    /** @type {number} */
    var minlat = poslat - halfDeltaLat;

    /** @type {number} */
    var maxlat = poslat + halfDeltaLat;

    /** @type {number} */
    var minlon = poslon - halfDeltaLon;

    /** @type {number} */
    var maxlon = poslon + halfDeltaLon;

    // Check new values don't exceed the limits.
    if (maxlat > 90 || maxlat < -90 || minlat > 90 || minlat < -90 ||
            maxlon > 180 || maxlon < -180 || minlon > 180 || minlon < -180) {
        return;
    }

    this.referencePosition = position;
    this.setSector(lanyard.geom.Sector.prototype.fromDegrees(minlat, maxlat, minlon, maxlon));
};

/**
 * Get the reference position of this surface image.
 *
 * @return {lanyard.geom.Position} the reference position of this surface image.
 */
lanyard.render.SurfaceImage.prototype.getReferencePosition = function() {
    return this.referencePosition;
};

/**
 * Return the type and path of this surface image.
 *
 * @return {string} the string representation of this object.
 */
lanyard.render.SurfaceImage.prototype.toString = function() {
    return 'A SurfaceImage with a path of: ' + this.imageSource;
};

/* EOF */
