import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImportExport from '../components/ImportExport';
import * as MicrocontrollerActions from '../actions/microcontroller';
import * as ReplayActions from '../actions/replay';

function mapStateToProps(state) {
  return {
    pins: state.pins,
    visibilityFilter: state.visibilityFilter,
    replay: state.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign(MicrocontrollerActions, ReplayActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportExport);
