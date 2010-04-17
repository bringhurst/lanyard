/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.BasicOrbitView');

/**
 * A basic orbit view implementation.
 *
 * @constructor
 * @implements {lanyard.View}
 */
lanyard.BasicOrbitView = function () {

    // Setup defaults.

    /** @type {Date} */
    this.tzDate = new Date();

    /**
     * @private
     * @type {number}
     */
    this.DefaultLatitude = 0.0;

    /**
     * @private
     * @type {number}
     */
    this.DefaultLongitude = (180.0 * this.tzDate.getTimezoneOffset() / (12.0 * 3.6e6));

    /**
     * @private
     * @type {number}
     */
    this.DefaultZoom = 0.0;

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
     * @type {lanyard.geom.MatrixFour}
     */
    this.modelView;

    /**
     * @private
     * @type {lanyard.geom.MatrixFour}
     */
    this.projection;

    /**
     * @private
     * @type {lanyard.util.Rectangle}
     */
    this.viewport;

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.fieldOfView = lanyard.geom.Angle.prototype.fromDegrees(this.DefaultFov);

    // Current DrawContext state.

    /**
     * @private
     * @type {lanyard.Globe}
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
     * @type {lanyard.geom.Point}
     */
    this.eye = null;

    /**
     * @private
     * @type {lanyard.geom.Point}
     */
    this.up = null;

    /**
     * @private
     * @type {lanyard.geom.Point}
     */
    this.forward = null;

    /**
     * @private
     * @type {lanyard.geom.Frustum}
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
    this.focusLat = lanyard.geom.Angle.prototype.fromDegrees(this.DefaultLatitude);

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.focusLon = lanyard.geom.Angle.prototype.fromDegrees(this.DefaultLongitude);

    /**
     * @private
     * @type {number}
     */
    this.eyeDist = this.DefaultZoom;

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.heading = lanyard.geom.Angle.prototype.fromDegrees(this.DefaultHeading);

    /**
     * @private
     * @type {lanyard.geom.Angle}
     */
    this.pitch = lanyard.geom.Angle.prototype.fromDegrees(this.DefaultPitch);

    /**
     * @private
     * @type {number}
     */
    this.altitude = 0; // FIXME: should be set to 0?

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
     * @type {lanyard.geom.ViewFrustum}
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
};

/**
 * Apply the view state.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.BasicOrbitView.prototype.doApply = function (dc) {
    if (!isInitialized) {
        this.doInitialize(dc);
        isInitialized = true;
    }

    /** @type {lanyard.geom.MatrixFour} */
    var projection = null;

    // Compute the current model-view matrix and view eye point.

    /** @type {lanyard.geom.MatrixFour} */
    var modelView = this.computeModelViewMatrix(dc);

    /** @type {lanyard.geom.Point} */
    var eyePoint = modelView.getInverse().transform(new lanyard.geom.Point(0, 0, 0, 1));

    // Compute the current viewing frustum and projection matrix.
    this.viewFrustum = this.computeViewFrustum(dc, eyePoint);

    if (this.viewFrustum) {
        this.collisionRadius = this.computeCollisionRadius(this.viewFrustum);
        projection = this.viewFrustum.getProjectionMatrix();
    }

    // Set current GL matrix state.
    this.applyMatrixState(dc, modelView, projection);
};

/**
 * Initialize this view.
 *
 * @param {lanyard.DrawContext} dc the draw context.
 */
