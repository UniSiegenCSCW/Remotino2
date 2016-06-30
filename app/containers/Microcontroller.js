import Microcontroller from '../components/Microcontroller';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { values } from 'ramda';

const getVisiblePins = (inPins, filter) => {
  let pins = inPins;

  if (!filter.showDisabled) {
    pins = pins.filter(pin => pin.enabled);
  }

  if (!filter.showDigital) {
    pins = pins.filter(pin => pin.isAnalogPin);
  }

  if (!filter.showAnalog) {
    pins = pins.filter(pin => pin.isAnalogPin);
  }

  return pins;
};

function mapStateToProps(state) {
  return {
    pins: getVisiblePins(
              values(state.microcontroller.pins),
              state.microcontroller.visibilityFilter
          ),
    connectionState: state.microcontroller.connectionState,
    mapping: state.microcontroller.mapping,
    name: state.microcontroller.name,
    visibilityFilter: state.microcontroller.visibilityFilter,
    replay: state.microcontroller.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Microcontroller);
