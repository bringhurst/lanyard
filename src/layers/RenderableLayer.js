/*global goog, lanyard */
/*jslint white: false, onevar: false, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, sub: true, nomen: false */

goog.provide('lanyard.layers.RenderableLayer');

/**
 * Creates a new RenderableLayer with the specified delegateOwner.
 *
 * @param {lanyard.Layer|null} delegateOwner a layer that is this layer's delegate owner.
 */
lanyard.layers.RenderableLayer = function (delegateOwner) {
    /**
     * @private
     * @type {Array<lanyard.Renderable>}
     */
    this.renderables = [];

    /**
     * @private
     * @type {Array<lanyard.Renderable>}
     */
    this.renderablesOverride = [];

    // TODO
    // this.pickSupport = new PickSupport();

    /**
     * @private
     * @type {lanyard.Layer}
     */
    this.delegateOwner = delegateOwner;

    /** @private */ this._logger = goog.debug.Logger.getLogger('lanyard.layers.RenderableLayer');
};
goog.object.extend(lanyard.layers.RenderableLayer, lanyard.layers.AbstractLayer);

/**
 * Adds the specified renderable to this layer's internal collection.
 *
 * @param {lanyard.Renderable} renderable the renderable to add.
 */
lanyard.layers.RenderableLayer.prototype.addRenderable = function (renderable) {
    if (!renderable) {
        this._logger.severe("Renderable is null.");
    }

    if (this.renderablesOverride) {
        this._logger.severe("Layer is already using a custom iterable.");
    }

    this.renderables.push(renderable);
};

/**
 * Adds the contents of the specified renderables to this layer's internal collection.
 *
 * @param {Array<lanyard.Renderable>} renderables Renderables to add.
 */
lanyard.layers.RenderableLayer.prototype.addRenderables = function (rables) {
    if (!rables) {
        this._logger.severe("The new interable is null.");
    }

    if (this.renderablesOverride) {
        this._logger.severe("This layer is already using a custom iterable.");
    }

    for (var r in rables) {
        if (rables.hasOwnProperty(r)) {
            this.renderables.push(rables[r]);
        }
    }
};

/**
 * Clears the contents of this layer's internal Renderable collection.
 */
lanyard.layers.RenderableLayer.prototype.removeAllRenderables = function () {
    if (this.renderablesOverride) {
        this._logger.severe("This layer is using a custom iterable.");
    }

    this.renderables = [];
};

/**
 * Returns the Iterable of Renderables currently in use by this layer.
 *
 * @return {Array<lanyard.Renderable>} currently active Renderables.
 */
lanyard.layers.RenderableLayer.prototype.getRenderables = function () {
    return this.getActiveRenderables();
};

/**
 * Returns the Iterable of currently active Renderables.
 *
 * @private
 * @return {Array<lanyard.Renderable>} the currently active Renderables.
 */
lanyard.layers.RenderableLayer.prototype.getActiveRenderables = function () {
    if (this.renderablesOverride) {
        return this.renderablesOverride;
    } else {
        return this.renderables;
    }
};

/**
 * Overrides the collection of currently active Renderables with the specified renderableIterable. 
 *
 * If the specified renderableIterable is null, this layer will revert to maintaining its internal
 * collection.
 *
 * @param {Object} renderableIterable Iterable to use instead of this layer's internal collection.
 */
lanyard.layers.RenderableLayer.prototype.setRenderables = function (renderableIterable) {
    this.renderablesOverride = renderableIterable;

    // Clear the internal collection of Renderables.
    this.renderables = [];
};


/**
 * Do the actual render of this layer.
 *
 * @param {lanyard.DrawContext} dc the currently active draw context.
 */
lanyard.layers.RenderableLayer.prototype.doRender = function (dc) {
    /** @type {Array<lanyard.Renderable>} */
    var activeRenderables = this.getActiveRenderables();

    for (var r in activeRenderables) {
        if (activeRenderables.hasOwnProperty(r)) { 
            r.render(dc);
        }
    }
};

/**
 * Returns this layer's delegate owner, or null if none has been specified.
 *
 * @return {lanyard.Layer} the layer that is this layer's delegate owner.
 */
lanyard.layers.RenderableLayer.prototype.getDelegateOwner = function () {
    return this.delegateOwner;
};

/**
 * Returns a short description of this layer.
 *
 * @return {String} a description of this layer.
 */
lanyard.layers.RenderableLayer.prototype.toString = function () {
    return "A generic renderable layer.";
};

/* EOF */
