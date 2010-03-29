/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.SectorGeometryList');

/**
 * A list of sector geometries.
 *
 * @constructor
 */
lanyard.SectorGeometryList = function () {
    /**
     * @private
     * @type {lanyard.PickSupport}
     */ 
    this._pickSupport = new lanyard.PickSupport();       

    /**
     * @private
     * @type {Array.<SectorGeometry>}
     */
    this._geometryList = [];
};

/**
 * Get a list of the intersecting sectors.
 *
 * @param {lanyard.geom.Sector} sector the sector to check for intersection with.
 * @return {Array.<SectorGeometry>} the array of sector geometries.
 */
lanyard.SectorGeometryList.prototype.getIntersectingSectors = function (sector) {

    /** @type {Array.<SectorGeometry>} */
    var list = [];

    /** @type {number} */
    var i;
    for(i = 0; i < this._geometryList.length; i = i + 1) {
        if (this._geometryList[i].getSector().intersects(sector)) {
            list.push(this._geometryList[i]);
        } else {
            // this._logger.fine("no intersection");
        }
    }

    return list;
};

/**
 * Perform picking.
 *
 * @param {lanyard.geom.DrawContext} dc the draw context.
 * @param {lanyard.util.Point} the picking point.
 */
lanyard.SectorGeometryList.prototype.pick = function (dc, pickPoint) {

    this._pickSupport.clearPickList();
    this._pickSupport.beginPicking(dc);

    var gl = dc.getGL();
    gl.glPushAttrib(gl.GL_LIGHTING_BIT);
    gl.glPushAttrib(gl.GL_DEPTH_BUFFER_BIT);
    gl.glPushAttrib(gl.GL_ENABLE_BIT);
    gl.glPushAttrib(gl.GL_CURRENT_BIT);
    gl.glEnable(gl.GL_DEPTH_TEST);
    gl.glShadeModel(gl.GL_FLAT);
    gl.glDisable(gl.GL_CULL_FACE);

    try {
        // render each sector in unique color

        /** @type {number} */
        var i;
        for(i = 0; i < this._geometryList.length; i = i + 1) {

            /** @type {lanyard.util.Color} */
            var color = dc.getUniquePickColor();

            dc.getGL().glColor3ub(
                color.getRed(),
                color.getGreen(),
                color.getBlue()
            );
            this._geometryList[i].render(dc);

            // lat/lon/elevation not used in this case
            this.pickSupport.addPickableObject(
                color.getRGB(),
                this._geometryList[i],
                lanyard.geom.Position.prototype.ZERO,
                true
            );
        }

        /** @type {lanyard.PickedObject} */
        var pickedSector = this._pickSupport.getTopObject(dc, pickPoint, null);
        if (!pickedSector || !pickedSector.getObject()) {
            return; // no sector picked
        }

        /** @type {lanyard.SectorGeometry} */
        var sector = pickedSector.getObject();
        gl.glDepthFunc(gl.GL_LEQUAL);
        sector.pick(dc, pickPoint);

    } finally {
        gl.glPopAttrib();
        this._pickSupport.endPicking(dc);
        this._pickSupport.clearPickList();
    }
};

/**
 * Get a surface point at a position.
 *
 * @param {lanyard.geom.Angle} latitude the latitude of the position.
 * @param {lanyard.geom.Angle} longitude the longitude of the position.
 * @param {number} metersOffset the meters offset.
 * @return {lanyard.geom.Point} the surface point.
 */
lanyard.SectorGeometryList.prototype.getSurfacePoint = function (latitude, longitude, metersOffset) {

    /** @type {number} */
    var i;
    for(i = 0; i < this._geometryList.length; i = i + 1) {
        if (this._geometryList[i].getSector().contains(latitude, longitude)) {
            /** @type {lanyard.geom.Point} */
            var point = this._geometryList[i].getSurfacePoint(latitude, longitude, metersOffset);
            if (point) {
                return point;
            }
       }
    }

    return null;
};

/* EOF */
