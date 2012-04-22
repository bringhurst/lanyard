/*global goog, lanyard */

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

goog.provide('lanyard.demo.StatusBar');



/**
 * A basic status bar.
 *
 * @constructor
 * @param {Element} latElement the div where the latitude value is set to.
 * @param {Element} lonElement the div where the longitude value is set to.
 * @param {Element} eleElement the div where the elevation value is set to.
 * @param {Element} zoomElement the div where the zoom value is set to.
 */
lanyard.demo.StatusBar = function(latElement, lonElement, eleElement, zoomElement) {
  this._logger = goog.debug.Logger.getLogger('lanyard.demo.StatusBar');

  /** @type {lanyard.LanyardCanvas} */
  this.eventSource = null;

  this.latDisplay = latElement;
  this.lonDisplay = lonElement;
  this.eleDisplay = eleElement;
  this.zoomDisplay = zoomElement;
};
goog.exportSymbol('lanyard.demo.StatusBar', lanyard.demo.StatusBar);


/**
 * Set the event source of the status bar.
 *
 * @param {lanyard.LanyardCanvas} newEventSource the lanyard canvas event source.
 */
lanyard.demo.StatusBar.prototype.setEventSource = function(newEventSource) {

  if (!newEventSource) {
    this._logger.severe('Attempted to use an invalid event source.');
  }

  newEventSource.getInputHandler().addPositionListener(this);
  this.eventSource = newEventSource;
};


/**
 * Get a reference to the current event source.
 *
 * @return {lanyard.LanyardCanvas} the current event source.
 */
lanyard.demo.StatusBar.prototype.getEventSource = function() {
  return this.eventSource;
};


/**
 * The callback for the input handler.
 *
 * @param {lanyard.dom.PositionEvent} positionEvent the position event.
 */
lanyard.demo.StatusBar.prototype.moved = function(positionEvent) {
  this.handleCursorPositionChange(positionEvent);
};


/**
 * Display the information from the position event.
 *
 * @param {lanyard.dom.PositionEvent} positionEvent the position event.
 */
lanyard.demo.StatusBar.prototype.handleCursorPositionChange = function(positionEvent) {
  /** @type {lanyard.geom.Position} */
  var newPos = positionEvent.getPosition();

  if (newPos) {
    this.latDisplay.innerHTML = newPos.getLatitude().getDegrees().toFixed(5);
    this.lonDisplay.innerHTML = newPos.getLongitude().getDegrees().toFixed(5);
    this.eleDisplay.innerHTML = Math.round(newPos.getElevation());
  } else {
    this.latDisplay.innerHTML = 'Off globe';
    this.lonDisplay.innerHTML = 'Off globe';
    this.eleDisplay.innerHTML = 'Off globe';
  }
};

/* EOF */
