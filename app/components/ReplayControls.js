import React, { Component, PropTypes } from 'react';
import { replayEvents } from '../utils/replayEvents';
import Link from './Link';
import FontAwesome from 'react-fontawesome';

export default class ReplayControls extends Component {
  static propTypes = {
    replay: PropTypes.object.isRequired,
    startRecording: PropTypes.func.isRequired,
    stopRecording: PropTypes.func.isRequired,
    startReplay: PropTypes.func.isRequired,
    stopReplay: PropTypes.func.isRequired,
  };

  render() {
    const {
      startRecording,
      stopRecording,
      startReplay,
      stopReplay,
      replay,
    } = this.props;

    const recordButton = () => (
      !replay.recording ?
        <Link active={false} onClick={startRecording}>
          <FontAwesome name="circle" /> Record
        </Link> :
        <Link active={false} onClick={stopRecording}>
          <FontAwesome name="stop" /> Stop
        </Link>
    );

    const startReplayWrapper = () => {
      const time = replay.end - replay.start;
      const fn = () => replayEvents(replay.events, replay.start, replay.end);
      fn();
      this.loop = setInterval(fn, time);
      startReplay();
    };

    const stopReplayWrapper = () => {
      clearInterval(this.loop);
      this.playing = false;
      stopReplay();
    };

    const replayButton = () => (
      !replay.playing ?
        <Link active={false} onClick={startReplayWrapper} >
          <FontAwesome name="play" /> Replay
        </Link> :
        <Link active={false} onClick={stopReplayWrapper} >
          <FontAwesome name="pause" /> Pause
        </Link>
    );

    return (
      <div className="replay-controls">
        {recordButton()}
        {replayButton()}
      </div>
    );
  }
}
