import React, { Component, PropTypes } from 'react';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import { intersection, propOr } from 'ramda';
import DigitalInput from './Pin/DigitalInput';
import AnalogInput from './Pin/AnalogInput';
import './Pin.sass';

export default class Pin extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    pin: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
    listen: PropTypes.func.isRequired,
    digitalWrite: PropTypes.func.isRequired,
    analogWrite: PropTypes.func.isRequired,
  };

  render() {
    const {
      changeMode,
      setEnabled,
      listen,
      digitalWrite,
      analogWrite,
      pin,
      name,
      tags
    } = this.props;
    const { id, mode, values } = pin;

    const supportedModes = intersection(
      pin.supportedModes,
      Object.keys(MODE_NAMES).map(k => parseInt(k, 10))
    );
    const getModeDescriptionForModeNumber = (num) => propOr('Not Set', num, MODE_NAMES);

    const modeSelector = (
      <select
        defaultValue="{defaultMode}"
        onChange={event => changeMode(id, event.target.value)}
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
          return <DigitalInput listen={() => listen(id, mode, name)} values={values} />;
        case MODES.ANALOG:
          return <AnalogInput listen={() => listen(id, mode, name)} values={values} />;
        case MODES.OUTPUT:
          return (
            <label className="label-switch">
              <input
                type="checkbox"
                onChange={(e) => digitalWrite(id, e.target.checked ? 1 : 0)}
              />
              <div className="checkbox"></div>
            </label>
          );
        case MODES.PWM:
          return (
            <input
              type="range"
              name="pwm"
              min="0" max="255"
              defaultValue="0"
              onChange={(e) => analogWrite(id, e.target.value)}
            />
          );
        default:
          return <div></div>;
      }
    };

    return (
      <div className={pinClass}>
        <div className="pin__header">
          <h2 className="pin__name">{name}</h2>
          {tags.map((tag) =>
            <div key={tag} className="pin__tag">{tag}</div>
          )}
        </div>
        <div className="pin__settings">
          <input
            type="checkbox"
            name="Enabled"
            checked={pin.enabled}
            onChange={(e) => setEnabled(pin.id, e.target.checked)}
          />
          Enabled
          {modeSelector}
        </div>
        <div className="pin__controls">
          {pinControls(mode)}
        </div>
      </div>
    );
  }
}
