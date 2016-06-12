import React, { Component, PropTypes } from 'react';
import Pin from './Pin';
import Link from './Link';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import spinner from '../static-html/spinner.html';
import { defaultTo } from 'ramda';
import styles from './Microcontroller.sass'; // eslint-disable-line no-unused-vars
import { replayEvents } from '../utils/replayEvents';
import Timeline from './Timeline';

export default class Microcontroller extends Component {
  static propTypes = {
    changeMode: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
    connectToBoard: PropTypes.func.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
    listenToPinChanges: PropTypes.func.isRequired,
    digitalWrite: PropTypes.func.isRequired,
    analogWrite: PropTypes.func.isRequired,
    startRecording: PropTypes.func.isRequired,
    stopRecording: PropTypes.func.isRequired,
    pins: PropTypes.array.isRequired,
    connectionState: PropTypes.number.isRequired,
    mapping: PropTypes.object.isRequired,
    visibilityFilter: PropTypes.object.isRequired,
    replay: PropTypes.object.isRequired,
  };

  render() {
    const {
      changeMode,
      setEnabled,
      connectToBoard,
      listenToPinChanges,
      digitalWrite,
      analogWrite,
      startRecording,
      stopRecording,
      pins,
      connectionState,
      mapping,
      visibilityFilter,
      setVisibilityFilter,
      replay,
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

    const pinView = (pin) => {
      // TODO: Fix me
      const pinName = defaultTo(`Pin ${pin.id}`,
          mapping && mapping.pins && mapping.pins[pin.id] && mapping.pins[pin.id].name);
      const tags = defaultTo([],
          mapping && mapping.pins && mapping.pins[pin.id] && mapping.pins[pin.id].categories);
      return (
        <Pin
          key={pin.id}
          values={pin.values}
          name={pinName}
          tags={tags}
          changeMode={changeMode}
          setEnabled={setEnabled}
          digitalWrite={digitalWrite}
          analogWrite={analogWrite}
          pin={pin}
          listen={listenToPinChanges}
        />
      );
    };

    const options = {
      width: '100%',
      height: '200px',
      stack: true,
      showMajorLabels: true,
      showCurrentTime: true,
      zoomMin: 10 * 1000,
      type: 'background',
      format: {
        minorLabels: {
          minute: 'h:mma',
          hour: 'ha'
        }
      }
    };

    const items = replay.events.map((event, index) => ({
      id: index,
      start: new Date(event.timestamp),
      content: `Event ${index}`,
      type: 'point',
    }));

    return (
      <div id="main">
        <header>
          {connectView(connectionState)}
        </header>
        <div className="pin-list">
          {pins.map(pinView)}
        </div>
        <div className="replay">
          <div className="controls">
            <Link active={replay.recording} onClick={startRecording}>
              Record
            </Link>
            <Link active={!replay.recording} onClick={stopRecording}>
              Stop
            </Link>
            <Link active={false} onClick={() => replayEvents(replay.events, replay.start)}>
              Replay
            </Link>
          </div>
          <Timeline options={options} items={items} />
        </div>
      </div>
    );
  }
}
