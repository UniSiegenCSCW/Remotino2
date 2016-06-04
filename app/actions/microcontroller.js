import * as five from 'johnny-five';
import { forEach, keys, mapObjIndexed, length, invertObj, has, contains } from 'ramda';
import { MODES } from '../reducers/microcontrollerEnums';
import { identify } from '../utils/boards';
import { timestamp } from '../utils/utils';

let board;

export const UPDATE_PIN = 'UPDATE_PIN';
export function updatePin(id, mode, value, report, analogChannel, supportedModes, isHWSerialPort,
                          isSWSerialPort, isAnalogPin) {
  return {
    type: UPDATE_PIN,
    id,
    mode,
    value,
    report,
    analogChannel,
    supportedModes,
    isHWSerialPort,
    isSWSerialPort,
    isAnalogPin,
  };
}

export const CONNECTING_TO_BOARD = 'CONNECTING_TO_BOARD';
export function connectingToBoard() {
  return {
    type: CONNECTING_TO_BOARD,
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

export function connectToBoard() {
  const updatePinFromObj = (obj, id) => {
    const serialPorts = invertObj(board.io.SERIAL_PORT_IDs);
    const analogPins = board.io.analogPins;
    const idNumber = parseInt(id, 10);
    return Object.assign({}, obj, {
      id,
      type: UPDATE_PIN,
      supportedModes: [16, ...obj.supportedModes],
      mode: 16,
      isAnalogPin: contains(idNumber, analogPins),
      isHWSerialPort: has(idNumber, serialPorts) && serialPorts[idNumber].startsWith('HW'),
      isSWSerialPort: has(idNumber, serialPorts) && serialPorts[idNumber].startsWith('SW'),
    });
  };

  const actionsFromPins = (pins) => {
    const arrLength = length(keys(pins));
    const actions = mapObjIndexed(updatePinFromObj, pins);
    actions.length = arrLength;
    return Array.from(actions);
  };

  return (dispatch) => {
    dispatch(connectingToBoard());
    board = new five.Board({ repl: false });
    board.on('ready', () => {
      dispatch(connectedToBoard());

      const mapping = identify(board);
      if (mapping) {
        dispatch(identifiedBoard(mapping));
      }
      const actions = actionsFromPins([...board.io.pins]);
      forEach(dispatch, actions);
    });
  };
}

export const CHANGE_MODE = 'CHANGE_MODE_PIN';
export function changeMode(id, mode) {
  board.pinMode(id, mode);
  return {
    type: CHANGE_MODE,
    id,
    mode: parseInt(mode, 10),
  };
}

export const START_LISTENING_TO_PIN_CHANGES = 'START_LISTENING_TO_PIN_CHANGES';
export function startListeningToPinChanges(id) {
  return {
    type: START_LISTENING_TO_PIN_CHANGES,
    id,
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

export function listenToPinChanges(id, mode, name) {
  return (dispatch) => {
    const pinId = parseInt(id, 10);
    dispatch(startListeningToPinChanges(pinId));
    const pinListener = (value) => dispatch(pinValueChanged(pinId, value));
    if (mode === MODES.ANALOG) {
      const sensor = new five.Sensor({ pin: name, freq: 200 });
      sensor.on('data', function onChange() {
        dispatch(pinValueChanged(pinId, this.fscaleTo([0, 100])));
      });
    } else if (mode === MODES.INPUT) {
      board.digitalRead(pinId, pinListener);
    }
  };
}
