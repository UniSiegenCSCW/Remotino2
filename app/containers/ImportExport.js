import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImportExport from '../components/ImportExport';
import * as MicrocontrollerActions from '../actions/microcontroller';
import * as VisibilityFilterActions from '../actions/visibilityFilter';
import * as ReplayActions from '../actions/replay';

function mapStateToProps(state) {
  return {
    pins: state.pins,
    visibilityFilter: state.visibilityFilter,
    replay: state.replay,
    ui: state.ui,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, MicrocontrollerActions, ReplayActions, VisibilityFilterActions), dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportExport);
