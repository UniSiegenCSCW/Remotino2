import Timeline from '../components/Timeline';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  const replay = state.replay;

  const items = replay.events.map((event, index) => ({
    id: index,
    start: event.time,
    content: event.description,
    type: 'point',
  }));

  const options = {
    width: '100%',
    height: '200px',
    // start: new Date() / 1.0,
    // end: (new Date() / 1.0) + 600000,
    showCurrentTime: false,
    zoomMin: 100,
    zoomMax: 1000 * 60 * 30, // 30 minutes
  };

  return {
    items,
    options,
    start: state.replay.start,
    end: state.replay.end,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);

