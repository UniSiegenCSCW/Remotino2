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
    ui: PropTypes.object.isRequired,
//    startRecording: PropTypes.func.isRequired,
//    stopRecording: PropTypes.func.isRequired,
    startReplay: PropTypes.func.isRequired,
    stopReplay: PropTypes.func.isRequired,
    // removeAllItems: PropTypes.func.isRequired,
    analogWrite: PropTypes.func.isRequired,
    digitalWrite: PropTypes.func.isRequired,
    changeMode: PropTypes.func.isRequired,
//    fitTimeline: PropTypes.func.isRequired,
//    setShowingTimeline: PropTypes.func.isRequired,
  };

  render() {
    const {
//      startRecording,
//      stopRecording,
      startReplay,
      stopReplay,
      replay,
      digitalWrite,
      analogWrite,
      changeMode,
      ui,
      // removeAllItems,
//      fitTimeline,
//      setShowingTimeline,
    } = this.props;

    const replayEvent = (event) => {
      switch (event.type) {
        case DIGITAL_WRITE:
          digitalWrite(event.pinId, event.value);
          break;
        case ANALOG_WRITE:
          analogWrite(event.pinId, event.value);
          break;
        default:
          break;
      }
    };

    const replayEvents = (events, start, end) => {
      const [head, ...tail] = sort((a, b) => (a.timestamp - b.timestamp), events);

      // Exit condition, no events
      if (head === undefined || !this.playing) return;

      if (head.timestamp >= start && head.timestamp <= end) {
        const delay = head.timestamp - start;
        this.pending = setTimeout(() => {
          replayEvent(head.replay);
          replayEvents(tail, head.timestamp, end);
        }, delay);
      } else {
        replayEvents(tail, start, end);
      }
    };

    const startReplayWrapper = () => {
      this.playing = true;
      const time = ui.interval[1] - ui.interval[0];
      this.loop = setTimeout(startReplayWrapper, time);
      replayEvents(replay.events, ui.interval[0], ui.interval[1]);
      startReplay();
    };

    const stopReplayWrapper = () => {
      clearTimeout(this.loop);
      clearInterval(this.pending);
      this.playing = false;
      stopReplay();
    };

//    const startRecordingWrapper = () => {
//      stopReplayWrapper();
//      startRecording();
//    };

//    const stopRecordingWrapper = () => {
//      stopRecording();
//      setTimeout(fitTimeline, 100);
//    };

//    const recordButton = replay.recording ?
//      (<Link onClick={stopRecordingWrapper} className="link--red">
//        <FontAwesome name="stop" /> <Translate content="replay_controls.stop_recording" />
//      </Link>) :
//        (<Link onClick={startRecordingWrapper} enabled={!replay.playing}>
//          <FontAwesome name="circle" /> <Translate content="replay_controls.start_recording" />
//        </Link>);

    const replayButton = replay.playing ?
      (<Link onClick={stopReplayWrapper} >
        <FontAwesome name="stop" /> <Translate content="replay_controls.stop_replay" />
      </Link>) :
        (<Link onClick={startReplayWrapper} enabled={!replay.recording}>
          <FontAwesome name="play" /> <Translate content="replay_controls.start_replay" />
        </Link>);

    // const removeAllItemsButton =
    //   <Link onClick={removeAllItems} enabled={!(replay.recording || replay.playing)} >
    //     <FontAwesome name="trash" /> <Translate content="replay_controls.clear_events" />
    //   </Link>;

//    const visibilityControls = replay.showingTimeline ?
//      (<Link className="" onClick={() => setShowingTimeline(false)}>
//        <FontAwesome name="minus-square" /> <Translate content="timeline.hide" />
//      </Link>) :
//      (<Link className="" onClick={() => setShowingTimeline(true)}>
//        <FontAwesome name="plus-square" /> <Translate content="timeline.show" />
//      </Link>);

//    const fitTimelineWrapper = replay.showingTimeline ?
//      (<Link onClick={fitTimeline}>
//        <FontAwesome name="arrows-h" /> <Translate content="replay_controls.focus_events" />
//      </Link>) :
//      null;

    return (
      <div className="replay-controls">
        {replayButton}
      </div>
    );
  }
}
