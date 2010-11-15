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

goog.provide('lanyard.dom.InputHandler');

goog.require('goog.debug.Logger');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');

goog.require('lanyard.dom.ViewProperties');

/**
 * A handler for user input
 *
 * @constructor
 */
lanyard.dom.InputHandler = function () {
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.dom.InputHandler');

    /**
     * @private
     * @type {lanyard.LanyardCanvas}
     */
    this.lanyardCanvas = null;

    /**
     * Current mouse state.
     *
     * @private
     * @type {lanyard.util.Point}
     */
    this.lastMousePoint = new lanyard.util.Point(0, 0);

    /**
     * @private
     * @type {boolean}
     */
    this.isHovering = false;

    /**
     * @private
     * @type {boolean}
     */
    this.smoothViewChange = true;

    // View LatLon properties.

    /**
     * @private
     * @type {number}
     */
    this.viewLatLonMinChangeFactor = 0.00001;

    /**
     * @private
     * @type {number}
     */
    this.viewLatLonMaxChangeFactor = 0.2;

    /**
     * @private
     * @type {number}
     */
    this.viewLatLonErrorThreshold = 0.000000001;

    /**
     * @private
     * @type {number}
     */
    this.viewLatLonStepCoefficient = 0.6;

    /**
     * @private
     * @type {number}
     */
    this.viewLatLonCenterStepCoefficient = 0.1;

    // View heading and pitch (angle) properties.

    /**
     * @private
     * @type {number}
     */
    this.viewAngleChangeFactor = 0.25;

    /**
     * @private
     * @type {number}
     */
    this.viewAngleErrorThreshold = 0.0001;

    /**
     * @private
     * @type {number}
     */
    this.viewAngleStepCoefficient = 0.3;

    /**
     * @private
     * @type {number}
     */
    this.viewAngleResetStepCoefficient = 0.1;

    // View zoom properties.

    /**
     * @private
     * @type {number}
     */
    this.viewZoomChangeFactor = 0.05;

    /**
     * @private
     * @type {number}
     */
    this.viewZoomErrorThreshold = 0.001;

    /**
     * @private
     * @type {number}
     */
    this.viewZoomStepCoefficient = 0.1;
};

/**
 * Set the event source of this input handler.
 *
 * @param {lanyard.LanyardCanvas} lanyardCanvas the event source.
 */
lanyard.dom.InputHandler.prototype.setEventSource = function (lanyardCanvas) {

    if(!lanyardCanvas) {
        this._logger.severe("Attempted to use an invalid object as an event source.");
    }

    if(!lanyardCanvas.getView()) {
        this._logger.severe("Attempted to set an event source without a valid view.");
    }

    /** @type {Element} */
    var domCanvas = lanyardCanvas.getCanvas();

    if(!domCanvas) {
        this._logger.severe("Attempted to use an input source without a valid dom node.");
    }

    this.lanyardCanvas = lanyardCanvas;

    // Setup a listener for the mouse wheel
    var mouseWheelHandler = new goog.events.MouseWheelHandler(domCanvas);
    goog.events.listen(
        mouseWheelHandler,
        goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
        this.mouseWheelMoved,
        false,
        this
    );

    // Setup a listener for dragging the mouse.
    goog.events.listen(domCanvas, goog.events.EventType.MOUSEDOWN, function(e) {
        var dragger = new goog.fx.Dragger(domCanvas);

        goog.events.listen(dragger, goog.fx.Dragger.EventType.DRAG,
            this.mouseDragged, false, this);

        goog.events.listen(dragger, goog.fx.Dragger.EventType.END, function(e) {
            dragger.dispose();
        });

        dragger.startDrag(e);
    }, false, this);

    // Things to do on canvas unload.
    goog.events.listen(domCanvas, 'unload', function(e) {
        // Remove the mouse wheel listener
        goog.events.unlisten(mouseWheelHandler, goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
            this.mouseWheelMoved);
    });
};

/**
 * Get the event source of this input handler.
 *
 * @return {lanyard.LanyardCanvas} the event source of this input handler.
 */
lanyard.dom.InputHandler.prototype.getEventSource = function () {
    return this.lanyardCanvas;
};

/**
 * Handle a mouse dragged event.
 *
 * @param {Event} mouseEvent the mouse event.
 */
