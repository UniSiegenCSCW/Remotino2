import React, { Component, PropTypes } from 'react';
import { sort } from 'ramda';
import '../utils/l10n';
import { timestamp } from '../utils/utils';
import Link from './Link';
import {
//  CHANGE_MODE,
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
//    changeMode: PropTypes.func.isRequired,
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
//      changeMode,
      ui,
      // removeAllItems,
//      fitTimeline,
//      setShowingTimeline,
    } = this.props;

    this.autoscroll = ui.autoscroll;
    this.interval = ui.interval;

    const replayEvent = (event) => {
      switch (event.type) {
        case DIGITAL_WRITE:
          digitalWrite(event.pinId, event.value);
          break;
        case ANALOG_WRITE:
          analogWrite(event.pinId, event.value);
          break;
//        case CHANGE_MODE:
//          changeMode(event.pin, event.mode, event.name, false);
//          break;
        default:
          break;
      }
    };

    const replayEvents = (events, start, end) => {
      const [head, ...tail] = events;
//      const [head, ...tail] = events;

      // Exit condition, no events
      if (head === undefined || !this.playing) return;
      if (head.timestamp >= start && head.timestamp <= end) {
        const delay = head.timestamp - start;
        // we need this value to reduce the lag,
        // especially during analog playbacks
        const lag = Date.now() - this.startTime;
        this.startTime = Date.now() + (delay - lag);
        this.pending = setTimeout(() => {
          replayEvent(head.replay);
          replayEvents(tail, head.timestamp, end);
        }, delay - lag);
        // a quick fix to match the visual representation if start and end values are different
      } else if (head.timestamp < start
        && tail[0] !== undefined
        && tail[0].timestamp >= start) {
        replayEvent(head.replay);
        replayEvents(tail, start, end);
      } else {
        replayEvents(tail, start, end);
      }
    };

    const startReplayElem = () => {
      clearTimeout(this.loop);
      clearInterval(this.pending);

      const events = sort((a, b) => (a.timestamp - b.timestamp), replay.events);
      this.playing = true;
      this.startTime = Date.now();

      let start = this.interval[0];
      let end = this.interval[1];
      const time = end - start;
      if (this.autoscroll) {
        end = timestamp();
        start = end - time;
      }
      this.loop = setTimeout(startReplayElem, time);
      replayEvents(events, start, end);
      startReplay(start, end);
    };

    const stopReplayElem = () => {
      clearTimeout(this.loop);
      clearInterval(this.pending);
      this.playing = false;
      stopReplay();
    };

//    const startRecordingElem = () => {
//      stopReplayWrapper();
//      startRecording();
//    };

//    const stopRecordingElem = () => {
//      stopRecording();
//      setTimeout(fitTimeline, 100);
//    };

//    const recordButton = recording ?
//      <Link
//        onClick={stopRecordingElem} className="link--red" icon="stop"
//        content="replay_controls.stop_recording"
//      /> :
//        <Link
//          onClick={startRecordingElem} enabled={!playing} icon="circle"
//          content="replay_controls.start_recording"
//        />;

    const replayButton = replay.playing ?
       (<Link onClick={stopReplayElem} icon="stop" content="replay_controls.stop_replay" />) :
        (<Link
          onClick={startReplayElem} enabled={!replay.recording}
          icon="play" content="replay_controls.start_replay"
        />);

    // const removeAllItemsButton =
    //   <Link onClick={removeAllItems} enabled={!(replay.recording || replay.playing)} >
    //     <FontAwesome name="trash" /> <Translate content="replay_controls.clear_events" />
    //   </Link>;

//    const toggleShowingTimeline = () => setShowingTimeline(!showingTimeline);

//    const visibilityControls = showingTimeline ?
//      <Link onClick={toggleShowingTimeline} icon="minus-square" content="timeline.hide" /> :
//        <Link onClick={toggleShowingTimeline} icon="plus-square" content="timeline.show" />;

//    const fitTimelineElem = (
//      <Link onClick={fitTimeline} icon="arrows-h" content="replay_controls.focus_events" />
//    );

    return (
      <div className="replay-controls">
        {replayButton}
      </div>
    );
  }
}
