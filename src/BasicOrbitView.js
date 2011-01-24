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

goog.provide('lanyard.BasicOrbitView');

goog.require('lanyard.Globe');
goog.require('lanyard.geom.ViewFrustum');
goog.require('lanyard.util.GLU');
goog.require('lanyard.util.Stack');

/**
 * A basic orbit view implementation.
 *
 * @constructor
 * @implements {lanyard.View}
 */
lanyard.BasicOrbitView = function() {
    /**
     * @private
     */
    this._logger = goog.debug.Logger.getLogger('lanyard.BasicOrbitView');

    // Setup defaults.

    /**
     * @private
     * @type {number}
     */
    this.DefaultLatitude = 0.0;

    /**
     * @private
     * @type {number}
     */
    this.DefaultLongitude = (180.0 * (new Date()).getTimezoneOffset() / (12.0 * 3.6e6));

    /**
     * @private
     * @type {number}
     */
    this.DefaultZoom = 6000000.0;

    /**
     * @private
     * @type {number}
     */
    this.DefaultMinZoom = 0.0;

    /**
     * @private
     * @type {number}
     */
    this.DefaultMaxZoom = +Infinity;

    /**
     * @private
     * @type {boolean}
     */
    this.DefaultEnableZoomConstraint = true;

    /**
     * @private
     * @type {number}
     */
    this.DefaultHeading = 0.0;

    /**
     * @private
     * @type {number}
     */
    this.DefaultPitch = 0.0;

    /**
     * @private
     * @type {number}
     */
    this.DefaultMinPitch = 0.0;

    /**
     * @private
     * @type {number}
     */
    this.DefaultMaxPitch = 90.0;

    /**
     * @private
     * @type {boolean}
     */
    this.DefaultEnablePitchConstraint = true;

    /**
     * @private
     * @type {number}
     */
    this.DefaultFov = 45.0;

    // Current OpenGL viewing state.

    /**
     * @private
     * @type {?lanyard.geom.MatrixFour}
     */
    this.modelView = null;

    /**
     * @private
     * @type {?lanyard.geom.MatrixFour}
     */
    this.projection = null;

    /**
     * @private
     * @type {?lanyard.util.Rectangle}
     */
    this.viewport = null;

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.fieldOfView = lanyard.geom.Angle.prototype.fromDegrees(this.DefaultFov);

    // Current DrawContext state.

    /**
     * @private
     * @type {?lanyard.Globe}
     */
    this.globe = null;

    /**
     * @private
     * @type {number}
     */
    this.verticalExaggeration = -1;

    // Cached viewing attribute computations.

    /**
     * @private
     * @type {?lanyard.geom.Point}
     */
    this.eye = null;

    /**
     * @private
     * @type {?lanyard.geom.Point}
     */
    this.up = null;

    /**
     * @private
     * @type {?lanyard.geom.Point}
     */
    this.forward = null;

    /**
     * @private
     * @type {?lanyard.geom.Frustum}
     */
    this.frustumInModelCoords = null;

    /**
     * @private
     * @type {number}
     */
    this.pixelSizeScale = -1;

    /**
     * @private
     * @type {number}
     */
    this.horizonDistance = -1;

    // Temporary state.

    /**
     * @private
     * @type {Array.<number>}
     */
    this.matrixMode = [];

    /**
     * @private
     * @type {Array.<number>}
     */
    this.viewportArray = [];

    // Geographic coordinate data.

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.focusLat = lanyard.geom.Angle.prototype.fromDegrees(0);

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.focusLon =
        lanyard.geom.Angle.prototype.fromDegrees(
            (180.0 * (new Date()).getTimezoneOffset() / (12.0 * 3.6e6))
        );

    /**
     * @private
     * @type {number}
     */
    this.eyeDist = this.DefaultZoom;

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.heading = lanyard.geom.Angle.prototype.fromDegrees(0);

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.pitch = lanyard.geom.Angle.prototype.fromDegrees(0);

    /**
     * @private
     * @type {number}
     */
    this.altitude = 0;

    // Coordinate constraints.

    /**
     * @private
     * @type {number}
     */
    this.minEyeDist = this.DefaultMinZoom;

    /**
     * @private
     * @type {number}
     */
    this.maxEyeDist = this.DefaultMaxZoom;

    /**
     * @private
     * @type {boolean}
     */
    this.enableZoomConstraint = this.DefaultEnableZoomConstraint;

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.minPitch = lanyard.geom.Angle.prototype.fromDegrees(this.DefaultMinPitch);

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.maxPitch = lanyard.geom.Angle.prototype.fromDegrees(this.DefaultMaxPitch);

    /**
     * @private
     * @type {boolean}
     */
    this.enablePitchConstraint = this.DefaultEnablePitchConstraint;

    // Current OpenGL projection state.

    /**
     * @private
     * @type {?lanyard.geom.ViewFrustum}
     */
    this.viewFrustum = null;

    /**
     * @private
     * @type {number}
     */
    this.collisionRadius = 0;

    /**
     * @private
     * @type {boolean}
     */
    this.isInitialized = false;

    /**
     * @private
     * @type {lanyard.util.Stack}
     */
    this.modelViewStack = new lanyard.util.Stack();
};

