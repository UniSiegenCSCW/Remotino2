import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import Link from './Link';
import {
  CHANGE_MODE,
  ANALOG_WRITE,
  DIGITAL_WRITE,
} from '../actions/microcontroller';

export default class ReplayControls extends Component {
  static propTypes = {
    replay: PropTypes.object.isRequired,
    startRecording: PropTypes.func.isRequired,
    stopRecording: PropTypes.func.isRequired,
    startReplay: PropTypes.func.isRequired,
    stopReplay: PropTypes.func.isRequired,
    removeAllItems: PropTypes.func.isRequired,
    analogWrite: PropTypes.func.isRequired,
    digitalWrite: PropTypes.func.isRequired,
    changeMode: PropTypes.func.isRequired,
    fitTimeline: PropTypes.func.isRequired,
  };

  render() {
    const {
      startRecording,
      stopRecording,
      startReplay,
      stopReplay,
      replay,
      digitalWrite,
      analogWrite,
      changeMode,
      removeAllItems,
      fitTimeline,
    } = this.props;

    const replayEvent = (event) => {
      switch (event.type) {
        case DIGITAL_WRITE:
          digitalWrite(event.id, event.value, event.name, false);
          break;
        case ANALOG_WRITE:
          analogWrite(event.id, event.value, event.name, false);
          break;
        case CHANGE_MODE:
          changeMode(event.pin, event.mode, event.name, false);
          break;
        default:
          break;
      }
    };

    const replayEvents = (events, start, end) => {
      const [head, ...tail] = events;

      // Exit condition, no events
      if (head === undefined) return;

      if (head.time >= start && head.time <= end) {
        const delay = head.time - start;
        setTimeout(() => {
          replayEvent(head.replay);
          replayEvents(tail, head.time, end);
        }, delay);
      } else {
        replayEvents(tail, start, end);
      }
    };

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

    const startRecordingWrapper = () => {
      stopReplayWrapper();
      startRecording();
    };

    const stopRecordingWrapper = () => {
      stopRecording();
      setTimeout(fitTimeline, 100);
    };

    const recordButton = () => {
      if (replay.playing) {
        return (
          <p className="link link--disabled"><FontAwesome name="circle" /> Start Recording</p>
        );
      } else if (replay.recording) {
        return (
          <Link onClick={stopRecordingWrapper} className="link--red">
            <FontAwesome name="stop" /> Stop Recording
          </Link>
        );
      } else {
        return (
          <Link onClick={startRecordingWrapper}>
            <FontAwesome name="circle" /> Start Recording
          </Link>
        );
      }
    };

    const replayButton = () => {
      if (replay.recording) {
        return (
          <p className="link link--disabled"><FontAwesome name="play" /> Play</p>
        );
      } else if (replay.playing) {
        return (
          <Link onClick={stopReplayWrapper} >
            <FontAwesome name="stop" /> Stop
          </Link>
        );
      } else {
        return (
          <Link onClick={startReplayWrapper} >
            <FontAwesome name="play" /> Play
          </Link>
        );
      }
    };

    const removeAllItemsButton = () => {
      if (replay.recording || replay.playing) {
        return (
          <p className="link link--disabled"><FontAwesome name="trash" /> Clear events</p>
        );
      } else {
        return (
          <Link onClick={removeAllItems} >
            <FontAwesome name="trash" /> Clear events
          </Link>
        );
      }
    };

    return (
      <div className="replay-controls">
        {recordButton()}
        {replayButton()}
        {removeAllItemsButton()}
        <Link onClick={fitTimeline}>
          <FontAwesome name="arrows-h" /> Focus recorded events
        </Link>
      </div>
    );
  }
}
