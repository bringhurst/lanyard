/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.View');

/**
 * The View interface provides basic methods for implementations to communicate state and state changes to
 * the caller. Views provide a coordinate transformation from the object coordinates of the model to eye
 * coordinates, which follow the OpenGL convention of a left-handed coordinate system with origin at the
 * eye point and looking down the negative-z axis.
 *
 * View implementations are free to constrain position and orientation, as well as supply any projection
 * from eye to clip coordinates they see fit. Therefore, calls to setFieldOfView, goToCoordinate, goToLatLon,
 * or goToAltitude are not guaranteed to produce the requested transformation. When exact knowledge of these
 * values are necessary, calling getFieldOfView, getPosition, or getAltitude, immediately after a call to
 * apply guarantees the value to be synchronized with data structures used for view transformation (e.g.
 * model-view and projection matrices.
 *
 * Views contain both fixed state and computed state. The computed state is typically updated during a call
 * to the apply method. Most accessor methods in this interface return the computed state that was set during
 * the most recent call to apply().
 *
 * @interface
 */
lanyard.View = function () {};

/**
 * Calculates and applies View's internal state to the graphics context in DrawContext.
 *
 * All subsequently rendered objects use this new state. Upon return, the OpenGL graphics context reflects
 * the values of this view, as do any computed values of the view, such as the model-view matrix and Frustum.
 *
 * @param {lanyard.DrawContext} dc the current World Wind drawing context on which View's state will apply.
 */
lanyard.View.prototype.apply = function (dc) {};

/**
 * Returns the 'model-view' matrix computed in apply(), which transforms model coordinates to eye coordinates
 * coordinates (where the eye is located at the origin, facing down the negative-z axis). This matrix is
 * constructed using the model space translation and orientation specific to each implementation of View.
 *
 * @return {lanyard.geom.MatrixFour} the current model-view matrix.
 */
lanyard.View.prototype.getModelViewMatrix = function () {};

/**
 * Returns the 'projection' matrix computed in apply(), which transforms eye coordinates to homogeneous
 * clip coordinates (a box of dimension (2, 2, 2) centered at the origin). This matrix is constructed using
 * the projection parameters specific to each implementation of View (e.g. field-of-view, clipping plane
 * distances). The getFrustum method returns the planes corresponding to this matrix.
 *
 * @return {lanyard.geom.MatrixFour} the current projection matrix.
 */
lanyard.View.prototype.getProjectionMatrix = function () {};

/**
 * Returns a Rectangle representing the window bounds (x, y, width, height) of the viewport, computed in
 * apply(). Implementations of View will configure themselves to render in this viewport.
 *
 * @return {lanyard.util.Rectangle} the current window bounds of the viewport, or null if none exists.
 */
lanyard.View.prototype.getViewport = function () {};

/**
 * Returns the viewing Frustum in eye coordinates, computed in apply(). The Frustum is the portion of viewable
 * viewable space defined by three sets of parallel 'clipping' planes. The method getFrustumInModelCoordinates
 * maintains the shape of this Frustum, but it has been translated and aligned with the eye in model space.
 *
 * @return {lanyard.geom.Frustum} the current viewing frustum in eye coordinates.
 */
lanyard.View.prototype.getFrustum = function () {};

/**
 * Returns the viewing Frustum transformed to model coordinates. Model coordinate frustums are useful
 * for performing multiple intersection tests in model coordinates.
 *
 * @return {lanyard.geom.Frustum} the current viewing frustum in model coordinates.
 */
lanyard.View.prototype.getFrustumInModelCoordinates = function () {};

/**
 * Returns the horizontal field-of-view angle (the angle of visibility) associated with this View, or
 * null if the View implementation does not support a field-of-view.
 *
 * @return {lanyard.geom.Angle} horizontal field-of-view angle, or null if none exists.
 */
lanyard.View.prototype.getFieldOfView = function () {};

/**
 * Sets the horiziontal field-of-view angle (the angle of visibillity) associated with this View. This
 * call may be ignored by implementations that do not support a field-of-view.
 *
 * @param {lanyard.geom.Angle} newFov the new horizontal field-of-view angle.
 */
lanyard.View.prototype.setFieldOfView = function (newFov) {};

/**
 * Generates a new coordinate system in which the View does not move, and model coordinates are reverse
 * transformed into eye coordinates. The origin for these coordinates will be referenceCenter, therefore
 * all objects drawn after a call to pushReferenceCenter should be with respect to this Point, rather than
 * the customary origin (0, 0, 0). This creates a new model-view matrix, which is places on the top of a
 * a matrix stack, and immediately applied to the current OpenGL context. In order to return to the original
 * coordinate space, callers should invoke popReferenceCenter after rendering is complete. Note that calls
 * to getModelViewMatrix will not return reference-center model-view matrix, but the original matrix.
 *
 * @param {lanyard.DrawContext} dc the current World Wind drawing context on which View's state will apply.
 * @param {lanyard.geom.Point} referenceCenter the Point to become the new model space origin.
 */