/**
 * Apply the view state.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.BasicOrbitView.prototype.doApply = function(dc) {
    if (!this.isInitialized) {
        this.doInitialize(dc);
        this.isInitialized = true;
    }

    // Compute the current model-view matrix and view eye point.

    /** @type {lanyard.geom.MatrixFour} */
    var modelView = this.computeModelViewMatrix(dc);

    //this._logger.fine("Initial model-view matrix is: " + modelView.toString());

    /** @type {lanyard.geom.Point} */
    var eyePoint = modelView.getInverse().transform(new lanyard.geom.Point(0, 0, 0, 1));

    //this._logger.fine("Initial eye point is: " + eyePoint.toString());

    // Compute the current viewing frustum and projection matrix.
    this.viewFrustum = this.computeViewFrustum(dc, eyePoint);

    if (!this.viewFrustum) {
        this._logger.severe("We don't have a view frustum to generate the projection matrix.");
    }

    this.collisionRadius = this.computeCollisionRadius(this.viewFrustum);

    /** @type {lanyard.geom.MatrixFour} */
    var projection = this.viewFrustum.getProjectionMatrix();

    //this._logger.fine("Using model-view of: " + modelView.toString());
    //this._logger.fine("Using projection of: " + projection.toString());

    // Set current GL matrix state.
    this.applyMatrixState(dc, modelView, projection);
};

/**
 * Initialize this view.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.BasicOrbitView.prototype.doInitialize = function(dc) {
    /** @type {lanyard.Globe} */
    var globe = dc.getGlobe();

    // Set the coordinate constraints to default values.
    this.minEyeDist = this.collisionRadius = 1;

    if (globe) {
        this.maxEyeDist = 6 * globe.getRadius();
    } else {
        this.maxEyeDist = +Infinity;
    }

    // Set the eye distance to a default value.
    if (globe) {
        this.eyeDist = this.clampZoom(3 * globe.getRadius());
    }
};

/**
 * Compute the model-view matrix.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {lanyard.geom.MatrixFour} the model-view matrix.
 */
lanyard.BasicOrbitView.prototype.computeModelViewMatrix = function(dc) {
    /** @type {lanyard.Globe} */
    var globe = dc.getGlobe();

    if (!globe) {
        this._logger.severe('The globe was null when computing the model-view matrix.');
        return null;
    }

    /** @type {lanyard.geom.Position} */
    var focusPosition = new lanyard.geom.Position(
        this.focusLat, this.focusLon, 0
    );

    //this._logger.fine("Focus position is: " + focusPosition);

    /** @type {lanyard.geom.Point} */
    var focusPoint = globe.computePointFromPosition(focusPosition);

    //this._logger.fine("Focus point is: " + focusPoint);

    /** @type {lanyard.geom.MatrixFour} */
    var modelView = this.lookAt(
        this.focusLat, this.focusLon, focusPoint.length(),
        this.eyeDist, this.heading, this.pitch);

    //this._logger.fine("Lookat returned: " + modelView.toString());

    /** @type {lanyard.geom.Point} */
    var eye = modelView.getInverse().transform(new lanyard.geom.Point(0, 0, 0, 1));
    //this._logger.fine("Eye is: " + eye.toString());

    /** @type {lanyard.geom.Position} */
    var polarEye = globe.computePositionFromPoint(eye);

    /** @type {lanyard.geom.Point} */
    var surfacePoint = this.computeSurfacePoint(dc, polarEye.getLatitude(), polarEye.getLongitude());

    //this._logger.fine("Surface point is: " + surfacePoint);

    if (surfacePoint) {
        //this._logger.fine("Basing the view altitude on a surface point.");

        /** @type {number} */
        var distanceToSurface = eye.length() - this.collisionRadius - surfacePoint.length();

        //this._logger.fine("Distance from the eye to the surface is: " + distanceToSurface);

        if (distanceToSurface < 0) {
            this._logger.fine('Distance to surface was less than 0.');

            /** @type {lanyard.geom.Point} */
            var surfaceNormal = eye.normalize();

            /** @type {lanyard.geom.Point} */
            var newEye = lanyard.geom.Point.prototype.fromOriginAndDirection(
                eye.length() - distanceToSurface, surfaceNormal,
                lanyard.geom.Point.prototype.ZERO);

            /** @type {lanyard.geom.Point} */
            var forward = eye.subtract(focusPoint);

            /** @type {lanyard.geom.Point} */
            var newForward = newEye.subtract(focusPoint);

            /** @type {number} */
            var dot = forward.dot(newForward) / (forward.length() * newForward.length());

            if (dot >= -1 && dot <= 1) {
                /** @type {number} */
                var pitchChange = Math.acos(dot);

                this.pitch = this.clampPitch(
                    this.pitch.subtract(
                        lanyard.geom.Angle.prototype.fromRadians(pitchChange)
                    )
                );
                this.eyeDist = this.clampZoom(newForward.length());

                //this._logger.fine("Eye distance is: " + eyeDist);

                modelView = lanyard.BasicOrbitView.prototype.lookAt(
                    this.focusLat, this.focusLon, focusPoint.length(),
                    this.eyeDist, this.heading, this.pitch);
            }
        }
    }

    // Compute the current eye altitude above sea level (Globe radius).
    eye = modelView.getInverse().transform(new lanyard.geom.Point(0, 0, 0, 1));

    //this._logger.fine("Eye point computed to be: " + eye);

    polarEye = globe.computePositionFromPoint(eye);
    this.altitude = eye.length() - globe.getRadiusAt(polarEye.getLatitude(), polarEye.getLongitude());

    return modelView;
};

