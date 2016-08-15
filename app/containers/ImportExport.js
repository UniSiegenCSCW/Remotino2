import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImportExport from '../components/ImportExport';
import * as MicrocontrollerActions from '../actions/microcontroller';

function mapStateToProps(state) {
  return {
    pins: state.pins,
    visibilityFilter: state.visibilityFilter,
    replay: state.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportExport);
