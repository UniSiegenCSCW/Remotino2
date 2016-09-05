import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { sort } from 'ramda';
import Translate from 'react-translate-component';
import '../utils/l10n.js';
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
    // removeAllItems: PropTypes.func.isRequired,
    analogWrite: PropTypes.func.isRequired,
    digitalWrite: PropTypes.func.isRequired,
    changeMode: PropTypes.func.isRequired,
    fitTimeline: PropTypes.func.isRequired,
    setShowingTimeline: PropTypes.func.isRequired,
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
      // removeAllItems,
      fitTimeline,
      setShowingTimeline,
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
      const [head, ...tail] = sort((a, b) => (a.time - b.time), events);

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
      this.loop = setTimeout(startReplayWrapper, time);
      replayEvents(replay.events, replay.start, replay.end);
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
          <p className="link link--disabled">
            <FontAwesome name="circle" /> <Translate content="replay_controls.start_recording" />
          </p>
        );
      } else if (replay.recording) {
        return (
          <Link onClick={stopRecordingWrapper} className="link--red">
            <FontAwesome name="stop" /> <Translate content="replay_controls.stop_recording" />
          </Link>
        );
      } else {
        return (
          <Link onClick={startRecordingWrapper}>
            <FontAwesome name="circle" /> <Translate content="replay_controls.start_recording" />
          </Link>
        );
      }
    };

    const replayButton = () => {
      if (replay.recording) {
        return (
          <p className="link link--disabled">
            <FontAwesome name="play" /> <Translate content="replay_controls.start_replay" />
          </p>
        );
      } else if (replay.playing) {
        return (
          <Link onClick={stopReplayWrapper} >
            <FontAwesome name="stop" /> <Translate content="replay_controls.stop_replay" />
          </Link>
        );
      } else {
        return (
          <Link onClick={startReplayWrapper} >
            <FontAwesome name="play" /> <Translate content="replay_controls.start_replay" />
          </Link>
        );
      }
    };

    // const removeAllItemsButton = () => {
    //   if (replay.recording || replay.playing) {
    //     return (
    //       <p className="link link--disabled">
    //         <FontAwesome name="trash" /> <Translate content="replay_controls.clear_events" />
    //       </p>
    //     );
    //   } else {
    //     return (
    //       <Link onClick={removeAllItems} >
    //         <FontAwesome name="trash" /> <Translate content="replay_controls.clear_events" />
    //       </Link>
    //     );
    //   }
    // };
    //
    const visibilityControls = (e) => {
      if (e) {
        return (
          <Link className="" onClick={() => setShowingTimeline(false)}>
            <FontAwesome name="minus-square" /> <Translate content="timeline.hide" />
          </Link>
        );
      } else {
        return (
          <Link className="" onClick={() => setShowingTimeline(true)}>
            <FontAwesome name="plus-square" /> <Translate content="timeline.show" />
          </Link>
        );
      }
    };

    const fitTimelineWrapper = () => {
      if (replay.showingTimeline) {
        return (
          <Link onClick={fitTimeline}>
            <FontAwesome name="arrows-h" /> <Translate content="replay_controls.focus_events" />
          </Link>
        );
      } else {
        return null;
      }
    };

    return (
      <div className="replay-controls">
        {recordButton()}
        {replayButton()}
        {fitTimelineWrapper()}
        {visibilityControls(replay.showingTimeline)}
      </div>
    );
  }
}
