import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { uniq } from 'ramda';
import Timeline from '../components/Timeline';
import * as MicrocontrollerActions from '../actions/microcontroller';
import * as ReplayActions from '../actions/replay';

function mapStateToProps(state) {
  const replay = state.replay;

  const items = replay.events.map((event, index) => ({
    id: index,
    start: event.time,
    content: event.description,
    group: event.replay.id,
    // type: 'point',
  }));

  const options = {
    width: '100%',
    height: '200px',
    showCurrentTime: false,
    zoomMin: 100,
    zoomMax: 1000 * 60 * 30, // 30 minutes
    editable: {
      add: false,
      updateTime: true,
      updateGroup: false,
      remove: true
    },
    snap: (date, scale) => {
      const factors = {
        millisecond: 20,
        second: 100,
        minute: 5 * 1000,
        hour: 10 * 60 * 1000,
        weekday: 60 * 60 * 1000,
        day: 60 * 60 * 1000,
        month: 60 * 60 * 1000,
        year: 60 * 60 * 1000
      };

      return Math.round(date / factors[scale]) * factors[scale];
    }
  };

  const usedPinIds = uniq(replay.events.map((event) => (event.replay.id)));

  const groups = [];
  usedPinIds.forEach((id) => groups.push({ id, content: state.pins[id].name }));
  groups.push({ id: -1, content: 'Replay' });

  return {
    items,
    options,
    groups,
    start: state.replay.start,
    end: state.replay.end,
    showingTimeline: state.replay.showingTimeline,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, MicrocontrollerActions, ReplayActions), dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);

