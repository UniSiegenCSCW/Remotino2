import * as five from 'johnny-five';
import { values, mapObjIndexed, invertObj, has, contains } from 'ramda';
import Serial from 'serialport';
import { MODES, MODE_NAMES } from '../reducers/microcontrollerEnums';
import { identify } from '../utils/boards';
import { timestamp } from '../utils/utils';
import { addReplayEvent } from './replay';

let board;
const boards = {};
const sensors = {};

export const CHANGE_VALUE = 'CHANGE_VALUE';
export function changeValue(id, value) {
  return {
    type: CHANGE_VALUE,
    id,
    value,
  };
}

export const DETECTED_PORT = 'DETECTED_PORT';
export const REJECTED_PORT = 'REJECTED_PORT';
export const REFRESHING_PORTS = 'REFRESHING_PORTS';
export function detectPorts() {
  return (dispatch) => {
    Serial.list((_err, result) => {
      // This will never return an error, only an empty list
      const ports = result.filter((port) => /usb|acm|^com/i.test(port.comName));

      dispatch({ type: REFRESHING_PORTS, count: ports.length });

      ports.forEach((port) => {
        try {
          const boardToIdentify = new five.Board({ port: port.comName, repl: false });
          // Ignore all errors, we are only interested in boards that work
          boardToIdentify.on('error', (err) => {
            dispatch({
              type: REJECTED_PORT,
              port: port.comName,
              err,
            });
          });
          boardToIdentify.on('ready', () => {
            const mapping = identify(boardToIdentify);
            boards[port.comName] = { board: boardToIdentify, mapping };
            dispatch({
              type: DETECTED_PORT,
              path: port.comName,
              name: mapping.name || port.comName,
              image: mapping.image,
            });
          });
        } catch (err) {
          dispatch({
            type: REJECTED_PORT,
            port: port.comName,
            err,
          });
        }
      });
    });
  };
}

export const UPDATE_PINS = 'UPDATE_PINS';
export function updatePins(pins) {
  return {
    type: UPDATE_PINS,
    pins,
  };
}

export const CONNECTED_TO_BOARD = 'CONNECTED_TO_BOARD';
export function connectedToBoard() {
  return {
    type: CONNECTED_TO_BOARD,
  };
}

export const IDENTIFIED_BOARD = 'IDENTIFIED_BOARD';
export function identifiedBoard(mapping) {
  return {
    type: IDENTIFIED_BOARD,
    pins: mapping.pins,
    name: mapping.name,
  };
}

export function connectToBoard(port) {
  const updatePinFromObj = (obj, id) => {
    const serialPorts = invertObj(board.io.SERIAL_PORT_IDs);
    const analogPins = board.io.analogPins;
    const idNumber = parseInt(id, 10);
    return Object.assign({}, obj, {
      id,
      supportedModes: [16, ...obj.supportedModes],
      mode: 16,
      isAnalogPin: contains(idNumber, analogPins),
      isHWSerialPort: has(idNumber, serialPorts) && serialPorts[idNumber].startsWith('HW'),
      isSWSerialPort: has(idNumber, serialPorts) && serialPorts[idNumber].startsWith('SW'),
    });
  };

  return (dispatch) => {
    board = boards[port].board;

    // Disconnect all other boards
    // values(boards).forEach((b) => {
    //   if (b.board.port !== port) {
    //     b.board.io.transport.close();
    //   }
    // });

    dispatch(connectedToBoard());

    const actions = values(mapObjIndexed(updatePinFromObj, board.io.pins));
    dispatch(updatePins(actions));

    if (boards[port].mapping) {
      dispatch(identifiedBoard(boards[port].mapping));
    }
  };
}

export const PIN_VALUE_CHANGED = 'PIN_VALUE_CHANGED';
export function pinValueChanged(id, value) {
  return {
    type: PIN_VALUE_CHANGED,
    timestamp: timestamp(),
    id,
    value,
  };
}

export const START_LISTENING_TO_PIN_CHANGES = 'START_LISTENING_TO_PIN_CHANGES';
export function startListeningToPinChanges(id) {
  return {
    type: START_LISTENING_TO_PIN_CHANGES,
    id,
  };
}

export const CHANGE_MODE = 'CHANGE_MODE';
export function changeMode(pin, mode, replay = true) {
  return (dispatch) => {
    const pinMode = parseInt(mode, 10);

    // Disable old outputs if switching back to "not set"
    if (pinMode === MODES.NOT_SET) {
      const oldMode = pin.mode;
      if (oldMode === MODES.OUTPUT) {
        board.digitalWrite(pin.id, 0);
      } else if (oldMode === MODES.PWM) {
        board.analogWrite(pin.id, 0);
      }
    }

    board.pinMode(pin.id, mode);

    dispatch({
      type: CHANGE_MODE,
      id: pin.id,
      mode: pinMode,
    });

    if (replay) {
      dispatch(addReplayEvent({ type: CHANGE_MODE, pin, id: pin.id, mode, name },
                              `${pin.name} = ${MODE_NAMES[mode]}`));
    }

    // Disable the old listener
    if (sensors[pin.id]) {
      sensors[pin.id].disable();
    }

    if (pinMode === MODES.ANALOG) {
      const sensor = new five.Sensor({ pin: pin.analogChannel, freq: 200 });
      sensor.on('data', function onChange() {
        dispatch(pinValueChanged(pin.id, this.fscaleTo([0, 100])));
      });

      sensors[pin.id] = sensor;
    } else if (pinMode === MODES.INPUT) {
      const sensor = new five.Sensor.Digital({ pin: pin.id, freq: 200 });
      sensor.on('data', function onChange() {
        dispatch(pinValueChanged(pin.id, this.value));
      });

      sensors[pin.id] = sensor;
    }
  };
}

export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
export function setVisibilityFilter(property, value) {
  return {
    type: SET_VISIBILITY_FILTER,
    property,
    value,
  };
}

export const SET_ENABLED = 'SET_ENABLED';
export function setEnabled(id, value) {
  return {
    type: SET_ENABLED,
    id,
    value,
  };
}

export const SET_SHOWING_CODE = 'SET_SHOWING_CODE';
export function setShowingCode(id, value) {
  return {
    type: SET_SHOWING_CODE,
    id,
    value,
  };
}

export const DIGITAL_WRITE = 'DIGITAL_WRITE';
export function digitalWrite(id, value, name, replay = true) {
  const pinId = parseInt(id, 10);
  board.digitalWrite(pinId, value);

  return (dispatch) => {
    dispatch(changeValue(pinId, value));
    if (replay) {
      dispatch(addReplayEvent({ type: DIGITAL_WRITE, id, value, name },
                              `${name}: Digital write ${value}`));
    }
  };
}

export const ANALOG_WRITE = 'ANALOG_WRITE';
export function analogWrite(id, value, name, replay = true) {
  const pinId = parseInt(id, 10);
  board.analogWrite(pinId, value);

  return (dispatch) => {
    dispatch(changeValue(pinId, value));
    if (replay) {
      dispatch(addReplayEvent({ type: ANALOG_WRITE, id, value, name },
                              `${name}: Analog write ${value}`));
    }
  };
}
