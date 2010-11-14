/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.dom.InputHandler');

goog.require('goog.debug.Logger');
goog.require('goog.events.MouseWheelHandler');

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
    this.lastMousePoint = new lanyard.util.Point();

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
    var mwh  = new goog.events.MouseWheelHandler(domCanvas);
    goog.events.listen(
        new goog.events.MouseWheelHandler(domCanvas),
        goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
        this.mouseWheelMoved,
        false,
        this
    );

    // Remove the mouse wheel listener when the map goes away.
    goog.events.listen(domCanvas, 'unload', function(e) {
        goog.events.unlisten(mwh,
        goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
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
    mouseWheelEvent.stopPropagation();

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
