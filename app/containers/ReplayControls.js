import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReplayControls from '../components/ReplayControls';
import * as MicrocontrollerActions from '../actions/microcontroller';

function mapStateToProps(state) {
  return {
    replay: state.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplayControls);
