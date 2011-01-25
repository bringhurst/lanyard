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

goog.provide('lanyard.layers.earth.PoliticalBoundariesLayer');

goog.require('lanyard.layers.tiled.TiledImageLayer');

/**
 * An layer to provide country outlines.
 *
 * @constructor
 * @extends {lanyard.layers.tiled.TiledImageLayer}
 * @this {lanyard.layers.earth.PoliticalBoundariesLayer}
 */
lanyard.layers.earth.PoliticalBoundariesLayer = function() {
    lanyard.layers.tiled.TiledImageLayer.call(this, null);

    this._logger = goog.debug.Logger.getLogger('lanyard.layers.earth.BMNGOneImage');

    this.makeLevels();
    this.setUseTransparentTextures(true);
};

/**
 * Make the levels for this layer.
 *
 * @return {lanyard.LevelSet} the created level set.
 */
lanyard.layers.earth.PoliticalBoundariesLayer.prototype.makeLevels = function() {
    /** @type {Object} */
    var params = {};

    params.tileWidth = 512;
    params.tileHeight = 512;
    params.cacheName = 'Earth/PoliticalBoundaries';
    params.service = 'http://worldwind21.arc.nasa.gov/geoserver/wms';
    params.datasetName = 'topp:cia';
    params.formatSuffix = '.png';
    params.numLevels = 13;
    params.numEmptyLevels = 0;
    params.levelZeroTileDelta = new lanyard.geom.LatLon(
        lanyard.geom.Angle.prototype.fromDegrees(36.0),
        lanyard.geom.Angle.prototype.fromDegrees(36.0)
    );
    params.sector = lanyard.geom.Sector.prototype.FULL_SPHERE;
    params.tileUrlBuilder = function(tile) {
        var urlString = tile.getLevel().getService();

        if (urlString[urlString.length - 1] !== '?') {
            urlString.concat('?');
        }

        urlString.concat('request=GetMap');
        urlString.concat('&layers=');
        urlString.concat(tile.getLevel().getDataset());
        urlString.concat('&srs=EPSG:4326');
        urlString.concat('&width=');
        urlString.concat(tile.getLevel().getTileWidth());
        urlString.concat('&height=');
        urlString.concat(tile.getLevel().getTileHeight());

        /** @type {lanyard.geom.Sector} */
        var s = tile.getSector();

        urlString.concat('&bbox=');
        urlString.concat(s.getMinLongitude().getDegrees());
        urlString.concat(',');
        urlString.concat(s.getMinLatitude().getDegrees());
        urlString.concat(',');
        urlString.concat(s.getMaxLongitude().getDegrees());
        urlString.concat(',');
        urlString.concat(s.getMaxLatitude().getDegrees());

        urlString.concat('&format=image/png');
        urlString.concat('&styles=countryboundaries');
        // urlString.concat("&bgcolor=0x000000");
        urlString.concat('&transparent=true');

        return urlString;
    };

    return new lanyard.LevelSet(params);
};

/**
 * Create a string representation of this layer.
 *
 * @return {string} a string representation of this layer.
 */
lanyard.layers.earth.PoliticalBoundariesLayer.prototype.toString = function() {
    return 'A political boundaries layer for earth.';
};

/* EOF */