lanyard.dom.InputHandler.prototype.mouseDragged = function (mouseEvent) {

    if (!this.lanyardCanvas) {
        this._logger.severe("Attempted to handle a drag event without a valid canvas.");
        return;
    }

    if(!mouseEvent) {
        this._logger.severe("Attempted to handle a drag event without a valid event.");
        return;
    }

    /** @type {lanyard.View} */
    var view = this.lanyardCanvas.getView();

    if(!view) {
        this._logger.severe("Attempted to handle a drag event without a valid view.");
        return;
    }

    /** @type {lanyard.Model} */
    var model = this.lanyardCanvas.getModel();

    if(!model) {
        this._logger.severe("Attempted to handle a drag event without a valid model.");
        return;
    }

    /** @type {lanyard.util.Point} */
    var mouseMove = new lanyard.util.Point(mouseEvent.clientX - this.lastMousePoint.getX(),
        mouseEvent.clientY - this.lastMousePoint.getY());

    /** @type {lanyard.geom.LatLon} */
    var latLonChange = null;

    /** @type {lanyard.geom.Position} */
    var prev = view.computePositionFromScreenPoint(this.lastMousePoint.getX(), this.lastMousePoint.getY());

    /** @type {lanyard.geom.Position} */
    var cur = view.computePositionFromScreenPoint(mouseEvent.clientX, mouseEvent.clientY);

    if (prev && cur) {
        latLonChange = new lanyard.geom.LatLon(prev.getLatitude().subtract(cur.getLatitude()),
            prev.getLongitude().subtract(cur.getLongitude()));
    } else {
        /** @type {lanyard.Globe} */
        var globe = this.lanyardCanvas.getModel().getGlobe();

        if (globe) {
            /** @type {number} */
            var sinHeading = view.getHeading().sin();

            /** @type {number} */
            var cosHeading = view.getHeading().cos();

            /** @type {number} */
            var latFactor = cosHeading * mouseMove.getY() + sinHeading * mouseMove.getX();

            /** @type {number} */
            var lonFactor = sinHeading * mouseMove.getY() - cosHeading * mouseMove.getX();

            latLonChange = this.computeViewLatLonChange(view, globe, latFactor, lonFactor, false);
        } else {
            this._logger.severe("Attempted to perform a drag event without a valid globe.");
        }
    }

    if (latLonChange) {
        this.setViewLatLon(view, this.computeNewViewLatLon(view, latLonChange.getLatitude(),
            latLonChange.getLongitude()));
    } else {
        this._logger.severe("A failure occured in the drag event result.");
    }

    /**** FIXME: handle the view angle when command is held down....

    if( command key is held down during the drag ) {

        var headingDirection = 1;
        var source = mouseEvent.getSource();

        if (source) {
            if (mouseEvent.getPoint().y < source.getHeight() / 2) {
                headingDirection = -1;
            }
        }

        this.setViewAngle(view,
            this.computeNewViewHeading(view, this.computeViewAngleChange(headingDirection * mouseMove.x, false)),
            this.computeNewViewPitch(view, this.computeViewAngleChange(mouseMove.y, false)));
    }

    ****/

    this.lastMousePoint = new lanyard.util.Point(mouseEvent.clientX, mouseEvent.clientY);
};

/**
 * Set the view to the calculated latlon.
 *
 * @param {lanyard.View} view the view to use.
 * @param {lanyard.geom.LatLon} newLatLon the latlon to use.
 */
lanyard.dom.InputHandler.prototype.setViewLatLon = function (view, newLatLon) {
    if (!newLatLon) {
        this._logger.severe("Attempted to set the view to an invalid latlon.");
    }

    this.viewTarget = new lanyard.dom.ViewProperties();
    this.viewTarget.latLon = newLatLon;
    this.setViewProperties(view, this.viewTarget,
        this.viewLatLonStepCoefficient, this.viewLatLonErrorThreshold, false);
};

/**
 * Compute the view for a latlon change.
 *
 * @param {lanyard.View} view the view to use.
 * @param {lanyard.Globe} globe the globe to use.
 * @param {number} latFactor the latitude factor to use.
 * @param {number} lonFactor the longitude factor to use.
 * @param {boolean} slow should the transisition be slow or not.
 * @param {lanyard.geom.LatLon} the computed latlon.
 */
lanyard.dom.InputHandler.prototype.computeViewLatLonChange = function (
        view, globe, latFactor, lonFactor, slow) {

    /** @type {lanyard.geom.Point} */
    var eye = view.getEyePoint();

    if (!eye) {
        this._logger.severe("Attempted to compute a latlon change without a valid eye.");
        return null;
    }

    /** @type {number} */
    var normAlt = this.clamp((eye.length() / globe.getMaximumRadius()) - 1, 0, 1);

    /** @type {number} */
    var factor =
        ((1 - normAlt) * this.viewLatLonMinChangeFactor + normAlt * this.viewLatLonMaxChangeFactor) *
        (slow ? 2.5e-1 : 1);


    return lanyard.geom.LatLon.prototype.fromDegrees(latFactor * factor, lonFactor * factor);
};

/**
 * Compute a new latlon for the view.
 *
 * @param {lanayrd.View} view the view to use.
 * @param {lanyard.geom.Angle} latChange the change in latitude.
 * @param {lanyard.geom.Angle} lonChange the change in longitude.
 * @return {lanyard.geom.LatLon} the computed latlon.
 */
