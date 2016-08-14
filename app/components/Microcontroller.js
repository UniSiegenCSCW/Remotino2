import React, { Component, PropTypes } from 'react';
import Pin from '../containers/Pin';
import './Microcontroller.sass';
import Timeline from '../containers/Timeline';
import ImportExport from '../containers/ImportExport';
// import FontAwesome from 'react-fontawesome';

export default class Microcontroller extends Component {
  static propTypes = {
    pins: PropTypes.array.isRequired,
    visibilityFilter: PropTypes.object.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
  };

  render() {
    const {
      pins,
      visibilityFilter,
      setVisibilityFilter,
    } = this.props;

    const setFilter = (name) => (e) => setVisibilityFilter(name, e.target.checked);
    const {
      showDisabled,
      showDigitalIn,
      showAnalogIn,
      showDigitalOut,
      showAnalogOut,
    } = visibilityFilter;

    return (
      <div id="main">
        <header>
          <div className="header-left">
            <div>
              <div className="header--filter">
                <div className="filter-description">
                  <p>Filter Pins:</p>
                </div>
                <div className="filter-section">
                  <input
                    type="checkbox"
                    name="Disabled"
                    checked={showDisabled}
                    onChange={setFilter('showDisabled')}
                  />
                  Hidden
                </div>
                <div className="filter-section">
                  <div>
                    <input
                      type="checkbox" name="DigitalIn"
                      checked={showDigitalIn} onChange={setFilter('showDigitalIn')}
                    />
                    Digital In
                  </div>
                  <div>
                    <input
                      type="checkbox" name="DigitalOut"
                      checked={showDigitalOut} onChange={setFilter('showDigitalOut')}
                    />
                    Digital Out
                  </div>
                </div>
                <div className="filter-section">
                  <div>
                    <input
                      type="checkbox" name="AnalogIn"
                      checked={showAnalogIn} onChange={setFilter('showAnalogIn')}
                    />
                    Analog In
                  </div>
                  <div>
                    <input
                      type="checkbox" name="AnalogOut"
                      checked={showAnalogOut} onChange={setFilter('showAnalogOut')}
                    />
                    Analog Out
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="header-right">
            <ImportExport />
          </div>
        </header>
        <div className="pin-list">
          {pins.map((pin) => <Pin key={pin.id} pin={pin} />)}
        </div>
        <div className="replay">
          <Timeline />
        </div>
      </div>
    );
  }
}
