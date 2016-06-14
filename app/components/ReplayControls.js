import React, { Component, PropTypes } from 'react';
import { replayEvents } from '../utils/replayEvents';
import Link from './Link';

export default class ReplayControls extends Component {
  static propTypes = {
    replay: PropTypes.object.isRequired,
    startRecording: PropTypes.func.isRequired,
    stopRecording: PropTypes.func.isRequired,
  };

  render() {
    const {
      startRecording,
      stopRecording,
      replay,
    } = this.props;

    return (
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
    );
  }
}