lanyard.dom.InputHandler.prototype.computeNewViewLatLon = function (view, latChange, lonChange) {
    /** @type {number} */
    var latDegrees;

    /** @type {number} */
    var lonDegrees;

    if (this.viewTarget && this.viewTarget.latLon) {
        latDegrees = this.viewTarget.latLon.getLatitude().getDegrees();
        lonDegrees = this.viewTarget.latLon.getLongitude().getDegrees();
    } else {
        latDegrees = view.getPosition().getLatitude().getDegrees();
        lonDegrees = view.getPosition().getLongitude().getDegrees();
    }

    latDegrees = latDegrees + latChange.getDegrees();
    lonDegrees = lonDegrees + lonChange.getDegrees();

    if (latDegrees < -90) {
        latDegrees = -90;
    } else if (latDegrees > 90) {
        latDegrees = 90;
    }

    if (lonDegrees < -180) {
        lonDegrees = lonDegrees + 360;
    } else if (lonDegrees > 180) {
        lonDegrees = lonDegrees - 360;
    }

    /** @type {lanyard.geom.LatLon} */
    var latlon = lanyard.geom.LatLon.prototype.fromDegrees(latDegrees, lonDegrees);

    return latlon;
};

/**
 * Handle a mouse wheel moved event.
 *
 * @param {MouseWheelEvent} mouseWheelEvent the mouse wheel event.
 */
lanyard.dom.InputHandler.prototype.mouseWheelMoved = function (mouseWheelEvent) {
    if(!this.lanyardCanvas) {
        this._logger.severe("A mouse wheel event was thrown away due to a missing event source.");
        return;
    }

    if(!mouseWheelEvent) {
        this._logger.severe("Attempted to handle an invalid mouse wheel event.");
        return;
    }

    // Prevent the mouse wheel from moving the window.
    mouseWheelEvent.preventDefault();

    /** @type {lanyard.View} */
    var view = this.lanyardCanvas.getView();

    if(!view) {
        this._logger.severe("Attempted to handle a mouse wheel event without a valid view.");
        return;
    }

    /** @type {number} */
    var wheelRotation = mouseWheelEvent.deltaY;

    /** @type {number} */
    var wheelDirection = (function(rotation) {
        // FIXME: isn't there a Math.signum() built into js somewhere?

        if (rotation < 0.0) {
            return -1.0;
        }

        if (rotation > 0.0) {
            return 1.0;
        }

        return 0.0;
    }(wheelRotation));

    this.setViewZoom(view, this.computeNewViewZoom(view, this.computeZoomViewChange(wheelDirection, false)));
};


/**
 * Compute the new view zoom value.
 *
 * @param {lanyard.View} view the view to use.
 * @param {number} change the zoom delta.
 * @return {number} the new zoom value.
 */
lanyard.dom.InputHandler.prototype.computeNewViewZoom = function (view, change) {
    /** @type {number} */
    var logZoom;

    if (this.viewTarget && this.viewTarget.zoom) {
        logZoom = Math.log(this.viewTarget.zoom);
    } else {
        logZoom = Math.log(view.getZoom());
    }

    logZoom = logZoom + change;

    /** @type {Array.<number>} */
    var constraints = view.getZoomConstraints();

    return this.clamp(Math.exp(logZoom), constraints[0], constraints[1]);
};

/**
 * Compute a zoom view change.
 *
 * @param {number} factor the zoom factor.
 * @param {boolean} slow if the zoom is slow or not.
 * @return {number} the zoom view change.
 */
lanyard.dom.InputHandler.prototype.computeZoomViewChange = function (factor, slow) {
    return factor * this.viewZoomChangeFactor * (slow ? 2.5e-1 : 1.0);
};

/**
 * Set a zoom on the view.
 *
 * @param {lanyard.View} view the view to use.
 * @param {number} newZoom the new zoom to set things to.
 */
lanyard.dom.InputHandler.prototype.setViewZoom = function (view, newZoom) {
    this.viewTarget = new lanyard.dom.ViewProperties();
    this.viewTarget.zoom = newZoom;

    this.setViewProperties(view, this.viewTarget, this.viewZoomStepCoefficient,
        this.viewZoomErrorThreshold, false);
};

/**
 * Set generic properties on the view.
 *
 * @param {lanyard.View} view the view to use.
 * @param {lanyard.dom.ViewProperties} newProperties the view properties to use.
 * @param {number} stepCoefficient the step size to use.
 * @param {number} errorThreshold the error size to use.
 * @param {boolean} forceSmooth if we should force the transistion to be smooth.
 */
lanyard.dom.InputHandler.prototype.setViewProperties =
        function (view, newProperties, stepCoefficient, errorThreshold, forceSmooth) {

    if (!view) {
        this._logger.severe("Attempted to set properties on a null view.");
    }

    if (newProperties.latLon) {
        view.goToLatLon(newProperties.latLon);
    }

    if (newProperties.heading) {
        view.setHeading(newProperties.heading);
    }

    if (newProperties.pitch) {
        view.setPitch(newProperties.pitch);
    }

    if (newProperties.zoom) {
        view.setZoom(newProperties.zoom);
    }
};

/**
 * Clamp a value.
 *
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @return {number} the clamped value.
 */
lanyard.dom.InputHandler.prototype.clamp = function (x, min, max) {
    return x < min ? min : (x > max ? max : x);
};

/* EOF */
