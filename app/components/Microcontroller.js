import React, { Component, PropTypes } from 'react';
import Pin from '../containers/Pin';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import './Microcontroller.sass';
import Timeline from '../containers/Timeline';
import ImportExport from '../containers/ImportExport';
import FontAwesome from 'react-fontawesome';

export default class Microcontroller extends Component {
  static propTypes = {
    connectToBoard: PropTypes.func.isRequired,
    connectionState: PropTypes.number.isRequired,
    pins: PropTypes.array.isRequired,
    mapping: PropTypes.object.isRequired,
    visibilityFilter: PropTypes.object.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
  };

  render() {
    const {
      connectToBoard,
      connectionState,
      pins,
      mapping,
      visibilityFilter,
      setVisibilityFilter,
    } = this.props;

    const connectView = (currentState) => {
      switch (currentState) {
        case CONNECTION_STATE.NOT_CONNECTED:
          return (
            <div className="header--connection">
              <button
                className="button-submit"
                onClick={connectToBoard}
              >
              Connect to Arduino
              </button>
            </div>
          );
        case CONNECTION_STATE.CONNECTING:
          return (
            <div className="header--connection">
              <p>
                <FontAwesome spin name="spinner" /> Connecting...
              </p>
            </div>
          );
        default:
          return (
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
                    checked={visibilityFilter.enabled}
                    onChange={(e) => setVisibilityFilter('enabled', e.target.checked)}
                  />
                  Enabled
                  <input
                    type="checkbox"
                    name="Digital"
                    checked={visibilityFilter.digital}
                    onChange={(e) => setVisibilityFilter('digital', e.target.checked)}
                  />
                  Digital
                  <input
                    type="checkbox"
                    name="Analog"
                    checked={visibilityFilter.analog}
                    onChange={(e) => setVisibilityFilter('analog', e.target.checked)}
                  />
                  Analog
                </p>
              </div>
            </div>
          );
      }
    };

    return (
      <div id="main">
        <header>
          <div className="header-left">
            {connectView(connectionState)}
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