lanyard.BasicOrbitView.prototype.doInitialize = function (dc) {
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
lanyard.BasicOrbitView.prototype.computeModelViewMatrix = function (dc) {
    /** @type {lanyard.Globe} */
    var globe = dc.getGlobe();

    if (!globe) {
        return null;
    }

    /** @type {lanyard.geom.Point} */
    var focusPoint = globe.computePointFromPosition(this.focusLat, this.focusLon, 0);

    /** @type {lanyard.geom.MatrixFour} */
    var modelView = lanyard.BasicOrbitView.prototype.lookAt(
        this.focusLat, this.focusLon, focusPoint.length(),
        this.eyeDist, this.heading, this.pitch);

    /** @type {lanyard.geom.Point} */
    var eye = modelView.getInverse().transform(new lanyard.geom.Point(0, 0, 0, 1));

    /** @type {lanyard.geom.Position} */
    var polarEye = globe.computePositionFromPoint(eye);

    /** @type {lanyard.geom.Point} */
    var surfacePoint = computeSurfacePoint(dc, polarEye.getLatitude(), polarEye.getLongitude());

    if (surfacePoint) {
        /** @type {number} */ 
        var distanceToSurface = eye.length() - this.collisionRadius - surfacePoint.length();

        if (distanceToSurface < 0) {
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

                this.pitch = this.clampPitch(this.pitch.subtract(Angle.fromRadians(pitchChange)));
                this.eyeDist = this.clampZoom(newForward.length());

                modelView = lanyard.BasicOrbitView.prototype.lookAt(
                    this.focusLat, this.focusLon, focusPoint.length(),
                    this.eyeDist, this.heading, this.pitch);
            }
        }
    }

    // Compute the current eye altitude above sea level (Globe radius).
    eye = modelView.getInverse().transform(new lanyard.geom.Point(0, 0, 0, 1));
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
        function (focusX, focusY, focusDistance, tiltDistance, tiltZ, tiltX) {

    /** @type {lanyard.geom.MatrixFour} */
    var m = new lanyard.geom.MatrixFour(); // identity

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
lanyard.BasicOrbitView.prototype.computeSurfacePoint = function (dc, lat, lon) {
    /** @type {lanyard.geom.Point} */
    var p = null;

    /** @type {lanyard.SectorGeometryList} */
    var geom = dc.getSurfaceGeometry();

    if (geom) {
        p = geom.getSurfacePoint(lat, lon);
    }

    if (p) {
        return p;
    }

    /** @type {lanyard.Globe} */
    var globe = dc.getGlobe();

    if (globe) {
        /** @type {number} */
        var elevation = dc.getVerticalExaggeration() * globe.getElevation(lat, lon);
        p = globe.computePointFromPosition(lat, lon, elevation);
    }

    return p;
};

/**
 * Get the current view frustum.
 *
 * @return {lanyard.geom.Frustum}
 */
lanyard.BasicOrbitView.prototype.getFrustum = function () {
    if (!this.viewFrustum) {
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
lanyard.BasicOrbitView.prototype.computeViewFrustum = function (dc, eyePoint) {
    /** @type {lanyard.util.Rectangle} */
    var viewport = this.getViewport();

    /** @type {lanyard.geom.Angle} */
    var fov = this.getFieldOfView();

    if (viewport == null || fov == null) {
        return null;
    }

    // Compute the most distant near clipping plane.

    /** @type {number} */
    var tanHalfFov = fov.tanHalfAngle();

    /** @type {number} */
    var near = Math.max(10, this.altitude / (2 * Math.sqrt(2 * tanHalfFov * tanHalfFov + 1)));

    // Compute the closest allowable far clipping plane distance.

    /** @type {number} */
    var far = this.computeHorizonDistance(dc.getGlobe(), dc.getVerticalExaggeration(), eyePoint);

    // Compute the frustum from a standard perspective projection.
    return new lanyard.geom.ViewFrustum(fov, viewport.width, viewport.height, near, far);
};

/**
 * Compute the collision radius.
 *
 * @param {lanyard.geom.ViewFrustum} viewFrustum
 * @return {number} the collision radius.
 */
lanyard.BasicOrbitView.prototype.computeCollisionRadius = function (viewFrustum) {
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
lanyard.BasicOrbitView.prototype.getPosition = function () {
    return new lanyard.geom.Position(this.focusLat, this.focusLon, 0);
};

/**
 * Go to the specified latlon.
 *
 * @param {lanyard.geom.LatLon} newLatLon
 */
lanyard.BasicOrbitView.prototype.goToLatLon = function (newLatLon) {
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
lanyard.BasicOrbitView.prototype.getAltitude = function () {
    return this.altitude;
};

/**
 * Go to the specified altitude.
 *
 * @param {number} newAltitude the new altitude.
 */
lanyard.BasicOrbitView.prototype.goToAltitude = function (newAltitude) {
    throw "unsupported";
};

/**
 * Go to the specified coordinate.
 *
 * @param {lanyard.geom.LatLon} newLatLon
 * @param {number} newAltitude
 */
lanyard.BasicOrbitView.prototype.goToCoordinate = function (newLatLon, newAltitude) {
    throw "unsupported";
};

/**
 * Clamp coordinate.
 *
 * @private
 * @param {lanyard.geom.LatLon} latLon
 * @return {lanyard.geom.LatLon}
 */
lanyard.BasicOrbitView.prototype.clampCoordinate = function (latLon) {
    /** @type {number} */
    var lat = latLon.getLatitude().getDegrees();

    if (lat < -90) {
        lat = -90;
    } else if (lat > 90) {
        lat = 90;
    }

    /** @type {number} */
    var lon = latLon.getLongitude().getDegrees();

    if (lon < -180) {
        lon = lon + 360;
    } else if (lon > 180) {
        lon = lon - 360;
    }

    return lanyard.geom.LatLon.prototype.fromDegrees(lat, lon);
};

/**
 * Get the heading.
 *
 * @return {lanyard.geom.Angle} 
 */
lanyard.BasicOrbitView.prototype.getHeading = function () {
    return this.heading;
};

/**
 * Set the current heading.
 */
lanyard.BasicOrbitView.prototype.setHeading = function (newHeading) {
    this.heading = this.clampHeading(newHeading);
};

/**
 * Clamp the heading. 
 *
 * @private
 * @param {lanyard.geom.Angle} heading
 * @return {lanyard.geom.Angle}
 */
lanyard.BasicOrbitView.prototype.clampHeading = function (heading) {
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
lanyard.BasicOrbitView.prototype.getPitch = function () {
    return this.pitch;
};

/* EOF */
