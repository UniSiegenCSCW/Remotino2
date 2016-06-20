import React, { Component, PropTypes } from 'react';
import { replayEvents } from '../utils/replayEvents';
import Link from './Link';
import FontAwesome from 'react-fontawesome';

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

    const button = () => {
      if (!replay.recording) {
        return (
          <Link active={false} onClick={startRecording}>
            <FontAwesome name="circle" /> Record
          </Link>
        );
      } else {
        return (
          <Link active={false} onClick={stopRecording}>
            <FontAwesome name="stop" /> Stop
          </Link>
        );
      }
    };

    return (
      <div className="replay-controls">
        {button()}
        <Link
          active={false}
          onClick={() => replayEvents(replay.events, replay.start, replay.end)}
        >
          <FontAwesome name="play" /> Replay
        </Link>
      </div>
    );
  }
}
