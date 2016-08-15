import React, { Component, PropTypes } from 'react';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import { intersection, contains, propOr } from 'ramda';
import DigitalInput from './Pin/DigitalInput';
import AnalogInput from './Pin/AnalogInput';
import DigitalOutput from './Pin/DigitalOutput';
import AnalogOutput from './Pin/AnalogOutput';
import FontAwesome from 'react-fontawesome';
import Link from './Link';
import './Pin.sass';

export default class Pin extends Component {
  static propTypes = {
    pin: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
    digitalWrite: PropTypes.func.isRequired,
    analogWrite: PropTypes.func.isRequired,
  };

  render() {
    const {
      changeMode,
      setEnabled,
      digitalWrite,
      analogWrite,
      pin
    } = this.props;
    const { id, mode, name, values, enabled } = pin;

    const supportedModes = intersection(
      pin.supportedModes,
      Object.keys(MODE_NAMES).map(k => parseInt(k, 10))
    );
    const getModeDescriptionForModeNumber = (num) => propOr('Not Set', num, MODE_NAMES);

    const modeSelector = (
      <div>
        Mode:
        <select
          value={pin.mode}
          onChange={event => changeMode(pin, event.target.value)}
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

    const pinClass = pin.isAnalogPin ? 'pin pin--analog' : 'pin pin--digital';

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
            <FontAwesome name="minus-square" /> Hide
          </Link>
        );
      }
      return (
        <Link className="" onClick={() => setEnabled(pin.id, true)}>
          <FontAwesome name="plus-square" /> Show
        </Link>
      );
    };


    const digitalIcons = () => {
      if (contains(MODES.INPUT, supportedModes) && contains(MODES.OUTPUT, supportedModes)) {
        return (
          <div key="digital" className="pin__tag">
            Digital In / Out
          </div>
        );
      } else if (contains(MODES.INPUT, supportedModes)) {
        return (
          <div key="digital" className="pin__tag">
            Digital In
          </div>
        );
      } else if (contains(MODES.OUTPUT, supportedModes)) {
        return (
          <div key="digital" className="pin__tag">
            Digital Out
          </div>
        );
      }
    };

    const analogIcons = () => {
      console.log(supportedModes);
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