/**
 * Look at the specified point.
 *
 * @private
 * @param {lanyard.geom.Angle} focusX
 * @param {lanyard.geom.Angle} focusY
 * @param {number} focusDistance
 * @param {number} tiltDistance
 * @param {lanyard.geom.Angle} tiltZ
 * @param {lanyard.geom.Angle} tiltX
 * @return {lanyard.geom.MatrixFour}
 */
lanyard.BasicOrbitView.prototype.lookAt =
        function(focusX, focusY, focusDistance, tiltDistance, tiltZ, tiltX) {

    /** @type {lanyard.geom.MatrixFour} */
    var m = new lanyard.geom.MatrixFour(null); // identity

    // Translate model away from eye.
    m.translate(0, 0, -tiltDistance);

    // Apply tilt by rotating about X axis at pivot point.
    m.rotateX(tiltX.multiply(-1));
    m.rotateZ(tiltZ);
    m.translate(0, 0, -focusDistance);

    // Rotate model to lat/lon of eye point.
    m.rotateX(focusX);
    m.rotateY(focusY.multiply(-1));

    return m;
};

/**
 * Compute a surface point.
 *
 * @private
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.geom.Angle} lat the latitude.
 * @param {lanyard.geom.Angle} lon the longitude.
 * @return {lanyard.geom.Point} the new surface point.
 */
lanyard.BasicOrbitView.prototype.computeSurfacePoint = function(dc, lat, lon) {
    /** @type {lanyard.geom.Point} */
    var p = null;

    /** @type {lanyard.SectorGeometryList} */
    var geom = dc.getSurfaceGeometry();

    if (geom) {
        p = geom.getSurfacePoint(lat, lon, 0);
    }

    if (p) {
        return p;
    }

    /** @type {lanyard.Globe} */
    var globe = dc.getGlobe();

    if (globe) {
        /** @type {number} */
        var elevation = dc.getVerticalExaggeration() * globe.getElevation(lat, lon);
        p = globe.computePointFromPosition(
                new lanyard.geom.Position(lat, lon, elevation)
            );
    }

    return p;
};

/**
 * Get the current view frustum.
 *
 * @return {lanyard.geom.Frustum}
 */
lanyard.BasicOrbitView.prototype.getFrustum = function() {
    if (!this.viewFrustum) {
        this._logger.severe('Attempted to get a null frustum from the view.');
        return null;
    }

    return this.viewFrustum.getFrustum();
};

/**
 * Compute the view frustum.
 *
 * @private
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.geom.Point} eyePoint the eye point.
 * @return {lanyard.geom.ViewFrustum} the view frustum.
 */
lanyard.BasicOrbitView.prototype.computeViewFrustum = function(dc, eyePoint) {
    /** @type {lanyard.util.Rectangle} */
    var viewport = this.getViewport();

    if (!viewport) {
        this._logger.severe("We don't know anything about the viewport.");
        return null;
    }

    /** @type {lanyard.geom.Angle} */
    var fov = this.getFieldOfView();

    if (!fov) {
        this._logger.severe("We don't know anything about the field of view.");
        return null;
    }

    // Compute the most distant near clipping plane.

    /** @type {number} */
    var tanHalfFov = fov.tanHalfAngle();

    //this._logger.fine("Current altitude = " + this.altitude);

    /** @type {number} */

    // FIXME: near plane when trying to take altitude into account is insane.
    //var near = Math.max(10, this.altitude / (2 * Math.sqrt(2 * tanHalfFov * tanHalfFov + 1)));

    var near = 0.1;

    // Compute the closest allowable far clipping plane distance.

    /** @type {number} */
    var far = this.computeHorizonDistance(dc.getGlobe(), dc.getVerticalExaggeration(), eyePoint) * 2;

/**
    this._logger.fine("Creating a new view frustum with dimensions of: " +
        "fov = " + fov + ", " +
        "width = " + viewport.getWidth() + ", " +
        "height = " + viewport.getHeight() + ", " +
        "near = " + near + ", " +
        "far = " + far + ".");
**/

    // Compute the frustum from a standard perspective projection.
    return new lanyard.geom.ViewFrustum.prototype.fromHorizontalFieldOfView(
        fov, viewport.getWidth(), viewport.getHeight(), near, far);
};

