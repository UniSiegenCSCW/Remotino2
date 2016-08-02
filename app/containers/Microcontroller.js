import Microcontroller from '../components/Microcontroller';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { values } from 'ramda';

const getVisiblePins = (inPins, filter) => {
  let pins = inPins;

  pins = pins.filter(
    pin => (pin.enabled || filter.showDisabled)
  );

  if (!filter.showDigital) {
    pins = pins.filter(pin => pin.isAnalogPin);
  }

  if (!filter.showAnalog) {
    pins = pins.filter(pin => !pin.isAnalogPin);
  }

  return pins;
};

function mapStateToProps(state) {
  return {
    pins: getVisiblePins(
              values(state.pins),
              state.visibilityFilter
          ),
    connectionState: state.connectionState,
    mapping: state.mapping,
    name: state.name,
    visibilityFilter: state.visibilityFilter,
    replay: state.replay,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Microcontroller);
