import Microcontroller from '../components/Microcontroller';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { values } from 'ramda';

function mapStateToProps(state) {
  return {
    pins: values(state.microcontroller.pins),
    connectionState: state.microcontroller.connectionState,
    mapping: state.microcontroller.mapping,
    name: state.microcontroller.name,
    filter: state.microcontroller.filter,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Microcontroller);