/**
 * Compute the collision radius.
 *
 * @param {lanyard.geom.ViewFrustum} viewFrustum
 * @return {number} the collision radius.
 */
lanyard.BasicOrbitView.prototype.computeCollisionRadius = function(viewFrustum) {
    /** @type {lanyard.util.Rectangle} */
    var viewport = this.getViewport();

    /** @type {lanyard.geom.Angle} */
    var fov = this.getFieldOfView();

    if (!viewport || !fov || !viewFrustum ||
        !viewFrustum.getFrustum() || !viewFrustum.getFrustum().getNear()) {

        return 1;
    }

    /** @type {number} */
    var near = Math.abs(viewFrustum.getFrustum().getNear().getDistance());

    if (near === 0) {
        near = 1;
    }

    /** @type {number} */
    var tanHalfFov = fov.tanHalfAngle();

    // Compute the distance between the eye, and any corner on the near clipping rectangle.

    /** @type {number} */
    var clipRectX = near * tanHalfFov;

    /** @type {number} */
    var clipRectY = viewport.height * clipRectX / viewport.width;

    return 1 + Math.sqrt(clipRectX * clipRectX + clipRectY * clipRectY + near * near);
};

/**
 * Get current view position.
 *
 * @return {lanyard.geom.Position}
 */
lanyard.BasicOrbitView.prototype.getPosition = function() {
    return new lanyard.geom.Position(this.focusLat, this.focusLon, 0);
};

/**
 * Go to the specified latlon.
 *
 * @param {lanyard.geom.LatLon} newLatLon
 */
lanyard.BasicOrbitView.prototype.goToLatLon = function(newLatLon) {
    /** @type {lanyard.geom.LatLon} */
    var clampedLatLon = this.clampCoordinate(newLatLon);
    this.focusLat = clampedLatLon.getLatitude();
    this.focusLon = clampedLatLon.getLongitude();
};

/**
 * Get the current altitude.
 *
 * @return {number} the altitude.
 */
lanyard.BasicOrbitView.prototype.getAltitude = function() {
    return this.altitude;
};

/**
 * Go to the specified altitude.
 *
 * @param {number} newAltitude the new altitude.
 */
lanyard.BasicOrbitView.prototype.goToAltitude = function(newAltitude) {
    throw 'unsupported';
};

/**
 * Go to the specified coordinate.
 *
 * @param {lanyard.geom.LatLon} newLatLon
 * @param {number} newAltitude
 */
lanyard.BasicOrbitView.prototype.goToCoordinate = function(newLatLon, newAltitude) {
    throw 'unsupported';
};

/**
 * Clamp coordinate.
 *
 * @private
 * @param {lanyard.geom.LatLon} latLon
 * @return {lanyard.geom.LatLon}
 */
lanyard.BasicOrbitView.prototype.clampCoordinate = function(latLon) {
    /** @type {number} */
    var lat = latLon.getLatitude().getDegrees();
    //this._logger.fine("Before clamping, lat coord is: lat = " + lat + ".");

    if (lat < -90) {
        lat = -90;
    } else if (lat > 90) {
        lat = 90;
    }

    /** @type {number} */
    var lon = latLon.getLongitude().getDegrees();
    //this._logger.fine("Before clamping, lon coord is: lon = " + lon + ".");

    if (lon < -180) {
        lon = lon + 360;
    } else if (lon > 180) {
        lon = lon - 360;
    }

    //this._logger.fine("Clamping to: lat = " + lat + ", lon = " + lon + ".");

    return lanyard.geom.LatLon.prototype.fromDegrees(lat, lon);
};

/**
 * Get the heading.
 *
 * @return {lanyard.geom.Angle}
 */
lanyard.BasicOrbitView.prototype.getHeading = function() {
    return this.heading;
};

/**
 * Set the current heading.
 */
lanyard.BasicOrbitView.prototype.setHeading = function(newHeading) {
    this.heading = this.clampHeading(newHeading);
};

/**
 * Clamp the heading.
 *
 * @private
 * @param {lanyard.geom.Angle} heading
 * @return {lanyard.geom.Angle}
 */
lanyard.BasicOrbitView.prototype.clampHeading = function(heading) {
    /** @type {number} */
    var degrees = heading.getDegrees();

    if (degrees < 0) {
        degrees = degrees + 360;
    } else if (degrees > 360) {
        degrees = degrees - 360;
    }

    return lanyard.geom.Angle.prototype.fromDegrees(degrees);
};

