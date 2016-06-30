import React, { Component, PropTypes } from 'react';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import { intersection, propOr } from 'ramda';
import DigitalInput from './Pin/DigitalInput';
import AnalogInput from './Pin/AnalogInput';
import DigitalOutput from './Pin/DigitalOutput';
import AnalogOutput from './Pin/AnalogOutput';
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
    const { id, mode, name, categories, values } = pin;

    const supportedModes = intersection(
      pin.supportedModes,
      Object.keys(MODE_NAMES).map(k => parseInt(k, 10))
    );
    const getModeDescriptionForModeNumber = (num) => propOr('Not Set', num, MODE_NAMES);

    const modeSelector = (
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

    return (
      <div className={pinClass}>
        <div className="pin__header">
          <h2 className="pin__name">{name}</h2>
          {categories.map((category) =>
            <div key={category} className="pin__tag">{category}</div>
          )}
        </div>
        <div className="pin__settings">
          <input
            type="checkbox"
            name="Enabled"
            checked={pin.showDisabled}
            onChange={(e) => setEnabled(pin.id, e.target.checked)}
          />
          Enabled
          {modeSelector}
        </div>
        {pinControls(mode)}
      </div>
    );
  }
}
