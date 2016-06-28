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
    replay: PropTypes.object.isRequired,
    visibilityFilter: PropTypes.object.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
    addReplayEvent: PropTypes.func.isRequired,
    startRecording: PropTypes.func.isRequired,
    stopRecording: PropTypes.func.isRequired,
  };

  render() {
    const {
      changeMode,
      pins,
      visibilityFilter,
      setVisibilityFilter,
      setEnabled,
      addReplayEvent,
      replay,
      startRecording,
      stopRecording,
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
            startRecording();
            config.replay.events.forEach((replayEvent) => {
              addReplayEvent(replayEvent.replay,
                             replayEvent.description,
                             new Date(replayEvent.time));
            });
            stopRecording();
            // changeRange(config.replay.start, config.replay.end);
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
        replay,
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
        <Link onClick={handleImport}>
          <FontAwesome name="upload" /> Import
        </Link>
        <Link onClick={handleExport}>
          <FontAwesome name="download" /> Export
        </Link>
      </div>
    );
  }
}
