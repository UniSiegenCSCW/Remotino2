import React, { Component, PropTypes } from 'react';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import { intersection, propOr, ifElse } from 'ramda';
import styles from './Pin.sass'; // eslint-disable-line no-unused-vars

export default class Pin extends Component {
  static propTypes = {
    pin: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    listen: PropTypes.func.isRequired
  };

  render() {
    const { changeMode, listen, pin } = this.props;
    const { id, mode, value, report } = pin;
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

    const tags = [];
    if (pin.isHWSerialPort) {
      tags.push('Hardware Serialport');
    }
    if (pin.isSWSerialPort) {
      tags.push('Software Serialport');
    }
    if (pin.isAnalogPin) {
      tags.push('Analog Pin');
    }

    return (
      <div className={pinClass}>
        <div className="pin__header">
          <h2 className="pin__name">Pin {id}</h2>
          {tags.map((tag) =>
            <div key={tag} className="pin__tag">{tag}</div>
          )}
        </div>
        <div className="pin__body">
          Value: {value}, Reporting: {report}, {modeSelector}

          {ifElse(() => mode === MODES.INPUT || mode === MODES.ANALOG,
            () =>
              <span className="btn--blue btn--s px1 mx1" onClick={() => listen(id, mode)}>
                Listen
              </span>,
            () =>
              <span>
                {mode} {MODES.ANALOG}
              </span>)()}
        </div>
      </div>
    );
  }
}
