import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { contains, intersection, values } from 'ramda';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import PinList from '../components/PinList';
import * as MicrocontrollerActions from '../actions/microcontroller';

const getVisiblePins = (inPins, filter) => {
  let pins = inPins;

  // Filter out all pins that don't have any supported modes
  // and all pins that belong to the 'Serial' categorie, e.g. TX1, RX1, etc,
  // because these might be confusing for the user
  pins = pins.filter(
    pin => {
      const supportedModes = intersection(
        pin.supportedModes,
        Object.keys(MODE_NAMES).map(k => parseInt(k, 10))
      );
      return supportedModes.length > 1 && !contains('Serial', pin.categories);
    }
  );

  pins = pins.filter(
    pin => (pin.enabled || filter.showDisabled)
  );

  pins = pins.filter(pin => ((filter.showDigitalIn && contains(MODES.INPUT, pin.supportedModes)) ||
                           (filter.showDigitalOut && contains(MODES.OUTPUT, pin.supportedModes)) ||
                           (filter.showAnalogIn && contains(MODES.ANALOG, pin.supportedModes)) ||
                           (filter.showAnalogOut && contains(MODES.PWM, pin.supportedModes))));

  return pins;
};

function mapStateToProps(state) {
  return {
    pins: getVisiblePins(values(state.pins), state.visibilityFilter)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PinList);
