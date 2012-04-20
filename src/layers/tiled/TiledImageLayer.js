/*global goog, lanyard, Image, window */

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

goog.provide('lanyard.layers.tiled.TiledImageLayer');

goog.require('lanyard.LevelSet');
goog.require('lanyard.Tile');
goog.require('lanyard.layers.AbstractLayer');
goog.require('lanyard.layers.tiled.LevelComparer');
goog.require('lanyard.layers.tiled.TextureTile');
goog.require('lanyard.util.TextRenderer');



/**
 * Creates a new tiled image layer with the specified level set.
 *
 * @constructor
 * @extends {lanyard.layers.AbstractLayer}
 * @param {lanyard.LevelSet} levelSet the level set to use for this layer.
 */
lanyard.layers.tiled.TiledImageLayer = function(levelSet) {
  lanyard.layers.AbstractLayer.call(this);

  this._logger = goog.debug.Logger.getLogger('lanyard.layers.TiledImageLayer');

  // Infrastructure

  /** @type {lanyard.layers.tiled.LevelComparer} */
  this.levelComparer = new lanyard.layers.tiled.LevelComparer();

  /** @type {lanyard.LevelSet} */
  this.levels = null;

  /** @type {Array.<lanyard.layers.tiled.TextureTile>} */
  this.topLevels = [];

  /** @type {boolean} */
  this.forceLevelZeroLoads = false;

  /** @type {boolean} */
  this.retainLevelZeroTiles = false;

  // Diagnostic flags

  /** @type {boolean} */
  this.showImageTileOutlines = false;

  /** @type {boolean} */
  this.drawTileBoundaries = false;

  /** @type {boolean} */
  this.drawWireframe = false;

  /** @type {boolean} */
  this.useTransparentTextures = false;

  /** @type {boolean} */
  this.drawTileIDs = false;

  /** @type {boolean} */
  this._drawBoundingVolumes = false;

  /** @type {lanyard.util.TextRenderer} */
  this.textRenderer = null;

  // Stuff computed each frame

  /** @type {Array.<lanyard.layers.tiled.TextureTile>} */
  this.currentTiles = [];

  /** @type {lanyard.layers.tiles.TextureTile} */
  this.currentResourceTile = null;

  /** @type {lanyard.geom.Point} */
  this.referencePoint = null;

  /** @type {lanyard.util.PriorityQueue} */
  this.requestQ = new lanyard.util.PriorityQueue();

  if (!levelSet) {
    this._logger.severe('Attempted to create a tiled image layer without a valid level set.');
  }

  // The caller's level set may change, so lets copy it.
  this.levels = new lanyard.LevelSet(levelSet);

  this.createTopLevelTiles();

  if (this.forceLevelZeroLoads) {
    this.loadAllTopLevelTextures();
  }

  // Textures are assumed to be terrain unless specifically indicated otherwise.
  //this.setPickEnabled(false);
};


