import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { intersection, contains, propOr } from 'ramda';
import FontAwesome from 'react-fontawesome';
import Translate from 'react-translate-component';
import '../utils/l10n.js';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import DigitalInput from './Pin/DigitalInput';
import AnalogInput from './Pin/AnalogInput';
import DigitalOutput from './Pin/DigitalOutput';
import AnalogOutput from './Pin/AnalogOutput';
import Link from './Link';
import './Pin.sass';

export default class Pin extends Component {
  static propTypes = {
    pin: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
    digitalWrite: PropTypes.func.isRequired,
    analogWrite: PropTypes.func.isRequired,
    scrollIntoView: PropTypes.func.isRequired,
  };

  render() {
    const {
      changeMode,
      setEnabled,
      digitalWrite,
      analogWrite,
      pin,
      scrollIntoView,
    } = this.props;
    const { id, mode, name, values, enabled } = pin;

    const supportedModes = intersection(
      pin.supportedModes,
      Object.keys(MODE_NAMES).map(k => parseInt(k, 10))
    );

    const MODE_NAMES_TRANSLATED = {
      0: <Translate content="microcontroller.digital_in" />,
      1: <Translate content="microcontroller.digital_out" />,
      2: <Translate content="microcontroller.analog_in" />,
      3: <Translate content="microcontroller.analog_out" />,
      16: <Translate content="microcontroller.not_set" />,
    };

    const getModeDescriptionForModeNumber = (num) => propOr('Not Set', num, MODE_NAMES_TRANSLATED);

    const modeSelector = (
      <div>
        <Translate content="pin.mode" />:
        <select
          value={pin.mode}
          onChange={event => {
            // TODO: find a way to do this without using timeouts
            setTimeout(() => scrollIntoView(ReactDOM.findDOMNode(this)), 300);
            changeMode(pin, event.target.value);
          }}
          disabled={supportedModes.length === 0}
        >
          {supportedModes.map((supportedMode) => (
            <option key={supportedMode} value={supportedMode}>
              {getModeDescriptionForModeNumber(supportedMode)}
            </option>
            )
          )}
        </select>
      </div>
    );

    let pinClass = 'pin';
    if (pin.isAnalogPin) {
      pinClass += ' pin--analog';
    } else {
      pinClass += ' pin--digital';
    }
    if (!enabled) {
      pinClass += ' pin--disabled';
    }

    const pinControls = () => {
      switch (mode) {
        case MODES.INPUT:
          return (
            <div className="pin__controls">
              <DigitalInput values={values} />
            </div>
          );
        case MODES.ANALOG:
          return (
            <div className="pin__controls">
              <AnalogInput values={values} />
            </div>
          );
        case MODES.OUTPUT:
          return (
            <div className="pin__controls">
              <DigitalOutput write={(value) => digitalWrite(id, value, name)} />
            </div>
          );
        case MODES.PWM:
          return (
            <div className="pin__controls">
              <AnalogOutput write={(value) => analogWrite(id, value, name)} />
            </div>
          );
        default:
          return <div></div>;
      }
    };

    const visibilityControls = (e) => {
      if (e) {
        return (
          <Link className="" onClick={() => setEnabled(pin.id, false)}>
            <FontAwesome name="minus-square" /> <Translate content="pin.hide" />
          </Link>
        );
      } else {
        return (
          <Link className="" onClick={() => setEnabled(pin.id, true)}>
            <FontAwesome name="plus-square" /> <Translate content="pin.show" />
          </Link>
        );
      }
    };

    const digitalIcons = () => {
      if (contains(MODES.INPUT, supportedModes) && contains(MODES.OUTPUT, supportedModes)) {
        return (
          <div key="digital" className="pin__tag">
            <Translate content="microcontroller.digital_in_out" />
          </div>
        );
      } else if (contains(MODES.INPUT, supportedModes)) {
        return (
          <div key="digital" className="pin__tag">
            <Translate content="microcontroller.digital_in" />
          </div>
        );
      } else if (contains(MODES.OUTPUT, supportedModes)) {
        return (
          <div key="digital" className="pin__tag">
            <Translate content="microcontroller.digital_out" />
          </div>
        );
      }

      return null;
    };

    const analogIcons = () => {
      if (contains(MODES.ANALOG, supportedModes) && contains(MODES.PWM, supportedModes)) {
        return (
          <div key="analog" className="pin__tag">
            Analog In / Out
          </div>
        );
      } else if (contains(MODES.ANALOG, supportedModes)) {
        return (
          <div key="analog" className="pin__tag">
            Analog In
          </div>
        );
      } else if (contains(MODES.PWM, supportedModes)) {
        return (
          <div key="analog" className="pin__tag">
            Analog Out
          </div>
        );
      }

      return null;
    };

    // {filteredCategories.map((category) =>
    //   <div key={category} className="pin__tag">{category}</div>
    // )}
    return (
      <div className={pinClass}>
        <div className="pin__header">
          <div className="pin__header__left">
            <h2 className="pin__name">{name}</h2>
            {digitalIcons()}
            {analogIcons()}
          </div>
          <div className="pin__header__right">
            {visibilityControls(enabled)}
          </div>
        </div>
        <div className="pin__settings">
          {modeSelector}
        </div>
        {pinControls(mode)}
      </div>
    );
  }
}
