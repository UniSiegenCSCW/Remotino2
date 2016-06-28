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
    const { enabled, digital, analog } = visibilityFilter;

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
                  Filter by:
                  {" "}
                  <input
                    type="checkbox"
                    name="Enabled"
                    checked={enabled}
                    onChange={setFilter('enabled')}
                  />
                  Enabled
                  <input
                    type="checkbox"
                    name="Digital"
                    checked={digital}
                    onChange={setFilter('digital')}
                  />
                  Digital
                  <input
                    type="checkbox"
                    name="Analog"
                    checked={analog}
                    onChange={setFilter('analog')}
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
