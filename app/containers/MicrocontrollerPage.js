import Microcontroller from '../components/Microcontroller';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { values } from 'ramda';

const getVisiblePins = (pins, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return pins;
    case 'SHOW_DIGITAL':
      return pins.filter(pin => !pin.isAnalogPin);
    case 'SHOW_ANALOG':
      return pins.filter(pin => pin.isAnalogPin);
    case 'SHOW_ENABLED':
      return pins.filter(pin => pin.enabled);
    default:
      return [];
  }
};

function mapStateToProps(state) {
  return {
    pins: getVisiblePins(values(state.microcontroller.pins),
              state.microcontroller.visibilityFilter),
    connectionState: state.microcontroller.connectionState,
    mapping: state.microcontroller.mapping,
    name: state.microcontroller.name,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Microcontroller);