/**
 * Get the current pitch.
 *
 * @return {lanyard.geom.Angle} the current pitch.
 */
lanyard.BasicOrbitView.prototype.getPitch = function() {
    return this.pitch;
};

/**
 * Get the current pitch.
 *
 * @param {lanyard.geom.Angle} newPitch the new pitch.
 */
lanyard.BasicOrbitView.prototype.setPitch = function(newPitch) {
    this.pitch = this.clampPitch(newPitch);
};

/**
 * Get pitch constraints.
 *
 * @return {Array.<lanyard.geom.Angle>} the pitch constraints.
 */
lanyard.BasicOrbitView.prototype.getPitchConstraints = function() {
    return [this.minPitch, this.maxPitch];
};

/**
 * Set the pitch constraints.
 *
 * @param {lanyard.geom.Angle} newMinPitch the new minimum pitch.
 * @param {lanyard.geom.Angle} newMaxPitch the new maximum pitch.
 */
lanyard.BasicOrbitView.prototype.setPitchConstraints = function(newMinPitch, newMaxPitch) {
    this.minPitch = newMinPitch;
    this.maxPitch = newMaxPitch;
};

/**
 * Check if pitch constraints are enabled.
 *
 * @return {boolean} true if the pitch constraints are enabled, false otherwise.
 */
lanyard.BasicOrbitView.prototype.isEnablePitchConstraints = function() {
    return this.enablePitchConstraint;
};

/**
 * Set if the pitch constraint is enabled.
 *
 * @param {boolean} enabled if the pitch constraint should be enabled or not.
 */
lanyard.BasicOrbitView.prototype.setEnablePitchConstraints = function(enabled) {
    this.enablePitchConstraint = enabled;
};

/**
 * Clamp the pitch angle.
 *
 * @private
 * @param {lanyard.geom.Angle} pitch the pitch angle.
 * @return {lanyard.geom.Angle} the current pitch angle.
 */
lanyard.BasicOrbitView.prototype.clampPitch = function(pitch) {
    /** @type {Array.<lanyard.geom.Angle>} */
    var constraints = this.getPitchConstraints();

    if (pitch.compareTo(constraints[0]) < 0) {
        this.pitch = constraints[0];
    } else if (pitch.compareTo(constraints[1]) > 0) {
        this.pitch = constraints[1];
    }

    this.pitch = pitch;
    return this.pitch;
};

/**
 * Get the roll.
 *
 * @return {lanyard.geom.Angle}
 */
lanyard.BasicOrbitView.prototype.getRoll = function() {
    return lanyard.geom.Angle.prototype.ZERO;
};

/**
 * Set the roll.
 *
 * @param {lanyard.geom.Angle} newRoll the new roll value.
 */
lanyard.BasicOrbitView.prototype.setRoll = function(newRoll) {
    // do nothing for now.
};

/**
 * Get the current zoom.
 *
 * @return {number} the current zoom.
 */
lanyard.BasicOrbitView.prototype.getZoom = function() {
    return this.eyeDist;
};

/**
 * Set the current zoom.
 *
 * @param {number} newZoom the new zoom.
 */
lanyard.BasicOrbitView.prototype.setZoom = function(newZoom) {
    //this._logger.fine("View setZoom was called with: " + newZoom);
    this.eyeDist = this.clampZoom(newZoom);
};

/**
 * Get the zoom constraints.
 *
 * @return {Array.<number>}
 */
lanyard.BasicOrbitView.prototype.getZoomConstraints = function() {
    return [Math.max(this.minEyeDist, this.collisionRadius), this.maxEyeDist];
};

/**
 * Set zoom constraints.
 *
 * @param {number} newMinZoom the new minimum zoom.
 * @param {number} newMaxZoom the new maximum zoom.
 */
lanyard.BasicOrbitView.prototype.setZoomConstraints = function(newMinZoom, newMaxZoom) {
    this.minEyeDist = newMinZoom;
    this.maxEyeDist = newMaxZoom;
};

/**
 * Check if zoom constraints are enabled.
 *
 * @return {boolean} true if zoom constraints are enabled, false otherwise.
 */
lanyard.BasicOrbitView.prototype.isEnableZoomConstraints = function() {
    return this.enableZoomConstraint;
};

/**
 * Set if zoom constraints should be enabled.
 *
 * @param {boolean} enabled
 */
lanyard.BasicOrbitView.prototype.setEnableZoomConstraints = function(enabled) {
    this.enableZoomConstraint = enabled;
};

/**
 * Clamp the zoom.
 *
 * @param {number} zoom the zoom value.
 * @return {number} the zoom value.
 */
lanyard.BasicOrbitView.prototype.clampZoom = function(zoom) {
    /** @type {number} */
    var x = zoom;

    /** @type {Array.<number>} */
    var constraints = this.getZoomConstraints();

    if (x < constraints[0]) {
        x = constraints[0];
    } else if (x > constraints[1]) {
        x = constraints[1];
    }

    return x;
};

