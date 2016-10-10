import React, { Component, PropTypes } from 'react';
import fs from 'fs';
import { map, pick, values } from 'ramda';
import { remote } from 'electron';
import jsonfile from 'jsonfile';
import '../utils/l10n.js';
import Link from '../components/Link';
import { getFullCode } from '../utils/ino';

const { dialog } = remote;

export default class Microcontroller extends Component {
  static propTypes = {
    changeMode: PropTypes.func.isRequired,
    changeRange: PropTypes.func.isRequired,
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
      changeRange,
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
              if (pins[configPin.id].enabled !== configPin.enabled) {
                setEnabled(configPin.id, configPin.enabled);
              }
              if (pins[configPin.id].mode !== configPin.mode) {
                changeMode(pins[configPin.id], configPin.mode);
              }
            });
            startRecording();
            config.replay.events.forEach((replayEvent) => {
              addReplayEvent(replayEvent.replay,
                             replayEvent.description,
                             new Date(replayEvent.time));
            });
            stopRecording();
            changeRange(new Date(config.replay.start), new Date(config.replay.end));
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

    const handleInoExport = () => {
      const file = dialog.showSaveDialog({
        filters: [
          { name: 'Configuration Files', extensions: ['ino'] },
        ]
      });

      if (file) {
        fs.writeFile(file, getFullCode(pins), (err) => {
          // TODO: use error dialogs
          if (err) {
            console.error(err);
          }
        });
      }
    };

    return (
      <div className="header-right">
        <Link onClick={handleInoExport} icon="download" content="import_export.export" />
        <Link onClick={handleImport} icon="upload" content="import_export.load" />
        <Link onClick={handleExport} icon="download" content="import_export.save" />
      </div>
    );
  }
}
