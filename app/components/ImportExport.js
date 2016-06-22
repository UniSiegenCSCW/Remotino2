import React, { Component, PropTypes } from 'react';
import Link from '../components/Link';
import { map, pick, values } from 'ramda';
import FontAwesome from 'react-fontawesome';

import { remote } from 'electron';
const { dialog } = remote;
import jsonfile from 'jsonfile';

export default class Microcontroller extends Component {
  static propTypes = {
    changeMode: PropTypes.func.isRequired,
    pins: PropTypes.object.isRequired,
    visibilityFilter: PropTypes.object.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
  };

  render() {
    const {
      changeMode,
      pins,
      visibilityFilter,
      setVisibilityFilter,
      setEnabled,
    } = this.props;

    const handleImport = () => {
      const file = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Configuration Files', extensions: ['json'] },
        ]
      })[0];

      if (file) {
        jsonfile.readFile(file, (err, config) => {
          if (err) {
            // TODO: use error dialogs
            console.error(err);
          } else {
            config.pins.forEach((configPin) => {
              setEnabled(configPin.id, configPin.enabled);
              changeMode(pins[configPin.id], configPin.mode);
            });
            Object.keys(config.visibilityFilter).forEach(
              (key) => setVisibilityFilter(key, config.visibilityFilter[key])
            );
          }
        });
      }
    };

    const handleExport = () => {
      const config = {
        pins: map(pick(['id', 'enabled', 'mode']), values(pins)),
        visibilityFilter,
      };
      const file = dialog.showSaveDialog({
        filters: [
          { name: 'Configuration Files', extensions: ['json'] },
        ]
      });

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
      <div className="header-right">
        <Link active={false} onClick={handleImport}>
          <FontAwesome name="upload" /> Import
        </Link>
        <Link active={false} onClick={handleExport}>
          <FontAwesome name="download" /> Export
        </Link>
      </div>
    );
  }
}
