import React, { Component, PropTypes } from 'react';
import Pin from '../containers/Pin';
import Link from './Link';
import { CONNECTION_STATE } from '../reducers/microcontrollerEnums';
import spinner from '../static-html/spinner.html';
import './Microcontroller.sass';
import { replayEvents } from '../utils/replayEvents';
import Timeline from '../containers/Timeline';

export default class Microcontroller extends Component {
  static propTypes = {
    connectToBoard: PropTypes.func.isRequired,
    setVisibilityFilter: PropTypes.func.isRequired,
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
      connectToBoard,
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

    return (
      <div id="main">
        <header>
          {connectView(connectionState)}
        </header>
        <div className="pin-list">
          {pins.map((pin) => <Pin key={pin.id} pin={pin} />)}
        </div>
        <div className="replay">
          <div className="controls">
            <Link active={replay.recording} onClick={startRecording}>
              Record
            </Link>
            <Link active={!replay.recording} onClick={stopRecording}>
              Stop
            </Link>
            <Link
              active={false}
              onClick={() => replayEvents(replay.events, replay.start, replay.end)}
            >
              Replay
            </Link>
          </div>
          <Timeline />
        </div>
      </div>
    );
  }
}