/**
 * Compute the visible latlon range.
 *
 * @return {lanyard.geom.LatLon} the visible latlon range.
 */
lanyard.BasicOrbitView.prototype.computeVisibleLatLonRange = function() {
    return null;
};

/**
 * Unproject a window point.
 *
 * @param {lanyard.geom.Point} windowPoint the window point.
 */
lanyard.BasicOrbitView.prototype.unProject = function(windowPoint) {
    if(!windowPoint) {
        this._logger.severe("Attempted to unproject an invalid window point.");
    }

    if (!this.modelView || !this.projection || !this.viewport) {
        return null;
    }

    /** @type {Array.<number>} */
    var projectionMatrix = this.projection.getEntries();

    /** @type {Array.<number>} */
    var modelViewMatrix = this.modelView.getEntries();

    /** @type {Array.<number>} */
    var viewport = [this.viewport.getX(), this.viewport.getY(),
        this.viewport.getWidth(), this.viewport.getHeight()]

    /** @type {Array.<number>} */
    var modelPoint = [];

    if(lanyard.util.GLU.prototype.unProject(
            windowPoint.getX(), windowPoint.getY(), windowPoint.getZ(),
            modelViewMatrix, projectionMatrix, viewport, modelPoint)) {
        return new lanyard.geom.Point(modelPoint[0], modelPoint[1], modelPoint[2], 0.0);
    } else {
        return null;
    }
};

/**
 * Project a point.
 *
 * @param {lanyard.geom.Point} modelPoint
 * @return {lanyard.geom.Point} the projected point.
 */
lanyard.BasicOrbitView.prototype.project = function(modelPoint) {
    if (!this.modelView || !this.projection || !this.viewport) {
        return null;
    }

    /** @type {lanyard.geom.Point} */
    var eyeCoord = this.modelView.transform(
        new lanyard.geom.Point(modelPoint.getX(), modelPoint.getY(), modelPoint.getZ(), 1)
    );

    /** @type {lanyard.geom.Point} */
    var clipCoord = this.projection.transform(eyeCoord);

    if (clipCoord.getW() === 0) {
        return null;
    }

    /** @type {lanyard.geom.Point} */
    var normDeviceCoord = new lanyard.geom.Point(
        clipCoord.getX() / clipCoord.getW(),
        clipCoord.getY() / clipCoord.getW(),
        clipCoord.getZ() / clipCoord.getW(),
        0
    );

    return new lanyard.geom.Point(
        (normDeviceCoord.getX() + 1) * (this.viewport.getWidth() / 2) + this.viewport.getX(),
        (normDeviceCoord.getY() + 1) * (this.viewport.getHeight() / 2) + this.viewport.getY(),
        (normDeviceCoord.getZ() + 1) / 2,
        0);
};

/**
 * Compute the pixel size at a specified distance.
 *
 * @param {number} distance the specified distance.
 * @return {number} the pixel size.
 */
lanyard.BasicOrbitView.prototype.computePixelSizeAtDistance = function(distance) {
    if (this.pixelSizeScale < 0) {
        // Compute the current coefficient for computing the size of a pixel.
        if (this.fieldOfView && this.viewport.width > 0) {
            this.pixelSizeScale = 2 * this.fieldOfView.tanHalfAngle() / this.viewport.getWidth();
        } else if (this.viewport.getWidth() > 0) {
            this.pixelSizeScale = 1 / this.viewport.getWidth();
        }
    }

    if (this.pixelSizeScale < 0) {
        return -1;
    }

    return this.pixelSizeScale * Math.abs(distance);
};

/**
 * Compute the horizon distance.
 *
 * @return {number} the horizon distance.
 */
lanyard.BasicOrbitView.prototype.computeHorizonDistanceHere = function() {
    if (this.horizonDistance < 0) {
        this.horizonDistance = this.computeHorizonDistance(this.globe, this.verticalExaggeration,
            this.getEyePoint());
    }

    return this.horizonDistance;
};

/**
 * Compute ray from screen point.
 * TODO: this should be expressed in OpenGL screen coordinates, not toolkit coordinates.
 *
 * @param {number} x
 * @param {number} y
 * @return {lanyard.geom.Line} the ray.
 */
lanyard.BasicOrbitView.prototype.computeRayFromScreenPoint = function(x, y) {

    if (!this.viewport) {
        return null;
    }

    /** @type {number} */
    var yInv = this.viewport.getHeight() - y - 1; // TODO: should be computed by caller

    /** @type {lanyard.geom.Point} */
    var a = this.unProject(new lanyard.geom.Point(x, yInv, 0, 0));

    /** @type {lanyard.geom.Point} */
    var b = this.unProject(new lanyard.geom.Point(x, yInv, 1, 0));

    if (!a || !b) {
        return null;
    }

    /** @type {lanyard.geom.Line} */
    var ray = new lanyard.geom.Line(a, b.subtract(a).normalize())
    //this._logger.fine("Created ray line: " + ray.toString());

    return ray;
};