lanyard.View.prototype.pushReferenceCenter = function (dc, referenceCenter) {};

/**
 * Removes the model-view matrix on top of the matrix stack, and restores the matrix now on top. This has
 * the effect of immediately replacing the current OpenGL model-view matrix with the matrix below the top.
 * When the stack size is one, therefore containing the original model-view matrix computed by apply().
 *
 * @param {lanyard.DrawContext} dc the current World Wind drawing context on which View's state will apply.
 */
lanyard.View.prototype.popReferenceCenter = function (dc) {};

/**
 * Returns the eye position in model coordinates.
 *
 * @return {lanyard.geom.Point} the eye position in model coordinates.
 */
lanyard.View.prototype.getEyePoint = function () {};

/**
 * Returns the View y-axis orientation in model coordinates.
 *
 * @return {lanyard.geom.Point} the y-axis vector in model coordinates.
 */
lanyard.View.prototype.getUpVector = function () {};

/**
 * Returns the View z-axis orientation in model coordinates.
 *
 * @return {lanyard.geom.Point} the z-axis vector in model coordinates.
 */
lanyard.View.prototype.getForwardVector = function () {};

/**
 * Moves the View eye point to the new polar coordinate (latitude, longitude, elevation).
 *
 * @param {lanyard.geom.LatLon} newLatLon the new latitude and longitude of the eye point.
 * @param {number} newAltitude the new eye altitude (in meters) above the surface.
 */
lanyard.View.prototype.goToCoordinate = function (newLatLon, newAltitude) {};

/**
 * Returns the geographic (latitude, longitude, elevation) coordinate of the View's eye point. Latitude
 * and longitude represent the coordinate directly beneath (or above) the View, while elevation represents
 * represents the View altitude above the analytical Globe radius.
 *
 * @return {lanyard.geom.Position} the latitude and longitude coordinates of the eye point.
 */
lanyard.View.prototype.getPosition = function () {};

/**
 * Moves the View eye point to the new geographic (latitude, longitude) coordinate. Altitude is left
 * unchanged.
 *
 * @param {lanyard.geom.LatLon} newLatLon the new latitude and longitude of the eye point.
 */
lanyard.View.prototype.goToLatLon = function (newLatLon) {};

/**
 * Returns the View eye altitude (in meters) above the last rendered SectorGeometry, or the analytical
 * Globe, depending on the implementation.
 *
 * @return {number} the View's altitude (in meters) above the surface.
 */
lanyard.View.prototype.getAltitude = function () {};

/**
 * Moves the View eye point to the new altitude (in meters) above the last rendered SectorGeometry,
 * or the analytical Globe, depending on the implementation.
 *
 * @param {number} newAltitude the new eye altitude (in meters) above the surface.
 */
lanyard.View.prototype.goToAltitude = function (newAltitude) {};

/**
 * Returns the View's angle from true North.
 *
 * @return {lanyard.geom.Angle} the angle from true North.
 */
lanyard.View.prototype.getHeading = function () {};

/**
 * Sets the View's angle to true North.
 *
 * @param {lanyard.geom.Angle} newHeading the new angle to true North.
 */
lanyard.View.prototype.setHeading = function (newHeading) {};

/**
 * Returns the View's angle from the plane tangent to the surface.
 *
 * @return {lanyard.geom.Angle} the angle from the surface tangent plane.
 */
lanyard.View.prototype.getPitch = function () {};

/**
 * Sets the View's angle to the plane tangent to the surface.
 *
 * @param {lanyard.geom.Angle} newPitch the new angle to the surface tangent plane.
 */
lanyard.View.prototype.setPitch = function (newPitch) {};

/**
 * Returns a two-dimensional array containing the range of angles (inclusive) the View may limit
 * its pitch to, if pitch constraints are enabled.
 *
 * @return {Array.<lanyard.geom.Angle} a two-dimensional array, with the minimum and maximum pitch angles.
 */
lanyard.View.prototype.getPitchConstraints = function () {};

/**
 * Sets the range of angles (inclusive) the View may limit its pitch to, if pitch constraints are
 * enabled.
 *
 * @param {lanyard.geom.Angle} newMinPitch the minimum pitch angle.
 * @param {lanyard.geom.Angle} newMaxPitch the maximum pitch angle.
 */
lanyard.View.prototype.setPitchConstraints = function (newMinPitch, newMaxPitch) {};

/**
 * Returns true when pitch constraints are enabled.
 *
 * @return {boolean} true when pitch constraints are enabled.
 */
lanyard.View.prototype.isEnablePitchConstraints = function () {};