/**
 * Check if this layer is using transparent textures.
 *
 * @return {boolean} true if transparent textures are being used, false otherwise.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isUseTransparentTextures = function() {
  return this.useTransparentTextures;
};


/**
 * Set if this layer should use transparent textures.
 *
 * @param {boolean} useTransparentTextures if this layer should use transparent textures or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.setUseTransparentTextures = function(useTransparentTextures) {
  this.useTransparentTextures = useTransparentTextures;
};


/**
 * Determine if this layer is forcing zero level loads.
 *
 * @return {boolean} true if zero level loads are being forced, false otherwise.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isForceLevelZeroLoads = function() {
  return this.forceLevelZeroLoads;
};


/**
 * Set force loading zero levels.
 *
 * @param {boolean} forceLevelZeroLoads set if we should be forcing zero level loads.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.setForceLevelZeroLoads = function(forceLevelZeroLoads) {
  this.forceLevelZeroLoads = forceLevelZeroLoads;

  if (this.forceLevelZeroLoads) {
    this.loadAllTopLevelTextures();
  }
};


/**
 * Determine if we retain zero level tiles.
 *
 * @return {boolean} true if retained, false otherwise.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isRetainLevelZeroTiles = function() {
  return this.retainLevelZeroTiles;
};


/**
 * Set if we should retain zero level tiles.
 *
 * @param {boolean} retainLevelZeroTiles true if we should retain, false otherwise.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.setRetainLevelZeroTiles = function(retainLevelZeroTiles) {
  this.retainLevelZeroTiles = retainLevelZeroTiles;
};


/**
 * Determine if we should draw the tile IDs.
 *
 * @return {boolean} if we should draw the tile IDs or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isDrawTileIDs = function() {
  return this.drawTileIDs;
};


/**
 * Set if we should draw the tile IDs or not.
 *
 * @param {boolean} drawTileIDs if we should draw the tile IDs or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.setDrawTileIDs = function(drawTileIDs) {
  this.drawTileIDs = drawTileIDs;
};


/**
 * Should we draw the tile boundaries.
 *
 * @return {boolean} if the tile boundaries should be drawn.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isDrawTileBoundaries = function() {
  return this.drawTileBoundaries;
};


/**
 * Set if we should draw the tile boundaries.
 *
 * @param {boolean} drawTileBoundaries if the tile boundaries should be drawn.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.setDrawTileBoundaries = function(drawTileBoundaries) {
  this.drawTileBoundaries = drawTileBoundaries;
};


/**
 * Should be draw the wireframe or not.
 *
 * @return {boolean} if the wireframe should be drawn or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isDrawWireframe = function() {
  return this.drawWireframe;
};


/**
 * Set if we should draw the wireframe or not.
 *
 * @param {boolean} drawWireframe if we should draw the wireframe or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.setDrawWireframe = function(drawWireframe) {
  this.drawWireframe = drawWireframe;
};


/**
 * Check if we should show the image tile outlines or not.
 *
 * @return {boolean} if we should show the tile outlines or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isShowImageTileOutlines = function() {
  return this.showImageTileOutlines;
};


/**
 * Set if we should show the image tile outlines or not.
 *
 * @param {boolean} showImageTileOutlines if we should show the image tile outlines.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.setShowImageTileOutlines = function(showImageTileOutlines) {
  this.showImageTileOutlines = showImageTileOutlines;
};


/**
 * Should be draw the bounding volumes.
 *
 * @return {boolean} if we should draw the bounding volumes or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isDrawBoundingVolumes = function() {
  return this._drawBoundingVolumes;
};


/**
 * Set if we should draw the bounding volumes or not.
 *
 * @param {boolean} drawBoundingVolumes if we should draw the bounding volumes or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.setDrawBoundingVolumes = function(drawBoundingVolumes) {
  this._drawBoundingVolumes = drawBoundingVolumes;
};


/**
 * Create the top level tiles.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.createTopLevelTiles = function() {
  /** @type {lanyard.geom.Sector} */
  var sector = this.levels.getSector();

  /** @type {lanyard.geom.Angle} */
  var dLat = this.levels.getLevelZeroTileDelta().getLatitude();

  /** @type {lanyard.geom.Angle} */
  var dLon = this.levels.getLevelZeroTileDelta().getLongitude();

  // Determine the row and column offset from the common global tiling origin.

  /** @type {lanyard.Level} */
  var level = this.levels.getFirstLevel();

  /** @type {number} */
  var firstRow = lanyard.Tile.prototype.computeRow(
      level.getTileDelta().getLatitude(), sector.getMinLatitude());

  /** @type {number} */
  var firstCol = lanyard.Tile.prototype.computeColumn(
      level.getTileDelta().getLongitude(), sector.getMinLongitude());

  /** @type {number} */
  var lastRow = lanyard.Tile.prototype.computeRow(
      level.getTileDelta().getLatitude(), sector.getMaxLatitude());

  /** @type {number} */
  var lastCol = lanyard.Tile.prototype.computeColumn(
      level.getTileDelta().getLongitude(), sector.getMaxLongitude());

  /** @type {number} */
  var nLatTiles = lastRow - firstRow + 1;

  /** @type {number} */
  var nLonTiles = lastCol - firstCol + 1;

  /** @type {Array.<lanyard.layers.tiled.TextureTile>} */
  this.topLevels = [];

  /** @type {lanyard.geom.Angle} */
  var p1 = lanyard.Tile.prototype.computeRowLatitude(firstRow, dLat);

  for (var row = firstRow; row <= lastRow; row = row + 1) {
    /** @type {lanyard.geom.Angle} */
    var p2 = p1.add(dLat);

    /** @type {lanyard.geom.Angle} */
    var t1 = lanyard.Tile.prototype.computeColumnLongitude(firstCol, dLon);

    for (var col = firstCol; col <= lastCol; col = col + 1) {
      /** @type {lanyard.geom.Angle} */
      var t2 = t1.add(dLon);

      this.topLevels.push(
          new lanyard.layers.tiled.TextureTile(
          new lanyard.geom.Sector(p1, p2, t1, t2),
          level, row, col
          )
      );

      t1 = t2;
    }
    p1 = p2;
  }
};


