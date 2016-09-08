import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { intersection, contains } from 'ramda';
import FontAwesome from 'react-fontawesome';
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

export default class Pin extends Component {
  static propTypes = {
    pin: PropTypes.object.isRequired,
    changeMode: PropTypes.func.isRequired,
    setEnabled: PropTypes.func.isRequired,
    setShowingCode: PropTypes.func.isRequired,
    digitalWrite: PropTypes.func.isRequired,
    analogWrite: PropTypes.func.isRequired,
    scrollIntoView: PropTypes.func.isRequired,
  };

  render() {
    const {
      changeMode,
      setEnabled,
      setShowingCode,
      digitalWrite,
      analogWrite,
      pin,
      scrollIntoView,
    } = this.props;
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
              <AnalogInput values={values} min={min} max={max} />
            </div>
          );
        case MODES.OUTPUT:
          return (
            <div className="pin__controls">
              <DigitalOutput write={(value) => digitalWrite(id, value, name)} value={pin.value} />
            </div>
          );
        case MODES.PWM:
          return (
            <div className="pin__controls">
              <AnalogOutput write={(value) => analogWrite(id, value, name)} value={pin.value} />
            </div>
          );
        default:
          return <div></div>;
      }
    };

    const visibilityControls = enabled ?
      <Link className="" onClick={() => setEnabled(pin.id, false)}>
        <FontAwesome name="minus-square" /> <Translate content="pin.hide" />
      </Link> :
      <Link className="" onClick={() => setEnabled(pin.id, true)}>
        <FontAwesome name="plus-square" /> <Translate content="pin.show" />
      </Link>;


    let digitalTag = 'microcontroller.digital';
    if (contains(MODES.INPUT, supportedModes)) {
      digitalTag += '_in';
    }
    if (contains(MODES.OUTPUT, supportedModes)) {
      digitalTag += '_out';
    }
    const digitalIcons =
    (contains(MODES.INPUT, supportedModes) || contains(MODES.OUTPUT, supportedModes)) ?
      <div key="digital" className="pin__tag">
        <Translate content={digitalTag} />
      </div> :
      null;

    let analogTag = 'microcontroller.analog';
    if (contains(MODES.ANALOG, supportedModes)) {
      analogTag += '_in';
    }
    if (contains(MODES.PWM, supportedModes)) {
      analogTag += '_out';
    }
    const analogIcons =
    (contains(MODES.ANALOG, supportedModes) || contains(MODES.PWM, supportedModes)) ?
      <div key="analog" className="pin__tag">
        <Translate content={analogTag} />
      </div> :
      null;

    const body = (showingCode_) => {
      if (showingCode_) {
        return (
          <div className="pin__controls">
            <SyntaxHighlighter language="cpp">
              {getCode(pin)}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        return pinControls(mode);
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
            {digitalIcons}
            {analogIcons}
          </div>
          <div className="pin__header__right">
            <Link onClick={() => setShowingCode(pin.id, !showingCode)}>
              <FontAwesome name="code" />
            </Link>
            {visibilityControls}
          </div>
        </div>
        <div className="pin__settings">
          {modeSelector}
        </div>
        {body(showingCode)}
      </div>
    );
  }
}
