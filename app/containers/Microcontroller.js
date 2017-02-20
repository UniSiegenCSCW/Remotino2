import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Microcontroller from '../components/Microcontroller';
import * as MicrocontrollerActions from '../actions/microcontroller';

function mapStateToProps(state) {
  return {
    connectionState: state.connectionState,
    visibilityFilter: state.visibilityFilter,
    replay: state.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Microcontroller);