/**
 * Load all top level tiles.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.loadAllTopLevelTextures = function() {
  for (var i = 0; i < this.topLevels - 1; i = 1 + 1) {
    if (this.topLevels[i].holdsTexture()) {
      this.forceTextureLoad(this.topLevels[i]);
    }
  }
};


/**
 * Assemble the tiles.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.assembleTiles = function(dc) {
  // clear
  this.currentTiles = [];

  for (var i = 0; i < this.topLevels.length - 1; i = i + 1) {
    /** @type {lanyard.layers.tiled.TextureTile} */
    var tile = this.topLevels[i];

    if (this.isTileVisible(dc, tile)) {
      this.currentResourceTile = null;
      this.addTileOrDescendants(dc, tile);
    }
  }
};


/**
 * Add tile or decendants.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.layers.tiled.TextureTile} tile the texture tile.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.addTileOrDescendants = function(dc, tile) {
  if (this.meetsRenderCriteria(dc, tile)) {
    this.addTile(dc, tile);
    return;
  }

  // The incoming tile does not meet the rendering criteria, so it must be subdivided and those
  // subdivisions tested against the criteria.

  // All tiles that meet the selection criteria are drawn, but some of those tiles will not have
  // textures associated with them either because their texture isn't loaded yet or because they
  // are finer grain than the layer has textures for. In these cases the tiles use the texture of
  // the closest ancestor that has a texture loaded. This ancestor is called the currentResourceTile.
  // A texture transform is applied during rendering to align the sector's texture coordinates with the
  // appropriate region of the ancestor's texture.

  /** @type {?lanyard.layers.tiled.TextureTile} */
  var ancestorResource = null;

  if (tile.holdsTexture() || tile.getLevelNumber() === 0) {
    ancestorResource = this.currentResourceTile;
    this.currentResourceTile = tile;
  }

  // Ensure that levels finer than the finest image have the finest image around
  // TODO: find finest level with a non-missing tile
  if (this.levels.isFinalLevel(tile.getLevelNumber()) && !this.isTextureInMemory(tile)) {
    this.requestTexture(dc, tile);
  }

  /** @type {Array.<lanyard.layers.tiled.TextureTile>} */
  var subTiles = tile.createSubTiles(this.levels.getLevel(tile.getLevelNumber() + 1));

  for (var i = 0; i < subTiles.length - 1; i = i + 1) {
    if (this.isTileVisible(dc, subTiles[i])) {
      this.addTileOrDescendants(dc, subTiles[i]);
    }
  }

  // Pop this tile as the currentResource ancestor
  if (ancestorResource) {
    this.currentResourceTile = ancestorResource;
  }
};


