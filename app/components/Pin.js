import React, {Component, PropTypes} from 'react';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import { filter, propOr, ifElse} from 'ramda';

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
    return <li>
      {id} - Value: {value}, Reporting: {report}, {modeSelector(id, mode, supportedModes)}
      {ifElse(()=>pin.isHWSerialPort,()=><span className="bg--blue px1 mx1">Hardware Serialport</span>,()=><span/>)()}
      {ifElse(()=>pin.isSWSerialPort, ()=><span className="bg--blue px1 mx1">Software Serialport</span>,()=><span/>)()}
      {ifElse(()=>pin.isAnalogPin,()=><span className="bg--green px1 mx1">Analog Pin</span>,()=><span/>)()}
      {ifElse(()=>pin.mode === MODES.INPUT || pin.mode === MODES.ANALOG,
        ()=><span className="btn--blue btn--s px1 mx1" onClick={()=> listen(pin.id, pin.mode)}>Listen</span>,
        ()=><span>{pin.mode} {MODES.ANALOG}</span>)()}
    </li>;
  }
}