/**
 * Compute position from screen point.
 *
 * @param {number} x
 * @param {number} y
 * @return {lanyard.geom.Position}
 */
lanyard.BasicOrbitView.prototype.computePositionFromScreenPoint = function(x, y) {
    /** @type {lanyard.geom.Line} */
    var line = this.computeRayFromScreenPoint(x, y);

    if (!line) {
        return null;
    }

    if (!this.globe) {
        return null;
    }

    return this.globe.getIntersectionPosition(line);
};

/**
 * Get the forward vector.
 *
 * @return {lanyard.geom.Point}
 */
lanyard.BasicOrbitView.prototype.getForwardVector = function() {
    if (!this.forward && this.modelView) {
        /** @type {lanyard.geom.Matrix} */
        var modelViewInv = this.modelView.getInverse();

        if (modelViewInv) {
            this.forward = modelViewInv.transform(new lanyard.geom.Point(0, 0, -1, 0));
        }
    }

    return this.forward;
};

/**
 * Get the up vector.
 *
 * @return {lanyard.geom.Point} the up vector.
 */
lanyard.BasicOrbitView.prototype.getUpVector = function() {
    if (!this.up && this.modelView) {
        /** @type {lanyard.geom.Matrix} */
        var modelViewInv = this.modelView.getInverse();

        if (modelViewInv) {
            this.up = modelViewInv.transform(new lanyard.geom.Point(0, 1, 0, 0));
        }
    }

    return this.up;
};

/**
 * Pop the reference center off the stack.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @return {lanyard.geom.MatrixFour} the popped model view matrix.
 */
lanyard.BasicOrbitView.prototype.popModelViewMatrix = function(dc) {
    //this._logger.fine("Popping the reference center.");

    this.modelView = /** @type {lanyard.geom.MatrixFour} */ (this.modelViewStack.pop());
    dc.loadMatrix('uMVMatrix', this.modelView);

    return this.modelView;
};

/**
 * Get the eye point of the view.
 *
 * @return {lanyard.geom.Point}
 */
lanyard.BasicOrbitView.prototype.getEyePoint = function() {
    if (!this.eye && this.modelView) {
        /** @type {lanyard.geom.Matrix} */
        var modelViewInv = this.modelView.getInverse();

        if (modelViewInv) {
            this.eye = modelViewInv.transform(new lanyard.geom.Point(0, 0, 0, 1));
        }
    }

    return this.eye;
};

/**
 * Get the current frustum in model coords.
 *
 * @return {lanyard.geom.Frustum} the view frustum in model coords.
 */
lanyard.BasicOrbitView.prototype.getFrustumInModelCoordinates = function() {

    if (!this.modelView) {
        this._logger.severe('Attempted to compute a model-view coordinate frustum without a valid state matrix.');
    }

    if (!this.frustumInModelCoords && this.modelView) {
        // Compute the current model-view coordinate frustum.
        /** @type {lanyard.geom.Frustum} */
        var frust = this.getFrustum();

        if (frust) {
            this.frustumInModelCoords = frust.getInverseTransformed(this.modelView);
        } else {
            this._logger.severe('Frustum for conversion to model coordinates was invalid.');
        }
    }

    return this.frustumInModelCoords;
};

/**
 * The field of view accessor.
 *
 * @return {lanyard.geom.Angle}
 */
lanyard.BasicOrbitView.prototype.getFieldOfView = function() {
    return this.fieldOfView;
};

/**
 * The field of view mutator.
 *
 * @param {lanyard.geom.Angle} newFov the new field of view value.
 */
lanyard.BasicOrbitView.prototype.setFieldOfView = function(newFov) {
    this.fieldOfView = newFov;
};

/**
 * Get the current model-view matrix.
 *
 * @return {lanyard.geom.MatrixFour} the current model-view matrix.
 */
lanyard.BasicOrbitView.prototype.getModelViewMatrix = function() {
    return this.modelView;
};

/**
 * Accessor for the current projection matrix.
 *
 * @return {lanyard.geom.MatrixFour} the current projection matrix.
 */
lanyard.BasicOrbitView.prototype.getProjectionMatrix = function() {
    return this.projection;
};

/**
 * Accessor for the viewport.
 *
 * @return {lanyard.util.Rectangle} the current viewport rectangle.
 */
lanyard.BasicOrbitView.prototype.getViewport = function() {
    return this.viewport;
};

/**
 * Mutator for the viewport.
 *
 * @param {lanyard.util.Rectangle} vp the current viewport rectangle.
 */
lanyard.BasicOrbitView.prototype.setViewport = function(vp) {
    this.viewport = vp;
};

/**
 * Mutator for the viewport using a specified canvas.
 *
 * @param {Element} canvas the canvas to use.
 */