/**
 * Enable or disable pitch constraints.
 *
 * @param {boolean} enabled true when pitch constraints should be enabled, false otherwise.
 */
lanyard.View.prototype.setEnablePitchConstraints = function (enabled) {};

/**
 * Returns the View's angle about its local z-axis.
 *
 * @return {lanyard.geom.Angle} the angle about the local z-axis.
 */
lanyard.View.prototype.getRoll = function () {};

/**
 * Sets the View's angle about its local z-axis.
 *
 * @param {lanyard.geom.Angle} newRoll the new angle about the local z-axis.
 */
lanyard.View.prototype.setRoll = function (newRoll) {};

/**
 * Returns the View's translation in its forward direction.
 *
 * @return {number} translation along the forward direction.
 */
lanyard.View.prototype.getZoom = function () {};

/**
 * Sets the View's translation in its forward direction.
 *
 * @param {number} newZoom translation along the forward direction.
 */
lanyard.View.prototype.setZoom = function (newZoom) {};

/**
 * Returns a two-dimensional array containing the range of values (inclusive) the View may limit
 * its zoom to, if zoom constraints are enabled.
 *
 * @return {Array.<number>} two-dimensional array, with the minimum and maximum zoom values.
 */
lanyard.View.prototype.getZoomConstraints = function () {};

/**
 * Sets the range of values (inclusive) the View may limit its zoom to, if zoom constraints are
 * enabled.
 *
 * @param {number} newMinZoom the minimum zoom value.
 * @param {number} newMaxZoom the maximum zoom value.
 */
lanyard.View.prototype.setZoomConstraints = function (newMinZoom, newMaxZoom) {};

/**
 * Returns true when zoom constraints are enabled.
 *
 * @return {boolean} true when zoom constraints are enabled, false otherwise.
 */
lanyard.View.prototype.isEnableZoomConstraints = function () {};

/**
 * Enable or disable zoom constraints.
 *
 * @param {boolean} enabled trhe when zoom constraints should be enabled, false otherwise.
 */
lanyard.View.prototype.setEnableZoomConstraints = function (enabled) {};

/**
 * Computes a line, in model coordinates, originating from the eye point, and passing throught the point
 * contained by (x, y) on the View's projection plane (or after projection into model space).
 *
 * @param {number} x the horizontal coordinate originating from the left side of View's projection plane.
 * @param {number} y the vertical coordinate originating from the top of View's projection plane.
 * @return {lanyard.geom.Line} from the View eye point and passing throught (x, y) transformed into model space.
 */
lanyard.View.prototype.computeRayFromScreenPoint = function (x, y) {};

/**
 * Computes the intersection of a line originating from the eye point (passing throught (x, y)) with the last
 * rendered SectorGeometry, or the last analytical Globe if no rendered geometry exists.
 *
 * @param {number} x the horizontal coordinate originating from the left side of View's projection plane.
 * @param {number} y the vertical coordinate originating from the top of View's projection plane.
 * @return {lanyard.geom.Position} the point on the surface in polar coordiantes.
 */
lanyard.View.prototype.computePositionFromScreenPoint = function (x, y) {};

/**
 * Computes the screen-aligned dimension (in meters) that a screen pixel would cover at a given distance
 * (also in meters). This computation assumes that pixels dimensions are square, and therefore returns a
 * single dimension.
 *
 * @param {number} distance the postive distance from the eye point, in eye coordinates, along the z-axis.
 * @return {number} the dimension of a pixel (in meters) at the given distance.
 */
lanyard.View.prototype.computePixelSizeAtDistance = function (distance) {};

/**
 * Returns the distance from the View's eye point to the horizon point on the last rendered Globe.
 *
 * @return {number} the distance from the eye point to the horizon (in meters).
 */
lanyard.View.prototype.computeHorizonDistance = function () {};

/**
 * Maps a Point in model (cartesian) coordinates to a Point in screen coordinates. The returned x and y
 * are relative to the lower left hand screen corner, while z is the screen depth-coordinate. If the
 * model point cannot be sucessfully mapped, this will return null.
 *
 * @param {lanyard.geom.Point} modelPoint the model coordinate Point to project.
 * @return {lanyard.geom.Point} the mapped screen coordinate Point.
 */
lanyard.View.prototype.project = function (modelPoint) {};

/**
 * Maps a Point in screen coordinates to a Point in model coordinates. The input x and y are relative
 * to the lower left hand screen corner, while z is the screen depth-coordinate. If the screen point
 * cannot be sucessfully mapped, this will return null.
 *
 * @param {lanyard.geom.Point} windowPoint the window coordinate Point to project.
 * @return {lanyard.geom.Point} the mapped screen coordinate Point.
 */
lanyard.View.prototype.unProject = function (windowPoint) {};

/* EOF */
