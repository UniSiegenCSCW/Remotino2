import React, { Component, PropTypes } from 'react';
import Pin from '../containers/Pin';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import spinner from '../static-html/spinner.html';
import './Microcontroller.sass';
import Timeline from '../containers/Timeline';
import Link from '../components/Link';
import { map, pick } from 'ramda';
import FontAwesome from 'react-fontawesome';

import { remote } from 'electron';
const { dialog } = remote;
import jsonfile from 'jsonfile';

export default class Microcontroller extends Component {
  static propTypes = {
    connectToBoard: PropTypes.func.isRequired,
    connectionState: PropTypes.number.isRequired,
    pins: PropTypes.array.isRequired,
    mapping: PropTypes.object.isRequired,
    visibilityFilter: PropTypes.object.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
  };

  render() {
    const {
      connectToBoard,
      connectionState,
      pins,
      mapping,
      visibilityFilter,
      setVisibilityFilter,
      setEnabled,
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
              <p><span dangerouslySetInnerHTML={{ __html: spinner }} /> Connecting...</p>
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

    const handleImport = () => {
      const file = dialog.showOpenDialog({ properties: ['openFile'] })[0];
      if (file) {
        jsonfile.readFile(file, (err, config) => {
          if (err) {
            // TODO: use error dialogs
            console.error(err);
          } else {
            config.pins.forEach((pin) => setEnabled(pin.id, pin.enabled));
            Object.keys(config.visibilityFilter).forEach(
              (key) => setVisibilityFilter(key, config.visibilityFilter[key])
            );
          }
        });
      }
    };

    const handleExport = () => {
      const config = {
        pins: map(pick(['id', 'enabled']), pins),
        visibilityFilter,
      };
      const file = dialog.showSaveDialog({ properties: ['openFile'] });
      if (file) {
        jsonfile.writeFile(file, config, (err) => {
          // TODO: use error dialogs
          if (err) {
            console.error(err);
          }
        });
      }
    };

    return (
      <div id="main">
        <header>
          <div className="header-left">
            {connectView(connectionState)}
          </div>
          <div className="header-right">
            <Link active={false} onClick={handleImport}>
              <FontAwesome name="upload" /> Import
            </Link>
            <Link active={false} onClick={handleExport}>
              <FontAwesome name="download" /> Export
            </Link>
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
