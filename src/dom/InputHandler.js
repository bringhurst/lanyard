/*global goog, lanyard, window, document */
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
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.MouseWheelHandler');

goog.require('lanyard.dom.PositionEvent');
goog.require('lanyard.dom.ViewProperties');

/**
 * A handler for user input
 *
 * @constructor
 */
lanyard.dom.InputHandler = function() {
    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.dom.InputHandler');

    /**
     * @private
     */
    this.eventListeners = [];

    /**
     * @private
     * @type {lanyard.LanyardCanvas}
     */
    this.lanyardCanvas = null;

    /**
     * @type {HTMLCanvasElement}
     */
    this.domCanvas = null;

    /**
     * Current mouse state.
     *
     * @private
     * @type {lanyard.util.Point}
     */
    this.lastMousePoint = new lanyard.util.Point(0, 0);

    /**
     * Track the mouse button down count.
     *
     * @private
     * @type {number}
     */
    this.mouseDownCount = 0;

    /**
     * Track each mouse button down (assume no more than 4 mouse buttons).
     *
     * @private
     * @type {Array.<number>}
     */
    this.mouseDown = [0, 0, 0, 0];

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
lanyard.dom.InputHandler.prototype.setEventSource = function(lanyardCanvas) {

    if (!lanyardCanvas) {
        this._logger.severe('Attempted to use an invalid object as an event source.');
    }

    if (!lanyardCanvas.getView()) {
        this._logger.severe('Attempted to set an event source without a valid view.');
    }

    this.domCanvas = lanyardCanvas.getWebGLCanvas();

    if (!this.domCanvas) {
        this._logger.severe('Attempted to use an input source without a valid dom node.');
    }

    /** @type {lanyard.LanyardCanvas} */
    this.lanyardCanvas = lanyardCanvas;

    // Setup a listener for key events.
    var keyEventHandler = new goog.events.KeyHandler(this.domCanvas);
    goog.events.listen(keyEventHandler, 'key', this.keysPolled, false, this);

    // Setup a listener for the mouse wheel
    var mouseWheelHandler = new goog.events.MouseWheelHandler(this.domCanvas);
    goog.events.listen(mouseWheelHandler, goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
        this.mouseWheelMoved, false, this);

    // Setup a listener for mouse clicks
    goog.events.listen(window, goog.events.EventType.MOUSEDOWN, function(e) {
        //this._logger.fine('Received a mouse down event.');
        ++this.mouseDown[e.button];
        ++this.mouseDownCount;
    }, false, this);

    goog.events.listen(window, goog.events.EventType.MOUSEUP, function(e) {
        //this._logger.fine('Received a mouse up event.');
        --this.mouseDown[e.button];
        --this.mouseDownCount;
    }, false, this);

    // Setup a listener for when the mouse moves.
    goog.events.listen(this.domCanvas, goog.events.EventType.MOUSEMOVE,
       this.mouseMoved, false, this);

    // Things to do on canvas unload.
    goog.events.listen(this.domCanvas, 'unload', function(e) {
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
lanyard.dom.InputHandler.prototype.getEventSource = function() {
    return this.lanyardCanvas;
};

/**
 * Handle key events.
 *
 * @param {Event} keyEvent the key event.
 */
lanyard.dom.InputHandler.prototype.keysPolled = function(keyEvent) {
    if (!this.lanyardCanvas) {
        return;
    }

    /** @type {lanyard.View} */
    var view = this.lanyardCanvas.getView();
    if (!view) {
        return;
    }

    // Prevent the keypress from affecting the browser window.
    keyEvent.preventDefault();

    /** @type {number} */
    var sinHeading = view.getHeading().sin();

    /** @type {number} */
    var cosHeading = view.getHeading().cos();

    /** @type {number} */
    var latFactor = 0;

    /** @type {number} */
    var lonFactor = 0;

    if (keyEvent.keyCode === goog.events.KeyCodes.LEFT) {
        latFactor = sinHeading;
        lonFactor = -cosHeading;
    } else if (keyEvent.keyCode === goog.events.KeyCodes.RIGHT) {
        latFactor = -sinHeading;
        lonFactor = cosHeading;
    } else if (keyEvent.keyCode === goog.events.KeyCodes.UP) {
        latFactor = cosHeading;
        lonFactor = sinHeading;
    } else if (keyEvent.keyCode === goog.events.KeyCodes.DOWN) {
        latFactor = -cosHeading;
        lonFactor = -sinHeading;
    }

    if (latFactor !== 0 || lonFactor !== 0) {
        /** @type {lanyard.Globe} */
        var globe = this.lanyardCanvas.getModel().getGlobe();

        if (globe) {
            /** @type {lanyard.geom.LatLon} */
            var latLonChange =
                this.computeViewLatLonChange(view, globe, 10 * latFactor, 10 * lonFactor, false);

            this.setViewLatLon(view,
                this.computeNewViewLatLon(
                    view,
                    latLonChange.getLatitude(),
                    latLonChange.getLongitude()
                )
            );

            return;
        }
    }
};

/**
 * Handle a mouse moved event.
 *
 * @param {Event} mouseEvent the mouse event.
 */
lanyard.dom.InputHandler.prototype.mouseMoved = function(mouseEvent) {

    if (!this.lanyardCanvas) {
        return;
    }

    if (!mouseEvent) {
        return;
    }

    /** @type {lanyard.View} */
    var view = this.lanyardCanvas.getView();
    if (!view) {
        return;
    }

    // Check to see if a mouse button is pressed
    if (this.mouseDownCount) {
        this.mouseDragged(mouseEvent);
    }

    /** @type {lanyard.Model} */
    var model = this.lanyardCanvas.getModel();
    if (!model) {
        return;
    }

    /** @type {lanyard.Globe} */
    var globe = model.getGlobe();
    if (!globe) {
        return;
    }

    // TODO: call select listeners

    this.callPositionListeners(
        new lanyard.dom.PositionEvent(
            this.lanyardCanvas,
            mouseEvent,
            view.computePositionFromScreenPoint(this.lastMousePoint.getX(), this.lastMousePoint.getY()),
            view.computePositionFromScreenPoint(
                mouseEvent.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft - this.domCanvas.offsetLeft,
                mouseEvent.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop - this.domCanvas.offsetTop)
        )
    );

    this.lastMousePoint = new lanyard.util.Point(
        mouseEvent.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft - this.domCanvas.offsetLeft,
        mouseEvent.clientY + document.body.scrollTop +
            document.documentElement.scrollTop - this.domCanvas.offsetTop);
};

/**
 * Handle a mouse dragged event.
 *
 * @param {Event} mouseEvent the mouse event.
 */
lanyard.dom.InputHandler.prototype.mouseDragged = function(mouseEvent) {

    if (!this.lanyardCanvas) {
        this._logger.severe('Attempted to handle a drag event without a valid canvas.');
        return;
    }

    if (!mouseEvent) {
        this._logger.severe('Attempted to handle a drag event without a valid event.');
        return;
    }

    /** @type {lanyard.View} */
    var view = this.lanyardCanvas.getView();

    if (!view) {
        this._logger.severe('Attempted to handle a drag event without a valid view.');
        return;
    }

    /** @type {lanyard.Model} */
    var model = this.lanyardCanvas.getModel();

    if (!model) {
        this._logger.severe('Attempted to handle a drag event without a valid model.');
        return;
    }

    /** @type {lanyard.util.Point} */
    var mouseMove = new lanyard.util.Point(
        mouseEvent.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft - this.domCanvas.offsetLeft -
                this.lastMousePoint.getX(),
        mouseEvent.clientY + document.body.scrollTop +
            document.documentElement.scrollTop - this.domCanvas.offsetTop -
                this.lastMousePoint.getY());

    if (this.mouseDown[0]) {
        this._logger.fine("The left mouse button is pressed.");

        /** @type {lanyard.geom.LatLon} */
        var latLonChange = null;

        /** @type {lanyard.geom.Position} */
        var prev = view.computePositionFromScreenPoint(this.lastMousePoint.getX(), this.lastMousePoint.getY());

        /** @type {lanyard.geom.Position} */
        var cur = view.computePositionFromScreenPoint(
            mouseEvent.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft - this.domCanvas.offsetLeft,
            mouseEvent.clientY + document.body.scrollTop +
                document.documentElement.scrollTop - this.domCanvas.offsetTop);

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
                //this._logger.fine('latitude factor = ' + latFactor.toString());

                /** @type {number} */
                var lonFactor = sinHeading * mouseMove.getY() - cosHeading * mouseMove.getX();
                //this._logger.fine('longitude factor = ' + lonFactor.toString());

                if (latFactor !== 0 || lonFactor !== 0) {
                    latLonChange = this.computeViewLatLonChange(view, globe, latFactor, lonFactor, false);
                }
            } else {
                this._logger.severe('Attempted to perform a drag event without a valid globe.');
            }
        }

        if (latLonChange) {
            this.setViewLatLon(view, this.computeNewViewLatLon(view, latLonChange.getLatitude(),
                latLonChange.getLongitude()));
        } else {
            this._logger.severe('A failure occured in the drag event result.');
        }

    } // end left mouse button held down

    if (this.mouseDown[1]) {
        this._logger.fine("The center mouse button is pressed.");
    }

    if (this.mouseDown[2]) {
        this._logger.fine('The right mouse button is pressed.');

        var headingDirection = 1;

        if (this.domCanvas) {
            if (mouseEvent.clientY + document.body.scrollTop +
                document.documentElement.scrollTop - this.domCanvas.offsetTop <
                    this.domCanvas.height / 2) {

                headingDirection = -1;
            }
        }

        this.setViewAngle(view,
            this.computeNewViewHeading(view,
                this.computeViewAngleChange(headingDirection * mouseMove.getX(), false)),
            this.computeNewViewPitch(view,
                this.computeViewAngleChange(mouseMove.getY(), false))
        );
    }
};

/**
 * Compute a new view heading.
 *
 * @param {lanyard.View} view the view to use.
 * @param {lanyard.geom.Angle} change the angle to change by.
 * @return {lanyard.geom.Angle} the new view heading.
 */
lanyard.dom.InputHandler.prototype.computeNewViewHeading = function(view, change) {

    /** @type {number} */
    var degrees;

    if (this.viewTarget && this.viewTarget.heading) {
        degrees = this.viewTarget.heading.getDegrees();
    } else {
        degrees = view.getHeading().getDegrees();
    }

    degrees = degrees + change.getDegrees();

    if (degrees < 0) {
        degrees = degrees + 360;
    } else if (degrees > 360) {
        degrees = degrees - 360;
    }

    return lanyard.geom.Angle.prototype.fromDegrees(degrees);
};

/**
 * Set the view angle.
 *
 * @param {lanyard.View} view the current view.
 * @param {lanyard.geom.Angle} newHeading the new heading.
 * @param {lanyard.geom.Angle} newPitch the new pitch.
 */
lanyard.dom.InputHandler.prototype.setViewAngle = function(view, newHeading, newPitch) {

    if (!newHeading && !newPitch) {
        this._logger.severe('Attempted to set the view angle without a specified angle.');
    }

    this.viewTarget = this.viewTarget = new lanyard.dom.ViewProperties();
    this.viewTarget.heading = newHeading;
    this.viewTarget.pitch = newPitch;
    this.setViewProperties(view, this.viewTarget,
        this.viewAngleStepCoefficient, this.viewAngleErrorThreshold, false);
};

/**
 * Compute the view angle change.
 *
 * @param {number} factor the factor to change by.
 * @param {boolean} slow if true, go slow.
 * @return {lanyard.geom.Angle} the angle change.
 */
lanyard.dom.InputHandler.prototype.computeViewAngleChange = function(factor, slow) {
    return lanyard.geom.Angle.prototype.fromDegrees(factor * this.viewAngleChangeFactor * (slow ? 2.5e-1 : 1));
};

/**
 * Compute the new view pitch.
 *
 * @param {lanyard.View} view the view to use.
 * @param {lanyard.geom.Angle} change the angle to change by.
 * @return {lanyard.geom.Angle} the new view pitch.
 */
lanyard.dom.InputHandler.prototype.computeNewViewPitch = function(view, change) {
    /** @type {number} */
    var degrees;

    if (this.viewTarget && this.viewTarget.pitch) {
        degrees = this.viewTarget.pitch.getDegrees();
    } else {
        degrees = view.getPitch().getDegrees();
    }

    degrees = degrees + change.getDegrees();

    /** @type {Array.<lanyard.geom.Angle>} */
    var constraints = view.getPitchConstraints();

    /** @type {lanyard.geom.Angle} */
    var newViewPitch = lanyard.geom.Angle.prototype.fromDegrees(
        this.clamp(
            degrees, constraints[0].getDegrees(), constraints[1].getDegrees())
    );

    return newViewPitch;
};

/**
 * Set the view to the calculated latlon.
 *
 * @param {lanyard.View} view the view to use.
 * @param {lanyard.geom.LatLon} newLatLon the latlon to use.
 */
lanyard.dom.InputHandler.prototype.setViewLatLon = function(view, newLatLon) {
    if (!newLatLon) {
        this._logger.severe('Attempted to set the view to an invalid latlon.');
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
 * @return {lanyard.geom.LatLon} the computed latlon.
 */
lanyard.dom.InputHandler.prototype.computeViewLatLonChange = function(
        view, globe, latFactor, lonFactor, slow) {

    /** @type {lanyard.geom.Point} */
    var eye = view.getEyePoint();

    if (!eye) {
        this._logger.severe('Attempted to compute a latlon change without a valid eye.');
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
 * @param {lanyard.View} view the view to use.
 * @param {lanyard.geom.Angle} latChange the change in latitude.
 * @param {lanyard.geom.Angle} lonChange the change in longitude.
 * @return {lanyard.geom.LatLon} the computed latlon.
 */
lanyard.dom.InputHandler.prototype.computeNewViewLatLon = function(view, latChange, lonChange) {
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
 * @param {goog.events.MouseWheelEvent} mouseWheelEvent the mouse wheel event.
 */
lanyard.dom.InputHandler.prototype.mouseWheelMoved = function(mouseWheelEvent) {
    if (!this.lanyardCanvas) {
        this._logger.severe('A mouse wheel event was thrown away due to a missing event source.');
        return;
    }

    if (!mouseWheelEvent) {
        this._logger.severe('Attempted to handle an invalid mouse wheel event.');
        return;
    }

    // Prevent the mouse wheel from moving the window.
    mouseWheelEvent.preventDefault();

    /** @type {lanyard.View} */
    var view = this.lanyardCanvas.getView();

    if (!view) {
        this._logger.severe('Attempted to handle a mouse wheel event without a valid view.');
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
lanyard.dom.InputHandler.prototype.computeNewViewZoom = function(view, change) {
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
lanyard.dom.InputHandler.prototype.computeZoomViewChange = function(factor, slow) {
    return factor * this.viewZoomChangeFactor * (slow ? 2.5e-1 : 1.0);
};

/**
 * Set a zoom on the view.
 *
 * @param {lanyard.View} view the view to use.
 * @param {number} newZoom the new zoom to set things to.
 */
lanyard.dom.InputHandler.prototype.setViewZoom = function(view, newZoom) {
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
        function(view, newProperties, stepCoefficient, errorThreshold, forceSmooth) {

    if (!view) {
        this._logger.severe('Attempted to set properties on a null view.');
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

    // Trigger a repaint
    //this.lanyardCanvas.display(this);
};

/**
 * Clamp a value.
 *
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @return {number} the clamped value.
 */
lanyard.dom.InputHandler.prototype.clamp = function(x, min, max) {
    return x < min ? min : (x > max ? max : x);
};

/**
 * Add a position listener.
 *
 * @param {*} listener a position listener.
 */
lanyard.dom.InputHandler.prototype.addPositionListener = function(listener) {
    //this._logger.fine("Adding a new position listener.");

    if (!listener) {
        this._logger.severe('Attempted to add an invalid position listener.');
    }

    listener.isPositionListener = true;
    this.eventListeners.push(listener);
};

/**
 * Call the available position listeners.
 *
 * @param {lanyard.dom.PositionEvent} positionEvent the position event.
 */
lanyard.dom.InputHandler.prototype.callPositionListeners = function(positionEvent) {
    //this._logger.fine("Calling position listeners (" + this.eventListeners.length + ").");

    for (var i = 0; i < this.eventListeners.length; i = i + 1) {
        if (this.eventListeners[i].moved && this.eventListeners[i].isPositionListener) {
            this.eventListeners[i].moved(positionEvent);
        }
    }
};

/* EOF */