/**
 * Add a tile to this layer.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.layers.tiled.TextureTile} tile the tile to add.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.addTile = function(dc, tile) {
  tile.setFallbackTile(null);

  if (tile.holdsTexture()) {
    this.addTileToCurrent(tile);
    return;
  }

  // Level 0 loads may be forced
  if (tile.getLevelNumber() === 0 && this.forceLevelZeroLoads) {
    this.forceTextureLoad(tile);
    if (tile.holdsTexture()) {
      this.addTileToCurrent(tile);
      return;
    }
  }

  // Tile's texture isn't available, so request it
  if (tile.getLevelNumber() < this.levels.getNumLevels()) {
    // Request only tiles with data associated at this level
    if (!this.levels.isResourceAbsent(tile)) {
      this.requestTexture(dc, tile);
    }
  }

  // Set up to use the currentResource tile's texture
  if (this.currentResourceTile) {
    if (this.currentResourceTile.getLevelNumber() === 0 && this.forceLevelZeroLoads &&
        !this.currentResourceTile.holdsTexture()) {
      this.forceTextureLoad(this.currentResourceTile);
    }

    if (this.currentResourceTile.holdsTexture()) {
      tile.setFallbackTile(this.currentResourceTile);
      this.addTileToCurrent(tile);
    }
  }
};


/**
 * Add a tile to the current tiled.
 *
 * @param {lanyard.layers.tiled.TextureTile} tile the tile to add.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.addTileToCurrent = function(tile) {
  this.currentTiles.push(tile);
};


/**
 * Check if a tile is visible.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.layers.tiled.TextureTile} tile the texture tile.
 * @return {boolean} if the tile is visible or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isTileVisible = function(dc, tile) {
  /** @type {boolean} */
  var ret = tile.getExtent(dc).intersectsFrustum(
      dc.getView().getFrustumInModelCoordinates()
      ) && (!dc.getVisibleSector() || dc.getVisibleSector().intersects(
            tile.getSector()
      )
      );

  return ret;
};


/**
 * Check if the specified tile meets the render criteria.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.layers.tiled.TextureTile} tile the texture tile.
 * @return {boolean} true if the tile meets the render criteria, false otherwise.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.meetsRenderCriteria = function(dc, tile) {
  return this.levels.isFinalLevel(tile.getLevelNumber()) || !this.needToSplit(dc, tile.getSector(), 20);
};


/**
 * Determine if we need to split the current tile or not.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.geom.Sector} sector the current sector.
 * @param {number} density the density to use.
 * @return {boolean} if this tile needs to be split or not.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.needToSplit = function(dc, sector, density) {

  /** @type {Array.<lanyard.geom.Point>} */
  var corners = sector.computeCornerPoints(dc.getGlobe());

  /** @type {lanyard.geom.Point} */
  var centerPoint = sector.computeCenterPoint(dc.getGlobe());

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
  var cellSize = (Math.PI * sector.getDeltaLatRadians() * dc.getGlobe().getRadius()) / density;

  /** @type {boolean} */
  var doesNeedToSplit = (Math.log(cellSize) / Math.log(10) <= (Math.log(minDistance) / Math.log(10) - 1));

  return !doesNeedToSplit;
};


/**
 * Do the actual render.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.doRender = function(dc) {
  if (!dc.getSurfaceGeometry() || dc.getSurfaceGeometry().length() < 1) {
    this._logger.severe('Attempted to render without valid surface geometry.');
    return;
  }

  dc.getSurfaceTileRenderer().setShowImageTileOutlines(this.showImageTileOutlines);
  this.draw(dc);
};


/**
 * Draw the layer
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.draw = function(dc) {
  if (!this.isEnabled()) {
    return; // Don't check for arg errors if we're disabled
  }

  if (!this.isLayerActive(dc)) {
    return;
  }

  if (!this.isLayerInView(dc)) {
    return;
  }

  this.referencePoint = this.computeReferencePoint(dc);

  this.assembleTiles(dc); // Determine the tiles to draw.

  if (this.currentTiles.length > 0) {
    /** @type {Array.<lanyard.layers.tiled.TextureTile>} */
    var sortedTiles = this.currentTiles;
    sortedTiles.sort(lanyard.layers.tiled.LevelComparer.prototype.compare);

    //dc.getGL().glPushAttrib(GL.GL_COLOR_BUFFER_BIT | GL.GL_POLYGON_BIT);

    if (this.isUseTransparentTextures()) {
      dc.getGL().enable(dc.getGL().BLEND);
      //gl.glBlendFunc(GL.GL_SRC_ALPHA, GL.GL_ONE_MINUS_SRC_ALPHA);
    }

    //gl.glPolygonMode(GL.GL_FRONT, GL.GL_FILL);
    dc.getGL().enable(dc.getGL().CULL_FACE);
    //dc.getGL().glCullFace(GL.GL_BACK);

    this._logger.info(this.getName() + ' ' + this.currentTiles.length);

    dc.getSurfaceTileRenderer().renderTiles(dc, this.currentTiles);

    //gl.glPopAttrib();

    if (this.drawTileIDs) {
      this.drawTileIDs(dc, this.currentTiles);
    }

    if (this._drawBoundingVolumes) {
      this.drawBoundingVolumes(dc, this.currentTiles);
    }

    this.currentTiles = [];
  }

  this.sendRequests();
  this.requestQ.clear();
};


