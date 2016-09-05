import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Timeline from '../components/Timeline';
import * as MicrocontrollerActions from '../actions/microcontroller';

function mapStateToProps(state) {
  const replay = state.replay;

  const items = replay.events.map((event, index) => ({
    id: index,
    start: event.time,
    content: event.description,
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

  return {
    items,
    options,
    start: state.replay.start,
    end: state.replay.end,
    showingTimeline: state.replay.showingTimeline,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);

