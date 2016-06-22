import ImportExport from '../components/ImportExport';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
  return {
    pins: state.microcontroller.pins,
    visibilityFilter: state.microcontroller.visibilityFilter,
    replay: state.microcontroller.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportExport);