/**
 * Send the requests to get the tiles.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.sendRequests = function() {
  /** @type {Function} */
  var task = (/** @type {Function} */ this.requestQ.poll());

  while (task) {
    window.setTimeout(task, 50);
    task = (/** @type {Function} */ this.requestQ.poll());
  }
};


/**
 * Check if the layer is in view.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {boolean} true if the layer is in view, false otherwise.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isLayerInView = function(dc) {
  if (!dc) {
    this._logger.severe('Attempted to check the visibility of the layer without a valid draw context.');
  }

  if (!dc.getView()) {
    this._logger.severe('Attempted to check the visibility of the layer without a valid view.');
  }

  if (dc.getVisibleSector() && !this.levels.getSector().intersects(dc.getVisibleSector())) {
    return false;
  }

  /** @type {lanyard.geom.Extent} */
  var e = lanyard.geom.Sector.prototype.computeBoundingCylinder(
      dc.getGlobe(), dc.getVerticalExaggeration(), this.levels.getSector()
      );

  return e.intersectsFrustum(dc.getView().getFrustumInModelCoordinates());
};


/**
 * Compute the reference point for this layer.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @return {lanyard.geom.Point} the calculated reference point.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.computeReferencePoint = function(dc) {
  /** @type {lanyard.util.Rectangle} */
  var viewport = dc.getView().getViewport();

  /** @type {number} */
  var x = viewport.getWidth() / 2;

  for (var y = (0.75 * viewport.getHeight()); y >= 0; y = y - 1) {
    /** @type {lanyard.geom.Position} */
    var pos = dc.getView().computePositionFromScreenPoint(x, y);

    if (!pos) {
      continue;
    }

    return dc.getGlobe().computePointFromPositionAngles(pos.getLatitude(), pos.getLongitude(), 0.0);
  }

  return null;
};


/**
 * Draw the tiles ids.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {Array.<lanyard.layers.tiled.TextureTile>} tiles the texture tiles.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.drawTileIDs = function(dc, tiles) {
  /** @type {lanyard.util.Rectangle} */
  var viewport = dc.getView().getViewport();

  if (!this.textRenderer) {
    this.textRenderer = new lanyard.util.TextRenderer('13pt Arial', dc);
  }

  dc.getGL().disable(dc.getGL().DEPTH_TEST);
  dc.getGL().disable(dc.getGL().BLEND);
  dc.getGL().disable(dc.getGL().TEXTURE_2D);

  this.textRenderer.setColor(lanyard.util.Color.prototype.YELLOW);
  this.textRenderer.beginRendering();

  for (var i = 0; i < tiles.length; i = i + 1) {
    /** @type {string} */
    var tileLabel = tiles[i].getLabel();

    if (tiles[i].getFallbackTile()) {
      tileLabel += '/' + tiles[i].getFallbackTile().getLabel();
    }

    /** @type {lanyard.geom.LatLon} */
    var ll = tiles[i].getSector().getCentroid();

    /** @type {lanyard.geom.Point} */
    var pt = dc.getView().project(
        dc.getGlobe().computePointFromPositionAngles(
        ll.getLatitude(), ll.getLongitude(),
        dc.getGlobe().getElevation(
        ll.getLatitude(), ll.getLongitude()
        )
        )
        );

    this.textRenderer.draw(tileLabel, pt.getX(), pt.getY());
  }

  this.textRenderer.endRendering();
};