lanyard.BasicOrbitView.prototype.setViewportFromCanvas = function(canvas) {
    this.viewport = new lanyard.util.Rectangle(
            0, 0, canvas.width, canvas.height
    );
};


/**
 * Apply this view to the current draw context.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.BasicOrbitView.prototype.apply = function(dc) {
    this.globe = dc.getGlobe();
    this.verticalExaggeration = dc.getVerticalExaggeration();

    /**
    // Get the current OpenGL viewport state.
    dc.getGL().glGetIntegerv(GL.GL_VIEWPORT, viewportArray, 0);
    this.viewport = new Rectangle(viewportArray[0], viewportArray[1], viewportArray[2], viewportArray[3]);
    **/

    this.clearCachedAttributes();
    this.doApply(dc);
};

/**
 * Clear attributes cached in the view.
 */
lanyard.BasicOrbitView.prototype.clearCachedAttributes = function() {
    this.eye = null;
    this.up = null;
    this.forward = null;
    this.frustumInModelCoords = null;
    this.pixelSizeScale = -1;
    this.horizonDistance = -1;
};

/**
 * Compute the distance from the camera to the globe horizon.
 *
 * @param {lanyard.Globe} globe the current globe.
 * @param {number} verticalExaggeration
 * @param {lanyard.geom.Point} eyePoint the camera eye point.
 * @return {number} the distance to the horizon.
 */
lanyard.BasicOrbitView.prototype.computeHorizonDistance = function(globe, verticalExaggeration, eyePoint) {
    if (!globe || !eyePoint) {
        return -1;
    }

    // Compute the current (approximate) distance from eye to globe horizon.

    /** @type {lanyard.geom.Position} */
    var eyePosition = globe.computePositionFromPoint(eyePoint);

    /** @type {number} */
    var elevation = verticalExaggeration *
        globe.getElevation(eyePosition.getLatitude(), eyePosition.getLongitude());

    /** @type {lanyard.geom.Point} */
    var surface = globe.computePointFromPosition(
        new lanyard.geom.Position(
            eyePosition.getLatitude(),
            eyePosition.getLongitude(),
            elevation
        )
    );

    //this._logger.fine("Eyepoint length is: " + eyePoint.length());
    //this._logger.fine("Surface length is: " + surface.length());

    /** @type {number} */
    var altitude = eyePoint.length() - surface.length();
    //this._logger.fine("Set altitude to: " + altitude);

    /** @type {number} */
    var radius = globe.getMaximumRadius();

    return Math.sqrt(altitude * (2 * radius + altitude));
};

/**
 * Apply the current matrix state.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.geom.MatrixFour} modelView the model-view matrix.
 * @param {lanyard.geom.MatrixFour} projection the projection matrix.
 */
lanyard.BasicOrbitView.prototype.applyMatrixState = function(dc, modelView, projection) {
    var gl = dc.getGL();

    // Apply the model-view matrix to the current OpenGL context held by 'dc'.
    dc.loadMatrix('uMVMatrix', modelView);

    // Apply the projection matrix to the current OpenGL context held by 'dc'.
    dc.loadMatrix('uPMatrix', projection);

    this.modelView = modelView;
    this.projection = projection;
};

/**
 * Push the reference center onto the stack.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 * @param {lanyard.geom.Point} referenceCenter the reference center.
 */
lanyard.BasicOrbitView.prototype.pushModelViewReferenceCenter = function(dc, referenceCenter) {

    if (!this.modelView) {
        this._logger.severe('Attempted to push the reference center without a valid model-view.');
    }

    //this._logger.fine("Using new reference center of: " + referenceCenter.toString());

    // Push the current modelView on the stack
    /** @type {lanyard.geom.MatrixFour} */
    var copyModelView = new lanyard.geom.MatrixFour(this.modelView.getEntries());
    this.modelViewStack.push(copyModelView);

    // Translate the model-view by the reference point.
    /** @type {lanyard.geom.MatrixFour} */
    this.modelView = this.modelView.translatePoint(referenceCenter);

    //this._logger.fine("new model-view is: " + this.modelView.toString());

    // Load up the new model-view
    dc.loadMatrix('uMVMatrix', this.modelView);
};

/**
 * Pushes a new model-view matrix to the matrix stack.
 *
 * @param {lanyard.DrawContext} dc the new draw context.
 * @param {lanyard.geom.MatrixFour} newModelView the new model-view matrix.
 */
lanyard.BasicOrbitView.prototype.pushModelViewMatrix = function(dc, newModelView) {
    // Push the current modelView on the stack
    /** @type {lanyard.geom.MatrixFour} */
    var copyModelView = new lanyard.geom.MatrixFour(this.modelView.getEntries());
    this.modelViewStack.push(copyModelView);

    this.modelView = newModelView;

    // Load up the new model-view
    dc.loadMatrix('uMVMatrix', this.modelView);
};

/* EOF */
