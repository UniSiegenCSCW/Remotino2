import * as five from 'johnny-five';
import { values, mapObjIndexed, invertObj, has, contains } from 'ramda';
import Serial from 'serialport';
import Firmata from 'firmata';
import { MODES } from '../reducers/microcontrollerEnums';
import identify from '../utils/boards';
import { timestamp } from '../utils/utils';
import { addReplayEvent } from './replay';

let board;
const boards = {};
const sensors = {};
let outputTimer = null;
const enabledOutputPins = [];

export const CHANGE_VALUE = 'CHANGE_VALUE';
export function changeValue(id, value) {
  return {
    type: CHANGE_VALUE,
    id,
    value,
    timestamp: timestamp(),
  };
}

export const DIGITAL_WRITE = 'DIGITAL_WRITE';
export const ANALOG_WRITE = 'ANALOG_WRITE';
export const DETECTED_PORT = 'DETECTED_PORT';
export const REJECTED_PORT = 'REJECTED_PORT';
export const REFRESHING_PORTS = 'REFRESHING_PORTS';
export function detectPorts() {
  return (dispatch) => {
    Serial.list((_err, result) => {
      // This will never return an error, only an empty list
      const ports = result.filter(port => /usb|acm|^com/i.test(port.comName));

      dispatch({ type: REFRESHING_PORTS, count: ports.length });

      ports.forEach((port) => {
        // flag to signal the timeout if a board was found
        let boardDetected = false;
        // Before connecting with johnny-five we connect with
        // firmata. Reason for that is, that we can close the
        // serialport on firmata without any trouble. Johnny-five
        // has no close function and would only crash.
        // Closed port is needed for potential flashing of non
        // firmata boards. Johnny-five would block the port
        // even without firmata on the arduino.
        const firmata = new Firmata.Board(port.comName);
        firmata.on('ready', () => {
          // Checking the pins of connected port to determin which
          // board is connecting.
          const mapping = identify(firmata);
          // store mapping for later
          boards[port.comName] = { mapping };
          // Found a board. Dispatching the good news.
          dispatch({
            type: DETECTED_PORT,
            path: port.comName,
            name: mapping.name || port.comName,
            image: mapping.image,
          });
          // Set the found flag.
          boardDetected = true;
          // Close serialport so johnny can connect later.
          firmata.transport.close();
        });
        // Timeout of the board detecting. Firmata doesn't emit
        // an event in case of no firmata is found on board.
        setTimeout(() => {
          // Checking if a board was found during timeout.
          if (!boardDetected) {
            // Dispatching no board was found.
            dispatch({
              type: REJECTED_PORT,
              port: port.comName,
            });
            // Close port for possible flashing.
            firmata.transport.close();
          }
        // Timeout is 15 seconds.
        }, 15000);
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
    // Connecting with johnny-five
    board = new five.Board({ port: port.comName, repl: false });
    board.on('ready', () => {
      // onReady store the board
      boards[port.comName] = { board };
      // Dispatch successfull connect.
      dispatch(connectedToBoard());

      const actions = values(mapObjIndexed(updatePinFromObj, board.io.pins));
      dispatch(updatePins(actions));

      if (boards[port].mapping) dispatch(identifiedBoard(boards[port].mapping));
    });
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

export const CHANGE_MODE = 'CHANGE_MODE';
export function changeMode(pin, mode) {
  return (dispatch) => {
    const pinMode = parseInt(mode, 10);
    const pinId = parseInt(pin.id, 10);

    // Disable old outputs if switching back to "not set"
    if (pinMode === MODES.NOT_SET) {
      const oldMode = pin.mode;
      if (oldMode === MODES.OUTPUT) board.digitalWrite(pinId, 0);
      else if (oldMode === MODES.PWM) board.analogWrite(pinId, 0);
    }

    for (let i = 0; i < enabledOutputPins.length; i += 1) {
      if (enabledOutputPins[i].id === pinId) {
        enabledOutputPins.splice(i, 1);
        break;
      }
    }

    if (enabledOutputPins.length === 0) {
      clearInterval(outputTimer);
      outputTimer = null;
    }

    // Set new mode
    board.pinMode(pinId, mode);

    dispatch({
      type: CHANGE_MODE,
      id: pinId,
      mode: pinMode,
    });

//    if (replay) {
//      dispatch(addReplayEvent({ type: CHANGE_MODE, pin, id: pin.id, mode, name },
//                              `Mode = ${MODE_NAMES[mode]}`));
//    }

    // Disable the old listener
    if (sensors[pinId]) sensors[pinId].disable();

    // Create new listeners
    if (pinMode === MODES.ANALOG) {
      const sensor = new five.Sensor({ pin: pin.analogChannel, freq: 200 });
      sensor.on('data', function onChange() {
        dispatch(pinValueChanged(pinId, this.fscaleTo([0, 255])));
      });

      sensors[pinId] = sensor;
    } else if (pinMode === MODES.INPUT) {
      const sensor = new five.Sensor.Digital({ pin: pinId, freq: 200 });
      sensor.on('data', function onChange() {
        dispatch(pinValueChanged(pinId, this.value));
      });

      sensors[pinId] = sensor;
    } else if (pinMode === MODES.OUTPUT || pinMode === MODES.PWM) {
      enabledOutputPins.push({
        id: pinId,
        value: 0
      });
      // set the initial replay event
      if (pinMode === MODES.OUTPUT) {
        dispatch(addReplayEvent({ type: DIGITAL_WRITE, pinId, value: 0 }));
      } else if (pinMode === MODES.PWM) {
        dispatch(addReplayEvent({ type: ANALOG_WRITE, pinId, value: 0 }));
      }
    }

    if (enabledOutputPins.length !== 0 && outputTimer === null) {
      outputTimer = setInterval(() => {
        for (let i = 0; i < enabledOutputPins.length; i += 1) {
          dispatch(changeValue(enabledOutputPins[i].id, enabledOutputPins[i].value));
        }
      }, 200);
    }
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

export function digitalWrite(id, value) {
  const pinId = parseInt(id, 10);
  board.digitalWrite(pinId, value);

  for (let i = 0; i < enabledOutputPins.length; i += 1) {
    if (enabledOutputPins[i].id === pinId) {
      enabledOutputPins[i].value = value;
      break;
    }
  }

  return (dispatch) => {
    dispatch(changeValue(pinId, value));
    dispatch(addReplayEvent({ type: DIGITAL_WRITE, pinId, value }));
  };
}


export function analogWrite(id, value) {
  const pinId = parseInt(id, 10);
  const output = parseInt(value, 10);

  board.analogWrite(pinId, output);

  for (let i = 0; i < enabledOutputPins.length; i += 1) {
    if (enabledOutputPins[i].id === pinId) {
      enabledOutputPins[i].value = output;
      break;
    }
  }

  return (dispatch) => {
    dispatch(changeValue(pinId, output));
    dispatch(addReplayEvent({ type: ANALOG_WRITE, pinId, value }));
  };
}
