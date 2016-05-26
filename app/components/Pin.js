import React, {Component, PropTypes} from 'react';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import { filter, propOr, ifElse} from 'ramda';
import styles from './Pin.sass';

export default class Pin extends Component {
  static propTypes = {
    pin: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    listen:PropTypes.func.isRequired
  };

  render() {
    const {changeMode, listen, pin} = this.props;
    const {id, mode, value, report} = pin;
    const supportedModes = filter((mode) => MODE_NAMES[mode] !== undefined, pin.supportedModes);
    const getModeDescriptionForModeNumber = (num) => propOr("Not Set", num, MODE_NAMES);
    const modeSelector = (id, mode, supportedModes) => (
      <select defaultValue="{mode}" onChange={(event)=> changeMode(id,event.target.value)}
              disabled={supportedModes.length == 0}>
        { supportedModes.map((supportedMode)=> (
            <option key={supportedMode} value={supportedMode}>{getModeDescriptionForModeNumber(supportedMode)}</option>
          )
        )}
      </select>
    );

    const pinClass = "pin " + (pin.isAnalogPin ? "pin--analog" : "pin--digital");

    let tags = [];
    if (pin.isHWSerialPort) {
      tags.push("Hardware Serialport");
    }
    if (pin.isSWSerialPort) {
      tags.push("Software Serialport");
    }
    if (pin.isAnalogPin) {
      tags.push("Analog Pin");
    }

    return (
      <div className={pinClass}>
        <div className="pin__header">
          <h2 className="pin__name">Pin {id}</h2>
          {tags.map((tag) =>
            <div className="pin__tag">{tag}</div>
          )}
        </div>
        <div className="pin__body">
          Value: {value}, Reporting: {report}, {modeSelector(id, mode, supportedModes)}

          {ifElse(()=>pin.mode === MODES.INPUT || pin.mode === MODES.ANALOG,
            ()=><span className="btn--blue btn--s px1 mx1" onClick={()=> listen(pin.id, pin.mode)}>Listen</span>,
            ()=><span>{pin.mode} {MODES.ANALOG}</span>)()}
        </div>
      </div>
    );
  }
}
