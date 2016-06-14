import ReplayControls from '../components/ReplayControls';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return {
    replay: state.microcontroller.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplayControls);
