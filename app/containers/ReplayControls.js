import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReplayControls from '../components/ReplayControls';
import * as MicrocontrollerActions from '../actions/microcontroller';
import * as ReplayActions from '../actions/replay';

function mapStateToProps(state) {
  return {
    replay: state.replay,
    ui: state.ui,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(MicrocontrollerActions, ReplayActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplayControls);
