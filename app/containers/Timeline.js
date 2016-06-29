import Timeline from '../components/Timeline';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  const replay = state.microcontroller.replay;

  const items = replay.events.map((event, index) => ({
    id: index,
    start: event.time,
    content: event.description,
    type: 'point',
  }));

  const options = {
    width: '100%',
    height: '200px',
  };

  return {
    items,
    options,
    start: state.microcontroller.replay.start,
    end: state.microcontroller.replay.end,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);

