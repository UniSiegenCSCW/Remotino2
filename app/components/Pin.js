import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { intersection, contains } from 'ramda';
import Translate from 'react-translate-component';
import SyntaxHighlighter from 'react-syntax-highlighter';
import '../utils/l10n.js';
import { MODE_NAMES, MODES } from '../reducers/microcontrollerEnums';
import { getCode } from '../utils/ino';
import DigitalInput from './Pin/DigitalInput';
import AnalogInput from './Pin/AnalogInput';
import DigitalOutput from './Pin/DigitalOutput';
import AnalogOutput from './Pin/AnalogOutput';
import Link from './Link';
import './Pin.sass';

const Pin = props => {
  const {
    changeMode,
    setEnabled,
    setShowingCode,
    digitalWrite,
    analogWrite,
    pin,
    scrollIntoView,
  } = props;
  const { id, mode, name, values, enabled, showingCode, min, max } = pin;

  const supportedModes = intersection(
    pin.supportedModes,
    Object.keys(MODE_NAMES).map(k => parseInt(k, 10))
  );

  const MODE_NAMES_TRANSLATED = {
    0: <Translate content="microcontroller.digital_in" component="option" key="0" value="0" />,
    1: <Translate content="microcontroller.digital_out" component="option" key="1" value="1" />,
    2: <Translate content="microcontroller.analog_in" component="option" key="2" value="2" />,
    3: <Translate content="microcontroller.analog_out" component="option" key="3" value="3" />,
    16: <Translate content="microcontroller.not_set" component="option" key="16" value="16" />,
  };

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
        {supportedModes.map((supportedMode) => MODE_NAMES_TRANSLATED[supportedMode])}
      </select>
    </div>
  );

  let pinClass = 'pin';
  pinClass += ` pin--${pin.isAnalogPin ? 'analog' : 'digital'}`;
  if (!enabled) pinClass += ' pin--disabled';

  let controls = null;
  switch (mode) {
    case MODES.INPUT:
      controls = <DigitalInput values={values} />;
      break;
    case MODES.ANALOG:
      controls = <AnalogInput values={values} min={min} max={max} />;
      break;
    case MODES.OUTPUT:
      controls = <DigitalOutput write={val => digitalWrite(id, val, name)} value={pin.value} />;
      break;
    case MODES.PWM:
      controls = <AnalogOutput write={val => analogWrite(id, val, name)} value={pin.value} />;
      break;
    default:
      controls = null;
  }

  const iconsForTag = (type, tags) => (
    (tags !== '') ?
      <div key={type} className="pin__tag">
        <Translate content={`microcontroller.${type}${tags}`} />
      </div> : null
  );

  let digitalTag = '';
  if (contains(MODES.INPUT, supportedModes)) digitalTag += '_in';
  if (contains(MODES.OUTPUT, supportedModes)) digitalTag += '_out';

  let analogTag = '';
  if (contains(MODES.ANALOG, supportedModes)) analogTag += '_in';
  if (contains(MODES.PWM, supportedModes)) analogTag += '_out';

  const code = getCode(pin);
  const codeElem = (
    code !== '' ? <SyntaxHighlighter language="cpp">{code}</SyntaxHighlighter> : null
  );

  return (
    <div className={pinClass}>
      <div className="pin__header">
        <div className="pin__header__left">
          <h2 className="pin__name">{name}</h2>
          {iconsForTag('digital', digitalTag)}
          {iconsForTag('analog', analogTag)}
        </div>
        <div className="pin__header__right">
          <Link onClick={() => setShowingCode(pin.id, !showingCode)} icon="code" />
          <Link
            className="visibility-controls" onClick={() => setEnabled(pin.id, !enabled)}
            icon={enabled ? 'minus-square' : 'plus-square'}
            content={enabled ? 'pin.hide' : 'pin.show'}
          />
        </div>
      </div>
      <div className="pin__settings">{modeSelector}</div>
      <div className="pin__controls">{showingCode ? codeElem : controls}</div>
    </div>
  );
};

Pin.propTypes = {
  pin: PropTypes.object.isRequired,
  changeMode: PropTypes.func.isRequired,
  setEnabled: PropTypes.func.isRequired,
  setShowingCode: PropTypes.func.isRequired,
  digitalWrite: PropTypes.func.isRequired,
  analogWrite: PropTypes.func.isRequired,
  scrollIntoView: PropTypes.func.isRequired,
};

export default Pin;
