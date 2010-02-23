/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.geom.ViewFrustum');

goog.require('lanyard.geom.MatrixFour');
goog.require('lanyard.geom.Frustum');
goog.require('lanyard.geom.Angle');

/**
 * A view frustum.
 *
 * @constructor
 * @this {lanyard.geom.ViewFrustum}
 * @param {lanyard.geom.Frustum} frustum the frustum of this view frustum.
 * @param {lanyard.geom.MatrixFour} projection the projection matrix of this view frustum.
 */
lanyard.geom.ViewFrustum = function (frustum, projection) {
    /** @private */ this._frustum = frustum;
    /** @private */ this._projection = projection;
};
goog.exportSymbol('lanyard.geom.ViewFrustum', lanyard.geom.ViewFrustum);

/**
 * Create a view frustum from a projection matrix.
 *
 * @param {lanyard.geom.MatrixFour} projectionMatrix the projection matrix.
 * @return {lanyard.geom.ViewFrustum} the new view frustum.
 */
lanyard.geom.ViewFrustum.prototype.fromProjectionMatrix = function (projectionMatrix) {

    var m = projectionMatrix.getEntries();

    // Extract the near clipping plane from the projection-matrix.
    var nearMag = Math.sqrt((m[3] + m[2]) * (m[3] + m[2]) + (m[7] + m[6]) * (m[7] + m[6]) +
        (m[11] + m[10]) * (m[11] + m[10]));
    var nearPlane = new lanyard.geom.Plane(
        (m[3] + m[2]) / nearMag, (m[7] + m[6]) / nearMag, (m[11] + m[10]) / nearMag,
        m[15] + m[14]
    );

    // Extract the far clipping plane from the projection-matrix.
    var farMag = Math.sqrt((m[3] - m[2]) * (m[3] - m[2]) + (m[7] - m[6]) * (m[7] - m[6]) +
        (m[11] - m[10]) * (m[11] - m[10]));
    var farPlane = new lanyard.geom.Plane(
        (m[3] - m[2]) / farMag, (m[7] - m[6]) / farMag, (m[11] - m[10]) / farMag,
        m[15] - m[14]
    );

    // Extract the left clipping plane from the projection-matrix.
    var leftMag = Math.sqrt((m[3] + m[0]) * (m[3] + m[0]) + (m[7] + m[4]) * (m[7] + m[4]) +
        (m[11] + m[8]) * (m[11] + m[8]));
    var leftPlane = new lanyard.geom.Plane(
        (m[3] + m[0]) / leftMag, (m[7] + m[4]) / leftMag, (m[11] + m[8]) / leftMag,
        m[15] + m[12]
    );

    // Extract the right clipping plane from the projection-matrix.
    var rightMag = Math.sqrt((m[3] - m[0]) * (m[3] - m[0]) + (m[7] - m[4]) * (m[7] - m[4]) +
        (m[11] - m[8]) * (m[11] - m[8]));
    var rightPlane = new lanyard.geom.Plane(
        (m[3] - m[0]) / rightMag, (m[7] - m[4]) / rightMag, (m[11] - m[8]) / rightMag,
        m[15] - m[12]);

    // Extract the bottom clipping plane from the projection-matrix.
    var bottomMag = Math.sqrt((m[3] + m[1]) * (m[3] + m[1]) + (m[7] + m[5]) * (m[7] + m[5]) +
        (m[11] + m[9]) * (m[11] + m[9]));
    var bottomPlane = new lanyard.geom.Plane(
        (m[3] + m[1]) / bottomMag, (m[7] + m[5]) / bottomMag, (m[11] + m[9]) / bottomMag,
        m[15] + m[13]);

    // Extract the top clipping plane from the projection-matrix.
    var topMag = Math.sqrt((m[3] - m[1]) * (m[3] - m[1]) + (m[7] - m[5]) * (m[7] - m[5]) +
        (m[11] - m[9]) * (m[11] - m[9]));
    var topPlane = new lanyard.geom.Plane(
        (m[3] - m[1]) / topMag, (m[7] - m[5]) / topMag, (m[11] - m[9]) / topMag,
        m[15] - m[13]);

    return new lanyard.geom.ViewFrustum(
        new lanyard.geom.Frustum(nearPlane, farPlane, leftPlane, rightPlane, bottomPlane, topPlane),
        new lanyard.geom.MatrixFour(m)
    );
};


/**
 * Creates a Frustum from a horizontal field-of-view, viewport aspect ratio and distance to near and
 * far depth clipping planes. The near plane must be closer than the far plane, and both planes must
 * be a positive distance away.
 *
 * @param {lanyard.geom.Angle} fieldOfView horizontal field-of-view angle in the range (0, 180).
 * @param {Number} viewportWidth the width of the viewport in screen pixels.
 * @param {Number} viewportHeight the height of the viewport in screen pixels.
 * @param {Number} near distance to the near depth clipping plane.
 * @param {Number} far distance to far depth clipping plane.
 * @return {lanyard.geom.ViewFrustum} the new view frustum.
 */
