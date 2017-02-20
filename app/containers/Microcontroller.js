import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Microcontroller from '../components/Microcontroller';
import * as MicrocontrollerActions from '../actions/microcontroller';
import * as VisibilityFilterActions from '../actions/visibilityFilter';

function mapStateToProps(state) {
  return {
    connectionState: state.connectionState,
    visibilityFilter: state.visibilityFilter,
    replay: state.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, MicrocontrollerActions, VisibilityFilterActions), dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Microcontroller);
