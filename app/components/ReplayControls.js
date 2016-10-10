import React, { Component, PropTypes } from 'react';
import { sort } from 'ramda';
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

    const { showingTimeline, recording, playing } = replay;

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

    const startReplayElem = () => {
      const time = replay.end - replay.start;
      this.loop = setTimeout(startReplayElem, time);
      replayEvents(replay.events, replay.start, replay.end);
      startReplay();
    };

    const stopReplayElem = () => {
      clearInterval(this.loop);
      this.playing = false;
      stopReplay();
    };

    const startRecordingElem = () => {
      stopReplayElem();
      startRecording();
    };

    const stopRecordingElem = () => {
      stopRecording();
      setTimeout(fitTimeline, 100);
    };

    const recordButton = recording ?
      <Link
        onClick={stopRecordingElem} className="link--red" icon="stop"
        content="replay_controls.stop_recording"
      /> :
      <Link
        onClick={startRecordingElem} enabled={!playing} icon="circle"
        content="replay_controls.start_recording"
      />;

    const replayButton = playing ?
      <Link onClick={stopReplayElem} icon="stop" content="replay_controls.stop_replay" /> :
      <Link
        onClick={startReplayElem} enabled={!recording} icon="play"
        content="replay_controls.start_replay"
      />;

    // const removeAllItemsButton =
    //   <Link onClick={removeAllItems} enabled={!(recording || playing)} >
    //     <FontAwesome name="trash" /> <Translate content="replay_controls.clear_events" />
    //   </Link>;

    const toggleShowingTimeline = () => setShowingTimeline(!showingTimeline);

    const visibilityControls = showingTimeline ?
      <Link onClick={toggleShowingTimeline} icon="minus-square" content="timeline.hide" /> :
      <Link onClick={toggleShowingTimeline} icon="plus-square" content="timeline.show" />;

    const fitTimelineElem = (
      <Link onClick={fitTimeline} icon="arrows-h" content="replay_controls.focus_events" />
    );

    return (
      <div className="replay-controls">
        {recordButton}
        {replayButton}
        {showingTimeline ? fitTimelineElem : null}
        {visibilityControls}
      </div>
    );
  }
}