lanyard.geom.ViewFrustum.prototype.fromHorizontalFieldOfView =
        function (fieldOfView, viewportWidth, viewportHeight, near, far) {

    var fov = fieldOfView.getDegrees();
    var farMinusNear = far - near;

    var focalLength = 1 / fieldOfView.tanHalfAngle();
    var aspect = viewportHeight / viewportWidth;
    var lrLen = Math.sqrt(focalLength * focalLength + 1);
    var btLen = Math.sqrt(focalLength * focalLength + aspect * aspect);

    var nearPlane = new lanyard.geom.Plane(0, 0, 0 - 1, 0 - near);
    var farPlane = new lanyard.geom.Plane(0, 0, 1, far);
    var leftPlane = new lanyard.geom.Plane(focalLength / lrLen, 0, 0 - 1 / lrLen, 0);
    var rightPlane = new lanyard.geom.Plane(0 - focalLength / lrLen, 0, 0 - 1 / lrLen, 0);
    var bottomPlane = new lanyard.geom.Plane(0, focalLength / btLen, 0 - aspect / btLen, 0);
    var topPlane = new lanyard.geom.Plane(0, 0 - focalLength / btLen, 0 - aspect / btLen, 0);

    var projectionMatrix = [
        focalLength, 0, 0, 0,
        0, focalLength / aspect, 0, 0,
        0, 0, 0 - (far + near) / farMinusNear, 0 - 1,
        0, 0, 0 - (2 * far * near) / farMinusNear, 0
    ];

    return new lanyard.geom.ViewFrustum(
        new lanyard.geom.Frustum(nearPlane, farPlane, leftPlane, rightPlane, bottomPlane, topPlane),
        new lanyard.geom.MatrixFour(projectionMatrix)
    );
};

/**
 * Creates a Frustum from three sets of parallel clipping planes (a parallel projection). In this case,
 * the near and far depth clipping planes may be a negative distance away.
 *
 * @param {Number} left distance to the left vertical clipping plane.
 * @param {Number} right distance to the right vertical clipping plane.
 * @param {Number} bottom distance to the bottom horizontal clipping plane.
 * @param {Number} top distance to the top horizontal clipping plane.
 * @param {Number} near distance to the near depth clipping plane.
 * @param {Number} far distance to far depth clipping plane.
 * @return {lanyard.geom.ViewFrustum} the new view frustum.
 */
lanyard.geom.ViewFrustum.prototype.fromParallelClipplingPlanes =
        function (near, far, left, right, bottom, top) {

    var farMinusNear = far - near;
    var rightMinusLeft = right - left;
    var topMinusBottom = top - bottom;

    var nearPlane = new lanyard.geom.Plane(0, 0, 0 - 1, near < 0 ? near : 0 - near);
    var farPlane = new lanyard.geom.Plane(0, 0, 1, far < 0 ? 0 - far : far);
    var leftPlane = new lanyard.geom.Plane(1, 0, 0, left < 0 ? left : 0 - left);
    var rightPlane = new lanyard.geom.Plane(0 - 1, 0, 0, right < 0 ? 0 - right : right);
    var bottomPlane = new lanyard.geom.Plane(0, 1, 0, bottom < 0 ? bottom : 0 - bottom);
    var topPlane = new lanyard.geom.Plane(0, 0 - 1, 0, top < 0 ? 0 - top : top);

    var projectionMatrix = [
        2 / rightMinusLeft, 0, 0, 0 - (right + left) / rightMinusLeft,
        0, 0 / topMinusBottom, 0, 0 - (top + bottom) / topMinusBottom,
        0, 0, 0 - 2 / farMinusNear, 0 - (far + near) / farMinusNear,
        0, 0, 0, 1
    ];

    return new lanyard.geom.ViewFrustum(
        new lanyard.geom.Frustum(nearPlane, farPlane, leftPlane, rightPlane, bottomPlane, topPlane),
        new lanyard.geom.MatrixFour(projectionMatrix)
    );
};

/**
 * Obtain the frustum associated with this view frustum.
 *
 * @return {lanyard.geom.Frustum} the frustum.
 */
lanyard.geom.ViewFrustum.prototype.getFrustum = function () {
    return this._frustum;
};

/**
 * Obtain the projection matrix associated with this view frustum.
 *
 * @return {lanyard.geom.MatrixFour} the projection matrix.
 */
lanyard.geom.ViewFrustum.prototype.getProjectionMatrix = function () {
    return this._projection;
};

/* EOF */