/**
 * Draw the bounding volumes of the layer.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {Array.<lanyard.layers.tiled.TextureTile>} tiles the texture tiles.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.drawBoundingVolumes = function(dc, tiles) {
  for (var i = 0; i < tiles.length; i = i + 1) {
    tiles[i].getExtent(dc).render(dc);
  }
};


/**
 * Add the texture to the request queue based on the distance to the centroid.
 *
 * @param {lanyard.DrawContext} dc the current draw context.
 * @param {lanyard.layers.tiled.TextureTile} tile the tile data to request.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.requestTexture = function(dc, tile) {
  /** @type {lanyard.geom.Point} */
  var centroid = tile.getCentroidPoint(dc.getGlobe());

  if (this.referencePoint) {
    tile.setPriority(centroid.distanceTo(this.referencePoint));
  }

  /** @type {lanyard.layers.tiled.TiledImageLayer} */
  var self = this;

  /** @type {function} */
  var task = function() {
    if (!tile.textureData) {
      tile.textureData = new Image();
      tile.textureData.src = tile.getResourceURL();
      tile.textureData.onload = function() {
        //dc.getCanvas().display();
      };
    }
    // FIXME: On a load failure, call self.levels.markResourceAbsent(tile);
  };

  this.requestQ.offer(task);
};


/**
 * Force a texture load.
 *
 * @param {lanyard.layers.tiled.TextureTile} tile the tile to load.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.forceTextureLoad = function(tile) {
  if (tile.textureData) {
    this._logger.fine('Attempted to force load a texture that was already loaded.');
  } else {
    this.loadTexture(tile, tile.getPath());
  }
};


/**
 * Load a texture.
 *
 * @param {lanyard.layers.tiled.TextureTile} tile the texture tile to load.
 * @param {string} textureURL the texture url.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.loadTexture = function(tile, textureURL) {
  var self = this;

  tile.textureData = new Image();
  tile.src = textureURL;

  tile.onload = function() {
    self._logger.fine('A texture was loaded from: ' + textureURL);
  };
};


/**
 * Check if a texture is in memory.
 *
 * @param {lanyard.layers.tiled.TextureTile} tile the tile to check.
 * @return {boolean} true if the tile is in memory, false otherwise.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.isTextureInMemory = function(tile) {
  return (tile.getLevelNumber() === 0 && tile.holdsTexture());
};


/**
 * Get the containing child tile.
 *
 * @param {lanyard.layers.tiled.TextureTile} tile the texture tile.
 * @param {lanyard.geom.Angle} latitude the latitude of the location.
 * @param {lanyard.geom.Angle} longitude the longitude of the location.
 * @param {number} levelNumber the level number.
 * @return {lanyard.layers.tiled.TextureTile} the child tile.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.getContainingTile =
    function(tile, latitude, longitude, levelNumber) {

  if (!tile.getSector().contains(latitude, longitude)) {
    return null;
  }

  if (tile.getLevelNumber() === levelNumber || this.levels.isFinalLevel(tile.getLevelNumber())) {
    return tile;
  }

  /** @type {lanyard.layers.tiled.TextureTile} */
  var containingTile;

  /** @type {Array.<lanyard.layers.tiled.TextureTile>} */
  var subTiles = tile.createSubTiles(this.levels.getLevel(tile.getLevelNumber() + 1));

  for (var i = 0; i < subTiles.length; i = i + 1) {
    containingTile = this.getContainingTile(subTiles[i], latitude, longitude, levelNumber);
    if (containingTile) {
      return containingTile;
    }
  }

  return null;
};


/**
 * Create a string representation of this layer.
 *
 * @return {string} a string representation of this layer.
 */
lanyard.layers.tiled.TiledImageLayer.prototype.toString = function() {
  return 'A tiled image layer.';
};

/* EOF */
