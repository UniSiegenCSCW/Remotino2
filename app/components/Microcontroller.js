import React, { Component, PropTypes } from 'react';
import Pin from '../containers/Pin';
import './Microcontroller.sass';
import Timeline from '../containers/Timeline';
import ImportExport from '../containers/ImportExport';

export default class Microcontroller extends Component {
  static propTypes = {
    pins: PropTypes.array.isRequired,
    mapping: PropTypes.object.isRequired,
    visibilityFilter: PropTypes.object.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
  };

  render() {
    const {
      pins,
      mapping,
      visibilityFilter,
      setVisibilityFilter,
    } = this.props;

    const setFilter = (name) => (e) => setVisibilityFilter(name, e.target.checked);
    const { showDisabled, showDigital, showAnalog } = visibilityFilter;

    return (
      <div id="main">
        <header>
          <div className="header-left">
            <div>
              <div className="header--connection">
                <p>{`Connected to ${mapping.name}`}</p>
              </div>
              <div className="header--filter">
                <p>
                  Show Pins:
                  {" "}
                  <input
                    type="checkbox"
                    name="Disabled"
                    checked={showDisabled}
                    onChange={setFilter('showDisabled')}
                  />
                  Hidden
                  <span style={{ marginRight: '1em', display: 'inline' }} />
                  <input
                    type="checkbox"
                    name="Digital"
                    checked={showDigital}
                    onChange={setFilter('showDigital')}
                  />
                  Digital
                  <input
                    type="checkbox"
                    name="Analog"
                    checked={showAnalog}
                    onChange={setFilter('showAnalog')}
                  />
                  Analog
                </p>
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
